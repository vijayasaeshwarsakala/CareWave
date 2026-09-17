import React, { useState } from 'react';
import { AlertCircle, X, ShieldAlert } from 'lucide-react';

const DisclaimerBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-slate-200 text-xs py-2 px-4 shadow-sm border-b border-teal-800/40 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            <strong className="text-teal-300 font-semibold uppercase tracking-wider text-[11px] mr-1">Demo Notice:</strong>
            CareWave is an academic & startup MVP. Hospital data and queue statuses are simulated for demonstration. Not officially affiliated with listed hospitals.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
