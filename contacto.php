<?php $pagina = 'contacto'; ?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Contáctanos para recibir soporte sobre horarios, cotizaciones, compra de tiquetes y servicios de la terminal de transporte.">
    <meta name="keywords" content="contacto terminal, soporte terminal, atención al cliente, compra de tiquetes, transporte terrestre">
    <meta name="author" content="Liseth Dayana Monroy Briñez">
    <title>Contacto y soporte | Terminal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300,400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="build/css/app.css">
  </head>

  <body>
    <?php require __DIR__ . '/includes/header.php'; ?>

    <!--seccion contacto-->
    <main class="contacto">
      <section class="contacto__encabezado">
        <div class="contacto__contenedor">
          <h1 class="contacto__heading">Contacto y atención al cliente</h1>
          <p class="contacto__descripcion">Comunícate con la terminal para resolver dudas sobre horarios, rutas, cotizaciones, servicios y compra de tiquetes.</p>
        </div>
      </section>

      <section class="contacto__contenido">
        <div class="contacto__contenedor contacto__contenedor--grid">
          <div class="contacto__col contacto__col--info">
            <h2 class="contacto__subtitulo">Información de Contacto</h2>
            <p class="contacto__texto">Si tienes alguna pregunta, comentario o necesitas asistencia, no dudes en contactarnos.
            Nuestro equipo está disponible para ayudarte.
            </p>

            <ul class="contacto__lista">
              <li class="contacto__item">
                <span class="contacto__icono">📍</span>
                <div class="contacto__item-detalle">
                  <h3 class="contacto__item-titulo">Dirección</h3>
                  <p class="contacto__item-texto">Avenida Principal 123<br>78001, Colombia</p>
                </div>
              </li>

              <li class="contacto__item">
                <span class="contacto__icono">📞</span>
                <div class="contacto__item-detalle">
                  <h3 class="contacto__item-titulo">Teléfono</h3>
                  <p class="contacto__item-texto">General: +57 322 786 12 15<br>Atención al Cliente: +57 300 123 75 89</p>
                </div>
              </li>

              <li class="contacto__item">
                <span class="contacto__icono">✉️</span>
                <div class="contacto__item-detalle">
                  <h3 class="contacto__item-titulo">Correo Electrónico</h3>
                  <p class="contacto__item-texto">General: contacto@terminal.com.co<br>Soporte: soporte@terminal.com.co
                  </p>
                </div>
              </li>

              <li class="contacto__item">
                <span class="contacto__icono">⏰</span>
                <div class="contacto__item-detalle">
                  <h3 class="contacto__item-titulo">Horario de Atención</h3>
                  <p class="contacto__item-texto">Terminal: Abierto 24/7, todo el año.<br>Atención al Cliente: Lun - Dom: 6:00 - 22:00
                  </p>
                </div>
              </li>
            </ul>

            <figure class="contacto__imagen">
              <img src="build/img/header.webp" alt="Punto de información y atención al usuario en la terminal" loading="lazy">
            </figure>
          </div>

          <div class="contacto__col contacto__col--formulario">
            <div class="contacto__tarjeta">
              <h2 class="contacto__subtitulo contacto__subtitulo--formulario">Envíanos un Mensaje</h2>
              <p class="contacto__texto contacto__texto--formulario">Responderemos tu solicitud lo antes posible.</p>
              <form class="contacto__formulario">
                <div class="contacto__campo">
                  <label for="nombre" class="contacto__label">Nombre Completo *</label>
                  <input id="nombre" type="text" class="contacto__input" placeholder="Tu nombre" required maxlength="30">
                </div>

                <div class="contacto__campo">
                  <label for="email" class="contacto__label">Correo Electrónico *</label>
                  <input id="email" type="email" class="contacto__input" placeholder="tucorreo@ejemplo.com" required maxlength="100">
                </div>

                <div class="contacto__campo">
                  <label for="telefono" class="contacto__label">Teléfono *</label>
                  <input id="telefono" type="tel" inputmode="numeric" pattern="[0-9]{10}" class="contacto__input" placeholder="3000000000" required maxlength="10">
                </div>

                <div class="contacto__campo">
                  <label for="asunto" class="contacto__label">Asunto *</label>
                  <input id="asunto" type="text" class="contacto__input" placeholder="Motivo de tu mensaje" required maxlength="30">
                </div>

                <div class="contacto__campo">
                  <label for="mensaje" class="contacto__label">Mensaje *</label>
                  <textarea id="mensaje" class="contacto__input contacto__input--textarea" rows="4" placeholder="Escribe tu mensaje aquí" required maxlength="200"></textarea>
                </div>

                <button type="submit" class="contacto__boton">
                  Enviar Mensaje
                </button>

                <p class="contacto__nota-campos">* Campos obligatorios</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>

    <?php require __DIR__ . '/includes/footer.php'; ?>
    <script src="src/js/contacto.js" defer></script>
