# Dahira — Structure des livrables d’ingénierie (proposée)

> Alignée sur les Livrables 1 (Vision) et 2 (Cahier des charges fonctionnel).  
> Langue : français + termes techniques EN.

---

## Cartographie

| # | Livrable | Statut | Description |
|---|----------|--------|-------------|
| **1** | Vision globale | ✅ Fourni | Résumé, problème, objectifs, valeurs, utilisateurs, périmètre |
| **2** | Cahier des charges fonctionnel | ✅ Fourni | Acteurs, modules, NFR, hors-périmètre MVP |
| **3** | Architecture fonctionnelle | 📝 Esquisse | Domaines, flux, cartographie modules → cas d’usage |
| **4** | Architecture technique | 📝 Esquisse | Stack cible, services, déploiement, multi-tenant |
| **5** | Modèle de données & API | 📋 À produire | Schéma conceptuel/logique, OpenAPI, événements |
| **6** | Sécurité, vie privée & conformité | 📋 À produire | Threat model, RBAC matrix, consentement, audit |
| **7** | UX / UI & design system | 🟡 Prototype | Parcours, wireframes, composants (site actuel) |
| **8** | Spécifications détaillées par module | 📋 À produire | User stories, critères d’acceptation, règles métier |
| **9** | MVP — périmètre, backlog, plan | 📝 Esquisse | Scope MVP, hors-scope, sprints, définition de done |
| **10** | Plan d’évolution | 📋 À produire | Local → national → international, multi-langue, multi-confréries |

Livrables transverses optionnels : **11** Plan de tests & qualité · **12** Exploitation (ops, backup, monitoring) · **13** Business / gouvernance.

---

## Livrable 3 — Architecture fonctionnelle (esquisse)

### 3.1 Domaines métier (bounded contexts)

```
┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│ Identity &      │  │ Community        │  │ Knowledge &     │
│ Access (IAM)    │  │ (Dahiras/Members)│  │ Transmission    │
│ Auth, MFA, RBAC │  │ Events, Social   │  │ Savoir, Silsila │
└────────┬────────┘  └────────┬─────────┘  └────────┬────────┘
         │                    │                      │
┌────────┴────────┐  ┌────────┴─────────┐  ┌────────┴────────┐
│ Privacy &       │  │ Finance          │  │ Admin &         │
│ Location        │  │ Cotisations/Dons │  │ Audit           │
└─────────────────┘  └──────────────────┘  └─────────────────┘
```

### 3.2 Principes

1. **Multi-appartenance** : un User ↔ N Dahiras, rôles contextuels par Dahira + rôles globaux.
2. **Consentement comme primitive** : toute donnée sensible (location, silsila, contact) est gouvernée par des policies de partage.
3. **Publication contrôlée** : contenus savoir / relations silsila passent par un workflow `draft → pending → published|rejected`.
4. **Transparence financière scoped** : visibilité limitée aux membres de la Dahira.
5. **Audit first** : actions sensibles émettent des `AuditEvent` immuables.

### 3.3 Flux critiques

| Flux | Acteurs | Étapes clés |
|------|---------|-------------|
| Rejoindre une Dahira | Membre, Responsable | Demande / invitation → approbation → rattachement + rôle `membre` |
| Publier un contenu | Enseignant, Modérateur | Soumission → file modération → publish + indexation archives |
| Partage localisation | Membre | Opt-in + audience + TTL → share token → révocation / expiry |
| Cotisation | Trésorier, Membre | Enregistrement manuel (MVP) → statut → rapport Dahira |
| Accès exceptionnel location | Admin | Ticket récupération → accès time-boxed → log `critical` → audit |

---

## Livrable 4 — Architecture technique (esquisse)

### 4.1 Stack recommandée (cible production)

| Couche | Choix proposé | Justification |
|--------|---------------|---------------|
| Frontend web | React + TypeScript (PWA) | Accessibilité mobile large, un codebase |
| API | Node.js (NestJS) ou Python (FastAPI) | RBAC, OpenAPI, maturité écosystème |
| Auth | OIDC (Keycloak / Auth0 / Supabase Auth) + TOTP MFA | Standards, MFA natif |
| DB | PostgreSQL | Relations riches (silsila, RBAC), JSONB pour flex |
| Fichiers / médias | S3-compatible (MinIO / R2) + CDN | Archives audio/vidéo |
| Search | PostgreSQL FTS puis Meilisearch/OpenSearch | Archives multi-thèmes |
| Jobs | Queue (Redis/BullMQ ou Celery) | Rappels événements, expiry location |
| Observabilité | OpenTelemetry + logs structurés | Audit + perf |

> Le **prototype actuel** est front-only (Vite/React) avec données mock — volontaire pour valider UX et modules avant backend.

### 4.2 Multi-tenancy

- **Tenant logique** = Dahira (isolation des données métier).
- **Plateforme** = super-tenant (admin, modération globale, catalogue public limité).
- Isolation : `dahira_id` systématique + RLS PostgreSQL (recommandé).

### 4.3 Sécurité technique (alignée NFR)

- TLS partout ; chiffrement au repos (disque + champs sensibles optionnels).
- Secrets via vault / env managés.
- Rate limiting API ; CORS strict.
- Backup automatisé + tests de restore.
- Localisation : stockage séparé ou colonnes chiffrées ; TTL job de purge.

### 4.4 Déploiement cible

```
[CDN/PWA] → [API Gateway] → [Services API]
                    ↓
            [PostgreSQL] [Object Storage] [Redis]
                    ↓
            [Backup] [Monitoring] [Audit store]
```

Lancement local (1 pays) : un cluster simple (Docker Compose / PaaS).  
Évolution : multi-région, i18n, multi-confréries (livrable 10).

---

## Livrable 9 — MVP (esquisse)

### In scope MVP

- Compte membre + MFA
- Dahira (création, comité, page, annonces)
- Membres (rattachement, rôles basiques)
- Événements + RSVP + rappels email/in-app
- Fil social Dahira + messages privés basiques
- Cotisations / dons **manuels** + projets + rapport simple
- Savoir : soumission + modération + archive consultable
- Silsila : consultation arbre + ajout relation sous validation
- Localisation opt-in (qui / durée / révocation)
- Journal d’audit des actions sensibles
- UI FR, une région / un pays

### Out of scope MVP (vision long terme)

- Paiement en ligne intégré
- Multi-pays / multi-confréries actifs
- ID verification avancée
- App native stores (PWA d’abord)
- Recherche sémantique avancée, IA

### Definition of Done (MVP)

- Parcours critiques testés (E2E)
- Politique de confidentialité & consentement en place
- Backups + restore testés
- RBAC vérifié pour rôles principaux
- Documentation admin minimale

---

## Prochaines étapes recommandées

1. Valider le prototype UI avec des responsables de Dahira (feedback terrain).
2. Produire **L5** (modèle de données + OpenAPI) et **L6** (sécurité détaillée).
3. Choisir la stack backend et initialiser le monorepo API.
4. Implémenter l’auth réelle + premier module Dahira/Membres.
5. Itérer module par module selon le backlog MVP (L9).

---

*Document généré dans le cadre du prototype Dahira — à enrichir en ateliers avec le métier.*
