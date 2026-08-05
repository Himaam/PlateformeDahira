# Dahira — Plateforme communautaire soufie

Prototype web interactif (MVP UI) basé sur les **Livrables 1 & 2** (vision + cahier des charges fonctionnel).

## Lancer le projet

```bash
cd dahira
npm install
npm run dev
```

Puis ouvrir l’URL affichée (généralement `http://localhost:5173`).

```bash
npm run build    # build production
npm run preview  # prévisualiser le build
```

## Connexion démo

1. Page d’accueil → **Connexion** / **Entrer dans l’app**
2. Identifiants préremplis : `amadou.diallo@email.com` / `demo1234`
3. MFA démo : code `123456`
4. Ou **Accès démo rapide** (sans MFA)

Profil démo : **Amadou Diallo** — membre + responsable de Dahira Al-Ihsan (Niamey).

## Modules implémentés (UI)

| Module | Route | Fonctionnalités démo |
|--------|-------|----------------------|
| Site public | `/` | Vision, objectifs, valeurs, CTA |
| Auth MFA | `/login` | Mot de passe + 2FA simulée |
| Tableau de bord | `/app` | Stats, événements, annonces, projets, fil |
| Dahiras | `/app/dahiras` | Liste, détail, comité, création |
| Membres | `/app/membres` | Annuaire, profil, rôles |
| Événements | `/app/evenements` | Types, RSVP, création |
| Savoir & Archives | `/app/savoir` | Catalogue, modération, soumission |
| Silsila | `/app/silsila` | Arbre interactif, relations validées |
| Réseau social | `/app/reseau` | Fil, likes, groupes thématiques |
| Contributions | `/app/finances` | Cotisations, dons, projets, rapport |
| Localisation | `/app/localisation` | Opt-in, durée, public, révocation |
| Messages | `/app/messages` | Messagerie privée |
| Sécurité | `/app/securite` | MFA, RBAC, journal d’audit |
| Profil | `/app/profil` | Identité, confidentialité |

## Stack (prototype)

- **React 19** + **TypeScript** + **Vite**
- **React Router** (navigation)
- **Lucide React** (icônes)
- Données **mock** locales (pas de backend)

## Documentation d’ingénierie

Voir le dossier [`docs/`](./docs/) :

- Structure des livrables 3–10 (proposée)
- Architecture fonctionnelle & technique (esquisse)
- Roadmap MVP

## Valeurs de conception respectées

- Vie privée par défaut (localisation opt-in, consentement révocable)
- Sobriété de confiance (modération contenus / silsila / finances)
- Simplicité d’usage (UI claire, français)
- Évolutivité (architecture multi-Dahira, multi-rôles dès le départ)

## Hors périmètre MVP (selon L1/L2)

- Paiements en ligne intégrés
- Multi-pays / multi-confréries actifs (architecture prête conceptuellement)
- Vérification d’identité avancée
- Backend réel, chiffrement de production, notifications push

---

© 2026 — Prototype Dahira · Livrables 1 & 2
