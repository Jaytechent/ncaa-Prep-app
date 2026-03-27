const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const withApiPrefix = (value: string) => {
  const clean = trimTrailingSlash(value);
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const getDefaultApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000/api';
  }

  const { hostname } = window.location;
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
  return isLocalHost ? 'http://localhost:5000/api' : '/api';
};

export const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();

  if (!envUrl) {
    return getDefaultApiBaseUrl();
  }

  if (envUrl.startsWith('/')) {
    return withApiPrefix(envUrl);
  }

  return withApiPrefix(envUrl);
})();
