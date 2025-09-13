// src/js/controller.js

// 1) Inyecta el sprite SVG en línea (sin fetch, en build-time)
import iconsSprite from 'bundle-text:../img/icons.svg';

const recipeContainer = document.querySelector('.recipe');

// Inserta el sprite en el DOM (oculto pero accesible para <use href="#icon-...">)
function injectSpriteInline() {
  const holder = document.createElement('div');
  // No uses display:none; algunos navegadores no resuelven refs en nodos display:none
  holder.style.position = 'absolute';
  holder.style.width = '0';
  holder.style.height = '0';
  holder.style.overflow = 'hidden';
  holder.style.visibility = 'hidden';
  holder.setAttribute('aria-hidden', 'true');
  holder.innerHTML = iconsSprite;
  document.body.insertBefore(holder, document.body.firstChild);
}

// Reescribe TODOS los <use> a solo fragmento (#icon-…)
function rewriteUsesToFragments(root = document) {
  const uses = root.querySelectorAll('use');
  uses.forEach(u => {
    const raw = u.getAttribute('href') || u.getAttribute('xlink:href') || '';
    if (!raw) return;
    const frag = raw.includes('#') ? raw.split('#')[1] : '';
    if (!frag) return;
    const ref = `#${frag}`;
    u.setAttribute('href', ref);
    u.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', ref);
  });
}

function renderSpinner(parentEl) {
  const markup = `
    <div class="spinner">
      <svg><use href="#icon-loader"></use></svg>
    </div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
  rewriteUsesToFragments(parentEl);
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
      <h1 class="recipe__title"><span>${recipe.title}</span></h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon"><use href="#icon-clock"></use></svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookTime}</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon"><use href="#icon-users"></use></svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text">servings</span>
      </div>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${recipe.ingredients.map(ing => `
          <li class="recipe__ingredient">
            <svg class="recipe__icon"><use href="#icon-check"></use></svg>
            <div class="recipe__quantity">${ing.quantity ?? ''}</div>
            <div class="recipe__description">
              <span class="recipe__unit">${ing.unit ?? ''}</span>
              ${ing.description}
            </div>
          </li>
        `).join('')}
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
        <svg class="search__icon"><use href="#icon-arrow-right"></use></svg>
      </a>
    </div>
  `;
  recipeContainer.innerHTML = '';
  recipeContainer.insertAdjacentHTML('afterbegin', markup);
  rewriteUsesToFragments(recipeContainer);
}

// Init
function init() {
  injectSpriteInline();                 // sprite inline disponible
  rewriteUsesToFragments(document);     // corrige <use> del HTML estático
  showRecipe();                         // carga receta
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
