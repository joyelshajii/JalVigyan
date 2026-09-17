export interface HouseholdProfile {
  id: string;
  name: string;
  residents: number;
  dwelling_type: string;
  has_garden: boolean;
  water_source: string;
  target_lpcd: number;
}

export interface MeterReading {
  id: number;
  timestamp: string;
  meter_value: number;
  delta_liters: number;
  flow_rate_lph: number;
  tag: string;
  is_manual: boolean;
}

export interface DailySummary {
  date: string;
  total_liters: number;
  min_night_flow: number;
  per_capita_liters: number;
  status: 'NORMAL' | 'ELEVATED_NORMAL' | 'LEAK_SUSPECTED' | 'LEAK_CONFIRMED';
  flagged_reason?: string;
}

export interface HourlyPattern {
  hour: number;
  avg_liters: number;
  min_flow_liters: number;
  max_flow_liters: number;
  is_night_window: boolean;
}

export interface AnomalyAlert {
  id: string;
  severity: 'WARNING' | 'CRITICAL';
  type: string;
  detected_at: string;
  estimated_leak_lph: number;
  daily_loss_liters: number;
  monthly_cost_inr: number;
  confidence: number;
  probable_cause: string;
  action_recommendation: string;
  active: boolean;
}

export interface CohortStats {
  resident_count: number;
  cohort_size: number;
  average_lpcd: number;
  median_lpcd: number;
  p25_lpcd: number;
  p75_lpcd: number;
  national_benchmark_lpcd: number;
  user_average_lpcd: number;
  percentile_rank: number;
  comparison_summary: string;
}

export interface VerificationScorecard {
  scenario_name: string;
  is_actual_leak: boolean;
  system_detected_leak: boolean;
  correct_diagnosis: boolean;
  night_flow_observed: number;
  explanation: string;
  sensitivity: number;
  specificity: number;
}

export interface LeakInjectionScenario {
  type: string;
  flow_rate_lph: number;
  duration_hours: number;
}
