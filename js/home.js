document.addEventListener("DOMContentLoaded", () => {
    fetch("data/products.json")
        .then(res => res.json())
        .then(data => {
            window.products = data;
            renderProducts(data);
            setupCategoryFilter(data);
            setupSearchAndFilter(data);
            setupSidebarFilter(products);
            //filter section-hidden by icon
            const filterSection = document.getElementById("filter-section");
//   filterSection.style.display = "none";
//   document.getElementById("filter-icon").addEventListener("click", () => {
//     filterSection.style.display = filterSection.style.display === "none" || filterSection.style.display === "" ? "block" : "none";
//   });
        });
        
});
 
function renderProducts(products) {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = "";
    products.forEach(product => {
        grid.innerHTML += `
        <div class="col-md-3 mb-4">
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">₹${product.price.toFixed(2)}</p>
                    <div class="mt-auto">
                        <a href="product.html?id=${product.id}" class="btn btn-primary btn-sm">View</a>
                        <button class="btn btn-success btn-sm" onclick="handleAddToCart(${product.id}, this)">Add to cart</button>
                        <button class="btn btn-warning btn-sm ms-2" onclick="handleAddToWishlist(${product.id})"><i class="fa fa-heart"></i></button>

                    </div>
                </div>
            </div>
        </div>`;
    });
}
 

document.getElementById("buy-now").addEventListener("click", function() {
  const cartCount = parseInt(document.getElementById("cart-count").textContent);
  if (cartCount > 0) {
    window.location.href = "http://127.0.0.1:5500/checkout.html";
  } else {
    alert("Your cart is empty. Please add some products to proceed.");
  }
});

function updateBuyNowButton() {
  const cartCount = parseInt(document.getElementById("cart-count").textContent);
  const buyNowButton = document.getElementById("buy-now");
  if (cartCount > 0) {
    buyNowButton.disabled = false;
  } else {
    buyNowButton.disabled = true;
  }
}

// After updating the cart count
/*document.getElementById("cart-count").textContent = newCount;
updateBuyNowButton();*/


//New Thing
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingProduct = cart.find(p => p.id === productId);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    // Notification message
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = '<span style="font-family:cursive">Added to Cart!</span>';
    document.body.appendChild(notification);

    // Notification animation
    setTimeout(() => {
        notification.style.right = "20px";
    }, 100);

    setTimeout(() => {
        notification.style.right = "-300px";
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

function updateCartCount() {
    const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
    document.getElementById("cart-count").textContent = cartCount;
    updateBuyNowButton();
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
});



function handleAddToCart(productId, button) {
    addToCart(productId);
    // Simple fly animation
    const img = button.closest(".card").querySelector("img");
    const imgClone = img.cloneNode();
    imgClone.classList.add("add-to-cart-fly");
    document.body.appendChild(imgClone);

    const rect = img.getBoundingClientRect();
    imgClone.style.top = rect.top + window.scrollY + "px";
    imgClone.style.left = rect.left + window.scrollX + "px";
    imgClone.style.width = rect.width + "px";

    const cartBtn = document.getElementById("cart-button");
    const cartRect = cartBtn.getBoundingClientRect();

    // Force the browser to recognize initial state
    imgClone.offsetWidth;

    setTimeout(() => {
        imgClone.style.top = cartRect.top + window.scrollY + "px";
        imgClone.style.left = cartRect.left + window.scrollX + "px";
        imgClone.style.width = "20px";
    }, 10);

    setTimeout(() => {
        imgClone.remove();
    }, 1000);
}


    function setupFilter(products) {
  const categories = [...new Set(products.map(p => p.category))];
  const subcategories = {
    Material: [...new Set(products.map(p => p.Material))],
    Brand: [...new Set(products.map(p => p.Manufacturer))]
  };

  // Generate category checkboxes
  const categoryCheckboxes = document.getElementById("category-checkboxes");
  categories.forEach(category => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = category;
    checkbox.id = `category-${category}`;
    const label = document.createElement("label");
    label.htmlFor = `category-${category}`;
    label.textContent = category;
    categoryCheckboxes.appendChild(checkbox);
    categoryCheckboxes.appendChild(label);
    categoryCheckboxes.appendChild(document.createElement("br"));
  });

  // Generate subcategory checkboxes
  const subcategoryCheckboxes = document.getElementById("subcategory-checkboxes");
  Object.keys(subcategories).forEach(subcategory => {
    subcategories[subcategory].forEach(value => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = value;
      checkbox.id = `${subcategory}-${value}`;
      const label = document.createElement("label");
      label.htmlFor = `${subcategory}-${value}`;
      label.textContent = value;
      subcategoryCheckboxes.appendChild(checkbox);
      subcategoryCheckboxes.appendChild(label);
      subcategoryCheckboxes.appendChild(document.createElement("br"));
    });
  });

  // Add event listeners to checkboxes and price slider
  const filterCheckboxes = document.querySelectorAll("input[type='checkbox']");
  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", filterProducts);
  });

  const priceSlider = document.getElementById("price-slider");
  priceSlider.addEventListener("input", filterProducts);
}

function filterProducts() {
  const selectedCategories = [];
  const selectedSubcategories = {};
  const priceValue = document.getElementById("price-slider").value;

  // Get selected categories
  const categoryCheckboxes = document.querySelectorAll("#category-checkboxes input[type='checkbox']");
  categoryCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedCategories.push(checkbox.value);
    }
  });

  // Get selected subcategories
  const subcategoryCheckboxes = document.querySelectorAll("#subcategory-checkboxes input[type='checkbox']");
  subcategoryCheckboxes.forEach(checkbox => {
    const subcategory = checkbox.id.split("-")[0];
    if (checkbox.checked) {
      if (!selectedSubcategories[subcategory]) {
        selectedSubcategories[subcategory] = [];
      }
      selectedSubcategories[subcategory].push(checkbox.value);
    }
  });

  // Filter products
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const subcategoryMatch = Object.keys(selectedSubcategories).every(subcategory => {
      return selectedSubcategories[subcategory].includes(product[subcategory]);
    });
    const priceMatch = product.price <= priceValue;

    return categoryMatch && subcategoryMatch && priceMatch;
  });

  renderProducts(filteredProducts);
};

function setupSearchAndFilter(products) {
    const searchInput = document.getElementById("search-input");
    const categorySelect = document.getElementById("category-filter");

    searchInput.addEventListener("input", () => {
        applyFilters();
    });

    categorySelect.addEventListener("change", () => {
        applyFilters();
    });

    function applyFilters() {
        const query = searchInput.value.toLowerCase().trim();
        const category = categorySelect.value;

        let filtered = products.filter(product => {
            // Check if product name includes search query
            const matchesName = product.name.toLowerCase().includes(query);
            
            // Check category filter
            const matchesCategory = category === "all" || product.category === category;

            return matchesName && matchesCategory;
        });

        if (filtered.length === 0) {
            const grid = document.getElementById("product-grid");
            grid.innerHTML = `<div class="col-12 text-center"><p>No search results found.</p></div>`;
        } else {
            renderProducts(filtered);
        }
    }
}
function setupCategoryFilter(products) {
    const categoryContainer = document.getElementById("category-checkboxes");
    const uniqueCategories = [...new Set(products.map(p => p.category))].sort();

    uniqueCategories.forEach(category => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = category;
        checkbox.id = `category-${category}`;
        checkbox.classList.add("category-checkbox");

        const label = document.createElement("label");
        label.htmlFor = `category-${category}`;
        label.textContent = category;

        const div = document.createElement("div");
        div.classList.add("form-check");

        checkbox.classList.add("form-check-input");
        label.classList.add("form-check-label");

        div.appendChild(checkbox);
        div.appendChild(label);

        categoryContainer.appendChild(div);
    });

    // Add event listener to all checkboxes
    categoryContainer.addEventListener("change", () => {
        applyCategoryFilter(products);
    });
}

function applyCategoryFilter(products) {
    const checkedBoxes = document.querySelectorAll(".category-checkbox:checked");
    const selectedCategories = Array.from(checkedBoxes).map(cb => cb.value);

    let filtered = [];

    if (selectedCategories.length === 0) {
        filtered = products;
    } else {
        filtered = products.filter(product => selectedCategories.includes(product.category));
    }

    const grid = document.getElementById("product-grid");

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center"><p>No products found in selected categories.</p></div>`;
    } else {
        renderProducts(filtered);
    }
}

    document.getElementById("category-filter").addEventListener("change", e => {
        const category = e.target.value;
        const filtered = category === "all" ? products : products.filter(p => p.category === category);
        renderProducts(filtered);
    });

    document.getElementById("search-button").addEventListener("click", () => {
  applyFilters();
});


// /*Timer Section*/
// // Set the end date for the timer (6 days from now)
// let endDate = new Date();
// endDate.setDate(endDate.getDate() + 6);

// // Function to update the timer
// function updateTimer() {
//   let now = new Date();
//   let timeLeft = endDate - now;

//   let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
//   let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
//   let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

//   let timerHtml = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
//   document.getElementById('timer').innerHTML = timerHtml;

//   // Update the timer every second
//   setTimeout(updateTimer, 1000);
// }

// // Start the timer
// updateTimer();
// --- Countdown Timer JavaScript ---
    const countDownDateUrgent = new Date().getTime() + (1 * 24 * 60 * 60 * 1000); // 1 Day from now

    const timerUrgent = document.getElementById("timer-urgent");

    const xUrgent = setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDateUrgent - now;

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerUrgent.innerHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (distance < 0) {
            clearInterval(xUrgent);
            timerUrgent.innerHTML = "EXPIRED";
        }
    }, 1000);

//Product Sliders->show adv
const productImages = document.getElementById('product-images1');
const prevBtn = document.getElementById('prev-btn1');
const nextBtn = document.getElementById('next-btn1');

nextBtn.addEventListener('click', () => {
    productImages.scrollBy({ left: 160, behavior: 'smooth' });
});

prevBtn.addEventListener('click', () => {
    productImages.scrollBy({ left: -160, behavior: 'smooth' });
});

//Product Sliders->show adv **Limited Offer**
const productImag = document.getElementById('product-images3');
const prev = document.getElementById('prev-btn3');
const next = document.getElementById('next-btn3');

next.addEventListener('click', () => {
    productImag.scrollBy({ left: 160, behavior: 'smooth' });
});

prev.addEventListener('click', () => {
    productImag.scrollBy({ left: -160, behavior: 'smooth' });
});

//Review Sliders->show adv **Customer Reviews**
const product = document.getElementById('product-images4');
const pre= document.getElementById('prev-btn4');
const nex = document.getElementById('next-btn4');

nex.addEventListener('click', () => {
    product.scrollBy({ left: 160, behavior: 'smooth' });
});

pre.addEventListener('click', () => {
    product.scrollBy({ left: -160, behavior: 'smooth' });
});

//Product Sliders->show adv **Featured Products**
const productImage = document.getElementById('product-images2');
const prevBt = document.getElementById('prev-btn2');
const nextBt = document.getElementById('next-btn2');

nextBt.addEventListener('click', () => {
    productImage.scrollBy({ left: 160, behavior: 'smooth' });
});

prevBt.addEventListener('click', () => {
    productImage.scrollBy({ left: -160, behavior: 'smooth' });
});
