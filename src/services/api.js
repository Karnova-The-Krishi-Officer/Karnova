import { API_BASE_URL } from '../utils/constants';

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(typeof payload === 'string' ? payload : payload?.detail || 'Request failed');
  }

  return payload;
};

export const apiRequest = async ({ path, method = 'GET', body, token }) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseResponse(response);
};

export const authService = {
  login: (payload) => apiRequest({ path: '/auth/login', method: 'POST', body: payload }),
};

export const queryService = {
  list: (token) => apiRequest({ path: '/queries', token }),
  create: (token, payload) => apiRequest({ path: '/queries', method: 'POST', token, body: payload }),
};
