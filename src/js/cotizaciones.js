//Carga todo el contenido HTML antes de que se ejecute el script 
document.addEventListener('DOMContentLoaded', function initCotizaciones() {

  //Elementos del formulario 
  const formulario = document.querySelector('.cotizaciones__formulario');
  const botonCalcular = document.querySelector('.cotizaciones__boton');
  const resultadoContenedor = document.querySelector('.cotizaciones__resultado');
  const selectOrigen = document.getElementById('origen');
  const selectDestino = document.getElementById('destino');
  const fechaIdaInput = document.getElementById('fecha-ida');

  //si no existe el elemento, detiene la ejecucion para evitar errores 
  if (!formulario || !botonCalcular || !resultadoContenedor || !selectOrigen || !selectDestino) return;

  //Empresas disponibles de la terminal
  const empresas = [
    {
      nombre: 'Cootranshuila',
      tipo: 'Bus',
      duracion: '6h 30min',
      amenidades: ['Asientos extra amplios', 'Wifi a bordo', 'Toma de corriente', 'Snacks incluidos', 'Aire acondicionado', 'Baño'],
      multiplicador: 1.00
    },
    {
      nombre: 'Coomotor Huila',
      tipo: 'Bus',
      duracion: '6h 15min',
      amenidades: ['Asientos extra amplios', 'Wifi a bordo', 'Toma de corriente', 'Snacks incluidos', 'Aire acondicionado', 'Baño'],
      multiplicador: 1.15
    },
    {
      nombre: 'Taxis Verdes',
      tipo: 'Buseta',
      duracion: '7h 00min',
      amenidades: ['Asientos extra amplios', 'Wifi a bordo', 'Toma de corriente', 'Snacks incluidos', 'Aire acondicionado', 'Baño'],
      multiplicador: 1.10
    },
    {
      nombre: 'Express Bolivariano',
      tipo: 'Van Express',
      duracion: '6h 00min',
      amenidades: ['Asientos extra amplios', 'Wifi a bordo', 'Toma de corriente', 'Snacks incluidos', 'Aire acondicionado', 'Baño'],
      multiplicador: 1.20
    },
    {
      nombre: 'Expreso Palmira',
      tipo: 'Bus',
      duracion: '7h 15min',
      amenidades: ['Asientos extra amplios', 'Wifi a bordo', 'Toma de corriente', 'Snacks incluidos', 'Aire acondicionado', 'Baño'],
      multiplicador: 1.00
    },

    {
      nombre: 'Velotax',
      tipo: 'Bus',
      duracion: '7h 15min',
      amenidades: ['Asientos extra amplios', 'Wifi a bordo', 'Toma de corriente', 'Snacks incluidos', 'Aire acondicionado', 'Baño'],
      multiplicador: 1.00
    }
  ];

  //precio de los servicios
  const preciosPorServicio = {
    economico: 40000,
    ejecutivo: 52000,
    premium: 68000
  };

  //mensaje inicial antes de la cotización
  function renderMensajeInicial() {
    resultadoContenedor.innerHTML =
      '<p class="cotizaciones__resultado-texto">Completa los datos y haz clic en <strong>Cotizar ahora</strong> para ver un valor estimado de tu viaje.</p>';
  }

  //Trae los select de origen y destino (MySQL vía PHP o respaldo JSON)
  function poblarCiudades(ciudades) {
    selectOrigen.innerHTML = '<option value="">Selecciona ciudad de origen</option>';
    selectDestino.innerHTML = '<option value="">Selecciona ciudad de destino</option>';
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

  // Convierte la fecha seleccionada mas legible
  function formatearFecha(fecha) {
    if (!fecha) return 'Sin definir';

    const fechaObj = new Date(`${fecha}T00:00:00`);
    return fechaObj.toLocaleDateString('es-CO', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  //Genera el item de cada empresa con sus detalles
  function generarTarjetas(origenTexto, destinoTexto, fechaTexto, pasajeros, servicio) {
    const precioBase = preciosPorServicio[servicio];

    return empresas.map((empresa) => {
      const precioPorPersona = Math.round(precioBase * empresa.multiplicador);
      const total = precioPorPersona * pasajeros;

      const amenidadesHTML = empresa.amenidades
        .map((item) => `<span>ⓘ ${item}</span>`)
        .join('');

      //items generados al dar "cotizar"
      return `
        <article class="cotizaciones__opcion">
          <div class="cotizaciones__empresa">
            <div class="cotizaciones__empresa-top">
              <h3 class="cotizaciones__empresa-nombre">${empresa.nombre}</h3>
              <span class="cotizaciones__badge">${empresa.tipo}</span>
            </div>

            <div class="cotizaciones__meta">
              Duración del viaje<br>
              <strong>${empresa.duracion}</strong>
            </div>

            <div class="cotizaciones__amenidades">
              ${amenidadesHTML}
            </div>
          </div>

          <div class="cotizaciones__dato">
            Precio por persona
            <strong>$ ${precioPorPersona.toLocaleString('es-CO')}</strong>
          </div>

          <div class="cotizaciones__dato">
            Total ${pasajeros} pasajero${pasajeros > 1 ? 's' : ''}
            <strong>$ ${total.toLocaleString('es-CO')}</strong>
          </div>

          <div class="cotizaciones__precio">
            <span class="cotizaciones__precio-label">Precio total</span>
            <span class="cotizaciones__precio-valor">$ ${total.toLocaleString('es-CO')}</span>
            <span class="cotizaciones__precio-detalle">${pasajeros} pasajero${pasajeros > 1 ? 's' : ''} • Solo ida</span>

            <div class="cotizaciones__acciones">
              <button type="button" class="cotizaciones__boton-opcion">Reservar Ahora</button>
              <a href="#" class="cotizaciones__ver">Ver detalles</a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  async function guardarCotizacionEnApi() {
    const origen = formulario.querySelector('#origen').value;
    const destino = formulario.querySelector('#destino').value;
    const pasajeros = parseInt(formulario.querySelector('#pasajeros').value, 10) || 0;
    const servicio = formulario.querySelector('#servicio').value;
    const fechaIda = fechaIdaInput.value;
    const fechaRegresoInput = document.getElementById('fecha-regreso');
    const fechaRegreso = fechaRegresoInput && fechaRegresoInput.value ? fechaRegresoInput.value : null;
    const origenTexto = formulario.querySelector('#origen option:checked')?.textContent?.trim() || '';
    const destinoTexto = formulario.querySelector('#destino option:checked')?.textContent?.trim() || '';

    if (!origen || !destino || !servicio || pasajeros <= 0 || !fechaIda) {
      window.alert('Completa el formulario antes de guardar la cotización.');
      return;
    }

    const body = {
      origen: origenTexto || origen,
      destino: destinoTexto || destino,
      fecha_ida: fechaIda,
      fecha_regreso: fechaRegreso,
      pasajeros,
      servicio
    };

    try {
      const res = await fetch('api/cotizaciones.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const j = await res.json();
      if (!j.ok) {
        throw new Error(j.error || 'No se pudo guardar');
      }
      window.alert(
        `Cotización registrada en la base de datos (id ${j.id}). Total calculado en servidor: $ ${Number(j.calculo.total).toLocaleString('es-CO')}`
      );
    } catch (e) {
      window.alert(
        'No se pudo conectar con el servidor PHP/MySQL. Verifica XAMPP, la base `terminal` y api/config.php.\n' +
          (e && e.message ? e.message : '')
      );
    }
  }

  // Ciudades: API MySQL primero; si falla, JSON local
  fetch('api/ciudades.php')
    .then((response) => (response.ok ? response.json() : Promise.reject()))
    .then((payload) => {
      if (payload && payload.ok && Array.isArray(payload.data)) {
        poblarCiudades(payload.data);
      } else {
        throw new Error('payload');
      }
    })
    .catch(() => {
      fetch('src/data/ciudades-colombia.json')
        .then((response) => response.json())
        .then((ciudades) => poblarCiudades(ciudades))
        .catch(() => {});
    });

  resultadoContenedor.addEventListener('click', (e) => {
    const btn = e.target.closest('#guardarCotizacionApi');
    if (btn) {
      e.preventDefault();
      guardarCotizacionEnApi();
    }
  });

    //Evento que se ejecuta al hacer clic en el botón de cotizar
  botonCalcular.addEventListener('click', function () {

    //obtiene los valores utilizados por el usuario
    const origen = formulario.querySelector('#origen').value;
    const destino = formulario.querySelector('#destino').value;
    const pasajerosInput = formulario.querySelector('#pasajeros');
    const pasajeros = parseInt(pasajerosInput.value, 10) || 0;
    const servicio = formulario.querySelector('#servicio').value;
    const fechaIda = fechaIdaInput.value;

    //verifica que los campos esten completos
    if (!origen || !destino || !servicio || pasajeros <= 0 || !fechaIda) {
      resultadoContenedor.innerHTML = '<p class="cotizaciones__resultado-texto">Por favor completa origen, destino, fecha de salida, tipo de servicio y número de pasajeros para calcular la cotización.</p>';
      return;
    }

    //no permite el ingreso mayor a 30 pasajeros
    if (pasajeros > 30) {
      resultadoContenedor.innerHTML = '<p class="cotizaciones__resultado-texto">El número máximo permitido es de 30 pasajeros.</p>';
      pasajerosInput.value = 30;
      return;
    }

    //valida que el origen y destino no sean iguales
    if (origen === destino) {
      resultadoContenedor.innerHTML = '<p class="cotizaciones__resultado-texto">El punto de origen y destino deben ser diferentes.</p>';
      return;
    }

    //Obtiene el texto visible de las opciones seleccionadas
    const origenTexto = formulario.querySelector('#origen option:checked').textContent;
    const destinoTexto = formulario.querySelector('#destino option:checked').textContent;
    const fechaTexto = formatearFecha(fechaIda);

    // Muestra el resumen del viaje
    resultadoContenedor.innerHTML = `
      <div class="cotizaciones__resumen">
        <h3 class="cotizaciones__resumen-titulo">Resumen de tu Viaje</h3>

        <div class="cotizaciones__resumen-grid">
          <div class="cotizaciones__resumen-item">
            <div class="cotizaciones__ruta">
              <span>${origenTexto}</span>
              <span class="cotizaciones__ruta-flecha">➜</span>
              <span>${destinoTexto}</span>
            </div>
          </div>

          <div class="cotizaciones__resumen-item">
            <strong>Salida:</strong> ${fechaTexto}
          </div>

          <div class="cotizaciones__resumen-item">
            <strong>Pasajeros:</strong> ${pasajeros}<br>
            <strong>Clase:</strong> ${servicio.charAt(0).toUpperCase() + servicio.slice(1)}
          </div>
        </div>
      </div>

      <h3 class="cotizaciones__bloque-titulo">Cotizaciones Disponibles</h3>
      <p class="cotizaciones__bloque-texto">Precios solo de ida para ${pasajeros} pasajero${pasajeros > 1 ? 's' : ''}</p>

      <div class="cotizaciones__lista">
        ${generarTarjetas(origenTexto, destinoTexto, fechaTexto, pasajeros, servicio)}
      </div>

      <p class="cotizaciones__resultado-texto" style="margin-top:1rem;">
        <button type="button" class="cotizaciones__boton" id="guardarCotizacionApi">Guardar cotización en base de datos</button>
      </p>

      <div class="cotizaciones__info-grid">
        <div class="cotizaciones__info-box cotizaciones__info-box--verde">
          <h4 class="cotizaciones__info-titulo">¿Por qué Cotizar con Nosotros?</h4>
          <ul class="cotizaciones__info-lista">
            <li>Compara todas las empresas en un solo lugar</li>
            <li>Precios actualizados en tiempo real</li>
            <li>Reserva garantizada sin comisiones ocultas</li>
            <li>Atención al cliente 24/7</li>
          </ul>
        </div>

        <div class="cotizaciones__info-box cotizaciones__info-box--amarillo">
          <h4 class="cotizaciones__info-titulo">Información Importante</h4>
          <ul class="cotizaciones__info-lista">
            <li>Los precios pueden variar según disponibilidad</li>
            <li>Se recomienda reservar con anticipación</li>
            <li>Reserva con anticipación para mejores tarifas</li>
            <li>Políticas de cambio y cancelación varían por empresa</li>
          </ul>
        </div>
      </div>
    `;
  });

  renderMensajeInicial();
});