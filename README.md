# Recipe Explorer — Interactive Data Visualization with D3.js
(https://veronika-kormendi.github.io/recipe_explorer/)
Recipe Explorer is an interactive data visualization project created for a college **Interactive Data Visualization** module. The project explores how recipe data can be presented in a more interactive and analytical way using **D3.js**, JavaScript, HTML, and CSS.

Traditional recipe websites usually present recipes primarily as text, often supported by a photograph. Some websites offer limited interactive features such as unit conversion, shopping lists, favourites, but the recipe itself is typically viewed as an individual item. The idea behind Recipe Explorer was to take a different approach: instead of only displaying recipes, the project allows users to **explore relationships and patterns across a collection of recipes and cuisines**.

For example, users can:

- see which ingredients occur most frequently within a cuisine;
- search and browse recipes by cuisine;
- look for quicker recipes, such as meals that take 30 minutes or less;
- compare recipes by total cooking time and popularity;
- use interactive filters to narrow the dataset;
- select an ingredient from a word cloud to find recipes containing it.

The project currently contains recipes from **French, Greek, Hungarian, and Italian cuisines**.

## Features

### Recipe Search and Browsing

Recipes are listed alphabetically and can be searched using text contained in the:

- recipe title;
- ingredients;
- preparation method.

Selecting a recipe displays additional information including cuisine, total time, popularity, ingredients, and preparation steps.

### Cuisine Filtering

Cuisine buttons allow users to focus on one cuisine at a time. Selecting a cuisine updates the relevant recipe data and visualizations.

### Popularity vs. Cooking Time Scatter Plot

A D3 scatter plot allows recipes to be compared using two numerical attributes:

- **X-axis:** total cooking time in minutes;
- **Y-axis:** popularity score.

Each point represents a recipe and is labelled with its title. This makes it possible to visually identify recipes that are relatively quick to prepare while also having a higher popularity score.

### Interactive Sliders

Slider controls allow the user to narrow the recipe selection according to:

- maximum total cooking time;
- maximum popularity score.

This supports questions such as finding recipes that can be prepared within a particular amount of time.

### Ingredient Word Cloud

The project uses `d3.layout.cloud.js` to generate an ingredient word cloud.

Ingredient size is based on how frequently the ingredient occurs across recipes in the selected cuisine. This provides a quick visual indication of ingredients that are characteristic or commonly used within the dataset for that cuisine.

Ingredients in the word cloud are interactive. Selecting an ingredient filters the recipe list to recipes containing that ingredient.

## Dataset

The project uses a **synthetically generated recipe dataset**.

The recipe dataset was synthetically generated using generative AI. An initial prompt specified the required dataset structure and requested the output in **JSON format**, including recipe title, ingredients, preparation method, preparation time, cooking time, and total time, and included an example recipe to guide the output format. The prompts were then iteratively refined to add further attributes and improve consistency across the dataset.

Additional attributes used by the visualization include cuisine, popularity score, tags, and geographical coordinates.

The supplied cuisine datasets contain **60 recipes in total**:

| Cuisine | Recipes |
| --- | ---: |
| French | 15 |
| Greek | 15 |
| Hungarian | 15 |
| Italian | 15 |
| **Total** | **60** |

A recipe follows a structure similar to:

```json
{
  "title": "Recipe name",
  "cuisine": "Cuisine",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "method": ["step 1", "step 2"],
  "prep_time": 20,
  "cook_time": 40,
  "total_time": 60,
  "popularity": 7000,
  "tags": ["dinner"],
  "location": {
    "lat": 47.0,
    "lon": 19.0
  }
}
```

## Ingredient Frequency Data

The word cloud uses separate CSV files containing normalized ingredient frequencies.

Example:

```csv
ingredient,frequency
olive oil,26
onion,22
garlic,16
```

The `ingredient_freq.js` preprocessing script prepares this data from the recipe JSON files.

The script:

1. converts ingredient text to lowercase;
2. removes accents and selected special characters;
3. removes quantities, measurement units, and selected descriptive terms;
4. applies simple singularization rules;
5. counts each normalized ingredient once per recipe;
6. writes the resulting ingredient-frequency data to CSV.

The preprocessing script can be run using Node.js:

```bash
node ingredient_freq.js
```

## Technology Stack

- **D3.js v7** — scales, axes, SVG rendering, data binding, filtering, and CSV loading
- **d3-cloud / `d3.layout.cloud.js`** — word-cloud layout
- **JavaScript** — application logic and user interaction
- **HTML5** — page structure
- **CSS3** — layout and styling
- **JSON** — recipe datasets
- **CSV** — ingredient-frequency datasets
- **Node.js** — ingredient-frequency preprocessing

No frontend framework or build system is required.

## Project Structure

```text
recipe-explorer/
├── index.html
├── styles.css
├── script_3.js
├── d3.layout.cloud.js
├── ingredient_freq.js
│
├── recipes.json
├── french.json
├── greek.json
├── hun.json
├── italian.json
│
├── ingredient_freq.csv
├── french_ingredients.csv
├── greek_ingredients.csv
├── hun_ingredients.csv
└── italian_ingredients.csv
```

The browser application loads the combined `recipes.json` dataset, while the cuisine-specific JSON files are also retained as source datasets.

## Running the Project

[Can be viewed from GitHub Pages:] (https://veronika-kormendi.github.io/recipe_explorer/) or run it locally:


### Option 1 — Python HTTP Server

Python includes a lightweight built-in HTTP server.

Open **PowerShell** or **Command Prompt**, navigate to the project directory, and run:

cd "C:\path\to\your\project"
python -m http.server <port_number>

For example:

cd "C:\Users\YourName\Documents\recipe-explorer"
python -m http.server 8000

Then open:

```text
http://localhost:8000/
```

The main page (index.html) will load automatically.

### Option 2 — XAMPP / Apache

The project can also be served using the Apache web server included with **XAMPP**.

1. Place the project folder somewhere inside XAMPP's `htdocs` directory.
2. Open the **XAMPP Control Panel**.
3. Start **Apache**.
4. Open the project through `localhost` in the browser.

For example, if the project is stored at:

```text
C:\xampp\htdocs\recipe-explorer
```

open:

```text
http://localhost/recipe-explorer/
```

For a nested project directory such as:

```text
cd "C:\xampp\htdocs\folder1\folder2\your_project"
```

the corresponding URL is:

```text
http://localhost/folder1/folder2/your_project/
```

Both methods serve the files over HTTP, allowing the browser to load the JSON and CSV files correctly.

## How the Application Works

When the application loads, it:

1. loads the combined recipe dataset;
2. sorts the recipes alphabetically;
3. builds the cuisine navigation from the dataset;
4. renders the recipe list;
5. draws the cooking-time vs. popularity scatter plot;
6. generates the ingredient word cloud.

User interactions then update the relevant parts of the interface:

- typing in the search box filters the recipe list;
- selecting a cuisine updates the recipe list and visualizations;
- selecting a recipe displays its details;
- changing the sliders filters recipes by cooking time and popularity;
- selecting an ingredient from the word cloud filters recipes by that ingredient.

---

Created as a college project for the **Interactive Data Visualization** module, exploring how interactive visualizations can provide additional ways to search, compare, and understand recipe and cuisine data beyond a traditional recipe-page format.
