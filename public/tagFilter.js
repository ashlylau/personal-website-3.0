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
  console.log('filterByTag called with:', tag);
  
  // Update chip selection
  chips.forEach(c => c.classList.remove('selected'));
  chips.forEach(c => {
    if ((c.getAttribute('data-tag') || '') === tag) {
      c.classList.add('selected');
    }
  });
  
  // Update card tag underlines
  const allCardTags = document.querySelectorAll('.card-tags a');
  allCardTags.forEach(cardTag => {
    const cardTagText = cardTag.textContent || '';
    cardTag.classList.remove('selected');
    if (tag !== 'all' && cardTagText === tag) {
      cardTag.classList.add('selected');
    }
  });
  
  // Update card visibility
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
  console.log('initTagFilter called');
  const chips = document.querySelectorAll('.tag-chip');
  const cards = document.querySelectorAll('.card-grid .card');
  const cardTags = document.querySelectorAll('.card-tags a');
  
  console.log('Found elements:', {
    chips: chips.length,
    cards: cards.length,
    cardTags: cardTags.length
  });
  
  // Handle tag chip clicks
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      console.log('Chip clicked:', chip.getAttribute('data-tag'));
      const tag = chip.getAttribute('data-tag') || '';
      setTagInURL(tag);
      filterByTag(tag, chips, cards);
    });
  });
  
  // Handle card tag clicks
  cardTags.forEach(tagLink => {
    tagLink.addEventListener('click', (e) => {
      console.log('Card tag clicked:', tagLink.textContent);
      e.preventDefault(); // Prevent default link behavior
      const tag = tagLink.textContent || '';
      setTagInURL(tag);
      filterByTag(tag, chips, cards);
    });
  });
  
  // On page load, set filter from URL
  const initialTag = getTagFromURL();
  console.log('Initial tag from URL:', initialTag);
  filterByTag(initialTag, chips, cards);
} 