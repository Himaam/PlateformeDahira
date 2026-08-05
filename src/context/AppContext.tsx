import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import {
  currentUserId,
  users,
  notifications as initialNotifications,
} from '../data/mock';
import type { LocationShare, Notification, User } from '../data/types';

interface AppContextValue {
  currentUser: User;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  locationShare: LocationShare;
  setLocationShare: (s: LocationShare) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  activeDahiraId: string;
  setActiveDahiraId: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [locationShare, setLocationShare] = useState<LocationShare>({
    active: false,
    visibility: 'personne',
    durationMinutes: 60,
  });
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeDahiraId, setActiveDahiraId] = useState('d1');

  const currentUser = users.find((u) => u.id === currentUserId)!;

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.userId === currentUserId && !n.lu).length,
    [notifications],
  );

  const value: AppContextValue = {
    currentUser,
    isAuthenticated,
    login: () => setIsAuthenticated(true),
    logout: () => setIsAuthenticated(false),
    locationShare,
    setLocationShare,
    notifications: notifications.filter((n) => n.userId === currentUserId),
    markNotificationRead: (id) =>
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lu: true } : n)),
      ),
    markAllNotificationsRead: () =>
      setNotifications((prev) =>
        prev.map((n) =>
          n.userId === currentUserId ? { ...n, lu: true } : n,
        ),
      ),
    unreadCount,
    activeDahiraId,
    setActiveDahiraId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
