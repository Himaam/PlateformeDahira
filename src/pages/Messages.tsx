import { useMemo, useState } from 'react';
import { Send, Search } from 'lucide-react';
import {
  messages as initialMessages,
  users,
  getUser,
  fullName,
  getInitials,
  formatDate,
  currentUserId,
} from '../data/mock';

export default function Messages() {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedPeer, setSelectedPeer] = useState<string | null>('u3');
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');

  const conversations = useMemo(() => {
    const peerIds = new Set<string>();
    messages.forEach((m) => {
      if (m.fromId === currentUserId) peerIds.add(m.toId);
      if (m.toId === currentUserId) peerIds.add(m.fromId);
    });
    const result: Array<{
      userId: string;
      last: string;
      unread: number;
      preview: string;
    }> = [];
    peerIds.forEach((id) => {
      const thread = messages
        .filter(
          (m) =>
            (m.fromId === currentUserId && m.toId === id) ||
            (m.fromId === id && m.toId === currentUserId),
        )
        .sort((a, b) => b.date.localeCompare(a.date));
      const last = thread[0];
      result.push({
        userId: id,
        last: last?.date ?? '',
        unread: thread.filter((m) => !m.lu && m.toId === currentUserId).length,
        preview: last?.contenu ?? '',
      });
    });
    return result.sort((a, b) => b.last.localeCompare(a.last));
  }, [messages]);

  const filteredConvos = conversations.filter((c) => {
    const u = getUser(c.userId);
    if (!u) return false;
    return fullName(u).toLowerCase().includes(search.toLowerCase());
  });

  const thread = selectedPeer
    ? messages
        .filter(
          (m) =>
            (m.fromId === currentUserId && m.toId === selectedPeer) ||
            (m.fromId === selectedPeer && m.toId === currentUserId),
        )
        .sort((a, b) => a.date.localeCompare(b.date))
    : [];

  const peer = selectedPeer ? getUser(selectedPeer) : null;

  const send = () => {
    if (!draft.trim() || !selectedPeer) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        fromId: currentUserId,
        toId: selectedPeer,
        contenu: draft.trim(),
        date: new Date().toISOString(),
        lu: true,
      },
    ]);
    setDraft('');
  };

  // Mark read when opening
  const openPeer = (id: string) => {
    setSelectedPeer(id);
    setMessages((prev) =>
      prev.map((m) =>
        m.fromId === id && m.toId === currentUserId ? { ...m, lu: true } : m,
      ),
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Messagerie privée</h1>
          <p className="page-subtitle">
            Échanges sécurisés entre membres
          </p>
        </div>
      </div>

      <div
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          padding: 0,
          minHeight: 480,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            borderRight: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '0.85rem', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: 12,
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                className="form-input"
                style={{ paddingLeft: 32, paddingTop: 8, paddingBottom: 8 }}
                placeholder="Rechercher…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConvos.map((c) => {
              const u = getUser(c.userId);
              if (!u) return null;
              return (
                <button
                  key={c.userId}
                  onClick={() => openPeer(c.userId)}
                  style={{
                    display: 'flex',
                    gap: '0.65rem',
                    width: '100%',
                    padding: '0.85rem',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--color-border)',
                    background:
                      selectedPeer === c.userId
                        ? 'rgba(11, 61, 46, 0.06)'
                        : 'transparent',
                    borderLeft:
                      selectedPeer === c.userId
                        ? '3px solid var(--color-gold)'
                        : '3px solid transparent',
                  }}
                >
                  <div className="avatar avatar-sm">{getInitials(u)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 4,
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {fullName(u)}
                      </span>
                      {c.unread > 0 && (
                        <span className="badge badge-danger">{c.unread}</span>
                      )}
                    </div>
                    <div
                      className="form-hint"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c.preview}
                    </div>
                  </div>
                </button>
              );
            })}
            {/* Quick start with other members */}
            <div style={{ padding: '0.75rem' }}>
              <div className="form-hint" style={{ marginBottom: 6 }}>
                Démarrer une conversation
              </div>
              {users
                .filter(
                  (u) =>
                    u.id !== currentUserId &&
                    !conversations.find((c) => c.userId === u.id),
                )
                .slice(0, 4)
                .map((u) => (
                  <button
                    key={u.id}
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => openPeer(u.id)}
                  >
                    {fullName(u)}
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 480 }}>
          {!peer ? (
            <div className="empty-state" style={{ flex: 1 }}>
              <p>Sélectionnez une conversation</p>
            </div>
          ) : (
            <>
              <div
                style={{
                  padding: '0.9rem 1.15rem',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <div className="avatar avatar-sm">{getInitials(peer)}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{fullName(peer)}</div>
                  <div className="form-hint">{peer.ville ?? ''}</div>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  background: 'var(--color-cream)',
                }}
              >
                {thread.length === 0 && (
                  <div className="empty-state">
                    Aucun message. Écrivez le premier !
                  </div>
                )}
                {thread.map((m) => {
                  const mine = m.fromId === currentUserId;
                  return (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: mine ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                      }}
                    >
                      <div
                        style={{
                          padding: '0.7rem 0.95rem',
                          borderRadius: mine
                            ? '14px 14px 4px 14px'
                            : '14px 14px 14px 4px',
                          background: mine
                            ? 'var(--color-primary)'
                            : 'white',
                          color: mine ? 'white' : 'var(--color-text)',
                          fontSize: '0.9rem',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        {m.contenu}
                      </div>
                      <div
                        className="form-hint"
                        style={{
                          textAlign: mine ? 'right' : 'left',
                          marginTop: 4,
                          fontSize: '0.7rem',
                        }}
                      >
                        {formatDate(m.date, true)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  padding: '0.85rem',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  gap: '0.5rem',
                }}
              >
                <input
                  className="form-input"
                  placeholder="Écrire un message…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <button
                  className="btn btn-primary"
                  onClick={send}
                  disabled={!draft.trim()}
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .card[style] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
