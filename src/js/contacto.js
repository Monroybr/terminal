// Bloque: contacto

//Limita en el campo de telefono el numero de caracteres

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

  // Mensaje de envío y validación del formulario
  if (formulario) {
    formulario.addEventListener('submit', function (event) {
      event.preventDefault();

      // Usa la validación nativa del navegador
      if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
      }

      // Envia  los datos a un backend con fetch/AJAX 
      alert('Tu mensaje ha sido enviado, pronto daremos respuesta a tu solicitud');
      formulario.reset();
    });
  }
});

