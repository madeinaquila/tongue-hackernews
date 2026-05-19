/**
 * utils/favorites.js
 * Manages favorite stories in localStorage.
 */

const KEY = 'tongue_favorites';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().some(f => f.id === id);
}

export function toggleFavorite(story) {
  const favs = getFavorites();
  const idx = favs.findIndex(f => f.id === story.id);
  if (idx === -1) {
    favs.unshift({ id: story.id, title: story.title, url: story.url });
  } else {
    favs.splice(idx, 1);
  }
  localStorage.setItem(KEY, JSON.stringify(favs));
  return getFavorites();
}
