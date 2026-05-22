/**
 * main.js — Magazine Premium v4
 */

import { NewsRepository }      from './patterns/NewsRepository.js';
import { createNewsCard }       from './components/NewsCard.js';
import { createSkeletonCards }  from './components/SkeletonCard.js';
import { getFavorites, isFavorite, toggleFavorite } from './utils/favorites.js';
import { getTopSource, formatTime } from './utils/stats.js';

const PAGE_SIZE = 10;

// ── DOM refs ──────────────────────────────────
const container    = document.getElementById('news-container');
const loadingState = document.getElementById('loading-state');
const errorState   = document.getElementById('error-state');
const retryBtn     = document.getElementById('retry-btn');
const loadMoreBtn  = document.getElementById('load-more-btn');
const btnText      = loadMoreBtn.querySelector('.btn__text');
const btnLoader    = loadMoreBtn.querySelector('.btn__loader');
const searchInput  = document.getElementById('search-input');
const searchCount  = document.getElementById('search-count');
const noResults    = document.getElementById('no-results');
const noResultsTerm= document.getElementById('no-results-term');
const scrollTopBtn = document.getElementById('scroll-top');
const themeToggle  = document.getElementById('theme-toggle');
const themeIcon    = themeToggle.querySelector('.theme-toggle__icon');
const favToggleBtn = document.getElementById('fav-toggle-btn');
const favPanel     = document.getElementById('fav-panel');
const favOverlay   = document.getElementById('fav-overlay');
const favClose     = document.getElementById('fav-close');
const favList      = document.getElementById('fav-list');
const favCount     = document.getElementById('fav-count');
const statLoaded   = document.getElementById('stat-loaded');
const statTopSource= document.getElementById('stat-top-source');
const statTime     = document.getElementById('stat-time');
const headerDate   = document.getElementById('header-date');

// ── State ─────────────────────────────────────
const repo = new NewsRepository();
let allStories = [];
let isLoading  = false;

// ── Date ──────────────────────────────────────
function setHeaderDate() {
  const now = new Date();
  headerDate.textContent = now.toLocaleDateString('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

// ── Theme ─────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('tongue_theme') || 'light';
  document.documentElement.dataset.theme = saved;
  themeIcon.textContent = saved === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('tongue_theme', next);
  themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ── Scroll to top ─────────────────────────────
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Search ────────────────────────────────────
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  filterCards(q);
});

function filterCards(q) {
  const cards = container.querySelectorAll('.news-card');
  let visible = 0;
  cards.forEach(card => {
    const title = card.dataset.title || '';
    const domain = (card.querySelector('.news-card__domain')?.textContent || '').toLowerCase();
    const match = !q || title.includes(q) || domain.includes(q);
    card.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  loadMoreBtn.classList.toggle('hidden', !!q || !repo.hasMore);
  if (q) {
    searchCount.textContent = `${visible} risultati`;
    searchCount.classList.remove('hidden');
  } else {
    searchCount.classList.add('hidden');
  }
  noResults.classList.toggle('hidden', visible > 0 || !q);
  noResultsTerm.textContent = q;
}

// ── Stats ─────────────────────────────────────
function updateStats() {
  statLoaded.textContent    = allStories.length;
  statTopSource.textContent = getTopSource(allStories);
  statTime.textContent      = formatTime();
}

// ── Favorites ─────────────────────────────────
function updateFavPanel() {
  const favs = getFavorites();
  favCount.textContent = favs.length;
  favCount.classList.toggle('hidden', favs.length === 0);
  if (favs.length === 0) {
    favList.innerHTML = '<div class="fav-panel__empty">Nessun preferito ancora.<br>Clicca ⭐ su una news!</div>';
    return;
  }
  favList.innerHTML = '';
  favs.forEach(f => {
    const a = document.createElement('a');
    a.className = 'fav-item';
    a.href = f.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.textContent = f.title;
    favList.appendChild(a);
  });
}

const openFavPanel  = () => { updateFavPanel(); favPanel.classList.add('open'); favOverlay.classList.add('open'); };
const closeFavPanel = () => { favPanel.classList.remove('open'); favOverlay.classList.remove('open'); };

favToggleBtn.addEventListener('click', openFavPanel);
favClose.addEventListener('click', closeFavPanel);
favOverlay.addEventListener('click', closeFavPanel);

// ── UI helpers ────────────────────────────────
const showLoading = () => loadingState.classList.remove('hidden');
const hideLoading = () => loadingState.classList.add('hidden');
const showError   = () => errorState.classList.remove('hidden');
const hideError   = () => errorState.classList.add('hidden');

function setLoadMoreLoading(on) {
  btnText.classList.toggle('hidden', on);
  btnLoader.classList.toggle('hidden', !on);
  loadMoreBtn.disabled = on;
}

function showSkeletons() { container.appendChild(createSkeletonCards(PAGE_SIZE)); }
function removeSkeletons() { container.querySelectorAll('.skeleton-card').forEach(el => el.remove()); }

function appendStories(stories) {
  stories.forEach((story, i) => {
    const fav  = isFavorite(story.id);
    const card = createNewsCard(story, i * 60, fav, (s, nowFav) => {
      toggleFavorite(s);
      updateFavPanel();
      const favs = getFavorites();
      favCount.textContent = favs.length;
      favCount.classList.toggle('hidden', favs.length === 0);
    });
    container.appendChild(card);
  });
  allStories.push(...stories);
  updateStats();
  const q = searchInput.value.trim().toLowerCase();
  if (q) filterCards(q);
}

function updateLoadMoreVisibility() {
  const searching = !!searchInput.value.trim();
  loadMoreBtn.classList.toggle('hidden', !repo.hasMore || searching);
}

// ── Core logic ────────────────────────────────
async function init() {
  showLoading(); showSkeletons(); hideError();
  try {
    await repo.init();
    const stories = await repo.loadNextPage(PAGE_SIZE);
    removeSkeletons();
    appendStories(stories);
    updateLoadMoreVisibility();
  } catch (err) {
    console.error('[Tongue] Init error:', err);
    removeSkeletons(); showError();
  } finally {
    hideLoading();
  }
}

async function loadMore() {
  if (isLoading || !repo.hasMore) return;
  isLoading = true; setLoadMoreLoading(true);
  try {
    const stories = await repo.loadNextPage(PAGE_SIZE);
    appendStories(stories);
    updateLoadMoreVisibility();
  } catch (err) {
    console.error('[Tongue] Load more error:', err);
  } finally {
    isLoading = false; setLoadMoreLoading(false);
  }
}

// ── Events ────────────────────────────────────
loadMoreBtn.addEventListener('click', loadMore);
retryBtn.addEventListener('click', () => { hideError(); init(); });

// ── Bootstrap ─────────────────────────────────
initTheme();
setHeaderDate();
updateFavPanel();
init();