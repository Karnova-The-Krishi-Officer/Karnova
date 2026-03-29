import { apiFetch } from './api';
import { getAll, put, remove } from './idb';
import { useAppStore } from '../store/useAppStore';

export const queueAction = async (action) => {
  await put('offlineQueue', { ...action, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
};

export const syncOfflineQueue = async () => {
  const actions = await getAll('offlineQueue');
  if (!actions.length || !navigator.onLine) return;
  const payload = { actions };
  const result = await apiFetch('/sync', { method: 'POST', body: JSON.stringify(payload) });
  if (result?.processed) {
    await Promise.all(actions.map((item) => remove('offlineQueue', item.id)));
  }
};

export const initSyncEngine = () => {
  useAppStore.getState().hydrateTheme();
  const update = () => {
    useAppStore.getState().setOnline(navigator.onLine);
    if (navigator.onLine) syncOfflineQueue();
  };
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
};
