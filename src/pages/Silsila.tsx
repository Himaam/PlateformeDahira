import { useMemo, useState } from 'react';
import { GitBranch, Plus, User, FileText } from 'lucide-react';
import { silsila, getUser, fullName } from '../data/mock';
import type { SilsilaNode } from '../data/types';

export default function Silsila() {
  const [selectedId, setSelectedId] = useState<string | null>('s7');
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState('');

  const selected = silsila.find((n) => n.id === selectedId);
  const maxGen = Math.max(...silsila.map((n) => n.generation));

  const byGeneration = useMemo(() => {
    const map = new Map<number, SilsilaNode[]>();
    silsila.forEach((n) => {
      const arr = map.get(n.generation) ?? [];
      arr.push(n);
      map.set(n.generation, arr);
    });
    return map;
  }, []);

  const childrenOf = (id: string) =>
    silsila.filter((n) => n.parentId === id);

  const parentOf = selected?.parentId
    ? silsila.find((n) => n.id === selected.parentId)
    : null;

  const linkedUser = selected?.userId ? getUser(selected.userId) : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Silsila</h1>
          <p className="page-subtitle">
            Arbre de transmission spirituelle — consultation et relations validées
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} />
          Ajouter une relation
        </button>
      </div>

      {toast && <div className="alert alert-success">{toast}</div>}

      <div className="alert alert-info">
        <GitBranch size={18} />
        <div>
          L'ajout d'une relation maître–disciple est soumis à validation d'un
          enseignant ou administrateur habilité. La visualisation de votre
          propre arbre dépend des autorisations des guides concernés.
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card" style={{ overflowX: 'auto' }}>
          <h2 className="section-title">Arbre interactif</h2>
          <div className="silsila-tree">
            {Array.from({ length: maxGen + 1 }, (_, gen) => {
              const nodes = byGeneration.get(gen) ?? [];
              return (
                <div key={gen} className="silsila-gen">
                  <div className="silsila-gen-label">G{gen}</div>
                  <div className="silsila-nodes">
                    {nodes.map((n) => (
                      <button
                        key={n.id}
                        className={`silsila-node ${selectedId === n.id ? 'selected' : ''} ${n.parentId ? 'has-parent' : ''}`}
                        onClick={() => setSelectedId(n.id)}
                      >
                        <div className="silsila-node-name">{n.nom}</div>
                        {n.titre && (
                          <div className="silsila-node-title">{n.titre}</div>
                        )}
                        {n.dates && (
                          <div className="silsila-node-dates">{n.dates}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ position: 'sticky', top: 80 }}>
          {!selected ? (
            <div className="empty-state">
              <User size={40} />
              <p>Sélectionnez un nœud de l'arbre</p>
            </div>
          ) : (
            <>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-primary)',
                  fontSize: '1.4rem',
                  marginBottom: '0.25rem',
                }}
              >
                {selected.nom}
              </h2>
              {selected.titre && (
                <div
                  style={{
                    color: 'var(--color-gold-dark)',
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                  }}
                >
                  {selected.titre}
                </div>
              )}
              {selected.dates && (
                <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>
                  {selected.dates}
                </span>
              )}
              {selected.biographie && (
                <p
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.925rem',
                    margin: '1rem 0',
                  }}
                >
                  {selected.biographie}
                </p>
              )}

              {linkedUser && (
                <div
                  style={{
                    display: 'flex',
                    gap: '0.65rem',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'var(--color-cream)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                  }}
                >
                  <div className="avatar avatar-sm">
                    {linkedUser.prenom[0]}
                    {linkedUser.nom[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      Profil lié : {fullName(linkedUser)}
                    </div>
                    <div className="form-hint">Membre de la plateforme</div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <div className="form-label">Maître (parent)</div>
                {parentOf ? (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedId(parentOf.id)}
                  >
                    {parentOf.nom}
                  </button>
                ) : (
                  <span className="form-hint">Racine de la chaîne</span>
                )}
              </div>

              <div className="form-group">
                <div className="form-label">
                  Disciples ({childrenOf(selected.id).length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {childrenOf(selected.id).length === 0 ? (
                    <span className="form-hint">Aucun disciple enregistré</span>
                  ) : (
                    childrenOf(selected.id).map((c) => (
                      <button
                        key={c.id}
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedId(c.id)}
                      >
                        {c.nom}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.85rem',
                  border: '1px dashed var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <FileText size={16} color="var(--color-text-muted)" />
                  <strong style={{ fontSize: '0.9rem' }}>Documents liés</strong>
                </div>
                <p className="form-hint">
                  Biographies, textes et enregistrements peuvent être associés à
                  chaque nœud (module Savoir).
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Relation maître–disciple</h2>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowAdd(false)}
              >
                Fermer
              </button>
            </div>
            <div className="alert alert-warning">
              Soumission soumise à validation d'un enseignant habilité.
            </div>
            <div className="form-group">
              <label className="form-label">Maître (nœud parent)</label>
              <select className="form-select">
                {silsila.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nom}
                    {n.titre ? ` — ${n.titre}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nom du disciple</label>
              <input className="form-input" placeholder="Nom complet" />
            </div>
            <div className="form-group">
              <label className="form-label">Titre / fonction (optionnel)</label>
              <input className="form-input" placeholder="Ex. Disciple, Muqaddam…" />
            </div>
            <div className="form-group">
              <label className="form-label">Notes / justification</label>
              <textarea
                className="form-textarea"
                placeholder="Contexte de la relation de transmission…"
              />
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => {
                setShowAdd(false);
                setToast(
                  'Relation soumise pour validation. Un enseignant habilité l\'examinera.',
                );
                setTimeout(() => setToast(''), 3500);
              }}
            >
              Soumettre pour validation
            </button>
          </div>
        </div>
      )}

      <style>{`
        .silsila-tree {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          min-width: 280px;
        }
        .silsila-gen {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }
        .silsila-gen-label {
          min-width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--color-cream-dark);
          color: var(--color-text-muted);
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
        }
        .silsila-nodes {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          flex: 1;
        }
        .silsila-node {
          background: var(--color-cream);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.85rem;
          text-align: left;
          min-width: 140px;
          transition: all 0.15s;
        }
        .silsila-node:hover {
          border-color: var(--color-gold);
          box-shadow: var(--shadow-sm);
        }
        .silsila-node.selected {
          border-color: var(--color-primary);
          background: rgba(11, 61, 46, 0.06);
          box-shadow: 0 0 0 3px rgba(11, 61, 46, 0.1);
        }
        .silsila-node-name {
          font-weight: 700;
          font-size: 0.875rem;
          color: var(--color-primary);
        }
        .silsila-node-title {
          font-size: 0.75rem;
          color: var(--color-gold-dark);
          margin-top: 2px;
        }
        .silsila-node-dates {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}
