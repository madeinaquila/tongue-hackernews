/**
 * tests/NewsRepository.test.js
 * Integration tests for the Repository pattern.
 * Uses vi.mock to stub API calls — no real network requests.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewsRepository } from '../src/js/patterns/NewsRepository.js';

// ── Mock the API module ───────────────────────
vi.mock('../src/js/api/hackerNews.js', () => ({
  fetchNewStoryIds: vi.fn(),
  fetchStoryById:   vi.fn(),
}));

import { fetchNewStoryIds, fetchStoryById } from '../src/js/api/hackerNews.js';

// ── Fixtures ──────────────────────────────────
const MOCK_IDS = Array.from({ length: 25 }, (_, i) => 1000 + i);

function makeMockStory(id, i) {
  return {
    id,
    title: `Story ${id}`,
    url:   `https://example.com/story/${id}`,
    time:  1620000000 + i * 3600,
    score: 10 + i,
    by:    `user${i}`,
  };
}

// ── Tests ─────────────────────────────────────
describe('NewsRepository', () => {
  let repo;

  beforeEach(() => {
    vi.clearAllMocks();
    repo = new NewsRepository();

    fetchNewStoryIds.mockResolvedValue([...MOCK_IDS]);
    fetchStoryById.mockImplementation((id) => {
      const idx = MOCK_IDS.indexOf(id);
      return Promise.resolve(makeMockStory(id, idx));
    });
  });

  describe('init()', () => {
    it('calls fetchNewStoryIds once', async () => {
      await repo.init();
      expect(fetchNewStoryIds).toHaveBeenCalledTimes(1);
    });

    it('resets offset to 0', async () => {
      await repo.init();
      expect(repo.hasMore).toBe(true);
    });

    it('exposes total count', async () => {
      await repo.init();
      expect(repo.total).toBe(25);
    });
  });

  describe('loadNextPage()', () => {
    it('loads 10 stories by default', async () => {
      await repo.init();
      const stories = await repo.loadNextPage();
      expect(stories).toHaveLength(10);
    });

    it('loads a custom page size', async () => {
      await repo.init();
      const stories = await repo.loadNextPage(5);
      expect(stories).toHaveLength(5);
    });

    it('fetches correct IDs for first page', async () => {
      await repo.init();
      await repo.loadNextPage(3);
      expect(fetchStoryById).toHaveBeenCalledWith(1000);
      expect(fetchStoryById).toHaveBeenCalledWith(1001);
      expect(fetchStoryById).toHaveBeenCalledWith(1002);
    });

    it('fetches correct IDs for second page', async () => {
      await repo.init();
      await repo.loadNextPage(3);
      await repo.loadNextPage(3);
      expect(fetchStoryById).toHaveBeenCalledWith(1003);
      expect(fetchStoryById).toHaveBeenCalledWith(1004);
      expect(fetchStoryById).toHaveBeenCalledWith(1005);
    });

    it('returns formatted story objects', async () => {
      await repo.init();
      const [first] = await repo.loadNextPage(1);

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('title');
      expect(first).toHaveProperty('url');
      expect(first).toHaveProperty('domain');
      expect(first).toHaveProperty('score');
      expect(first).toHaveProperty('index', 1);
    });

    it('returns empty array when all IDs exhausted', async () => {
      await repo.init();
      await repo.loadNextPage(25); // consume all
      const stories = await repo.loadNextPage(10);
      expect(stories).toHaveLength(0);
    });

    it('filters out null stories (deleted/dead items)', async () => {
      fetchStoryById.mockImplementation((id) => {
        if (id === 1001) return Promise.resolve(null); // simulate dead story
        const idx = MOCK_IDS.indexOf(id);
        return Promise.resolve(makeMockStory(id, idx));
      });
      await repo.init();
      const stories = await repo.loadNextPage(3);
      expect(stories).toHaveLength(2);
    });
  });

  describe('hasMore', () => {
    it('is true before init', () => {
      // Before init, offset=0 and ids=[], so 0 < 0 is false
      expect(repo.hasMore).toBe(false);
    });

    it('is true after init with stories available', async () => {
      await repo.init();
      expect(repo.hasMore).toBe(true);
    });

    it('is false when all stories are consumed', async () => {
      await repo.init();
      await repo.loadNextPage(25);
      expect(repo.hasMore).toBe(false);
    });
  });
});
