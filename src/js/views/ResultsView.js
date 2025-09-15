import View from './View.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No se encontraron recetas para tu búsqueda.';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(
        r => `
        <li class="preview">
          <a class="preview__link" href="#${r.id}">
            <figure class="preview__fig">
              <img src="${r.image}" alt="${r.title}" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${r.title}</h4>
              <p class="preview__publisher">${r.publisher}</p>
            </div>
          </a>
        </li>`
      )
      .join('');
  }
}
export default new ResultsView();
