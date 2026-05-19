/**
 * tests/formatters.test.js
 * Unit tests for pure utility functions.
 * Run with: npx vitest
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { extractDomain, formatDate, timeAgo, formatStory } from '../src/js/utils/formatters.js';

// ── extractDomain ─────────────────────────────
describe('extractDomain', () => {
  it('extracts domain from a full URL', () => {
    expect(extractDomain('https://github.com/user/repo')).toBe('github.com');
  });

  it('removes www prefix', () => {
    expect(extractDomain('https://www.nytimes.com/article')).toBe('nytimes.com');
  });

  it('handles URL without path', () => {
    expect(extractDomain('https://example.com')).toBe('example.com');
  });

  it('returns null for null input', () => {
    expect(extractDomain(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(extractDomain(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractDomain('')).toBeNull();
  });

  it('returns null for invalid URL', () => {
    expect(extractDomain('not-a-url')).toBeNull();
  });
});

// ── formatDate ────────────────────────────────
describe('formatDate', () => {
  it('formats a known unix timestamp', () => {
    // 2021-05-03 00:00:00 UTC
    const result = formatDate(1620000000);
    expect(result).toMatch(/2021/);
  });

  it('returns empty string for 0', () => {
    expect(formatDate(0)).toBe('');
  });

  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('');
  });
});

// ── timeAgo ───────────────────────────────────
describe('timeAgo', () => {
  beforeEach(() => {
    // Fix "now" to a known value: 2024-01-01 12:00:00 UTC (unix = 1704110400)
    vi.spyOn(Date, 'now').mockReturnValue(1704110400 * 1000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns "adesso" for very recent time', () => {
    expect(timeAgo(1704110400 - 30)).toBe('adesso');
  });

  it('returns minutes for < 1 hour ago', () => {
    expect(timeAgo(1704110400 - 600)).toBe('10 min fa'); // 10 minutes ago
  });

  it('returns hours for < 1 day ago', () => {
    expect(timeAgo(1704110400 - 7200)).toBe('2 ore fa'); // 2 hours ago
  });

  it('returns days for < 7 days ago', () => {
    expect(timeAgo(1704110400 - 86400 * 3)).toBe('3 giorni fa');
  });

  it('returns formatted date for older times', () => {
    const result = timeAgo(1704110400 - 86400 * 30); // 30 days ago
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns empty string for null', () => {
    expect(timeAgo(null)).toBe('');
  });
});

// ── formatStory ───────────────────────────────
describe('formatStory', () => {
  const rawStory = {
    id: 12345,
    title: 'Test Story Title',
    url: 'https://example.com/test',
    time: 1620000000,
    score: 42,
    by: 'testuser',
  };

  it('maps id correctly', () => {
    const result = formatStory(rawStory, 1);
    expect(result.id).toBe(12345);
  });

  it('maps index correctly', () => {
    const result = formatStory(rawStory, 7);
    expect(result.index).toBe(7);
  });

  it('maps title correctly', () => {
    const result = formatStory(rawStory, 1);
    expect(result.title).toBe('Test Story Title');
  });

  it('extracts domain from url', () => {
    const result = formatStory(rawStory, 1);
    expect(result.domain).toBe('example.com');
  });

  it('maps score correctly', () => {
    const result = formatStory(rawStory, 1);
    expect(result.score).toBe(42);
  });

  it('maps author correctly', () => {
    const result = formatStory(rawStory, 1);
    expect(result.author).toBe('testuser');
  });

  it('uses fallback title when missing', () => {
    const result = formatStory({ ...rawStory, title: undefined }, 1);
    expect(result.title).toBe('Senza titolo');
  });

  it('uses HN item URL when url is missing', () => {
    const result = formatStory({ ...rawStory, url: undefined }, 1);
    expect(result.url).toContain('news.ycombinator.com');
    expect(result.url).toContain('12345');
  });

  it('sets domain to null when url is missing', () => {
    const result = formatStory({ ...rawStory, url: undefined }, 1);
    expect(result.domain).toBeNull();
  });

  it('defaults score to 0 when missing', () => {
    const result = formatStory({ ...rawStory, score: undefined }, 1);
    expect(result.score).toBe(0);
  });

  it('defaults author to "anonimo" when missing', () => {
    const result = formatStory({ ...rawStory, by: undefined }, 1);
    expect(result.author).toBe('anonimo');
  });
});
