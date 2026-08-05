# Dahira — Notes d’architecture (L3/L4 résumé)

## Vue applicative du prototype

```
src/
  components/     Layout (shell app, nav, notifications)
  context/        AppContext (auth démo, location, dahira active)
  data/           types.ts + mock.ts (jeu de données Niamey)
  pages/          Landing, Login, + 12 modules app
  App.tsx         Routes + guard auth
```

## Mapping cahier des charges → écrans

| Module CDC (L2) | Écran | Couverture démo |
|-----------------|-------|-----------------|
| Gestion des membres | Membres, Profil | ★★★★☆ |
| Gestion des Dahiras | Dahiras | ★★★★☆ |
| Géolocalisation volontaire | Localisation | ★★★★★ |
| Transmission du savoir | Savoir | ★★★★☆ |
| Silsila | Silsila | ★★★★☆ |
| Événements | Événements | ★★★★☆ |
| Réseau social privé | Réseau, Messages | ★★★☆☆ |
| Contributions financières | Finances | ★★★★☆ |
| Sécurité & admin | Sécurité, Login MFA | ★★★★☆ |

## Modèle de rôles (RBAC simplifié)

| Rôle | Portée | Exemples de droits |
|------|--------|--------------------|
| `membre` | Dahira(s) | Lire fil, RSVP, cotiser, profil |
| `responsable` | Une Dahira | Annonces, événements, cotisations, comité |
| `enseignant` | Contenus / silsila | Soumettre savoir, figurer silsila |
| `moderateur` | Plateforme ou Dahira | Valider/rejeter contenus |
| `admin` | Globale | Rôles, accès exceptionnel, audit |

## Données mock (contexte Niger / Niamey)

- 4 Dahiras (Al-Ihsan, An-Nour, As-Salam, Al-Baraka)
- 7 utilisateurs, comités, événements, contenus, silsila 7 générations
- Contributions XOF, projets, posts, messages, audit logs

## Évolutions techniques prioritaires (post-prototype)

1. Backend API + PostgreSQL + auth OIDC/MFA réelle  
2. RLS par `dahira_id`  
3. Stockage médias + pipeline modération  
4. Jobs TTL localisation + notifications  
5. i18n (FR, AR, langues locales) dès le schéma de contenu  
