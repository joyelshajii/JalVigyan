package detector

import (
	"testing"
	"water-use-sentinel/server/models"
)

func TestDetector_FindsLeakWithoutFlaggingNormalChanges(t *testing.T) {
	household := models.HouseholdProfile{
		ID:           "HH-101",
		Name:         "Mathew Residence",
		Residents:    4,
		DwellingType: "Independent House",
		HasGarden:    false,
		WaterSource:  "KWA Municipal",
		TargetLPCD:   135.0,
	}

	det := NewDetector(household)

	// Build a 10-day history
	// Days 1-5: Normal baseline (~520 L/day, night flow = 0 L/h)
	// Day 6: Normal spike (Laundry/Cleaning: 820 L/day, night flow = 0 L/h)
	// Day 7: Normal baseline (530 L/day, night flow = 0 L/h)
	// Day 8-10: Injected toilet leak (+18 L/h 24/7 = ~950 L/day, night flow = 18 L/h)
	summaries := []models.DailySummary{
		{Date: "2026-09-01", TotalLiters: 520, MinNightFlow: 0.0},
		{Date: "2026-09-02", TotalLiters: 515, MinNightFlow: 0.0},
		{Date: "2026-09-03", TotalLiters: 540, MinNightFlow: 0.0},
		{Date: "2026-09-04", TotalLiters: 525, MinNightFlow: 0.0},
		{Date: "2026-09-05", TotalLiters: 530, MinNightFlow: 0.0},
		// Day 6: Large daytime spike (300 L extra laundry)
		{Date: "2026-09-06", TotalLiters: 830, MinNightFlow: 0.0},
		// Day 7: Returns to normal
		{Date: "2026-09-07", TotalLiters: 520, MinNightFlow: 0.0},
		// Day 8: Injected continuous leak begins
		{Date: "2026-09-08", TotalLiters: 950, MinNightFlow: 18.0},
		// Day 9: Injected continuous leak continues
		{Date: "2026-09-09", TotalLiters: 960, MinNightFlow: 18.0},
		// Day 10: Injected continuous leak continues
		{Date: "2026-09-10", TotalLiters: 955, MinNightFlow: 18.0},
	}

	analyzed, alerts := det.AnalyzeDailySummaries(summaries)

	// Verification 1: Day 6 (index 5) should be ELEVATED_NORMAL, NOT a leak!
	day6 := analyzed[5]
	if day6.Status != "ELEVATED_NORMAL" {
		t.Errorf("Expected Day 6 to be ELEVATED_NORMAL, got %s", day6.Status)
	}

	// Verification 2: Day 8 (index 7) should be LEAK_SUSPECTED or LEAK_CONFIRMED
	day8 := analyzed[7]
	if day8.Status != "LEAK_SUSPECTED" && day8.Status != "LEAK_CONFIRMED" {
		t.Errorf("Expected Day 8 to be flagged as leak, got %s", day8.Status)
	}

	// Verification 3: Day 9 & 10 should be LEAK_CONFIRMED
	day9 := analyzed[8]
	day10 := analyzed[9]
	if day9.Status != "LEAK_CONFIRMED" || day10.Status != "LEAK_CONFIRMED" {
		t.Errorf("Expected Days 9 and 10 to be LEAK_CONFIRMED, got Day9=%s, Day10=%s", day9.Status, day10.Status)
	}

	// Verification 4: Active alert must be emitted for the persistent leak
	if len(alerts) == 0 {
		t.Fatalf("Expected active AnomalyAlert to be generated for persistent night flow leak, but got none")
	}

	firstAlert := alerts[0]
	if firstAlert.Severity != "WARNING" {
		t.Errorf("Expected WARNING severity for 18 L/h leak, got %s", firstAlert.Severity)
	}
	if firstAlert.EstimatedLeakLPH < 15.0 || firstAlert.EstimatedLeakLPH > 22.0 {
		t.Errorf("Expected estimated leak rate around 18 L/h, got %.2f", firstAlert.EstimatedLeakLPH)
	}
}

func TestDetector_CohortStats(t *testing.T) {
	household := models.HouseholdProfile{
		ID:           "HH-101",
		Residents:    4,
		DwellingType: "Independent House",
		HasGarden:    false,
		WaterSource:  "KWA Municipal",
	}
	det := NewDetector(household)
	stats := det.ComputeCohortStats(540.0) // 135 LPCD

	if stats.UserAverageLPCD != 135.0 {
		t.Errorf("Expected 135.0 LPCD, got %.2f", stats.UserAverageLPCD)
	}
	if stats.NationalBenchmarkLPCD != 135.0 {
		t.Errorf("Expected National Benchmark 135.0 LPCD, got %.2f", stats.NationalBenchmarkLPCD)
	}
}
