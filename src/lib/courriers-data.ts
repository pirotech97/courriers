// Types pour les courriers
export type Statut = 'En attente' | 'Reçu' | 'Confirmé' | 'Relance';

export interface Courrier {
  id: string;
  nom: string;
  montant: string;
  pays: string;
  dateRemise: string;
  contact: string;
  statut: Statut;
}

// Données initiales
export const initialCourriers: Courrier[] = [
  { id: '1', nom: 'GBAGUIN Élisabeth', montant: 'À volonté', pays: 'France', dateRemise: '05/03/2026', contact: 'elisabeth.gbaguin@email.com', statut: 'Reçu' },
  { id: '2', nom: 'AKPOVI Guy', montant: '1M', pays: 'Togo', dateRemise: '—', contact: '+228 90 12 34 56', statut: 'En attente' },
  { id: '3', nom: 'ABOUKONOU Victor', montant: '1M', pays: 'USA', dateRemise: '—', contact: 'victor.aboukonou@email.com', statut: 'En attente' },
  { id: '4', nom: 'KABO Kossi', montant: '1M', pays: 'Sénégal', dateRemise: '05/03/2026', contact: '+221 77 88 99 00', statut: 'Reçu' },
  { id: '5', nom: 'ABOUKONOU Alphonse', montant: '1M', pays: 'Togo', dateRemise: '—', contact: '+228 91 23 45 67', statut: 'En attente' },
  { id: '6', nom: 'KOBA Koffi', montant: 'À volonté', pays: 'Togo', dateRemise: '—', contact: 'koba.koffi@email.com', statut: 'En attente' },
  { id: '7', nom: 'KOBA Bernard', montant: '1M', pays: 'USA', dateRemise: '05/03/2026', contact: 'bernard.koba@email.com', statut: 'Reçu' },
  { id: '8', nom: 'AMBITODJI Michel', montant: '1M', pays: 'Togo', dateRemise: '—', contact: '+228 92 34 56 78', statut: 'En attente' },
  { id: '9', nom: 'AKPAKI Déladem', montant: '—', pays: 'Togo', dateRemise: '—', contact: '+228 93 45 67 89', statut: 'En attente' },
  { id: '10', nom: 'KOBA Labi', montant: 'À volonté', pays: 'Afrique du Sud', dateRemise: '05/03/2026', contact: 'koba.labi@email.com', statut: 'Reçu' },
  { id: '11', nom: 'Ambassade France', montant: 'À volonté', pays: 'Togo', dateRemise: '—', contact: 'contact@ambassade-france.tg', statut: 'En attente' },
  { id: '12', nom: 'ODITAE - ONG', montant: '1M', pays: 'Togo', dateRemise: '04/03/2026', contact: 'contact@oditae-ong.org', statut: 'Reçu' },
  { id: '13', nom: 'TEBE Symphorien', montant: '1M', pays: 'Bénin', dateRemise: '20/02/2026', contact: '+229 97 88 77 66', statut: 'Confirmé' },
  { id: '14', nom: 'Ambassade Allemagne', montant: 'À volonté', pays: 'Togo', dateRemise: '—', contact: 'info@lome.diplo.de', statut: 'En attente' },
  { id: '15', nom: 'TEBE Yaou', montant: 'À volonté', pays: 'Bénin', dateRemise: '20/02/2026', contact: '+229 96 77 66 55', statut: 'Confirmé' },
  { id: '16', nom: 'Sénatrice OTITI', montant: '1M', pays: 'Togo', dateRemise: '—', contact: 'senateur.otiti@parlement.tg', statut: 'En attente' },
  { id: '17', nom: 'Député Séna FOMBO', montant: '1M', pays: 'Togo', dateRemise: '—', contact: 'depute.fombo@parlement.tg', statut: 'En attente' },
  { id: '18', nom: 'OKE Samuel', montant: 'À volonté', pays: 'Bénin', dateRemise: '20/02/2026', contact: '+229 95 66 55 44', statut: 'Confirmé' },
  { id: '19', nom: 'Sénateur OGOUHOUNDÉ Kokou', montant: 'À volonté', pays: 'Togo', dateRemise: '18/02/2026', contact: 'senateur.ogouhoude@parlement.tg', statut: 'Reçu' },
  { id: '20', nom: 'Maire KASSAMADI Komlan Mensah', montant: 'À volonté', pays: 'Togo', dateRemise: '21/02/2026', contact: 'maire.kassamadi@mairie.tg', statut: 'Reçu' },
  { id: '21', nom: 'Adjointe Maire ABOUKONOU Ekouya', montant: 'À volonté', pays: '—', dateRemise: '—', contact: '', statut: 'En attente' },
];

// Données pour les graphiques - Courriers par mois
export const monthlyData = [
  { mois: 'Jan', courriers: 12, relances: 4 },
  { mois: 'Fév', courriers: 19, relances: 6 },
  { mois: 'Mar', courriers: 15, relances: 8 },
  { mois: 'Avr', courriers: 22, relances: 5 },
  { mois: 'Mai', courriers: 18, relances: 7 },
  { mois: 'Juin', courriers: 25, relances: 9 },
  { mois: 'Juil', courriers: 20, relances: 6 },
  { mois: 'Aoû', courriers: 28, relances: 10 },
  { mois: 'Sep', courriers: 23, relances: 8 },
  { mois: 'Oct', courriers: 30, relances: 12 },
  { mois: 'Nov', courriers: 26, relances: 9 },
  { mois: 'Déc', courriers: 21, relances: 7 },
];

// Données par pays
export const countryData = [
  { pays: 'Togo', count: 11, color: '#3b82f6' },
  { pays: 'Bénin', count: 3, color: '#10b981' },
  { pays: 'France', count: 1, color: '#8b5cf6' },
  { pays: 'USA', count: 2, color: '#f59e0b' },
  { pays: 'Sénégal', count: 1, color: '#ef4444' },
  { pays: 'Afrique du Sud', count: 1, color: '#06b6d4' },
  { pays: 'Non spécifié', count: 2, color: '#64748b' },
];

// Activité des relances par jour
export const activiteRelanceData = [
  { jour: 'Lun', activite: 24 },
  { jour: 'Mar', activite: 35 },
  { jour: 'Mer', activite: 28 },
  { jour: 'Jeu', activite: 42 },
  { jour: 'Ven', activite: 38 },
  { jour: 'Sam', activite: 18 },
  { jour: 'Dim', activite: 12 },
];

// Données par statut
export const statusData = [
  { name: 'Confirmé', value: 3, color: '#10b981' },
  { name: 'Reçu', value: 7, color: '#3b82f6' },
  { name: 'En attente', value: 11, color: '#f59e0b' },
  { name: 'Relance', value: 0, color: '#ef4444' },
];

// Données de tendance annuelle
export const yearlyTrendData = [
  { année: '2022', total: 156, confirmés: 89 },
  { année: '2023', total: 198, confirmés: 124 },
  { année: '2024', total: 245, confirmés: 167 },
  { année: '2025', total: 289, confirmés: 201 },
  { année: '2026', total: 21, confirmés: 3 },
];
