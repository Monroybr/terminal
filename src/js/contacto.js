// Bloque: contacto

document.addEventListener('DOMContentLoaded', function initContacto() {
  const telefonoInput = document.querySelector('.contacto__input#telefono');
  const formulario = document.querySelector('.contacto__formulario');

  if (telefonoInput) {
    function limitarTelefono(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
      event.target.value = value;
    }

    telefonoInput.addEventListener('input', limitarTelefono);
  }

  if (formulario) {
    formulario.addEventListener('submit', async function (event) {
      event.preventDefault();

      if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
      }

      const boton = formulario.querySelector('.contacto__boton');
      const textoOriginal = boton.textContent;
      boton.disabled = true;
      boton.textContent = 'Enviando...';

      const datos = {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        asunto: document.getElementById('asunto').value.trim(),
        mensaje: document.getElementById('mensaje').value.trim(),
      };

      try {
        const respuesta = await fetch('api/contacto.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
        });

        const resultado = await respuesta.json();

        if (resultado.ok) {
          alert('Tu mensaje ha sido enviado, pronto daremos respuesta a tu solicitud.');
          formulario.reset();
        } else {
          alert(resultado.error || 'No se pudo enviar el mensaje. Inténtalo de nuevo.');
        }
      } catch (e) {
        alert('Error de conexión. Verifica tu internet e inténtalo de nuevo.');
      } finally {
        boton.disabled = false;
        boton.textContent = textoOriginal;
      }
    });
  }
});
