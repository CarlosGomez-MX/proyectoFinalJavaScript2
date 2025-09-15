import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    if (!this._parentElement) return;
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    if (!markup) return;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    if (!this._data || !this._data.results) return '';
    const curPage = this._data.page ?? 1;
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    if (numPages <= 1) return '';
    if (curPage === 1) return this._btnNext(curPage);
    if (curPage === numPages) return this._btnPrev(curPage);
    return this._btnPrev(curPage) + this._btnNext(curPage);
  }

  _btnPrev(curPage) {
    return `
      <button class="btn--inline pagination__btn--prev" data-goto="${curPage - 1}" aria-label="Ir a la página ${curPage - 1}">
        <svg class="search__icon" viewBox="0 0 24 24" aria-hidden="true"><use href="${icons}#icon-arrow-left"></use></svg>
        <span>Página ${curPage - 1}</span>
      </button>
    `;
  }

  _btnNext(curPage) {
    return `
      <button class="btn--inline pagination__btn--next" data-goto="${curPage + 1}" aria-label="Ir a la página ${curPage + 1}">
        <span>Página ${curPage + 1}</span>
        <svg class="search__icon" viewBox="0 0 24 24" aria-hidden="true"><use href="${icons}#icon-arrow-right"></use></svg>
      </button>
    `;
  }
}
export default new PaginationView();
