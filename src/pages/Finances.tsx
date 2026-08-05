import { useState } from 'react';
import {
  Wallet,
  Plus,
  TrendingUp,
  PieChart,
  FileText,
} from 'lucide-react';
import {
  contributions,
  projects,
  getUser,
  fullName,
  formatDate,
  formatXOF,
  statusLabels,
} from '../data/mock';
import { useApp } from '../context/AppContext';

export default function Finances() {
  const { activeDahiraId, currentUser } = useApp();
  const [tab, setTab] = useState<'apercu' | 'cotisations' | 'projets' | 'rapport'>(
    'apercu',
  );
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState('');

  const list = contributions.filter((c) => c.dahiraId === activeDahiraId);
  const projs = projects.filter((p) => p.dahiraId === activeDahiraId);

  const totalPaye = list
    .filter((c) => c.status === 'paye')
    .reduce((s, c) => s + c.montant, 0);
  const totalCotisations = list
    .filter((c) => c.type === 'cotisation' && c.status === 'paye')
    .reduce((s, c) => s + c.montant, 0);
  const totalDons = list
    .filter((c) => c.type === 'don' && c.status === 'paye')
    .reduce((s, c) => s + c.montant, 0);
  const enAttente = list.filter((c) => c.status === 'en_attente').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Contributions financières</h1>
          <p className="page-subtitle">
            Cotisations, dons, projets et transparence comptable
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} />
          Enregistrer
        </button>
      </div>

      {toast && <div className="alert alert-success">{toast}</div>}

      <div className="alert alert-info">
        <Wallet size={18} />
        <div>
          MVP : enregistrement manuel des cotisations et dons. Les paiements en
          ligne intégrés sont hors périmètre (livrable 9). La transparence est
          limitée aux membres de la Dahira concernée.
        </div>
      </div>

      <div className="tabs">
        {(
          [
            ['apercu', 'Aperçu'],
            ['cotisations', 'Cotisations & dons'],
            ['projets', 'Projets'],
            ['rapport', 'Rapport'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            className={`tab ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'apercu' && (
        <>
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-icon">
                <Wallet size={20} />
              </div>
              <div className="stat-value" style={{ fontSize: '1.15rem' }}>
                {formatXOF(totalPaye)}
              </div>
              <div className="stat-label">Total encaissé (demo)</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={20} />
              </div>
              <div className="stat-value" style={{ fontSize: '1.15rem' }}>
                {formatXOF(totalCotisations)}
              </div>
              <div className="stat-label">Cotisations</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <PieChart size={20} />
              </div>
              <div className="stat-value" style={{ fontSize: '1.15rem' }}>
                {formatXOF(totalDons)}
              </div>
              <div className="stat-label">Dons</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FileText size={20} />
              </div>
              <div className="stat-value">{enAttente}</div>
              <div className="stat-label">En attente</div>
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Projets financés</h2>
            {projs.map((p) => {
              const pct = Math.min(
                100,
                Math.round((p.collecté / p.objectif) * 100),
              );
              return (
                <div key={p.id} style={{ marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 6,
                      flexWrap: 'wrap',
                      gap: 8,
                    }}
                  >
                    <div>
                      <strong>{p.titre}</strong>
                      <span
                        className={`badge ${p.status === 'actif' ? 'badge-success' : 'badge-primary'}`}
                        style={{ marginLeft: 8 }}
                      >
                        {statusLabels[p.status]}
                      </span>
                    </div>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                      {pct}%
                    </span>
                  </div>
                  <p className="form-hint" style={{ marginBottom: 8 }}>
                    {p.description}
                  </p>
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
        </>
      )}

      {tab === 'cotisations' && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Membre</th>
                  <th>Type</th>
                  <th>Motif</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {list
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((c) => {
                    const u = getUser(c.userId);
                    return (
                      <tr key={c.id}>
                        <td>{formatDate(c.date)}</td>
                        <td style={{ fontWeight: 600 }}>
                          {u ? fullName(u) : '—'}
                        </td>
                        <td>
                          <span
                            className={`badge ${c.type === 'don' ? 'badge-gold' : 'badge-primary'}`}
                          >
                            {c.type === 'don' ? 'Don' : 'Cotisation'}
                          </span>
                        </td>
                        <td>{c.motif ?? '—'}</td>
                        <td style={{ fontWeight: 700 }}>
                          {formatXOF(c.montant)}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              c.status === 'paye'
                                ? 'badge-success'
                                : c.status === 'en_retard'
                                  ? 'badge-danger'
                                  : 'badge-warning'
                            }`}
                          >
                            {statusLabels[c.status]}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'projets' && (
        <div className="grid-2">
          {projs.map((p) => {
            const pct = Math.min(
              100,
              Math.round((p.collecté / p.objectif) * 100),
            );
            return (
              <div key={p.id} className="card">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-primary)',
                      fontSize: '1.2rem',
                    }}
                  >
                    {p.titre}
                  </h3>
                  <span
                    className={`badge ${p.status === 'actif' ? 'badge-success' : 'badge-primary'}`}
                  >
                    {statusLabels[p.status]}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '1rem',
                  }}
                >
                  {p.description}
                </p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 8,
                    fontSize: '0.85rem',
                  }}
                >
                  <strong>{formatXOF(p.collecté)}</strong>
                  <span className="form-hint">
                    / {formatXOF(p.objectif)}
                  </span>
                </div>
                <div className="form-hint" style={{ marginTop: 8 }}>
                  Début {formatDate(p.dateDebut)}
                  {p.dateFin ? ` · Fin prévue ${formatDate(p.dateFin)}` : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'rapport' && (
        <div className="card" style={{ maxWidth: 640 }}>
          <h2 className="section-title">Rapport financier périodique</h2>
          <p className="form-hint" style={{ marginBottom: '1.25rem' }}>
            Accessible aux membres de la Dahira · Généré pour la période de
            démonstration
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: 'var(--color-cream)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div className="form-hint">Recettes cotisations</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {formatXOF(totalCotisations)}
              </div>
            </div>
            <div
              style={{
                padding: '1rem',
                background: 'var(--color-cream)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div className="form-hint">Recettes dons</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {formatXOF(totalDons)}
              </div>
            </div>
            <div
              style={{
                padding: '1rem',
                background: 'var(--color-cream)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div className="form-hint">Total encaissé</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {formatXOF(totalPaye)}
              </div>
            </div>
            <div
              style={{
                padding: '1rem',
                background: 'var(--color-cream)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div className="form-hint">Projets actifs</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {projs.filter((p) => p.status === 'actif').length}
              </div>
            </div>
          </div>
          <div className="alert alert-warning">
            Budget prévisionnel et export PDF : prévus dans les itérations
            post-MVP. Journalisation des modifications financières active.
          </div>
          <button className="btn btn-outline">
            <FileText size={16} /> Exporter le rapport (simulation)
          </button>
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Enregistrer une contribution</h2>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowAdd(false)}
              >
                Fermer
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select">
                <option value="cotisation">Cotisation régulière</option>
                <option value="don">Don ponctuel</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Montant (XOF)</label>
              <input type="number" className="form-input" placeholder="5000" />
            </div>
            <div className="form-group">
              <label className="form-label">Membre</label>
              <input
                className="form-input"
                defaultValue={fullName(currentUser)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Motif / projet (optionnel)</label>
              <input className="form-input" placeholder="Cotisation juillet…" />
            </div>
            <div className="form-group">
              <label className="form-label">Statut</label>
              <select className="form-select">
                <option value="paye">Payé</option>
                <option value="en_attente">En attente</option>
              </select>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => {
                setShowAdd(false);
                setToast(
                  'Contribution enregistrée et journalisée (simulation).',
                );
                setTimeout(() => setToast(''), 3000);
              }}
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
