import { Link } from 'react-router-dom';
import {
  Shield,
  BookOpen,
  Users,
  MapPin,
  Calendar,
  Wallet,
  GitBranch,
  Lock,
  ArrowRight,
  CheckCircle2,
  Globe,
  Heart,
} from 'lucide-react';
import './Landing.css';

const features = [
  {
    icon: Users,
    title: 'Fédérer',
    desc: 'Un espace unique reliant membres, Dahiras, responsables et guides spirituels.',
  },
  {
    icon: BookOpen,
    title: 'Préserver',
    desc: 'Archivage durable du patrimoine spirituel : silsila, enseignements, documents.',
  },
  {
    icon: Calendar,
    title: 'Coordonner',
    desc: 'Événements, annonces, cotisations et activités simplifiés pour chaque Dahira.',
  },
  {
    icon: Lock,
    title: 'Protéger',
    desc: 'Vie privée par défaut. Localisation opt-in, consentement explicite et révocable.',
  },
  {
    icon: Wallet,
    title: 'Structurer',
    desc: 'Gestion formalisée des cotisations et transparence financière pour les membres.',
  },
  {
    icon: Globe,
    title: 'Évoluer',
    desc: 'Architecture prête pour le multi-langue, multi-confréries et multi-pays.',
  },
];

const modules = [
  { icon: BuildingIcon, label: 'Gestion des Dahiras' },
  { icon: MapPin, label: 'Géolocalisation volontaire' },
  { icon: GitBranch, label: 'Silsila (arbre spirituel)' },
  { icon: BookOpen, label: 'Transmission du savoir' },
  { icon: Calendar, label: 'Événements & RSVP' },
  { icon: Heart, label: 'Réseau social privé' },
  { icon: Wallet, label: 'Contributions financières' },
  { icon: Shield, label: 'Sécurité & RBAC' },
];

function BuildingIcon(props: { size?: number }) {
  return (
    <svg
      width={props.size ?? 24}
      height={props.size ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
    </svg>
  );
}

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="container landing-header-inner">
          <div className="landing-logo">
            <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden>
              <rect width="40" height="40" rx="10" fill="#0B3D2E" />
              <path
                d="M20 6c-5 5-8 9-8 14a8 8 0 0016 0c0-5-3-9-8-14z"
                fill="#C9A227"
              />
              <circle cx="20" cy="22" r="2.5" fill="#0B3D2E" />
            </svg>
            <span>Dahira</span>
          </div>
          <nav className="landing-nav">
            <a href="#vision">Vision</a>
            <a href="#modules">Modules</a>
            <a href="#valeurs">Valeurs</a>
            <Link to="/login" className="btn btn-outline btn-sm">
              Connexion
            </Link>
            <Link to="/login" className="btn btn-primary btn-sm">
              Entrer dans l'app
            </Link>
          </nav>
        </div>
      </header>

      <section className="hero pattern-bg">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="badge badge-gold">Plateforme communautaire soufie</span>
            <h1>
              Connecter, organiser,
              <br />
              <em>préserver & transmettre</em>
            </h1>
            <p className="hero-lead">
              Dahira est l'écosystème numérique sécurisé qui unit les communautés
              soufies — membres, responsables et guides — autour de la vie spirituelle,
              culturelle et sociale.
            </p>
            <div className="hero-cta">
              <Link to="/login" className="btn btn-gold btn-lg">
                Découvrir la plateforme
                <ArrowRight size={18} />
              </Link>
              <a href="#vision" className="btn btn-outline btn-lg hero-outline">
                Notre vision
              </a>
            </div>
            <div className="hero-trust">
              <CheckCircle2 size={16} />
              <span>Vie privée par défaut · Consentement explicite · Open by design</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="avatar">AD</div>
                <div>
                  <strong>Dahira Al-Ihsan</strong>
                  <div className="muted">Niamey · 148 membres</div>
                </div>
              </div>
              <div className="hero-card-stats">
                <div>
                  <div className="hstat-val">6</div>
                  <div className="hstat-lbl">Événements</div>
                </div>
                <div>
                  <div className="hstat-val">12</div>
                  <div className="hstat-lbl">Archives</div>
                </div>
                <div>
                  <div className="hstat-val">57%</div>
                  <div className="hstat-lbl">Projet biblio.</div>
                </div>
              </div>
              <div className="hero-card-event">
                <Calendar size={16} />
                <div>
                  <strong>Zikr du vendredi</strong>
                  <div className="muted">17 juil. · 19h00 · Plateau</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="vision" className="section">
        <div className="container">
          <div className="section-head">
            <span className="badge badge-primary">Vision</span>
            <h2 className="section-title-lg">Six objectifs, une communauté</h2>
            <p>
              Aujourd'hui la coordination repose sur WhatsApp, appels et cahiers papier.
              Dahira structure l'information, protège les données et préserve le patrimoine
              spirituel — sans complexité inutile.
            </p>
          </div>
          <div className="grid-3 feature-grid">
            {features.map((f) => (
              <div key={f.title} className="card feature-card card-hover">
                <div className="feature-icon">
                  <f.icon size={22} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="modules" className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="badge badge-gold">Modules</span>
            <h2 className="section-title-lg">Un écosystème complet</h2>
            <p>
              Chaque module répond à un besoin concret du cahier des charges fonctionnel —
              du profil membre à la silsila, des cotisations à l'audit de sécurité.
            </p>
          </div>
          <div className="modules-grid">
            {modules.map((m) => (
              <div key={m.label} className="module-chip">
                <m.icon size={20} />
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="valeurs" className="section">
        <div className="container">
          <div className="section-head">
            <span className="badge badge-primary">Valeurs de conception</span>
            <h2 className="section-title-lg">Sobriété de confiance</h2>
          </div>
          <div className="grid-2 values-grid">
            <div className="card value-card">
              <Lock size={28} className="value-icon" />
              <h3>Vie privée par défaut</h3>
              <p>
                Rien n'est visible sans consentement explicite et révocable. La
                géolocalisation est strictement opt-in, limitée dans le temps et
                révocable instantanément.
              </p>
            </div>
            <div className="card value-card">
              <Shield size={28} className="value-icon" />
              <h3>Sobriété de confiance</h3>
              <p>
                Localisation, silsila et finances sont soumis à validation et
                traçabilité — jamais à l'auto-publication libre non contrôlée.
              </p>
            </div>
            <div className="card value-card">
              <Users size={28} className="value-icon" />
              <h3>Simplicité d'usage</h3>
              <p>
                Interface claire, utilisable par un public large, y compris peu
                familier du numérique. Accessibilité et lisibilité prioritaires.
              </p>
            </div>
            <div className="card value-card">
              <Globe size={28} className="value-icon" />
              <h3>Évolutivité sans rupture</h3>
              <p>
                Les choix techniques initiaux permettent la croissance du local
                vers le national puis l'international, sans refonte majeure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section pattern-bg">
        <div className="container cta-inner">
          <h2>Prêt à rejoindre votre Dahira numérique ?</h2>
          <p>
            Explorez le prototype interactif — tableau de bord, événements, silsila,
            finances, localisation et administration.
          </p>
          <Link to="/login" className="btn btn-gold btn-lg">
            Accéder à la plateforme
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <strong>Dahira</strong>
            <span>Communauté · Préservation · Confiance</span>
          </div>
          <div className="footer-meta">
            Prototype MVP · Livrables 1–2 · © 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
