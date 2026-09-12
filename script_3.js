let recipes = []; // create recipes array to store recipes

//load JSON - recipes data
fetch("recipes.json") 
  .then(r => r.json()) 
  .then(data => {
    recipes = data.sort((a, b) => a.title.localeCompare(b.title)); //sorting recipes array in alphabetical order based on title
    //cuisine menu
    const cuisines = [...new Set(recipes.map(r=>r.cuisine))]
    renderCuisineMenu(cuisines);
    const default_recipes = recipes.filter(r => r.cuisine === "French");
    updateScatterPlot(recipes); //scatterplot shows all recipes
    updateWordCloud("AllCuisines"); // wordcloud based on all cuisines
    renderList(recipes);
  })
  .catch(err => { //error handling
    console.error("Error loading recipes.json:", err);
  });

function renderList(list) {
  /** create a container to hold all recipes and make a div for each recipes in the list
   * when a recipe is selected, recipe details are displayed
  */
  const recipe_container = document.getElementById("results");
  recipe_container.innerHTML = "";
  list.forEach(r => {
    const div = document.createElement("div");
    div.textContent = r.title;
    div.addEventListener("click", () => showRecipe(r));
    recipe_container.appendChild(div);
  });
}

function showRecipe(recipe) {
  /**Display recipe details of selected recipe. Place details into the content element.
   * ingredients with unordered list (bullet points)
   * method steps with ordered list
   */
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>${recipe.title}</h2>
    <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
    <p><strong>Total time:</strong> ${recipe.total_time} min</p>
    <p><strong>Popularity:</strong> ${recipe.popularity}</p>
    <h3>Ingredients</h3> 
    <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
    <h3>Method</h3>
    <ol>${recipe.method.map(d => `<li>${d}</li>`).join("")}</ol> 
  `;
}

/*search recipes in sidebar
find searchbox element from html, put an eventlistener on it to monitor
 what's the input(search word), then make the query lowercase and 
 make allt he words in recipes lowercase too to make the matching functionality
 producing correct results. Check if the search word matches with any of the text
  in the title, ingredients or method*/
document.getElementById("searchBox").addEventListener("input", function () {
  const q = this.value.toLowerCase();
  const filtered = recipes.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.ingredients.join(" ").toLowerCase().includes(q) ||
    r.method.join(" ").toLowerCase().includes(q)
  );

  renderList(filtered); //update the list with the filtered recipes that match the criteria
});

//scatterplot
function updateScatterPlot(data) {
  /**Updates the scatter plot */
  const scatterplot_container = d3.select("#scatterplot"); //select scatterplot div from html
  scatterplot_container.selectAll("*").remove();   // clear old plot
//define the size of the scatterplot with margin
  const width = 800;
  const height = 600;
  const margin = 50;

  const svg = scatterplot_container.append("svg") //create display area for scatterplot
  // with the following mesaurements
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleLinear() //scale time data range to x axis 
    .domain([0, d3.max(data, d => d.total_time)]) // cooking time range
    .range([margin, width - margin]); //values placed on diplay within the range

  const y = d3.scaleLinear() //scale popularity range to y axis
    // .domain([0, d3.max(data, d => d.popularity)])
    .domain([d3.min(data, d=>d.popularity), d3.max(data, d=>d.popularity)]) //start from the minimum value instead of zero
    .range([height - margin, margin/2]);
 //position axes
  svg.append("g")
    .attr("transform", `translate(0, ${height - margin})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin}, 0)`)
    .call(d3.axisLeft(y));
//add text labels to axes
  svg.append("text") 
    .attr("x", width / 2)
    .attr("y", height -15)
    .attr("text-anchor", "middle")
    .text("Total Time (min)");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    // .attr("y", 15)
    .attr("y", 12) //move text to left more
    .attr("text-anchor", "middle")
    .text("Popularity Score");
//add data points/circles to represent recipes
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.total_time)) //x coord for point/recipe circle
    .attr("cy", d => y(d.popularity)) //y coord for point/circle
    .attr("r", 6) // radius  of the circle
    .attr("fill", "tomato");

  svg.selectAll("text.label") //select all text elements with class label
  .data(data)
  .enter()
  .append("text")
  .attr("class", "label")
  .attr("x", d=>x(d.total_time)+8)//+8 to position it better next to the dot
  .attr("y", d=>y(d.popularity)+5) //same here, positioning
  .style("font-size", "14px")
  .text(d=>d.title);
}


// d3.csv("../ingredient_frequency.csv", create_word_cloud);
// d3.csv("ingredient_freq.csv").then(create_word_cloud);
// d3.csv("hun_ingredients.csv").then(create_word_cloud);
function updateWordCloud(cuisine) {
  d3.select("#wordcloud").selectAll("*").remove(); //delete old word cloud
  const csvFiles = { //csv object with the cuisine csvs
    French: "french_ingredients.csv",
    Greek: "greek_ingredients.csv",
    Hungarian: "hun_ingredients.csv",
    Italian: "italian_ingredients.csv",
    AllCuisines: "ingredient_freq.csv"
  };
  const csvFile = csvFiles[cuisine];
//load csv data
  // d3.csv(csvFile).then(data => {
  d3.csv(csvFile + "?v=" + Date.now()).then(data => {
    data.forEach(d => {
      d.frequency = Number(d.frequency);
    });    create_word_cloud(data);
  });
}

function create_word_cloud(data) {
  const min_frequency = 5;
  data.forEach(d => {
    d.frequency = Number(d.frequency);
  });

  const wordscale = d3.scaleLinear()
    .domain([min_frequency, d3.max(data, d=>d.frequency)])
    .range([32,120]);
    
  const words = data.map(d => ({
    text: d.ingredient,
    size: wordscale(d.frequency)
  }));

//   const colour_scheme = d3.schemeSet2;1
  const colour_scheme = d3.schemeDark2;

  const svg = d3.select("#wordcloud")
    .append("svg")
    .attr("width", 800)
    .attr("height", 800);

  d3.layout.cloud()
    .size([750, 750])
    .words(words)
    // .padding(3)
    .rotate(d=>d.text.length >5 ? 0:90) //words less than 5 chars or equal are rotated 90 degrees, others not
    // .rotate(()=>(Math.random() > 0.85?90:0))
    // .fontSize(d => wordscale(d.size))
    .fontSize(d=>d.size)
    .on("end", draw)
    .start();

  function draw(words) {
    const wordG = svg.append("g")
      .attr("transform", "translate(375,375)");

    wordG.selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", d => d.size + "px")
      .style("font-family", "Arial, Helvetica, sans-serif")
    //   .style("font-weight", 500)
      //.style("fill", "#4F442B")
      .style("fill", () => colour_scheme[Math.floor(Math.random()*colour_scheme.length)])
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text(d => d.text)
      .on("click", (event,d)=>filter_by_ingred(d.text))
      .style("cursor", "pointer");
  }
}
function filter_by_ingred(ingredient) {
  const filtered = recipes.filter(r =>
    r.ingredients.some(ing =>
      ing.toLowerCase().includes(ingredient.toLowerCase())
    )
  );

  renderList(filtered);
}
//cuisine menu
// const cuisines = [...new Set(recipes.map(r => r.cuisine))];
// renderCuisineMenu(cuisines);

function renderCuisineMenu(cuisines) {
  const menu = document.getElementById("cuisineMenu");
  menu.innerHTML = "";

  cuisines.forEach(cuisine => { //create button for each cuisine
    const btn = document.createElement("button");
    btn.textContent = cuisine; //add text to button
    btn.style.padding = "2px";
    btn.style.marginRight = "3px";
    btn.addEventListener("click", () => { //filter cuisine 
      const filtered = recipes.filter(r => r.cuisine === cuisine);
      updateScatterPlot(filtered);
      renderList(filtered); //to filter the sidebar as well
      updateWordCloud(cuisine);
    });
    menu.appendChild(btn);
  });
}

// //update time label
// label.textContent = `Select cooking time: ${slider.value}`;
// slider.addEventListener('input', () => {
//   label.textContent = `Select cooking time: ${slider.value} minutes`;
// });

const cooking_time_slider = document.getElementById('time_range'); //slider for selcting cooking time
const cooking_time_label = document.getElementById('time_label'); //cooking time label
const popularity_slider = document.getElementById('pop_range'); // popularity slider
const popularity_label = document.getElementById('popularity_label'); //popularity slider label

//the two filtering functions work independently, so I need to merge them tgheter
// function time_filter_scatterplot(){
//   /**adjust cooking time with slider to filter recipes */
//   const max_time = Number(cooking_time_slider.value);
//   const time_filtered = recipes.filter(d=>d.total_time<=max_time);
//   updateScatterPlot(time_filtered);
// }

// //update time label
// cooking_time_label.textContent = `Select cooking time: ${cooking_time_slider.value}`;
// cooking_time_slider.addEventListener('input', () => {
//   cooking_time_label.textContent = `Select cooking time: ${cooking_time_slider.value} minutes`;
//   time_filter_scatterplot();
// });

// function filter_by_popularity(){
//   /**adjust popularity score with slider to filter recipes */
//   const max_pop_score = Number(popularity_slider.value);
//   const filtered_pop_score = recipes.filter(d=>d.popularity<=max_pop_score);
//   updateScatterPlot(filtered_pop_score);
// }

// //update popularity label
// popularity_label.textContent = `Select Popularity Score: ${popularity_slider.value}`;
// popularity_slider.addEventListener('input', ()=>{
//   popularity_label.textContent = `Select Popularity Score: ${popularity_slider.value}`;
//   filter_by_popularity(); //call filtering
// })

function filter_scatterplot(){
  const max_time = Number(cooking_time_slider.value);
  const max_pop_score = Number(popularity_slider.value);
  const filtered_cooking_time_and_pop = recipes.filter(d=>
    d.total_time<=max_time &&
    d.popularity>=max_pop_score);
    updateScatterPlot(filtered_cooking_time_and_pop);
    renderList(filtered_cooking_time_and_pop);
    // updateWordCloud(filtered_cooking_time_and_pop);
    // updateWordCloud();
    updateWordCloud(cuisine);
}
//update lables
cooking_time_label.textContent = `Select cooking time: ${cooking_time_slider.value} minutes`;
cooking_time_slider.addEventListener('input', () => {
  cooking_time_label.textContent = `Select cooking time: ${cooking_time_slider.value} minutes`;
  filter_scatterplot();
});
popularity_label.textContent = `Select Popularity Score: ${popularity_slider.value}`;
popularity_slider.addEventListener('input', () => {
  popularity_label.textContent = `Select Popularity Score: ${popularity_slider.value}`;
  filter_scatterplot();
});