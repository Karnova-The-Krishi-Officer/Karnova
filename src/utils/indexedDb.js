const DB_NAME = 'karnova-offline-db';
const VERSION = 1;
const ACTIONS_STORE = 'actions';
const FORMS_STORE = 'forms';

const openDb = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ACTIONS_STORE)) {
        db.createObjectStore(ACTIONS_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(FORMS_STORE)) {
        db.createObjectStore(FORMS_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
  });

const runStoreOp = async (storeName, mode, callback) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    callback(store, resolve, reject);
    tx.onerror = () => reject(tx.error);
  });
};

export const offlineDb = {
  addAction: (action) => runStoreOp(ACTIONS_STORE, 'readwrite', (store, resolve) => resolve(store.add(action))),
  getActions: () =>
    runStoreOp(ACTIONS_STORE, 'readonly', (store, resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
    }),
  clearActions: () => runStoreOp(ACTIONS_STORE, 'readwrite', (store, resolve) => resolve(store.clear())),
  saveFormDraft: (draft) => runStoreOp(FORMS_STORE, 'readwrite', (store, resolve) => resolve(store.put(draft))),
};
