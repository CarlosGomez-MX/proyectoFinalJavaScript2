class SearchView {
  _parentEl = document.querySelector('.search');
  _input = this._parentEl?.querySelector('.search__field');

  getQuery() {
    const q = this._input?.value?.trim() ?? '';
    if (this._input) this._input.value = '';
    return q;
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
