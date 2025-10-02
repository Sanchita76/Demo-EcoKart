document.addEventListener("DOMContentLoaded", () => {
    const order = JSON.parse(localStorage.getItem("order") || "{}");
    const container = document.getElementById("confirmation-container");


    if (!order.number) {
  container.innerHTML = "<p>No order found.</p>";
  return;
}

let itemsHTML = "";
if (order.items && order.items.length > 0) {
  itemsHTML = `
    <h4>Items:</h4>
    <ul>
      ${order.items.map(item => `<li>${item.name} - ₹${item.price} × ${item.quantity}</li>`).join("")}
    </ul>
  `;
}

container.innerHTML = `
  <h2 style="color:pink"><i>Your order has been successfully placed! We'll send you an email with the order details.</i></h2><br>
  <p <label style="color: green;font-size:24px">Order Number: </label><span style="color:brown"><strong>${order.number}</strong></span></p>
  <p <label style="color: green;font-size:24px">Total: </label><span style="color:brown"><strong>₹${order.total}</strong></span></p>
  ${itemsHTML}
  <p <label style="color: green;font-size:24px">Estimated Delivery: </label><span style="color:brown"><strong>${new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString()}</strong></span></p>
  <a href="index.html" class="btn btn-primary mt-3">Continue Shopping</a>
`;

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

});
