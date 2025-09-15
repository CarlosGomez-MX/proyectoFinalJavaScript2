// src/js/controller.js
import * as model from './model.js';
import recipeView from './views/RecipeView.js';
import resultsView from './views/ResultsView.js';
import bookmarksView from './views/bookmarksView.js';
import searchView from './views/SearchView.js';
import paginationView from './views/PaginationView.js';

const controlSearchResults = async function () {
  try {
    // 1) Tomar query (si está vacío, NO spinner)
    const query = searchView.getQuery();
    if (!query) {
      // ← sin emoji al final
      resultsView.renderMessage('Escribe un término de búsqueda');
      paginationView.render({ results: [], page: 1, resultsPerPage: 10 });
      return;
    }

    // 2) Spinner y carga
    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    // 3) Página 1 y paginación
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError('Ups, no pudimos completar la búsqueda.');
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage(model.state.search.page));
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError('No pudimos cargar la receta. Intenta con otra.');
    console.error(err);
  }
};

const init = function () {
  bookmarksView.addHandlerRender?.(() => {
    bookmarksView.render?.(model.state.bookmarks);
  });
  recipeView.addHandlerRender?.(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  // ✅ Mensaje inicial EN EL PANEL DERECHO (con carita grande):
  // (si lo quieres en inglés, cambia el string)
  recipeView.renderMessage('Empieza buscando una receta o un ingrediente. ¡Diviértete!');
};
init();
