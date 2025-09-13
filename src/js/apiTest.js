// src/js/apiTest.js
async function showRecipe() {
  try {
    const resp = await fetch(
      'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
    );

    const data = await resp.json();

    console.log('RESP:', resp);   // f)
    console.log('DATA:', data);   // g)

    const recipe = data.data.recipe;
    console.log('RECIPE original:', recipe); // j)

    // k) Desestructuramos la receta en un nuevo objeto
    const recipeFormatted = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    // l) Imprimimos en consola el nuevo objeto
    console.log('RECIPE formatted:', recipeFormatted);

  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// e) Invocamos la función
showRecipe();
