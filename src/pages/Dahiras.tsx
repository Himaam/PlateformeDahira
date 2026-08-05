import { useState } from 'react';
import {
  Building2,
  MapPin,
  Users,
  Mail,
  Phone,
  Search,
  Plus,
} from 'lucide-react';
import {
  dahiras,
  committee,
  getUser,
  fullName,
  formatDate,
} from '../data/mock';
import { useApp } from '../context/AppContext';

export default function Dahiras() {
  const { activeDahiraId, setActiveDahiraId, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(activeDahiraId);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = dahiras.filter(
    (d) =>
      d.nom.toLowerCase().includes(search.toLowerCase()) ||
      d.ville.toLowerCase().includes(search.toLowerCase()) ||
      (d.confrerie ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const detail = dahiras.find((d) => d.id === selected);
  const comite = committee.filter((c) => c.dahiraId === selected);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dahiras</h1>
          <p className="page-subtitle">
            Découvrir, rejoindre et gérer les communautés
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          Créer une Dahira
        </button>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div>
          <div className="form-group" style={{ position: 'relative' }}>
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
              placeholder="Rechercher par nom, ville, confrérie…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((d) => {
              const isMine = currentUser.dahiraIds.includes(d.id);
              return (
                <button
                  key={d.id}
                  className="card card-hover"
                  onClick={() => setSelected(d.id)}
                  style={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderColor:
                      selected === d.id
                        ? 'var(--color-gold)'
                        : 'var(--color-border)',
                    borderWidth: selected === d.id ? 2 : 1,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background: 'var(--color-primary)',
                          color: 'var(--color-gold-soft)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--color-primary)',
                          }}
                        >
                          {d.nom}
                        </div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          <MapPin
                            size={12}
                            style={{ display: 'inline', verticalAlign: -1 }}
                          />{' '}
                          {d.ville}, {d.pays}
                          {d.confrerie ? ` · ${d.confrerie}` : ''}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                      {isMine && (
                        <span className="badge badge-success">Membre</span>
                      )}
                      {d.id === activeDahiraId && (
                        <span className="badge badge-gold">Active</span>
                      )}
                    </div>
                  </div>
                  <p
                    style={{
                      marginTop: '0.65rem',
                      fontSize: '0.85rem',
                      color: 'var(--color-text-muted)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {d.description}
                  </p>
                  <div
                    style={{
                      marginTop: '0.65rem',
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      gap: '1rem',
                    }}
                  >
                    <span>
                      <Users size={12} style={{ display: 'inline', verticalAlign: -1 }} />{' '}
                      {d.membreCount} membres
                    </span>
                    <span>Créée le {formatDate(d.dateCreation)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {detail && (
          <div className="card" style={{ position: 'sticky', top: 80 }}>
            <h2
              className="section-title"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Building2 size={22} />
              {detail.nom}
            </h2>
            <p
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.925rem',
                marginBottom: '1.25rem',
              }}
            >
              {detail.description}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <div className="form-hint">Localisation</div>
                <div style={{ fontWeight: 600 }}>
                  {detail.adresse ?? detail.ville}
                </div>
                <div style={{ fontSize: '0.85rem' }}>
                  {detail.ville}, {detail.region}, {detail.pays}
                </div>
              </div>
              <div>
                <div className="form-hint">Confrérie</div>
                <div style={{ fontWeight: 600 }}>
                  {detail.confrerie ?? '—'}
                </div>
              </div>
              {detail.contactEmail && (
                <div>
                  <div className="form-hint">
                    <Mail size={12} style={{ display: 'inline' }} /> Email
                  </div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    {detail.contactEmail}
                  </div>
                </div>
              )}
              {detail.contactTel && (
                <div>
                  <div className="form-hint">
                    <Phone size={12} style={{ display: 'inline' }} /> Téléphone
                  </div>
                  <div style={{ fontWeight: 500 }}>{detail.contactTel}</div>
                </div>
              )}
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-primary)',
                marginBottom: '0.75rem',
              }}
            >
              Comité de gestion
            </h3>
            {comite.length === 0 ? (
              <p className="form-hint">Aucun comité renseigné</p>
            ) : (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                {comite.map((c) => {
                  const u = getUser(c.userId);
                  if (!u) return null;
                  return (
                    <div
                      key={`${c.userId}-${c.fonction}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.5rem',
                        background: 'var(--color-cream)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <div className="avatar avatar-sm">
                        {u.prenom[0]}
                        {u.nom[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {fullName(u)}
                        </div>
                        <div className="form-hint">{c.fonction}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              {currentUser.dahiraIds.includes(detail.id) ? (
                <button
                  className="btn btn-gold"
                  onClick={() => setActiveDahiraId(detail.id)}
                >
                  Définir comme active
                </button>
              ) : (
                <button className="btn btn-primary">
                  Demander à rejoindre
                </button>
              )}
              <button className="btn btn-outline">Espace documentaire</button>
            </div>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Créer une Dahira</h2>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowCreate(false)}
              >
                Fermer
              </button>
            </div>
            <div className="alert alert-info">
              La création d'une Dahira nécessite la constitution d'un comité de
              gestion (président, trésorier, secrétaire). Prototype : formulaire
              non connecté à un backend.
            </div>
            <div className="form-group">
              <label className="form-label">Nom de la Dahira</label>
              <input className="form-input" placeholder="Ex. Dahira Al-Falah" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Présentation de la communauté…"
              />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Ville</label>
                <input className="form-input" placeholder="Niamey" />
              </div>
              <div className="form-group">
                <label className="form-label">Confrérie</label>
                <select className="form-select">
                  <option>Tidjaniya</option>
                  <option>Qadiriyya</option>
                  <option>Autre</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Soumettre la création
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
