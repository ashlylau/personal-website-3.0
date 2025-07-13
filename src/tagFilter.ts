export function getTagFromURL(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('tag') || 'all';
}

export function setTagInURL(tag: string): void {
  const params = new URLSearchParams(window.location.search);
  if (tag === 'all') {
    params.delete('tag');
  } else {
    params.set('tag', tag);
  }
  history.replaceState(null, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
}

export function filterByTag(tag: string, chips: NodeListOf<HTMLButtonElement>, cards: NodeListOf<HTMLElement>): void {
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

export function initTagFilter(): void {
  const chips = document.querySelectorAll<HTMLButtonElement>('.tag-chip');
  const cards = document.querySelectorAll<HTMLElement>('.card-grid .card');
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