/**
 * components/SkeletonCard.js — Loading placeholder
 */
export function createSkeletonCards(count = 10) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'skeleton-card';
    el.style.animationDelay = `${i * 80}ms`;
    el.innerHTML = `
      <div class="skeleton-num"></div>
      <div>
        <div class="skeleton-title ${i % 3 === 0 ? 'short' : ''}"></div>
        <div class="skeleton-meta">
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
        </div>
      </div>
    `;
    frag.appendChild(el);
  }
  return frag;
}
