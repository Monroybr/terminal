document.addEventListener('DOMContentLoaded', () => {
    const ciudades = [
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

    const formulario = document.getElementById('tiquetesForm');
    const origenSelect = document.getElementById('origen');
    const destinoSelect = document.getElementById('destino');
    const fechaInput = document.getElementById('fecha');
    const servicioSelect = document.getElementById('servicio');
    const pasajerosInput = document.getElementById('pasajeros');

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

    const resumenEmpresa = document.getElementById('resumenEmpresa');
    const resumenRuta = document.getElementById('resumenRuta');
    const resumenFecha = document.getElementById('resumenFecha');
    const resumenHorario = document.getElementById('resumenHorario');
    const resumenPasajeros = document.getElementById('resumenPasajeros');
    const resumenClase = document.getElementById('resumenClase');
    const resumenTotal = document.getElementById('resumenTotal');

    const detalleEmpresa = document.getElementById('detalleEmpresa');
    const detalleRuta = document.getElementById('detalleRuta');
    const detalleFecha = document.getElementById('detalleFecha');
    const detalleSalida = document.getElementById('detalleSalida');
    const detalleLlegada = document.getElementById('detalleLlegada');
    const detalleDuracion = document.getElementById('detalleDuracion');
    const detalleClase = document.getElementById('detalleClase');

    const detalleNombre = document.getElementById('detalleNombre');
    const detalleTipoDocumento = document.getElementById('detalleTipoDocumento');
    const detalleNumeroDocumento = document.getElementById('detalleNumeroDocumento');
    const detalleCorreo = document.getElementById('detalleCorreo');
    const detalleTelefono = document.getElementById('detalleTelefono');
    const detallePasajeros = document.getElementById('detallePasajeros');
    const detalleDireccion = document.getElementById('detalleDireccion');

    const pagoPrecioUnitario = document.getElementById('pagoPrecioUnitario');
    const pagoCantidad = document.getElementById('pagoCantidad');
    const pagoSubtotal = document.getElementById('pagoSubtotal');
    const pagoTotal = document.getElementById('pagoTotal');

    const nombreCompleto = document.getElementById('nombreCompleto');
    const tipoDocumento = document.getElementById('tipoDocumento');
    const numeroDocumento = document.getElementById('numeroDocumento');
    const correoElectronico = document.getElementById('correoElectronico');
    const telefonoCelular = document.getElementById('telefonoCelular');
    const direccionPasajero = document.getElementById('direccionPasajero');

    const aceptaTerminos = document.getElementById('aceptaTerminos');

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

    let datosBusquedaActual = null;
    let viajeSeleccionadoActual = null;
    let datosPasajeroActual = null;
    let totalCompraActual = 0;

    const datosEmpresas = [
        {
            empresa: 'Cootranshuila',
            horario: '06:00 - 13:30',
            salida: '06:00',
            llegada: '13:30',
            duracion: '7h 30min',
            precio: 180000
        },
        {
            empresa: 'Coomotor Huila',
            horario: '09:00 - 16:00',
            salida: '09:00',
            llegada: '16:00',
            duracion: '7h 00min',
            precio: 52000
        },
        {
            empresa: 'Empresa Bolivariano',
            horario: '13:00 - 20:30',
            salida: '13:00',
            llegada: '20:30',
            duracion: '7h 30min',
            precio: 44000
        },
        {
            empresa: 'Velotax',
            horario: '15:30 - 22:15',
            salida: '15:30',
            llegada: '22:15',
            duracion: '6h 45min',
            precio: 40000
        },
        {
            empresa: 'Expreso Palmira',
            horario: '18:00 - 01:15',
            salida: '18:00',
            llegada: '01:15',
            duracion: '7h 15min',
            precio: 48000
        }
    ];

    function llenarCiudades(select, textoDefault) {
        select.innerHTML = '';

        const opcionDefault = document.createElement('option');
        opcionDefault.value = '';
        opcionDefault.textContent = textoDefault;
        opcionDefault.disabled = true;
        opcionDefault.selected = true;
        select.appendChild(opcionDefault);

        ciudades.forEach(ciudad => {
            const option = document.createElement('option');
            option.value = ciudad;
            option.textContent = ciudad;
            select.appendChild(option);
        });
    }

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

    function formatearFechaEmision() {
        return new Date().toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

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

    function agregarEventosComprar() {
        const botonesComprar = document.querySelectorAll('.resultados__accion');

        botonesComprar.forEach(boton => {
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

                const totalInicial = viajeSeleccionadoActual.precio * Number(datosBusquedaActual.pasajeros);
                resumenTotal.textContent = formatearPrecio(totalInicial);

                seccionResultados.classList.add('resultados--oculto');
                seccionPasajero.classList.remove('pasajero--oculto');

                seccionPasajero.scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }

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

    function llenarConfirmacion() {
        if (!datosBusquedaActual || !viajeSeleccionadoActual || !datosPasajeroActual) return;

        const numeroTiqueteGenerado = generarNumeroTiquete();
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

        confTotal.textContent = formatearPrecio(totalCompraActual);
        confEmision.textContent = formatearFechaEmision();
    }

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

    llenarCiudades(origenSelect, 'Selecciona ciudad de origen');
    llenarCiudades(destinoSelect, 'Selecciona ciudad de destino');

    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;

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
        const valor = Number(e.target.value);

        if (e.target.value === '') return;

        if (valor < 1) {
            e.target.value = '1';
        } else if (valor > 30) {
            e.target.value = '30';
        }
    });

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
    });

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

    if (botonVolverResultados) {
        botonVolverResultados.addEventListener('click', () => {
            seccionPasajero.classList.add('pasajero--oculto');
            seccionResultados.classList.remove('resultados--oculto');

            seccionResultados.scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    if (pasajeroForm) {
        pasajeroForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const datosPasajero = {
                nombre: nombreCompleto.value.trim(),
                tipoDocumento: tipoDocumento.value,
                numeroDocumento: numeroDocumento.value.trim(),
                correo: correoElectronico.value.trim(),
                telefono: telefonoCelular.value.trim(),
                direccion: direccionPasajero.value.trim()
            };

            if (
                !datosPasajero.nombre ||
                !datosPasajero.tipoDocumento ||
                !datosPasajero.numeroDocumento ||
                !datosPasajero.correo ||
                !datosPasajero.telefono
            ) {
                alert('Por favor completa todos los campos obligatorios del pasajero.');
                return;
            }

            datosPasajeroActual = datosPasajero;

            llenarResumenCompra(datosPasajeroActual);

            seccionPasajero.classList.add('pasajero--oculto');
            seccionResumen.classList.remove('resumen--oculto');

            seccionResumen.scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    if (botonModificarDatos) {
        botonModificarDatos.addEventListener('click', () => {
            seccionResumen.classList.add('resumen--oculto');
            seccionPasajero.classList.remove('pasajero--oculto');

            seccionPasajero.scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    if (botonConfirmarPago) {
        botonConfirmarPago.addEventListener('click', () => {
            if (!aceptaTerminos.checked) {
                alert('Debes aceptar los términos y condiciones para continuar.');
                return;
            }

            llenarConfirmacion();

            seccionResumen.classList.add('resumen--oculto');
            seccionConfirmacion.classList.remove('confirmacion--oculto');

            seccionConfirmacion.scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    if (botonImprimirTiquete) {
        botonImprimirTiquete.addEventListener('click', () => {
            window.print();
        });
    }

    if (botonNuevaCompra) {
        botonNuevaCompra.addEventListener('click', () => {
            reiniciarProceso();
        });
    }
});