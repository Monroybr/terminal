<?php $pagina = 'vehiculos'; ?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Conoce la flota de vehículos de la Terminal: buses, busetas, vans, taxis y vehículos de carga para transporte terrestre seguro en Colombia.">
    <meta name="keywords" content="vehículos terminal, flota de buses, busetas, vans, taxis, transporte terrestre, vehículos de pasajeros">
    <meta name="author" content="Liseth Dayana Monroy Briñez">
    <title>Vehículos | Terminal de transporte</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300,400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="build/css/app.css">
  </head>

  <body>
    <?php require __DIR__ . '/includes/header.php'; ?>

    <!--seccion vehiculos-->
    <section class="vehiculos fondo">
      <div class="vehiculos__contenedor">
        <h1 class="vehiculos__heading">Flota de Vehículos</h1>
        <p class="vehiculos__descripcion">Conoce los buses, busetas, vans, taxis y vehículos de carga disponibles para viajes seguros, cómodos y eficientes.</p>
      </div>
    </section>

    <section class="vehiculo__contenido separacion">
      <div class="vehiculo__grid">
        <div class="items">
          <img src="build/img/people.svg" class="items__icono" alt="icono people">
          <h3 class="items__titulo">Capacidad Variable</h3>
          <p class="items__texto">Desde 4 hasta 50 pasajeros</p>
        </div>
        <div class="items">
          <img src="build/img/technology.svg" class="items__icono" alt="icono technology">
          <h3 class="items__titulo">Última Tecnología</h3>
          <p class="items__texto">Vehículos modelo 2023-2024</p>
        </div>
        <div class="items">
          <img src="build/img/viajesSeguros.svg" class="items__icono" alt="icono security">
          <h3 class="items__titulo">Máxima Seguridad</h3>
          <p class="items__texto">Mantenimiento preventivo constante</p>
        </div>
        <div class="items">
          <img src="build/img/wifi.svg" class="items__icono" alt="icono wofo">
          <h3 class="items__titulo">Conectividad</h3>
          <p class="items__texto">WiFi disponible en buses</p>
        </div>
      </div>
    </section>

    <!--seccion tipos de buses-->
    <section class="vehiculo-card">
      <div class="vehiculo-card__container">
        <figure class="vehiculo-card__media">
          <img class="vehiculo-card__img" src="build/img/camion.webp" alt="imagen camion" loading="lazy" />
        </figure>
    
        <div class="vehiculo-card__content">
          <header class="vehiculo-card__header">
            <h2 class="vehiculo-card__title">Camión</h2>
            <span class="vehiculo-card__badge">Carga hasta 25 toneladas</span>
          </header>
    
          <h3 class="vehiculo-card__subtitle">Mercedes-Benz Actros 2551</h3>
    
          <p class="vehiculo-card__text">
            Vehículo de carga pesada ideal para transporte de mercancías voluminosas y pesadas a larga distancia.
          </p>
    
          <h4 class="vehiculo-card__label">Características Principales:</h4>
    
          <ul class="vehiculo-card__list">
            <li class="vehiculo-card__item">Motor diésel de alta potencia</li>
            <li class="vehiculo-card__item">Sistema de frenos ABS</li>
            <li class="vehiculo-card__item">Cabina ergonómica</li>
            <li class="vehiculo-card__item">GPS y rastreo satelital</li>
          </ul>
        </div>
      </div>

      <div class="vehiculo-card__container">
        <figure class="vehiculo-card__media">
          <img class="vehiculo-card__img" src="build/img/buses.webp" alt="imagen gacela" loading="lazy">
        </figure>
    
        <div class="vehiculo-card__content">
          <header class="vehiculo-card__header">
            <h2 class="vehiculo-card__title">Gacela</h2>
            <span class="vehiculo-card__badge">15 pasajeros</span>
          </header>
    
          <h3 class="vehiculo-card__subtitle">Chevrolet NPR 2024</h3>
    
          <p class="vehiculo-card__text">
            Vehículo de pasajeros tipo furgón, cómodo y espacioso, perfecto para rutas cortas y medianas distancias.
          </p>
    
          <h4 class="vehiculo-card__label">Características Principales:</h4>
    
          <ul class="vehiculo-card__list">
            <li class="vehiculo-card__item">Aire acondicionado  </li>
            <li class="vehiculo-card__item">Asientos reclinables</li>
            <li class="vehiculo-card__item">Portaequipajes amplio</li>
            <li class="vehiculo-card__item">Sistema de sonido</li>
          </ul>
        </div>
      </div>

      <div class="vehiculo-card__container">
        <figure class="vehiculo-card__media">
          <img class="vehiculo-card__img" src="build/img/bus.webp" alt="imagen buseta" loading="lazy">
        </figure>
    
        <div class="vehiculo-card__content">
          <header class="vehiculo-card__header">
            <h2 class="vehiculo-card__title">Buseta</h2>
            <span class="vehiculo-card__badge">25-30 pasajeros</span>
          </header>
    
          <h3 class="vehiculo-card__subtitle">Hino FC9J 2024</h3>
    
          <p class="vehiculo-card__text">
            Vehículo mediano ideal para transporte urbano e intermunicipal con excelente relación capacidad-confort.
          </p>
    
          <h4 class="vehiculo-card__label">Características Principales:</h4>
    
          <ul class="vehiculo-card__list">
            <li class="vehiculo-card__item">Suspensión neumática</li>
            <li class="vehiculo-card__item">Baño a bordo</li>
            <li class="vehiculo-card__item">Iluminación LED</li>
            <li class="vehiculo-card__item">Salidas de emergencia</li>
          </ul>
        </div>
      </div>

      <div class="vehiculo-card__container">
        <figure class="vehiculo-card__media">
          <img class="vehiculo-card__img" src="build/img/buses.webp" alt="imagen bus" loading="lazy">
        </figure>
    
        <div class="vehiculo-card__content">
          <header class="vehiculo-card__header">
            <h2 class="vehiculo-card__title">Bus</h2>
            <span class="vehiculo-card__badge">45-50 pasajeros</span>
          </header>
    
          <h3 class="vehiculo-card__subtitle">Scania K410 2024</h3>
    
          <p class="vehiculo-card__text">
            Bus de lujo para viajes de larga distancia con todas las comodidades y tecnología de última generación.
          </p>
    
          <h4 class="vehiculo-card__label">Características Principales:</h4>
    
          <ul class="vehiculo-card__list">
            <li class="vehiculo-card__item">Asientos reclinables 180°</li>
            <li class="vehiculo-card__item">WiFi a bordo</li>
            <li class="vehiculo-card__item">Pantallas individuales</li>
            <li class="vehiculo-card__item">Baño</li>
          </ul>
        </div>
      </div>

      <div class="vehiculo-card__container">
        <figure class="vehiculo-card__media">
          <img class="vehiculo-card__img" src="build/img/van.webp" alt="imagen van " loading="lazy">
        </figure>
    
        <div class="vehiculo-card__content">
          <header class="vehiculo-card__header">
            <h2 class="vehiculo-card__title">Aerovan</h2>
            <span class="vehiculo-card__badge">12 pasajeros</span>
          </header>
    
          <h3 class="vehiculo-card__subtitle">Hyundai H350 Executive</h3>
    
          <p class="vehiculo-card__text">
            Van ejecutiva premium para servicios especiales, corporativos y traslados exclusivos con máximo confort.
          </p>
    
          <h4 class="vehiculo-card__label">Características Principales:</h4>
    
          <ul class="vehiculo-card__list">
            <li class="vehiculo-card__item">Asientos en cuero ejecutivo</li>
            <li class="vehiculo-card__item">Control de clima individual</li>
            <li class="vehiculo-card__item">Sistema de entretenimiento</li>
            <li class="vehiculo-card__item">Servicio personalizado</li>
          </ul>
        </div>
      </div>

      <div class="vehiculo-card__container">
        <figure class="vehiculo-card__media">
          <img class="vehiculo-card__img" src="build/img/taxi.webp" alt="imagen taxi" loading="lazy">
        </figure>
    
        <div class="vehiculo-card__content">
          <header class="vehiculo-card__header">
            <h2 class="vehiculo-card__title">Taxi</h2>
            <span class="vehiculo-card__badge">4 pasajeros</span>
          </header>
    
          <h3 class="vehiculo-card__subtitle">Toyota Corolla 2024</h3>
    
          <p class="vehiculo-card__text">
            Servicio de taxi disponible 24/7 para traslados rápidos, cómodos y seguros dentro y fuera de la ciudad.
          </p>
    
          <h4 class="vehiculo-card__label">Características Principales:</h4>
    
          <ul class="vehiculo-card__list">
            <li class="vehiculo-card__item">Aire acondicionado</li>
            <li class="vehiculo-card__item">GPS y taxímetro digital</li>
            <li class="vehiculo-card__item">Conductor certificado</li>
            <li class="vehiculo-card__item">Pago con tarjeta</li>
          </ul>
        </div>
      </div>
    </section>

    <?php require __DIR__ . '/includes/footer.php'; ?>
