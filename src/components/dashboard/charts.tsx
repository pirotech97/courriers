'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

// Bar Chart Component
interface BarChartCardProps {
  data: { mois: string; courriers: number; relances: number }[];
  title: string;
  year?: string;
}

export function BarChartCard({ data, title, year = '2026' }: BarChartCardProps) {
  return (
    <div className={cn(
      "rounded-2xl bg-white dark:bg-[#1e1e2e] p-4 sm:p-6",
      "border border-gray-100 dark:border-[#2a2a3d]",
      "shadow-sm"
    )}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <select className={cn(
          "px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium",
          "bg-gray-100 dark:bg-[#2a2a3d] text-gray-700 dark:text-gray-300",
          "border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer w-fit"
        )}>
          <option>{year}</option>
          <option>2025</option>
          <option>2024</option>
        </select>
      </div>
      <div className="h-56 sm:h-64 lg:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="mois" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e1e2e',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="courriers" 
              fill="url(#blueGradient)" 
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Area Chart Component
interface AreaChartCardProps {
  data: { jour: string; activite: number }[];
  title: string;
}

export function AreaChartCard({ data, title }: AreaChartCardProps) {
  return (
    <div className={cn(
      "rounded-2xl bg-white dark:bg-[#1e1e2e] p-4 sm:p-6",
      "border border-gray-100 dark:border-[#2a2a3d]",
      "shadow-sm"
    )}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="h-40 sm:h-48 lg:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="jour" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e1e2e',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="activite" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              fill="url(#purpleGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Circular Progress Card
interface CircularProgressCardProps {
  title: string;
  value: number;
  total: number;
  percentage: number;
  trend: number;
  color: string;
}

export function CircularProgressCard({ title, value, total, percentage, trend, color }: CircularProgressCardProps) {
  const data = [
    { value: percentage },
    { value: 100 - percentage }
  ];
  
  const COLORS = [color, '#e5e7eb'];

  return (
    <div className={cn(
      "rounded-2xl bg-white dark:bg-[#1e1e2e] p-4 sm:p-6",
      "border border-gray-100 dark:border-[#2a2a3d]",
      "shadow-sm"
    )}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
          {title}
        </h3>
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-semibold shrink-0",
          "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        )}>
          +{trend}%
        </span>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={36}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {percentage}%
            </span>
          </div>
        </div>
        
        <div className="min-w-0">
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            sur {total} total
          </p>
        </div>
      </div>
    </div>
  );
}
