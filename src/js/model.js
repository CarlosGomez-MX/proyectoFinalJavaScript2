import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: { query: '', results: [], page: 1, resultsPerPage: RES_PER_PAGE },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
  state.recipe = createRecipeObject(data);
  state.recipe.bookmarked = state.bookmarks.some(b => b.id === id);
};

export const loadSearchResults = async function (query) {
  state.search.query = query;
  const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
  state.search.results = data.data.recipes.map(r => ({
    id: r.id,
    title: r.title,
    publisher: r.publisher,
    image: r.image_url,
    ...(r.key && { key: r.key }),
  }));
  state.search.page = 1;
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};
