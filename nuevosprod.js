
//datos airtable
const AIRTABLE_BASE_ID = "appRr5pVrwkvLrA5M";

const AIRTABLE_TABLE_NAME = "tblEAfXgBb8OhTmpq";  

// la url en cuestion
const AIRTABLE_URL =
  "https://api.airtable.com/v0/" +
  AIRTABLE_BASE_ID +
  "/" +
  encodeURIComponent(AIRTABLE_TABLE_NAME);

const PRODUCT_CONTAINER_ID = "lista-productos";

//token 

function getToken() {
  return localStorage.getItem("AIRTABLE_TOKEN") || "";
}

function guardarTokenAirtable() {
  const input = document.getElementById("tokenInput");
  const token = (input?.value || "").trim();

  if (!token) {
    alert("Pegá un token válido.");
    return;
  }

  localStorage.setItem("AIRTABLE_TOKEN", token);
  input.value = "";
  actualizarEstadoToken();
  alert("Token guardado. Ahora recargá la página.");
  cargarProductosDesdeAirtable();
}

function borrarTokenAirtable() {
  localStorage.removeItem("AIRTABLE_TOKEN");
  actualizarEstadoToken();
  alert("Token borrado del navegador.");
  const cont = document.getElementById(PRODUCT_CONTAINER_ID);
  if (cont) cont.innerHTML = "";
}

function actualizarEstadoToken() {
  const statusEl = document.getElementById("tokenStatus");
  const token = getToken();
  if (!statusEl) return;

  if (token) {
    const masked =
      token.slice(0, 3) + "..." + token.slice(-3);
    statusEl.textContent = "Token guardado: " + masked;
  } else {
    statusEl.textContent =
      "No hay token guardado. Cargalo arriba.";
  }
}



//Llamada a Airtable


function mostrarMensajeError(msg) {
  console.error(msg);
  const cont = document.getElementById(PRODUCT_CONTAINER_ID);
  if (cont) cont.innerHTML = `<p class="error">${msg}</p>`;
}

async function cargarProductosDesdeAirtable() {
  const token = getToken();

  if (!token) {
    mostrarMensajeError("No hay token. Cargalo arriba.");
    return;
  }

  console.log("URL usada:", AIRTABLE_URL);

  try {
    const resp = await fetch(AIRTABLE_URL, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    console.log("Status:", resp.status);

    if (!resp.ok) {
      const txt = await resp.text();
      console.error("Respuesta de Airtable:", txt);
      throw new Error(resp.status);
    }

    const data = await resp.json();
    renderizarProductos(data.records || []);

  } catch (err) {
    mostrarMensajeError("Error al cargar los productos. Revisá base, tabla o token.");
  }
}

// El Render

function renderizarProductos(records) {
  const cont = document.getElementById(PRODUCT_CONTAINER_ID);
  if (!cont) return;

  if (!records.length) {
    cont.innerHTML = "<p>No hay productos para mostrar.</p>";
    return;
  }

  const html = records
    .map((record) => {
      const f = record.fields || {};
      const nombre = f.Nombre || "Sin nombre";
      const precioNumero = f.Precio || 0;
      const precioTexto = precioNumero ? precioNumero + " $" : "";
      const descripcion = f.Descripcion || f.Descripción || "";
      const imagenUrl = f.Imagen?.[0]?.url || "";
      const categoria = f.Categoria || "";

      return `
        <article class="product-card"
          data-name="${nombre}"
          data-price="${precioNumero}"
          data-category="${categoria.toLowerCase()}"
        >
          ${imagenUrl ? `<img src="${imagenUrl}" alt="${nombre}">` : ""}

          <h3>${nombre}</h3>
          ${precioTexto ? `<p><strong>Precio:</strong> ${precioTexto}</p>` : ""}
          ${descripcion ? `<p>${descripcion}</p>` : ""}

          <button class="btn-add-cart">Agregar al carrito</button>
        </article>
      `;
    })
    .join("");

  cont.innerHTML = html;

  // para conectar lo que viene de airtable 
  if (typeof window.registerProductCard === "function") {
    cont.querySelectorAll(".product-card").forEach((card) => {
      window.registerProductCard(card);
    });
  } else {
    console.warn("registerProductCard no existe: revisá que app.js se cargue antes que nuevosprod.js");
  }
}