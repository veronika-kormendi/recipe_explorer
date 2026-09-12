// calculating ingredient frequency for word cloud
// across all recipes

const fs = require("fs");

//create ingredient frequnecy per cuisine word cloud
//------------ ingredient frequency bulider for word cloud: e.g. ingredient, occurance
//1. normalize ingredients to make ingredient counting easier, have consistent ingredient data
function normalizeIngredient(ingredient) {
  ingredient = ingredient.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //remove accented chars and replaace it with the non accented equivalent e.g. è -> e
  let lower = ingredient.toLowerCase(); //make chars lowercase
  let lettersOnly = lower.replace(/[^a-z\s]/g, ""); //remove special chars
  let trimmed = lettersOnly.trim(); //remove withespace

  return trimmed;
}
//2. normalize all recipes, function takes a json file, and iterates through the recipes, then normalizeIngredient() is called
function normalizeIngredientsInRecipe(recipe) {
  let cleanedIngredients = [];

  for (let i = 0; i < recipe.ingredients.length; i++) {
    let originalIngredient = recipe.ingredients[i];

    let cleaned = normalizeIngredient(originalIngredient);
    console.log("BEFORE cleaning:", cleaned);

    cleaned = get_ingredients_only(cleaned);
    console.log("AFTER cleaning:", cleaned);

    if (cleaned && cleaned.trim() !== "") {
      cleanedIngredients.push(cleaned);
    }
  }

  return cleanedIngredients;
}

//3. convert frequency object → CSV string
function frequencyToCSV(freq) {
  let csv = "ingredient,frequency\n"; // butter, 7
  for (let ingredient in freq) {
    csv += `${ingredient},${freq[ingredient]}\n`;
  }

  return csv;
}
//4. load json, process recipe, save csv
function processRecipeFile(jsonPath, output_csv_name) {
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const recipes = JSON.parse(raw);
  let frequency = {};
      for (let r = 0; r < recipes.length; r++) { //loop through all recipes
        let recipe = recipes[r];
        let cleanedIngredients = normalizeIngredientsInRecipe(recipe); //normalize ingredients in this recipe
        let uniqueIngredients = new Set(cleanedIngredients);//count each ingredient once per recipe
        uniqueIngredients.forEach(ingredient => { //update frequency table
          console.log("COUNTING:", ingredient);
          if (frequency[ingredient] === undefined) {
            frequency[ingredient] = 1;
          } else {
            frequency[ingredient] = frequency[ingredient] + 1;
          }
        });
      }
    const csv = frequencyToCSV(frequency)
//   fs.writeFileSync("ingredient_frequency.csv", csv);
      fs.writeFileSync(output_csv_name, csv);

  console.log("CSV saved as /cuisine_ingredients/.csv");
}


function get_ingredients_only(ingredient){ //gets the ingredient column
  // preserve vegetable pepper phrases before word filtering
  ingredient = ingredient.replace(/bell pepper/g, "bellpepper");
    //units of measurement
     const units = [
    "cup", "cups", "tablespoon", "tablespoons", "tbsp",
    "teaspoon", "teaspoons", "tsp",
    "pound", "pounds", "lb", "lbs",
    "ounce", "ounces", "oz",
    "gram", "grams", "g", "block",
    "kilogram", "kilograms", "kg",
    "ml", "l", "liter", "liters", "inch", "slices",
    "cube", "wheel", "pinch of", "slice", 
    "small", "can", "large", "bulb", 
    "pinch", "cloves", "cubes", "shanks", "shank"
  ];
  // list of other descriptors
  const descriptors_and_other = [
    "sliced", "chopped", "minced", "crushed", "diced",
    "thinly", "thickly", "fresh", "whole", "divided", "of",
    "halved", "boiled", "blanched", "grated", "ground", "cut", 
    "cubed", "melted", "dried", "for", "topping", "frying", 
    "juiced", "wedge", "peel", "filling", "allpurpose", "yellow", 
    "burgundy", "into", "white", "to", "taste", "salt", "and", 
    "red", "green", "yellow", "pepper", "chuck cube", "chuck",
     "beef cube", "confit", "leg", "shin", "belly",
    "warm", "fillet", "water", "meat", "crepes", "wooden", "skewers"
  ];
  let words = ingredient.split(" ");
  words = words.filter(w => !units.includes(w) && !descriptors_and_other.includes(w)); //remove them
  words = words.map(w => { 
    if (w === "bellpepper") return "bell pepper";
    if (w === "olives") return "olive";
    //remove 's' e.g. tomatoes become tomato
     if (w.endsWith("oes")) {return w.slice(0, -2);}
   if (w.endsWith("ves")) {return w.slice(0, -3) + "f";}
    // make words singular
    if (w.endsWith("ies")) {
  return w.slice(0, -3) + "y"; // cherries → cherry
}
    if (w.endsWith("s") && w.length > 3) {return w.slice(0, -1);}
   return w;
  });
  words = words.filter(w => w.trim() !== ""); //remove empty strings
  return words.join(" ").trim(); //return the ingredient
}

// processRecipeFile("recipes.json", "ingredient_freq.csv"); //process all ingredients
//get cuisine specific ingredient frequencies


// processRecipeFile("hun.json", "hun_ingredients.csv") 
// processRecipeFile("greek.json", "greek_ingredients.csv") 
// processRecipeFile("french.json", "french_ingredients.csv")
processRecipeFile("recipes.json", "ingredient_freq.csv")
// processRecipeFile("italian.json", "italian_ingredients.csv")
