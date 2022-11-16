import SimpleLightBox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchQuery } from './js/fetchSearch';

const refs = {
  searchForm: document.querySelector('.search'),
  query: document.querySelector('.search__query'),
  gallery: document.querySelector('.gallery__list'),
};

const simple = new SimpleLightBox(refs.gallery);

refs.searchForm.addEventListener('submit', searchHandler);

function searchHandler(evt) {
  evt.preventDefault();
  const { query } = evt.currentTarget.elements;

  fetchQuery(query.value).then(data => {
    console.log(data);
    refs.gallery.innerHTML = data.hits
      .map(item => {
        return createCard(item);
      })
      .join('');
  });

  evt.currentTarget.reset();
}

function createCard(card) {
  const { largeImageURL, previewURL, tags, likes, views, comments, downloads } =
    card;

  return `
    <article class="card">
      <a class="card__link"
        href="${largeImageURL}">
        <div class="card__thumb">
          <img class="card__image" src="${previewURL}" alt="${tags}"
            title="${tags}" width="300">
        </div>
        <ul class="card__info">
          <li class="card__info-item">
            <h2 class="card__info-header">Likes</h2>
            <p class="card__info-value">${likes}</p>
          </li>
          <li class="card__info-item">
            <h2 class="card__info-header">Views</h2>
            <p class="card__info-value">${views}</p>
          </li>
          <li class="card__info-item">
            <h2 class="card__info-header">Comments</h2>
            <p class="card__info-value">${comments}</p>
          </li>
          <li class="card__info-item">
            <h2 class="card__info-header">Downloads</h2>
            <p class="card__info-value">${downloads}</p>
          </li>
        </ul>
      </a>
    </article>
  `;
}
