import type {
  HouseholdProfile,
  MeterReading,
  DailySummary,
  HourlyPattern,
  AnomalyAlert,
  CohortStats,
  VerificationScorecard,
} from '../types';
import { localEngine } from './engine';

const API_BASE = '/api';

export let isBackendConnected = false;

async function tryFetch<T>(endpoint: string, options?: RequestInit, fallback?: () => T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Server responded with ${res.status}`);
    }

    isBackendConnected = true;
    return await res.json();
  } catch (err) {
    // If backend is unavailable or offline, seamlessly use localEngine fallback
    isBackendConnected = false;
    if (fallback) {
      return fallback();
    }
    throw err;
  }
}

export const apiService = {
  checkHealth: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
      isBackendConnected = res.ok;
      return res.ok;
    } catch {
      isBackendConnected = false;
      return false;
    }
  },

  getHousehold: async (): Promise<HouseholdProfile> => {
    return tryFetch<HouseholdProfile>('/household', undefined, () => localEngine.getHousehold());
  },

  updateHousehold: async (profile: HouseholdProfile): Promise<HouseholdProfile> => {
    return tryFetch<HouseholdProfile>(
      '/household',
      { method: 'PUT', body: JSON.stringify(profile) },
      () => localEngine.updateHousehold(profile)
    );
  },

  getReadings: async (limit = 30): Promise<MeterReading[]> => {
    return tryFetch<MeterReading[]>(`/readings?limit=${limit}`, undefined, () => localEngine.getReadings(limit));
  },

  addReading: async (meterValue: number, timestamp?: string, tag = 'manual_entry'): Promise<MeterReading> => {
    return tryFetch<MeterReading>(
      '/readings',
      {
        method: 'POST',
        body: JSON.stringify({ meter_value: meterValue, timestamp, tag }),
      },
      () => localEngine.addReading(meterValue, timestamp, tag)
    );
  },

  getSummaries: async (): Promise<DailySummary[]> => {
    return tryFetch<DailySummary[]>('/summaries', undefined, () => localEngine.getSummaries());
  },

  getHourlyPattern: async (): Promise<HourlyPattern[]> => {
    return tryFetch<HourlyPattern[]>('/hourly-pattern', undefined, () => localEngine.getHourlyPattern());
  },

  getAlerts: async (): Promise<AnomalyAlert[]> => {
    return tryFetch<AnomalyAlert[]>('/alerts', undefined, () => localEngine.getAlerts());
  },

  getCohortStats: async (): Promise<CohortStats> => {
    return tryFetch<CohortStats>('/cohorts', undefined, () => localEngine.getCohortStats());
  },

  injectScenario: async (type: string, flowRate = 0): Promise<{ scorecard: VerificationScorecard; alerts: AnomalyAlert[] }> => {
    return tryFetch<{ scorecard: VerificationScorecard; alerts: AnomalyAlert[] }>(
      '/inject-scenario',
      {
        method: 'POST',
        body: JSON.stringify({ type, flow_rate_lph: flowRate, duration_hours: 48 }),
      },
      () => localEngine.injectScenario(type, flowRate)
    );
  },
};
