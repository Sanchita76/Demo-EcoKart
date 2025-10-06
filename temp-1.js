document.addEventListener("DOMContentLoaded", () => {
    fetch("data/products.json")
        .then(res => res.json())
        .then(data => {
            window.products = data;
            renderCheckout();
        });
});


function renderCheckout() {
    const cart = getCart();
    const tbody = document.getElementById("cart-items");
    tbody.innerHTML = "";
    cart.forEach(item => {
        const product = window.products.find(p => p.id === item.id);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${product.image}" width="50"> ${product.name}</td>
            <td>₹${product.price.toFixed(2)}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="decrementQuantity(${item.id})">-</button>
                <span id="quantity-${item.id}">${item.quantity}</span>
                <button class="btn btn-secondary btn-sm" onclick="incrementQuantity(${item.id})">+</button>
            </td>
            <td id="subtotal-${item.id}">₹${(product.price * item.quantity).toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="removeItem(${item.id})">Remove</button></td>
        `;
        tbody.appendChild(row);
    });
    updateSummary();
}

function updateSummary() {
    const cart = getCart();
    let subtotal = 0;
    cart.forEach(item => {
        const product = window.products.find(p => p.id === item.id);
        subtotal += product.price * item.quantity;
        document.getElementById(`subtotal-${item.id}`).textContent = `₹${(product.price * item.quantity).toFixed(2)}`;
    });
    const discount = subtotal * 0.1; // 10% discount
    const shipping = subtotal * 0.05; // 5% shipping
    const total = subtotal - discount + shipping;
    document.getElementById("subtotal").textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById("discount").textContent = `-₹${discount.toFixed(2)}`;
    document.getElementById("shipping").textContent = `₹${shipping.toFixed(2)}`;
    document.getElementById("total").textContent = `₹${total.toFixed(2)}`;
    updateTotalDisplay(total);
    updatePayButtons();
    updateProceedButtonState();
}

function incrementQuantity(id) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    item.quantity++;
    saveCart(cart);
    updateCartCount();
    renderCheckout();
    updateTotalDisplay(total);
    updatePayButtons();
    updateProceedButtonState();
}

function decrementQuantity(id) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item.quantity > 1) {
        item.quantity--;
        saveCart(cart);
        updateCartCount();
        renderCheckout();
        updateTotalDisplay(total);
        updatePayButtons();
        updateProceedButtonState();
    }
}

function removeItem(id) {
    removeFromCart(id);
    updateCartCount();
    renderCheckout();
    updateTotalDisplay(total);
    updatePayButtons();
    updateProceedButtonState();
}

function applyCoupon() {
    const couponCode = document.getElementById("coupon-code").value.trim();
    if (couponCode === "eco10") {
        document.getElementById("coupon-message").textContent = "Coupon applied!";
        // Add extra 10% discount
        const cart = getCart();
        let subtotal = 0;
        cart.forEach(item => {
            const product = window.products.find(p => p.id === item.id);
            subtotal += product.price * item.quantity;
        });
        const discount = subtotal * 0.2; // 20% discount (10% + 10%)
        const shipping = subtotal * 0.05; // 5% shipping
        const total = subtotal - discount + shipping;
        document.getElementById("discount").textContent = `-₹${discount.toFixed(2)}`;
        document.getElementById("total").textContent = `₹${total.toFixed(2)}`;
        updateTotalDisplay(total);
        updatePayButtons();
        updateProceedButtonState();
    } else {
        document.getElementById("coupon-message").textContent = "Invalid coupon.";
    }
}

function updateCartCount() {
    const cart = getCart();
    let count = 0;
    cart.forEach(item => {
        count += item.quantity;
    });
    document.getElementById("cart-count").textContent = count;
    updateProceedButtonState();
}


// Utility to fetch current total from Order Summary
function getCurrentTotal() {
  const totalText = document.getElementById("total").textContent;
  return totalText.replace("₹", "").trim();
}

const proceedToCheckoutButton = document.getElementById("proceed-to-checkout");
const custbtn=document.getElementById("continue-to-payment");
const cardpay=document.getElementById("proceed-and-pay");
const upipay=document.getElementById("proceed-and-pay-upi");
const customerInfoSection = document.getElementById("customer-info");

// Function to update button state
function updateProceedButtonState() {
  const total = getCurrentTotal();
  if (total > 0) {
    proceedToCheckoutButton.disabled = false;
    proceedToCheckoutButton.classList.remove("disabled-btn");
    
  } else {
    proceedToCheckoutButton.disabled = true;
    proceedToCheckoutButton.classList.add("disabled-btn");
    custbtn.disabled=true;
    custbtn.classList.add("disabled-btn");
    cardpay.disabled=true;
    upipay.disabled=true;
    cardpay.classList.add("disabled-btn");
    cardpay.classList.add("disabled-btn");
  }
}

// Event listener for button click
proceedToCheckoutButton.addEventListener("click", function () {
  const total = getCurrentTotal();
  if (total > 0) {
    customerInfoSection.style.display = "block";
  }
});

// Call once on page load
updateProceedButtonState();

// Call updateProceedButtonState() whenever your cart/total changes

document.getElementById("continue-to-payment").addEventListener("click", function() {
  // Validate customer information
  if (validateCustomerInfo()) {
    document.getElementById("customer-info").style.display = "none";
    document.getElementById("payment-method").style.display = "block";
  }
});

document.getElementById("upi").addEventListener("change", function() {
  if (this.checked) {
    document.getElementById("upi-section").style.display = "block";
    document.getElementById("card-section").style.display = "none";
    updatePayButtons();
  }
});

document.getElementById("card").addEventListener("change", function() {
  if (this.checked) {
    document.getElementById("card-section").style.display = "block";
    document.getElementById("upi-section").style.display = "none";
  }
});

// Add event listeners for UPI icons
const upiIcons = document.querySelectorAll("#upi-section img");
upiIcons.forEach(icon => {
  icon.addEventListener("click", function() {
    document.getElementById("upi-id-section").style.display = "block";
  });
});

const upiInput = document.getElementById("upi-id");
const verifyBtn = document.getElementById("verify-and-pay");
const payUpiBtn = document.getElementById("proceed-and-pay-upi");
const upiError = document.getElementById("upi-error-msg");

upiInput.addEventListener("input", () => {
  const upiPattern = /^[a-zA-Z0-9.-]+@oksbi$/;
  if (upiPattern.test(upiInput.value)) {
    verifyBtn.disabled = false;
    payUpiBtn.disabled = false;
    upiError.textContent = "";

  } else {
    verifyBtn.disabled = true;
    payUpiBtn.disabled = true;
    upiError.textContent = "Enter a valid UPI ID (e.g. name@oksbi)";
  }
  updatePayButtons();
});

// Update Pay Button amounts dynamically
function updatePayButtons() {
  const total = getCurrentTotal();
  document.getElementById("proceed-and-pay-upi").textContent = `Pay ₹${total}`;
  document.getElementById("proceed-and-pay").textContent = `Pay ₹${total}`;
}

// Ensure button prices update when coupon is applied
const couponInput = document.getElementById("coupon-code");
if (couponInput) {
  couponInput.addEventListener("input", () => {
    setTimeout(updatePayButtons, 100); // update after applyCoupon modifies DOM
  });
}

// Initial button price set on load
document.addEventListener("DOMContentLoaded", updatePayButtons);


function updateTotalDisplay(total) {
    const formattedTotal = `₹${total.toFixed(2)}`;

    // Update the order summary total
    document.getElementById("total").textContent = formattedTotal;

    // Update the Card payment button's text
    const cardPayButton = document.getElementById("proceed-and-pay");
    if (cardPayButton) {
        cardPayButton.textContent = `Pay ${formattedTotal}`;
    }

    // Update the UPI payment button's text
    const upiPayButton = document.getElementById("proceed-and-pay-upi");
    if (upiPayButton) {
        upiPayButton.textContent = `Pay ${formattedTotal}`;
    }
}

function validateCustomerInfo() {
  // Validate customer information
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const addressLine1 = document.getElementById("address-line-1").value;
  const addressLine2 = document.getElementById("address-line-2").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const zip = document.getElementById("zip").value;

  // Validate first name
  const firstNameRegex = /^[a-zA-Z]{4,}$/;
  if (!firstNameRegex.test(firstName)) {
    document.getElementById("first-name-error").textContent = "First name should be at least 4 characters and contain only alphabets.";
    document.getElementById("first-name").classList.add("is-invalid");
    return false;
  } else {
    document.getElementById("first-name").classList.remove("is-invalid");
    document.getElementById("first-name").classList.add("is-valid");
  }

  // Validate last name
  const lastNameRegex = /^[a-zA-Z]{3,}$/;
  if (!lastNameRegex.test(lastName)) {
    document.getElementById("last-name-error").textContent = "Last name should be at least 3 characters and contain only alphabets.";
    document.getElementById("last-name").classList.add("is-invalid");
    return false;
  } else {
    document.getElementById("last-name").classList.remove("is-invalid");
    document.getElementById("last-name").classList.add("is-valid");
  }

  // Validate email
  const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]{5,}@(gmail\.com|codeclouds\.co\.in)$/;
  if (!emailRegex.test(email)) {
    document.getElementById("email-error").textContent = "Email should end with '@gmail.com' or '@codeclouds.co.in' and start with alphabets and minimum 6 characters.";
    document.getElementById("email").classList.add("is-invalid");
    return false;
  } else {
    document.getElementById("email").classList.remove("is-invalid");
    document.getElementById("email").classList.add("is-valid");
  }

  /**
 * Validates a phone number based on several criteria:
 * - No invalid patterns like "--" or "  ".
 * - No leading or trailing spaces/hyphens.
 * - After cleaning, it must be exactly 10 digits.
 * - The first digit cannot be '0'.
 * @param {string} phone The phone number string to validate.
 * @returns {boolean} True if the phone number is valid, otherwise false.
 */
function isValidPhoneNumber(phone) {
  // Check for invalid sequences like double spaces, double hyphens, or mixed space/hyphens.
  if (phone.includes("  ") || phone.includes("--") || phone.includes(" -") || phone.includes("- ")) {
    return false;
  }
  // Check for leading or trailing spaces or hyphens.
  if (/^[\s-]|[\s-]$/.test(phone)) {
    return false;
  }
  // Normalize the phone number by removing all spaces and hyphens.
  const normalizedPhone = phone.replace(/[\s-]/g, '');
  // NEW: Check if the first digit of the normalized number is '0'.
  if (normalizedPhone.startsWith('0')) {
      return false;
  }
  // Check if the normalized number consists of exactly 10 digits.
  const tenDigitRegex = /^\d{10}$/;
  if (!tenDigitRegex.test(normalizedPhone)) {
    return false;
  }
  // If all checks pass, the number is valid.
  return true;
}

// --- Your original code block, now using the validation function ---// Validate phone number The 'phone' variable is assumed to be defined before this block.e.g., const phone = document.getElementById("phone").value;
if (!isValidPhoneNumber(phone)) {
  document.getElementById("phone").nextElementSibling.textContent = "Please enter a valid 10-digit number that doesn't start with 0.";
  document.getElementById("phone").classList.remove("is-valid"); // Ensure is-valid is removed on failure
  document.getElementById("phone").classList.add("is-invalid");
  return false;
} else {
  document.getElementById("phone").nextElementSibling.textContent = ""; // Clear the error message on success
  document.getElementById("phone").classList.remove("is-invalid");
  document.getElementById("phone").classList.add("is-valid");
}

  // Validate address line 1
  // The new, more comprehensive regex for validating a house/building number.
// It's anchored with ^ and $ to ensure the entire string matches the pattern.
const addressLine1Regex = /^[1-9]\d*(\s*[-/]\s*[1-9]\d*)?(\s?[a-zA-Z])?$/;

if (!addressLine1Regex.test(addressLine1)) {
  // Updated the error message to be more descriptive.
  document.getElementById("address-line-1-error").textContent = "Please enter a valid house number (e.g., 123, 45A, 123/4).";
  document.getElementById("address-line-1").classList.remove("is-valid"); // Good practice to remove the opposite class
  document.getElementById("address-line-1").classList.add("is-invalid");
  return false;
} else {
  document.getElementById("address-line-1-error").textContent = ""; // Clear error message on success
  document.getElementById("address-line-1").classList.remove("is-invalid");
  document.getElementById("address-line-1").classList.add("is-valid");
}

  // Validate address line 2 (Compulsory Field)

// This regex checks for a string that is at least 10 characters long and contains
// letters, numbers, and common address punctuation like spaces, commas, periods, and hyphens.
const addressLine2Regex = /^[a-zA-Z0-9\s,.'-]{10,}$/;

// A simple if/else is better for a compulsory field.
// This single condition checks if the input is either too short, empty, or contains invalid characters.
if (!addressLine2Regex.test(addressLine2)) {
  document.getElementById("address-line-2-error").textContent = "Please enter a valid address (at least 10 characters).";
  document.getElementById("address-line-2").classList.remove("is-valid"); // Ensure is-valid is removed on failure
  document.getElementById("address-line-2").classList.add("is-invalid");
  return false;
}
// This block runs only if the validation is successful.
else {
  document.getElementById("address-line-2-error").textContent = ""; // Clear any previous error message
  document.getElementById("address-line-2").classList.remove("is-invalid");
  document.getElementById("address-line-2").classList.add("is-valid");
}
  // Define the new, more flexible regex for names (cities, states, etc.)
// This regex supports letters, including international ones, plus common separators like hyphens, periods, spaces, and apostrophes.
const nameRegex = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;

// --- Your existing code with the new logic integrated ---

// Validate city
if (!nameRegex.test(city) || city.length < 6) { // Using the new regex and adding a sensible minimum length
  document.getElementById("city-error").textContent = "Please enter a valid city name (at least 6 characters).";
  document.getElementById("city").classList.remove("is-valid"); // Good practice to remove the opposite class
  document.getElementById("city").classList.add("is-invalid");
  return false;
} else {
  document.getElementById("city-error").textContent = ""; // Clear error message on success
  document.getElementById("city").classList.remove("is-invalid");
  document.getElementById("city").classList.add("is-valid");
}

// Validate state
if (!nameRegex.test(state) || state.length < 3) { // Using the same new regex and minimum length
  document.getElementById("state-error").textContent = "Please enter a valid state name (at least 3 characters).";
  document.getElementById("state").classList.remove("is-valid"); // Good practice to remove the opposite class
  document.getElementById("state").classList.add("is-invalid");
  return false;
} else {
  document.getElementById("state-error").textContent = ""; // Clear error message on success
  document.getElementById("state").classList.remove("is-invalid");
  document.getElementById("state").classList.add("is-valid");
}

// Validate zip
  const zipRegex = /^[1-9][0-9]{5}$/;
  if (!zipRegex.test(zip) || zip.length < 6) {
    document.getElementById("zip-error").textContent = "Zip code should be exactly 6 digits.";
    document.getElementById("zip").classList.add("is-invalid");
    return false;
  } else {
    document.getElementById("zip").classList.remove("is-invalid");
    document.getElementById("zip").classList.add("is-valid");
  }  
  return true;
}

function checkValidationStatus() {
  const isValid = validateCustomerInfo();
  const continueButton = document.getElementById("continue-to-payment");
  if (isValid) {
    continueButton.disabled = false;
    
    verifyBtn.disabled = false;
    payUpiBtn.disabled = false;
    upiError.textContent = "";
    payCardBtn.disabled = false;
    cardpay.disabled=false;
    upipay.disabled=false;
    checkValidationStatus();
  } else {
    continueButton.disabled = true;
    cardpay.disabled=true;
    upipay.disabled=true;
    checkValidationStatus();
  }
}

// Call this function on input change
document.getElementById("customer-form").addEventListener("input", checkValidationStatus);



// function updateTotalDisplay(total) {
//     const formattedTotal = `₹${total.toFixed(2)}`;

//     // Update the order summary total
//     document.getElementById("total").textContent = formattedTotal;

//     // Update the Card payment button's text
//     const cardPayButton = document.getElementById("proceed-and-pay");
//     if (cardPayButton) {
//         cardPayButton.textContent = `Pay ${formattedTotal}`;
//     }

//     // Update the UPI payment button's text
//     const upiPayButton = document.getElementById("proceed-and-pay-upi");
//     if (upiPayButton) {
//         upiPayButton.textContent = `Pay ${formattedTotal}`;
//     }
// }


// ---- Credit Card Validation (Luhn Algorithm) ----
function isValidCardNumber(number) {
  number = number.replace(/\s+/g, ""); // remove spaces
  if (!/^\d{13,16}$/.test(number)) return false;

  let sum = 0;
  let shouldDouble = false;

  // Loop from rightmost digit
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9; // same as sum of two digits
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  // Check starting prefix for Visa(4), Master(5), Amex(37), Discover(6)
  const prefix = number.substring(0, 2);
  const firstDigit = number.charAt(0);

  const validPrefix =
    firstDigit === "4" || // Visa
    firstDigit === "5" || // Mastercard
    prefix === "37" || // American Express
    firstDigit === "6"; // Discover

  return sum % 10 === 0 && validPrefix;
}

// ---- CVV Validation ----
function isValidCVV(cvv) {
  return /^[0-9]{3,4}$/.test(cvv);
}

// ---- Attach Listeners ----
const cardNumberInput = document.getElementById("card-number");
const cvvInput = document.getElementById("cvv");
const payCardBtn = document.getElementById("proceed-and-pay");

function validateCardForm() {
  const cardNumber = cardNumberInput.value.trim();
  const cvv = cvvInput.value.trim();

  if (isValidCardNumber(cardNumber) && isValidCVV(cvv)) {
    payCardBtn.disabled = false;
  } else {
    payCardBtn.disabled = true;
  }
}


// Run validation on input
cardNumberInput.addEventListener("input", validateCardForm);
cvvInput.addEventListener("input", validateCardForm);

// Initially disable Pay button
payCardBtn.disabled = true;



function placeOrder(paymentMethod) {
  // ✅ Get total safely
  let total = 0;
  const totalElement = document.querySelector("#total");
  if (totalElement) {
    total = totalElement.textContent.replace("₹", "").trim();
  }

  // ✅ Fallback if total missing
  if (!total || isNaN(total)) {
    total = getCurrentTotal ? getCurrentTotal() : 0;
  }

  // ✅ Create order object
  const orderData = {
    number: "ORD" + Math.floor(Math.random() * 100000),
    total: total,
    method: paymentMethod,
    date: new Date().toLocaleDateString()
  };

  // ✅ Save to localStorage
  localStorage.setItem("order", JSON.stringify(orderData));

  // ✅ Clear cart
  localStorage.removeItem("cart");

  // ✅ Redirect
  window.location.href = "confirmation.html";
}

// 🔹 UPI Payment Redirect
if (payUpiBtn) {
  payUpiBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!payUpiBtn.disabled) {
      placeOrder("UPI");
    }
  });
}

// 🔹 Card Payment Redirect
if (payCardBtn) {
  payCardBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!payCardBtn.disabled) {
      placeOrder("Card");
    }
  });
}





// ---- Redirect to confirmation.html after successful payment ----

// UPI Payment Redirect
// payUpiBtn.addEventListener("click", (e) => {
//   e.preventDefault(); // prevent form submit/reload
//   if (!payUpiBtn.disabled) {
//     window.location.href = "http://127.0.0.1:5500/confirmation.html";
//   }
// });

// // Card Payment Redirect
// payCardBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   if (!payCardBtn.disabled) {
//     window.location.href = "http://127.0.0.1:5500/confirmation.html";
//   }
// });


// function saveOrderAndRedirect(paymentMethod) {
//   const total = getCurrentTotal();  // your existing function
//   const orderNumber = "ORD" + Date.now(); // simple unique order number
//   const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

//   const orderData = {
//     number: orderNumber,
//     total: total,
//     items: cartItems,
//     method: paymentMethod
//   };

//   // Save order to localStorage
//   localStorage.setItem("order", JSON.stringify(orderData));

//   // Clear cart since it's bought
//   localStorage.removeItem("cart");

//   // Redirect
//   window.location.href = "confirmation.html";
// }

// // Attach to card button
// document.getElementById("proceed-and-pay").addEventListener("click", () => {
//   if (validateCustomerInfo() && validateCardForm()) {
//     saveOrderAndRedirect("Card");
//   }
// });

// // Attach to UPI button
// document.getElementById("proceed-and-pay-upi").addEventListener("click", () => {
//   if (validateCustomerInfo()) {
//     saveOrderAndRedirect("UPI");
//   }
// });
