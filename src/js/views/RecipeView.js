import View from './View.js';

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}
function toFractionString(value) {
  if (!value && value !== 0) return '';
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const whole = Math.floor(abs);
  const frac = abs - whole;
  if (frac < 1e-10) return `${sign}${whole || (whole === 0 ? 0 : '')}`.trim();
  const denom = 16;
  const num = Math.round(frac * denom);
  const g = gcd(num, denom);
  const n = num / g, d = denom / g;
  if (whole === 0) return `${sign}${n}/${d}`;
  return `${sign}${whole} ${n}/${d}`;
}

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'No pudimos cargar la receta. Intenta con otra.';
  _message = 'Empieza buscando una receta o un ingrediente. ¡Diviértete!';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  _generateMarkup() {
    if (!this._data || !this._data.id) return '';
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
            .map(ing => `
              <li class="recipe__ingredient">
                <span class="recipe__quantity">${ing.quantity != null ? toFractionString(ing.quantity) : ''}</span>
                <span class="recipe__unit">${ing.unit ?? ''}</span>
                <span class="recipe__description">${ing.description ?? ''}</span>
              </li>
            `)
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
