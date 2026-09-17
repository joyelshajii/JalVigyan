import React, { useState, useMemo } from 'react';
import type { MeterReading } from '../types';
import {
  Plus,
  Upload,
  Download,
  Check,
  AlertCircle,
  Calendar,
  Search,
  Filter,
  ShieldCheck,
  Binary,
} from 'lucide-react';

interface MeterLoggerProps {
  readings: MeterReading[];
  onAddReading: (meterValue: number, timestamp?: string, tag?: string) => Promise<void>;
  onBatchUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MeterLogger: React.FC<MeterLoggerProps> = ({
  readings,
  onAddReading,
  onBatchUpload,
}) => {
  const latestReading = readings[0] || { meter_value: 158900, timestamp: new Date().toISOString() };

  const [meterValue, setMeterValue] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [tag, setTag] = useState<string>('routine_check');
  const [unit, setUnit] = useState<'liters' | 'm3'>('liters');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('ALL');

  // Live calculation of delta
  const numericVal = parseFloat(meterValue) || 0;
  const convertedValue = unit === 'm3' ? numericVal * 1000 : numericVal;
  const delta = convertedValue > latestReading.meter_value ? convertedValue - latestReading.meter_value : 0;
  const isRollback = meterValue !== '' && convertedValue < latestReading.meter_value;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!meterValue || isNaN(numericVal) || numericVal <= 0) {
      setErrorMsg('Please enter a valid positive meter reading.');
      return;
    }

    if (convertedValue < latestReading.meter_value) {
      setErrorMsg(
        `Dial reading cannot be lower than the previous recorded cumulative value (${latestReading.meter_value.toLocaleString()} L). Verify mechanical dials.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddReading(convertedValue, timestamp, tag);
      setSuccessMsg(`Reading of ${convertedValue.toLocaleString()} L committed successfully (+${delta.toLocaleString()} L delta).`);
      setMeterValue('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record meter reading.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReadings = useMemo(() => {
    return readings.filter((r) => {
      const matchesSearch =
        r.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.meter_value.toString().includes(searchTerm);
      const matchesTag = filterTag === 'ALL' || r.tag === filterTag;
      return matchesSearch && matchesTag;
    });
  }, [readings, searchTerm, filterTag]);

  const downloadSampleCSV = () => {
    const csvContent =
      'Date,MeterValueLiters,Tag\n' +
      '2026-09-10,158200,routine\n' +
      '2026-09-11,158740,routine\n' +
      '2026-09-12,159280,routine\n' +
      '2026-09-13,160120,sunday_laundry\n' +
      '2026-09-14,160650,routine\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_water_meter_readings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-zinc-950 tracking-tight">Meter Telemetry Ledger</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Log cumulative readings from analog mechanical dials or pulse telemetry, with rollback protection and batch CSV support.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={downloadSampleCSV}
            className="btn-secondary py-1 px-2.5 flex items-center gap-1.5"
            title="Download CSV Template"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>CSV Template</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Reading Input Terminal */}
        <div className="space-y-4 lg:col-span-1">
          <div className="panel p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-sky-600" /> Log Meter Reading
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                Latest: <strong className="text-zinc-900 font-semibold">{latestReading.meter_value.toLocaleString()} L</strong>
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700 flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-zinc-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" /> Date & Timestamp
                </label>
                <input
                  type="datetime-local"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="form-input font-mono text-xs"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-zinc-700">Cumulative Dial Value</label>
                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setUnit('liters')}
                      className={`px-1.5 py-0.5 rounded ${
                        unit === 'liters' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      Liters
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('m3')}
                      className={`px-1.5 py-0.5 rounded ${
                        unit === 'm3' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      m³ (kL)
                    </button>
                  </div>
                </div>

                <input
                  type="number"
                  step="any"
                  placeholder={unit === 'liters' ? 'e.g. 159450' : 'e.g. 159.45'}
                  value={meterValue}
                  onChange={(e) => setMeterValue(e.target.value)}
                  className={`form-input font-mono text-sm font-semibold tabular-nums ${
                    isRollback ? 'border-rose-500 focus:ring-rose-500' : ''
                  }`}
                  required
                />

                {/* Instant Dynamic Validation Pill */}
                {meterValue !== '' && (
                  <div className="mt-2 text-[11px] font-mono">
                    {isRollback ? (
                      <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-800 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Rollback error: Lower than previous ({latestReading.meter_value} L)</span>
                      </div>
                    ) : delta > 0 ? (
                      <div className="p-2 bg-sky-50 border border-sky-200 rounded text-sky-900 flex items-center justify-between">
                        <span>Calculated Volume Delta:</span>
                        <strong className="text-sky-800 font-bold">+{delta.toLocaleString()} Liters</strong>
                      </div>
                    ) : (
                      <span className="text-zinc-400">Zero incremental change</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Observation Tag</label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="form-input text-xs"
                >
                  <option value="routine_check">Routine Daily Log</option>
                  <option value="morning_reading">Morning 08:00 AM Quiescent Check</option>
                  <option value="night_quiescent">Night 01:00 AM Baseline Log</option>
                  <option value="sunday_laundry">High Consumption (Laundry / Wash)</option>
                  <option value="guest_visit">Guests / Event Influx</option>
                  <option value="post_repair">Post-Repair Plumbing Verification</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isRollback}
                className="w-full btn-primary py-2 text-xs font-semibold"
              >
                {isSubmitting ? 'Verifying & Saving...' : 'Commit Reading to Database'}
              </button>
            </form>

            {/* Batch CSV Section */}
            <div className="pt-4 border-t border-zinc-100 space-y-2.5">
              <span className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-zinc-500" /> Batch Ingestion
              </span>
              <p className="text-[11px] text-zinc-500 leading-normal">
                Directly import historical telemetry from utility CSV spreadsheets.
              </p>

              <label className="btn-secondary w-full cursor-pointer py-1.5 text-xs text-center flex items-center justify-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload CSV File</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={onBatchUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-100/60 rounded border border-zinc-200 text-xs text-zinc-600 space-y-1">
            <span className="font-semibold text-zinc-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Integrity Assurance
            </span>
            <p className="text-[11px] leading-relaxed">
              Every committed reading recalculates rolling Hampel MAD medians and triggers Minimum Night Flow threshold evaluations instantly.
            </p>
          </div>
        </div>

        {/* Right Column: Historical Audit Ledger */}
        <div className="panel p-5 lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
                <Binary className="w-4 h-4 text-sky-600" /> Meter Reading Audit Ledger
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Chronological ledger of recorded readings and derived flow rates.
              </p>
            </div>

            {/* Filter & Search */}
            <div className="flex items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search value or tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1 bg-white border border-zinc-300 rounded text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-zinc-400" />
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="py-1 px-2 bg-white border border-zinc-300 rounded text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="ALL">All Tags</option>
                  <option value="routine">routine</option>
                  <option value="sunday_laundry">sunday_laundry</option>
                  <option value="csv_import">csv_import</option>
                  <option value="manual_entry">manual_entry</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-zinc-200 rounded-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-zinc-600 font-semibold border-b border-zinc-200">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3 text-right">Cumulative Value</th>
                  <th className="py-2.5 px-3 text-right">Incremental Delta</th>
                  <th className="py-2.5 px-3 text-right">Derived Rate</th>
                  <th className="py-2.5 px-3">Tag</th>
                  <th className="py-2.5 px-3 text-right">Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80 font-mono tabular-nums">
                {filteredReadings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-zinc-400 font-sans">
                      No matching meter records found.
                    </td>
                  </tr>
                ) : (
                  filteredReadings.map((r) => (
                    <tr key={r.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-2 px-3 text-zinc-700">
                        {new Date(r.timestamp).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2 px-3 font-semibold text-zinc-950 text-right">
                        {r.meter_value.toLocaleString()} L
                      </td>
                      <td className="py-2 px-3 text-sky-700 text-right">
                        +{r.delta_liters.toLocaleString()} L
                      </td>
                      <td className="py-2 px-3 text-zinc-500 text-right">
                        {r.flow_rate_lph.toFixed(1)} L/h
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-sans text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-700 rounded border border-zinc-200 font-medium">
                          {r.tag}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-zinc-400 font-sans text-[11px] text-right">
                        {r.is_manual ? 'Manual Dial' : 'Pulse Telemetry'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <span>Showing {filteredReadings.length} of {readings.length} total recorded entries</span>
            <span className="font-mono text-[11px]">Audit Engine: Live Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
