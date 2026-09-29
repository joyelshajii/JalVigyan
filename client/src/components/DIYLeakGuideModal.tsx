import { Wrench, ShieldCheck, X, ArrowRight } from 'lucide-react';

interface DIYLeakGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSimulator?: () => void;
}

export const DIYLeakGuideModal: React.FC<DIYLeakGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenSimulator,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Concealed Leak Isolation Protocol
              </h3>
              <p className="text-xs text-slate-500">Step-by-step diagnostic guide for domestic plumbing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
          {/* Step 1 */}
          <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-950 text-sm flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] font-bold">1</span>
                Toilet Cistern Dye Test (Fixes 85% of Leaks)
              </span>
              <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full font-mono">
                ~18 L/h loss
              </span>
            </div>
            <p className="text-slate-600 pl-6.5">
              Put 5 drops of food dye into your toilet cistern. Do not flush for 15 minutes. If colored water seeps into the bowl, the rubber flapper valve is deteriorated and must be replaced (approx ₹80 part).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
                Overhead Tank (OHT) Float Valve & Overflow
              </span>
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full font-mono">
                ~30 L/h loss
              </span>
            </div>
            <p className="text-slate-600 pl-6.5">
              Inspect your roof tank overflow discharge pipe during quiet hours while the pump is off. If continuous dripping or damp algae is visible, bend the ball float arm downward or replace the brass inlet washer.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[11px] font-bold">3</span>
                15-Minute Dial Sweep (Concealed Pipe Crack)
              </span>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                ~45 L/h loss
              </span>
            </div>
            <p className="text-slate-600 pl-6.5">
              Shut off all taps inside the house. Do not run any washing machine or shower. Observe the small red rotating gear on your mechanical water meter for 15 minutes. If it makes even a single revolution, water is escaping underground between the meter and the house.
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>After repairing any fixture, log a reading tagged <strong>post_repair</strong> to instantly verify that your Minimum Night Flow resets to 0.0 L/h.</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {onOpenSimulator && (
            <button
              onClick={() => {
                onClose();
                onOpenSimulator();
              }}
              className="btn-secondary text-xs text-slate-700 flex items-center gap-1.5"
            >
              <span>Verify in Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="btn-primary text-xs ml-auto"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
