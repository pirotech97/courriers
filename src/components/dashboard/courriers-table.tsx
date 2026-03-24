'use client';

import { RefreshCw, Eye, Pencil, Trash2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Courrier, Statut } from '@/lib/courriers-data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCourriersStore } from '@/store/courriers-store';

interface CourriersTableProps {
  courriers: Courrier[];
  onRefresh?: () => void;
  showActions?: boolean;
  maxRows?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  onView?: (courrier: Courrier) => void;
  onEdit?: (courrier: Courrier) => void;
  onDelete?: (courrier: Courrier) => void;
}

const statusConfig: Record<Statut, { bg: string; text: string; border: string }> = {
  'Confirmé': {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800'
  },
  'En attente': {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800'
  },
  'Relance': {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800'
  },
  'Reçu': {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800'
  }
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function CourriersTable({ 
  courriers, 
  onRefresh, 
  showActions = false, 
  maxRows,
  showViewAll = false,
  onViewAll,
  onView,
  onEdit,
  onDelete
}: CourriersTableProps) {
  const displayCourriers = maxRows ? courriers.slice(0, maxRows) : courriers;

  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#2a2a3d]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Liste des courriers
        </h3>
        <button 
          onClick={onRefresh}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
            "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a3d]",
            "transition-colors"
          )}
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#2a2a3d]/50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Profil
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pays
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Montant
              </th>
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#2a2a3d]">
            {displayCourriers.map((courrier, index) => {
              const status = statusConfig[courrier.statut];
              
              return (
                <tr 
                  key={courrier.id}
                  className={cn(
                    "transition-colors hover:bg-gray-50 dark:hover:bg-[#2a2a3d]/30",
                    index % 2 === 0 ? 'bg-white dark:bg-[#1e1e2e]' : 'bg-gray-50/50 dark:bg-[#1e1e2e]/50'
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className={cn(
                          "text-xs font-semibold",
                          "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                        )}>
                          {getInitials(courrier.nom)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {courrier.nom}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {courrier.contact || '—'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {courrier.pays}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {courrier.dateRemise}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex px-3 py-1 rounded-full text-xs font-semibold border",
                      status.bg, status.text, status.border
                    )}>
                      {courrier.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {courrier.montant}
                    </span>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => onView?.(courrier)}
                          className="p-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onEdit?.(courrier)}
                          className="p-2 rounded-lg text-gray-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onDelete?.(courrier)}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {showViewAll && courriers.length > (maxRows || 5) && (
        <div className="p-4 border-t border-gray-100 dark:border-[#2a2a3d]">
          <button
            onClick={onViewAll}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium",
              "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            )}
          >
            Voir tout ({courriers.length} courriers)
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
