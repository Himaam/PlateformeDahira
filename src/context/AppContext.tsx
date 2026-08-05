import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import {
  currentUserId as initialCurrentUserId,
  users,
  notifications as initialNotifications,
  userLocationShares as initialUserLocationShares,
} from '../data/mock';
import type {
  LocationShare,
  Notification,
  User,
  UserLocationShare,
} from '../data/types';

interface AppContextValue {
  currentUser: User;
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  locationShare: LocationShare;
  setLocationShare: (s: LocationShare) => void;
  userLocationShares: UserLocationShare[];
  updateUserLocationShare: (share: Partial<UserLocationShare> & { userId: string }) => void;
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
  const [currentUserId, setCurrentUserId] = useState(initialCurrentUserId);
  const [locationShare, setLocationShare] = useState<LocationShare>({
    active: false,
    visibility: 'personne',
    durationMinutes: 60,
  });
  const [userLocationShares, setUserLocationShares] = useState<UserLocationShare[]>(
    initialUserLocationShares,
  );
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeDahiraId, setActiveDahiraId] = useState('d1');

  const currentUser = users.find((u) => u.id === currentUserId)!;

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.userId === currentUserId && !n.lu).length,
    [notifications],
  );

  const updateUserLocationShare = (
    share: Partial<UserLocationShare> & { userId: string },
  ) => {
    setUserLocationShares((prev) => {
      const existing = prev.find((item) => item.userId === share.userId);
      if (existing) {
        return prev.map((item) =>
          item.userId === share.userId
            ? {
                ...item,
                ...share,
                updatedAt: share.updatedAt ?? new Date().toISOString(),
              }
            : item,
        );
      }
      return [
        ...prev,
        {
          ...share,
          active: share.active ?? true,
          visibility: share.visibility ?? 'public_limite',
          lat: share.lat ?? 0,
          lng: share.lng ?? 0,
          updatedAt: share.updatedAt ?? new Date().toISOString(),
        },
      ];
    });
  };

  const value: AppContextValue = {
    currentUser,
    isAuthenticated,
    login: (userId: string) => {
      setCurrentUserId(userId);
      setIsAuthenticated(true);
    },
    logout: () => setIsAuthenticated(false),
    locationShare,
    setLocationShare,
    userLocationShares,
    updateUserLocationShare,
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
