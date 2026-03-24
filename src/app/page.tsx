'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Loader2 } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { ListeCourriersPage } from '@/components/dashboard/liste-courriers-page';
import { NouveauCourrierPage } from '@/components/dashboard/nouveau-courrier-page';
import { RapportsPage } from '@/components/dashboard/rapports-page';
import { useCourriersStore, useHydration } from '@/store/courriers-store';
import { cn } from '@/lib/utils';

export default function Home() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const initializeData = useCourriersStore((state) => state.initializeData);
  const isLoading = useCourriersStore((state) => state.isLoading);
  const hasHydrated = useHydration();

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handlePageChange = (page: string) => {
    setActivePage(page);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handlePageChange} />;
      case 'liste':
        return <ListeCourriersPage />;
      case 'nouveau':
        return <NouveauCourrierPage onSuccess={() => handlePageChange('liste')} />;
      case 'rapports':
        return <RapportsPage />;
      default:
        return <DashboardPage onNavigate={handlePageChange} />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7fc] dark:bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fc] dark:bg-[#0f0f1a]">
      {/* Mobile Header */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 right-0 z-50 h-16",
        "bg-white dark:bg-[#1e1e2e] border-b border-gray-200 dark:border-[#2a2a3d]",
        "flex items-center justify-between px-4"
      )}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a3d]"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 dark:text-white">Courriers</span>
        </div>
        
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-transform duration-300",
        "lg:translate-x-0",
        isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
      )}>
        <Sidebar activePage={activePage} onPageChange={handlePageChange} />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        {/* Top Bar - Desktop only */}
        <div className="hidden lg:block">
          <TopBar />
        </div>
        
        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
