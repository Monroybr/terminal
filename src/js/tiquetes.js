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

    // Llenar selects de ciudades
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
            option.value = ciudad.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
            option.textContent = ciudad;
            select.appendChild(option);
        });
    }

    llenarCiudades(origenSelect, 'Selecciona ciudad de origen');
    llenarCiudades(destinoSelect, 'Selecciona ciudad de destino');

    // Fecha mínima = hoy
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;

    // Validación pasajeros:
    // - máximo 2 dígitos
    // - entre 1 y 30
    pasajerosInput.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, ''); // solo números

        // máximo 2 dígitos
        if (valor.length > 2) {
            valor = valor.slice(0, 2);
        }

        // si es mayor a 30, dejar 30
        if (valor !== '' && Number(valor) > 30) {
            valor = '30';
        }

        e.target.value = valor;
    });

    pasajerosInput.addEventListener('blur', (e) => {
        const valor = Number(e.target.value);

        if (e.target.value === '') return;

        if (valor < 1) {
            e.target.value = 1;
        } else if (valor > 30) {
            e.target.value = 30;
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

        const datosBusqueda = {
            origen,
            destino,
            fecha,
            servicio,
            pasajeros
        };

        console.log('Formulario válido:', datosBusqueda);
        alert('Búsqueda realizada correctamente.');
    });
});