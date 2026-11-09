'use client';

import React, { useState } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
        title="Install app on home screen or desktop"
      >
        <Download className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-xl bg-[#111827] border border-gray-800 p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Install on iPhone / iPad</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-3 text-xs text-gray-300">
                <div className="flex items-start gap-2.5 p-2.5 bg-gray-900 rounded-lg border border-gray-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px]">
                    1
                  </span>
                  <p>
                    Tap the <strong>Share</strong> icon in the Safari toolbar at the bottom.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-gray-900 rounded-lg border border-gray-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px]">
                    2
                  </span>
                  <p>
                    Scroll down and select <strong>Add to Home Screen</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-gray-800 hover:bg-gray-700 py-2 text-xs font-medium text-white"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
