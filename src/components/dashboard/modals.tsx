'use client';

import { useState, useMemo, useEffect, useSyncExternalStore } from 'react';
import { X, Trash2, Pencil, AlertTriangle, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Courrier, Statut } from '@/lib/courriers-data';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCourriersStore } from '@/store/courriers-store';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// View Modal
interface ViewModalProps extends ModalProps {
  courrier: Courrier | null;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (statut: Statut) => void;
}

export function ViewModal({ isOpen, onClose, courrier, onEdit, onDelete, onUpdateStatus }: ViewModalProps) {
  if (!isOpen || !courrier) return null;

  const getInitials = (name: string) => 
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const statusColors: Record<Statut, string> = {
    'Confirmé': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    'En attente': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    'Relance': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    'Reçu': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-lg rounded-2xl overflow-hidden",
        "bg-white dark:bg-[#1e1e2e]",
        "border border-gray-200 dark:border-[#2a2a3d]",
        "shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      )}>
        {/* Header */}
        <div className={cn(
          "relative p-6",
          "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20",
          "border-b border-gray-100 dark:border-[#2a2a3d]"
        )}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white dark:border-gray-700">
              <AvatarFallback className="text-xl font-bold bg-blue-500 text-white">
                {getInitials(courrier.nom)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {courrier.nom}
              </h2>
              <Badge className={cn("mt-2", statusColors[courrier.statut])}>
                {courrier.statut}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoField label="Montant" value={courrier.montant} />
            <InfoField label="Pays" value={courrier.pays} />
            <InfoField label="Date de remise" value={courrier.dateRemise} />
            <InfoField label="Contact" value={courrier.contact || 'Non renseigné'} />
          </div>

          {/* Quick Status Change */}
          <div className="pt-4 border-t border-gray-100 dark:border-[#2a2a3d]">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
              Changer le statut rapidement
            </label>
            <div className="flex flex-wrap gap-2">
              {(['En attente', 'Reçu', 'Confirmé', 'Relance'] as Statut[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(status)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    courrier.statut === status
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-[#2a2a3d] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3a3a4d]"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-6 border-t border-gray-100 dark:border-[#2a2a3d] bg-gray-50/50 dark:bg-[#0f0f1a]/50">
          <Button onClick={onEdit} className="gap-2 bg-blue-500 hover:bg-blue-600">
            <Pencil className="h-4 w-4" />
            Modifier
          </Button>
          <Button variant="outline" onClick={onDelete} className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
          <Button variant="outline" onClick={onClose} className="ml-auto">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

// Edit Modal - avec key pour forcer le re-rendu
interface EditModalProps extends ModalProps {
  courrier: Courrier | null;
  onSave: (courrier: Partial<Courrier>) => void;
}

// Hook pour obtenir la valeur courante du courrier depuis le store
const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function EditModalContent({ courrier, onClose, onSave }: { 
  courrier: Courrier; 
  onClose: () => void; 
  onSave: (courrier: Partial<Courrier>) => void;
}) {
  const allCourriers = useCourriersStore((state) => state.courriers);
  
  // Get fresh courrier data from store
  const currentCourrier = allCourriers.find(c => c.id === courrier.id) || courrier;
  
  const [formData, setFormData] = useState<Partial<Courrier>>({
    nom: currentCourrier.nom,
    montant: currentCourrier.montant,
    pays: currentCourrier.pays,
    dateRemise: currentCourrier.dateRemise,
    contact: currentCourrier.contact,
    statut: currentCourrier.statut
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={cn(
        "relative w-full max-w-lg rounded-2xl overflow-hidden",
        "bg-white dark:bg-[#1e1e2e]",
        "border border-gray-200 dark:border-[#2a2a3d]",
        "shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#2a2a3d]">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              "bg-amber-100 dark:bg-amber-900/30"
            )}>
              <Pencil className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Modifier le courrier
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentCourrier.nom}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2a2a3d] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <FormField
            label="Nom / Organisation"
            value={formData.nom || ''}
            onChange={(v) => setFormData({ ...formData, nom: v })}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Montant"
              value={formData.montant || '1M'}
              options={['1M', 'À volonté', '—']}
              onChange={(v) => setFormData({ ...formData, montant: v })}
            />
            <SelectField
              label="Pays"
              value={formData.pays || 'Togo'}
              options={['Togo', 'France', 'Bénin', 'USA', 'Sénégal', 'Afrique du Sud', '—']}
              onChange={(v) => setFormData({ ...formData, pays: v })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Date de remise"
              value={formData.dateRemise || ''}
              onChange={(v) => setFormData({ ...formData, dateRemise: v })}
              placeholder="DD/MM/YYYY"
            />
            <SelectField
              label="Statut"
              value={formData.statut || 'En attente'}
              options={['En attente', 'Reçu', 'Confirmé', 'Relance']}
              onChange={(v) => setFormData({ ...formData, statut: v as Statut })}
            />
          </div>

          <FormField
            label="Contact"
            value={formData.contact || ''}
            onChange={(v) => setFormData({ ...formData, contact: v })}
            placeholder="Téléphone ou email"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-[#2a2a3d] bg-gray-50/50 dark:bg-[#0f0f1a]/50">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} className="gap-2 bg-blue-500 hover:bg-blue-600">
            <Save className="h-4 w-4" />
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
}

export function EditModal({ isOpen, onClose, courrier, onSave }: EditModalProps) {
  if (!isOpen || !courrier) return null;

  return (
    <EditModalContent 
      key={courrier.id}
      courrier={courrier} 
      onClose={onClose} 
      onSave={onSave}
    />
  );
}

// Delete Confirmation Modal
interface DeleteModalProps extends ModalProps {
  courrier: Courrier | null;
  onConfirm: () => void;
}

export function DeleteModal({ isOpen, onClose, courrier, onConfirm }: DeleteModalProps) {
  if (!isOpen || !courrier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={cn(
        "relative w-full max-w-md rounded-2xl overflow-hidden",
        "bg-white dark:bg-[#1e1e2e]",
        "border border-gray-200 dark:border-[#2a2a3d]",
        "shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      )}>
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Confirmer la suppression
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Êtes-vous sûr de vouloir supprimer ce courrier ?
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-[#2a2a3d] rounded-lg py-2 px-4">
            {courrier.nom}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 p-6 border-t border-gray-100 dark:border-[#2a2a3d] bg-gray-50/50 dark:bg-[#0f0f1a]/50">
          <Button variant="outline" onClick={onClose} className="min-w-[120px]">
            Annuler
          </Button>
          <Button 
            onClick={() => { onConfirm(); onClose(); }}
            className="gap-2 bg-red-500 hover:bg-red-600 min-w-[120px]"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}

// Form Field Component
interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

function FormField({ label, value, onChange, placeholder, required }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl",
          "bg-gray-100 dark:bg-[#2a2a3d] border-0",
          "text-gray-900 dark:text-white placeholder-gray-400",
          "focus:ring-2 focus:ring-blue-500 outline-none"
        )}
      />
    </div>
  );
}

// Select Field Component
interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl",
          "bg-gray-100 dark:bg-[#2a2a3d] border-0",
          "text-gray-700 dark:text-gray-300",
          "focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
        )}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
