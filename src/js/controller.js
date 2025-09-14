// src/js/controller.js
import * as model from './model.js';
import recipeView from './views/RecipeView.js';

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
