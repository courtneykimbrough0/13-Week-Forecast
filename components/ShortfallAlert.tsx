'use client';

import React from 'react';
import { ForecastSummary, WeeklyForecast } from '@/lib/forecast-engine';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface ShortfallAlertProps {
  summary: ForecastSummary;
  weeks: WeeklyForecast[];
  onSelectWeek: (weekNum: number) => void;
}

export const ShortfallAlert: React.FC<ShortfallAlertProps> = ({
  summary,
  weeks,
  onSelectWeek,
}) => {
  const shortfallWeeks = weeks.filter((w) => w.isShortfall);

  if (shortfallWeeks.length === 0) {
    return null;
  }

  const firstShortfall = shortfallWeeks[0];

  return (
    <div className="mb-6 bg-red-950/30 border border-red-800/60 rounded-xl p-4 text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-900/40 rounded-lg text-red-400 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-red-100 flex items-center gap-2">
            <span>Low Cash Warning ({firstShortfall.label})</span>
            <span className="text-[10px] font-mono bg-red-900/60 text-red-200 px-2 py-0.5 rounded border border-red-700/50">
              -${firstShortfall.shortfallAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </h3>
          <p className="text-xs text-red-300/80 mt-1 leading-relaxed">
            Your balance falls to{' '}
            <strong className="text-red-200 font-mono">
              -${Math.abs(firstShortfall.projectedBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </strong>{' '}
            in {firstShortfall.label}.
          </p>
        </div>
      </div>

      <button
        onClick={() => onSelectWeek(firstShortfall.weekNumber)}
        className="flex items-center justify-center gap-1.5 bg-red-800/80 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg text-xs font-medium shrink-0 transition cursor-pointer"
      >
        <span>View Week {firstShortfall.weekNumber}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
