import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Wallet,
  BookOpen,
  Bell,
  MapPin,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  events,
  announcements,
  projects,
  contributions,
  posts,
  getUser,
  fullName,
  formatDate,
  formatXOF,
  eventTypeLabels,
  dahiras,
} from '../data/mock';

export default function Dashboard() {
  const { currentUser, activeDahiraId, locationShare } = useApp();
  const dahira = dahiras.find((d) => d.id === activeDahiraId)!;

  const upcoming = events
    .filter((e) => e.dahiraId === activeDahiraId && e.status === 'planifie')
    .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut))
    .slice(0, 4);

  const anns = announcements
    .filter((a) => a.dahiraId === activeDahiraId)
    .slice(0, 3);

  const activeProjects = projects.filter(
    (p) => p.dahiraId === activeDahiraId && p.status === 'actif',
  );

  const monthContribs = contributions.filter(
    (c) => c.dahiraId === activeDahiraId && c.date.startsWith('2026-07'),
  );
  const monthTotal = monthContribs
    .filter((c) => c.status === 'paye')
    .reduce((s, c) => s + c.montant, 0);

  const recentPosts = posts
    .filter((p) => p.dahiraId === activeDahiraId)
    .slice(0, 3);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            As-salamu alaykum, {currentUser.prenom}
          </h1>
          <p className="page-subtitle">
            Tableau de bord · {dahira.nom} · {formatDate(new Date().toISOString())}
          </p>
        </div>
        <Link to="/app/evenements" className="btn btn-primary">
          <Calendar size={16} />
          Nouvel événement
        </Link>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={20} />
          </div>
          <div className="stat-value">{dahira.membreCount}</div>
          <div className="stat-label">Membres de la Dahira</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={20} />
          </div>
          <div className="stat-value">{upcoming.length}</div>
          <div className="stat-label">Événements à venir</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Wallet size={20} />
          </div>
          <div className="stat-value" style={{ fontSize: '1.25rem' }}>
            {formatXOF(monthTotal)}
          </div>
          <div className="stat-label">Cotisations juillet (payées)</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <MapPin size={20} />
          </div>
          <div className="stat-value" style={{ fontSize: '1.1rem' }}>
            {locationShare.active ? 'Active' : 'Inactive'}
          </div>
          <div className="stat-label">Partage de localisation</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 className="section-title" style={{ margin: 0 }}>
              Prochains événements
            </h2>
            <Link to="/app/evenements" className="btn btn-ghost btn-sm">
              Tout voir <ArrowRight size={14} />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="empty-state">Aucun événement planifié</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcoming.map((e) => (
                <div
                  key={e.id}
                  style={{
                    display: 'flex',
                    gap: '0.85rem',
                    padding: '0.75rem',
                    background: 'var(--color-cream)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div
                    style={{
                      minWidth: 52,
                      textAlign: 'center',
                      background: 'var(--color-primary)',
                      color: 'var(--color-gold-soft)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.4rem',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      lineHeight: 1.2,
                    }}
                  >
                    <div>
                      {new Date(e.dateDebut).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                      })}
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                      {new Date(e.dateDebut).toLocaleDateString('fr-FR', {
                        month: 'short',
                      })}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                      {e.titre}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                        marginTop: 2,
                      }}
                    >
                      <span className="badge badge-primary" style={{ marginRight: 6 }}>
                        {eventTypeLabels[e.type]}
                      </span>
                      {formatDate(e.dateDebut, true)} · {e.rsvpCount} présents
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 className="section-title" style={{ margin: 0 }}>
              Annonces
            </h2>
            <Bell size={18} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          {anns.map((a) => (
            <div
              key={a.id}
              style={{
                padding: '0.85rem 0',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <span
                  className={`badge ${
                    a.priorite === 'urgente'
                      ? 'badge-danger'
                      : a.priorite === 'importante'
                        ? 'badge-warning'
                        : 'badge-primary'
                  }`}
                >
                  {a.priorite}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {formatDate(a.date)}
                </span>
              </div>
              <div style={{ fontWeight: 600 }}>{a.titre}</div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                  marginTop: 2,
                }}
              >
                {a.contenu}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 className="section-title" style={{ margin: 0 }}>
              Projets en cours
            </h2>
            <Link to="/app/finances" className="btn btn-ghost btn-sm">
              Finances <ArrowRight size={14} />
            </Link>
          </div>
          {activeProjects.map((p) => {
            const pct = Math.min(100, Math.round((p.collecté / p.objectif) * 100));
            return (
              <div key={p.id} style={{ marginBottom: '1.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <strong>{p.titre}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                    {pct}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 6,
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <span>{formatXOF(p.collecté)}</span>
                  <span>Objectif {formatXOF(p.objectif)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 className="section-title" style={{ margin: 0 }}>
              Fil de la Dahira
            </h2>
            <Link to="/app/reseau" className="btn btn-ghost btn-sm">
              Réseau <ArrowRight size={14} />
            </Link>
          </div>
          {recentPosts.map((p) => {
            const author = getUser(p.auteurId);
            return (
              <div
                key={p.id}
                style={{
                  padding: '0.85rem 0',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '0.6rem',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <div className="avatar avatar-sm">
                    {author ? author.prenom[0] + author.nom[0] : '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {author ? fullName(author) : 'Membre'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {formatDate(p.date, true)}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
                  {p.contenu.length > 140
                    ? p.contenu.slice(0, 140) + '…'
                    : p.contenu}
                </p>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {p.likes} j'aime · {p.commentaires} commentaires
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <TrendingUp size={20} style={{ color: 'var(--color-gold-dark)' }} />
          <div>
            <strong>Raccourcis</strong>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginTop: '0.65rem',
              }}
            >
              <Link to="/app/savoir" className="btn btn-outline btn-sm">
                <BookOpen size={14} /> Archives
              </Link>
              <Link to="/app/silsila" className="btn btn-outline btn-sm">
                Silsila
              </Link>
              <Link to="/app/localisation" className="btn btn-outline btn-sm">
                <MapPin size={14} /> Localisation
              </Link>
              <Link to="/app/securite" className="btn btn-outline btn-sm">
                Journal d'audit
              </Link>
              <Link to="/app/membres" className="btn btn-outline btn-sm">
                <Users size={14} /> Membres
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
