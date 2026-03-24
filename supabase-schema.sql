-- Script SQL pour créer la table courriers dans Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase : 
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Créer la table courriers
CREATE TABLE IF NOT EXISTS courriers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  montant TEXT DEFAULT '—',
  pays TEXT DEFAULT '—',
  date_remise TEXT DEFAULT '—',
  contact TEXT DEFAULT '',
  statut TEXT NOT NULL DEFAULT 'En attente' CHECK (statut IN ('En attente', 'Reçu', 'Confirmé', 'Relance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index pour les recherches par nom
CREATE INDEX IF NOT EXISTS idx_courriers_nom ON courriers(nom);

-- Créer un index pour les recherches par statut
CREATE INDEX IF NOT EXISTS idx_courriers_statut ON courriers(statut);

-- Créer un index pour les recherches par pays
CREATE INDEX IF NOT EXISTS idx_courriers_pays ON courriers(pays);

-- Activer Row Level Security (RLS)
ALTER TABLE courriers ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre toutes les opérations (anonyme pour ce projet)
CREATE POLICY "Permettre toutes les opérations sur courriers" ON courriers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courriers_updated_at
    BEFORE UPDATE ON courriers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Données initiales (optionnel - vous pouvez aussi les ajouter via l'interface)
INSERT INTO courriers (nom, montant, pays, date_remise, contact, statut) VALUES
('GBAGUIN Élisabeth', 'À volonté', 'France', '05/03/2026', 'elisabeth.gbaguin@email.com', 'Reçu'),
('AKPOVI Guy', '1M', 'Togo', '—', '+228 90 12 34 56', 'En attente'),
('ABOUKONOU Victor', '1M', 'USA', '—', 'victor.aboukonou@email.com', 'En attente'),
('KABO Kossi', '1M', 'Sénégal', '05/03/2026', '+221 77 88 99 00', 'Reçu'),
('ABOUKONOU Alphonse', '1M', 'Togo', '—', '+228 91 23 45 67', 'En attente'),
('KOBA Koffi', 'À volonté', 'Togo', '—', 'koba.koffi@email.com', 'En attente'),
('KOBA Bernard', '1M', 'USA', '05/03/2026', 'bernard.koba@email.com', 'Reçu'),
('AMBITODJI Michel', '1M', 'Togo', '—', '+228 92 34 56 78', 'En attente'),
('AKPAKI Déladem', '—', 'Togo', '—', '+228 93 45 67 89', 'En attente'),
('KOBA Labi', 'À volonté', 'Afrique du Sud', '05/03/2026', 'koba.labi@email.com', 'Reçu'),
('Ambassade France', 'À volonté', 'Togo', '—', 'contact@ambassade-france.tg', 'En attente'),
('ODITAE - ONG', '1M', 'Togo', '04/03/2026', 'contact@oditae-ong.org', 'Reçu'),
('TEBE Symphorien', '1M', 'Bénin', '20/02/2026', '+229 97 88 77 66', 'Confirmé'),
('Ambassade Allemagne', 'À volonté', 'Togo', '—', 'info@lome.diplo.de', 'En attente'),
('TEBE Yaou', 'À volonté', 'Bénin', '20/02/2026', '+229 96 77 66 55', 'Confirmé'),
('Sénatrice OTITI', '1M', 'Togo', '—', 'senateur.otiti@parlement.tg', 'En attente'),
('Député Séna FOMBO', '1M', 'Togo', '—', 'depute.fombo@parlement.tg', 'En attente'),
('OKE Samuel', 'À volonté', 'Bénin', '20/02/2026', '+229 95 66 55 44', 'Confirmé'),
('Sénateur OGOUHOUNDÉ Kokou', 'À volonté', 'Togo', '18/02/2026', 'senateur.ogouhoude@parlement.tg', 'Reçu'),
('Maire KASSAMADI Komlan Mensah', 'À volonté', 'Togo', '21/02/2026', 'maire.kassamadi@mairie.tg', 'Reçu'),
('Adjointe Maire ABOUKONOU Ekouya', 'À volonté', '—', '—', '', 'En attente');
