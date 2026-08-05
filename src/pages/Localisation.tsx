import { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Shield,
  Clock,
  Eye,
  EyeOff,
  AlertTriangle,
  Navigation,
} from 'lucide-react';
import { dahiras, formatDate, users } from '../data/mock';
import { useApp } from '../context/AppContext';
import type { LocVisibility } from '../data/types';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const visibilityOptions: { id: LocVisibility; label: string; desc: string }[] = [
  {
    id: 'personne',
    label: 'Personne',
    desc: 'Votre position n\'est partagée avec personne',
  },
  {
    id: 'dahira',
    label: 'Ma Dahira',
    desc: 'Uniquement les membres de vos Dahiras',
  },
  {
    id: 'amis',
    label: 'Contacts choisis',
    desc: 'Liste restreinte de membres autorisés',
  },
  {
    id: 'public_limite',
    label: 'Découverte limitée',
    desc: 'Position approximative pour la découverte de proximité',
  },
];

const durations = [
  { min: 30, label: '30 minutes' },
  { min: 60, label: '1 heure' },
  { min: 180, label: '3 heures' },
  { min: 720, label: '12 heures' },
  { min: 1440, label: '24 heures' },
];

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Localisation() {
  const {
    currentUser,
    locationShare,
    setLocationShare,
    userLocationShares,
    updateUserLocationShare,
  } = useApp();
  const [visibility, setVisibility] = useState<LocVisibility>(
    locationShare.visibility,
  );
  const [duration, setDuration] = useState(locationShare.durationMinutes || 60);
  const [toast, setToast] = useState('');
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);

  const nearby = dahiras.filter((d) => d.lat && d.lng);
  const activeShares = userLocationShares.filter((share) => share.active);
  const publicShares = activeShares.filter((share) => share.visibility !== 'personne');
  const mapCenter = publicShares.length
    ? [
        publicShares.reduce((sum, share) => sum + share.lat, 0) / publicShares.length,
        publicShares.reduce((sum, share) => sum + share.lng, 0) / publicShares.length,
      ]
    : [13.5127, 2.1128];

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    leafletMap.current = L.map(mapRef.current, {
      center: mapCenter as [number, number],
      zoom: 11,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(leafletMap.current);

    markerLayer.current = L.layerGroup().addTo(leafletMap.current);
  }, [mapCenter]);

  useEffect(() => {
    if (!leafletMap.current || !markerLayer.current) return;

    markerLayer.current.clearLayers();

    publicShares.forEach((share) => {
      const user = users.find((u) => u.id === share.userId);
      const marker = L.marker([share.lat, share.lng]);
      marker.bindPopup(
        `<strong>${user?.prenom ?? 'Utilisateur'} ${user?.nom ?? ''}</strong><br/>` +
          `Partage : ${share.visibility.replace('_', ' ')}<br/>` +
          `Mise à jour : ${new Date(share.updatedAt).toLocaleString()}`,
      );
      marker.addTo(markerLayer.current as L.LayerGroup);
    });

    if (publicShares.length && leafletMap.current) {
      const bounds = L.latLngBounds(publicShares.map((share) => [share.lat, share.lng] as [number, number]));
      leafletMap.current.fitBounds(bounds.pad(0.3));
    }
  }, [publicShares]);

  const activate = () => {
    if (visibility === 'personne') {
      setToast('Choisissez un public pour activer le partage.');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    const expires = new Date(Date.now() + duration * 60 * 1000).toISOString();
    const payload = {
      active: true,
      visibility,
      durationMinutes: duration,
      expiresAt: expires,
      lat: 13.5127,
      lng: 2.1128,
    };
    setLocationShare(payload);
    updateUserLocationShare({
      userId: currentUser.id,
      ...payload,
    });
    setToast(
      `Partage activé pour ${duration} min · public : ${visibilityOptions.find((v) => v.id === visibility)?.label}. Révoquable à tout moment.`,
    );
    setTimeout(() => setToast(''), 4000);
  };

  const revoke = () => {
    const payload = {
      active: false,
      visibility: 'personne' as LocVisibility,
      durationMinutes: duration,
    };
    setLocationShare(payload);
    updateUserLocationShare({
      userId: currentUser.id,
      ...payload,
      lat: locationShare.lat ?? 13.5127,
      lng: locationShare.lng ?? 2.1128,
    });
    setVisibility('personne');
    setToast('Partage de localisation révoqué immédiatement.');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Géolocalisation volontaire</h1>
          <p className="page-subtitle">
            Opt-in strict · qui · quand · combien de temps · révocation immédiate
          </p>
        </div>
      </div>

      {toast && (
        <div
          className={`alert ${locationShare.active ? 'alert-success' : 'alert-info'}`}
        >
          {toast}
        </div>
      )}

      <div className="alert alert-warning">
        <Shield size={18} />
        <div>
          <strong>Vie privée par défaut.</strong> Aucune position n'est visible
          sans votre consentement explicite. L'accès administrateur exceptionnel
          (récupération de compte uniquement) est journalisé et audité — jamais
          un accès permanent.
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <h2 className="section-title" style={{ margin: 0 }}>
              Mon partage
            </h2>
            <span
              className={`badge ${locationShare.active ? 'badge-success' : 'badge-primary'}`}
            >
              {locationShare.active ? (
                <>
                  <Eye size={12} /> Actif
                </>
              ) : (
                <>
                  <EyeOff size={12} /> Inactif
                </>
              )}
            </span>
          </div>

          {locationShare.active && locationShare.expiresAt && (
            <div
              style={{
                padding: '0.85rem 1rem',
                background: 'rgba(27, 122, 78, 0.08)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.25rem',
                fontSize: '0.9rem',
              }}
            >
              <Clock size={14} style={{ display: 'inline', verticalAlign: -2 }} />{' '}
              Expire le {formatDate(locationShare.expiresAt, true)}
              <br />
              <MapPin size={14} style={{ display: 'inline', verticalAlign: -2 }} />{' '}
              Position simulée : Niamey ({locationShare.lat?.toFixed(4)},{' '}
              {locationShare.lng?.toFixed(4)})
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Qui peut voir ma position ?</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {visibilityOptions.map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    border: `1.5px solid ${visibility === opt.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background:
                      visibility === opt.id
                        ? 'rgba(11, 61, 46, 0.04)'
                        : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === opt.id}
                    onChange={() => setVisibility(opt.id)}
                    style={{ marginTop: 3 }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{opt.label}</div>
                    <div className="form-hint">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Durée du partage</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {durations.map((d) => (
                <button
                  key={d.min}
                  type="button"
                  className={`btn btn-sm ${duration === d.min ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setDuration(d.min)}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <p className="form-hint" style={{ marginTop: 8 }}>
              Le partage expire automatiquement. Renouvelable manuellement.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {!locationShare.active ? (
              <button className="btn btn-primary" onClick={activate}>
                <Navigation size={16} />
                Activer le partage
              </button>
            ) : (
              <>
                <button className="btn btn-primary" onClick={activate}>
                  Renouveler / mettre à jour
                </button>
                <button className="btn btn-outline" onClick={revoke}>
                  <EyeOff size={16} />
                  Révoquer maintenant
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 className="section-title">
              <MapPin size={20} style={{ display: 'inline', verticalAlign: -4 }} />{' '}
              Dahiras & lieux à proximité
            </h2>
            <p className="form-hint" style={{ marginBottom: '1rem' }}>
              Basé sur les adresses déclarées des Dahiras (et positions
              volontairement partagées des membres, le cas échéant).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {nearby.map((d) => (
                <div
                  key={d.id}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    padding: '0.85rem',
                    background: 'var(--color-cream)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'var(--color-primary)',
                      color: 'var(--color-gold-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                      {d.nom}
                    </div>
                    <div className="form-hint">
                      {d.adresse ?? d.ville} · {d.ville}
                    </div>
                    <div className="form-hint">
                      {d.lat?.toFixed(3)}, {d.lng?.toFixed(3)} · {d.membreCount}{' '}
                      membres
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 className="section-title">
              <MapPin size={20} style={{ display: 'inline', verticalAlign: -4 }} /> Carte des partages
            </h2>
            <p className="form-hint" style={{ marginBottom: '1rem' }}>
              Positions des utilisateurs ayant activé le partage visible en public ou en découverte limitée.
            </p>
            <div
              ref={mapRef}
              style={{
                width: '100%',
                minHeight: 360,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            />
            {!publicShares.length && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.9rem 1rem',
                  background: 'rgba(255, 247, 226, 0.9)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(201, 162, 39, 0.35)',
                  color: 'var(--color-text-muted)',
                }}
              >
                Aucun partage de position disponible pour le moment.
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="section-title">
              <AlertTriangle size={18} style={{ display: 'inline', verticalAlign: -3 }} />{' '}
              Accès exceptionnel admin
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Un administrateur plateforme ne peut accéder aux données de
              localisation qu'en cas de <strong>récupération de compte</strong>{' '}
              (mot de passe oublié), via une procédure encadrée :
            </p>
            <ul
              style={{
                marginTop: '0.75rem',
                paddingLeft: '1.25rem',
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                listStyle: 'disc',
              }}
            >
              <li>Journalisation systématique de l'accès</li>
              <li>Procédure d'audit a posteriori</li>
              <li>Jamais d'accès permanent ou en lecture libre</li>
              <li>Traçabilité consultable dans Sécurité & Admin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
