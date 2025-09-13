// src/js/controller.js

// Import del sprite con URL generada por Parcel (cumple pasos 21–22)
import iconsImport from '../img/icons.svg?url';

// Normaliza a string (por si el import viene como objeto/URL)
function asUrlString(mod) {
  if (!mod) return '';
  if (typeof mod === 'string') return mod;
  if (typeof mod.default === 'string') return mod.default;
  if (typeof mod.href === 'string') return mod.href;
  try { return new URL('../img/icons.svg', import.meta.url).href; } catch { return ''; }
}
const icons = asUrlString(iconsImport);
window.__icons = icons; // debug opcional

const recipeContainer = document.querySelector('.recipe');

// --- FIX Netlify: sprite inline + reescritura de <use> ---

async function injectSpriteInline() {
  try {
    if (document.getElementById('__sprite_inline__')) return;
    const resp = await fetch(icons, { cache: 'no-store' });
    if (!resp.ok) throw new Error('No se pudo cargar icons.svg');
    const text = await resp.text();

    const holder = document.createElement('div');
    holder.id = '__sprite_inline__';
    holder.style.position = 'absolute';
    holder.style.width = '0';
    holder.style.height = '0';
    holder.style.overflow = 'hidden';
    holder.style.visibility = 'hidden';
    holder.setAttribute('aria-hidden', 'true');
    holder.innerHTML = text.trim().startsWith('<svg')
      ? text
      : `<svg xmlns="http://www.w3.org/2000/svg">${text}</svg>`;
    document.body.insertAdjacentElement('afterbegin', holder);
  } catch (e) {
    console.error('[icons] injectSpriteInline error:', e);
  }
}

function rewriteUsesToFragments(root = document) {
  root.querySelectorAll('use').forEach(u => {
    const raw = u.getAttribute('href') || u.getAttribute('xlink:href') || '';
    if (!raw) return;
    const frag = raw.includes('#') ? raw.slice(raw.indexOf('#')) : '';
    if (!frag) return;
    u.setAttribute('href', frag);
    u.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', frag);
  });
}

// --- UI helpers ---

function renderSpinner(parentEl) {
  const ref = `${icons}#icon-loader`;
  const markup = `
    <div class="spinner">
      <svg><use href="${ref}" xlink:href="${ref}"></use></svg>
    </div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
}

function patchStaticIconUses() {
  document.querySelectorAll('use').forEach(u => {
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
    if (data.status !== 'success' || !data.data?.recipe)
      throw new Error(data.message || 'Recipe not found');

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
  const refClock = `${icons}#icon-clock`;
  const refUsers = `${icons}#icon-users`;
  const refCheck = `${icons}#icon-check`;
  const refArrow = `${icons}#icon-arrow-right`;

  const markup = `
    <figure class="recipe__fig">
      <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
      <h1 class="recipe__title"><span>${recipe.title}</span></h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${refClock}" xlink:href="${refClock}"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookTime}</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${refUsers}" xlink:href="${refUsers}"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text">servings</span>
      </div>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${recipe.ingredients.map(ing => `
          <li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${refCheck}" xlink:href="${refCheck}"></use>
            </svg>
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
        <svg class="search__icon">
          <use href="${refArrow}" xlink:href="${refArrow}"></use>
        </svg>
      </a>
    </div>
  `;

  recipeContainer.innerHTML = '';
  recipeContainer.insertAdjacentHTML('afterbegin', markup);

  // Asegura que los <use> recién insertados apunten al sprite inline (#icon-…)
  rewriteUsesToFragments(recipeContainer);
}

// --- Init ---
async function init() {
  // a) Ajusta <use> del HTML estático a la URL del sprite empaquetado
  patchStaticIconUses();

  // b) Inyecta el sprite inline y reescribe TODOS los <use> a #icon-…
  await injectSpriteInline();
  rewriteUsesToFragments(document);

  // c) Pinta la receta
  showRecipe();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
