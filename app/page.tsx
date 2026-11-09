'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ForecastItem,
  calculate13WeekForecast,
  getMonday,
} from '@/lib/forecast-engine';
import {
  auth,
  logoutFirebase,
  subscribeUserItems,
  saveItemToFirestore,
  deleteItemFromFirestore,
  validateFirestoreConnection,
} from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Header } from '@/components/Header';
import { SummaryCards } from '@/components/SummaryCards';
import { ShortfallAlert } from '@/components/ShortfallAlert';
import { WeeklyGrid } from '@/components/WeeklyGrid';
import { ManagementScreen, ScreenType } from '@/components/ManagementScreen';
import { AddItemModal } from '@/components/AddItemModal';
import { LoginPage } from '@/components/LoginPage';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Plus, ArrowRight, Calendar, Wifi, WifiOff, CheckCircle2 } from 'lucide-react';

export default function ForecastApp() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('forecast');
  const [items, setItems] = useState<ForecastItem[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [viewingLogin, setViewingLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const isOnline = useOnlineStatus();

  // Anchor Monday: Current week's Monday
  const anchorMonday = useMemo(() => {
    return getMonday(new Date());
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    // Validate connection
    validateFirestoreConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setViewingLogin(false);
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribeAuth();
    };
  }, []);

  // Subscribe to real-time Firestore items when logged in, or load from localStorage when guest
  useEffect(() => {
    if (!isMounted) return;

    if (user) {
      // Real-time Firestore Sync
      const unsubscribeItems = subscribeUserItems(
        user.uid,
        (cloudItems) => {
          setItems(cloudItems);
        },
        (error) => {
          console.error('Firestore items sync error:', error);
        }
      );
      return () => unsubscribeItems();
    } else {
      // Guest mode: localStorage fallback wrapped in setTimeout
      const timer = setTimeout(() => {
        try {
          const saved = localStorage.getItem('cashforecast_items_v2');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setItems(parsed);
              return;
            }
          }
          setItems([]);
        } catch (e) {
          console.error('Failed to load guest items:', e);
          setItems([]);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user, isMounted]);

  // Save guest items to localStorage when updated
  useEffect(() => {
    if (!isMounted || user) return;
    try {
      localStorage.setItem('cashforecast_items_v2', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving guest forecast items:', e);
    }
  }, [items, user, isMounted]);

  // Compute 13-week forecast data
  const { weeks, summary } = useMemo(() => {
    return calculate13WeekForecast(items, anchorMonday);
  }, [items, anchorMonday]);

  // Item management callbacks
  const handleAddItem = async (newItem: Omit<ForecastItem, 'id'>) => {
    const newId = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    const itemWithId: ForecastItem = {
      ...newItem,
      id: newId,
    };

    if (user) {
      await saveItemToFirestore(user.uid, itemWithId);
    } else {
      setItems((prev) => [...prev, itemWithId]);
    }
  };

  const handleUpdateItem = async (updated: ForecastItem) => {
    if (user) {
      await saveItemToFirestore(user.uid, updated);
    } else {
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (user) {
      await deleteItemFromFirestore(user.uid, id);
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleToggleItemActive = async (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const updated = { ...target, active: !target.active };

    if (user) {
      await saveItemToFirestore(user.uid, updated);
    } else {
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    }
  };

  const handleClearData = async () => {
    if (user) {
      for (const item of items) {
        await deleteItemFromFirestore(user.uid, item.id);
      }
    } else {
      setItems([]);
      try {
        localStorage.removeItem('cashforecast_items_v2');
      } catch (e) {}
    }
  };

  const handleExportJSON = () => {
    const exportData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      user: user?.email || 'guest',
      items,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cash_forecast_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.items)) {
          if (user) {
            for (const item of parsed.items) {
              await saveItemToFirestore(user.uid, item);
            }
          } else {
            setItems(parsed.items);
          }
          alert('Items imported successfully!');
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleLogout = async () => {
    await logoutFirebase();
    setItems([]);
  };

  // Prevent hydration mismatch by holding initial render until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#090D16] text-gray-100 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg animate-pulse">
            13
          </div>
          <p className="text-xs text-gray-400 font-medium">Loading your forecast...</p>
        </div>
      </div>
    );
  }

  // Render Login & Sales Page if explicitly viewing login and not logged in
  if (viewingLogin && !user) {
    return (
      <LoginPage
        onLoginSuccess={() => setViewingLogin(false)}
        onGuestAccess={() => setViewingLogin(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-gray-100 flex flex-col font-sans">
      {/* Header & Screen Navigation */}
      <Header
        currentScreen={currentScreen}
        onNavigateScreen={setCurrentScreen}
        onResetSampleData={handleClearData}
        onClearData={handleClearData}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onAddNewItem={() => setIsAddModalOpen(true)}
        totalItemsCount={summary.totalItemsCount}
        userEmail={user?.email || null}
        onOpenLoginPage={() => {
          if (user) {
            if (confirm(`Logged in as ${user.email}. Do you want to log out?`)) {
              handleLogout();
            }
          } else {
            setViewingLogin(true);
          }
        }}
      />

      {/* Online & Data Status Indicator Bar */}
      <div className="bg-gray-950 border-b border-gray-800/80 px-4 py-1.5 text-center text-[11px] text-gray-400 flex items-center justify-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Online — Data up to date
              {user ? (
                <span className="text-emerald-400 font-medium ml-1">({user.email})</span>
              ) : (
                <span className="ml-1.5">
                  ·{' '}
                  <button
                    onClick={() => setViewingLogin(true)}
                    className="text-emerald-400 hover:underline cursor-pointer font-medium"
                  >
                    Sign in to save online
                  </button>
                </span>
              )}
            </span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Offline — Data up to date on this device</span>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentScreen === 'forecast' && (
          <>
            {/* Empty State Banner */}
            {items.length === 0 && (
              <div className="mb-6 bg-[#111827] border border-gray-800 rounded-xl p-6 text-center shadow-lg">
                <div className="h-12 w-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-gray-100">13-Week Cash Forecast</h3>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-medium cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                  <button
                    onClick={() => setCurrentScreen('income')}
                    className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-4 py-2 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <span>Income</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Shortfall Warning Banner */}
            <ShortfallAlert
              summary={summary}
              weeks={weeks}
              onSelectWeek={setSelectedWeek}
            />

            {/* 4 Summary Cards */}
            <SummaryCards summary={summary} />

            {/* 13-Week Forecast Table with Day Breakdown Modal */}
            <WeeklyGrid
              weeks={weeks}
              selectedWeek={selectedWeek}
              onSelectWeek={setSelectedWeek}
            />
          </>
        )}

        {currentScreen !== 'forecast' && (
          <ManagementScreen
            screenType={currentScreen}
            items={items}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onToggleItemActive={handleToggleItemActive}
          />
        )}
      </main>

      {/* Global Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddItem}
      />

      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Footer */}
      <footer className="border-t border-gray-800/60 py-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>13-Week Cash Forecast</span>
          {!user ? (
            <button
              onClick={() => setViewingLogin(true)}
              className="text-gray-400 hover:text-emerald-400 transition"
            >
              Sales &amp; Login Page
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition"
            >
              Sign Out ({user.email})
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
