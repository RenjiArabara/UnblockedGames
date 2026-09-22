/**
 * Normalizes an iframe input which could be:
 * 1) A full iframe tag: `<iframe src="https://..." ...></iframe>`
 * 2) A direct URL: `https://...` or `/games/...`
 */
export function getIframeSrc(iframeHtmlOrUrl) {
  if (!iframeHtmlOrUrl) return '';
  let raw = iframeHtmlOrUrl.trim();
  if (raw.startsWith('<iframe')) {
    const match = raw.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      raw = match[1];
    }
  }
  
  // If the path starts with /games/ or similar local public assets, resolve with BASE_URL
  if (raw.startsWith('/')) {
    const baseUrl = import.meta.env.BASE_URL || './';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBase}${raw}`;
  }

  return raw;
}

export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}
