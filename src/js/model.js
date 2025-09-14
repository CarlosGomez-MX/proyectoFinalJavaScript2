// src/js/model.js

export const state = {
  recipe: {},
};

export async function loadRecipe(id) {
  try {
    const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
    const data = await res.json();

    if (!res.ok || data.status !== 'success' || !data.data?.recipe) {
      throw new Error(data.message || 'Recipe not found');
    }

    const r = data.data.recipe;

    // Normaliza la receta al formato que usa la vista
    state.recipe = {
      id: r.id,
      title: r.title,
      publisher: r.publisher,
      sourceUrl: r.source_url,
      image: r.image_url,
      servings: r.servings,
      cookTime: r.cooking_time,
      ingredients: r.ingredients,
    };

    // console.log('model.state.recipe:', state.recipe);
  } catch (err) {
    throw err;
  }
}
