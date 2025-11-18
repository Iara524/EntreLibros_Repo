document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = "cart";

  const cartList = document.getElementById("cart-list");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const btnClear = document.getElementById("btn-clear-cart");

  function getCart() {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function renderCart() {
    const cart = getCart();

    cartList.innerHTML = "";

    cart.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} x${item.quantity} - $${item.price * item.quantity}
        <button data-index="${index}" class="btn-remove">X</button>
      `;
      cartList.appendChild(li);
    });

    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.innerText = count;

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartTotal.innerText = `$${total}`;

    // eventos de borrar
    document.querySelectorAll(".btn-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = Number(btn.dataset.index);
        const cartNow = getCart();
        cartNow.splice(index, 1);
        saveCart(cartNow);
        renderCart();
      });
    });
  }

  // Vaciar carrito
  btnClear.addEventListener("click", () => {
    localStorage.removeItem(CART_KEY);
    renderCart();
  });

  renderCart();
});
