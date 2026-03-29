const baseURL = import.meta.env.VITE_API_BASE_URL;

const buildUrl = (path) => `${baseURL}${path}`;

const request = async (method, path, body, config = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(config.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(data?.detail || 'Request failed');
    error.response = { data, status: response.status };
    throw error;
  }

  return { data, status: response.status };
};

const api = {
  get: (path, config) => request('GET', path, null, config),
  post: (path, body, config) => request('POST', path, body, config),
  patch: (path, body, config) => request('PATCH', path, body, config),
  delete: (path, config) => request('DELETE', path, null, config),
};

export default api;
