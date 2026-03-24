'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Calendar,
  ArrowUpDown,
  RotateCcw,
  Eye,
  Pencil,
  Trash2,
  Loader2
} from 'lucide-react';
import { Courrier, Statut } from '@/lib/courriers-data';
import { useCourriersStore } from '@/store/courriers-store';
import { exportToCSV, exportToPDF, filterCourriers, FilterOptions } from '@/lib/export-utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ViewModal, EditModal, DeleteModal } from './modals';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

export function ListeCourriersPage() {
  // Store
  const courriers = useCourriersStore((state) => state.courriers);
  const isLoading = useCourriersStore((state) => state.isLoading);
  const updateCourrier = useCourriersStore((state) => state.updateCourrier);
  const deleteCourrier = useCourriersStore((state) => state.deleteCourrier);
  const updateStatus = useCourriersStore((state) => state.updateStatus);
  const resetToInitial = useCourriersStore((state) => state.resetToInitial);

  // Filters
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: 'all',
    country: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'nom',
    sortOrder: 'asc'
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [selectedCourrier, setSelectedCourrier] = useState<Courrier | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Get unique countries
  const countries = useMemo(() => {
    const unique = [...new Set(courriers.filter(c => c.pays !== '—').map(c => c.pays))];
    return unique.sort();
  }, [courriers]);

  // Filter courriers
  const filteredCourriers = useMemo(() => {
    return filterCourriers(courriers, filters);
  }, [courriers, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredCourriers.length / itemsPerPage);
  const paginatedCourriers = filteredCourriers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleView = (courrier: Courrier) => {
    setSelectedCourrier(courrier);
    setShowViewModal(true);
  };

  const handleEdit = (courrier: Courrier) => {
    setSelectedCourrier(courrier);
    setShowEditModal(true);
  };

  const handleDelete = (courrier: Courrier) => {
    setSelectedCourrier(courrier);
    setShowDeleteModal(true);
  };

  const handleSaveEdit = async (data: Partial<Courrier>) => {
    if (selectedCourrier) {
      await updateCourrier(selectedCourrier.id, data);
      setSelectedCourrier(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedCourrier) {
      await deleteCourrier(selectedCourrier.id);
      setSelectedCourrier(null);
    }
  };

  const handleUpdateStatus = async (statut: Statut) => {
    if (selectedCourrier) {
      await updateStatus(selectedCourrier.id, statut);
      setSelectedCourrier({ ...selectedCourrier, statut });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      country: 'all',
      dateFrom: '',
      dateTo: '',
      sortBy: 'nom',
      sortOrder: 'asc'
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || 
    filters.country !== 'all' || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Liste des courriers
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Gérez et suivez tous vos courriers
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button 
            variant="outline"
            onClick={() => exportToCSV(filteredCourriers, 'courriers_filtres')}
            className="gap-2 text-sm"
            size="sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden xs:inline">Export</span> CSV
          </Button>
          <Button 
            variant="outline"
            onClick={() => exportToPDF(filteredCourriers, 'Liste des Courriers')}
            className="gap-2 text-sm"
            size="sm"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden xs:inline">Export</span> PDF
          </Button>
          <Button 
            onClick={() => window.location.href = '/?page=nouveau'}
            className="gap-2 bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25 text-sm"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouveau</span> courrier
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={cn(
        "p-3 sm:p-5 rounded-2xl space-y-3 sm:space-y-4",
        "bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#2a2a3d]"
      )}>
        {/* Search Row */}
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, pays ou contact..."
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setCurrentPage(1);
              }}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-xl",
                "bg-gray-100 dark:bg-[#2a2a3d] border-0",
                "text-gray-900 dark:text-white placeholder-gray-400 text-sm",
                "focus:ring-2 focus:ring-blue-500 outline-none"
              )}
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-gray-400 hidden sm:block" />
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-3 py-2 rounded-xl text-sm",
                  "bg-gray-100 dark:bg-[#2a2a3d] border-0",
                  "text-gray-700 dark:text-gray-300",
                  "focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                )}
              >
                <option value="all">Tous statuts</option>
                <option value="Confirmé">Confirmé</option>
                <option value="En attente">En attente</option>
                <option value="Reçu">Reçu</option>
                <option value="Relance">Relance</option>
              </select>
            </div>

            {/* Country Filter */}
            <select
              value={filters.country}
              onChange={(e) => {
                setFilters({ ...filters, country: e.target.value });
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-2 rounded-xl text-sm",
                "bg-gray-100 dark:bg-[#2a2a3d] border-0",
                "text-gray-700 dark:text-gray-300",
                "focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              )}
            >
              <option value="all">Tous pays</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            {/* Sort */}
            <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
              <ArrowUpDown className="h-4 w-4 text-gray-400 hidden sm:block" />
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as 'nom' | 'date' | 'statut' })}
                className={cn(
                  "px-3 py-2 rounded-xl text-sm",
                  "bg-gray-100 dark:bg-[#2a2a3d] border-0",
                  "text-gray-700 dark:text-gray-300",
                  "focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                )}
              >
                <option value="nom">Par nom</option>
                <option value="date">Par date</option>
                <option value="statut">Par statut</option>
              </select>
              <button
                onClick={() => setFilters({ 
                  ...filters, 
                  sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                })}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-medium",
                  "bg-gray-100 dark:bg-[#2a2a3d] text-gray-700 dark:text-gray-300",
                  "hover:bg-gray-200 dark:hover:bg-[#3a3a4d] transition-colors"
                )}
              >
                {filters.sortOrder === 'asc' ? 'A→Z' : 'Z→A'}
              </button>
            </div>
          </div>
        </div>

        {/* Date Range Row */}
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-4 items-start xs:items-center">
          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Date :</span>
          </div>
          <div className="flex items-center gap-2 w-full xs:w-auto">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => {
                setFilters({ ...filters, dateFrom: e.target.value });
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-2 rounded-xl text-sm flex-1 xs:flex-initial",
                "bg-gray-100 dark:bg-[#2a2a3d] border-0",
                "text-gray-700 dark:text-gray-300",
                "focus:ring-2 focus:ring-blue-500 outline-none"
              )}
            />
            <span className="text-gray-400">—</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => {
                setFilters({ ...filters, dateTo: e.target.value });
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-2 rounded-xl text-sm flex-1 xs:flex-initial",
                "bg-gray-100 dark:bg-[#2a2a3d] border-0",
                "text-gray-700 dark:text-gray-300",
                "focus:ring-2 focus:ring-blue-500 outline-none"
              )}
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium shrink-0",
                "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                "hover:bg-gray-100 dark:hover:bg-[#2a2a3d] transition-colors"
              )}
            >
              <X className="h-4 w-4" />
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <p className="text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{filteredCourriers.length}</span>
          {' '}courrier{filteredCourriers.length > 1 ? 's' : ''}
        </p>
        <button
          onClick={resetToInitial}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs",
            "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
            "hover:bg-gray-100 dark:hover:bg-[#2a2a3d] transition-colors"
          )}
        >
          <RotateCcw className="h-3 w-3" />
          Réinitialiser
        </button>
      </div>

      {/* Table */}
      <div className={cn(
        "rounded-2xl bg-white dark:bg-[#1e1e2e]",
        "border border-gray-100 dark:border-[#2a2a3d]",
        "shadow-sm overflow-hidden"
      )}>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#2a2a3d]/50">
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Profil
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pays
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Montant
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#2a2a3d]">
                {paginatedCourriers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                        <p className="text-sm">Aucun courrier trouvé</p>
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                          >
                            Effacer les filtres
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCourriers.map((courrier, index) => {
                    const status = statusConfig[courrier.statut];
                    
                    return (
                      <tr 
                        key={courrier.id}
                        className={cn(
                          "transition-colors hover:bg-gray-50 dark:hover:bg-[#2a2a3d]/30",
                          index % 2 === 0 ? 'bg-white dark:bg-[#1e1e2e]' : 'bg-gray-50/50 dark:bg-[#1e1e2e]/50'
                        )}
                      >
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                              <AvatarFallback className={cn(
                                "text-xs font-semibold",
                                "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                              )}>
                                {getInitials(courrier.nom)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-none">
                                {courrier.nom}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block truncate">
                                {courrier.contact || '—'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            {courrier.pays}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            {courrier.dateRemise}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className={cn(
                            "inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border",
                            status.bg, status.text, status.border
                          )}>
                            {courrier.statut}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                            {courrier.montant}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <button 
                              onClick={() => handleView(courrier)}
                              className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              title="Voir"
                            >
                              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit(courrier)}
                              className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                              title="Modifier"
                            >
                              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(courrier)}
                              className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col xs:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 dark:border-[#2a2a3d] gap-2">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} sur {totalPages}
            </p>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  "p-1.5 sm:p-2 rounded-lg transition-colors",
                  currentPage === 1 
                    ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2a2a3d]"
                )}
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2a2a3d]"
                    )}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  "p-1.5 sm:p-2 rounded-lg transition-colors",
                  currentPage === totalPages 
                    ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2a2a3d]"
                )}
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        courrier={selectedCourrier}
        onEdit={() => {
          setShowViewModal(false);
          setShowEditModal(true);
        }}
        onDelete={() => {
          setShowViewModal(false);
          setShowDeleteModal(true);
        }}
        onUpdateStatus={handleUpdateStatus}
      />

      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        courrier={selectedCourrier}
        onSave={handleSaveEdit}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        courrier={selectedCourrier}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
