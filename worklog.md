---
Task ID: 1
Agent: Main Agent
Task: Configuration de la base de données Supabase pour la persistence des données

Work Log:
- Installation du client Supabase (@supabase/supabase-js)
- Configuration des variables d'environnement (.env)
- Création du client Supabase avec types TypeScript
- Création des API routes:
  - GET /api/courriers - Récupérer tous les courriers
  - POST /api/courriers - Créer un nouveau courrier
  - GET /api/courriers/[id] - Récupérer un courrier par ID
  - PUT /api/courriers/[id] - Mettre à jour un courrier
  - DELETE /api/courriers/[id] - Supprimer un courrier
- Création du script SQL pour la table Supabase (supabase-schema.sql)
- Mise à jour du store Zustand pour utiliser les API au lieu du localStorage
- Mise à jour des composants frontend pour charger les données au démarrage

Stage Summary:
- Les données sont maintenant stockées dans Supabase au lieu du localStorage
- Toutes les opérations CRUD fonctionnent via API
- États de chargement et d'erreur ajoutés pour une meilleure UX
- Script SQL fourni pour créer la table et les données initiales

