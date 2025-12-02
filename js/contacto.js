
//datos airtable 
const AIRTABLE_TOKEN = AIRTABLE_CONFIG.TOKEN;
const AIRTABLE_BASE_ID = AIRTABLE_CONFIG.BASE_ID;
const AIRTABLE_CONTACT_TABLE = AIRTABLE_CONFIG.CONSULTAS_TABLE;

const AIRTABLE_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;


document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact-form");
  let statusMsg = document.getElementById("form-status");

  if (!form) return;

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
      statusMsg.textContent = "Completa todos los campos.";
      statusMsg.style.color = "red";
      return;
    }

    statusMsg.textContent = "Enviando...";
    statusMsg.style.color = "black";

    try {
      const res = await fetch(`${AIRTABLE_BASE_URL}/${AIRTABLE_CONTACT_TABLE}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            Nombre: nombre,
            Email: correo,
            Asunto: asunto,
            Mensaje: mensaje
          }
        })
      });

      const data = await res.json();
      console.log("Airtable:", data);

      if (res.ok) {
        statusMsg.textContent = "Mensaje enviado ✅";
        statusMsg.style.color = "green";
        form.reset();
      } else {
        statusMsg.textContent = "Error al enviar ❌";
        statusMsg.style.color = "red";
      }

    } catch (err) {
      console.error(err);
      statusMsg.textContent = "Error de conexión ❌";
      statusMsg.style.color = "red";
    }
  });
});

