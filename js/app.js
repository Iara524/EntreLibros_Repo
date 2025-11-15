// --- REFERENCIAS DEL DOM ---
const productsDom = document.querySelector(".product-container");
const inputSearch = document.getElementById("input-search-products");
const categoryLinks = document.querySelectorAll(".categoria-producto-filter");

const cartList = document.getElementById("cart-list");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

// --- ARMAR ARRAY DE PRODUCTOS DESDE EL DOM ---
const productCards = document.querySelectorAll(".product-card");

const products = [...productCards].map(card => ({
  element: card,
  name: card.dataset.name.toLowerCase(),
  displayName: card.dataset.name,
  category: card.dataset.category.toLowerCase(),
  price: Number(card.dataset.price)
}));

// --- RENDERIZAR PRODUCTOS (mostrar/ocultar) ---
function renderProducts(list) {
  products.forEach(p => {
    p.element.style.display = "none";
  });

  list.forEach(p => {
    p.element.style.display = "block";
  });
}

// --- FILTRO POR CATEGORÍA ---
function filterProductsByCategory(category) {
  if (category === "todos") return products;
  return products.filter(p => p.category === category);
}

// --- BUSCADOR ---
inputSearch.addEventListener("keyup", () => {
  const term = inputSearch.value.toLowerCase();
  const filtered = products.filter(p => p.name.includes(term));
  renderProducts(filtered);
});

// --- CLICK EN CATEGORÍAS ---
categoryLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const category = e.target.innerText.toLowerCase();
    const filtered = filterProductsByCategory(category);
    renderProducts(filtered);
  });
});

// --- 🛒 CARRITO ---
let cart = [];

// Agregar producto al carrito
function addToCart(product) {
  const existing = cart.find(item => item.name === product.name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name: product.displayName,
      price: product.price,
      quantity: 1
    });
  }

  renderCart();
}

// Dibujar el carrito en el DOM
function renderCart() {
  // limpiar lista
  cartList.innerHTML = "";

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `${item.name} x${item.quantity} - $${item.price * item.quantity}`;
    cartList.appendChild(li);
  });

  // cantidad total de productos
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.innerText = count;

  // total $
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  cartTotal.innerText = `$${total}`;
}

// --- BOTONES "AGREGAR AL CARRITO" ---
const addButtons = document.querySelectorAll(".btn-add-cart");

// Cada botón corresponde a la misma posición del producto
addButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const product = products[index];
    addToCart(product);
  });
});

// --- INICIO: mostrar todos los productos y carrito vacío ---
renderProducts(products);
renderCart();



document.addEventListener("DOMContentLoaded", () => {
  const productsDom = document.querySelector(".product-container");
  const inputSearch = document.getElementById("input-search-products");
  const categoryLinks = document.querySelectorAll(".categoria-producto-filter");

  // ⬅️ Extraer productos desde el DOM
  let products = [...document.querySelectorAll(".product-card")].map(card => ({
    element: card,
    name: card.dataset.name.toLowerCase(),
    category: card.dataset.category.toLowerCase(),
    price: card.dataset.price
  }));

  // --- Renderizado (solo oculta o muestra elementos existentes)
  function renderProducts(list) {
    products.forEach(p => p.element.style.display = "none");
    list.forEach(p => p.element.style.display = "block");
  }

  // --- Filtrar por categoría
  function filterProductsByCategory(category) {
    if (category === "todos") return products;
    return products.filter(p => p.category === category);
  }

  // --- Clic en categorías
  categoryLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const cat = e.target.innerText.toLowerCase();
      renderProducts(filterProductsByCategory(cat));
    });
  });

  // --- Buscador
  inputSearch.addEventListener("keyup", () => {
    const term = inputSearch.value.toLowerCase();
    const filtered = products.filter(p => p.name.includes(term));
    renderProducts(filtered);
  });

  // Mostrar todos inicialmente
  renderProducts(products);
});
