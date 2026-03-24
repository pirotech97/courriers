'use client';

import { useState } from 'react';
import { KPICards } from './kpi-cards';
import { BarChartCard, AreaChartCard, CircularProgressCard } from './charts';
import { CourriersTable } from './courriers-table';
import { useCourriersStore } from '@/store/courriers-store';
import { monthlyData, activiteRelanceData } from '@/lib/courriers-data';
import { RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardPageProps {
  onNavigate?: (page: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const courriers = useCourriersStore((state) => state.courriers);
  const isLoading = useCourriersStore((state) => state.isLoading);
  const initializeData = useCourriersStore((state) => state.initializeData);

  // Calculate KPIs from store
  const totalCourriers = courriers.length;
  const confirmes = courriers.filter(c => c.statut === 'Confirmé').length;
  const enAttente = courriers.filter(c => c.statut === 'En attente').length;
  const recus = courriers.filter(c => c.statut === 'Reçu').length;
  const paysRepresentes = new Set(courriers.filter(c => c.pays !== '—').map(c => c.pays)).size;

  const handleRefresh = async () => {
    await initializeData();
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading && courriers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-500">Chargement des données...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" key={refreshKey}>
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Vue globale
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Aperçu de l&apos;activité des courriers
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl",
            "bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-[#2a2a3d]",
            "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2a3d]",
            "transition-colors text-sm font-medium",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Actualiser
        </button>
      </div>

      {/* KPI Cards */}
      <KPICards 
        totalCourriers={totalCourriers}
        confirmes={confirmes}
        enAttente={enAttente}
        paysRepresentes={paysRepresentes}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BarChartCard 
          data={monthlyData} 
          title="Dynamique des courriers"
          year="2026"
        />
        <AreaChartCard 
          data={activiteRelanceData} 
          title="Activité globale"
        />
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CircularProgressCard
          title="Courriers traités"
          value={confirmes + recus}
          total={totalCourriers}
          percentage={totalCourriers > 0 ? Math.round(((confirmes + recus) / totalCourriers) * 100) : 0}
          trend={15}
          color="#10b981"
        />
        <CircularProgressCard
          title="Courriers reçus"
          value={recus}
          total={totalCourriers}
          percentage={totalCourriers > 0 ? Math.round((recus / totalCourriers) * 100) : 0}
          trend={59}
          color="#3b82f6"
        />
      </div>

      {/* Table Preview */}
      <div className={cn(
        "rounded-2xl bg-white dark:bg-[#1e1e2e]",
        "border border-gray-100 dark:border-[#2a2a3d]",
        "shadow-sm overflow-hidden"
      )}>
        <CourriersTable 
          courriers={courriers} 
          maxRows={5}
          showViewAll={true}
          onViewAll={() => onNavigate?.('liste')}
        />
      </div>
    </div>
  );
}
