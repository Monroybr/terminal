<?php $pagina = 'horarios'; ?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Consulta horarios de salida y llegada de buses, empresas de transporte, destinos y plataformas disponibles en el sistema web Terminal.">
    <meta name="keywords" content="horarios de buses, terminal de transporte, salidas de buses, llegadas, empresas de transporte, rutas">
    <meta name="author" content="Liseth Dayana Monroy Briñez">
    <title>Horarios | Terminal de transporte</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300,400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="build/css/app.css">
  </head>

  <body>
    <?php require __DIR__ . '/includes/header.php'; ?>

    <!--seccion horarios-->
    <main class="horarios ">
      <section class="horarios__encabezado">
        <div class="horarios__contenedor">
          <h1 class="horarios__heading">Horarios de Salida</h1>
          <p class="horarios__descripcion">
             Consulta horarios actualizados, destinos, empresas de transporte y plataformas disponibles para planificar tu viaje.
          </p>

          <div class="horarios__buscador">
            <div class="horarios__campo-busqueda">
              <span class="horarios__icono-busqueda">🔍</span>
              <input
                type="search"
                id="horariosBusqueda"
                class="horarios__input"
                placeholder="Buscar por destino o empresa..."
                autocomplete="off"
                aria-label="Buscar por destino o empresa"
              >
            </div>

            <div class="horarios__filtro">
              <label class="horarios__filtro-label visually-hidden" for="horariosFiltroDestino">Filtrar por destino</label>
              <select id="horariosFiltroDestino" class="horarios__select horarios__select--dropdown" aria-label="Filtrar por ciudad de destino">
                <option value="">Todos los destinos</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section class="horarios__tabla-seccion">
        <div class="horarios__contenedor">
          <div class="horarios__tabla-wrap">
          <table class="horarios__tabla" aria-label="Tabla de horarios de salida y llegada de buses">
            <thead class="horarios__cabecera">
              <tr class="horarios__fila horarios__fila--cabecera">
                <th class="horarios__columna">Destino</th>
                <th class="horarios__columna">Salida</th>
                <th class="horarios__columna">Llegada</th>
                <th class="horarios__columna">Empresa</th>
                <th class="horarios__columna">Plataforma</th>
                <th class="horarios__columna">Estado</th>
              </tr>
            </thead>
            <tbody id="horariosTablaBody" class="horarios__cuerpo"></tbody>
          </table>
          </div>

          <p id="horariosMensajeVacio" class="horarios__mensaje-vacio" hidden></p>

          <section class="horarios__nota">
            <h2 class="horarios__nota-titulo">Nota importante:</h2>
            <ul class="horarios__nota-lista">
              <li class="horarios__nota-item">
                Los horarios están sujetos a cambios sin previo aviso.
              </li>
              <li class="horarios__nota-item">
                Se recomienda llegar 30 minutos antes de la hora de salida.
              </li>
              <li class="horarios__nota-item">
                Consulta con el personal para información sobre retrasos.
              </li>
              <li class="horarios__nota-item">
                Los horarios mostrados son para el día de hoy.
              </li>
            </ul>
          </section>
        </div>
      </section>
    </main>

    <?php require __DIR__ . '/includes/footer.php'; ?>
    <script src="src/js/horarios.js" defer></script>
