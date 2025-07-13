/**
 * @returns {string}
 */
export function getTagFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('tag') || 'all';
}

/**
 * @param {string} tag
 * @returns {void}
 */
export function setTagInURL(tag) {
  const params = new URLSearchParams(window.location.search);
  if (tag === 'all') {
    params.delete('tag');
  } else {
    params.set('tag', tag);
  }
  history.replaceState(null, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
}

/**
 * @param {string} tag
 * @param {NodeListOf<HTMLButtonElement>} chips
 * @param {NodeListOf<HTMLElement>} cards
 * @returns {void}
 */
export function filterByTag(tag, chips, cards) {
  chips.forEach(c => c.classList.remove('selected'));
  chips.forEach(c => {
    if ((c.getAttribute('data-tag') || '') === tag) {
      c.classList.add('selected');
    }
  });
  cards.forEach(card => {
    if (tag === 'all') {
      card.style.display = '';
    } else {
      const tags = (card.getAttribute('data-tags') || '').split(',');
      card.style.display = tags.includes(tag) ? '' : 'none';
    }
  });
}

/**
 * @returns {void}
 */
export function initTagFilter() {
  const chips = document.querySelectorAll('.tag-chip');
  const cards = document.querySelectorAll('.card-grid .card');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-tag') || '';
      setTagInURL(tag);
      filterByTag(tag, chips, cards);
    });
  });
  // On page load, set filter from URL
  const initialTag = getTagFromURL();
  filterByTag(initialTag, chips, cards);
} 