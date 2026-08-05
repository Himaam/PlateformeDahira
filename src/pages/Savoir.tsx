import { useState } from 'react';
import {
  BookOpen,
  FileText,
  Headphones,
  Video,
  File,
  Plus,
  Check,
  X,
  Clock,
  Search,
} from 'lucide-react';
import {
  contents,
  getUser,
  fullName,
  formatDate,
  contentTypeLabels,
  statusLabels,
} from '../data/mock';
import type { ContentStatus } from '../data/types';

const typeIcon = {
  texte: FileText,
  audio: Headphones,
  video: Video,
  document: File,
  conference: BookOpen,
};

export default function Savoir() {
  const [tab, setTab] = useState<'archives' | 'moderation' | 'soumettre'>(
    'archives',
  );
  const [theme, setTheme] = useState('tous');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(contents);
  const [toast, setToast] = useState('');

  const themes = Array.from(new Set(contents.flatMap((c) => c.themes)));

  const published = items.filter((c) => {
    if (c.status !== 'publie') return false;
    if (theme !== 'tous' && !c.themes.includes(theme)) return false;
    if (
      search &&
      !c.titre.toLowerCase().includes(search.toLowerCase()) &&
      !c.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const pending = items.filter((c) => c.status === 'en_attente');

  const moderate = (id: string, status: ContentStatus) => {
    setItems((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              datePublication:
                status === 'publie'
                  ? new Date().toISOString().slice(0, 10)
                  : c.datePublication,
            }
          : c,
      ),
    );
    setToast(
      status === 'publie'
        ? 'Contenu validé et publié dans les archives.'
        : 'Contenu rejeté. L\'auteur sera notifié.',
    );
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Savoir & Archives</h1>
          <p className="page-subtitle">
            Transmission du patrimoine spirituel — validation avant publication
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setTab('soumettre')}>
          <Plus size={16} />
          Soumettre un contenu
        </button>
      </div>

      {toast && <div className="alert alert-success">{toast}</div>}

      <div className="tabs">
        <button
          className={`tab ${tab === 'archives' ? 'active' : ''}`}
          onClick={() => setTab('archives')}
        >
          Archives publiées ({published.length})
        </button>
        <button
          className={`tab ${tab === 'moderation' ? 'active' : ''}`}
          onClick={() => setTab('moderation')}
        >
          Modération ({pending.length})
        </button>
        <button
          className={`tab ${tab === 'soumettre' ? 'active' : ''}`}
          onClick={() => setTab('soumettre')}
        >
          Soumettre
        </button>
      </div>

      {tab === 'archives' && (
        <>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 14,
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                className="form-input"
                style={{ paddingLeft: 36 }}
                placeholder="Rechercher par titre, thème…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              style={{ maxWidth: 200 }}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="tous">Tous les thèmes</option>
              {themes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {published.map((c) => {
              const Icon = typeIcon[c.type];
              const author = getUser(c.auteurId);
              return (
                <div key={c.id} className="card card-hover">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span className="badge badge-primary">
                      <Icon size={12} /> {contentTypeLabels[c.type]}
                    </span>
                    {c.duree && (
                      <span className="form-hint">
                        <Clock size={12} style={{ display: 'inline' }} />{' '}
                        {c.duree}
                      </span>
                    )}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-primary)',
                      fontSize: '1.15rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {c.titre}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-muted)',
                      marginBottom: '0.85rem',
                    }}
                  >
                    {c.description}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 4,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {c.themes.map((t) => (
                      <span key={t} className="badge badge-gold">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="form-hint">
                    {author ? fullName(author) : 'Auteur'} ·{' '}
                    {c.datePublication
                      ? formatDate(c.datePublication)
                      : formatDate(c.dateCreation)}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'moderation' && (
        <div>
          <div className="alert alert-info">
            Les contenus sensibles (savoir, médias) doivent être validés par un
            modérateur ou administrateur habilité avant diffusion — principe de
            sobriété de confiance.
          </div>
          {pending.length === 0 ? (
            <div className="empty-state card">
              <Check size={40} />
              <p>Aucun contenu en attente de validation</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pending.map((c) => {
                const author = getUser(c.auteurId);
                const Icon = typeIcon[c.type];
                return (
                  <div key={c.id} className="card">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            marginBottom: 8,
                          }}
                        >
                          <span className="badge badge-warning">
                            {statusLabels[c.status]}
                          </span>
                          <span className="badge badge-primary">
                            <Icon size={12} /> {contentTypeLabels[c.type]}
                          </span>
                        </div>
                        <h3
                          style={{
                            fontFamily: 'var(--font-serif)',
                            color: 'var(--color-primary)',
                            fontSize: '1.15rem',
                          }}
                        >
                          {c.titre}
                        </h3>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-muted)',
                            margin: '0.4rem 0',
                          }}
                        >
                          {c.description}
                        </p>
                        <div className="form-hint">
                          Soumis par {author ? fullName(author) : '—'} le{' '}
                          {formatDate(c.dateCreation)}
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                        }}
                      >
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => moderate(c.id, 'publie')}
                        >
                          <Check size={14} /> Valider
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => moderate(c.id, 'rejete')}
                        >
                          <X size={14} /> Rejeter
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'soumettre' && (
        <div className="card" style={{ maxWidth: 560 }}>
          <h2 className="section-title">Soumettre un contenu pédagogique</h2>
          <p className="form-hint" style={{ marginBottom: '1.25rem' }}>
            Votre contenu sera examiné par un modérateur avant publication dans
            les archives.
          </p>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input className="form-input" placeholder="Titre du contenu" />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select">
              {Object.entries(contentTypeLabels).map(([k, v]) => (
                <option key={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Résumé, contexte, public cible…"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Thèmes (séparés par des virgules)</label>
            <input className="form-input" placeholder="zikr, adab, histoire…" />
          </div>
          <div className="form-group">
            <label className="form-label">Fichier (simulation)</label>
            <input type="file" className="form-input" />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setToast(
                'Contenu soumis pour validation. Vous serez notifié de la décision.',
              );
              setTab('moderation');
              setTimeout(() => setToast(''), 3500);
            }}
          >
            Envoyer pour validation
          </button>
        </div>
      )}
    </div>
  );
}
