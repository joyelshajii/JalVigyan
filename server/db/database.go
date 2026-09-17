package db

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"time"
	"water-use-sentinel/server/models"

	_ "modernc.org/sqlite"
)

// Store wraps the SQLite database and handles all persistence operations
type Store struct {
	db *sql.DB
}

// NewStore initializes the SQLite database file and schema
func NewStore(dbPath string) (*Store, error) {
	sqlDB, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open sqlite database: %w", err)
	}

	// Performance pragmatic PRAGMAs
	sqlDB.Exec("PRAGMA journal_mode=WAL;")
	sqlDB.Exec("PRAGMA synchronous=NORMAL;")

	s := &Store{db: sqlDB}
	if err := s.migrate(); err != nil {
		return nil, fmt.Errorf("failed to run migrations: %w", err)
	}

	// Check if seeded
	var count int
	s.db.QueryRow("SELECT COUNT(*) FROM meter_readings").Scan(&count)
	if count == 0 {
		log.Println("Seeding initial 30-day realistic household water consumption data...")
		if err := s.SeedDefaultData(); err != nil {
			log.Printf("Warning: failed to seed default data: %v", err)
		}
	}

	return s, nil
}

func (s *Store) migrate() error {
	schema := `
	CREATE TABLE IF NOT EXISTS household_profile (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		residents INTEGER NOT NULL,
		dwelling_type TEXT NOT NULL,
		has_garden INTEGER NOT NULL,
		water_source TEXT NOT NULL,
		target_lpcd REAL NOT NULL,
		created_at DATETIME NOT NULL
	);

	CREATE TABLE IF NOT EXISTS meter_readings (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		timestamp DATETIME NOT NULL,
		meter_value REAL NOT NULL,
		delta_liters REAL NOT NULL,
		flow_rate_lph REAL NOT NULL,
		tag TEXT NOT NULL,
		is_manual INTEGER NOT NULL
	);

	CREATE TABLE IF NOT EXISTS daily_summaries (
		date TEXT PRIMARY KEY,
		total_liters REAL NOT NULL,
		min_night_flow REAL NOT NULL,
		per_capita_liters REAL NOT NULL,
		status TEXT NOT NULL,
		flagged_reason TEXT
	);

	CREATE TABLE IF NOT EXISTS anomaly_alerts (
		id TEXT PRIMARY KEY,
		severity TEXT NOT NULL,
		type TEXT NOT NULL,
		detected_at DATETIME NOT NULL,
		estimated_leak_lph REAL NOT NULL,
		daily_loss_liters REAL NOT NULL,
		monthly_cost_inr REAL NOT NULL,
		confidence REAL NOT NULL,
		probable_cause TEXT NOT NULL,
		action_recommendation TEXT NOT NULL,
		active INTEGER NOT NULL
	);
	`
	_, err := s.db.Exec(schema)
	return err
}

// GetHousehold retrieves the active household profile
func (s *Store) GetHousehold() (models.HouseholdProfile, error) {
	row := s.db.QueryRow(`SELECT id, name, residents, dwelling_type, has_garden, water_source, target_lpcd, created_at FROM household_profile LIMIT 1`)
	var h models.HouseholdProfile
	var hasGarden int
	err := row.Scan(&h.ID, &h.Name, &h.Residents, &h.DwellingType, &hasGarden, &h.WaterSource, &h.TargetLPCD, &h.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			// Fallback default
			return models.HouseholdProfile{
				ID:           "HH-KWA-402",
				Name:         "Mathew Residence (KWA Consumer # 4821)",
				Residents:    4,
				DwellingType: "Independent House",
				HasGarden:    true,
				WaterSource:  "KWA Municipal Piped",
				TargetLPCD:   135.0,
				CreatedAt:    time.Now().AddDate(0, -2, 0),
			}, nil
		}
		return h, err
	}
	h.HasGarden = hasGarden == 1
	return h, nil
}

// UpdateHousehold updates household profile parameters
func (s *Store) UpdateHousehold(h models.HouseholdProfile) error {
	hasGarden := 0
	if h.HasGarden {
		hasGarden = 1
	}
	_, err := s.db.Exec(`
		INSERT INTO household_profile (id, name, residents, dwelling_type, has_garden, water_source, target_lpcd, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			name=excluded.name,
			residents=excluded.residents,
			dwelling_type=excluded.dwelling_type,
			has_garden=excluded.has_garden,
			water_source=excluded.water_source,
			target_lpcd=excluded.target_lpcd
	`, h.ID, h.Name, h.Residents, h.DwellingType, hasGarden, h.WaterSource, h.TargetLPCD, time.Now())
	return err
}

// AddMeterReading adds a meter reading
func (s *Store) AddMeterReading(r models.MeterReading) error {
	isManual := 0
	if r.IsManual {
		isManual = 1
	}
	_, err := s.db.Exec(`
		INSERT INTO meter_readings (timestamp, meter_value, delta_liters, flow_rate_lph, tag, is_manual)
		VALUES (?, ?, ?, ?, ?, ?)
	`, r.Timestamp, r.MeterValue, r.DeltaLiters, r.FlowRateLPH, r.Tag, isManual)
	return err
}

// GetLatestMeterReading returns the most recent reading
func (s *Store) GetLatestMeterReading() (*models.MeterReading, error) {
	row := s.db.QueryRow(`SELECT id, timestamp, meter_value, delta_liters, flow_rate_lph, tag, is_manual FROM meter_readings ORDER BY timestamp DESC LIMIT 1`)
	var r models.MeterReading
	var isManual int
	err := row.Scan(&r.ID, &r.Timestamp, &r.MeterValue, &r.DeltaLiters, &r.FlowRateLPH, &r.Tag, &isManual)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	r.IsManual = isManual == 1
	return &r, nil
}

// GetRecentReadings returns the latest N meter readings
func (s *Store) GetRecentReadings(limit int) ([]models.MeterReading, error) {
	rows, err := s.db.Query(`SELECT id, timestamp, meter_value, delta_liters, flow_rate_lph, tag, is_manual FROM meter_readings ORDER BY timestamp DESC LIMIT ?`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.MeterReading
	for rows.Next() {
		var r models.MeterReading
		var isManual int
		if err := rows.Scan(&r.ID, &r.Timestamp, &r.MeterValue, &r.DeltaLiters, &r.FlowRateLPH, &r.Tag, &isManual); err != nil {
			return nil, err
		}
		r.IsManual = isManual == 1
		list = append(list, r)
	}
	return list, nil
}

// GetDailySummaries returns all daily summaries sorted by date ascending
func (s *Store) GetDailySummaries() ([]models.DailySummary, error) {
	rows, err := s.db.Query(`SELECT date, total_liters, min_night_flow, per_capita_liters, status, flagged_reason FROM daily_summaries ORDER BY date ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.DailySummary
	for rows.Next() {
		var d models.DailySummary
		var reason sql.NullString
		if err := rows.Scan(&d.Date, &d.TotalLiters, &d.MinNightFlow, &d.PerCapitaLiters, &d.Status, &reason); err != nil {
			return nil, err
		}
		if reason.Valid {
			d.FlaggedReason = reason.String
		}
		list = append(list, d)
	}
	return list, nil
}

// SaveDailySummaries stores updated daily summaries
func (s *Store) SaveDailySummaries(summaries []models.DailySummary) error {
	tx, err := s.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`
		INSERT INTO daily_summaries (date, total_liters, min_night_flow, per_capita_liters, status, flagged_reason)
		VALUES (?, ?, ?, ?, ?, ?)
		ON CONFLICT(date) DO UPDATE SET
			total_liters=excluded.total_liters,
			min_night_flow=excluded.min_night_flow,
			per_capita_liters=excluded.per_capita_liters,
			status=excluded.status,
			flagged_reason=excluded.flagged_reason
	`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, d := range summaries {
		if _, err := stmt.Exec(d.Date, d.TotalLiters, d.MinNightFlow, d.PerCapitaLiters, d.Status, d.FlaggedReason); err != nil {
			return err
		}
	}

	return tx.Commit()
}

// SaveAlerts replaces active alerts
func (s *Store) SaveAlerts(alerts []models.AnomalyAlert) error {
	tx, err := s.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Clear older active alerts
	if _, err := tx.Exec("DELETE FROM anomaly_alerts WHERE active = 1"); err != nil {
		return err
	}

	stmt, err := tx.Prepare(`
		INSERT INTO anomaly_alerts (id, severity, type, detected_at, estimated_leak_lph, daily_loss_liters, monthly_cost_inr, confidence, probable_cause, action_recommendation, active)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, a := range alerts {
		activeInt := 0
		if a.Active {
			activeInt = 1
		}
		if _, err := stmt.Exec(a.ID, a.Severity, a.Type, a.DetectedAt, a.EstimatedLeakLPH, a.DailyLossLiters, a.MonthlyCostINR, a.Confidence, a.ProbableCause, a.ActionRecommendation, activeInt); err != nil {
			return err
		}
	}

	return tx.Commit()
}

// GetActiveAlerts returns active anomaly alerts
func (s *Store) GetActiveAlerts() ([]models.AnomalyAlert, error) {
	rows, err := s.db.Query(`SELECT id, severity, type, detected_at, estimated_leak_lph, daily_loss_liters, monthly_cost_inr, confidence, probable_cause, action_recommendation, active FROM anomaly_alerts WHERE active = 1 ORDER BY detected_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.AnomalyAlert
	for rows.Next() {
		var a models.AnomalyAlert
		var activeInt int
		if err := rows.Scan(&a.ID, &a.Severity, &a.Type, &a.DetectedAt, &a.EstimatedLeakLPH, &a.DailyLossLiters, &a.MonthlyCostINR, &a.Confidence, &a.ProbableCause, &a.ActionRecommendation, &activeInt); err != nil {
			return nil, err
		}
		a.Active = activeInt == 1
		list = append(list, a)
	}
	return list, nil
}

// SeedDefaultData generates a realistic 30-day history for a 4-person Kerala household
func (s *Store) SeedDefaultData() error {
	// 1. Household
	profile := models.HouseholdProfile{
		ID:           "HH-KWA-402",
		Name:         "Mathew Residence (KWA Consumer # 4821)",
		Residents:    4,
		DwellingType: "Independent House",
		HasGarden:    true,
		WaterSource:  "KWA Municipal Piped",
		TargetLPCD:   135.0,
		CreatedAt:    time.Now().AddDate(0, -2, 0),
	}
	if err := s.UpdateHousehold(profile); err != nil {
		return err
	}

	// 2. Clear tables
	s.db.Exec("DELETE FROM meter_readings")
	s.db.Exec("DELETE FROM daily_summaries")
	s.db.Exec("DELETE FROM anomaly_alerts")

	// 3. Generate 30 days of data ending today
	now := time.Now()
	startDate := now.AddDate(0, 0, -29)

	r := rand.New(rand.NewSource(42)) // deterministic seed for reproducibility

	var dailyList []models.DailySummary
	meterCumulative := 142850.0 // Starting reading in Liters

	for i := 0; i < 30; i++ {
		currentDay := startDate.AddDate(0, 0, i)
		dateStr := currentDay.Format("2006-01-02")

		// Baseline diurnal pattern: normal daily total is ~520 - 560 L for 4 persons
		baseTotal := 535.0 + (r.Float64()*40.0 - 20.0)
		nightFlow := 0.0

		// Day 20: Sunday laundry spike (e.g. +300L during daytime, but 0 night flow)
		if i == 20 {
			baseTotal = 845.0
			nightFlow = 0.0 // Night flow remains strictly 0
		}

		meterCumulative += baseTotal

		summary := models.DailySummary{
			Date:            dateStr,
			TotalLiters:     baseTotal,
			MinNightFlow:    nightFlow,
			PerCapitaLiters: baseTotal / 4.0,
			Status:          "NORMAL",
		}
		if i == 20 {
			summary.Status = "ELEVATED_NORMAL"
			summary.FlaggedReason = "Elevated daytime wash volume (+310 L). Night minimum flow remained 0 L/h. Characterized as routine household task."
		}

		dailyList = append(dailyList, summary)

		// Record end-of-day meter reading
		tag := "routine"
		if i == 20 {
			tag = "sunday_laundry"
		}
		s.AddMeterReading(models.MeterReading{
			Timestamp:   time.Date(currentDay.Year(), currentDay.Month(), currentDay.Day(), 23, 59, 0, 0, currentDay.Location()),
			MeterValue:  meterCumulative,
			DeltaLiters: baseTotal,
			FlowRateLPH: baseTotal / 24.0,
			Tag:         tag,
			IsManual:    true,
		})
	}

	return s.SaveDailySummaries(dailyList)
}

// InjectLeakScenario modifies the recent data to simulate an injected leak or legitimate spike
func (s *Store) InjectScenario(scenario models.LeakInjectionScenario) error {
	switch scenario.Type {
	case "RESET":
		return s.SeedDefaultData()

	case "WEEKEND_LAUNDRY":
		// Modifies today's summary to show a 350L daytime spike with 0 night flow
		summaries, err := s.GetDailySummaries()
		if err != nil || len(summaries) == 0 {
			return err
		}
		lastIdx := len(summaries) - 1
		summaries[lastIdx].TotalLiters = 880.0
		summaries[lastIdx].MinNightFlow = 0.0
		summaries[lastIdx].Status = "ELEVATED_NORMAL"
		summaries[lastIdx].FlaggedReason = "Heavy daytime usage (+340 L above median). Night flow reached 0 L/h. Legitimate domestic spike."
		return s.SaveDailySummaries(summaries)

	case "GUEST_EVENT":
		// Modifies today and yesterday: +220L daytime usage, 0 night flow
		summaries, err := s.GetDailySummaries()
		if err != nil || len(summaries) < 2 {
			return err
		}
		n := len(summaries)
		for i := n - 2; i < n; i++ {
			summaries[i].TotalLiters = 760.0
			summaries[i].MinNightFlow = 0.0
			summaries[i].Status = "ELEVATED_NORMAL"
			summaries[i].FlaggedReason = "Visitor stay detected (+215 L/day). Quiescent night flow is 0 L/h."
		}
		return s.SaveDailySummaries(summaries)

	case "TOILET_FLAPPER":
		// Continuous 18 L/h leak starting 3 days ago
		// Night flow = 18.0 L/h, Daily total increases by 18 * 24 = 432 L/day
		summaries, err := s.GetDailySummaries()
		if err != nil || len(summaries) < 3 {
			return err
		}
		n := len(summaries)
		leakRate := 18.0
		if scenario.FlowRateLPH > 0 {
			leakRate = scenario.FlowRateLPH
		}
		for i := n - 3; i < n; i++ {
			summaries[i].TotalLiters += (leakRate * 24.0)
			summaries[i].MinNightFlow = leakRate
			summaries[i].Status = "LEAK_CONFIRMED"
			summaries[i].FlaggedReason = fmt.Sprintf("Persistent night-time flow of %.1f L/h observed during 01:00-04:30 AM", leakRate)
		}
		return s.SaveDailySummaries(summaries)

	case "PIPE_CRACK":
		// Severe 45 L/h concealed fissure starting 2 days ago
		// Night flow = 45.0 L/h, Daily total increases by 45 * 24 = 1080 L/day
		summaries, err := s.GetDailySummaries()
		if err != nil || len(summaries) < 2 {
			return err
		}
		n := len(summaries)
		leakRate := 45.0
		if scenario.FlowRateLPH > 0 {
			leakRate = scenario.FlowRateLPH
		}
		for i := n - 2; i < n; i++ {
			summaries[i].TotalLiters += (leakRate * 24.0)
			summaries[i].MinNightFlow = leakRate
			summaries[i].Status = "LEAK_CONFIRMED"
			summaries[i].FlaggedReason = fmt.Sprintf("Critical continuous flow of %.1f L/h. Unquenched pipe fracture.", leakRate)
		}
		return s.SaveDailySummaries(summaries)

	default:
		return fmt.Errorf("unknown scenario type: %s", scenario.Type)
	}
}
