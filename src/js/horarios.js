document.addEventListener('DOMContentLoaded', () => {
  const inputBusqueda = document.getElementById('horariosBusqueda');
  const selectDestino = document.getElementById('horariosFiltroDestino');
  const tbody = document.getElementById('horariosTablaBody');
  const mensajeVacio = document.getElementById('horariosMensajeVacio');

  if (!tbody) return;

  /**
   * Ruta absoluta desde la raíz del sitio hasta la carpeta del HTML actual.
   * Así api/... y src/... funcionan aunque la URL sea http://localhost/carpeta/horarios.html
   */
  function dirPagina() {
    const p = window.location.pathname;
    const i = p.lastIndexOf('/');
    if (i <= 0) return '';
    return p.slice(0, i);
  }

  function urlRecurso(rutaRelativa) {
    const dir = dirPagina();
    const limpia = rutaRelativa.replace(/^\//, '');
    if (!dir) return limpia;
    return `${dir}/${limpia}`;
  }

  let cacheHorariosFallback = null;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function normalizarTexto(s) {
    const t = String(s);
    try {
      return t
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .toLowerCase();
    } catch {
      return t.toLowerCase();
    }
  }

  function claseEstado(estado) {
    const t = String(estado).toLowerCase();
    if (t.includes('retras')) {
      return 'horarios__estado horarios__estado--retraso';
    }
    return 'horarios__estado horarios__estado--tiempo';
  }

  function renderFilas(rows) {
    if (!rows.length) {
      tbody.innerHTML = '';
      if (mensajeVacio) {
        mensajeVacio.hidden = false;
        mensajeVacio.textContent =
          'No hay salidas que coincidan con tu búsqueda. Prueba otro destino o empresa.';
      }
      return;
    }

    if (mensajeVacio) mensajeVacio.hidden = true;

    tbody.innerHTML = rows
      .map(
        (r) => `
      <tr class="horarios__fila">
        <td class="horarios__columna horarios__columna--destino">
          <span class="horarios__destino-icono">📍</span>
          <span class="horarios__destino-nombre">${escapeHtml(r.destino)}</span>
        </td>
        <td class="horarios__columna">
          <span class="horarios__hora-icono">⏱</span>
          <span class="horarios__hora">${escapeHtml(r.hora_salida)}</span>
        </td>
        <td class="horarios__columna">${escapeHtml(r.hora_llegada)}</td>
        <td class="horarios__columna">${escapeHtml(r.empresa)}</td>
        <td class="horarios__columna">
          <span class="horarios__plataforma">${escapeHtml(r.plataforma)}</span>
        </td>
        <td class="horarios__columna">
          <span class="${claseEstado(r.estado)}">${escapeHtml(r.estado)}</span>
        </td>
      </tr>`
      )
      .join('');
  }

  function filtrarLocal(rows, q, destino) {
    let out = rows.slice();
    if (destino) {
      out = out.filter((r) => r.destino === destino);
    }
    if (q) {
      const nq = normalizarTexto(q);
      out = out.filter(
        (r) =>
          normalizarTexto(r.destino).includes(nq) || normalizarTexto(r.empresa).includes(nq)
      );
    }
    out.sort((a, b) => {
      const h = String(a.hora_salida).localeCompare(String(b.hora_salida));
      return h !== 0 ? h : String(a.destino).localeCompare(String(b.destino));
    });
    return out;
  }

  async function cargarHorariosFallback(q, destino) {
    if (!cacheHorariosFallback) {
      const res = await fetch(urlRecurso('src/data/horarios-salida.json'));
      if (!res.ok) throw new Error('fallback json');
      cacheHorariosFallback = await res.json();
    }
    return filtrarLocal(cacheHorariosFallback, q, destino);
  }

  async function cargarHorarios() {
    const q = inputBusqueda ? inputBusqueda.value.trim() : '';
    const destino = selectDestino ? selectDestino.value.trim() : '';
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (destino) params.set('destino', destino);

    const urlApi = urlRecurso(`api/horarios.php${params.toString() ? `?${params}` : ''}`);

    try {
      const res = await fetch(urlApi);
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error('respuesta no es JSON');
      }
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'API error');
      }
      renderFilas(json.data || []);
    } catch {
      try {
        const rows = await cargarHorariosFallback(q, destino);
        renderFilas(rows);
      } catch {
        tbody.innerHTML = '';
        if (mensajeVacio) {
          mensajeVacio.hidden = false;
          const esFile = window.location.protocol === 'file:';
          mensajeVacio.textContent = esFile
            ? 'Abre esta página con un servidor HTTP (XAMPP: http://localhost/tu-carpeta/horarios.html). Desde archivo (file://) PHP no puede ejecutarse; se intentó usar datos locales pero no se encontró src/data/horarios-salida.json.'
            : 'No se pudo cargar los horarios. Verifica Apache, MySQL, la tabla horarios_salida en la base terminal y api/config.php. Si el problema continúa, comprueba la consola del navegador (F12).';
        }
      }
    }
  }

  function llenarSelectCiudades(ciudades, mantenerValor) {
    if (!selectDestino || !Array.isArray(ciudades)) return;
    const actual = mantenerValor !== undefined ? mantenerValor : selectDestino.value;
    selectDestino.textContent = '';
    const def = document.createElement('option');
    def.value = '';
    def.textContent = 'Todos los destinos';
    selectDestino.appendChild(def);
    ciudades.forEach((c) => {
      const nombre = typeof c === 'string' ? c : c.nombre;
      if (!nombre) return;
      const o = document.createElement('option');
      o.value = nombre;
      o.textContent = nombre;
      selectDestino.appendChild(o);
    });
    if (actual && [...selectDestino.options].some((opt) => opt.value === actual)) {
      selectDestino.value = actual;
    }
  }

  async function poblarFiltroDestinos() {
    if (!selectDestino) return;
    try {
      const res = await fetch(urlRecurso('api/ciudades.php'));
      const text = await res.text();
      const json = JSON.parse(text);
      if (json.ok && Array.isArray(json.data) && json.data.length) {
        llenarSelectCiudades(json.data);
        return;
      }
    } catch {
      /* sigue al JSON local */
    }
    try {
      const res = await fetch(urlRecurso('src/data/ciudades-colombia.json'));
      if (!res.ok) throw new Error('no json');
      const data = await res.json();
      llenarSelectCiudades(data);
    } catch {
      /* sin opciones extra */
    }
  }

  function debounce(fn, ms) {
    let t;
    return function debounced(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  const buscarDebounced = debounce(cargarHorarios, 320);

  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', buscarDebounced);
    inputBusqueda.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        cargarHorarios();
      }
    });
  }

  if (selectDestino) {
    selectDestino.addEventListener('change', () => cargarHorarios());
  }

  poblarFiltroDestinos().finally(() => cargarHorarios());
});
