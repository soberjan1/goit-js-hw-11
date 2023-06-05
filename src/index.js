import { Notify } from 'notiflix/build/notiflix-notify-aio';

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

refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtn);
refs.formEl.addEventListener('submit', handleSubmit);

function handleSubmit(evt) {
  evt.preventDefault();
  refs.galleryDivEl.innerHTML = '';
  refs.btnLoadMore.style.display = 'none';
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

function handleLoadMoreBtn() {
  console.log('jopa');
}
