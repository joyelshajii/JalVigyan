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
  FileSpreadsheet,
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
      setSuccessMsg(`Reading of ${convertedValue.toLocaleString()} L recorded successfully (+${delta.toLocaleString()} L incremental usage).`);
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

  const quickTagChips = [
    { id: 'routine_check', label: 'Routine Daily Log' },
    { id: 'morning_reading', label: 'Morning Baseline (08:00 AM)' },
    { id: 'sunday_laundry', label: 'High Wash (Laundry)' },
    { id: 'post_repair', label: 'Post-Repair Check' },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Meter Telemetry Ledger</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log cumulative readings from mechanical dials or pulse telemetry with automatic delta calculations, rollback protection, and batch CSV import.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadSampleCSV}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Download CSV sample file"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Sample CSV Template</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Reading Input Terminal */}
        <div className="space-y-5 lg:col-span-1">
          <div className="panel p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-600" /> Log Meter Reading
              </span>
              <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                Latest: <strong className="text-slate-900">{latestReading.meter_value.toLocaleString()} L</strong>
              </span>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date & Timestamp
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Cumulative Dial Value</label>
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setUnit('liters')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        unit === 'liters' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Liters (L)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('m3')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        unit === 'm3' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
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
                  className={`form-input font-mono text-base font-bold tabular-nums ${
                    isRollback ? 'border-rose-500 focus:ring-rose-500' : ''
                  }`}
                  required
                />

                {/* Instant Dynamic Validation & Delta Card */}
                {meterValue !== '' && (
                  <div className="mt-2.5 text-xs">
                    {isRollback ? (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Rollback Guard:</strong> Reading cannot be lower than previous recorded cumulative value ({latestReading.meter_value.toLocaleString()} L).
                        </div>
                      </div>
                    ) : delta > 0 ? (
                      <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 flex items-center justify-between">
                        <span className="font-medium">Calculated Volume Delta:</span>
                        <strong className="text-sky-800 font-mono text-sm font-bold">+{delta.toLocaleString()} Liters</strong>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">Zero incremental change</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Observation Tag</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {quickTagChips.map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setTag(chip.id)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        tag === chip.id
                          ? 'bg-sky-50 text-sky-700 border-sky-300 font-semibold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isRollback}
                className="w-full btn-primary py-2.5 text-xs font-semibold shadow-sm"
              >
                {isSubmitting ? 'Verifying & Saving...' : 'Commit Reading to Database'}
              </button>
            </form>

            {/* Batch CSV Section */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-slate-500" /> Batch CSV Ingestion
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                Import historical meter logs directly from spreadsheet files.
              </p>

              <label className="btn-secondary w-full cursor-pointer py-2 text-xs flex items-center justify-center gap-2">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
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

          <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Data Integrity Guarantee
            </span>
            <p className="leading-relaxed">
              Every committed reading recalculates rolling Hampel MAD medians and evaluates Minimum Night Flow thresholds without manual intervention.
            </p>
          </div>
        </div>

        {/* Right Column: Historical Audit Ledger */}
        <div className="panel p-6 lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Binary className="w-4 h-4 text-sky-600" /> Audit Ledger & Telemetry Log
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete chronological sequence of recorded cumulative values and derived flow rates.
              </p>
            </div>

            {/* Filter & Search */}
            <div className="flex items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search value or tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="py-1.5 px-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="ALL">All Tags</option>
                  <option value="routine_check">routine_check</option>
                  <option value="morning_reading">morning_reading</option>
                  <option value="sunday_laundry">sunday_laundry</option>
                  <option value="post_repair">post_repair</option>
                  <option value="csv_batch">csv_batch</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Cumulative Value</th>
                  <th className="py-3 px-4 text-right">Incremental Delta</th>
                  <th className="py-3 px-4 text-right">Derived Flow Rate</th>
                  <th className="py-3 px-4">Tag</th>
                  <th className="py-3 px-4 text-right">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                {filteredReadings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-sans">
                      No matching meter records found.
                    </td>
                  </tr>
                ) : (
                  filteredReadings.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-slate-700 font-sans">
                        {new Date(r.timestamp).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 text-right">
                        {r.meter_value.toLocaleString()} L
                      </td>
                      <td className="py-3 px-4 text-sky-700 text-right font-semibold">
                        +{r.delta_liters.toLocaleString()} L
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-right">
                        {r.flow_rate_lph.toFixed(1)} L/h
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium border border-slate-200">
                          {r.tag}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-sans text-xs text-right">
                        {r.is_manual ? 'Manual Dial' : 'Pulse Telemetry'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Showing {filteredReadings.length} of {readings.length} total entries</span>
            <span className="font-mono text-[11px]">Audit Engine: Live Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
