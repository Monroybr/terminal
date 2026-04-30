document.addEventListener('DOMContentLoaded', () => {
    const ciudadesRespaldo = [
        'Bogotá',
        'Medellín',
        'Cali',
        'Barranquilla',
        'Cartagena',
        'Bucaramanga',
        'Pereira',
        'Manizales',
        'Neiva',
        'Pasto',
        'Ibagué',
        'Santa Marta',
        'Villavicencio'
    ];

    let ciudades = ciudadesRespaldo.slice();

    // Elementos del formulario principal
    const formulario = document.getElementById('tiquetesForm');
    const origenSelect = document.getElementById('origen');
    const destinoSelect = document.getElementById('destino');
    const fechaInput = document.getElementById('fecha');
    const servicioSelect = document.getElementById('servicio');
    const pasajerosInput = document.getElementById('pasajeros');

    // Proceso de compra
    const seccionViajes = document.querySelector('.viajes');
    const seccionResultados = document.getElementById('resultados');
    const resultadosBody = document.getElementById('resultadosBody');
    const botonModificar = document.getElementById('modificarBusqueda');

    const seccionPasajero = document.getElementById('pasajero');
    const botonVolverResultados = document.getElementById('volverResultados');
    const pasajeroForm = document.getElementById('pasajeroForm');

    const seccionResumen = document.getElementById('resumen');
    const botonModificarDatos = document.getElementById('modificarDatos');
    const botonConfirmarPago = document.getElementById('confirmarPago');

    const seccionConfirmacion = document.getElementById('confirmacion');
    const botonImprimirTiquete = document.getElementById('imprimirTiquete');
    const botonNuevaCompra = document.getElementById('nuevaCompra');

    // Resumen de la compra
    const resumenEmpresa = document.getElementById('resumenEmpresa');
    const resumenRuta = document.getElementById('resumenRuta');
    const resumenFecha = document.getElementById('resumenFecha');
    const resumenHorario = document.getElementById('resumenHorario');
    const resumenPasajeros = document.getElementById('resumenPasajeros');
    const resumenClase = document.getElementById('resumenClase');
    const resumenTotal = document.getElementById('resumenTotal');

    // Detalle del viaje
    const detalleEmpresa = document.getElementById('detalleEmpresa');
    const detalleRuta = document.getElementById('detalleRuta');
    const detalleFecha = document.getElementById('detalleFecha');
    const detalleSalida = document.getElementById('detalleSalida');
    const detalleLlegada = document.getElementById('detalleLlegada');
    const detalleDuracion = document.getElementById('detalleDuracion');
    const detalleClase = document.getElementById('detalleClase');

    // Detalle pasajero
    const detalleNombre = document.getElementById('detalleNombre');
    const detalleTipoDocumento = document.getElementById('detalleTipoDocumento');
    const detalleNumeroDocumento = document.getElementById('detalleNumeroDocumento');
    const detalleCorreo = document.getElementById('detalleCorreo');
    const detalleTelefono = document.getElementById('detalleTelefono');
    const detallePasajeros = document.getElementById('detallePasajeros');
    const detalleDireccion = document.getElementById('detalleDireccion');

    // Elemento del pago
    const pagoPrecioUnitario = document.getElementById('pagoPrecioUnitario');
    const pagoCantidad = document.getElementById('pagoCantidad');
    const pagoSubtotal = document.getElementById('pagoSubtotal');
    const pagoTotal = document.getElementById('pagoTotal');

    // Formulario del pasajero
    const nombreCompleto = document.getElementById('nombreCompleto');
    const tipoDocumento = document.getElementById('tipoDocumento');
    const numeroDocumento = document.getElementById('numeroDocumento');
    const correoElectronico = document.getElementById('correoElectronico');
    const telefonoCelular = document.getElementById('telefonoCelular');
    const direccionPasajero = document.getElementById('direccionPasajero');

    const aceptaTerminos = document.getElementById('aceptaTerminos');

    // Confirmación final
    const ticketNumero = document.getElementById('ticketNumero');
    const ticketNumeroDuplicado = document.getElementById('ticketNumeroDuplicado');
    const confEmpresa = document.getElementById('confEmpresa');
    const confOrigen = document.getElementById('confOrigen');
    const confDestino = document.getElementById('confDestino');
    const confFecha = document.getElementById('confFecha');
    const confSalida = document.getElementById('confSalida');
    const confClase = document.getElementById('confClase');
    const confNombre = document.getElementById('confNombre');
    const confDocumento = document.getElementById('confDocumento');
    const confCorreo = document.getElementById('confCorreo');
    const confTelefono = document.getElementById('confTelefono');
    const confPasajeros = document.getElementById('confPasajeros');
    const confTotal = document.getElementById('confTotal');
    const confEmision = document.getElementById('confEmision');

    // Guarda información actual del proceso de compra
    let datosBusquedaActual = null;
    let viajeSeleccionadoActual = null;
    let datosPasajeroActual = null;
    let totalCompraActual = 0;

    /** Catálogo desde MySQL (api/empresas_viaje.php); vacío hasta cargar */
    let datosEmpresas = [];

    async function cargarEmpresasDesdeApi() {
        const res = await fetch('api/empresas_viaje.php');
        const j = await res.json();

        if (!j.ok || !Array.isArray(j.data)) {
            throw new Error(j.error || 'No se pudieron cargar empresas');
        }

        datosEmpresas = j.data.map((e) => ({
            id: e.id,
            empresa: e.nombre,
            horario: e.horario,
            salida: e.salida,
            llegada: e.llegada,
            duracion: e.duracion,
            precio: Number(e.precio_unitario)
        }));
    }

    // Trae ciudades disponibles
    function llenarCiudades(select, textoDefault) {
        select.innerHTML = '';

        const opcionDefault = document.createElement('option');
        opcionDefault.value = '';
        opcionDefault.textContent = textoDefault;
        opcionDefault.disabled = true;
        opcionDefault.selected = true;
        select.appendChild(opcionDefault);

        ciudades.forEach((ciudad) => {
            const option = document.createElement('option');
            option.value = ciudad;
            option.textContent = ciudad;
            select.appendChild(option);
        });
    }

    // Convierte el formato de fecha
    function formatearFecha(fecha) {
        const [anio, mes, dia] = fecha.split('-');
        return `${dia}/${mes}/${anio}`;
    }

    function formatearFechaLarga(fecha) {
        const fechaObj = new Date(`${fecha}T00:00:00`);
        return fechaObj.toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Obtiene la fecha actual de emisión del tiquete
    function formatearFechaEmision() {
        return new Date().toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Convierte el valor interno del servicio a un texto más legible
    function formatearServicio(servicio) {
        const servicios = {
            economico: 'Económico',
            ejecutivo: 'Ejecutivo',
            premium: 'Premium'
        };

        return servicios[servicio] || servicio;
    }

    function formatearTipoDocumento(tipo) {
        const tipos = {
            dni: 'DNI',
            cedula: 'Cédula',
            pasaporte: 'Pasaporte'
        };

        return tipos[tipo] || tipo;
    }

    function formatearPrecio(valor) {
        return `$ ${valor.toLocaleString('es-CO')}`;
    }

    function generarNumeroTiquete() {
        const aleatorio1 = Math.floor(100000000 + Math.random() * 900000000);
        const aleatorio2 = Math.floor(100 + Math.random() * 900);
        return `TKT-${aleatorio1}-${aleatorio2}`;
    }

    // Renderiza la tabla de resultados con las empresas disponibles
    function renderizarResultados(datos) {
        resultadosBody.innerHTML = '';

        datosEmpresas.forEach((item, index) => {
            const fila = document.createElement('tr');
            fila.classList.add('resultados__fila');

            fila.innerHTML = `
                <td class="resultados__td">${datos.origen}</td>
                <td class="resultados__td">${datos.destino}</td>
                <td class="resultados__td">${formatearFecha(datos.fecha)}</td>
                <td class="resultados__td">${datos.pasajeros}</td>
                <td class="resultados__td">${formatearServicio(datos.servicio)}</td>
                <td class="resultados__td">${item.empresa}</td>
                <td class="resultados__td">
                    <span class="resultados__horario">${item.horario}</span>
                    <span class="resultados__duracion">Duración: ${item.duracion}</span>
                </td>
                <td class="resultados__td">
                    <button type="button" class="resultados__accion" data-index="${index}">
                        Comprar
                    </button>
                </td>
            `;

            resultadosBody.appendChild(fila);
        });

        agregarEventosComprar();
    }

    // Agrega el evento click a cada botón de comprar
    function agregarEventosComprar() {
        const botonesComprar = document.querySelectorAll('.resultados__accion');

        botonesComprar.forEach((boton) => {
            boton.addEventListener('click', () => {
                const index = boton.dataset.index;
                viajeSeleccionadoActual = datosEmpresas[index];

                if (!datosBusquedaActual || !viajeSeleccionadoActual) return;

                resumenEmpresa.textContent = viajeSeleccionadoActual.empresa;
                resumenRuta.textContent = `${datosBusquedaActual.origen} → ${datosBusquedaActual.destino}`;
                resumenFecha.textContent = formatearFechaLarga(datosBusquedaActual.fecha);
                resumenHorario.textContent = viajeSeleccionadoActual.horario;
                resumenPasajeros.textContent = datosBusquedaActual.pasajeros;
                resumenClase.textContent = formatearServicio(datosBusquedaActual.servicio);

                const totalInicial =
                    viajeSeleccionadoActual.precio * Number(datosBusquedaActual.pasajeros);
                resumenTotal.textContent = formatearPrecio(totalInicial);

                seccionResultados.classList.add('resultados--oculto');
                seccionPasajero.classList.remove('pasajero--oculto');

                seccionPasajero.scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }

    // Llena el resumen final de compra con la información
    function llenarResumenCompra(datosPasajero) {
        if (!datosBusquedaActual || !viajeSeleccionadoActual) return;

        const cantidadPasajeros = Number(datosBusquedaActual.pasajeros);
        const precioUnitario = viajeSeleccionadoActual.precio;
        const subtotal = precioUnitario * cantidadPasajeros;

        totalCompraActual = subtotal;

        detalleEmpresa.textContent = viajeSeleccionadoActual.empresa;
        detalleRuta.textContent = `${datosBusquedaActual.origen} → ${datosBusquedaActual.destino}`;
        detalleFecha.textContent = formatearFechaLarga(datosBusquedaActual.fecha);
        detalleSalida.textContent = viajeSeleccionadoActual.salida;
        detalleLlegada.textContent = viajeSeleccionadoActual.llegada;
        detalleDuracion.textContent = viajeSeleccionadoActual.duracion;
        detalleClase.textContent = formatearServicio(datosBusquedaActual.servicio);

        detalleNombre.textContent = datosPasajero.nombre;
        detalleTipoDocumento.textContent = formatearTipoDocumento(datosPasajero.tipoDocumento);
        detalleNumeroDocumento.textContent = datosPasajero.numeroDocumento;
        detalleCorreo.textContent = datosPasajero.correo;
        detalleTelefono.textContent = datosPasajero.telefono;
        detallePasajeros.textContent = datosBusquedaActual.pasajeros;
        detalleDireccion.textContent = datosPasajero.direccion || '-';

        pagoPrecioUnitario.textContent = formatearPrecio(precioUnitario);
        pagoCantidad.textContent = cantidadPasajeros;
        pagoSubtotal.textContent = formatearPrecio(subtotal);
        pagoTotal.textContent = formatearPrecio(subtotal);
    }

    // Llena la sección de confirmación final del tiquete
    function llenarConfirmacion(numeroTiqueteServidor, totalServidor) {
        if (!datosBusquedaActual || !viajeSeleccionadoActual || !datosPasajeroActual) return;

        const numeroTiqueteGenerado = numeroTiqueteServidor || generarNumeroTiquete();
        const totalMostrar = totalServidor != null ? totalServidor : totalCompraActual;
        const documentoCompleto = `${formatearTipoDocumento(datosPasajeroActual.tipoDocumento)} ${datosPasajeroActual.numeroDocumento}`;

        ticketNumero.textContent = numeroTiqueteGenerado;
        ticketNumeroDuplicado.textContent = numeroTiqueteGenerado;

        confEmpresa.textContent = viajeSeleccionadoActual.empresa;
        confOrigen.textContent = datosBusquedaActual.origen;
        confDestino.textContent = datosBusquedaActual.destino;
        confFecha.textContent = formatearFechaLarga(datosBusquedaActual.fecha);
        confSalida.textContent = viajeSeleccionadoActual.salida;
        confClase.textContent = formatearServicio(datosBusquedaActual.servicio);

        confNombre.textContent = datosPasajeroActual.nombre;
        confDocumento.textContent = documentoCompleto;
        confCorreo.textContent = datosPasajeroActual.correo;
        confTelefono.textContent = datosPasajeroActual.telefono;
        confPasajeros.textContent = datosBusquedaActual.pasajeros;

        confTotal.textContent = formatearPrecio(totalMostrar);
        confEmision.textContent = formatearFechaEmision();
    }

    // Reinicia todo el proceso de compra y devuelve al formulario inicial
    function reiniciarProceso() {
        formulario.reset();
        pasajeroForm.reset();

        datosBusquedaActual = null;
        viajeSeleccionadoActual = null;
        datosPasajeroActual = null;
        totalCompraActual = 0;

        seccionResultados.classList.add('resultados--oculto');
        seccionPasajero.classList.add('pasajero--oculto');
        seccionResumen.classList.add('resumen--oculto');
        seccionConfirmacion.classList.add('confirmacion--oculto');

        if (seccionViajes) {
            seccionViajes.style.display = 'block';
        }

        llenarCiudades(origenSelect, 'Selecciona ciudad de origen');
        llenarCiudades(destinoSelect, 'Selecciona ciudad de destino');

        formulario.scrollIntoView({
            behavior: 'smooth'
        });
    }

    function cargarReservaDesdeCotizacion() {
        const reservaGuardada = sessionStorage.getItem('reservaCotizacion');
        if (!reservaGuardada) return;

        try {
            const reserva = JSON.parse(reservaGuardada);

            if (
                !reserva.origen ||
                !reserva.destino ||
                !reserva.fecha ||
                !reserva.servicio ||
                !reserva.pasajeros ||
                !reserva.empresa
            ) {
                sessionStorage.removeItem('reservaCotizacion');
                return;
            }

            datosBusquedaActual = {
                origen: reserva.origen,
                destino: reserva.destino,
                fecha: reserva.fecha,
                servicio: reserva.servicio,
                pasajeros: Number(reserva.pasajeros)
            };

            viajeSeleccionadoActual = {
                empresa: reserva.empresa,
                horario: reserva.horario || 'Por confirmar',
                salida: reserva.salida || 'Por confirmar',
                llegada: reserva.llegada || 'Por confirmar',
                duracion: reserva.duracion || 'No disponible',
                precio: Number(reserva.precio) || 0
            };

            resumenEmpresa.textContent = viajeSeleccionadoActual.empresa;
            resumenRuta.textContent = `${datosBusquedaActual.origen} → ${datosBusquedaActual.destino}`;
            resumenFecha.textContent = formatearFechaLarga(datosBusquedaActual.fecha);
            resumenHorario.textContent = viajeSeleccionadoActual.horario;
            resumenPasajeros.textContent = datosBusquedaActual.pasajeros;
            resumenClase.textContent = formatearServicio(datosBusquedaActual.servicio);

            const totalInicial = viajeSeleccionadoActual.precio * Number(datosBusquedaActual.pasajeros);
            resumenTotal.textContent = formatearPrecio(totalInicial);

            if (seccionViajes) {
                seccionViajes.style.display = 'none';
            }

            if (seccionResultados) {
                seccionResultados.classList.add('resultados--oculto');
            }

            if (seccionResumen) {
                seccionResumen.classList.add('resumen--oculto');
            }

            if (seccionConfirmacion) {
                seccionConfirmacion.classList.add('confirmacion--oculto');
            }

            if (seccionPasajero) {
                seccionPasajero.classList.remove('pasajero--oculto');
                seccionPasajero.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            sessionStorage.removeItem('reservaCotizacion');
        } catch (error) {
            console.error('No se pudo cargar la reserva desde cotizaciones', error);
            sessionStorage.removeItem('reservaCotizacion');
        }
    }

    fetch('api/ciudades.php')
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((j) => {
            if (j && j.ok && Array.isArray(j.data)) {
                ciudades = j.data.map((c) => c.nombre);
            }
        })
        .catch(() => {})
        .finally(() => {
            llenarCiudades(origenSelect, 'Selecciona ciudad de origen');
            llenarCiudades(destinoSelect, 'Selecciona ciudad de destino');
        });

    cargarEmpresasDesdeApi().catch(() => {});
    cargarReservaDesdeCotizacion();

    // Define que la fecha mínima permitida sea la fecha actual
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;

    // Restringe el número de pasajeros a máximo dos dígitos y 30 personas
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

    // Ajusta el valor mínimo y máximo permitido al salir del campo
    pasajerosInput.addEventListener('blur', (e) => {
        const valor = Number(e.target.value);

        if (e.target.value === '') return;

        if (valor < 1) {
            e.target.value = '1';
        } else if (valor > 30) {
            e.target.value = '30';
        }
    });

    // Procesa la búsqueda de viajes al enviar el formulario principal
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        const origen = origenSelect.value;
        const destino = destinoSelect.value;
        const fecha = fechaInput.value;
        const servicio = servicioSelect.value;
        const pasajeros = pasajerosInput.value;

        if (!origen || !destino || !fecha || !servicio || !pasajeros) {
            alert('Por favor completa todos los campos.');
            return;
        }

        if (origen === destino) {
            alert('La ciudad de origen y destino no pueden ser la misma.');
            return;
        }

        if (Number(pasajeros) < 1 || Number(pasajeros) > 30) {
            alert('El número de pasajeros debe estar entre 1 y 30.');
            return;
        }

        datosBusquedaActual = {
            origen,
            destino,
            fecha,
            servicio,
            pasajeros
        };

        function mostrarTablaResultados() {
            renderizarResultados(datosBusquedaActual);

            if (seccionViajes) {
                seccionViajes.style.display = 'none';
            }

            if (seccionResultados) {
                seccionResultados.classList.remove('resultados--oculto');
                seccionResultados.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }

        if (!datosEmpresas.length) {
            cargarEmpresasDesdeApi()
                .then(() => {
                    mostrarTablaResultados();
                })
                .catch(() => {
                    alert(
                        'No se pudo cargar el catálogo de empresas desde la base de datos. Activa Apache/MySQL, importa database/terminal.sql y abre el sitio vía http://localhost/...'
                    );
                });
            return;
        }

        mostrarTablaResultados();
    });

    // Permite volver desde resultados al formulario de búsqueda
    if (botonModificar) {
        botonModificar.addEventListener('click', () => {
            if (seccionResultados) {
                seccionResultados.classList.add('resultados--oculto');
            }

            if (seccionViajes) {
                seccionViajes.style.display = 'block';
            }

            formulario.scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Permite volver desde el formulario de pasajero a los resultados
    if (botonVolverResultados) {
        botonVolverResultados.addEventListener('click', () => {
            seccionPasajero.classList.add('pasajero--oculto');

            if (resultadosBody && resultadosBody.children.length > 0) {
                seccionResultados.classList.remove('resultados--oculto');
                seccionResultados.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                if (seccionViajes) {
                    seccionViajes.style.display = 'block';
                }

                formulario.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // Procesa el formulario de datos del pasajero
    if (pasajeroForm) {
    pasajeroForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = nombreCompleto.value.trim();
        const documento = numeroDocumento.value.trim();
        const correo = correoElectronico.value.trim();
        const telefono = telefonoCelular.value.trim();
        const direccion = direccionPasajero.value.trim();

        // VALIDACIÓN NOMBRE
        if (nombre.length < 10 || nombre.length > 60) {
            alert('El nombre debe tener entre 10 y 60 caracteres.');
            return;
        }

        // VALIDACIÓN DOCUMENTO (solo números)
        if (!/^[0-9]+$/.test(documento)) {
            alert('El número de documento solo debe contener números.');
            return;
        }

        // VALIDACIÓN EMAIL
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            alert('Ingrese un correo electrónico válido.');
            return;
        }

        // VALIDACIÓN TELÉFONO (exactamente 10 números)
        if (!/^[0-9]{10}$/.test(telefono)) {
            alert('El teléfono debe tener exactamente 10 números.');
            return;
        }

        // VALIDACIÓN DIRECCIÓN (obligatoria)
        if (direccion === '') {
            alert('La dirección es obligatoria.');
            return;
        }

        const datosPasajero = {
            nombre: nombre,
            tipoDocumento: tipoDocumento.value,
            numeroDocumento: documento,
            correo: correo,
            telefono: telefono,
            direccion: direccion
        };

        datosPasajeroActual = datosPasajero;

        llenarResumenCompra(datosPasajeroActual);

        seccionPasajero.classList.add('pasajero--oculto');
        seccionResumen.classList.remove('resumen--oculto');

        seccionResumen.scrollIntoView({
            behavior: 'smooth'
        });
    });
}

    // Permite regresar desde el resumen al formulario del pasajero
    if (botonModificarDatos) {
        botonModificarDatos.addEventListener('click', () => {
            seccionResumen.classList.add('resumen--oculto');
            seccionPasajero.classList.remove('pasajero--oculto');

            seccionPasajero.scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Confirma la compra si el usuario acepta los términos
    if (botonConfirmarPago) {
        botonConfirmarPago.addEventListener('click', async () => {
            if (!aceptaTerminos.checked) {
                alert('Debes aceptar los términos y condiciones para continuar.');
                return;
            }

            if (!datosBusquedaActual || !viajeSeleccionadoActual || !datosPasajeroActual) {
                return;
            }

            const body = {
                origen: datosBusquedaActual.origen,
                destino: datosBusquedaActual.destino,
                fecha_viaje: datosBusquedaActual.fecha,
                servicio: datosBusquedaActual.servicio,
                pasajeros: Number(datosBusquedaActual.pasajeros),
                empresa: viajeSeleccionadoActual.empresa,
                horario: viajeSeleccionadoActual.horario,
                precio_unitario: viajeSeleccionadoActual.precio,
                nombre_pasajero: datosPasajeroActual.nombre,
                tipo_documento: datosPasajeroActual.tipoDocumento,
                numero_documento: datosPasajeroActual.numeroDocumento,
                correo: datosPasajeroActual.correo,
                telefono: datosPasajeroActual.telefono,
                direccion: datosPasajeroActual.direccion || ''
            };

            try {
                const res = await fetch('api/pedidos.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                const j = await res.json();

                if (!j.ok) {
                    throw new Error(j.error || 'No se pudo registrar el pedido');
                }

                totalCompraActual = Number(j.total);
                llenarConfirmacion(j.numero_tiquete, totalCompraActual);

                seccionResumen.classList.add('resumen--oculto');
                seccionConfirmacion.classList.remove('confirmacion--oculto');

                seccionConfirmacion.scrollIntoView({
                    behavior: 'smooth'
                });
            } catch (err) {
                alert(
                    (err && err.message ? err.message : 'Error') +
                        '\nComprueba Apache, MySQL, api/config.php y que exista la base `terminal`.'
                );
            }
        });
    }

    // Imprime el tiquete generado
    if (botonImprimirTiquete) {
        botonImprimirTiquete.addEventListener('click', () => {
            window.print();
        });
    }

    // Enviar tiquete por email
const botonEnviarEmail = document.getElementById('enviarEmail');

if (botonEnviarEmail) {
    botonEnviarEmail.addEventListener('click', async () => {
        if (!datosBusquedaActual || !viajeSeleccionadoActual || !datosPasajeroActual) {
            alert('No hay información del tiquete para enviar.');
            return;
        }

        const body = {
            correo: datosPasajeroActual.correo,
            nombre: datosPasajeroActual.nombre,
            numero_tiquete: ticketNumero.textContent,
            empresa: viajeSeleccionadoActual.empresa,
            origen: datosBusquedaActual.origen,
            destino: datosBusquedaActual.destino,
            fecha: datosBusquedaActual.fecha,
            salida: viajeSeleccionadoActual.salida,
            clase: datosBusquedaActual.servicio,
            pasajeros: datosBusquedaActual.pasajeros,
            total: totalCompraActual
        };

        try {
            const res = await fetch('api/enviar_email.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const j = await res.json();

            if (!j.ok) {
                throw new Error(j.error || 'No se pudo enviar el correo');
            }

            alert('Tiquete enviado correctamente al correo.');
        } catch (error) {
            alert('Error al enviar el correo.');
            console.error(error);
        }
    });
}

    // Reinicia todo el proceso para hacer una nueva compra
    if (botonNuevaCompra) {
        botonNuevaCompra.addEventListener('click', () => {
            reiniciarProceso();
        });
    }

    
});