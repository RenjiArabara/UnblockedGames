/**
 * Normalizes an iframe input which could be:
 * 1) A full iframe tag: `<iframe src="https://..." ...></iframe>`
 * 2) A direct URL: `https://...` or `/games/...`
 */
export function getIframeSrc(iframeHtmlOrUrl) {
  if (!iframeHtmlOrUrl) return '';
  const trimmed = iframeHtmlOrUrl.trim();
  if (trimmed.startsWith('<iframe')) {
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
  }
  return trimmed;
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
