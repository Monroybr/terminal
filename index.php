<?php $pagina = 'index'; ?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Sistema web Terminal para consultar horarios, cotizar viajes y comprar tiquetes de transporte terrestre en Colombia de forma rápida y segura.">
    <meta name="keywords" content="terminal, compra de tiquetes, transporte terrestre, rutas de buses, horarios, cotizaciones, viajes en Colombia">
    <meta name="author" content="Liseth Dayana Monroy Briñez">
    <title>Terminal | Compra de tiquetes</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300,400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="build/css/app.css">
  </head>

  <body>
    <?php require __DIR__ . '/includes/header.php'; ?>

    <!--seccion de bienvenida-->
    <section class="bienvenida">
      <div class="bienvenida__cont">
        <h2 class="bienvenida__heading">Bienvenido a la Terminal</h2>
        <p class="bienvenida__texto">Consulta horarios, cotiza viajes y compra de tiquetes.</p>

        <div class="botones">
          <a href="tiquetes.php" class="botones__btn botones__btn--azul">Comprar Tíquetes</a>
          <a href="servicios.php" class="botones__btn botones__btn--trans">Servicios</a>
      
        </div>
      </div> 
    </section>

    <!--Seccion por qué elegirnos?-->
    <section class="elegirnos">
      <h2 class="elegirnos__titulo">¿Por qué elegirnos?</h2>
      <div class="elegirnos__grid">
        <div class="items">
          <img src="build/img/puntualidad.svg" class="items__icono" alt="icono puntualidad">
          <h3 class="items__titulo">Puntualidad garantizada</h3>
          <p class="items__texto">Salidas y llegadas a tiempo. Monitoreamos cada viaje.</p>
        </div>
        <div class="items">
          <img src="build/img/cobertura.svg" class="items__icono" alt="icono cobertura">
          <h3 class="items__titulo">Cobertura Nacional</h3>
          <p class="items__texto">Conectamos más de 150 destinos en todo el país.</p>
        </div>
        <div class="items">
          <img src="build/img/viajesSeguros.svg" class="items__icono" alt="icono viajes">
          <h3 class="items__titulo">Viajes seguros</h3>
          <p class="items__texto">Unidades modernas con todas las medidas de seguridad.</p>
        </div>
        <div class="items">
          <img src="build/img/wifi.svg" class="items__icono" alt="icono wifi">
          <h3 class="items__titulo">Servicios premium</h3>
          <p class="items__texto">WiFi gratis, asientos reclinables y entretenimiento.</p>
        </div>
      </div>
    </section>

    <!--seccion destinos-->
    <section class="destinos">
      <div class="destinos__contenedor">
        <h2 class="destinos__titulo">Destinos populares para viajar</h2>

        <div class="destinos__grid">
          <article class="destino">
            <div class="destino__header">
              <h3 class="destino__ciudad">Neiva</h3>
              <p class="destino__precio">$40.000</p>
            </div>
            <div class="destino__detalle">
              <div class="destino__tiempo">
                <img src="build/img/calendar.svg" alt="Duración viaje Neiva" class="destino__icono">
                <span>4h 15min</span>
              </div>
            </div>
            <a href="tiquetes.php" class="destino__boton">Comprar Ahora</a>
          </article>

          <article class="destino">
            <div class="destino__header">
              <h3 class="destino__ciudad">Bogotá</h3>
              <p class="destino__precio">$60.000</p>
            </div>
            <div class="destino__detalle">
              <div class="destino__tiempo">
                <img src="build/img/calendar.svg" alt="Duración viaje Bogota" class="destino__icono">
                <span>4h 15min</span>
              </div>
            </div>
            <a href="tiquetes.php" class="destino__boton">Comprar Ahora</a>
          </article>

          <article class="destino">
            <div class="destino__header">
              <h3 class="destino__ciudad">Cali</h3>
              <p class="destino__precio">$80.000</p>
            </div>
            <div class="destino__detalle">
              <div class="destino__tiempo">
                <img src="build/img/calendar.svg" alt="Duración viaje Cali" class="destino__icono">
                <span>6h 45min</span>
              </div>
            </div>
            <a href="tiquetes.php" class="destino__boton">Comprar Ahora</a>
          </article>

          <article class="destino">
            <div class="destino__header">
              <h3 class="destino__ciudad">Barranquilla</h3>
              <p class="destino__precio">$60.000</p>
            </div>
            <div class="destino__detalle">
              <div class="destino__tiempo">
                <img src="build/img/calendar.svg" alt="Duración viaje Barranquilla" class="destino__icono">
                <span>6h 45min</span>
              </div>
            </div>
            <a href="tiquetes.php" class="destino__boton">Comprar Ahora</a>
          </article>

          <article class="destino">
            <div class="destino__header">
              <h3 class="destino__ciudad">Pereira</h3>
              <p class="destino__precio">$80.000</p>
            </div>
            <div class="destino__detalle">
              <div class="destino__tiempo">
                <img src="build/img/calendar.svg" alt="Duración viaje Pereira" class="destino__icono">
                <span>6h 45min</span>
              </div>
            </div>
            <a href="tiquetes.php" class="destino__boton">Comprar Ahora</a>
          </article>

          <article class="destino">
            <div class="destino__header">
              <h3 class="destino__ciudad">Medellín</h3>
              <p class="destino__precio">$40.000</p>
            </div>
            <div class="destino__detalle">
              <div class="destino__tiempo">
                <img src="build/img/calendar.svg" alt="Duración viaje Medellin" class="destino__icono">
                <span>6h 45min</span>
              </div>
            </div>
            <a href="tiquetes.php" class="destino__boton">Comprar Ahora</a>
          </article>
        </div>
      </div>
    </section>

    <!--seccion viajar-->
    <div class="viajar">
      <div class="viajar__grid">
        <div class="viajar__contenido">
          <h3 class="viajar__titulo">Viajar Nunca Fue Tan Fácil</h3>
          <p class="viajar__texto">Con Terminal, tienes acceso a los mejores servicios de transporte terrestre. 
          Compra tiquetes en línea, consulta horarios en tiempo real y disfruta de un viaje cómodo y seguro.</p>
          <ul class="viajar__lista">
            <li>Compra en línea sin comisiones</li>
            <li>Cambios y devoluciones flexibles</li>
            <li>Atención al cliente 24/7</li>
            <li>Unidades modernas y confortables</li>
          </ul>
        </div>
        <div class="viajar__imagen">
          <img src="build/img/header2.webp" loading="lazy">
        </div>
      </div>
    </div>

    <?php require __DIR__ . '/includes/footer.php'; ?>
