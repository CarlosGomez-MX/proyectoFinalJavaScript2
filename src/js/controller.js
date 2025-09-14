// src/js/controller.js
import * as model from './model.js';
import recipeView from './views/RecipeView.js';

// === PARCHE PARA ÍCONOS EN index.html ===
// Genera la URL real (hash/fingerprinted) del sprite para Parcel (dev y build)
const SPRITE_URL = new URL('../img/icons.svg', import.meta.url).href;

// Reescribe todos los <use href="src/img/icons.svg#..."> del HTML estático
function fixStaticSvgUses() {
  const uses = document.querySelectorAll('svg use[href^="src/img/icons.svg#"]');
  uses.forEach(use => {
    const href = use.getAttribute('href'); // p.ej. "src/img/icons.svg#icon-search"
    const id = href.split('#')[1];         // p.ej. "icon-search"
    use.setAttribute('href', `${SPRITE_URL}#${id}`);
  });
}
// Ejecuta el parche al cargar el bundle
fixStaticSvgUses();
// === FIN PARCHE ÍCONOS ===

// Controlador principal para cargar/renderizar una receta
async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 1) Mostrar spinner en el panel de receta
    recipeView.renderSpinner();

    // 2) Cargar datos (puede lanzar error: 400/404/timeout/etc.)
    await model.loadRecipe(id);

    // 3) Renderizar receta
    recipeView.render(model.state.recipe);
  } catch (err) {
    // Mensaje amigable en la UI (por defecto, en español)
    recipeView.renderError();
    // Log técnico para debugging
    console.error('controller.controlRecipes ->', err);
  }
}

// Suscribir controlador a los eventos del router básico (hashchange y load)
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
