'use client';

import React, { useState } from 'react';
import {
  ForecastItem,
  CategoryType,
  RecurrenceFrequency,
  CATEGORY_LABELS,
  FREQUENCY_LABELS,
} from '@/lib/forecast-engine';
import { Plus, Trash2, Edit2, Search, ToggleLeft, ToggleRight, X } from 'lucide-react';

export type ScreenType = 'forecast' | 'income' | 'expenses' | 'liabilities' | 'savings-spend';

interface ManagementScreenProps {
  screenType: ScreenType;
  items: ForecastItem[];
  onAddItem: (item: Omit<ForecastItem, 'id'>) => void;
  onUpdateItem: (item: ForecastItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleItemActive: (id: string) => void;
}

export const ManagementScreen: React.FC<ManagementScreenProps> = ({
  screenType,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleItemActive,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ForecastItem | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryType>('income');
  const [formFrequency, setFormFrequency] = useState<RecurrenceFrequency>('monthly');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [formDayOfMonth, setFormDayOfMonth] = useState('1');
  const [formDayOfMonth2, setFormDayOfMonth2] = useState('15');

  const targetCategories: CategoryType[] = (() => {
    switch (screenType) {
      case 'income':
        return ['income'];
      case 'expenses':
        return ['fixed_expense', 'subscription'];
      case 'liabilities':
        return ['liability'];
      case 'savings-spend':
        return ['savings', 'spend'];
      default:
        return ['income'];
    }
  })();

  const screenTitle = (() => {
    switch (screenType) {
      case 'income':
        return 'Income';
      case 'expenses':
        return 'Expenses';
      case 'liabilities':
        return 'Liabilities';
      case 'savings-spend':
        return 'Savings & Spend';
      default:
        return 'Items';
    }
  })();

  const openAddModal = (defaultCategory?: CategoryType) => {
    setFormName('');
    setFormAmount('');
    setFormCategory(defaultCategory || targetCategories[0]);
    setFormFrequency('monthly');
    setFormStartDate(new Date().toISOString().slice(0, 10));
    setFormDayOfMonth('1');
    setFormDayOfMonth2('15');
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ForecastItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormAmount(item.amount.toString());
    setFormCategory(item.category);
    setFormFrequency(item.frequency);
    setFormStartDate(item.startDate);
    setFormDayOfMonth((item.dayOfMonth || 1).toString());
    setFormDayOfMonth2((item.dayOfMonth2 || 15).toString());
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(formAmount);
    if (!formName.trim() || isNaN(amountVal) || amountVal <= 0) {
      alert('Please enter a name and positive amount.');
      return;
    }

    const payload = {
      name: formName.trim(),
      amount: amountVal,
      category: formCategory,
      frequency: formFrequency,
      startDate: formStartDate,
      dayOfMonth: parseInt(formDayOfMonth, 10) || 1,
      dayOfMonth2: parseInt(formDayOfMonth2, 10) || 15,
      active: true,
    };

    if (editingItem) {
      onUpdateItem({ ...editingItem, ...payload });
    } else {
      onAddItem(payload);
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const filteredItems = items
    .filter((i) => targetCategories.includes(i.category))
    .filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 mb-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-800 mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-100">{screenTitle}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-xs text-white rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={() => openAddModal()}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Item List */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center text-xs text-gray-500 border border-dashed border-gray-800 rounded-xl bg-gray-900/40">
          <p className="text-sm font-semibold text-gray-300 mb-2">No Items Added</p>
          <button
            onClick={() => openAddModal()}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 bg-gray-900/80 border border-gray-800 rounded-lg flex flex-wrap items-center justify-between gap-4 transition-all ${
                !item.active ? 'opacity-40 bg-gray-950/40' : 'hover:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  onClick={() => onToggleItemActive(item.id)}
                  className="text-gray-400 hover:text-emerald-400 cursor-pointer"
                  title={item.active ? 'Disable item' : 'Enable item'}
                >
                  {item.active ? (
                    <ToggleRight className="w-7 h-7 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-gray-600" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-100">{item.name}</span>
                    <span className="text-[10px] font-medium bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                      {CATEGORY_LABELS[item.category]}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>Schedule: <strong className="text-gray-300">{FREQUENCY_LABELS[item.frequency]}</strong></span>
                    <span>Starts: <strong className="text-gray-300">{item.startDate}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <span className={`font-mono text-base font-bold ${item.category === 'income' ? 'text-emerald-400' : 'text-gray-200'}`}>
                  {item.category === 'income' ? '+' : '-'}${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-md transition"
                    title="Edit item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Remove "${item.name}"?`)) {
                        onDeleteItem(item.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-md transition"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <h3 className="text-base font-semibold text-gray-100">
                {editingItem ? 'Edit Item' : 'Add Item'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Salary, Rent"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
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
                    {targetCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </option>
                    ))}
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
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
