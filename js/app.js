document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = "cart";

  // --- Helpers de carrito en localStorage ---
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

  function addToCart(product) {
    let cart = getCart();

    const existing = cart.find(item => item.name === product.displayName);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        name: product.displayName,
        price: product.price,
        quantity: 1
      });
    }

    saveCart(cart);
    alert(`Agregado al carrito: ${product.displayName}`);
  }

  // --- Referencias del DOM ---
  const inputSearch    = document.getElementById("input-search-products");
  const categoryLinks  = document.querySelectorAll(".categoria-producto-filter"); // links del nav (si existen)
  const categorySelect = document.getElementById("category-filter");              // <select>
  const productContainer = document.querySelector(".product-container");

  // Todos los productos (estáticos + Airtable)
  let products = [];

  // --- Crear objeto producto desde una card ---
  function buildProductFromCard(card) {
    const obj = {
      element: card,
      name: (card.dataset.name || card.querySelector("h3")?.textContent || "")
              .trim()
              .toLowerCase(),
      displayName: card.dataset.name || card.querySelector("h3")?.textContent || "Producto",
      category: (card.dataset.category || "")
              .trim()
              .toLowerCase(),
      price: Number(card.dataset.price || 0)
    };

    const btn = card.querySelector(".btn-add-cart");
    if (btn) {
      btn.addEventListener("click", () => addToCart(obj));
    }

    products.push(obj);
  }

  // --- Tomar las cards estáticas que ya están en el HTML ---
  const initialCards = document.querySelectorAll(".product-card");
  initialCards.forEach(buildProductFromCard);

  // --- Función global para que nuevosprod.js registre cards de Airtable ---
  window.registerProductCard = function (card) {
    buildProductFromCard(card);
    renderProducts(products);
  };

  // --- Renderizar (mostrar/ocultar) ---
  function renderProducts(list) {
    products.forEach(p => p.element.style.display = "none");
    list.forEach(p => p.element.style.display = "block");
  }

  // --- Filtro por categoría ---
  function filterProductsByCategory(category) {
    const cat = (category || "").trim().toLowerCase();
    if (!cat || cat === "todos") return products;
    return products.filter(p => p.category === cat);
  }

  // --- Buscador por texto ---
  if (inputSearch) {
    inputSearch.addEventListener("keyup", () => {
      const term = inputSearch.value.toLowerCase();
      const filtered = products.filter(p => p.name.includes(term));
      renderProducts(filtered);
    });
  }

  // --- Click en categorías (links del nav, si los seguís usando) ---
  categoryLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const category = e.target.innerText.toLowerCase();
      const filtered = filterProductsByCategory(category);
      renderProducts(filtered);

      // opcional: mover también el select
      if (categorySelect) {
        categorySelect.value = category || "todos";
      }
    });
  });

  // --- Cambio en el select de categorías ---
  if (categorySelect) {
    categorySelect.addEventListener("change", () => {
      const value = categorySelect.value.toLowerCase();
      const filtered = filterProductsByCategory(value);
      renderProducts(filtered);
    });
  }

  // --- Mostrar todos al inicio ---
  renderProducts(products);
});

