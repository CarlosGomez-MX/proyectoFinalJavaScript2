// src/js/model.js
import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},

  // Avance 3: estado de búsqueda
  search: {
    query: '',
    results: [],
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    // Propagar para que el controller muestre el error en la UI
    throw err;
  }
};

// Avance 3: cargar resultados de búsqueda
export const loadSearchResults = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}`);

    // guardar query y resultados en el state
    state.search.query = query;
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (err) {
    // log breve y propagar
    console.log(`${err}\n`);
    throw err;
  }
};
