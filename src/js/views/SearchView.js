// src/js/views/SearchView.js
class SearchView {
  _parentEl = document.querySelector('.search'); // <form class="search">
  _input = this._parentEl?.querySelector('.search__field');

  getQuery() {
    const query = this._input?.value?.trim() ?? '';
    if (this._input) this._input.value = '';
    return query;
  }

  addHandlerSearch(handler) {
    if (!this._parentEl) return;
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
