let cachedSeason = null; // Cache the season for reuse
const homeBtn = document.getElementById("home");
const mainHome = document.getElementById("home-section");

const cart = [];
const cartContainer = document.getElementById("cart-container"); // Ensure this exists in your HTML
const cartList = document.getElementById("cart-list"); // The UL inside cart
const cartTotal = document.getElementById("cart-total"); // Total price display
const cartIcon = document.getElementById("cart-icon"); // Cart button to toggle visibility

const formInputs = {
  name: document.querySelector("#name"),
  email: document.querySelector("#email"),
  message: document.querySelector("#message"),
};

const closeCart = document.getElementById("close-cart-btn");
closeCart.addEventListener("click", () => {
  cartContainer.classList.remove("visible");
});

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
  productList.classList.add("display");
  productList.innerHTML = ""; // Clear previous items
  const ul = document.createElement("ul");
  productList.appendChild(ul);
  ul.classList.add("products-Ul");
  products.forEach((product) => {
    const listItem = document.createElement("li");
    const img = document.createElement("img");
    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    const btn = document.createElement("button");
    const coinImg = document.createElement("img");
    coinImg.src = "assets/images/27px-Gold.png";
    coinImg.alt = "coin";
    coinImg.classList.add("price-icon");
    img.src = `${product.image}`;
    img.alt = `${product.name}`;
    h3.innerText = `${product.name}`;
    p.innerText = `${product.price}g`;
    btn.innerText = "+";
    btn.addEventListener("click", () => addToCart(product));
    ul.appendChild(listItem);
    listItem.appendChild(img);
    listItem.appendChild(h3);
    listItem.appendChild(p);
    p.appendChild(coinImg);
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
    const href = item.getAttribute("href");
    if (href) {
      const targetId = href.slice(1);
      item.addEventListener("click", (event) => {
        event.preventDefault();
        showSection(targetId);
      });
    }
  });
}

// Function to handle carousel navigation
function setupCarousel() {
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const carouselTrack = document.querySelector(".carousel-track");
  const services = Array.from(carouselTrack.children);
  let currentIndex = 0;

  console.log("Carousel setup initialized");

  function updateCarousel() {
    services.forEach((service, index) => {
      if (index === currentIndex) {
        service.classList.remove("hidden");
        service.style.opacity = "1";
        service.style.visibility = "visible";
      } else {
        service.classList.add("hidden");
        service.style.opacity = "0";
        service.style.visibility = "hidden";
      }
    });
  }

  prevButton.addEventListener("click", () => {
    console.log("Previous button clicked");
    currentIndex = (currentIndex - 1 + services.length) % services.length;
    updateCarousel();
  });

  nextButton.addEventListener("click", () => {
    console.log("Next button clicked");
    currentIndex = (currentIndex + 1) % services.length;
    updateCarousel();
  });

  updateCarousel(); // Initialize the carousel
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
    // Set up category listeners
    setupNavbarListeners();
    // Set up navbar listeners
    setupCarousel();
    // Set up carousel functionality
    /*showSection('#parallax-container'); //Show background by default doesnt work?*/
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");
  const closeSearch = document.getElementById("close-search");
  const searchContainer = document.querySelector(".search-container");
  const productList = document.querySelector("#product-section");

  // Expand search input
  searchBtn.addEventListener("click", () => {
    searchContainer.classList.add("search-expanded");
    searchInput.focus();
  });

  // Close search input
  closeSearch.addEventListener("click", () => {
    searchContainer.classList.remove("search-expanded");
    searchInput.value = ""; // Clear input
    renderProducts([]); // Optionally clear the displayed products
  });

  // Live search functionality
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    if (query.trim() === "") return renderProducts([]); // Clear results if empty

    const filteredProducts = Object.values(allProducts)
      .flat()
      .filter((product) => product.name.toLowerCase().includes(query));

    renderProducts(filteredProducts);
  });
});
document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    if (cart.length === 0) {
      alert("You didn’t place an order");
      return;
    } else {
      event.preventDefault(); // Prevent actual submission
      alert("Thank you! We'll get back to you soon.");
      this.reset();
    }
  });

function addToCart(product) {
  const existingItem = cart.find((item) => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartDisplay();
  cartContainer.classList.add("visible"); // Show cart when item is added
}

function updateCartDisplay() {
  cartList.innerHTML = ""; // Clear previous items
  let totalPrice = 0;

  cart.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-img">
      <span style="margin-right: 10px;">${item.name} x ${item.quantity}</span> 
      <span style="margin-right: 10px;">${item.price * item.quantity}g</span>
      `;
    cartList.appendChild(listItem);
    totalPrice += item.price * item.quantity;
  });

  cartTotal.innerText = `Total: ${totalPrice}g`;
  const checkoutBtn = document.createElement("button");
  cartList.appendChild(checkoutBtn);
  checkoutBtn.innerText = "Checkout";
  checkoutBtn.classList.add("checkout-btn");
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("You didn’t place an order");
      return;
    }

    for (let key in formInputs) {
      if (!formInputs[key].value.trim()) {
        alert("Please fill out all required fields");
        return;
      }
    }

    alert("Order list sent successfully!");
    cart = [];
    //cart doesnt reset
  });
}

// Toggle cart visibility when clicking the cart icon
cartIcon.addEventListener("click", () => {
  cartContainer.classList.toggle("visible");
});
