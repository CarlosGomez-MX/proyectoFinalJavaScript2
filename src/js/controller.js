// src/js/controller.js

// 1) Cargamos la URL real del sprite generado por Parcel (para fetchearlo e inyectarlo)
const iconsUrl = new URL('../img/icons.svg', import.meta.url).href;

const recipeContainer = document.querySelector('.recipe');

// Inyecta el contenido del sprite SVG en el DOM (display:none) para poder referenciar con #icon-...
async function injectSprite() {
  const resp = await fetch(iconsUrl);
  if (!resp.ok) throw new Error('No se pudo cargar icons.svg');
  const text = await resp.text();
  const holder = document.createElement('div');
  holder.style.display = 'none';
  holder.setAttribute('aria-hidden', 'true');
  holder.innerHTML = text;
  document.body.insertBefore(holder, document.body.firstChild);
}

// Reescribe los <use> estáticos del HTML que apuntan a src/img/icons.svg#... -> #icon-...
function patchStaticIconUsesToFragment() {
  const uses = document.querySelectorAll('use');
  uses.forEach(u => {
    const href = u.getAttribute('href') || u.getAttribute('xlink:href') || '';
    if (!href) return;
    // si viene como "src/img/icons.svg#icon-xxx", extraemos el fragmento
    const frag = href.includes('#') ? href.split('#')[1] : '';
    if (!frag) return;
    const finalRef = `#${frag}`;
    u.setAttribute('href', finalRef);
    u.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', finalRef);
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
        ${recipe.ingredients
          .map(ing => {
            return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon"><use href="#icon-check"></use></svg>
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
        <svg class="search__icon"><use href="#icon-arrow-right"></use></svg>
      </a>
    </div>
  `;

  recipeContainer.innerHTML = '';
  recipeContainer.insertAdjacentHTML('afterbegin', markup);
}

// init: inyecta sprite, corrige <use> estáticos y carga receta
async function init() {
  await injectSprite();
  patchStaticIconUsesToFragment();
  showRecipe();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
