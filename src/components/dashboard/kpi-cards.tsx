'use client';

import { 
  Mail, 
  CheckCircle, 
  Clock, 
  Globe,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  donutData?: { value: number; color: string }[];
  donutTotal?: number;
}

function KPICard({ title, value, icon, trend, donutData, donutTotal }: KPICardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-white dark:bg-[#1e1e2e] p-4 sm:p-6",
      "border border-gray-100 dark:border-[#2a2a3d]",
      "shadow-sm hover:shadow-md transition-shadow duration-300"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs sm:text-sm font-medium",
              trend.isPositive ? "text-green-500" : trend.value === 0 ? "text-gray-500" : "text-red-500"
            )}>
              {trend.value > 0 ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : trend.value < 0 ? (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="hidden xs:inline">
                {trend.value > 0 ? `+${trend.value}%` : trend.value < 0 ? `${trend.value}%` : '0%'}
              </span>
              <span className="text-gray-500 dark:text-gray-400 font-normal hidden sm:inline">
                depuis le mois dernier
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl shrink-0",
          "bg-blue-50 dark:bg-blue-900/20 text-blue-500"
        )}>
          {icon}
        </div>
      </div>
      
      {/* Mini donut chart - hidden on very small screens */}
      {donutData && donutTotal && donutTotal > 0 && (
        <div className="absolute right-4 sm:right-6 bottom-3 sm:bottom-4 h-12 w-12 sm:h-16 sm:w-16 hidden xs:block">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={16}
                outerRadius={24}
                paddingAngle={2}
                dataKey="value"
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

interface KPICardsProps {
  totalCourriers: number;
  confirmes: number;
  enAttente: number;
  paysRepresentes: number;
}

export function KPICards({ totalCourriers, confirmes, enAttente, paysRepresentes }: KPICardsProps) {
  const statusDonutData = totalCourriers > 0 ? [
    { value: confirmes, color: '#10b981' },
    { value: enAttente, color: '#f59e0b' },
    { value: totalCourriers - confirmes - enAttente, color: '#3b82f6' },
  ] : [];

  const countryDonutData = [
    { value: 11, color: '#3b82f6' }, // Togo
    { value: 3, color: '#10b981' },  // Bénin
    { value: 2, color: '#8b5cf6' },  // France
    { value: 2, color: '#f59e0b' },  // USA
    { value: 3, color: '#64748b' },  // Autres
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      <KPICard
        title="Total Courriers"
        value={totalCourriers}
        icon={<Mail className="h-5 w-5 sm:h-6 sm:w-6" />}
        trend={{ value: 12, isPositive: true }}
      />
      <KPICard
        title="Confirmés"
        value={confirmes}
        icon={<CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
        trend={{ value: 8, isPositive: true }}
        donutData={statusDonutData}
        donutTotal={totalCourriers}
      />
      <KPICard
        title="En attente"
        value={enAttente}
        icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6" />}
        trend={{ value: -5, isPositive: false }}
      />
      <KPICard
        title="Pays représentés"
        value={paysRepresentes}
        icon={<Globe className="h-5 w-5 sm:h-6 sm:w-6" />}
        trend={{ value: 15, isPositive: true }}
        donutData={countryDonutData}
        donutTotal={paysRepresentes}
      />
    </div>
  );
}
