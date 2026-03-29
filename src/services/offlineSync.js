import api from './api';
import { getOfflineActions, removeOfflineAction } from './idb';

export const syncQueuedQueries = async () => {
  const actions = await getOfflineActions();
  if (!actions.length || !navigator.onLine) {
    return;
  }

  await api.post('/sync', {
    actions: actions.map((action) => ({
      id: action.id,
      type: action.type,
      payload: action.payload,
      createdAt: action.createdAt,
    })),
  });

  await Promise.all(actions.map((action) => removeOfflineAction(action.id)));
};

export const initOfflineSync = () => {
  window.addEventListener('online', syncQueuedQueries);
};
