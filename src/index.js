import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { SimpleLightbox } from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('[name="searchQuery"]'),
  galleryDivEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let searchQuery = '';
let page = 1;

async function fetchImg(searchQuery) {
  const URL = 'https://pixabay.com/api/';
  const API = '37004510-2ea806ed51befec1ac31d4b99';
  const response = await fetch(
    `${URL}?key=${API}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json();
}

refs.loadMoreBtn.style.display = 'none';
refs.formEl.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtn);

function handleSubmit(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.elements.searchQuery.value;
  refs.galleryDivEl.innerHTML = '';
  refs.loadMoreBtn.style.display = 'none';
  page = 1;

  fetchImg(searchQuery)
    .then(data => {
      renderMarkupCard(data);
      refs.loadMoreBtn.style.display = 'block';
      Notify.success(`Ura, mi nashli ${data.totalHits} kartinok`);
      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(error => console.log(error));
}

function renderMarkupCard(data) {
  const addImg = data.hits
    .map(img => {
      return `<div class="photo-card">
  <a href="${img.largeImageURL}"><img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" width='300' height='200' /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> - ${img.likes}
    </p>
    <p class="info-item">
      <b>Views</b> - ${img.views}
    </p>
    <p class="info-item">
      <b>Comments</b> - ${img.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> - ${img.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  refs.galleryDivEl.insertAdjacentHTML('beforeend', addImg);
}

function handleLoadMoreBtn() {
  fetchImg(searchQuery).then(data => {
    page += 1;
    renderMarkupCard(data);
    if (data.totalHits <= page * 40) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      refs.btnLoadMore.style.display = 'none';
    }
  });
}

var lightbox = new SimpleLightbox('.gallery a', {});
