import { create } from 'zustand';
import Cookies from 'js-cookie';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (data: { user: User; token: string; refreshToken?: string }) => void;
  logout: () => void;
  initialize: () => void;
  isInitialized: boolean;
}

const TOKEN_KEY = 'sae_cms_token';
// We should probably store refresh token in cookie too if we want it to persist across reloads
// But for now let's keep it in store, or we assume it's passed on init?
// Actually, for better security, refresh token should be HTTP only cookie, but we are doing simple JWT.
// Let's persist it in store (zustand persist) + cookies manually if needed.
// The code below uses cookies manual management for token/user but zustand for state.
// Let's rely on zustand persist for now or stick to the previous pattern?
// Previous pattern used manual Cookies.set. Let's stick to that but add refresh token cookie.

const REFRESH_TOKEN_KEY = 'sae_cms_refresh_token';
const USER_KEY = 'sae_cms_user';

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  isInitialized: false,

  setAuth: (data) => {
    Cookies.set(TOKEN_KEY, data.token, { expires: 7, sameSite: 'lax' });
    if (data.refreshToken) {
      Cookies.set(REFRESH_TOKEN_KEY, data.refreshToken, { expires: 7, sameSite: 'lax' });
    }
    Cookies.set(USER_KEY, JSON.stringify(data.user), { expires: 7, sameSite: 'lax' });
    set({ token: data.token, refreshToken: data.refreshToken || null, user: data.user, isInitialized: true });
  },
  
  logout: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USER_KEY);
    set({ token: null, refreshToken: null, user: null, isInitialized: true });
  },
  
  initialize: () => {
    const token = Cookies.get(TOKEN_KEY);
    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
    const userStr = Cookies.get(USER_KEY);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ token, refreshToken: refreshToken || null, user, isInitialized: true });
      } catch {
        Cookies.remove(TOKEN_KEY);
        Cookies.remove(REFRESH_TOKEN_KEY);
        Cookies.remove(USER_KEY);
        set({ token: null, refreshToken: null, user: null, isInitialized: true });
      }
    } else {
        set({ isInitialized: true });
    }
  },
}));
