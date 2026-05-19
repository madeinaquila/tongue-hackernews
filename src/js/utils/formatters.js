/**
 * utils/formatters.js
 * Pure utility functions for transforming and formatting data.
 * Fully testable with no side effects.
 */

/**
 * Extract the domain from a URL string.
 * Returns null for falsy/invalid URLs.
 *
 * @param {string|null|undefined} url
 * @returns {string|null}
 *
 * @example
 * extractDomain('https://github.com/some/repo') // → 'github.com'
 */
export function extractDomain(url) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Convert a Unix timestamp (seconds) to a human-readable Italian date string.
 *
 * @param {number} unixTime – seconds since epoch
 * @returns {string}
 *
 * @example
 * formatDate(1620000000) // → 'gen 2021' or similar
 */
export function formatDate(unixTime) {
  if (!unixTime) return '';
  const date = new Date(unixTime * 1000);
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Relative time string ("2 ore fa", "3 giorni fa", …).
 *
 * @param {number} unixTime – seconds since epoch
 * @returns {string}
 */
export function timeAgo(unixTime) {
  if (!unixTime) return '';
  const seconds = Math.floor(Date.now() / 1000) - unixTime;
  const MINUTE = 60, HOUR = 3600, DAY = 86400;

  if (seconds < MINUTE)  return 'adesso';
  if (seconds < HOUR)    return `${Math.floor(seconds / MINUTE)} min fa`;
  if (seconds < DAY)     return `${Math.floor(seconds / HOUR)} ore fa`;
  if (seconds < DAY * 7) return `${Math.floor(seconds / DAY)} giorni fa`;
  return formatDate(unixTime);
}

/**
 * Transform a raw HN API story object into a clean, typed shape.
 *
 * @param {Object} raw   – raw API response
 * @param {number} index – 1-based display index
 * @returns {FormattedStory}
 *
 * @typedef {Object} FormattedStory
 * @property {number}      id
 * @property {number}      index
 * @property {string}      title
 * @property {string|null} url
 * @property {string|null} domain
 * @property {string}      dateFormatted
 * @property {string}      timeAgo
 * @property {number}      score
 * @property {string}      author
 */
export function formatStory(raw, index) {
  return {
    id:            raw.id,
    index,
    title:         raw.title ?? 'Senza titolo',
    url:           raw.url ?? `https://news.ycombinator.com/item?id=${raw.id}`,
    domain:        extractDomain(raw.url),
    dateFormatted: formatDate(raw.time),
    timeAgo:       timeAgo(raw.time),
    score:         raw.score ?? 0,
    author:        raw.by ?? 'anonimo',
  };
}
