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
    const href = use.getAttribute('href');         // p.ej. "src/img/icons.svg#icon-search"
    const id = href.split('#')[1];                 // p.ej. "icon-search"
    use.setAttribute('href', `${SPRITE_URL}#${id}`); // => "dist/icons.xxxxx.svg#icon-search"
  });
}

// Ejecuta el parche al cargar
fixStaticSvgUses();
// === FIN PARCHE ÍCONOS ===


// Controlador principal para cargar/renderizar una receta
async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // spinner en el panel de la receta
    recipeView.renderSpinner();

    // cargar datos en el modelo
    await model.loadRecipe(id);

    // renderizar desde la vista
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// Escuchar hashchange y load
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
