let cachedSeason = null; // Cache the season for reuse
const homeBtn =document.getElementById("home");
const mainHome =document.getElementById("home-section");



const dataSources = {
  foraged: "./foragedProducts.json",
  crops: "./cropsProducts.json",
  seafood: "./seafoodsProducts.json",
  other: "./products.json",
};

// Function to determine the current season using the system's date
function getCurrentSeason() {
  if (cachedSeason) return cachedSeason; // Return cached season if available

  const month = new Date().getMonth(); // Get the current month (0-based index)
  let season;

  if (month >= 2 && month <= 4) {
    season = "spring";
  } else if (month >= 5 && month <= 7) {
    season = "summer";
  } else if (month >= 8 && month <= 10) {
    season = "fall";
  } else {
    season = "winter";
  }

  cachedSeason = season; // Cache the season
  return season;
}

// Apply the seasonal theme to the body element
function applySeasonalTheme() {
  const season = getCurrentSeason(); // Get the current season
  document.body.classList.remove("spring", "summer", "fall", "winter");
  document.body.classList.add(season);
}
// LAYERING
function applyParallax() {
  const scrollY = window.scrollY;

  document.querySelectorAll(".panel-layer").forEach((layer) => {
    const speed = parseFloat(layer.dataset.speed);
    layer.style.transform = `translateY(${scrollY * speed}px)`;
  });
}
document.addEventListener("scroll", applyParallax);

// Object to store all loaded data
let allProducts = {};

// Preload JSON files
function preloadData() {
  const loadPromises = Object.entries(dataSources).map(([key, path]) => {
    return fetch(path)
      .then((response) => response.json())
      .then((data) => {
        allProducts[key] = data;
      });
  });

  return Promise.all(loadPromises).then(() => {
    console.log("All Products Loaded:", allProducts);
  });
}

// Filter products by category and season
function filterProducts(category, season = null) {
  console.log("Category:", category, "Season:", season);
  let products;

  switch (category) {
    case "seasonal-crops":
      products = allProducts.crops.filter((product) =>
        product.season.includes(season)
      );
      break;
    case "greenhouse-crops":
      products = allProducts.crops.filter(
        (product) => !product.season.includes(season)
      );
      break;
    case "foraged-items":
      products = allProducts.foraged.filter((product) =>
        product.season.includes(season)
      );
      break;
    case "seafoods":
      products = allProducts.seafood.filter((product) =>
        product.season.includes(season)
      );
      break;
    case "artisan-goods":
      products = allProducts.other.filter(
        (product) => product.category === "artisan"
      );
      break;
    case "animal-products":
      products = allProducts.other.filter(
        (product) => product.category === "animal"
      );
      break;
    default:
      products = [];
  }

  return products;
}
const productList = document.querySelector("#product-section");
// Render products to the DOM
function renderProducts(products) {

  if (!productList) {
    console.error("No #product-section element found in the DOM.");
    return;
  }
  productList.classList.add("display")
  productList.innerHTML = ""; // Clear previous items
    const ul = document.createElement("ul");
    productList.appendChild(ul);
    ul.classList.add("products-Ul");
  products.forEach((product) => {
    const listItem = document.createElement("li");
    const img = document.createElement("img");
    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    const btn =document.createElement("button");
    img.src =`${product.image}`;
    img.alt = `${product.name}`;
    h3.innerText =`${product.name}`;
    p.innerText =`${product.price}`;
    btn.innerText ="+";
    ul.appendChild(listItem);
    listItem.appendChild(img);
    listItem.appendChild(h3);
    listItem.appendChild(p);
    listItem.appendChild(btn);
  });
}




// Setup category click listeners
function setupCategoryListeners() {
  const navItems = document.querySelectorAll(".nav-item");
  
  navItems.forEach((item) => {
    console.log("Adding listener to:", item);
    item.addEventListener("click", () => {
      navItems.forEach((navItem) => navItem.classList.remove("active"));
      
      item.classList.add("active");
      
      const category = item.dataset.category;
      
      const season = cachedSeason;

      const filteredProducts = filterProducts(category, season);

      
      renderProducts(filteredProducts);
      
    });
  });
}

/*
homeBtn.addEventListener("click",()=>{
  if(productList.classList.contains("display")){
    productList.classList.remove("display");
  } else{
    return false
  }
});*/


/*
function showSection(targetId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    if (section.id === targetId) {
      section.style.display = "block";
    } else {
      section.style.display = "none";
    }
  });
}*/


// Setup navbar click listeners
function setupNavbarListeners() {
  const navItems = document.querySelectorAll(" .navbar-li ");
  navItems.forEach((item) => {
    const targetId = item.getAttribute("href").slice(1);
    item.addEventListener("click", (event) => {
      event.preventDefault();
     //showSection(targetId);
    });
  });
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  cachedSeason = getCurrentSeason(); 
  // Set the current season
  applySeasonalTheme(); 
  // Apply the seasonal theme
  preloadData().then(() => {
    //showSection("home-section");
    setupCategoryListeners(); 
    // Set up navbar listeners
    
    setupNavbarListeners(); // Set up navbar listeners
    /*showSection('#parallax-container'); //Show background by default doesnt work?*/
  });
});




