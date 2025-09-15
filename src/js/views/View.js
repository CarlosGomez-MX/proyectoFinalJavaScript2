import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  _parentElement;
  _errorMessage = 'Ocurrió un error.';
  _message = 'Operación realizada correctamente.';

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      this.renderError();
      return;
    }
    this._data = data;
    const markup = this._generateMarkup ? this._generateMarkup() : '';
    this._clear();
    this._parentElement?.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this.render(data);
  }

  renderSpinner() {
    if (!this._parentElement) return;
    const markup = `<div class="spinner"><svg><use href="${icons}#icon-loader"></use></svg></div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    if (!this._parentElement) return;
    const markup = `<div class="error"><div><svg><use href="${icons}#icon-alert-triangle"></use></svg></div><p>${message}</p></div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    if (!this._parentElement) return;
    const markup = `<div class="message"><div><svg><use href="${icons}#icon-smile"></use></svg></div><p>${message}</p></div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    if (!this._parentElement) return;
    this._parentElement.innerHTML = '';
  }
}
