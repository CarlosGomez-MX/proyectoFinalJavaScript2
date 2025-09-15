import * as model from './model.js';
import recipeView from './views/RecipeView.js';
import resultsView from './views/ResultsView.js';
import bookmarksView from './views/bookmarksView.js';
import searchView from './views/SearchView.js';
import paginationView from './views/PaginationView.js';

const controlSearchResults = async function () {
  const query = searchView.getQuery();
  if (!query) {
    resultsView.renderMessage('Escribe un término de búsqueda');
    paginationView.render({ results: [], page: 1, resultsPerPage: model.state.search.resultsPerPage });
    return;
  }
  resultsView.renderSpinner();
  await model.loadSearchResults(query);
  resultsView.render(model.getSearchResultsPage());
  paginationView.render(model.state.search);
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlRecipes = async function () {
  const id = window.location.hash.slice(1);
  if (!id) return;
  recipeView.renderSpinner();
  resultsView.update(model.getSearchResultsPage(model.state.search.page));
  await model.loadRecipe(id);
  recipeView.render(model.state.recipe);
  bookmarksView.update(model.state.bookmarks);
};

const init = function () {
  bookmarksView.addHandlerRender?.(() => {
    bookmarksView.render?.(model.state.bookmarks);
  });
  recipeView.addHandlerRender?.(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.renderMessage('Empieza buscando una receta o un ingrediente. ¡Diviértete!');
};
init();
