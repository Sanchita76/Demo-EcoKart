// Shared functions across pages
document.addEventListener("DOMContentLoaded", () => {
    fetch("data/products.json")
        .then(res => res.json())
        .then(data => {
            window.products = data;
        });
    updateCartCount();
    updateWishlistCount();
    document.getElementById("cart-button").addEventListener("click", () => {
        window.location.href = "checkout.html";
    });
    document.addEventListener('DOMContentLoaded', function () {
    wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    updateWishlistCount();
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

function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    let cart = getCart();
    let item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity });
    }
    saveCart(cart);
    updateCartCount();
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

function removeFromCart(productId) {
    let cart = getCart().filter(i => i.id !== productId);
    saveCart(cart);
    updateCartCount();
}

function updateCartCount() {
    const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").textContent = count;
}

function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount();
}


/*For Wishlist section - Common for all segments*/

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];


function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Add product to wishlist
function handleAddToWishlist(productId) {
    const product = products.find(p => p.id === productId); // ✅ fixed
    if (product) {
        const existingProduct = wishlist.find(p => p.id === productId);
        if (!existingProduct) {
            wishlist.push(product);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistCount();
            renderWishlist();
            saveWishlist(wishlist);
            // alert(`${product.name} has been added to your wishlist!`);
        }
    }
    // Notification message
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = '<span style="font-family:cursive">Item added to Wishlist</span>';
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

 
// Render wishlist dropdown
function renderWishlist() {
    const wishlistDropdown = document.getElementById('wishlist-dropdown');
    wishlistDropdown.innerHTML = '';

    if (wishlist.length === 0) {
        wishlistDropdown.innerHTML = `<p>No items in wishlist</p>`;
    } else {
        wishlist.forEach(product => {
            // Inside the renderWishlist function's else block:
const productHTML = `
    <div class="wishlist-item">
        <img src="${product.image}" width="50" class="wishlist-item-image">
        <span class="wishlist-item-text">
            ${product.name} <br> ₹${product.price.toFixed(2)}
            <button class="btn btn-failure" onclick="removeFromWishlist(${product.id})" style="color:yellow">
              <i class="fa fa-trash" style="color: red;"></i> Remove
            </button><br>
        </span><br>
    </div>`;
wishlistDropdown.insertAdjacentHTML('beforeend', productHTML);
        });
    }

    wishlistDropdown.style.display =
        wishlistDropdown.style.display === 'block' ? 'none' : 'block';
}


function removeFromWishlist(productId) {
    let wishlist = getWishlist().filter(i => i.id !== productId);
    saveWishlist(wishlist);
    updateWishlistCount();
    // Notification message
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = '<span style="font-family:cursive">Item removed from Wishlist</span>';
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


// Update wishlist count
function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlist-count');
    wishlistCount.innerText = wishlist.length;
}

// Initialize wishlist on page load
document.addEventListener('DOMContentLoaded', function () {
    wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    updateWishlistCount();
});
