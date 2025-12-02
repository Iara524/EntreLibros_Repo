//config airtable 

const AIRTABLE_TOKEN = AIRTABLE_CONFIG.TOKEN;
const AIRTABLE_BASE_ID = AIRTABLE_CONFIG.BASE_ID;
const AIRTABLE_PRODUCTS_TABLE = AIRTABLE_CONFIG.PRODUCTS_TABLE;
const AIRTABLE_CONSULTAS_TABLE = AIRTABLE_CONFIG.CONSULTAS_TABLE;

const AIRTABLE_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;


// Guardo los productos en localStorage
function guardarProductosEnLocalStorage(productos) {
  localStorage.setItem('productos', JSON.stringify(productos));
}

// Leo productos de localStorage 
function obtenerProductosDeLocalStorage() {
  const datos = localStorage.getItem('productos');
  if (!datos) return [];    //si no hay nada 
  try {
    return JSON.parse(datos);
  } catch (e) {
    console.error('Error al parsear productos de localStorage', e);
    return [];
  }
}

// Guarda el último formulario enviado
function guardarUltimoContactoEnLocalStorage(contacto) {
  localStorage.setItem('ultimoContacto', JSON.stringify(contacto));
}

// Carga el último contacto (si existe) y rellena el form
function rellenarFormularioConUltimoContacto() {
  const datos = localStorage.getItem('ultimoContacto');
  if (!datos) return;

  try {
    const contacto = JSON.parse(datos);
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const asuntoInput = document.getElementById('asunto');
    const mensajeInput = document.getElementById('mensaje');

    if (nombreInput && contacto.nombre) nombreInput.value = contacto.nombre;
    if (emailInput && contacto.email) emailInput.value = contacto.email;
    if (asuntoInput && contacto.asunto) asuntoInput.value = contacto.asunto;
    if (mensajeInput && contacto.mensaje) mensajeInput.value = contacto.mensaje;
  } catch (e) {
    console.error('Error al parsear ultimoContacto', e);
  }
}

// las cards para el carrito 
const CART_KEY = "cart";

document.getElementById("lista-productos")
  .addEventListener("click", function (event) {

    if (event.target.classList.contains("btn-agregar-carrito")) {

      const boton = event.target;

      const producto = {
        name: boton.dataset.name,
        price: Number(boton.dataset.price),
        quantity: 1
      };

      agregarAlCarrito(producto);
    }
});

function agregarAlCarrito(producto) {
  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

  const existente = cart.find(p => p.name === producto.name);

  if (existente) {
    existente.quantity += 1;
  } else {
    cart.push(producto);
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  alert("Producto agregado al carrito");
}


//busco los productos GET 
// Pinta los productos en el DOM
function mostrarProductosEnPantalla(productos) {
  const contenedor = document.getElementById("lista-productos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  productos.forEach((record) => {
    const fields = record.fields || {};

    const nombre = fields.NombreProducto;
    const categoria = fields.Categoria;
    const descripcion = fields.Descripcion;
    const precio = fields.Precio;

    let imagenUrl = "";
    if (Array.isArray(fields.Imagen) && fields.Imagen.length > 0) {
      imagenUrl = fields.Imagen[0].url;
    }

    const card = document.createElement("article");
    card.classList.add("producto-card");

    card.innerHTML = `
      <div class="card-img">
        ${imagenUrl ? `<img src="${imagenUrl}" alt="${nombre}">` : ""}
      </div>

      <div class="card-body">
        <h3 class="card-title">${nombre}</h3>
        <p class="card-category">${categoria}</p>
        <p class="card-description">${descripcion}</p>
        <p class="card-price">$${precio}</p>

        <button 
          class="btn-agregar-carrito"
          data-name="${nombre}"
          data-price="${precio}">
          Agregar al carrito
        </button>
      </div>
    `;

    contenedor.appendChild(card);
  });
}



// Hace el fetch a Airtable para traer libros
async function obtenerProductosDesdeAirtable() {
  const url = `${AIRTABLE_BASE_URL}/${encodeURIComponent(AIRTABLE_PRODUCTS_TABLE)}`;

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
    },
  });

  if (!resp.ok) {
    throw new Error('Error HTTP al obtener productos: ' + resp.status);
  }

  const data = await resp.json();
  // data.records es un array de registros
  return data.records || [];
}

// Lógica combinada: primero muestra lo que haya en localStorage y luego actualiza con Airtable
async function cargarProductos() {
  // 1) Mostrar lo que tengamos en localStorage (dinámico pero cacheado)
  const productosGuardados = obtenerProductosDeLocalStorage();
  if (productosGuardados.length > 0) {
    mostrarProductosEnPantalla(productosGuardados);
  }

  // 2) Hacer fetch real a Airtable para tener datos frescos
  try {
    const productosDesdeAPI = await obtenerProductosDesdeAirtable();
    // Mostrar en pantalla
    mostrarProductosEnPantalla(productosDesdeAPI);
    // Guardar en localStorage para futuros loads
    guardarProductosEnLocalStorage(productosDesdeAPI);
  } catch (error) {
    console.error('Error al cargar productos desde Airtable:', error);
    // Si no hay nada en localStorage y falla la API
    if (productosGuardados.length === 0) {
      const contenedor = document.getElementById('lista-productos');
      if (contenedor) {
        contenedor.innerHTML = '<p>Error al cargar los productos.</p>';
      }
    }
  }
}


// ENVIAR CONSULTA (POST)

async function enviarConsultaAirtable(contacto) {
  const url = `${AIRTABLE_BASE_URL}/${encodeURIComponent(AIRTABLE_CONSULTAS_TABLE)}`;

  const bodyData = {
    records: [
      {
        fields: {
          Nombre: contacto.nombre,
          Email: contacto.email,
          Asunto: contacto.asunto,
          Mensaje: contacto.mensaje,
        },
      },
    ],
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  });

  if (!resp.ok) {
    throw new Error('Error HTTP al enviar consulta: ' + resp.status);
  }

  const data = await resp.json();
  return data;
}

// Maneja el submit del formulario
function manejarSubmitFormulario(event) {
  event.preventDefault();

  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const asuntoInput = document.getElementById('asunto');
  const mensajeInput = document.getElementById('mensaje');
  const estadoForm = document.getElementById('estado-form');

  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();
  const asunto = asuntoInput.value.trim();
  const mensaje = mensajeInput.value.trim();

  if (!nombre || !email || !asunto || !mensaje) {
    if (estadoForm) estadoForm.textContent = 'Por favor, completa todos los campos.';
    return;
  }

  const contacto = { nombre, email, asunto, mensaje };

  // Guardar en localStorage el último contacto
  guardarUltimoContactoEnLocalStorage(contacto);

  if (estadoForm) estadoForm.textContent = 'Enviando...';

  enviarConsultaAirtable(contacto)
    .then((data) => {
      console.log('Respuesta Airtable consultas:', data);
      if (estadoForm) estadoForm.textContent = 'Consulta enviada con éxito. ¡Gracias!';
      // Podrías limpiar el formulario si querés:
      // nombreInput.value = '';
      // emailInput.value = '';
      // asuntoInput.value = '';
      // mensajeInput.value = '';
    })
    .catch((error) => {
      console.error('Error al enviar consulta:', error);
      if (estadoForm) estadoForm.textContent = 'Error al enviar la consulta. Intenta de nuevo más tarde.';
    });
}

// =======================
// INICIALIZACIÓN
// =======================
window.addEventListener('DOMContentLoaded', () => {
  // 1) Rellenar form con último contacto (localStorage)
  rellenarFormularioConUltimoContacto();

  // 2) Cargar productos (localStorage + fetch)
  cargarProductos();

  // 3) Asignar evento al form
  const form = document.getElementById('form-contacto');
  if (form) {
    form.addEventListener('submit', manejarSubmitFormulario);
  }
});

