package models

import "time"

// HouseholdProfile represents a residential water connection profile
type HouseholdProfile struct {
	ID                 string    `json:"id"`
	Name               string    `json:"name"`
	Residents          int       `json:"residents"`
	DwellingType       string    `json:"dwelling_type"` // e.g. "Independent House", "Apartment", "Villa"
	HasGarden          bool      `json:"has_garden"`
	WaterSource        string    `json:"water_source"` // "KWA Municipal", "Borewell", "Dual"
	TargetLPCD         float64   `json:"target_lpcd"`  // Liters Per Capita per Day target (default 135)
	CreatedAt          time.Time `json:"created_at"`
}

// MeterReading records a single reading from a water meter
type MeterReading struct {
	ID          int64     `json:"id"`
	Timestamp   time.Time `json:"timestamp"`
	MeterValue  float64   `json:"meter_value"`  // Cumulative reading in Liters
	DeltaLiters float64   `json:"delta_liters"` // Incremental consumption since previous reading
	FlowRateLPH float64   `json:"flow_rate_lph"`// Liters per hour during interval
	Tag         string    `json:"tag"`          // "routine", "laundry_spike", "toilet_leak", "pipe_fissure"
	IsManual    bool      `json:"is_manual"`
}

// HourlyPattern models diurnal consumption profile across a 24-hour day
type HourlyPattern struct {
	Hour          int     `json:"hour"`           // 0 - 23
	AvgLiters     float64 `json:"avg_liters"`     // Average consumption in that hour
	MinFlowLiters float64 `json:"min_flow_liters"`// Observed minimum flow in that hour
	MaxFlowLiters float64 `json:"max_flow_liters"`// Peak flow observed
	IsNightWindow bool    `json:"is_night_window"`// True for 01:00 to 04:30 AM
}

// DailySummary summarizes consumption for one calendar date
type DailySummary struct {
	Date            string  `json:"date"` // YYYY-MM-DD
	TotalLiters     float64 `json:"total_liters"`
	MinNightFlow    float64 `json:"min_night_flow"` // liters/hour between 01:00 and 04:30
	PerCapitaLiters float64 `json:"per_capita_liters"`
	Status          string  `json:"status"` // "NORMAL", "ELEVATED_NORMAL", "LEAK_SUSPECTED", "LEAK_CONFIRMED"
	FlaggedReason   string  `json:"flagged_reason,omitempty"`
}

// AnomalyAlert details an active or historical leak warning
type AnomalyAlert struct {
	ID                   string    `json:"id"`
	Severity             string    `json:"severity"` // "WARNING", "CRITICAL"
	Type                 string    `json:"type"`     // "NIGHT_FLOW_PERSISTENT", "BASELINE_STEP_SHIFT"
	DetectedAt           time.Time `json:"detected_at"`
	EstimatedLeakLPH     float64   `json:"estimated_leak_lph"`
	DailyLossLiters      float64   `json:"daily_loss_liters"`
	MonthlyCostINR       float64   `json:"monthly_cost_inr"`
	Confidence           float64   `json:"confidence"` // 0.0 to 1.0
	ProbableCause        string    `json:"probable_cause"`
	ActionRecommendation string    `json:"action_recommendation"`
	Active               bool      `json:"active"`
}

// CohortStats provides statistical benchmarking against matched demographic cohorts
type CohortStats struct {
	ResidentCount         int     `json:"resident_count"`
	CohortSize            int     `json:"cohort_size"`
	AverageLPCD           float64 `json:"average_lpcd"`
	MedianLPCD            float64 `json:"median_lpcd"`
	P25LPCD               float64 `json:"p25_lpcd"`
	P75LPCD               float64 `json:"p75_lpcd"`
	NationalBenchmarkLPCD float64 `json:"national_benchmark_lpcd"` // CPHEEO standard: 135 LPCD
	UserAverageLPCD       float64 `json:"user_average_lpcd"`
	PercentileRank        float64 `json:"percentile_rank"`
	ComparisonSummary     string  `json:"comparison_summary"`
}

// LeakInjectionScenario specifies parameters for live reviewer test harness
type LeakInjectionScenario struct {
	Type          string  `json:"type"` // "TOILET_FLAPPER", "PIPE_CRACK", "BURST_PIPE", "WEEKEND_LAUNDRY", "GUEST_EVENT", "RESET"
	FlowRateLPH   float64 `json:"flow_rate_lph"`
	DurationHours int     `json:"duration_hours"`
}

// VerificationScorecard returns the outcome of an injected event
type VerificationScorecard struct {
	ScenarioName       string  `json:"scenario_name"`
	IsActualLeak       bool    `json:"is_actual_leak"`
	SystemDetectedLeak bool    `json:"system_detected_leak"`
	CorrectDiagnosis   bool    `json:"correct_diagnosis"`
	NightFlowObserved  float64 `json:"night_flow_observed"`
	Explanation        string  `json:"explanation"`
	Sensitivity        float64 `json:"sensitivity"`
	Specificity        float64 `json:"specificity"`
}
