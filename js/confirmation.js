// document.addEventListener("DOMContentLoaded", () => {
//     const order = JSON.parse(localStorage.getItem("order") || "{}");
//     const container = document.getElementById("confirmation-container");


//     if (!order.number) {
//   container.innerHTML = "<p>No order found.</p>";
//   return;
// }

// let itemsHTML = "";
// if (order.items && order.items.length > 0) {
//   itemsHTML = `
//     <h4>Items:</h4>
//     <ul>
//       ${order.items.map(item => `<li>${item.name} - ₹${item.price} × ${item.quantity}</li>`).join("")}
//     </ul>
//   `;
// }

// container.innerHTML = `
//   <h2 style="color:pink"><i>Your order has been successfully placed! We'll send you an email with the order details.</i></h2><br>
//   <p <label style="color: green;font-size:24px">Order Number: </label><span style="color:brown"><strong>${order.number}</strong></span></p>
//   <p <label style="color: green;font-size:24px">Total: </label><span style="color:brown"><strong>₹${order.total}</strong></span></p>
//   ${itemsHTML}
//   <p <label style="color: green;font-size:24px">Estimated Delivery: </label><span style="color:brown"><strong>${new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString()}</strong></span></p>
//   <a href="index.html" class="btn btn-primary mt-3">Return to Home</a>
// `;

document.addEventListener("DOMContentLoaded", () => {
  const order = JSON.parse(localStorage.getItem("order") || "{}");
  const container = document.getElementById("confirmation-container");

  if (!order.number) {
    container.innerHTML = "<p>No order found.</p>";
    return;
  }

  // 🛍️ Build order items HTML
  let itemsHTML = "";
  if (order.items && order.items.length > 0) {
    itemsHTML = `
      <h4 style="margin-top: 20px; color: #0d6efd;">Items Purchased</h4>
      <table class="table table-bordered mt-3">
        <thead class="table-light">
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td><img src="${item.image}" width="60"></td>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>₹${item.price.toFixed(2)}</td>
              <td>₹${item.subtotal}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  // 🏠 Shipping Info
  const customerHTML = `
    <div style="margin-top: 20px;">
      <h4 style="color: #0d6efd;">Shipping Details</h4>
      <p><strong>Name:</strong> ${order.customer?.name || "N/A"}</p>
      <p><strong>Email:</strong> ${order.customer?.email || "N/A"}</p>
      <p><strong>Phone:</strong> ${order.customer?.phone || "N/A"}</p>
      <p><strong>Address:</strong> ${order.customer?.address || "N/A"}</p>
    </div>
  `;

  // // 💳 Payment Info
  const paymentHTML = `
    <div style="margin-top: 20px;">
      <h4 style="color: #0d6efd;">Payment Details</h4>
      <p><strong>Payment Method:</strong> ${order.method}</p>
      <p><strong>Total Billed:</strong> ₹${order.total}</p>
      <p><strong>Order Date:</strong> ${order.date}</p>
      <p><strong>Estimated Delivery:</strong> ${new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString()}</p>
    </div>
  `;


  // ✅ Final Layout
  container.innerHTML = `
    <div class="card p-4 shadow-lg">
      <h2 class="text-center" style="color:#28a745;">
        <i class="fa fa-check-circle"></i> Order Confirmed!
      </h2>
      <p class="text-center">Thank you for your purchase! A confirmation email will be sent to you shortly.</p>
      <hr>
      <p><strong>Order Number:</strong> <span style="color:brown;">${order.number}</span></p>
      ${itemsHTML}
      ${customerHTML}
      ${paymentHTML}
      <div class="text-center mt-4">
        <a href="index.html" class="btn btn-primary">Return to Home</a>
      </div>
    </div>
  `;
});


// Get the comment textarea and save button
const commentTextarea = document.getElementById('comment-textarea');
const saveCommentBtn = document.getElementById('save-comment-btn');
const commentSavedMsg = document.getElementById('comment-saved-msg');

// Add event listener to save button
saveCommentBtn.addEventListener('click', () => {
  const comment = commentTextarea.value.trim();
  if (comment) {
    // Save comment to local storage
    localStorage.setItem('comment', comment);
    commentSavedMsg.textContent = 'Comment saved successfully!';
    commentTextarea.value = '';
  } else {
    commentSavedMsg.textContent = 'Please type a comment.';
  }
});

// Check if there's a saved comment and display it
const savedComment = localStorage.getItem('comment');
if (savedComment) {
  commentTextarea.value = savedComment;
}else{
    alert("Nothing");
}

// });
