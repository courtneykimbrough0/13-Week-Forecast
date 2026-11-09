'use client';

import React, { useState } from 'react';
import {
  ForecastItem,
  CategoryType,
  RecurrenceFrequency,
  CATEGORY_LABELS,
} from '@/lib/forecast-engine';
import { X } from 'lucide-react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<ForecastItem, 'id'>) => void;
  defaultCategory?: CategoryType;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  defaultCategory = 'income',
}) => {
  const [formName, setFormName] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryType>(defaultCategory);
  const [formFrequency, setFormFrequency] = useState<RecurrenceFrequency>('monthly');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [formDayOfMonth, setFormDayOfMonth] = useState('1');
  const [formDayOfMonth2, setFormDayOfMonth2] = useState('15');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(formAmount);
    if (!formName.trim() || isNaN(amountVal) || amountVal <= 0) {
      alert('Please enter a valid item description and positive amount.');
      return;
    }

    onAddItem({
      name: formName.trim(),
      amount: amountVal,
      category: formCategory,
      frequency: formFrequency,
      startDate: formStartDate,
      dayOfMonth: parseInt(formDayOfMonth, 10) || 1,
      dayOfMonth2: parseInt(formDayOfMonth2, 10) || 15,
      active: true,
    });

    // Reset form and close
    setFormName('');
    setFormAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
          <h3 className="text-base font-semibold text-gray-100">Add New Recurring Entry</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Description / Title</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Primary Salary, Rent Payment, Internet"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Amount ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 font-mono text-xs">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="1200.00"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-7 pr-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as CategoryType)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="income">Income</option>
                <option value="fixed_expense">Fixed Expenses</option>
                <option value="subscription">Subscriptions</option>
                <option value="liability">Liabilities</option>
                <option value="savings">Savings</option>
                <option value="spend">Spend (Remaining)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Schedule</label>
              <select
                value={formFrequency}
                onChange={(e) => setFormFrequency(e.target.value as RecurrenceFrequency)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly (Every 2 wks)</option>
                <option value="semimonthly">Semi-monthly (2x/month)</option>
                <option value="monthly">Monthly</option>
                <option value="onetime">One-time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {(formFrequency === 'monthly' || formFrequency === 'semimonthly') && (
            <div className="grid grid-cols-2 gap-3 bg-gray-900/60 p-3 rounded-lg border border-gray-800">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Day of Month (1-31)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formDayOfMonth}
                  onChange={(e) => setFormDayOfMonth(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>
              {formFrequency === 'semimonthly' && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">2nd Day of Month</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formDayOfMonth2}
                    onChange={(e) => setFormDayOfMonth2(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-gray-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg cursor-pointer"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
