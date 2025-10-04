document.addEventListener("DOMContentLoaded", () => {
    console.log("URL params:", window.location.search);
    console.log("Parsed ID:", parseInt(new URLSearchParams(window.location.search).get("id")));

    console.log("Page loaded.");
    fetch("./data/products.json")
        .then(res => res.json())
        .then(data => {
            console.log("Products loaded:", data);
            const params = new URLSearchParams(window.location.search);
            const id = parseInt(params.get("id"));
            console.log("Parsed ID:", id);
            const product = data.find(p => p.id === id);
            if (product) {
                renderProduct(product);
            } else {
                document.getElementById("product-detail").innerHTML = "<p>Product not found.</p>";
            }
        })
        .catch(err => {
            document.getElementById("product-detail").innerHTML = "<p>Failed to load products.json</p>";
            console.error("Error loading JSON:", err);
        });
});


function renderProduct(product) {
    const container = document.getElementById("product-detail");
    let description = product.description.map(point => `<li>${point}</li>`).join("");
    container.innerHTML = `
    <div class="row">
        <div class="col-md-6 text-center">
            <img src="${product.image} " class="img-fluid product-image" alt="${product.name}">
        </div>
        <div class="col-md-6">
            <h1 style="color:white"><i>${product.name}</i></h1><br>
            <h5 style="color:blue;font-size:21px;font-family:cursive"><p>Category: &nbsp;${product.category || "No category found"}</p></h5>
            <h3 style="color:indigo"><b>About this Item:</b></h3>
            <ul style="font-size:19px;font-family:cursive;font-color:yellow">${description}</ul>

            <h7 style=" font-size:24px"><label style="color:orange">Brand : &nbsp;</label><span style="font-family:cursive;color:pink">${product.Brand || "EcoKart Assured Product🛡️"}</span></h7><br>
            <h7 style=" font-size:24px"><label style="color:orange">Material : &nbsp;</label><span style="font-family:cursive;color:pink">${product.Material || "EcoKart Assured Product🛡️"}</span></h7><br>
            <h7 style=" font-size:24px"><label style="color:orange">Dimensions : &nbsp;</label><span style="font-family:cursive;color:pink">${product.ProductDimensions || "No dimensions found"}</span></h7><br>
            <h7 style=" font-size:24px"><label style="color:orange">Colour : &nbsp;</label><span style="font-family:cursive;color:pink">${product.Colour || "Mixture"}</span></h7><br>
            <h7 style=" font-size:24px"><label style="color:orange">Department : &nbsp;</label><span style="font-family:cursive;color:pink">${product.Department || "Universal Use"}</span></h7><br>
            <h7 style=" font-size:24px"><label style="color:orange">Item Model Number : &nbsp;</label><span style="font-family:cursive;color:pink">${product.Itemmodelnumber}</span></h7><br>
            <h7 style=" font-size:24px"><label style="color:orange">Item Weight : &nbsp;</label><span style="font-family:cursive;color:pink">${product.ItemWeight || "<1 kg"}</span></h7><br>
            <h7 style=" font-size:24px"><label style="color:orange">Net Quantity : &nbsp;</label><span style="font-family:cursive;color:pink">${product.NetQuantity || "1.00 count"}</span></h7><br>
            <h7 style=" font-size:24px"><label style="color:orange">Generic Name : &nbsp;</label><span style="font-family:cursive;color:pink">${product.GenericName || "General purpose use"}</span></h7><br>
            <h7 style=" font-size:24px"><label style="color:orange">ASIN : &nbsp;</label><span style="font-family:cursive;color:pink">${product.ASIN || "No ASIN found"}</span></h7><br>
            <h7 style=" font-size:24px"><label style="color:orange">Manufacturer : &nbsp;</label><span style="font-family:cursive;color:pink">${product.Manufacturer || "EcoKart Assured Product🛡️"}</span></h7><br>
            <h7 style=" font-size:24px"><label style="color:orange">Country of Origin : &nbsp;</label><span style="font-family:cursive;color:pink">${product.CountryofOrigin || "India"}</span></h7><br><br>
            <h5 style="color:green">MRP : ₹${product.price.toFixed(2)}</h5>
            <div class="mb-3">
                <label style="color:teal; font-size:23px;" for="quantity" class="form-label">Quantity</label>
                <input type="number" id="quantity" class="form-control" value="1" min="1">
            </div>
            <button class="btn btn-success" style="color: white" onclick="handleAddToCart(${product.id})">Add to Cart</button>
            
            <button class="btn btn-warning btn-sm ms-2" onclick="handleAddToWishlist(${product.id})"><i class="fa fa-heart"></i>&nbsp;Add to Wishlist</button>

            <button class="btn btn-failure" onclick="removeFromCart(${product.id})">
              <i class="fa fa-trash"></i> Remove from Cart
            </button>
 

            <div class="col-md-6 text-center">
  <br><br><br>
  <h3 style="color:green">Top Customers Reviews</h3><br>
  ${product['review-img'] ? 
    `<div class="review-container">
      <div class="review-header">
        <img src="assets/images/user.png" class="user-image" alt="User Image">
        <span class="user-name">${product['user-name'] || 'Anonymous'}</span><br>
        <p class="review-date">Review Date: ${product['review-date'] || 'No date found'}</p><br><br>
        <p class="product-color">Product Color: ${product['user-product-color'] || 'Not specified'}</p><br>
      </div>
      <img src="${product['review-img']}" class="img-fluid product-image" alt="${product['review-des'] || 'Review Image'}">
      <p class="review-description">${product['review-des'] || 'No review description found.'}</p>
    </div>` : 
    '<p>No review image found.</p>'}
</div>
        </div>
    </div>
    `;
};

/*Wishlist section*/
 

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


function handleAddToCart(productId) {
    const quantity = parseInt(document.getElementById("quantity").value) || 1;
    addToCart(productId, quantity);
    updateCartCount();

    // Simple fly animation
    const productImage = document.querySelector(".product-image");
    const imgClone = productImage.cloneNode();
    imgClone.classList.add("add-to-cart-fly");
    document.body.appendChild(imgClone);

    const rect = productImage.getBoundingClientRect();
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

    // Notification message
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = '<span style="font-family:cursive">Item added to cart</span>';
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