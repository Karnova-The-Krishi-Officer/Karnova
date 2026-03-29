import { useAppStore } from '../store/useAppStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path, options = {}) {
  const token = useAppStore.getState().token;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}
