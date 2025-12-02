import AIRTABLE_CONFIG from '../config.js';

//datos airtable 
const AIRTABLE_TOKEN = AIRTABLE_CONFIG.TOKEN;
const AIRTABLE_BASE_ID = AIRTABLE_CONFIG.BASE_ID;
const AIRTABLE_CONTACT_TABLE = AIRTABLE_CONFIG.TABLE_NAME;




document.addEventListener("DOMContentLoaded", function () {
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

  form.addEventListener("submit", async function (e) {
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

    try {
      const res = await fetch("/api/consultas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: nombre,
          correo: correo,
          asunto: asunto,
          mensaje: mensaje
        })
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data);

      if (res.ok) {
        statusMsg.textContent = "¡Mensaje enviado correctamente! Responderemos en breve ✔";
        statusMsg.style.color = "green";
        form.reset();
      } else {
        statusMsg.textContent = "Hubo un error al enviar el mensaje.";
        statusMsg.style.color = "red";
      }
    } catch (err) {
      console.error("Error al llamar al servidor:", err);
      statusMsg.textContent = "Error de conexión. Intenta de nuevo.";
      statusMsg.style.color = "red";
    }
  });
});



