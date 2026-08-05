import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Dahiras from './pages/Dahiras';
import Membres from './pages/Membres';
import Evenements from './pages/Evenements';
import Savoir from './pages/Savoir';
import Silsila from './pages/Silsila';
import Reseau from './pages/Reseau';
import Finances from './pages/Finances';
import Localisation from './pages/Localisation';
import Messages from './pages/Messages';
import Securite from './pages/Securite';
import Profil from './pages/Profil';

function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/app"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dahiras" element={<Dahiras />} />
        <Route path="membres" element={<Membres />} />
        <Route path="evenements" element={<Evenements />} />
        <Route path="savoir" element={<Savoir />} />
        <Route path="silsila" element={<Silsila />} />
        <Route path="reseau" element={<Reseau />} />
        <Route path="finances" element={<Finances />} />
        <Route path="localisation" element={<Localisation />} />
        <Route path="messages" element={<Messages />} />
        <Route path="securite" element={<Securite />} />
        <Route path="profil" element={<Profil />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
