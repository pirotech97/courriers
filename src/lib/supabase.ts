import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vérification des credentials
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://VOTRE-PROJET.supabase.co') {
  console.error('⚠️ Configuration Supabase manquante ou invalide dans .env');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Types pour les courriers
export type Statut = 'En attente' | 'Reçu' | 'Confirmé' | 'Relance';

export interface Courrier {
  id: string;
  nom: string;
  montant: string;
  pays: string;
  date_remise: string;
  contact: string;
  statut: Statut;
  created_at: string;
  updated_at: string;
}

export interface CourrierInsert {
  nom: string;
  montant: string;
  pays: string;
  date_remise: string;
  contact: string;
  statut: Statut;
}

export interface CourrierUpdate {
  nom?: string;
  montant?: string;
  pays?: string;
  date_remise?: string;
  contact?: string;
  statut?: Statut;
}

// Fonction pour vérifier la connexion
export async function checkConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase.from('courriers').select('id').limit(1);
    if (error) {
      return { 
        success: false, 
        message: `Erreur Supabase: ${error.message}. Vérifiez que la table 'courriers' existe.` 
      };
    }
    return { success: true, message: 'Connexion Supabase réussie!' };
  } catch (err) {
    return { 
      success: false, 
      message: `Impossible de se connecter à Supabase. Vérifiez l'URL: ${supabaseUrl}` 
    };
  }
}
