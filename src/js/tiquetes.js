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

    const datosEmpresas = [
        {
            empresa: 'Cootranshuila',
            horario: '06:00 - 13:30',
            duracion: 'Duración: 7h 30min'
        },
        {
            empresa: 'Coomotor Huila',
            horario: '09:00 - 16:00',
            duracion: 'Duración: 7h 00min'
        },
        {
            empresa: 'Empresa Bolivariano',
            horario: '13:00 - 20:30',
            duracion: 'Duración: 7h 30min'
        },
        {
            empresa: 'Velotax',
            horario: '15:30 - 22:15',
            duracion: 'Duración: 6h 45min'
        },
        {
            empresa: 'Expreso Palmira',
            horario: '18:00 - 01:15',
            duracion: 'Duración: 7h 15min'
        }
    ];

    if (!formulario || !origenSelect || !destinoSelect || !fechaInput || !servicioSelect || !pasajerosInput) {
        console.error('Faltan elementos del formulario en el HTML.');
        return;
    }

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

    function formatearServicio(servicio) {
        const servicios = {
            economico: 'Económico',
            ejecutivo: 'Ejecutivo',
            premium: 'Premium'
        };

        return servicios[servicio] || servicio;
    }

    function renderizarResultados(datos) {
        if (!resultadosBody) {
            console.error('No existe el elemento con id="resultadosBody".');
            return;
        }

        resultadosBody.innerHTML = '';

        datosEmpresas.forEach(item => {
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
                    <span class="resultados__duracion">${item.duracion}</span>
                </td>
                <td class="resultados__td">
                    <button type="button" class="resultados__accion">Comprar</button>
                </td>
            `;

            resultadosBody.appendChild(fila);
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

        console.log('Submit ejecutado');

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

        const datosBusqueda = {
            origen,
            destino,
            fecha,
            servicio,
            pasajeros
        };

        console.log('Datos de búsqueda:', datosBusqueda);

        renderizarResultados(datosBusqueda);

        if (seccionViajes) {
            seccionViajes.style.display = 'none';
        }

        if (seccionResultados) {
            seccionResultados.classList.remove('resultados--oculto');
            seccionResultados.scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            console.error('No existe la sección con id="resultados".');
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
});