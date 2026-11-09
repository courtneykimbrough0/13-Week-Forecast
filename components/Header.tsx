'use client';

import React, { useState } from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { ScreenType } from './ManagementScreen';
import { Download, Upload, RotateCcw, Plus, LayoutDashboard, ArrowUpRight, CreditCard, Receipt, PiggyBank, Trash2, UserCheck, LogOut } from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigateScreen: (screen: ScreenType) => void;
  onResetSampleData: () => void;
  onClearData: () => void;
  onExportJSON: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddNewItem: () => void;
  totalItemsCount: number;
  userEmail: string | null;
  onOpenLoginPage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigateScreen,
  onClearData,
  onExportJSON,
  onImportJSON,
  onAddNewItem,
  totalItemsCount,
  userEmail,
  onOpenLoginPage,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="border-b border-gray-800/80 bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
            13
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-100 tracking-tight leading-none">
              13-Week Cash Forecast
            </h1>
          </div>
        </div>

        {/* Screen Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-900/90 border border-gray-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => onNavigateScreen('forecast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              currentScreen === 'forecast'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Forecast</span>
          </button>

          <button
            onClick={() => onNavigateScreen('income')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              currentScreen === 'income'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Income</span>
          </button>

          <button
            onClick={() => onNavigateScreen('expenses')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              currentScreen === 'expenses'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Expenses</span>
          </button>

          <button
            onClick={() => onNavigateScreen('liabilities')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              currentScreen === 'liabilities'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Liabilities</span>
          </button>

          <button
            onClick={() => onNavigateScreen('savings-spend')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              currentScreen === 'savings-spend'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Savings &amp; Spend</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onAddNewItem}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Item</span>
          </button>

          <PWAInstallButton />

          <button
            onClick={onOpenLoginPage}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition border border-gray-800 flex items-center gap-1 text-xs"
            title={userEmail ? `Signed in as ${userEmail}` : 'Login / Sales Page'}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline text-[11px] text-gray-300">
              {userEmail ? userEmail.split('@')[0] : 'Login Page'}
            </span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition border border-gray-800"
            title="Options"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Screen Bar */}
      <div className="flex md:hidden items-center justify-around border-t border-gray-800/80 bg-gray-950 px-2 py-1.5 text-[11px]">
        <button
          onClick={() => onNavigateScreen('forecast')}
          className={`px-2 py-1 rounded ${currentScreen === 'forecast' ? 'text-emerald-400 font-semibold' : 'text-gray-400'}`}
        >
          Forecast
        </button>
        <button
          onClick={() => onNavigateScreen('income')}
          className={`px-2 py-1 rounded ${currentScreen === 'income' ? 'text-emerald-400 font-semibold' : 'text-gray-400'}`}
        >
          Income
        </button>
        <button
          onClick={() => onNavigateScreen('expenses')}
          className={`px-2 py-1 rounded ${currentScreen === 'expenses' ? 'text-emerald-400 font-semibold' : 'text-gray-400'}`}
        >
          Expenses
        </button>
        <button
          onClick={() => onNavigateScreen('liabilities')}
          className={`px-2 py-1 rounded ${currentScreen === 'liabilities' ? 'text-emerald-400 font-semibold' : 'text-gray-400'}`}
        >
          Liabilities
        </button>
        <button
          onClick={() => onNavigateScreen('savings-spend')}
          className={`px-2 py-1 rounded ${currentScreen === 'savings-spend' ? 'text-emerald-400 font-semibold' : 'text-gray-400'}`}
        >
          Savings
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <h3 className="text-base font-semibold text-white">Data Options</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">
                  Backup &amp; Restore
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onExportJSON}
                    className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-200 px-3 py-2 rounded-lg text-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Export Backup</span>
                  </button>

                  <label className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-200 px-3 py-2 rounded-lg text-xs cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Import Backup</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        onImportJSON(e);
                        setShowSettings(false);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">
                  Account / Sales Page
                </h4>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    onOpenLoginPage();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-200 px-3 py-2 rounded-lg text-xs mb-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Sales / Login Page</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all items?')) {
                      onClearData();
                      setShowSettings(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-300 px-3 py-2 rounded-lg text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Clear All Items ({totalItemsCount})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
