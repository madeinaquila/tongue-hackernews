/**
 * components/NewsCard.js
 * Builds the news card entirely with createElement — no innerHTML with external data,
 * no manual escapeHtml needed (DOM properties handle escaping automatically).
 */

/**
 * @param {import('../utils/formatters').FormattedStory} story
 * @param {number} animationDelay
 * @param {boolean} isFav
 * @param {Function} onFavToggle
 * @returns {HTMLAnchorElement}
 */
export function createNewsCard(story, animationDelay = 0, isFav = false, onFavToggle) {
  // ── Card wrapper (anchor) ──────────────────
  const card = document.createElement('a');
  card.className = 'news-card';
  card.href = isSafeUrl(story.url) ? story.url : '#';
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.dataset.id = story.id;
  card.dataset.title = story.title.toLowerCase();
  card.style.animationDelay = `${animationDelay}ms`;

  // ── Index ──────────────────────────────────
  const index = document.createElement('span');
  index.className = 'news-card__index';
  index.textContent = story.index;

  // ── Favicon ───────────────────────────────
  let faviconEl;
  if (story.domain) {
    faviconEl = document.createElement('img');
    faviconEl.className = 'news-card__favicon';
    faviconEl.alt = '';
    faviconEl.src = `https://www.google.com/s2/favicons?domain=${story.domain}&sz=32`;
    faviconEl.addEventListener('error', () => {
      faviconEl.style.display = 'none';
    });
  } else {
    faviconEl = document.createElement('span');
    faviconEl.className = 'news-card__favicon-placeholder';
    faviconEl.textContent = '📄';
  }

  // ── Title ──────────────────────────────────
  const title = document.createElement('h2');
  title.className = 'news-card__title';
  title.textContent = story.title;

  // ── Title row ─────────────────────────────
  const titleRow = document.createElement('div');
  titleRow.className = 'news-card__title-row';
  titleRow.appendChild(faviconEl);
  titleRow.appendChild(title);

  // ── Meta ──────────────────────────────────
  const meta = document.createElement('div');
  meta.className = 'news-card__meta';

  if (story.domain) {
    const domain = document.createElement('span');
    domain.className = 'news-card__domain';
    domain.textContent = story.domain;
    meta.appendChild(domain);
  }

  const date = document.createElement('span');
  date.className = 'news-card__date';
  date.textContent = story.timeAgo;
  meta.appendChild(date);

  if (story.score > 0) {
    const score = document.createElement('span');
    score.className = 'news-card__score';

    const arrow = document.createElement('span');
    arrow.className = 'news-card__score-arrow';
    arrow.textContent = '▲';

    score.appendChild(arrow);
    score.appendChild(document.createTextNode(story.score));
    meta.appendChild(score);
  }

  // ── Body ──────────────────────────────────
  const body = document.createElement('div');
  body.className = 'news-card__body';
  body.appendChild(titleRow);
  body.appendChild(meta);

  // ── Fav button ────────────────────────────
  const favBtn = document.createElement('button');
  favBtn.className = `fav-btn${isFav ? ' active' : ''}`;
  favBtn.title = 'Preferiti';
  favBtn.textContent = isFav ? '⭐' : '☆';

  favBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nowFav = favBtn.classList.toggle('active');
    favBtn.textContent = nowFav ? '⭐' : '☆';
    onFavToggle && onFavToggle(story, nowFav);
  });

  const actions = document.createElement('div');
  actions.className = 'news-card__actions';
  actions.appendChild(favBtn);

  // ── Assemble card ─────────────────────────
  card.appendChild(index);
  card.appendChild(body);
  card.appendChild(actions);

  return card;
}

/**
 * Validates that a URL uses http or https protocol.
 * @param {string} url
 * @returns {boolean}
 */
function isSafeUrl(url) {
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}