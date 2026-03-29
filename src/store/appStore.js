import { useSyncExternalStore } from 'react';
import { USER_ROLES } from '../utils/constants';

const THEME_KEY = 'karnova-theme';
const SESSION_KEY = 'karnova-session';

const initialState = {
  theme: localStorage.getItem(THEME_KEY) || 'light',
  user: JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'),
  role: USER_ROLES.FARMER,
  activeTab: 'dashboard',
  notifications: [],
  isOnline: navigator.onLine,
};

let state = { ...initialState };
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());

export const appStore = {
  getState: () => state,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setState: (partial) => {
    state = { ...state, ...(typeof partial === 'function' ? partial(state) : partial) };
    emit();
  },
  addToast: (toast) => {
    const id = Date.now();
    appStore.setState((prev) => ({ notifications: [...prev.notifications, { id, ...toast }] }));
    setTimeout(() => {
      appStore.setState((prev) => ({ notifications: prev.notifications.filter((item) => item.id !== id) }));
    }, 3000);
  },
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    appStore.setState({ theme });
  },
  login: (user) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    appStore.setState({ user, role: user.role || USER_ROLES.FARMER, activeTab: 'dashboard' });
  },
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    appStore.setState({ user: null, role: USER_ROLES.FARMER, activeTab: 'dashboard' });
  },
};

export const useAppStore = (selector = (snapshot) => snapshot) =>
  useSyncExternalStore(appStore.subscribe, () => selector(appStore.getState()));
