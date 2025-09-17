const fallbackBaseUrl = 'https://localhost:7055/api';
const envBaseUrl = (process.env.REACT_APP_API_BASE_URL ?? fallbackBaseUrl).trim();
const API_BASE_URL = (envBaseUrl || fallbackBaseUrl).replace(/\/+$/, '');

let API_ORIGIN = API_BASE_URL;
try {
  const url = new URL(API_BASE_URL);
  API_ORIGIN = url.origin;
} catch (error) {
  const match = API_BASE_URL.match(/^(https?:\/\/[^/]+)/i);
  if (match) {
    API_ORIGIN = match[1];
  }
}

const normalizePath = (path = '') => {
  if (!path) {
    return '';
  }
  return path.startsWith('/') ? path : '/' + path;
};

export { API_BASE_URL, API_ORIGIN };

export const buildApiUrl = (path = '') => {
  const normalizedPath = normalizePath(path);
  return normalizedPath ? API_BASE_URL + normalizedPath : API_BASE_URL;
};

export const buildAssetUrl = (path = '') => {
  if (!path) {
    return '';
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = normalizePath(path);
  return API_ORIGIN ? API_ORIGIN + normalizedPath : normalizedPath;
};
