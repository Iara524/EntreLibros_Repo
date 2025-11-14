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
