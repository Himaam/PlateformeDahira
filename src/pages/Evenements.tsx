import { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Check,
  Clock,
} from 'lucide-react';
import {
  events,
  eventTypeLabels,
  statusLabels,
  formatDate,
  getUser,
  fullName,
} from '../data/mock';
import { useApp } from '../context/AppContext';
import type { EventType, RsvpStatus } from '../data/types';

const typeFilters: Array<EventType | 'tous'> = [
  'tous',
  'zikr',
  'conference',
  'reunion',
  'formation',
  'don_sang',
  'salubrite',
  'social',
];

export default function Evenements() {
  const { activeDahiraId, currentUser } = useApp();
  const [filter, setFilter] = useState<EventType | 'tous'>('tous');
  const [showCreate, setShowCreate] = useState(false);
  const [rsvp, setRsvp] = useState<Record<string, RsvpStatus>>({
    e1: 'confirme',
    e2: 'en_attente',
  });
  const [toast, setToast] = useState('');

  const list = events
    .filter((e) => e.dahiraId === activeDahiraId)
    .filter((e) => filter === 'tous' || e.type === filter)
    .sort((a, b) => b.dateDebut.localeCompare(a.dateDebut));

  const setPresence = (id: string, status: RsvpStatus) => {
    setRsvp((prev) => ({ ...prev, [id]: status }));
    setToast(
      status === 'confirme'
        ? 'Présence confirmée. Un rappel vous sera envoyé.'
        : status === 'decline'
          ? 'Absence enregistrée.'
          : 'Statut mis à jour.',
    );
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Événements</h1>
          <p className="page-subtitle">
            Réunions, zikr, conférences, actions sociales…
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          Créer un événement
        </button>
      </div>

      {toast && <div className="alert alert-success">{toast}</div>}

      <div className="tabs">
        {typeFilters.map((t) => (
          <button
            key={t}
            className={`tab ${filter === t ? 'active' : ''}`}
            onClick={() => setFilter(t)}
          >
            {t === 'tous' ? 'Tous' : eventTypeLabels[t]}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {list.map((e) => {
          const creator = getUser(e.createurId);
          const myRsvp = rsvp[e.id] ?? 'en_attente';
          return (
            <div key={e.id} className="card card-hover">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                }}
              >
                <span className="badge badge-primary">
                  {eventTypeLabels[e.type]}
                </span>
                <span
                  className={`badge ${
                    e.status === 'planifie'
                      ? 'badge-info'
                      : e.status === 'termine'
                        ? 'badge-success'
                        : 'badge-warning'
                  }`}
                >
                  {statusLabels[e.status]}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-primary)',
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                }}
              >
                {e.titre}
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                  marginBottom: '1rem',
                }}
              >
                {e.description}
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Clock size={14} color="var(--color-text-muted)" />
                  {formatDate(e.dateDebut, true)}
                  {e.dateFin && ` → ${formatDate(e.dateFin, true)}`}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <MapPin size={14} color="var(--color-text-muted)" />
                  {e.lieu}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Users size={14} color="var(--color-text-muted)" />
                  {e.rsvpCount} confirmations
                  {e.capacite ? ` / ${e.capacite}` : ''}
                  {creator && (
                    <span className="form-hint">
                      · par {fullName(creator)}
                    </span>
                  )}
                </div>
              </div>

              {e.status === 'planifie' && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    className={`btn btn-sm ${myRsvp === 'confirme' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setPresence(e.id, 'confirme')}
                  >
                    <Check size={14} /> Je participe
                  </button>
                  <button
                    className={`btn btn-sm ${myRsvp === 'peut_etre' ? 'btn-gold' : 'btn-ghost'}`}
                    onClick={() => setPresence(e.id, 'peut_etre')}
                  >
                    Peut-être
                  </button>
                  <button
                    className={`btn btn-sm ${myRsvp === 'decline' ? 'btn-outline' : 'btn-ghost'}`}
                    onClick={() => setPresence(e.id, 'decline')}
                  >
                    Décliner
                  </button>
                </div>
              )}
              {e.status === 'termine' && (
                <button className="btn btn-outline btn-sm">
                  <Calendar size={14} /> Voir le compte rendu
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Créer un événement</h2>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowCreate(false)}
              >
                Fermer
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Titre</label>
              <input className="form-input" placeholder="Ex. Zikr du vendredi" />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select">
                {Object.entries(eventTypeLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Date & heure début</label>
                <input type="datetime-local" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Lieu</label>
                <input className="form-input" placeholder="Adresse ou lieu" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Invitations</label>
              <select className="form-select">
                <option>Toute la Dahira</option>
                <option>Comité de gestion uniquement</option>
                <option>Groupe thématique</option>
                <option>Invitations individuelles</option>
              </select>
            </div>
            <p className="form-hint" style={{ marginBottom: '1rem' }}>
              Créé par {fullName(currentUser)} · notifications de rappel
              automatiques activées
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => {
                setShowCreate(false);
                setToast('Événement créé (simulation). Invitations prêtes.');
                setTimeout(() => setToast(''), 3000);
              }}
            >
              Publier l'événement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
