// Bloque: cotizaciones
// Calcula tabla de precios

document.addEventListener('DOMContentLoaded', function initCotizaciones() {
  const formulario = document.querySelector('.cotizaciones__formulario');
  const botonCalcular = document.querySelector('.cotizaciones__boton');
  const resultadoContenedor = document.querySelector('.cotizaciones__resultado');
  const selectOrigen = document.getElementById('origen');
  const selectDestino = document.getElementById('destino');

  if (!formulario || !botonCalcular || !resultadoContenedor || !selectOrigen || !selectDestino) return;

  const preciosPorServicio = {
    economico: 40000,
    ejecutivo: 60000,
    premium: 80000,
  };

  function renderMensajeInicial() {
    resultadoContenedor.innerHTML =
      '<p class="cotizaciones__resultado-texto">Completa los datos y haz clic en <strong>Calcular cotización</strong> para ver un valor estimado de tu viaje.</p>';
  }

  function poblarCiudades(ciudades) {
    ciudades.forEach((ciudad) => {
      const optionOrigen = document.createElement('option');
      optionOrigen.value = ciudad.id;
      optionOrigen.textContent = ciudad.nombre;
      selectOrigen.appendChild(optionOrigen);

      const optionDestino = document.createElement('option');
      optionDestino.value = ciudad.id;
      optionDestino.textContent = ciudad.nombre;
      selectDestino.appendChild(optionDestino);
    });
  }

  // Cargar ciudades desde "base de datos" (archivo JSON)
  fetch('src/data/ciudades-colombia.json')
    .then((response) => response.json())
    .then((ciudades) => poblarCiudades(ciudades))
    .catch(() => {
      // Si falla la carga, se deja solo la opción por defecto
    });

  botonCalcular.addEventListener('click', function () {
    const origen = formulario.querySelector('#origen').value;
    const destino = formulario.querySelector('#destino').value;
    const pasajerosInput = formulario.querySelector('#pasajeros');
    const pasajeros = parseInt(pasajerosInput.value, 10) || 0;
    const servicio = formulario.querySelector('#servicio').value;

    if (!origen || !destino || !servicio || pasajeros <= 0) {
      resultadoContenedor.innerHTML = '<p class="cotizaciones__resultado-texto">Por favor completa origen, destino, tipo de servicio y número de pasajeros para calcular la cotización.</p>';
      return;
    }

    if (pasajeros > 30) {
      resultadoContenedor.innerHTML = '<p class="cotizaciones__resultado-texto">El número máximo permitido es de 30 pasajeros.</p>';
      pasajerosInput.value = 30;
      return;
    }

    if (origen === destino) {
      resultadoContenedor.innerHTML = '<p class="cotizaciones__resultado-texto">El punto de origen y destino deben ser diferentes.</p>';
      return;
    }

    const precioBase = preciosPorServicio[servicio];
    const total = precioBase * pasajeros;

    const etiquetaServicio = {
      economico: 'Económico',
      ejecutivo: 'Ejecutivo',
      premium: 'Premium',
    }[servicio];

    const htmlTabla = `
      <table class="cotizaciones__tabla">
        <thead>
          <tr>
            <th>Origen</th>
            <th>Destino</th>
            <th>Tipo de servicio</th>
            <th>Pasajeros</th>
            <th>Precio por pasajero</th>
            <th>Total estimado</th>
            <th>Empresa</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${formulario.querySelector('#origen option:checked').textContent}</td>
            <td>${formulario.querySelector('#destino option:checked').textContent}</td>
            <td>${etiquetaServicio}</td>
            <td>${pasajeros}</td>
            <td>$${precioBase.toLocaleString('es-CO')}</td>
            <td>$${total.toLocaleString('es-CO')}</td>
          </tr>
        </tbody>
      </table>
      <p class="cotizaciones__resultado-texto">Valores estimados en pesos colombianos (COP). El precio final puede variar según disponibilidad y temporada.</p>
      <button type="button" class="cotizaciones__boton cotizaciones__boton--secundario">
        Realizar nueva cotización
      </button>
    `;

    resultadoContenedor.innerHTML = htmlTabla;

    const botonNueva = resultadoContenedor.querySelector('.cotizaciones__boton--secundario');
    if (botonNueva) {
      botonNueva.addEventListener('click', function () {
        formulario.reset();
        renderMensajeInicial();
      });
    }
  });

  // Estado inicial del mensaje
  renderMensajeInicial();
});

