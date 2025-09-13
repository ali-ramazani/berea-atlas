// Ensure URLs have protocol for <a href>
export function withHttp(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

// Normalize optional fields across API variants
export function pick(obj, ...keys) {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return null;
}
