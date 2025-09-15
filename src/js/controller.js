// src/js/controller.js
import * as model from './model.js';
import recipeView from './views/RecipeView.js';
import searchView from './views/SearchView.js';
import resultsView from './views/ResultsView.js';

// === PARCHE PARA ÍCONOS EN index.html (se mantiene) ===
const SPRITE_URL = new URL('../img/icons.svg', import.meta.url).href;
function fixStaticSvgUses() {
  const uses = document.querySelectorAll('svg use[href^="src/img/icons.svg#"]');
  uses.forEach(use => {
    const href = use.getAttribute('href');
    const id = href.split('#')[1];
    use.setAttribute('href', `${SPRITE_URL}#${id}`);
  });
}
fixStaticSvgUses();
// === FIN PARCHE ÍCONOS ===

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}

// Avance 3: controlador de búsqueda
async function controlSearchResults() {
  try {
    // 1) tomar query desde la vista
    const query = searchView.getQuery();
    if (!query) return;

    // 2) spinner en la zona de resultados
    resultsView.renderSpinner();

    // 3) cargar resultados
    await model.loadSearchResults(query);

    // 4) renderizar resultados
    resultsView.render(model.state.search.results);
  } catch (err) {
    // mostrar error en la zona de resultados
    resultsView.renderError('Search failed. Please try again.');
  }
}

// Init: pub/sub
function init() {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
}
init();
