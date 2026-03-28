# PWA & Admin Authentication Setup

Ce document décrit la configuration complète de la PWA et de l'authentification admin pour l'application Suivi des Courriers.

## 1. Installation et Configuration

### Étape 1: Mettre à jour la base de données
Le schéma Prisma a été mis à jour pour ajouter les champs d'authentification admin au modèle User:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?           // Nouveau: mot de passe hashé
  isAdmin   Boolean  @default(false)  // Nouveau: rôle admin
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Appliquez la migration:
```bash
npm run db:push
```

### Étape 2: Initialiser l'utilisateur administrateur
Un script d'initialisation crée un utilisateur admin par défaut:

```bash
npx tsx scripts/init-admin.js
```

**Identifiants par défaut:**
- Email: `admin@courriers.local`
- Mot de passe: `admin123456`

⚠️ **IMPORTANT**: Changez ce mot de passe immédiatement en production!

### Étape 3: Configuration des variables d'environnement
Assurez-vous que votre fichier `.env.local` contient:

```env
DATABASE_URL="votre-url-base-de-donnees"
NEXTAUTH_SECRET="votre-secret-aleatoire"
NEXTAUTH_URL="http://localhost:3000"  # ou votre URL de production
NODE_ENV="development"  # ou "production"
```

Générez un secret NEXTAUTH_SECRET sécurisé:
```bash
openssl rand -base64 32
```

## 2. Fonctionnalités PWA

### Manifest Configuration
Le fichier `/public/manifest.json` contient la configuration PWA:
- **Icons**: Icônes multi-résolution (72x72 à 512x512)
- **Maskable Icons**: Support des icônes adaptatives (Android 12+)
- **Offline Support**: Configuration du service worker
- **Installation**: Les utilisateurs peuvent installer l'app sur mobile/desktop

### Service Worker
Le fichier `/public/service-worker.js` implémente:
- Cache strategy: Network First, fallback to Cache
- Offline functionality
- Background sync support
- Push notifications

### Installation de l'app
L'app est installable sur:
- **iOS**: Via "Ajouter à l'écran d'accueil"
- **Android**: Via le menu "Installer l'application"
- **Desktop**: via le bouton d'installation du navigateur

## 3. Authentification Admin

### Architecture
L'authentification utilise:
- **NextAuth.js v4**: Gestion des sessions
- **Credentials Provider**: Email/Password
- **JWT Sessions**: Tokens sécurisés (24h d'expiration)
- **Prisma Adapter**: Stockage en base de données
- **bcryptjs**: Hachage sécurisé des mots de passe

### Fichiers principaux
```
src/
  auth.config.ts              # Configuration NextAuth
  app/
    api/auth/[...nextauth]/   # API route NextAuth
    admin/
      login/page.tsx          # Page de connexion
      dashboard/page.tsx      # Dashboard protégé
      layout.tsx              # Layout admin
  lib/
    auth.ts                   # Utilitaires d'authentification
  middleware.ts               # Protection des routes

public/
  manifest.json               # Configuration PWA
  service-worker.js           # Service worker
  icon-*.png                  # Icônes PWA
```

### Routes protégées
Les routes suivantes nécessitent une authentification admin:
- `/admin/dashboard` - Dashboard admin
- `/admin/users` - Gestion des utilisateurs
- `/admin/settings` - Paramètres admin

Le middleware `/src/middleware.ts` applique la protection automatiquement.

### Session et Cookies
- Durée de session: 24 heures
- Type de session: JWT
- Stockage: Cookie HTTP-only (sécurisé)
- Expiration automatique

## 4. Utilisation

### Page de connexion
Accédez à `/admin/login` pour vous connecter:
```
Email: admin@courriers.local
Mot de passe: admin123456
```

Après connexion réussie, vous serez redirigé vers `/admin/dashboard`.

### Déconnexion
Le bouton de déconnexion est disponible sur le dashboard et redirige vers `/admin/login`.

### Middleware de protection
Le middleware vérifie automatiquement:
1. L'existence d'une session valide
2. Que l'utilisateur a le rôle admin
3. Redirige vers `/admin/login` si non autorisé

## 5. Sécurité

### Bonnes pratiques implémentées
✓ Passwords hachés avec bcryptjs (10 rounds)
✓ JWT tokens avec expiration (24h)
✓ HTTP-only cookies (XSS protection)
✓ Validation Zod des credentials
✓ Middleware protection des routes
✓ Rate limiting (à implémenter en production)
✓ CSRF protection (automatique NextAuth)

### À faire en production
1. Changer le mot de passe admin par défaut
2. Implémenter le rate limiting (ex: Upstash Redis)
3. Activer HTTPS only
4. Configurer CORS approprié
5. Ajouter la validation 2FA
6. Logger les connexions admin
7. Configurer des alertes de sécurité

## 6. Déploiement

### Sur Vercel
1. Ajouter les variables d'environnement dans Settings > Environment Variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (URL de votre domaine Vercel)

2. Déployer avec git push
3. Exécuter le script d'initialisation une fois:
   ```bash
   vercel env pull .env.local
   npx tsx scripts/init-admin.js
   ```

### Autres plateformes
Voir la documentation NextAuth pour PostgreSQL, MySQL, etc.

## 7. Dépannage

### Erreur: "Email ou mot de passe invalide"
- Vérifier que l'utilisateur existe: `SELECT * FROM User WHERE email='...'`
- Vérifier que `isAdmin = true`
- Réinitialiser avec le script init-admin.js

### Erreur: "NEXTAUTH_SECRET is required"
- Ajouter `NEXTAUTH_SECRET` aux variables d'environnement
- Générer: `openssl rand -base64 32`

### App PWA ne s'installe pas
- Vérifier que manifest.json existe sur `/public`
- Vérifier les icônes sur `/public/icon-*.png`
- Tester avec Lighthouse (DevTools > Lighthouse)

### Service worker ne fonctionne pas
- Vérifier les logs en DevTools > Application > Service Workers
- Vérifier `/public/service-worker.js` existe
- Forcer un refresh Ctrl+Shift+R

## 8. Support NextAuth.js

Pour plus d'informations:
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Credentials Provider](https://next-auth.js.org/providers/credentials)
- [JWT Strategy](https://next-auth.js.org/concepts/session-strategies)

## 9. Support PWA

Pour plus d'informations:
- [Web App Manifest](https://web.dev/add-manifest/)
- [Service Workers](https://web.dev/service-workers-cache-storage/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
