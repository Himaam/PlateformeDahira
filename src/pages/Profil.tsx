import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, Shield, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getInitials,
  fullName,
  formatDate,
  roleLabels,
  dahiras,
} from '../data/mock';

export default function Profil() {
  const { currentUser } = useApp();
  const [prenom, setPrenom] = useState(currentUser.prenom);
  const [nom, setNom] = useState(currentUser.nom);
  const [email, setEmail] = useState(currentUser.email);
  const [tel, setTel] = useState(currentUser.telephone ?? '');
  const [bio, setBio] = useState(currentUser.bio ?? '');
  const [ville, setVille] = useState(currentUser.ville ?? '');
  const [silsilaVisible, setSilsilaVisible] = useState(
    currentUser.silsilaVisible,
  );
  const [toast, setToast] = useState('');

  const myDahiras = dahiras.filter((d) =>
    currentUser.dahiraIds.includes(d.id),
  );

  const save = () => {
    setToast('Profil mis à jour (simulation locale).');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mon profil</h1>
          <p className="page-subtitle">
            Identité, confidentialité et paramètres personnels
          </p>
        </div>
        <button className="btn btn-primary" onClick={save}>
          <Save size={16} />
          Enregistrer
        </button>
      </div>

      {toast && <div className="alert alert-success">{toast}</div>}

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <div className="avatar avatar-xl">{getInitials(currentUser)}</div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-primary)',
                  fontSize: '1.4rem',
                }}
              >
                {fullName(currentUser)}
              </h2>
              <div className="form-hint">
                Membre depuis {formatDate(currentUser.dateInscription)}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4,
                  marginTop: 6,
                }}
              >
                {currentUser.roles.map((r) => (
                  <span key={r} className="badge badge-gold">
                    {roleLabels[r]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input
                className="form-input"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input
                className="form-input"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Téléphone</label>
            <input
              className="form-input"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Ville</label>
            <input
              className="form-input"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              className="form-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 className="section-title">
              <Shield size={18} style={{ display: 'inline', verticalAlign: -3 }} />{' '}
              Confidentialité
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 0',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>Silsila visible</div>
                <div className="form-hint">
                  Autoriser l'affichage de votre place dans l'arbre (si guides
                  concernés l'autorisent)
                </div>
              </div>
              <button
                type="button"
                className={`toggle ${silsilaVisible ? 'on' : ''}`}
                onClick={() => setSilsilaVisible(!silsilaVisible)}
                aria-label="Basculer silsila visible"
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 0',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>MFA</div>
                <div className="form-hint">
                  Authentification à deux facteurs
                </div>
              </div>
              <span
                className={`badge ${currentUser.mfaActive ? 'badge-success' : 'badge-warning'}`}
              >
                {currentUser.mfaActive ? 'Activé' : 'Désactivé'}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 0',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>
                  <MapPin size={14} style={{ display: 'inline' }} /> Localisation
                </div>
                <div className="form-hint">
                  Géré dans le module Localisation (opt-in)
                </div>
              </div>
              <Link to="/app/localisation" className="btn btn-outline btn-sm">
                Paramétrer
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Mes Dahiras</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {myDahiras.map((d) => (
                <div
                  key={d.id}
                  style={{
                    padding: '0.75rem',
                    background: 'var(--color-cream)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                    {d.nom}
                  </div>
                  <div className="form-hint">
                    {d.ville} · {d.confrerie} · {d.membreCount} membres
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: '1.25rem' }}>
            <h2 className="section-title">Historique de participation</h2>
            <ul
              style={{
                paddingLeft: '1.1rem',
                listStyle: 'disc',
                fontSize: '0.9rem',
                color: 'var(--color-text-muted)',
              }}
            >
              <li>Zikr du vendredi — présence confirmée (juil. 2026)</li>
              <li>Journée salubrité — participation (12 juil. 2026)</li>
              <li>Cotisation juillet — payée (5 000 XOF)</li>
              <li>Don projet bibliothèque — 15 000 XOF (juin 2026)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
