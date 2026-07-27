<?php
declare(strict_types=1);
require_once __DIR__ . '/auth.php';
admin_require_login();

if (isset($_GET['logout'])) {
    admin_logout();
    header('Location: login.php');
    exit;
}

require_once __DIR__ . '/../api/bootstrap.php';
$csrf_token = csrf_generate();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="<?php echo htmlspecialchars($csrf_token, ENT_QUOTES, 'UTF-8'); ?>">
  <title>Administración — Terminal</title>
  <link rel="stylesheet" href="../build/css/app.css">
  <style>
    .adm { max-width: 1100px; margin: 2rem auto; padding: 0 1rem 3rem; font-family: Lexend, system-ui, sans-serif; }
    .adm h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .adm__tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1.25rem 0; }
    .adm__tab { padding: 0.5rem 1rem; border: 1px solid #ccc; background: #f7f7f7; cursor: pointer; border-radius: 6px; }
    .adm__tab--on { background: #1e3a5f; color: #fff; border-color: #1e3a5f; }
    .adm__panel { display: none; }
    .adm__panel--on { display: block; }
    .adm table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-top: 1rem; }
    .adm th, .adm td { border: 1px solid #ddd; padding: 0.4rem 0.5rem; text-align: left; vertical-align: top; }
    .adm th { background: #eee; }
    .adm__msg { margin: 0.75rem 0; padding: 0.6rem 0.75rem; border-radius: 6px; }
    .adm__msg--ok { background: #e6f4ea; color: #1e4620; }
    .adm__msg--err { background: #fce8e6; color: #5f1a1a; }
    .adm__grid { display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); margin-top: 1rem; }
    .adm label { display: block; font-size: 0.8rem; margin-bottom: 0.2rem; }
    .adm input, .adm select { width: 100%; padding: 0.45rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .adm__actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem; }
    .adm button { padding: 0.45rem 0.9rem; cursor: pointer; border-radius: 6px; border: 1px solid #1e3a5f; background: #1e3a5f; color: #fff; }
    .adm button.adm--ghost { background: #fff; color: #1e3a5f; }
    .adm a { color: #1e3a5f; }
  </style>
</head>
<body class="adm">
  <p><a href="../index.php">← Volver al sitio</a> &nbsp;|&nbsp; <a href="?logout=1">Cerrar sesión</a></p>
  <h1>Panel de administración (CRUD)</h1>
  <p>Gestión de datos en MySQL mediante PHP. Las tablas se crean con <code>database/terminal.sql</code> en phpMyAdmin.</p>
  <div id="mensaje"></div>

  <div class="adm__tabs" role="tablist">
    <button type="button" class="adm__tab adm__tab--on" data-tab="cot">Cotizaciones</button>
    <button type="button" class="adm__tab" data-tab="ped">Pedidos / tiquetes</button>
    <button type="button" class="adm__tab" data-tab="emp">Empresas (viajes)</button>
    <button type="button" class="adm__tab" data-tab="ciu">Ciudades</button>
  </div>

  <section id="panel-cot" class="adm__panel adm__panel--on" data-panel="cot">
    <h2>Cotizaciones</h2>
    <div class="adm__grid">
      <div><label>origen</label><input id="cot-origen" type="text"></div>
      <div><label>destino</label><input id="cot-destino" type="text"></div>
      <div><label>fecha_ida</label><input id="cot-fecha" type="date"></div>
      <div><label>fecha_regreso (opcional)</label><input id="cot-regreso" type="date"></div>
      <div><label>pasajeros</label><input id="cot-pas" type="number" min="1" max="30" value="1"></div>
      <div><label>servicio</label>
        <select id="cot-srv">
          <option value="economico">economico</option>
          <option value="ejecutivo">ejecutivo</option>
          <option value="premium">premium</option>
        </select></div>
    </div>
    <div class="adm__actions">
      <button type="button" id="cot-crear">Crear</button>
      <button type="button" class="adm--ghost" id="cot-refrescar">Refrescar listado</button>
    </div>
    <div id="cot-tabla-wrap"></div>
    <div id="cot-edit-wrap" style="margin-top:1.5rem;"></div>
  </section>

  <section id="panel-ped" class="adm__panel" data-panel="ped">
    <h2>Pedidos</h2>
    <p class="adm__hint">Para crear pedidos use la página pública de tiquetes; aquí puede editar o eliminar registros.</p>
    <div class="adm__actions">
      <button type="button" class="adm--ghost" id="ped-refrescar">Refrescar listado</button>
    </div>
    <div id="ped-tabla-wrap"></div>
    <div id="ped-form-wrap" style="margin-top:1.5rem;"></div>
  </section>

  <section id="panel-emp" class="adm__panel" data-panel="emp">
    <h2>Empresas de viaje</h2>
    <div class="adm__grid">
      <div><label>nombre</label><input id="emp-nombre" type="text"></div>
      <div><label>horario</label><input id="emp-horario" type="text" placeholder="06:00 - 13:30"></div>
      <div><label>salida</label><input id="emp-salida" type="text"></div>
      <div><label>llegada</label><input id="emp-llegada" type="text"></div>
      <div><label>duracion</label><input id="emp-duracion" type="text"></div>
      <div><label>precio_unitario</label><input id="emp-precio" type="number" step="0.01"></div>
    </div>
    <div class="adm__actions">
      <button type="button" id="emp-crear">Crear</button>
      <button type="button" class="adm--ghost" id="emp-refrescar">Refrescar</button>
    </div>
    <div id="emp-tabla-wrap"></div>
  </section>

  <section id="panel-ciu" class="adm__panel" data-panel="ciu">
    <h2>Ciudades</h2>
    <div class="adm__grid">
      <div><label>id (slug)</label><input id="ciu-id" type="text" placeholder="bogota"></div>
      <div><label>nombre</label><input id="ciu-nombre" type="text" placeholder="Bogotá"></div>
    </div>
    <div class="adm__actions">
      <button type="button" id="ciu-crear">Crear</button>
      <button type="button" class="adm--ghost" id="ciu-refrescar">Refrescar</button>
    </div>
    <div id="ciu-tabla-wrap"></div>
  </section>

  <script src="admin.js"></script>
</body>
</html>
