const AIRTABLE_BASE  = "appRr5pVrwkvLrA5M";   // tu base de Airtable
const AIRTABLE_TABLE = "Consultas";

const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`;

// Leemos SIEMPRE el token desde localStorage
function getAirtableToken() {
  return localStorage.getItem("AIRTABLE_TOKEN") || "";
}

// FORMULARIO
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  let statusMsg = document.getElementById("form-status");

  if (!form) {
    console.error("No se encontró el formulario .contact-form");
    return;
  }

  if (!statusMsg) {
    statusMsg = document.createElement("p");
    statusMsg.id = "form-status";
    statusMsg.style.marginTop = "10px";
    form.appendChild(statusMsg);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre  = document.getElementById("nombre").value.trim();
    const correo  = document.getElementById("email").value.trim();
    const asunto  = document.getElementById("asunto").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !correo || !asunto || !mensaje) {
      statusMsg.textContent = "Se deben completar todos los campos.";
      statusMsg.style.color = "red";
      return;
    }

    const token = getAirtableToken();
    if (!token) {
      statusMsg.textContent = "Falta el token de Airtable en este navegador. Cargalo primero (AIRTABLE_TOKEN en localStorage).";
      statusMsg.style.color = "red";
      return;
    }

    statusMsg.textContent = "Enviando...";
    statusMsg.style.color = "black";

    try {
      const res = await fetch(AIRTABLE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                Nombre: nombre,
                Email: correo,
                Asunto: asunto,
                Mensaje: mensaje
              }
            }
          ]
        })
      });

      const data = await res.json();
      console.log("Respuesta Airtable:", data);

      if (res.ok) {
        statusMsg.textContent = "¡Mensaje enviado correctamente! Responderemos en breve ✔";
        statusMsg.style.color = "green";
        form.reset();
      } else {
        statusMsg.textContent = "Hubo un error al enviar el mensaje.";
        statusMsg.style.color = "red";
      }
    } catch (err) {
      console.error("Error al llamar a Airtable:", err);
      statusMsg.textContent = "Error de conexión. Intenta de nuevo.";
      statusMsg.style.color = "red";
    }
  });
});



