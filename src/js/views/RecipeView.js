// src/js/views/RecipeView.js
import View from './View.js';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'No pudimos cargar la receta. Intenta con otra.';
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  _generateMarkup() {
    if (!this._data || !this._data.id) {
      return `<div class="message">Selecciona una receta de la lista…</div>`;
    }
    return `
      <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
        <h1 class="recipe__title"><span>${this._data.title}</span></h1>
      </figure>
      <div class="recipe__details">
        <div class="recipe__info">
          <span>⏱ ${this._data.cookingTime} min</span>
          <span>👥 ${this._data.servings} porciones</span>
        </div>
        <div class="recipe__publisher">${this._data.publisher ?? ''}</div>
      </div>
      <div class="recipe__ingredients">
        <h2>Ingredientes</h2>
        <ul class="recipe__ingredient-list">
          ${(this._data.ingredients ?? [])
            .map(ing => `<li>${ing.quantity ?? ''} ${ing.unit ?? ''} ${ing.description ?? ''}</li>`)
            .join('')}
        </ul>
      </div>
      <div class="recipe__directions">
        <a class="btn--small recipe__btn" href="${this._data.sourceUrl}" target="_blank" rel="noreferrer">Ver fuente</a>
      </div>
    `;
  }
}

export default new RecipeView();
