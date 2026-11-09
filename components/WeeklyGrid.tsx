'use client';

import React, { useState } from 'react';
import { WeeklyForecast, CATEGORY_LABELS } from '@/lib/forecast-engine';
import { ChevronRight, X, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface WeeklyGridProps {
  weeks: WeeklyForecast[];
  selectedWeek: number | null;
  onSelectWeek: (weekNum: number) => void;
}

export const WeeklyGrid: React.FC<WeeklyGridProps> = ({ weeks, selectedWeek, onSelectWeek }) => {
  const [activeModalWeek, setActiveModalWeek] = useState<WeeklyForecast | null>(null);
  const [filterDayIndex, setFilterDayIndex] = useState<number | 'all'>('all');

  const handleOpenWeekModal = (w: WeeklyForecast) => {
    setActiveModalWeek(w);
    setFilterDayIndex('all');
    onSelectWeek(w.weekNumber);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-100">13-Week Forecast</h2>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900/90 text-gray-400 font-medium uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-3 px-3.5 whitespace-nowrap">Week</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap text-emerald-400">Income</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">Fixed Exp.</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">Subscript.</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">Liabilities</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">Savings</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">Spend</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">Weekly Net</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">Balance</th>
                <th className="py-3 px-3.5 text-center whitespace-nowrap">Day Breakdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {weeks.map((w) => {
                const isSelected = selectedWeek === w.weekNumber;
                return (
                  <tr
                    key={w.weekNumber}
                    onClick={() => handleOpenWeekModal(w)}
                    className={`hover:bg-gray-800/40 transition-colors cursor-pointer ${
                      w.isShortfall
                        ? 'bg-red-950/20 hover:bg-red-900/30'
                        : isSelected
                        ? 'bg-emerald-950/20'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-3.5 font-sans whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-xs ${w.isShortfall ? 'text-red-400' : 'text-gray-200'}`}>
                          W{w.weekNumber}
                        </span>
                        <span className="text-[11px] text-gray-400 font-normal">
                          ({w.startDate.slice(5)})
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3.5 text-right text-emerald-400 font-semibold">
                      {w.incomeTotal > 0 ? `+$${w.incomeTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </td>

                    <td className="py-3 px-3.5 text-right text-gray-300">
                      {w.fixedExpensesTotal > 0 ? `-$${w.fixedExpensesTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </td>

                    <td className="py-3 px-3.5 text-right text-gray-300">
                      {w.subscriptionsTotal > 0 ? `-$${w.subscriptionsTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </td>

                    <td className="py-3 px-3.5 text-right text-gray-300">
                      {w.liabilitiesTotal > 0 ? `-$${w.liabilitiesTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </td>

                    <td className="py-3 px-3.5 text-right text-gray-300">
                      {w.savingsTotal > 0 ? `-$${w.savingsTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </td>

                    <td className="py-3 px-3.5 text-right text-gray-300">
                      {w.spendTotal > 0 ? `-$${w.spendTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </td>

                    <td className={`py-3 px-3.5 text-right font-semibold ${w.netChange >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {w.netChange >= 0 ? '+' : ''}${w.netChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className={`py-3 px-3.5 text-right font-bold ${w.projectedBalance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      ${w.projectedBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-3.5 text-center font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenWeekModal(w);
                        }}
                        className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>View Days</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Day Breakdown Popup Modal */}
      {activeModalWeek && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 shrink-0">
              <div>
                <h3 className="text-base font-semibold text-gray-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>{activeModalWeek.label} Breakdown</span>
                  {activeModalWeek.isShortfall && (
                    <span className="text-[10px] font-mono bg-red-900/60 text-red-200 px-2 py-0.5 rounded border border-red-700">
                      Low Cash
                    </span>
                  )}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalWeek(null)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Summary Bar */}
            <div className="my-3 p-3 bg-gray-900/90 rounded-lg border border-gray-800 grid grid-cols-3 gap-2 text-center text-xs font-mono shrink-0">
              <div>
                <span className="text-gray-400 text-[11px] block">Income</span>
                <span className="text-emerald-400 font-semibold">
                  +${activeModalWeek.incomeTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] block">Weekly Net</span>
                <span className={activeModalWeek.netChange >= 0 ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                  {activeModalWeek.netChange >= 0 ? '+' : ''}${activeModalWeek.netChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] block">Balance</span>
                <span className={`font-bold ${activeModalWeek.projectedBalance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  ${activeModalWeek.projectedBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Day Selector */}
            <div className="shrink-0 mb-3">
              <div className="grid grid-cols-8 gap-1 text-center">
                <button
                  onClick={() => setFilterDayIndex('all')}
                  className={`py-1.5 px-1 rounded text-[11px] font-medium transition cursor-pointer border ${
                    filterDayIndex === 'all'
                      ? 'bg-emerald-600 text-white border-emerald-500 font-semibold'
                      : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  All ({activeModalWeek.allOccurrences.length})
                </button>

                {activeModalWeek.dailyGroups.map((g, idx) => {
                  const isSelected = filterDayIndex === idx;
                  const count = g.occurrences.length;
                  return (
                    <button
                      key={g.date}
                      onClick={() => setFilterDayIndex(idx)}
                      className={`py-1.5 px-1 rounded text-[11px] font-medium transition cursor-pointer border relative ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-500 font-semibold'
                          : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <span>{g.dayName}</span>
                      <span className="block text-[9px] text-gray-400 font-mono">{g.date.slice(8)}</span>
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-emerald-500 text-black font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment List */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-2">
              {(() => {
                const displayOccurrences =
                  filterDayIndex === 'all'
                    ? activeModalWeek.allOccurrences
                    : activeModalWeek.dailyGroups[filterDayIndex]?.occurrences || [];

                if (displayOccurrences.length === 0) {
                  return (
                    <div className="py-8 text-center text-xs text-gray-500 bg-gray-950/40 rounded-lg border border-dashed border-gray-800">
                      No items scheduled for this selection.
                    </div>
                  );
                }

                return displayOccurrences.map((occ, i) => (
                  <div
                    key={`${occ.itemId}-${occ.date}-${i}`}
                    className="p-3 bg-gray-900/70 border border-gray-800 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-md ${occ.category === 'income' ? 'bg-emerald-950 text-emerald-400' : 'bg-gray-800 text-gray-300'}`}>
                        {occ.category === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-100">{occ.itemName}</span>
                          <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                            {CATEGORY_LABELS[occ.category]}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">Date: {occ.date}</p>
                      </div>
                    </div>

                    <div className="font-mono text-sm font-bold text-right">
                      <span className={occ.category === 'income' ? 'text-emerald-400' : 'text-gray-200'}>
                        {occ.category === 'income' ? '+' : '-'}${occ.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-gray-800 flex justify-end shrink-0">
              <button
                onClick={() => setActiveModalWeek(null)}
                className="px-4 py-1.5 text-xs font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
