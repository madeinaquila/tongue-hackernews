export function createNewsCard(story, animationDelay = 0, isFav = false, onFavToggle) {
  const card = document.createElement('a');
  card.className = 'news-card';
  card.href = story.url;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.dataset.id = story.id;
  card.dataset.title = story.title.toLowerCase();
  card.style.animationDelay = `${animationDelay}ms`;

  const favicon = story.domain
    ? `<img class="news-card__favicon" src="https://www.google.com/s2/favicons?domain=${story.domain}&sz=32" alt="" onerror="this.style.display='none'">`
    : '<span class="news-card__favicon-placeholder">📄</span>';

  card.innerHTML = `
    <span class="news-card__index">${story.index}</span>
    <div class="news-card__body">
      <div class="news-card__title-row">
        ${favicon}
        <h2 class="news-card__title">${escapeHtml(story.title)}</h2>
      </div>
      <div class="news-card__meta">
        ${story.domain ? `<span class="news-card__domain">${escapeHtml(story.domain)}</span>` : ''}
        <span class="news-card__date">${story.timeAgo}</span>
        ${story.score > 0 ? `<span class="news-card__score"><span class="news-card__score-arrow">▲</span>${story.score}</span>` : ''}
      </div>
    </div>
    <div class="news-card__actions">
      <button class="fav-btn ${isFav ? 'active' : ''}" title="Preferiti">
        ${isFav ? '⭐' : '☆'}
      </button>
    </div>
  `;

  const favBtn = card.querySelector('.fav-btn');
  favBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nowFav = favBtn.classList.toggle('active');
    favBtn.textContent = nowFav ? '⭐' : '☆';
    onFavToggle && onFavToggle(story, nowFav);
  });

  return card;
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
