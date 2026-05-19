/**
 * patterns/NewsRepository.js
 *
 * Design Pattern: REPOSITORY
 * ─────────────────────────────────────────────────────────────
 * The Repository pattern abstracts the data layer behind a
 * clean interface. UI components never call API endpoints
 * directly; they depend only on this repository.
 *
 * Benefits:
 *  - Easy to mock in unit tests (swap real fetch with stubs)
 *  - Data transformations live in one place
 *  - API endpoint URLs are not scattered across the codebase
 * ─────────────────────────────────────────────────────────────
 */

import { fetchNewStoryIds, fetchStoryById } from '../api/hackerNews.js';
import { formatStory } from '../utils/formatters.js';

export class NewsRepository {
  /** @type {number[]} */
  #ids = [];
  #offset = 0;

  /**
   * Load the master list of story IDs from HN.
   * Must be called once before calling loadNextPage().
   */
  async init() {
    this.#ids = await fetchNewStoryIds();
    this.#offset = 0;
  }

  /**
   * Fetch the next batch of stories.
   * @param {number} pageSize – how many stories to load
   * @returns {Promise<FormattedStory[]>}
   */
  async loadNextPage(pageSize = 10) {
    const slice = this.#ids.slice(this.#offset, this.#offset + pageSize);
    if (slice.length === 0) return [];

    const raw = await Promise.all(slice.map((id) => fetchStoryById(id)));

    // Filter out nulls (deleted/dead stories) and format
    const stories = raw
      .filter(Boolean)
      .map((story, i) => formatStory(story, this.#offset + i + 1));

    this.#offset += pageSize;
    return stories;
  }

  /** Returns true when all IDs have been consumed. */
  get hasMore() {
    return this.#offset < this.#ids.length;
  }

  /** Total stories available. */
  get total() {
    return this.#ids.length;
  }
}
