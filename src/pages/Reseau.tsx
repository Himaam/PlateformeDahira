import { useState } from 'react';
import { Heart, MessageSquare, Share2, Plus, Users } from 'lucide-react';
import {
  posts as initialPosts,
  getUser,
  fullName,
  getInitials,
  formatDate,
} from '../data/mock';
import { useApp } from '../context/AppContext';

export default function Reseau() {
  const { activeDahiraId, currentUser } = useApp();
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<'fil' | 'groupes'>('fil');

  const feed = posts
    .filter((p) => p.dahiraId === activeDahiraId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const publish = () => {
    if (!newPost.trim()) return;
    setPosts((prev) => [
      {
        id: `po${Date.now()}`,
        dahiraId: activeDahiraId,
        auteurId: currentUser.id,
        contenu: newPost.trim(),
        date: new Date().toISOString(),
        likes: 0,
        commentaires: 0,
      },
      ...prev,
    ]);
    setNewPost('');
  };

  const toggleLike = (id: string) => {
    const isLiked = liked[id];
    setLiked((prev) => ({ ...prev, [id]: !isLiked }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likes: p.likes + (isLiked ? -1 : 1) }
          : p,
      ),
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Réseau social privé</h1>
          <p className="page-subtitle">
            Publications, groupes thématiques et échanges au sein de la Dahira
          </p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${tab === 'fil' ? 'active' : ''}`}
          onClick={() => setTab('fil')}
        >
          Fil de la Dahira
        </button>
        <button
          className={`tab ${tab === 'groupes' ? 'active' : ''}`}
          onClick={() => setTab('groupes')}
        >
          Groupes thématiques
        </button>
      </div>

      {tab === 'fil' && (
        <div style={{ maxWidth: 640 }}>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '0.75rem',
              }}
            >
              <div className="avatar">{getInitials(currentUser)}</div>
              <textarea
                className="form-textarea"
                style={{ minHeight: 80 }}
                placeholder="Partager une pensée, une annonce, un rappel…"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className="form-hint">
                Visible par les membres de la Dahira active
              </span>
              <button
                className="btn btn-primary btn-sm"
                onClick={publish}
                disabled={!newPost.trim()}
              >
                <Plus size={14} /> Publier
              </button>
            </div>
          </div>

          {feed.map((p) => {
            const author = getUser(p.auteurId);
            return (
              <div key={p.id} className="card" style={{ marginBottom: '1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div className="avatar">
                    {author ? getInitials(author) : '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {author ? fullName(author) : 'Membre'}
                    </div>
                    <div className="form-hint">
                      {formatDate(p.date, true)}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.65 }}>
                  {p.contenu}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '1rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  <button
                    className={`btn btn-ghost btn-sm ${liked[p.id] ? 'liked' : ''}`}
                    onClick={() => toggleLike(p.id)}
                    style={{
                      color: liked[p.id]
                        ? 'var(--color-danger)'
                        : undefined,
                    }}
                  >
                    <Heart
                      size={16}
                      fill={liked[p.id] ? 'currentColor' : 'none'}
                    />{' '}
                    {p.likes}
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    <MessageSquare size={16} /> {p.commentaires}
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    <Share2 size={16} /> Partager
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'groupes' && (
        <div className="grid-3">
          {[
            {
              nom: 'Jeunes & formation',
              membres: 34,
              desc: 'Cours, ateliers et mentorat pour les jeunes de la Dahira.',
            },
            {
              nom: 'Qasidas & chants',
              membres: 28,
              desc: 'Partage et apprentissage des qasidas et récitations.',
            },
            {
              nom: 'Actions sociales',
              membres: 41,
              desc: 'Organisation des dons, salubrité et entraide.',
            },
            {
              nom: 'Comité de gestion',
              membres: 8,
              desc: 'Espace privé du bureau (président, trésorier, secrétaire…).',
            },
          ].map((g) => (
            <div key={g.nom} className="card card-hover">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'rgba(11, 61, 46, 0.08)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.85rem',
                }}
              >
                <Users size={22} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-primary)',
                  marginBottom: 6,
                }}
              >
                {g.nom}
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                  marginBottom: '0.75rem',
                }}
              >
                {g.desc}
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span className="form-hint">{g.membres} membres</span>
                <button className="btn btn-outline btn-sm">Rejoindre</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
