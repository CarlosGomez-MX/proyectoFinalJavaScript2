// src/js/views/RecipeView.js
import icons from 'url:../../img/icons.svg';

class RecipeView {
  // Elemento padre donde se renderiza la receta
  #parentElement = document.querySelector('.recipe');

  // Data interna de la vista
  #data;

  // Mensajes por defecto
  #errorMessage = 'No encontramos esa receta. ¡Prueba con otra por favor!';
  #message = '';

  // Limpia el contenedor
  #clear() {
    this.#parentElement.innerHTML = '';
  }

  // Renderiza spinner de carga
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Renderiza mensaje de error en la UI
  renderError(message = this.#errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Renderiza mensaje genérico (éxito / informativo)
  renderMessage(message = this.#message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Render principal
  render(data) {
    if (!data) return;
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Markup de la receta
  #generateMarkup() {
    return `
      <figure class="recipe__fig">
        <img src="${this.#data.image}" alt="${this.#data.title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this.#data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${this.#data.cookingTime}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${this.#data.servings}</span>
          <span class="recipe__info-text">servings</span>
        </div>

        <button class="btn--round">
          <svg class="">
            <use href="${icons}#icon-bookmark"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this.#data.ingredients
            .map(ing => {
              return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${ing.quantity ? ing.quantity : ''}</div>
                <div class="recipe__description">
                  <span class="recipe__unit">${ing.unit ? ing.unit : ''}</span>
                  ${ing.description}
                </div>
              </li>`;
            })
            .join('')}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${this.#data.publisher}</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this.#data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }
}

export default new RecipeView();
