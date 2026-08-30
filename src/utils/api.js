export function getApiUrl(path) {
  const base = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
