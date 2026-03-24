'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Calendar, ChevronDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSyncExternalStore, useMemo } from 'react';

// Empty subscription for client-only rendering
const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);

  const today = useMemo(() => new Date(), []);
  const dateRange = useMemo(() => {
    return `${today.getDate()} ${today.toLocaleDateString('fr-FR', { month: 'short' })} - ${(today.getDate() + 6)} ${today.toLocaleDateString('fr-FR', { month: 'short' })} ${today.getFullYear()}`;
  }, [today]);

  return (
    <header className={cn(
      "sticky top-0 z-30 flex items-center justify-between",
      "h-16 px-6 bg-white/80 dark:bg-[#0f0f1a]/80 backdrop-blur-md",
      "border-b border-gray-200 dark:border-[#2a2a3d]"
    )}>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Vue globale
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Date Range Selector */}
        <button className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl",
          "bg-gray-100 dark:bg-[#2a2a3d] text-gray-700 dark:text-gray-300",
          "hover:bg-gray-200 dark:hover:bg-[#3a3a4d] transition-colors",
          "text-sm font-medium"
        )}>
          <Calendar className="h-4 w-4" />
          <span>{dateRange}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
              "flex items-center justify-center h-10 w-10 rounded-xl",
              "bg-gray-100 dark:bg-[#2a2a3d] text-gray-700 dark:text-gray-300",
              "hover:bg-gray-200 dark:hover:bg-[#3a3a4d] transition-colors"
            )}
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        )}

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-[#2a2a3d]">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Administrateur
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Gestionnaire
            </p>
          </div>
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
          )}>
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
