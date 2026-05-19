/**
 * api/hackerNews.js
 * Raw API calls to Hacker News Firebase endpoints.
 * Separated from business logic for testability.
 */

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

/**
 * Fetch the list of new story IDs (~500 items).
 * @returns {Promise<number[]>}
 */
export async function fetchNewStoryIds() {
  const res = await fetch(`${BASE_URL}/newstories.json`);
  if (!res.ok) throw new Error(`Failed to fetch story IDs: ${res.status}`);
  return res.json();
}

/**
 * Fetch the detail of a single story by ID.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function fetchStoryById(id) {
  const res = await fetch(`${BASE_URL}/item/${id}.json`);
  if (!res.ok) throw new Error(`Failed to fetch story ${id}: ${res.status}`);
  return res.json();
}
