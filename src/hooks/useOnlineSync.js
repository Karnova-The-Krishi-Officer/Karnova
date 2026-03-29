import { useEffect } from 'react';
import { offlineDb } from '../utils/indexedDb';
import { appStore, useAppStore } from '../store/appStore';
import { queryService } from '../services/api';

export const useOnlineSync = () => {
  const user = useAppStore((s) => s.user);

  useEffect(() => {
    const updateConnection = () => appStore.setState({ isOnline: navigator.onLine });

    const syncOfflineActions = async () => {
      if (!navigator.onLine || !user?.token) {
        return;
      }

      try {
        const actions = await offlineDb.getActions();
        for (const action of actions) {
          if (action.type === 'query.create') {
            await queryService.create(user.token, action.payload);
          }
        }
        if (actions.length) {
          await offlineDb.clearActions();
          appStore.addToast({ type: 'success', message: 'Offline actions synced successfully.' });
        }
      } catch (error) {
        appStore.addToast({ type: 'error', message: `Sync failed: ${error.message}` });
      }
    };

    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);
    window.addEventListener('online', syncOfflineActions);

    syncOfflineActions();

    return () => {
      window.removeEventListener('online', updateConnection);
      window.removeEventListener('offline', updateConnection);
      window.removeEventListener('online', syncOfflineActions);
    };
  }, [user]);
};
