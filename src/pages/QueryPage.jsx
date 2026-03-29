import { useCallback, useState } from 'react';
import { apiFetch } from '../services/api';
import { put } from '../services/idb';
import { queueAction } from '../services/syncEngine';

const QueryPage = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const submit = useCallback(async () => {
    const payload = { text: query, type: 'text' };
    if (!navigator.onLine) {
      const item = { id: crypto.randomUUID(), ...payload, status: 'queued' };
      await put('queries', item);
      await queueAction({ type: 'ai_query', payload });
      setResponse('Offline: query queued and will sync automatically.');
      return;
    }
    const data = await apiFetch('/ai/query', { method: 'POST', body: JSON.stringify(payload) });
    setResponse(data.answer);
  }, [query]);

  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-xl font-semibold">AI Krishi Query</h2>
      <textarea className="w-full min-h-32 rounded-xl border p-3 bg-transparent" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask your crop, weather, or market question" />
      <button className="rounded-xl bg-brand-500 px-4 py-2 text-white" onClick={submit}>Submit Query</button>
      {response && <p className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3">{response}</p>}
    </div>
  );
};

export default QueryPage;
