// Carga todo el contenido HTML antes de que se ejecute el script
document.addEventListener('DOMContentLoaded', function initCotizaciones() {
  // Elementos del formulario
  const formulario = document.querySelector('.cotizaciones__formulario');
  const botonCalcular = document.querySelector('.cotizaciones__boton');
  const resultadoContenedor = document.querySelector('.cotizaciones__resultado');
  const selectOrigen = document.getElementById('origen');
  const selectDestino = document.getElementById('destino');
  const fechaIdaInput = document.getElementById('fecha-ida');
  const fechaRegresoInput = document.getElementById('fecha-regreso');
  const pasajerosInput = document.getElementById('pasajeros');

  // Si no existe el elemento, detiene la ejecución para evitar errores
  if (
    !formulario ||
    !botonCalcular ||
    !resultadoContenedor ||
    !selectOrigen ||
    !selectDestino ||
    !fechaIdaInput ||
    !pasajerosInput
  ) {
    return;
  }

  const hoyIso = new Date().toISOString().split('T')[0];
  fechaIdaInput.min = hoyIso;
  if (fechaRegresoInput) {
    fechaRegresoInput.min = hoyIso;
  }

  function actualizarMinFechaRegreso() {
    if (!fechaRegresoInput) return;
    const minRegreso = fechaIdaInput.value && fechaIdaInput.value >= hoyIso ? fechaIdaInput.value : hoyIso;
    fechaRegresoInput.min = minRegreso;
    if (fechaRegresoInput.value && fechaRegresoInput.value < minRegreso) {
      fechaRegresoInput.value = '';
    }
  }

  fechaIdaInput.addEventListener('change', actualizarMinFechaRegreso);
  actualizarMinFechaRegreso();

  pasajerosInput.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 2) {
      valor = valor.slice(0, 2);
    }
    if (valor !== '' && Number(valor) > 30) {
      valor = '30';
    }
    e.target.value = valor;
  });

  pasajerosInput.addEventListener('blur', (e) => {
    if (e.target.value === '') return;
    const valor = Number(e.target.value);
    if (valor < 1) {
      e.target.value = '1';
    } else if (valor > 30) {
      e.target.value = '30';
    }
  });

  function mensajeValidacionFormulario() {
    const origen = selectOrigen.value;
    const destino = selectDestino.value;
    const servicio = formulario.querySelector('#servicio').value;
    const fechaIda = fechaIdaInput.value;
    const pasajeros = parseInt(pasajerosInput.value, 10);

    if (!origen || !destino || !servicio || !fechaIda || !pasajerosInput.value.trim()) {
      return 'Por favor completa origen, destino, fecha de salida, tipo de servicio y número de pasajeros.';
    }

    if (origen === destino) {
      return 'El punto de origen y destino deben ser diferentes.';
    }

    if (fechaIda < hoyIso) {
      return 'La fecha de salida no puede ser anterior a hoy.';
    }

    if (Number.isNaN(pasajeros) || pasajeros < 1 || pasajeros > 30) {
      return 'El número de pasajeros debe estar entre 1 y 30.';
    }

    if (fechaRegresoInput && fechaRegresoInput.value) {
      const minRegreso = fechaIda >= hoyIso ? fechaIda : hoyIso;
      if (fechaRegresoInput.value < minRegreso) {
        return 'La fecha de regreso debe ser igual o posterior a la fecha de salida.';
      }
    }

    return '';
  }

  // Empresas disponibles de la terminal
  const empresas = [
    {
      nombre: 'Cootranshuila',
      tipo: 'Bus',
      horario: '06:00 - 12:30',
      salida: '06:00',
      llegada: '12:30',
      duracion: '6h 30min',
      amenidades: [
        'Asientos extra amplios',
        'Wifi a bordo',
        'Toma de corriente',
        'Snacks incluidos',
        'Aire acondicionado',
        'Baño'
      ],
      multiplicador: 1.0
    },
    {
      nombre: 'Coomotor Huila',
      tipo: 'Bus',
      horario: '07:00 - 13:15',
      salida: '07:00',
      llegada: '13:15',
      duracion: '6h 15min',
      amenidades: [
        'Asientos extra amplios',
        'Wifi a bordo',
        'Toma de corriente',
        'Snacks incluidos',
        'Aire acondicionado',
        'Baño'
      ],
      multiplicador: 1.15
    },
    {
      nombre: 'Taxis Verdes',
      tipo: 'Buseta',
      horario: '08:00 - 15:00',
      salida: '08:00',
      llegada: '15:00',
      duracion: '7h 00min',
      amenidades: [
        'Asientos extra amplios',
        'Wifi a bordo',
        'Toma de corriente',
        'Snacks incluidos',
        'Aire acondicionado',
        'Baño'
      ],
      multiplicador: 1.1
    },
    {
      nombre: 'Express Bolivariano',
      tipo: 'Van Express',
      horario: '05:30 - 11:30',
      salida: '05:30',
      llegada: '11:30',
      duracion: '6h 00min',
      amenidades: [
        'Asientos extra amplios',
        'Wifi a bordo',
        'Toma de corriente',
        'Snacks incluidos',
        'Aire acondicionado',
        'Baño'
      ],
      multiplicador: 1.2
    },
    {
      nombre: 'Expreso Palmira',
      tipo: 'Bus',
      horario: '09:00 - 16:15',
      salida: '09:00',
      llegada: '16:15',
      duracion: '7h 15min',
      amenidades: [
        'Asientos extra amplios',
        'Wifi a bordo',
        'Toma de corriente',
        'Snacks incluidos',
        'Aire acondicionado',
        'Baño'
      ],
      multiplicador: 1.0
    },
    {
      nombre: 'Velotax',
      tipo: 'Bus',
      horario: '10:00 - 17:15',
      salida: '10:00',
      llegada: '17:15',
      duracion: '7h 15min',
      amenidades: [
        'Asientos extra amplios',
        'Wifi a bordo',
        'Toma de corriente',
        'Snacks incluidos',
        'Aire acondicionado',
        'Baño'
      ],
      multiplicador: 1.0
    }
  ];

  // Precio de los servicios
  const preciosPorServicio = {
    economico: 40000,
    ejecutivo: 52000,
    premium: 68000
  };

  // Mensaje inicial antes de la cotización
  function renderMensajeInicial() {
    resultadoContenedor.innerHTML =
      '<p class="cotizaciones__resultado-texto">Completa los datos y haz clic en <strong>Cotizar ahora</strong> para ver un valor estimado de tu viaje.</p>';
  }

  // Trae los select de origen y destino (MySQL vía PHP o respaldo JSON)
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

  // Convierte la fecha seleccionada a un formato más legible
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

  // Genera el item de cada empresa con sus detalles
  function generarTarjetas(origenTexto, destinoTexto, fechaTexto, pasajeros, servicio, fechaIda) {
    const precioBase = preciosPorServicio[servicio];

    return empresas
      .map((empresa, index) => {
        const precioPorPersona = Math.round(precioBase * empresa.multiplicador);
        const total = precioPorPersona * pasajeros;

        const amenidadesHTML = empresa.amenidades
          .map((item) => `<span>ⓘ ${item}</span>`)
          .join('');

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

              <div class="cotizaciones__meta">
                Horario de salida<br>
                <strong>${empresa.horario}</strong>
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
                <button
                  type="button"
                  class="cotizaciones__boton-opcion"
                  data-index="${index}"
                  data-origen="${origenTexto}"
                  data-destino="${destinoTexto}"
                  data-fecha="${fechaIda}"
                  data-servicio="${servicio}"
                  data-pasajeros="${pasajeros}"
                  data-empresa="${empresa.nombre}"
                  data-horario="${empresa.horario}"
                  data-salida="${empresa.salida}"
                  data-llegada="${empresa.llegada}"
                  data-precio="${precioPorPersona}"
                  data-tipo="${empresa.tipo}"
                  data-duracion="${empresa.duracion}"
                >
                  Reservar Ahora
                </button>
                <a href="#" class="cotizaciones__ver">Ver detalles</a>
              </div>
            </div>
          </article>
        `;
      })
      .join('');
  }

  async function guardarCotizacionEnApi() {
    const errForm = mensajeValidacionFormulario();
    if (errForm) {
      window.alert(errForm);
      return;
    }

    const origen = selectOrigen.value;
    const destino = selectDestino.value;
    const pasajeros = parseInt(pasajerosInput.value, 10);
    const servicio = formulario.querySelector('#servicio').value;
    const fechaIda = fechaIdaInput.value;
    const fechaRegreso = fechaRegresoInput && fechaRegresoInput.value ? fechaRegresoInput.value : null;
    const origenTexto = formulario.querySelector('#origen option:checked')?.textContent?.trim() || '';
    const destinoTexto = formulario.querySelector('#destino option:checked')?.textContent?.trim() || '';

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
        'No se pudo conectar con el servidor PHP/MySQL. Verifica XAMPP, la base \`terminal\` y api/config.php.\n' +
          (e && e.message ? e.message : '')
      );
    }
  }

  function activarBotonesReserva() {
    const botonesReservar = resultadoContenedor.querySelectorAll('.cotizaciones__boton-opcion');

    botonesReservar.forEach((boton) => {
      boton.addEventListener('click', () => {
        const datosReserva = {
          origen: boton.dataset.origen,
          destino: boton.dataset.destino,
          fecha: boton.dataset.fecha,
          servicio: boton.dataset.servicio,
          pasajeros: boton.dataset.pasajeros,
          empresa: boton.dataset.empresa,
          horario: boton.dataset.horario,
          salida: boton.dataset.salida,
          llegada: boton.dataset.llegada,
          precio: Number(boton.dataset.precio),
          tipo: boton.dataset.tipo,
          duracion: boton.dataset.duracion
        };

        sessionStorage.setItem('reservaCotizacion', JSON.stringify(datosReserva));
        window.location.href = 'tiquetes.html';
      });
    });
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

  // Listener solo para guardar la cotización
  resultadoContenedor.addEventListener('click', (e) => {
    const btnGuardar = e.target.closest('#guardarCotizacionApi');
    if (btnGuardar) {
      e.preventDefault();
      guardarCotizacionEnApi();
    }
  });

  // Evento que se ejecuta al hacer clic en el botón de cotizar
  botonCalcular.addEventListener('click', function () {
    const errForm = mensajeValidacionFormulario();
    if (errForm) {
      resultadoContenedor.innerHTML = `<p class="cotizaciones__resultado-texto">${errForm}</p>`;
      return;
    }

    const origen = selectOrigen.value;
    const destino = selectDestino.value;
    const pasajeros = parseInt(pasajerosInput.value, 10);
    const servicio = formulario.querySelector('#servicio').value;
    const fechaIda = fechaIdaInput.value;

    // Obtiene el texto visible de las opciones seleccionadas
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
        ${generarTarjetas(origenTexto, destinoTexto, fechaTexto, pasajeros, servicio, fechaIda)}
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

    activarBotonesReserva();
  });

  renderMensajeInicial();
});