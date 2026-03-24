import { create } from 'zustand';
import { Courrier, Statut, initialCourriers } from '@/lib/courriers-data';

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// LocalStorage key - IMPORTANT: même clé que之前
const STORAGE_KEY = 'courriers-storage';

// Helper functions for localStorage
const getLocalStorage = (): Courrier[] | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('📦 Données récupérées du localStorage:', parsed.length, 'courriers');
      return parsed;
    }
  } catch (e) {
    console.error('Erreur lecture localStorage:', e);
  }
  return null;
};

const setLocalStorage = (data: Courrier[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('💾 Données sauvegardées dans localStorage:', data.length, 'courriers');
  } catch (e) {
    console.error('Erreur sauvegarde localStorage:', e);
  }
};

interface CourriersState {
  courriers: Courrier[];
  isLoading: boolean;
  error: string | null;
  useSupabase: boolean;
  _hasHydrated: boolean;
  
  // Initialize data
  initializeData: () => Promise<void>;
  
  // CRUD Operations
  addCourrier: (courrier: Omit<Courrier, 'id'>) => Promise<Courrier | null>;
  updateCourrier: (id: string, courrier: Partial<Courrier>) => Promise<boolean>;
  deleteCourrier: (id: string) => Promise<boolean>;
  getCourrier: (id: string) => Courrier | undefined;
  
  // Bulk Operations
  deleteMultiple: (ids: string[]) => Promise<boolean>;
  updateStatus: (id: string, statut: Statut) => Promise<boolean>;
  
  // Reset to initial data
  resetToInitial: () => Promise<void>;
  
  // Hydration
  setHasHydrated: (state: boolean) => void;
}

export const useCourriersStore = create<CourriersState>()((set, get) => ({
  courriers: [],
  isLoading: true,
  error: null,
  useSupabase: false,
  _hasHydrated: false,

  setHasHydrated: (state) => {
    set({ _hasHydrated: state });
  },

  initializeData: async () => {
    set({ isLoading: true, error: null });
    
    // Essayer Supabase EN PREMIER
    try {
      const response = await fetch('/api/courriers');
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          console.log('✅ Données récupérées de Supabase:', data.length, 'courriers');
          set({ courriers: data, useSupabase: true, isLoading: false, _hasHydrated: true });
          // Sauvegarder aussi en localStorage comme backup
          setLocalStorage(data);
          return;
        }
      }
    } catch (error) {
      console.log('⚠️ Supabase non disponible, vérification localStorage...');
    }
    
    // Fallback: vérifier localStorage
    const localData = getLocalStorage();
    if (localData && localData.length > 0) {
      console.log('📦 Utilisation des données localStorage:', localData.length, 'courriers');
      set({ courriers: localData, useSupabase: false, isLoading: false, _hasHydrated: true });
      return;
    }
    
    // Dernier recours: données initiales
    console.log('📝 Utilisation des données initiales:', initialCourriers.length, 'courriers');
    set({ courriers: initialCourriers, useSupabase: false, isLoading: false, _hasHydrated: true });
    setLocalStorage(initialCourriers);
  },

  addCourrier: async (courrier) => {
    const newCourrier: Courrier = {
      ...courrier,
      id: generateId(),
    };
    
    // Update local state immediately
    set((state) => ({
      courriers: [newCourrier, ...state.courriers],
    }));
    
    // Save to localStorage immediately
    const currentData = get().courriers;
    setLocalStorage(currentData);
    
    // Try Supabase if connected (non-blocking)
    if (get().useSupabase) {
      try {
        const response = await fetch('/api/courriers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courrier),
        });
        
        if (response.ok) {
          const data = await response.json();
          set((state) => ({
            courriers: state.courriers.map(c => 
              c.id === newCourrier.id ? data : c
            ),
          }));
          setLocalStorage(get().courriers);
        }
      } catch (e) {
        console.log('⚠️ Erreur Supabase, données sauvegardées localement');
      }
    }
    
    return newCourrier;
  },

  updateCourrier: async (id, updatedCourrier) => {
    // Update local state immediately
    set((state) => ({
      courriers: state.courriers.map((c) =>
        c.id === id ? { ...c, ...updatedCourrier } : c
      ),
    }));
    
    // Save to localStorage immediately
    setLocalStorage(get().courriers);
    
    // Try Supabase if connected (non-blocking)
    if (get().useSupabase) {
      try {
        await fetch(`/api/courriers/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCourrier),
        });
      } catch (e) {
        console.log('⚠️ Erreur Supabase, données sauvegardées localement');
      }
    }
    
    return true;
  },

  deleteCourrier: async (id) => {
    // Update local state immediately
    set((state) => ({
      courriers: state.courriers.filter((c) => c.id !== id),
    }));
    
    // Save to localStorage immediately
    setLocalStorage(get().courriers);
    
    // Try Supabase if connected (non-blocking)
    if (get().useSupabase) {
      try {
        await fetch(`/api/courriers/${id}`, { method: 'DELETE' });
      } catch (e) {
        console.log('⚠️ Erreur Supabase, données supprimées localement');
      }
    }
    
    return true;
  },

  getCourrier: (id) => {
    return get().courriers.find((c) => c.id === id);
  },

  deleteMultiple: async (ids) => {
    // Update local state immediately
    set((state) => ({
      courriers: state.courriers.filter((c) => !ids.includes(c.id)),
    }));
    
    // Save to localStorage immediately
    setLocalStorage(get().courriers);
    
    return true;
  },

  updateStatus: async (id, statut) => {
    return get().updateCourrier(id, { statut });
  },

  resetToInitial: async () => {
    set({ courriers: initialCourriers });
    setLocalStorage(initialCourriers);
  },
}));

// Hook to check if store is hydrated
export const useHydration = () => {
  return useCourriersStore((state) => state._hasHydrated);
};
