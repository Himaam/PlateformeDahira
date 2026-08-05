import {
  Shield,
  Key,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Lock,
  FileText,
} from 'lucide-react';
import {
  auditLogs,
  getUser,
  fullName,
  formatDate,
  users,
  roleLabels,
} from '../data/mock';
import { useApp } from '../context/AppContext';

export default function Securite() {
  const { currentUser } = useApp();

  const severityBadge = (s: string) => {
    if (s === 'critical') return 'badge-danger';
    if (s === 'warning') return 'badge-warning';
    return 'badge-info';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sécurité & Administration</h1>
          <p className="page-subtitle">
            MFA, RBAC, journalisation des actions sensibles, audit
          </p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon">
            <Lock size={20} />
          </div>
          <div className="stat-value" style={{ fontSize: '1.1rem' }}>
            {currentUser.mfaActive ? 'MFA actif' : 'MFA off'}
          </div>
          <div className="stat-label">Votre authentification</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={20} />
          </div>
          <div className="stat-value">{auditLogs.length}</div>
          <div className="stat-label">Événements journalisés (demo)</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-value">
            {auditLogs.filter((l) => l.severity === 'critical').length}
          </div>
          <div className="stat-label">Actions critiques</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.5rem', alignItems: 'start' }}>
        <div className="card">
          <h2 className="section-title">
            <Key size={20} style={{ display: 'inline', verticalAlign: -4 }} />{' '}
            Authentification
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: 'var(--color-cream)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>Mot de passe + MFA</div>
                <div className="form-hint">
                  Authentification forte requise pour les rôles sensibles
                </div>
              </div>
              <span className="badge badge-success">
                <CheckCircle2 size={12} /> Activé
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: 'var(--color-cream)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>Récupération de compte</div>
                <div className="form-hint">
                  Procédure encadrée et journalisée
                </div>
              </div>
              <button className="btn btn-outline btn-sm">Démarrer</button>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: 'var(--color-cream)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>Sessions actives</div>
                <div className="form-hint">1 session · cet appareil</div>
              </div>
              <button className="btn btn-ghost btn-sm">Gérer</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">
            <Shield size={20} style={{ display: 'inline', verticalAlign: -4 }} />{' '}
            Rôles & permissions (RBAC)
          </h2>
          <p className="form-hint" style={{ marginBottom: '1rem' }}>
            Un même utilisateur peut cumuler plusieurs rôles (ex. responsable
            d'une Dahira et membre d'une autre).
          </p>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôles</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) => u.roles.length > 0)
                  .map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{fullName(u)}</td>
                      <td>
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}
                        >
                          {u.roles.map((r) => (
                            <span key={r} className="badge badge-primary">
                              {roleLabels[r]}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.25rem 1.25rem 0' }}>
          <h2 className="section-title">
            <Eye size={20} style={{ display: 'inline', verticalAlign: -4 }} />{' '}
            Journal des actions sensibles
          </h2>
          <p className="form-hint" style={{ marginBottom: '1rem' }}>
            Accès admin, validation de contenu, modification de rôle, accès
            exceptionnel localisation, modifications financières.
          </p>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Acteur</th>
                <th>Détails</th>
                <th>Sévérité</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((log) => {
                  const actor = getUser(log.acteurId);
                  return (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {formatDate(log.date, true)}
                      </td>
                      <td>
                        <code
                          style={{
                            fontSize: '0.75rem',
                            background: 'var(--color-cream)',
                            padding: '2px 6px',
                            borderRadius: 4,
                          }}
                        >
                          {log.action}
                        </code>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {actor ? fullName(actor) : log.acteurId}
                      </td>
                      <td style={{ fontSize: '0.875rem' }}>{log.details}</td>
                      <td>
                        <span className={`badge ${severityBadge(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 className="section-title">Mesures de sécurité (conception)</h2>
        <div className="grid-2">
          {[
            {
              t: 'Chiffrement',
              d: 'Données sensibles chiffrées au repos et en transit (TLS).',
            },
            {
              t: 'Sauvegardes',
              d: 'Sauvegardes automatiques régulières avec tests de restauration.',
            },
            {
              t: 'Anti-abus',
              d: 'Limitation de taux, signalement, modération des contenus.',
            },
            {
              t: 'Auditabilité',
              d: 'Toute action sensible est tracée et consultable par les admins.',
            },
          ].map((item) => (
            <div
              key={item.t}
              style={{
                padding: '0.85rem',
                background: 'var(--color-cream)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                {item.t}
              </div>
              <div className="form-hint">{item.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
