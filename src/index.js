import { Notify } from 'notiflix';
import SimpleLightBox from 'simplelightbox';
import { Page } from './js/page';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search'),
  searchButton: document.querySelector('.search__button'),
  query: document.querySelector('.search__query'),
  gallery: document.querySelector('.gallery__list'),
  moreBtn: document.querySelector('.load-more'),
};
const simple = new SimpleLightBox('.gallery__list .card__link', {
  captionDelay: 500,
});
const page = new Page();

refs.searchForm.addEventListener('submit', searchHandler);
refs.moreBtn.addEventListener('click', loadMoreHandler);

hideLoadMoreButton();

async function searchHandler(evt) {
  evt.preventDefault();

  const form = evt.currentTarget;
  const query = form.elements.searchQuery.value.trim();

  if (!query.length) {
    form.reset();
    Notify.warning('Search field is empty!');

    return;
  }

  clearGallery();
  try {
    setSearchButtonDisabled(true);
    const data = await page.search(query);

    searchResponse(data);
  } catch (error) {
    Notify.failure(error.message);
  } finally {
    setSearchButtonDisabled(false);
  }

  form.reset();
}

async function loadMoreHandler() {
  try {
    setLoadModeDisabled(true);
    const data = await page.loadMore();

    searchResponse(data);
  } catch (error) {
    Notify.failure(error.message);
  } finally {
    setLoadModeDisabled(false);
  }
}

function clearGallery() {
  refs.gallery.innerHTML = '';
  simple.refresh();
  hideLoadMoreButton();
}

function addCardsToGallery(list) {
  const markup = list.map(createCard).join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  simple.refresh();
}

function createCard(card) {
  const {
    largeImageURL,
    webformatURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = card;

  return `
    <article class="card">
      <a class="card__link"
        href="${largeImageURL}">
        <div class="card__thumb">
          <img class="card__image" src="${webformatURL}" alt="${tags}"
            title="${tags}" loading="lazy">
        </div>
        <ul class="card__info">
          <li class="card__info-item">
            <p class="card__info-header">Likes</p>
            <p class="card__info-value">${likes}</p>
          </li>
          <li class="card__info-item">
            <p class="card__info-header">Views</p>
            <p class="card__info-value">${views}</p>
          </li>
          <li class="card__info-item">
            <p class="card__info-header">Comments</p>
            <p class="card__info-value">${comments}</p>
          </li>
          <li class="card__info-item">
            <p class="card__info-header">Downloads</p>
            <p class="card__info-value">${downloads}</p>
          </li>
        </ul>
      </a>
    </article>
  `;
}

function scrollToDown() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function showLoadMoreButton() {
  refs.moreBtn.classList.remove('hidden');
}

function hideLoadMoreButton() {
  refs.moreBtn.classList.add('hidden');
}

function searchResponse({ page, per_page, hits, totalHits }) {
  if (!hits.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    return;
  }

  addCardsToGallery(hits);
  checkLoadMoreButton({ page, per_page, totalHits });

  if (page === 1) {
    Notify.info(`Hooray! We found ${totalHits} images.`);
  } else {
    scrollToDown();
  }
}

function checkLoadMoreButton({ page, per_page, totalHits }) {
  if (page * per_page >= totalHits) {
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    hideLoadMoreButton();
  } else {
    showLoadMoreButton();
  }
}

function setLoadModeDisabled(value) {
  refs.moreBtn.disabled = value;
}

function setSearchButtonDisabled(value) {
  refs.searchButton.disabled = value;
}
