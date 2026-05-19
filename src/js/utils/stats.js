/**
 * utils/stats.js
 * Computes stats from loaded stories.
 */

export function getTopSource(stories) {
  const counts = {};
  stories.forEach(s => {
    if (s.domain) counts[s.domain] = (counts[s.domain] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? '—';
}

export function formatTime(date = new Date()) {
  return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}
