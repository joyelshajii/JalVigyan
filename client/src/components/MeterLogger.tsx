import React, { useState } from 'react';
import type { MeterReading } from '../types';
import { Database, Plus, Upload, Download, Check, AlertCircle, Calendar, Hash, Tag } from 'lucide-react';

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

  // Live calculation of delta
  const numericVal = parseFloat(meterValue) || 0;
  const convertedValue = unit === 'm3' ? numericVal * 1000 : numericVal;
  const delta = convertedValue > latestReading.meter_value ? convertedValue - latestReading.meter_value : 0;

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
        `Reading cannot be lower than the previous recorded reading (${latestReading.meter_value.toLocaleString()} L). Verify the physical meter dial.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddReading(convertedValue, timestamp, tag);
      setSuccessMsg(`Reading of ${convertedValue.toLocaleString()} L recorded successfully (+${delta.toLocaleString()} L delta).`);
      setMeterValue('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save meter reading.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Meter Reading Logger</h1>
        <p className="text-xs text-slate-500 mt-1">
          Record dial observations directly from mechanical or digital pulse meters, or batch-import telemetry from municipal CSV files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="card-base p-5 lg:col-span-1 h-fit space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-600" /> Log Single Reading
            </span>
            <span className="text-xs text-slate-500">
              Last: <strong className="text-slate-800">{latestReading.meter_value.toLocaleString()} L</strong>
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
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date and Time
              </label>
              <input
                type="datetime-local"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" /> Cumulative Meter Reading
                </label>
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUnit('liters')}
                    className={`px-1.5 py-0.5 rounded ${unit === 'liters' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    Liters
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit('m3')}
                    className={`px-1.5 py-0.5 rounded ${unit === 'm3' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
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
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                required
              />
              {convertedValue > latestReading.meter_value && (
                <div className="mt-1.5 p-2 bg-sky-50 border border-sky-200 rounded text-[11px] text-sky-800 flex items-center justify-between">
                  <span>Incremental Volume:</span>
                  <span className="font-bold">+{delta.toLocaleString()} Liters</span>
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" /> Observation Tag
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="routine_check">Routine Daily Log</option>
                <option value="morning_reading">Morning 08:00 AM Reading</option>
                <option value="night_quiescent">Quiescent 01:00 AM Reading</option>
                <option value="sunday_laundry">High Use (Laundry / Deep Clean)</option>
                <option value="guest_visit">Guests / Event</option>
                <option value="post_repair">Post-Plumbing Repair Check</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary mt-2"
            >
              {isSubmitting ? 'Recording...' : 'Commit Reading to Database'}
            </button>
          </form>

          {/* Batch CSV Section */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-slate-500" /> Batch CSV Import
            </span>
            <p className="text-[11px] text-slate-500">
              Upload municipal logger records or bulk spreadsheet readings.
            </p>

            <div className="flex items-center gap-2">
              <label className="flex-1 btn-secondary cursor-pointer text-center text-xs py-1.5">
                <span>Select CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={onBatchUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={downloadSampleCSV}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-xs flex items-center gap-1"
                title="Download sample template"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Template</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Column */}
        <div className="card-base p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-600" /> Meter Reading Audit Log
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chronological list of recorded cumulative readings and derived consumption rates.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">{readings.length} entries</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Meter Value</th>
                  <th className="py-2.5 px-3">Delta Volume</th>
                  <th className="py-2.5 px-3">Implied Rate</th>
                  <th className="py-2.5 px-3">Tag</th>
                  <th className="py-2.5 px-3">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {readings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                      No meter readings recorded yet.
                    </td>
                  </tr>
                ) : (
                  readings.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 text-slate-700">
                        {new Date(r.timestamp).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        {r.meter_value.toLocaleString()} L
                      </td>
                      <td className="py-2 px-3 text-sky-700">
                        +{r.delta_liters.toLocaleString()} L
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        {r.flow_rate_lph.toFixed(1)} L/h
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-sans text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                          {r.tag}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-500 font-sans text-[11px]">
                        {r.is_manual ? 'Manual Dial' : 'Pulse / Telemetry'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
