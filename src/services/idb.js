const DB_NAME = 'karnova-platform';
const DB_VERSION = 1;
const STORES = ['offlineQueue'];

let dbPromise;

const initDb =
  () =>
    new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        STORES.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

const getDb = async () => {
  if (!dbPromise) {
    dbPromise = initDb();
  }

  return dbPromise;
};

export const addOfflineAction = async (payload) => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('offlineQueue', 'readwrite');
    transaction.objectStore('offlineQueue').put(payload);
    transaction.oncomplete = () => resolve(payload);
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getOfflineActions = async () => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('offlineQueue', 'readonly');
    const request = transaction.objectStore('offlineQueue').getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

export const removeOfflineAction = async (id) => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('offlineQueue', 'readwrite');
    transaction.objectStore('offlineQueue').delete(id);
    transaction.oncomplete = () => resolve(id);
    transaction.onerror = () => reject(transaction.error);
  });
};
