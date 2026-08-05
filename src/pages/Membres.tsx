import { useState } from 'react';
import { Search, UserPlus, Shield } from 'lucide-react';
import {
  users,
  fullName,
  getInitials,
  formatDate,
  roleLabels,
  committee,
} from '../data/mock';
import { useApp } from '../context/AppContext';

export default function Membres() {
  const { activeDahiraId } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const members = users.filter((u) => u.dahiraIds.includes(activeDahiraId));
  const filtered = members.filter((u) => {
    const q = search.toLowerCase();
    return (
      fullName(u).toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.roles.some((r) => roleLabels[r].toLowerCase().includes(q))
    );
  });

  const detail = selected ? users.find((u) => u.id === selected) : null;
  const fonctions = detail
    ? committee
        .filter((c) => c.userId === detail.id && c.dahiraId === activeDahiraId)
        .map((c) => c.fonction)
    : [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Membres</h1>
          <p className="page-subtitle">
            {members.length} membres dans la Dahira active
          </p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={16} />
          Inviter un membre
        </button>
      </div>

      <div className="form-group" style={{ maxWidth: 400, position: 'relative' }}>
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
          placeholder="Rechercher un membre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Membre</th>
                  <th>Rôles</th>
                  <th>Ville</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                        }}
                      >
                        <div className="avatar avatar-sm">{getInitials(u)}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{fullName(u)}</div>
                          <div className="form-hint">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 4,
                        }}
                      >
                        {u.roles.map((r) => (
                          <span key={r} className="badge badge-primary">
                            {roleLabels[r]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{u.ville ?? '—'}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelected(u.id)}
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          {!detail ? (
            <div className="empty-state">
              <Shield size={40} />
              <p>Sélectionnez un membre pour voir son profil</p>
              <p className="form-hint">
                Les données personnelles sont protégées par les paramètres de
                confidentialité de chaque membre.
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <div className="avatar avatar-xl">{getInitials(detail)}</div>
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-primary)',
                      fontSize: '1.4rem',
                    }}
                  >
                    {fullName(detail)}
                  </h2>
                  <div className="form-hint">
                    Inscrit le {formatDate(detail.dateInscription)}
                  </div>
                </div>
              </div>

              {detail.bio && (
                <p
                  style={{
                    marginBottom: '1rem',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.925rem',
                  }}
                >
                  {detail.bio}
                </p>
              )}

              <div className="form-group">
                <div className="form-label">Rôles plateforme</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {detail.roles.map((r) => (
                    <span key={r} className="badge badge-gold">
                      {roleLabels[r]}
                    </span>
                  ))}
                </div>
              </div>

              {fonctions.length > 0 && (
                <div className="form-group">
                  <div className="form-label">Fonctions dans la Dahira</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {fonctions.map((f) => (
                      <span key={f} className="badge badge-primary">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid-2">
                <div>
                  <div className="form-hint">Ville</div>
                  <div style={{ fontWeight: 600 }}>{detail.ville ?? '—'}</div>
                </div>
                <div>
                  <div className="form-hint">Pays</div>
                  <div style={{ fontWeight: 600 }}>{detail.pays ?? '—'}</div>
                </div>
                <div>
                  <div className="form-hint">MFA</div>
                  <div style={{ fontWeight: 600 }}>
                    {detail.mfaActive ? (
                      <span className="badge badge-success">Activé</span>
                    ) : (
                      <span className="badge badge-warning">Non activé</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="form-hint">Silsila visible</div>
                  <div style={{ fontWeight: 600 }}>
                    {detail.silsilaVisible ? 'Oui' : 'Non'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '1.25rem',
                  display: 'flex',
                  gap: '0.5rem',
                }}
              >
                <button className="btn btn-outline btn-sm">Message privé</button>
                <button className="btn btn-ghost btn-sm">Historique</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
