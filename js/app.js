// Shared functions across pages
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    document.getElementById("cart-button").addEventListener("click", () => {
        window.location.href = "checkout.html";
    });
});

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
