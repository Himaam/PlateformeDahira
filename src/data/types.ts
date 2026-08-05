export type Role =
  | 'membre'
  | 'responsable'
  | 'enseignant'
  | 'moderateur'
  | 'admin';

export type ContentStatus = 'brouillon' | 'en_attente' | 'publie' | 'rejete';
export type EventType =
  | 'reunion'
  | 'zikr'
  | 'conference'
  | 'formation'
  | 'voyage'
  | 'social'
  | 'projet'
  | 'don_sang'
  | 'salubrite';
export type RsvpStatus = 'confirme' | 'peut_etre' | 'decline' | 'en_attente';
export type ContributionType = 'cotisation' | 'don';
export type ContributionStatus = 'paye' | 'en_attente' | 'en_retard';
export type LocVisibility = 'personne' | 'dahira' | 'amis' | 'public_limite';

export interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  photo?: string;
  bio?: string;
  roles: Role[];
  dahiraIds: string[];
  ville?: string;
  pays?: string;
  dateInscription: string;
  mfaActive: boolean;
  silsilaVisible: boolean;
}

export interface Dahira {
  id: string;
  nom: string;
  description: string;
  ville: string;
  region: string;
  pays: string;
  adresse?: string;
  lat?: number;
  lng?: number;
  photo?: string;
  membreCount: number;
  dateCreation: string;
  confrerie?: string;
  contactEmail?: string;
  contactTel?: string;
  presidentId?: string;
}

export interface CommitteeMember {
  userId: string;
  dahiraId: string;
  fonction: string;
}

export interface Event {
  id: string;
  dahiraId: string;
  titre: string;
  description: string;
  type: EventType;
  dateDebut: string;
  dateFin?: string;
  lieu: string;
  createurId: string;
  capacite?: number;
  rsvpCount: number;
  status: 'planifie' | 'en_cours' | 'termine' | 'annule';
}

export interface ContentItem {
  id: string;
  titre: string;
  type: 'texte' | 'audio' | 'video' | 'document' | 'conference';
  auteurId: string;
  dahiraId?: string;
  description: string;
  status: ContentStatus;
  themes: string[];
  dateCreation: string;
  datePublication?: string;
  duree?: string;
}

export interface SilsilaNode {
  id: string;
  nom: string;
  titre?: string;
  biographie?: string;
  parentId: string | null;
  generation: number;
  dates?: string;
  userId?: string;
}

export interface Contribution {
  id: string;
  dahiraId: string;
  userId: string;
  type: ContributionType;
  montant: number;
  devise: string;
  date: string;
  status: ContributionStatus;
  motif?: string;
  projetId?: string;
}

export interface Project {
  id: string;
  dahiraId: string;
  titre: string;
  description: string;
  objectif: number;
  collecté: number;
  devise: string;
  dateDebut: string;
  dateFin?: string;
  status: 'actif' | 'termine' | 'suspendu';
}

export interface Post {
  id: string;
  dahiraId: string;
  auteurId: string;
  contenu: string;
  date: string;
  likes: number;
  commentaires: number;
  mediaType?: 'photo' | 'video' | 'document';
}

export interface Announcement {
  id: string;
  dahiraId: string;
  titre: string;
  contenu: string;
  auteurId: string;
  date: string;
  priorite: 'normale' | 'importante' | 'urgente';
}

export interface LocationShare {
  active: boolean;
  visibility: LocVisibility;
  durationMinutes: number;
  expiresAt?: string;
  lat?: number;
  lng?: number;
}

export interface AuditLog {
  id: string;
  action: string;
  acteurId: string;
  cible?: string;
  date: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  contenu: string;
  date: string;
  lu: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  titre: string;
  message: string;
  date: string;
  lu: boolean;
  type: 'event' | 'content' | 'finance' | 'social' | 'system';
  link?: string;
}
