// src/js/controller.js

// 21) Import del sprite con URL procesada por Parcel (forzamos modo URL con ?url)
import importedIcons from '../img/icons.svg?url';

// Si por algún motivo el import no devuelve string (raro),
// caemos a new URL(...) como fallback.
const icons = typeof importedIcons === 'string'
  ? importedIcons
  : new URL('../img/icons.svg', import.meta.url).href;

// Exponer para depuración en consola
window.__icons = icons;

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

function renderSpinner(parentEl) {
  const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
}

// Parchea los <use> del HTML estático (header, etc.) para que usen la URL hasheada de Parcel
function patchStaticIconUses() {
  const uses = document.querySelectorAll('use');
  uses.forEach(u => {
    const raw = u.getAttribute('href') || u.getAttribute('xlink:href') || '';
    if (!raw || !raw.includes('src/img/icons.svg')) return;
    const frag = raw.split('#')[1];
    if (!frag) return;
    const finalRef = `${icons}#${frag}`;
    u.setAttribute('href', finalRef);
    u.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', finalRef);
  });
}

async function showRecipe() {
  try {
    renderSpinner(recipeContainer);

    const resp = await fetch(
      'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
    );
    const data = await resp.json();

    if (data.status !== 'success' || !data.data?.recipe) {
      throw new Error(data.message || 'Recipe not found');
    }

    const r = data.data.recipe;

    const recipe = {
      id: r.id,
      title: r.title,
      publisher: r.publisher,
      sourceUrl: r.source_url,
      image: r.image_url,
      servings: r.servings,
      cookTime: r.cooking_time,
      ingredients: r.ingredients,
    };

    renderRecipe(recipe);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function renderRecipe(recipe) {
  const markup = `
    <figure class="recipe__fig">
      <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${recipe.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookTime}</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text">servings</span>
      </div>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${recipe.ingredients
          .map(ing => {
            return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${ing.quantity ?? ''}</div>
                <div class="recipe__description">
                  <span class="recipe__unit">${ing.unit ?? ''}</span>
                  ${ing.description}
                </div>
              </li>
            `;
          })
          .join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
        directions at their website.
      </p>
      <a class="btn--small recipe__btn" href="${recipe.sourceUrl}" target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
  `;

  recipeContainer.innerHTML = '';
  recipeContainer.insertAdjacentHTML('afterbegin', markup);
}

// Inicialización: primero parchea íconos del HTML, luego carga receta
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    patchStaticIconUses();
    showRecipe();
  });
} else {
  patchStaticIconUses();
  showRecipe();
}
