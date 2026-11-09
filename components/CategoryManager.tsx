'use client';

import React, { useState } from 'react';
import {
  ForecastItem,
  CategoryType,
  RecurrenceFrequency,
  CATEGORY_LABELS,
  FREQUENCY_LABELS,
} from '@/lib/forecast-engine';
import { Plus, Trash2, Edit2, Check, X, Filter, ToggleLeft, ToggleRight, DollarSign } from 'lucide-react';

interface CategoryManagerProps {
  items: ForecastItem[];
  onAddItem: (item: Omit<ForecastItem, 'id'>) => void;
  onUpdateItem: (item: ForecastItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleItemActive: (id: string) => void;
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleItemActive,
  isAddModalOpen,
  onCloseAddModal,
}) => {
  const [selectedTab, setSelectedTab] = useState<CategoryType | 'all'>('all');
  const [editingItem, setEditingItem] = useState<ForecastItem | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryType>('income');
  const [formFrequency, setFormFrequency] = useState<RecurrenceFrequency>('monthly');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [formDayOfMonth, setFormDayOfMonth] = useState('1');
  const [formDayOfMonth2, setFormDayOfMonth2] = useState('15');

  const openCreateModal = () => {
    setFormName('');
    setFormAmount('');
    setFormCategory(selectedTab === 'all' ? 'income' : selectedTab);
    setFormFrequency('monthly');
    setFormStartDate(new Date().toISOString().slice(0, 10));
    setFormDayOfMonth('1');
    setFormDayOfMonth2('15');
    setEditingItem(null);
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
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(formAmount);
    if (!formName.trim() || isNaN(amountVal) || amountVal <= 0) {
      alert('Please enter a valid item name and amount.');
      return;
    }

    const itemData = {
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
      onUpdateItem({
        ...editingItem,
        ...itemData,
      });
      setEditingItem(null);
    } else {
      onAddItem(itemData);
      onCloseAddModal();
    }
  };

  const filteredItems = selectedTab === 'all' ? items : items.filter((i) => i.category === selectedTab);

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-100">Recurring Payments & Income Categories</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage recurring entries across your 5 core forecast categories
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Item</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-gray-800 mb-4 text-xs">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
            selectedTab === 'all'
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
          }`}
        >
          All Items ({items.length})
        </button>

        {(['income', 'fixed_expense', 'subscription', 'liability', 'savings', 'spend'] as CategoryType[]).map(
          (cat) => {
            const count = items.filter((i) => i.category === cat).length;
            const isSelected = selectedTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedTab(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`}
              >
                {CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          }
        )}
      </div>

      {/* Item List */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs">
            No items listed under this category. Click &quot;New Item&quot; to add one.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 bg-gray-900/60 border border-gray-800 rounded-lg flex flex-wrap items-center justify-between gap-3 transition-colors ${
                !item.active ? 'opacity-40 bg-gray-950/40' : 'hover:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleItemActive(item.id)}
                  className="text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  title={item.active ? 'Click to pause item' : 'Click to enable item'}
                >
                  {item.active ? (
                    <ToggleRight className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-600" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-100">{item.name}</span>
                    <span className="text-[10px] font-medium bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                      {CATEGORY_LABELS[item.category]}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 mt-0.5">
                    <span>Schedule: <strong className="text-gray-300">{FREQUENCY_LABELS[item.frequency]}</strong></span>
                    <span>Starting: <strong className="text-gray-300">{item.startDate}</strong></span>
                  </div>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center gap-4">
                <span className={`font-mono text-base font-bold ${item.category === 'income' ? 'text-emerald-400' : 'text-gray-200'}`}>
                  {item.category === 'income' ? '+' : '-'}${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-md transition-colors"
                    title="Edit item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete "${item.name}"?`)) {
                        onDeleteItem(item.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-md transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Item Modal */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <h3 className="text-base font-semibold text-gray-100">
                {editingItem ? 'Edit Recurring Entry' : 'Add New Recurring Entry'}
              </h3>
              <button
                onClick={() => {
                  setEditingItem(null);
                  onCloseAddModal();
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Primary Salary, Apartment Rent, Internet"
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
                  <label className="block text-xs font-medium text-gray-300 mb-1">First Date</label>
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
                    setEditingItem(null);
                    onCloseAddModal();
                  }}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
