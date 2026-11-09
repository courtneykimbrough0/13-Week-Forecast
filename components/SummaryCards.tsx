'use client';

import React from 'react';
import { ForecastSummary } from '@/lib/forecast-engine';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface SummaryCardsProps {
  summary: ForecastSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const isEndingPositive = summary.ending13WeekBalance >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* Card 1: 13-Week Balance */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs font-semibold text-gray-300">13-Week Balance</span>
          {isEndingPositive ? (
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
        </div>
        <div>
          <p className={`font-mono text-xl font-bold tracking-tight ${summary.ending13WeekBalance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            ${summary.ending13WeekBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Card 2: Lowest Point */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs font-semibold text-gray-300">Lowest Point</span>
          <span className="text-[10px] font-mono bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">
            Week {summary.lowestBalanceWeek}
          </span>
        </div>
        <div>
          <p className={`font-mono text-xl font-bold tracking-tight ${summary.lowestBalance < 0 ? 'text-red-400' : 'text-gray-100'}`}>
            ${summary.lowestBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Card 3: Projected Income */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs font-semibold text-gray-300">Projected Income</span>
          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <p className="font-mono text-xl font-bold text-emerald-400 tracking-tight">
            +${summary.totalIncome13Weeks.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Card 4: Projected Expenses */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs font-semibold text-gray-300">Projected Expenses</span>
          <ArrowDownRight className="w-4 h-4 text-gray-400" />
        </div>
        <div>
          <p className="font-mono text-xl font-bold text-gray-200 tracking-tight">
            -${summary.totalOutgoings13Weeks.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};
