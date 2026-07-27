const API = '../api/';
const msgEl = document.getElementById('mensaje');
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

function showMsg(text, ok) {
  msgEl.innerHTML = '<div class="adm__msg ' + (ok ? 'adm__msg--ok' : 'adm__msg--err') + '">' + text + '</div>';
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function apiFetch(path, opts) {
  const defaultHeaders = { 'Content-Type': 'application/json' };
  if (csrfToken) {
    defaultHeaders['X-CSRF-Token'] = csrfToken;
  }
  const r = await fetch(API + path, Object.assign({ headers: defaultHeaders }, opts || {}));
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.ok === false) {
    throw new Error(j.error || ('HTTP ' + r.status));
  }
  return j;
}

// Tabs
document.querySelectorAll('.adm__tab').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.adm__tab').forEach(function (b) { b.classList.remove('adm__tab--on'); });
    document.querySelectorAll('.adm__panel').forEach(function (p) { p.classList.remove('adm__panel--on'); });
    btn.classList.add('adm__tab--on');
    var id = 'panel-' + btn.getAttribute('data-tab');
    var pan = document.getElementById(id);
    if (pan) pan.classList.add('adm__panel--on');
  });
});

// ─── Cotizaciones ───────────────────────────────────────────────
async function loadCotizaciones() {
  const j = await apiFetch('cotizaciones.php', { method: 'GET' });
  const rows = j.data || [];
  if (!rows.length) {
    document.getElementById('cot-tabla-wrap').innerHTML = '<p>Sin cotizaciones.</p>';
    return;
  }
  var h = '<table><thead><tr><th>id</th><th>ruta</th><th>fecha</th><th>pas</th><th>srv</th><th>subtotal</th><th>% desc</th><th>total</th><th></th></tr></thead><tbody>';
  rows.forEach(function (r) {
    h += '<tr><td>' + r.id + '</td><td>' + escapeHtml(r.origen) + ' → ' + escapeHtml(r.destino) + '</td><td>' + r.fecha_ida + '</td><td>' + r.pasajeros + '</td><td>' + r.servicio + '</td><td>' + r.subtotal_sin_descuento + '</td><td>' + r.descuento_porcentaje + '</td><td>' + r.total_con_descuento + '</td>';
    h += '<td><button type="button" data-edit-cot="' + r.id + '">Editar</button> <button type="button" data-del-cot="' + r.id + '">Eliminar</button></td></tr>';
  });
  h += '</tbody></table>';
  document.getElementById('cot-tabla-wrap').innerHTML = h;

  document.querySelectorAll('[data-del-cot]').forEach(function (b) {
    b.addEventListener('click', async function () {
      if (!confirm('¿Eliminar cotización?')) return;
      try {
        await apiFetch('cotizaciones.php?id=' + encodeURIComponent(b.getAttribute('data-del-cot')), { method: 'DELETE' });
        showMsg('Cotización eliminada.', true);
        document.getElementById('cot-edit-wrap').innerHTML = '';
        loadCotizaciones();
      } catch (e) { showMsg(e.message, false); }
    });
  });

  document.querySelectorAll('[data-edit-cot]').forEach(function (b) {
    b.addEventListener('click', function () {
      var id = b.getAttribute('data-edit-cot');
      var row = rows.find(function (x) { return String(x.id) === String(id); });
      if (!row) return;
      document.getElementById('cot-edit-wrap').innerHTML =
        '<h3>Editar cotización #' + row.id + '</h3>' +
        '<div class="adm__grid">' +
        '<div><label>origen</label><input id="ce-origen" type="text"></div>' +
        '<div><label>destino</label><input id="ce-destino" type="text"></div>' +
        '<div><label>fecha_ida</label><input id="ce-fecha" type="date"></div>' +
        '<div><label>fecha_regreso</label><input id="ce-regreso" type="date"></div>' +
        '<div><label>pasajeros</label><input id="ce-pas" type="number" min="1" max="30"></div>' +
        '<div><label>servicio</label><select id="ce-srv"><option value="economico">economico</option><option value="ejecutivo">ejecutivo</option><option value="premium">premium</option></select></div>' +
        '</div><button type="button" id="ce-guardar">Guardar (recalcula en servidor)</button>';

      document.getElementById('ce-origen').value = row.origen;
      document.getElementById('ce-destino').value = row.destino;
      document.getElementById('ce-fecha').value = row.fecha_ida;
      document.getElementById('ce-regreso').value = row.fecha_regreso || '';
      document.getElementById('ce-pas').value = row.pasajeros;
      document.getElementById('ce-srv').value = row.servicio;

      document.getElementById('ce-guardar').addEventListener('click', async function () {
        var body = {
          id: row.id,
          origen: document.getElementById('ce-origen').value.trim(),
          destino: document.getElementById('ce-destino').value.trim(),
          fecha_ida: document.getElementById('ce-fecha').value,
          fecha_regreso: document.getElementById('ce-regreso').value || null,
          pasajeros: parseInt(document.getElementById('ce-pas').value, 10),
          servicio: document.getElementById('ce-srv').value
        };
        try {
          await apiFetch('cotizaciones.php', { method: 'PUT', body: JSON.stringify(body) });
          showMsg('Cotización actualizada.', true);
          document.getElementById('cot-edit-wrap').innerHTML = '';
          loadCotizaciones();
        } catch (e) { showMsg(e.message, false); }
      });
    });
  });
}

document.getElementById('cot-crear').addEventListener('click', async function () {
  const body = {
    origen: document.getElementById('cot-origen').value.trim(),
    destino: document.getElementById('cot-destino').value.trim(),
    fecha_ida: document.getElementById('cot-fecha').value,
    fecha_regreso: document.getElementById('cot-regreso').value || null,
    pasajeros: parseInt(document.getElementById('cot-pas').value, 10),
    servicio: document.getElementById('cot-srv').value
  };
  try {
    const res = await apiFetch('cotizaciones.php', { method: 'POST', body: JSON.stringify(body) });
    showMsg('Cotización creada (id ' + res.id + '). El total se calculó en el servidor.', true);
    loadCotizaciones();
  } catch (e) { showMsg(e.message, false); }
});
document.getElementById('cot-refrescar').addEventListener('click', function () { loadCotizaciones().catch(function (e) { showMsg(e.message, false); }); });

// ─── Pedidos ────────────────────────────────────────────────────
async function loadPedidos() {
  const j = await apiFetch('pedidos.php', { method: 'GET' });
  const rows = j.data || [];
  if (!rows.length) {
    document.getElementById('ped-tabla-wrap').innerHTML = '<p>Sin pedidos.</p>';
    document.getElementById('ped-form-wrap').innerHTML = '';
    return;
  }
  var h = '<table><thead><tr><th>id</th><th>tiquete</th><th>ruta</th><th>total</th><th></th></tr></thead><tbody>';
  rows.forEach(function (r) {
    h += '<tr><td>' + r.id + '</td><td>' + escapeHtml(r.numero_tiquete) + '</td><td>' + escapeHtml(r.origen) + ' → ' + escapeHtml(r.destino) + '</td><td>' + r.total + '</td>';
    h += '<td><button type="button" data-edit-ped="' + r.id + '">Editar</button> <button type="button" data-del-ped="' + r.id + '">Eliminar</button></td></tr>';
  });
  h += '</tbody></table>';
  document.getElementById('ped-tabla-wrap').innerHTML = h;

  document.querySelectorAll('[data-del-ped]').forEach(function (b) {
    b.addEventListener('click', async function () {
      if (!confirm('¿Eliminar pedido?')) return;
      try {
        await apiFetch('pedidos.php?id=' + encodeURIComponent(b.getAttribute('data-del-ped')), { method: 'DELETE' });
        showMsg('Pedido eliminado.', true);
        loadPedidos();
      } catch (e) { showMsg(e.message, false); }
    });
  });

  document.querySelectorAll('[data-edit-ped]').forEach(function (b) {
    b.addEventListener('click', async function () {
      var id = b.getAttribute('data-edit-ped');
      var row = rows.find(function (x) { return String(x.id) === String(id); });
      if (!row) return;
      document.getElementById('ped-form-wrap').innerHTML =
        '<h3>Editar pedido #' + row.id + '</h3>' +
        '<div class="adm__grid">' +
        '<div><label>origen</label><input id="pe-origen" type="text"></div>' +
        '<div><label>destino</label><input id="pe-destino" type="text"></div>' +
        '<div><label>fecha_viaje</label><input id="pe-fecha" type="date"></div>' +
        '<div><label>servicio</label><select id="pe-srv"><option value="economico">economico</option><option value="ejecutivo">ejecutivo</option><option value="premium">premium</option></select></div>' +
        '<div><label>pasajeros</label><input id="pe-pas" type="number" min="1" max="30"></div>' +
        '<div><label>empresa</label><input id="pe-emp" type="text"></div>' +
        '<div><label>horario</label><input id="pe-hor" type="text"></div>' +
        '<div><label>precio_unitario</label><input id="pe-precio" type="number" step="0.01"></div>' +
        '<div><label>nombre_pasajero</label><input id="pe-nom" type="text"></div>' +
        '<div><label>tipo_documento</label><input id="pe-tdoc" type="text"></div>' +
        '<div><label>numero_documento</label><input id="pe-ndoc" type="text"></div>' +
        '<div><label>correo</label><input id="pe-mail" type="email"></div>' +
        '<div><label>telefono</label><input id="pe-tel" type="text"></div>' +
        '<div><label>direccion</label><input id="pe-dir" type="text"></div>' +
        '</div><button type="button" id="pe-guardar">Guardar cambios</button>';

      document.getElementById('pe-origen').value = row.origen;
      document.getElementById('pe-destino').value = row.destino;
      document.getElementById('pe-fecha').value = row.fecha_viaje;
      document.getElementById('pe-srv').value = row.servicio;
      document.getElementById('pe-pas').value = row.pasajeros;
      document.getElementById('pe-emp').value = row.empresa;
      document.getElementById('pe-hor').value = row.horario;
      document.getElementById('pe-precio').value = row.precio_unitario;
      document.getElementById('pe-nom').value = row.nombre_pasajero;
      document.getElementById('pe-tdoc').value = row.tipo_documento;
      document.getElementById('pe-ndoc').value = row.numero_documento;
      document.getElementById('pe-mail').value = row.correo;
      document.getElementById('pe-tel').value = row.telefono;
      document.getElementById('pe-dir').value = row.direccion || '';

      document.getElementById('pe-guardar').addEventListener('click', async function () {
        var body = {
          id: row.id,
          origen: document.getElementById('pe-origen').value.trim(),
          destino: document.getElementById('pe-destino').value.trim(),
          fecha_viaje: document.getElementById('pe-fecha').value,
          servicio: document.getElementById('pe-srv').value,
          pasajeros: parseInt(document.getElementById('pe-pas').value, 10),
          empresa: document.getElementById('pe-emp').value.trim(),
          horario: document.getElementById('pe-hor').value.trim(),
          precio_unitario: parseFloat(document.getElementById('pe-precio').value),
          nombre_pasajero: document.getElementById('pe-nom').value.trim(),
          tipo_documento: document.getElementById('pe-tdoc').value.trim(),
          numero_documento: document.getElementById('pe-ndoc').value.trim(),
          correo: document.getElementById('pe-mail').value.trim(),
          telefono: document.getElementById('pe-tel').value.trim(),
          direccion: document.getElementById('pe-dir').value.trim()
        };
        try {
          await apiFetch('pedidos.php', { method: 'PUT', body: JSON.stringify(body) });
          showMsg('Pedido actualizado. Total recalculado en servidor.', true);
          loadPedidos();
        } catch (e) { showMsg(e.message, false); }
      });
    });
  });
}
document.getElementById('ped-refrescar').addEventListener('click', function () { loadPedidos().catch(function (e) { showMsg(e.message, false); }); });

// ─── Empresas ───────────────────────────────────────────────────
async function loadEmpresas() {
  const j = await apiFetch('empresas_viaje.php', { method: 'GET' });
  const rows = j.data || [];
  var h = '<table><thead><tr><th>id</th><th>nombre</th><th>horario</th><th>precio</th><th></th></tr></thead><tbody>';
  rows.forEach(function (r) {
    h += '<tr><td>' + r.id + '</td><td>' + escapeHtml(r.nombre) + '</td><td>' + escapeHtml(r.horario) + '</td><td>' + r.precio_unitario + '</td>';
    h += '<td><button type="button" data-del-emp="' + r.id + '">Eliminar</button></td></tr>';
  });
  h += '</tbody></table>';
  document.getElementById('emp-tabla-wrap').innerHTML = h;
  document.querySelectorAll('[data-del-emp]').forEach(function (b) {
    b.addEventListener('click', async function () {
      if (!confirm('¿Eliminar empresa?')) return;
      try {
        await apiFetch('empresas_viaje.php?id=' + encodeURIComponent(b.getAttribute('data-del-emp')), { method: 'DELETE' });
        showMsg('Empresa eliminada.', true);
        loadEmpresas();
      } catch (e) { showMsg(e.message, false); }
    });
  });
}
document.getElementById('emp-crear').addEventListener('click', async function () {
  var body = {
    nombre: document.getElementById('emp-nombre').value.trim(),
    horario: document.getElementById('emp-horario').value.trim(),
    salida: document.getElementById('emp-salida').value.trim(),
    llegada: document.getElementById('emp-llegada').value.trim(),
    duracion: document.getElementById('emp-duracion').value.trim(),
    precio_unitario: parseFloat(document.getElementById('emp-precio').value)
  };
  try {
    await apiFetch('empresas_viaje.php', { method: 'POST', body: JSON.stringify(body) });
    showMsg('Empresa creada.', true);
    loadEmpresas();
  } catch (e) { showMsg(e.message, false); }
});
document.getElementById('emp-refrescar').addEventListener('click', function () { loadEmpresas().catch(function (e) { showMsg(e.message, false); }); });

// ─── Ciudades ───────────────────────────────────────────────────
async function loadCiudades() {
  const j = await apiFetch('ciudades.php', { method: 'GET' });
  const rows = j.data || [];
  var h = '<table><thead><tr><th>id</th><th>nombre</th><th></th></tr></thead><tbody>';
  rows.forEach(function (r) {
    h += '<tr><td>' + escapeHtml(r.id) + '</td><td>' + escapeHtml(r.nombre) + '</td>';
    h += '<td><button type="button" data-del-ciu="' + escapeHtml(r.id) + '">Eliminar</button></td></tr>';
  });
  h += '</tbody></table>';
  document.getElementById('ciu-tabla-wrap').innerHTML = h;
  document.querySelectorAll('[data-del-ciu]').forEach(function (b) {
    b.addEventListener('click', async function () {
      if (!confirm('¿Eliminar ciudad?')) return;
      try {
        await apiFetch('ciudades.php?id=' + encodeURIComponent(b.getAttribute('data-del-ciu')), { method: 'DELETE' });
        showMsg('Ciudad eliminada.', true);
        loadCiudades();
      } catch (e) { showMsg(e.message, false); }
    });
  });
}
document.getElementById('ciu-crear').addEventListener('click', async function () {
  var body = { id: document.getElementById('ciu-id').value.trim(), nombre: document.getElementById('ciu-nombre').value.trim() };
  try {
    await apiFetch('ciudades.php', { method: 'POST', body: JSON.stringify(body) });
    showMsg('Ciudad creada.', true);
    loadCiudades();
  } catch (e) { showMsg(e.message, false); }
});
document.getElementById('ciu-refrescar').addEventListener('click', function () { loadCiudades().catch(function (e) { showMsg(e.message, false); }); });

// ─── Init ───────────────────────────────────────────────────────
Promise.all([loadCotizaciones(), loadPedidos(), loadEmpresas(), loadCiudades()]).catch(function (e) {
  showMsg('No se pudo conectar a la API. Verifique PHP, MySQL y api/config.php. ' + e.message, false);
});
