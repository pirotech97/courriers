'use client';

import { useState } from 'react';
import { Save, X, Mail, Phone, MapPin, Calendar, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Statut } from '@/lib/courriers-data';
import { useCourriersStore } from '@/store/courriers-store';

interface FormData {
  nom: string;
  montant: string;
  pays: string;
  dateRemise: string;
  contact: string;
  statut: Statut;
  notes: string;
}

interface FormErrors {
  nom?: string;
}

interface NouveauCourrierPageProps {
  onSuccess?: () => void;
}

const paysOptions = [
  'Togo',
  'France',
  'Bénin',
  'USA',
  'Sénégal',
  'Afrique du Sud',
  'Allemagne',
  'Côte d\'Ivoire',
  'Ghana',
  'Nigeria',
  '—'
];

const montantOptions = [
  { value: '1M', label: '1M' },
  { value: 'À volonté', label: 'À volonté' },
  { value: '—', label: 'Non spécifié' }
];

const statutOptions: { value: Statut; label: string; description: string }[] = [
  { value: 'En attente', label: 'En attente', description: 'Courrier en attente de traitement' },
  { value: 'Reçu', label: 'Reçu', description: 'Courrier reçu et en cours de traitement' },
  { value: 'Confirmé', label: 'Confirmé', description: 'Courrier traité et confirmé' },
  { value: 'Relance', label: 'Relance', description: 'Nécessite une relance' }
];

export function NouveauCourrierPage({ onSuccess }: NouveauCourrierPageProps) {
  const addCourrier = useCourriersStore((state) => state.addCourrier);

  const [formData, setFormData] = useState<FormData>({
    nom: '',
    montant: '1M',
    pays: 'Togo',
    dateRemise: '',
    contact: '',
    statut: 'En attente',
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedName, setSavedName] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Format date from YYYY-MM-DD to DD/MM/YYYY
    let formattedDate = '—';
    if (formData.dateRemise) {
      const parts = formData.dateRemise.split('-');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    
    // Add to store (async API call)
    const result = await addCourrier({
      nom: formData.nom,
      montant: formData.montant,
      pays: formData.pays,
      dateRemise: formattedDate,
      contact: formData.contact,
      statut: formData.statut
    });
    
    if (result) {
      setSavedName(formData.nom);
      setShowSuccess(true);
    }
    
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormData({
      nom: '',
      montant: '1M',
      pays: 'Togo',
      dateRemise: '',
      contact: '',
      statut: 'En attente',
      notes: ''
    });
    setErrors({});
  };

  const handleAddAnother = () => {
    setShowSuccess(false);
    handleReset();
  };

  const handleViewList = () => {
    onSuccess?.();
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className={cn(
          "rounded-2xl p-12 text-center",
          "bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#2a2a3d]"
        )}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Courrier enregistré !
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Le courrier de <strong className="text-gray-900 dark:text-white">{savedName}</strong> a été ajouté avec succès.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button 
              variant="outline"
              onClick={handleAddAnother}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Ajouter un autre
            </Button>
            <Button 
              onClick={handleViewList}
              className="gap-2 bg-blue-500 hover:bg-blue-600"
            >
              Voir la liste
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Nouveau courrier
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Enregistrez un nouveau courrier de contributeur
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Info Card */}
        <div className={cn(
          "rounded-2xl p-6",
          "bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#2a2a3d]"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Informations principales
          </h3>

          <div className="space-y-5">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom / Organisation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => {
                    setFormData({ ...formData, nom: e.target.value });
                    if (errors.nom) setErrors({});
                  }}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl",
                    "bg-gray-100 dark:bg-[#2a2a3d] border-0",
                    "text-gray-900 dark:text-white placeholder-gray-400",
                    "focus:ring-2 focus:ring-blue-500 outline-none",
                    errors.nom && "ring-2 ring-red-500"
                  )}
                  placeholder="Ex: GBAGUIN Élisabeth ou Ambassade de France"
                />
                {errors.nom && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.nom}
                  </p>
                )}
              </div>
            </div>

            {/* Row: Montant & Pays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Montant
                </label>
                <select
                  value={formData.montant}
                  onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl",
                    "bg-gray-100 dark:bg-[#2a2a3d] border-0",
                    "text-gray-700 dark:text-gray-300",
                    "focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  )}
                >
                  {montantOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Pays
                </label>
                <select
                  value={formData.pays}
                  onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl",
                    "bg-gray-100 dark:bg-[#2a2a3d] border-0",
                    "text-gray-700 dark:text-gray-300",
                    "focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  )}
                >
                  {paysOptions.map(pays => (
                    <option key={pays} value={pays}>{pays}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className={cn(
          "rounded-2xl p-6",
          "bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#2a2a3d]"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Détails du courrier
          </h3>

          <div className="space-y-5">
            {/* Row: Date & Statut */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de remise
                </label>
                <input
                  type="date"
                  value={formData.dateRemise}
                  onChange={(e) => setFormData({ ...formData, dateRemise: e.target.value })}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl",
                    "bg-gray-100 dark:bg-[#2a2a3d] border-0",
                    "text-gray-700 dark:text-gray-300",
                    "focus:ring-2 focus:ring-blue-500 outline-none"
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statut
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value as Statut })}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl",
                    "bg-gray-100 dark:bg-[#2a2a3d] border-0",
                    "text-gray-700 dark:text-gray-300",
                    "focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  )}
                >
                  {statutOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Description */}
            <div className={cn(
              "p-4 rounded-xl",
              "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30"
            )}>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>{statutOptions.find(s => s.value === formData.statut)?.label}</strong> : 
                {' '}{statutOptions.find(s => s.value === formData.statut)?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className={cn(
          "rounded-2xl p-6",
          "bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#2a2a3d]"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Phone className="h-5 w-5 text-green-500" />
            Contact
          </h3>

          <div className="space-y-5">
            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Téléphone / Email
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className={cn(
                  "w-full px-4 py-3 rounded-xl",
                  "bg-gray-100 dark:bg-[#2a2a3d] border-0",
                  "text-gray-900 dark:text-white placeholder-gray-400",
                  "focus:ring-2 focus:ring-blue-500 outline-none"
                )}
                placeholder="Ex: +228 90 12 34 56 ou email@exemple.com"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes additionnelles
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className={cn(
                  "w-full px-4 py-3 rounded-xl resize-none",
                  "bg-gray-100 dark:bg-[#2a2a3d] border-0",
                  "text-gray-900 dark:text-white placeholder-gray-400",
                  "focus:ring-2 focus:ring-blue-500 outline-none"
                )}
                placeholder="Ajoutez des notes ou remarques sur ce courrier..."
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={cn(
          "flex items-center justify-between gap-3 p-6 rounded-2xl",
          "bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#2a2a3d]"
        )}>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="text-red-500">*</span> Champs obligatoires
          </p>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Réinitialiser
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "gap-2 bg-blue-500 hover:bg-blue-600",
                "shadow-lg shadow-blue-500/25"
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Enregistrer le courrier
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
