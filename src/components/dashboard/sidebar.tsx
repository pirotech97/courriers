'use client';

import {
  Mail,
  LayoutDashboard,
  FileText,
  PlusCircle,
  BarChart3,
  HelpCircle,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'liste', label: 'Liste des courriers', icon: FileText },
  { id: 'nouveau', label: 'Nouveau courrier', icon: PlusCircle },
  { id: 'rapports', label: 'Rapports', icon: BarChart3 },
];

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className={cn(
      "h-screen w-64 flex flex-col",
      "bg-white dark:bg-[#12121f] border-r border-gray-200 dark:border-[#2a2a3d]"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-gray-200 dark:border-[#2a2a3d]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shrink-0">
            <Mail className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white truncate">
            Courriers
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-all duration-200",
                isActive
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a3d] hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Support Card */}
      <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-[#1e3a5f] dark:to-[#2d1f4e] border border-blue-100 dark:border-[#2a2a3d]">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 shrink-0">
            <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              Besoin d&apos;aide?
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Consultez notre guide
            </p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-white dark:bg-[#2a2a3d] rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#3a3a4d] transition-colors border border-gray-200 dark:border-[#3a3a4d]">
          <span>Voir le guide</span>
          <ChevronRight className="h-4 w-4 shrink-0" />
        </button>
      </div>
    </aside>
  );
}
