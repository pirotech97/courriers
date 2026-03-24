'use client';

import { useState, useMemo } from 'react';
import { 
  Download, 
  FileText, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { useCourriersStore } from '@/store/courriers-store';
import { exportToCSV, exportToPDF } from '@/lib/export-utils';
import { monthlyData, yearlyTrendData } from '@/lib/courriers-data';

export function RapportsPage() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const courriers = useCourriersStore((state) => state.courriers);

  // Calculate statistics from real data
  const stats = useMemo(() => {
    const total = courriers.length;
    const confirmes = courriers.filter(c => c.statut === 'Confirmé').length;
    const recus = courriers.filter(c => c.statut === 'Reçu').length;
    const enAttente = courriers.filter(c => c.statut === 'En attente').length;
    const relances = courriers.filter(c => c.statut === 'Relance').length;
    const paysUniques = new Set(courriers.filter(c => c.pays !== '—').map(c => c.pays)).size;
    
    return { total, confirmes, recus, enAttente, relances, paysUniques };
  }, [courriers]);

  // Status distribution from real data
  const statusData = useMemo(() => [
    { name: 'Confirmé', value: stats.confirmes, color: '#10b981' },
    { name: 'Reçu', value: stats.recus, color: '#3b82f6' },
    { name: 'En attente', value: stats.enAttente, color: '#f59e0b' },
    { name: 'Relance', value: stats.relances, color: '#ef4444' },
  ], [stats]);

  // Country distribution from real data
  const countryData = useMemo(() => {
    const countryCounts: Record<string, number> = {};
    courriers.forEach(c => {
      const pays = c.pays === '—' ? 'Non spécifié' : c.pays;
      countryCounts[pays] = (countryCounts[pays] || 0) + 1;
    });
    
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#64748b'];
    
    return Object.entries(countryCounts)
      .map(([pays, count], index) => ({
        pays,
        count,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.count - a.count);
  }, [courriers]);

  // Monthly stats for the selected year
  const monthlyStats = useMemo(() => {
    return monthlyData.map(m => ({
      ...m,
      traités: Math.floor(m.courriers * 0.65)
    }));
  }, []);

  // Export handlers
  const handleExportCSV = () => {
    exportToCSV(courriers, `rapport_courriers_${selectedYear}`);
  };

  const handleExportPDF = () => {
    exportToPDF(courriers, `Rapport des Courriers - ${selectedYear}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Rapports
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Analyse et export des données de courriers
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className={cn(
                "px-4 py-2 rounded-xl",
                "bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-[#2a2a3d]",
                "text-gray-700 dark:text-gray-300",
                "focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              )}
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          
          {/* Export Buttons */}
          <Button 
            variant="outline"
            onClick={handleExportPDF}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
          <Button 
            onClick={handleExportCSV}
            className="gap-2 bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          label="Total courriers"
          value={stats.total}
          icon={FileText}
          color="blue"
          trend="+12%"
          trendUp={true}
        />
        <SummaryCard 
          label="Taux de confirmation"
          value={stats.total > 0 ? `${Math.round((stats.confirmes / stats.total) * 100)}%` : '0%'}
          icon={TrendingUp}
          color="green"
          trend="+8%"
          trendUp={true}
        />
        <SummaryCard 
          label="Pays actifs"
          value={stats.paysUniques}
          icon={Globe}
          color="purple"
          trend="+2"
          trendUp={true}
        />
        <SummaryCard 
          label="En attente"
          value={stats.enAttente}
          icon={PieChart}
          color="amber"
          trend="-5%"
          trendUp={false}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Activity */}
        <div className={cn(
          "p-6 rounded-2xl",
          "bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#2a2a3d]"
        )}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-500" />
              Courriers par mois
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Année {selectedYear}
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats}>
                <defs>
                  <linearGradient id="blueBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="greenBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="mois" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1e2e',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar dataKey="courriers" name="Total" fill="url(#blueBarGradient)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="traités" name="Traités" fill="url(#greenBarGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className={cn(
          "p-6 rounded-2xl",
          "bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#2a2a3d]"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-500" />
            Répartition par statut
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1e2e',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [`${value} courriers`, '']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-gray-600 dark:text-gray-300">{value}</span>}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Country Distribution */}
        <div className={cn(
          "p-6 rounded-2xl",
          "bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#2a2a3d]"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Globe className="h-5 w-5 text-cyan-500" />
            Répartition par pays
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis 
                  type="number"
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  type="category"
                  dataKey="pays" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1e2e',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [`${value} courriers`, '']}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {countryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly Trend */}
        <div className={cn(
          "p-6 rounded-2xl",
          "bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#2a2a3d]"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Évolution annuelle
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearlyTrendData}>
                <defs>
                  <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="confirmedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="année" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1e2e',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  name="Total"
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#totalGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="confirmés" 
                  name="Confirmés"
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="url(#confirmedGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className={cn(
        "rounded-2xl overflow-hidden",
        "bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#2a2a3d]"
      )}>
        <div className="p-6 border-b border-gray-100 dark:border-[#2a2a3d]">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Statistiques détaillées
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#2a2a3d]/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Indicateur
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Valeur
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Pourcentage
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Tendance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2a2a3d]">
              <StatRow 
                label="Courriers confirmés" 
                value={stats.confirmes} 
                total={stats.total}
                trend="+15%"
                trendUp={true}
                color="#10b981"
              />
              <StatRow 
                label="Courriers reçus" 
                value={stats.recus} 
                total={stats.total}
                trend="+59%"
                trendUp={true}
                color="#3b82f6"
              />
              <StatRow 
                label="Courriers en attente" 
                value={stats.enAttente} 
                total={stats.total}
                trend="-5%"
                trendUp={false}
                color="#f59e0b"
              />
              <StatRow 
                label="Relances nécessaires" 
                value={stats.relances} 
                total={stats.total}
                trend="0%"
                trendUp={null}
                color="#ef4444"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Summary Card Component
interface SummaryCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'amber';
  trend: string;
  trendUp: boolean;
}

function SummaryCard({ label, value, icon: Icon, color, trend, trendUp }: SummaryCardProps) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-600 dark:text-green-400',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400',
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400',
    }
  };

  return (
    <div className={cn(
      "p-5 rounded-2xl",
      "bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#2a2a3d]"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("p-2.5 rounded-xl", colorMap[color].bg)}>
          <Icon className={cn("h-5 w-5", colorMap[color].text)} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            <span className={cn(
              "flex items-center text-xs font-medium",
              trendUp ? "text-green-500" : trendUp === null ? "text-gray-500" : "text-red-500"
            )}>
              {trendUp ? <TrendingUp className="h-3 w-3 mr-0.5" /> : trendUp === null ? null : <TrendingDown className="h-3 w-3 mr-0.5" />}
              {trend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Row Component
interface StatRowProps {
  label: string;
  value: number;
  total: number;
  trend: string;
  trendUp: boolean | null;
  color: string;
}

function StatRow({ label, value, total, trend, trendUp, color }: StatRowProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-[#2a2a3d]/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {value}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
          / {total}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-100 dark:bg-[#2a2a3d] rounded-full overflow-hidden max-w-[120px]">
            <div 
              className="h-full rounded-full transition-all"
              style={{ width: `${percentage}%`, backgroundColor: color }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-12">
            {percentage}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={cn(
          "flex items-center text-sm font-medium",
          trendUp === true ? "text-green-500" : trendUp === false ? "text-red-500" : "text-gray-500"
        )}>
          {trendUp === true && <TrendingUp className="h-4 w-4 mr-1" />}
          {trendUp === false && <TrendingDown className="h-4 w-4 mr-1" />}
          {trend}
        </span>
      </td>
    </tr>
  );
}
