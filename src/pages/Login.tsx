import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Login.css';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('amadou.diallo@email.com');
  const [password, setPassword] = useState('demo1234');
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez renseigner email et mot de passe.');
      return;
    }
    setError('');
    setStep('mfa');
  };

  const handleMfa = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Saisissez le code à 6 chiffres (démo : 123456).');
      return;
    }
    setError('');
    login();
    navigate('/app');
  };

  const demoLogin = () => {
    login();
    navigate('/app');
  };

  return (
    <div className="login-page pattern-bg">
      <div className="login-card">
        <div className="login-brand">
          <svg viewBox="0 0 40 40" width="48" height="48" aria-hidden>
            <rect width="40" height="40" rx="10" fill="#0B3D2E" />
            <path
              d="M20 6c-5 5-8 9-8 14a8 8 0 0016 0c0-5-3-9-8-14z"
              fill="#C9A227"
            />
            <circle cx="20" cy="22" r="2.5" fill="#0B3D2E" />
          </svg>
          <h1>Dahira</h1>
          <p>Connexion sécurisée à votre communauté</p>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleCredentials}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Mot de passe
              </label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Masquer' : 'Afficher'}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="alert alert-warning">{error}</div>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Shield size={18} />
              Continuer
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: '0.75rem' }}
              onClick={demoLogin}
            >
              Accès démo rapide (sans MFA)
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfa}>
            <div className="mfa-info">
              <Smartphone size={28} />
              <p>
                Authentification à deux facteurs (MFA). Saisissez le code envoyé
                sur votre appareil de confiance.
              </p>
              <p className="form-hint">Code démo : <strong>123456</strong></p>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="otp">
                Code à 6 chiffres
              </label>
              <input
                id="otp"
                type="text"
                className="form-input"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                style={{ letterSpacing: '0.4em', textAlign: 'center', fontSize: '1.25rem' }}
              />
            </div>
            {error && <div className="alert alert-warning">{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Valider et entrer
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: '0.75rem' }}
              onClick={() => {
                setStep('credentials');
                setError('');
              }}
            >
              Retour
            </button>
          </form>
        )}

        <div className="login-footer">
          <Link to="/">← Retour au site</Link>
          <span className="form-hint">Prototype · données de démonstration</span>
        </div>
      </div>
    </div>
  );
}
