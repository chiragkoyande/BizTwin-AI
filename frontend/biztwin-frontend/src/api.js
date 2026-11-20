let activeBase = (
  localStorage.getItem('biztwin_api_url') ||
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000'
).replace(/\/$/, '');

const fallbackPorts = ['http://127.0.0.1:8000', 'http://127.0.0.1:8001', 'http://127.0.0.1:8080', 'http://localhost:8000'];

export function getApiBase() {
  return activeBase;
}

export function setApiBase(newUrl) {
  activeBase = newUrl.replace(/\/$/, '');
  try {
    localStorage.setItem('biztwin_api_url', activeBase);
  } catch {}
}

async function parseResponse(res) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { detail: text };
  }
  if (!res.ok) {
    const detail = data?.detail;
    const message = Array.isArray(detail)
      ? detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
      : detail || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

async function fetchWithFallback(path, options = {}) {
  // Try active base first
  try {
    const res = await fetch(`${activeBase}${path}`, options);
    return await parseResponse(res);
  } catch (err) {
    // If connection refused, try fallback candidate ports
    if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      for (const candidate of fallbackPorts) {
        if (candidate === activeBase) continue;
        try {
          const res = await fetch(`${candidate}${path}`, options);
          const data = await parseResponse(res);
          activeBase = candidate;
          setApiBase(candidate);
          return data;
        } catch {
          continue;
        }
      }
    }
    throw err;
  }
}

export const api = {
  get(path) {
    return fetchWithFallback(path);
  },
  post(path, body) {
    return fetchWithFallback(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },
  upload(path, file) {
    const form = new FormData();
    form.append('file', file);
    return fetchWithFallback(path, {
      method: 'POST',
      body: form,
    });
  },
};

export { activeBase as API_BASE };
