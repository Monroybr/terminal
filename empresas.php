<?php $pagina = 'empresas'; ?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Conoce las empresas de transporte vinculadas a la terminal: buses, taxis y servicios intermunicipales en Colombia.">
    <meta name="keywords" content="empresas de transporte, terminal, buses Colombia, transporte intermunicipal, horarios de buses">
    <meta name="author" content="Liseth Dayana Monroy Briñez">
    <title>Empresas de transporte | Terminal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300,400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="build/css/app.css">
  </head>

  <body>
    <?php require __DIR__ . '/includes/header.php'; ?>

    <!--seccion empresas-->
    <section class="empresas">
      <div class="empresas__hero">
        <div class="empresas__hero-content">
          <h2 class="empresas__heading">Empresas de transporte vinculadas a la terminal</h2>
          <p class="empresas__descripcion">Descubre las principales empresas de transporte terrestre con rutas nacionales, servicios seguros y flotas modernas.</p>
        </div>

      <!--barra flotante-->
      <div class="empresas__stats">
        <div class="empresas__stat">
          <span class="empresas__stat-num">6+</span>
          <span class="empresas__stat-label">Empresas Asociadas</span>
        </div>
        <div class="empresas__stat">
          <span class="empresas__stat-num">150+</span>
          <span class="empresas__stat-label">Rutas Disponibles</span>
        </div>
        <div class="empresas__stat">
          <span class="empresas__stat-num">300+</span>
          <span class="empresas__stat-label">Vehículos en Flota</span>
        </div>
        <div class="empresas__stat">
          <span class="empresas__stat-num">4.7</span>
          <span class="empresas__stat-label">Calificación Promedio</span>
        </div>
      </div>
    </div>

    <!--empresas vinculadas-->
    <div class="empresas__grid">
      
      <article class="empresa-card">
        <div class="empresa-card__media">
          <img class="empresa-card__img" src="build/img/empresa06.webp" alt="Empresa de transporte Cootranshuila" loading="lazy">
          <span class="empresa-card__rating">★ 4.8</span>
        </div>
  
        <div class="empresa-card__body">
          <header class="empresa-card__head">
            <h3 class="empresa-card__title">Cootranshuila</h3>
            <span class="empresa-card__badge">✓</span>
          </header>
  
          <p class="empresa-card__text">
            Cooperativa de transportadores del Huila con más de 40 años de experiencia. Líder en rutas nacionales con servicio de alta calidad
          </p>
  
          <h4 class="empresa-card__label">Tipos de Vehículos:</h4>
          <div class="empresa-card__chips">
            <span class="empresa-card__chip">Buses</span>
            <span class="empresa-card__chip">Taxis</span>
          </div>
  
          <h4 class="empresa-card__label">Rutas Principales:</h4>
          <ul class="empresa-card__list">
            <li class="empresa-card__item">Neiva - Bogotá</li>
            <li class="empresa-card__item">Neiva - Cali</li>
            <li class="empresa-card__item">Neiva - Medellín</li>
            <li class="empresa-card__item">Neiva - Pitalito</li>
          </ul>
  
          <a class="empresa-card__btn" href="horarios.php" title="Ver horarios de buses disponibles">Ver horarios de buses</a>
        </div>
      </article>

      <article class="empresa-card">
        <div class="empresa-card__media">
          <img class="empresa-card__img" src="build/img/empresa02.webp" alt="Empresa de transporte Coomotor Huila" loading="lazy">
          <span class="empresa-card__rating">★ 4.8</span>
        </div>
  
        <div class="empresa-card__body">
          <header class="empresa-card__head">
            <h3 class="empresa-card__title">Coomotor Huila</h3>
            <span class="empresa-card__badge">✓</span>
          </header>
  
          <p class="empresa-card__text">
            Cooperativa multiactiva de transportadores con servicios integrales. Reconocida por su puntualidad y atención al cliente.
          </p>
  
          <h4 class="empresa-card__label">Tipos de Vehículos:</h4>
          <div class="empresa-card__chips">
            <span class="empresa-card__chip">Buses</span>
            <span class="empresa-card__chip">Taxis</span>
          </div>
  
          <h4 class="empresa-card__label">Rutas Principales:</h4>
          <ul class="empresa-card__list">
            <li class="empresa-card__item">Neiva - Bogotá</li>
            <li class="empresa-card__item">Neiva - Cali</li>
            <li class="empresa-card__item">Neiva - Medellín</li>
            <li class="empresa-card__item">Neiva - Pitalito</li>
          </ul>
  
          <a class="empresa-card__btn" href="horarios.php" title="Ver horarios de buses disponibles">Ver horarios de buses</a>
        </div>
      </article>

      <article class="empresa-card">
        <div class="empresa-card__media">
          <img class="empresa-card__img" src="build/img/empresa03.webp" alt="Empresa de transporte Taxis verdes" loading="lazy">
          <span class="empresa-card__rating">★ 4.8</span>
        </div>
  
        <div class="empresa-card__body">
          <header class="empresa-card__head">
            <h3 class="empresa-card__title">Taxis Verdes</h3>
            <span class="empresa-card__badge">✓</span>
          </header>
  
          <p class="empresa-card__text">
            Servicio de taxi intermunicipal con amplia cobertura en la región sur. Conductores certificados y vehículos modernos.
          </p>
  
          <h4 class="empresa-card__label">Tipos de Vehículos:</h4>
          <div class="empresa-card__chips">
            <span class="empresa-card__chip">Taxis</span>
            <span class="empresa-card__chip">Aerovan</span>
          </div>
  
          <h4 class="empresa-card__label">Rutas Principales:</h4>
          <ul class="empresa-card__list">
            <li class="empresa-card__item">Neiva - Bogotá</li>
            <li class="empresa-card__item">Neiva - Cali</li>
            <li class="empresa-card__item">Neiva - Medellín</li>
            <li class="empresa-card__item">Neiva - Pitalito</li>
          </ul>
  
          <a class="empresa-card__btn" href="horarios.php" title="Ver horarios de buses disponibles">Ver horarios de buses</a>
        </div>
      </article>

      <article class="empresa-card">
        <div class="empresa-card__media">
          <img class="empresa-card__img" src="build/img/empresa04.webp" alt="Empresa de transporte Express bolivariano" loading="lazy">
          <span class="empresa-card__rating">★ 4.8</span>
        </div>
  
        <div class="empresa-card__body">
          <header class="empresa-card__head">
            <h3 class="empresa-card__title">Express Bolivariano</h3>
            <span class="empresa-card__badge">✓</span>
          </header>
  
          <p class="empresa-card__text">
            Una de las empresas más reconocidas de Colombia con más de 75 años de trayectoria. Excelencia en servicio de transporte.
          </p>
  
          <h4 class="empresa-card__label">Tipos de Vehículos:</h4>
          <div class="empresa-card__chips">
            <span class="empresa-card__chip">Buses Premium</span>
            <span class="empresa-card__chip">Busetas</span>
          </div>
  
          <h4 class="empresa-card__label">Rutas Principales:</h4>
          <ul class="empresa-card__list">
            <li class="empresa-card__item">Neiva - Bogotá</li>
            <li class="empresa-card__item">Neiva - Cali</li>
            <li class="empresa-card__item">Neiva - Medellín</li>
            <li class="empresa-card__item">Neiva - Pitalito</li>
          </ul>
  
          <a class="empresa-card__btn" href="horarios.php" title="Ver horarios de buses disponibles">Ver horarios de buses</a>
        </div>
      </article>

      <article class="empresa-card">
        <div class="empresa-card__media">
          <img class="empresa-card__img" src="build/img/empresa05.webp" alt="Empresa de transporte Expresso palmira" loading="lazy">
          <span class="empresa-card__rating">★ 4.8</span>
        </div>
  
        <div class="empresa-card__body">
          <header class="empresa-card__head">
            <h3 class="empresa-card__title">Expresso Palmira</h3>
            <span class="empresa-card__badge">✓</span>
          </header>
  
          <p class="empresa-card__text">
            Empresa vallecaucana con amplia cobertura en el suroccidente colombiano. Servicio confiable y frecuente.
          </p>
  
          <h4 class="empresa-card__label">Tipos de Vehículos:</h4>
          <div class="empresa-card__chips">
            <span class="empresa-card__chip">Buses</span>
            <span class="empresa-card__chip">Busetas</span>
          </div>
  
          <h4 class="empresa-card__label">Rutas Principales:</h4>
          <ul class="empresa-card__list">
            <li class="empresa-card__item">Neiva - Bogotá</li>
            <li class="empresa-card__item">Neiva - Cali</li>
            <li class="empresa-card__item">Neiva - Medellín</li>
            <li class="empresa-card__item">Neiva - Pitalito</li>
          </ul>
  
          <a class="empresa-card__btn" href="horarios.php" title="Ver horarios de buses disponibles">Ver horarios de buses</a>
        </div>
      </article>

      <article class="empresa-card">
        <div class="empresa-card__media">
          <img class="empresa-card__img" src="build/img/empresa06.webp" alt="Empresa de transporte Velotax" loading="lazy">
          <span class="empresa-card__rating">★ 4.8</span>
        </div>
  
        <div class="empresa-card__body">
          <header class="empresa-card__head">
            <h3 class="empresa-card__title">Velotax</h3>
            <span class="empresa-card__badge">✓</span>
          </header>
  
          <p class="empresa-card__text">
            Empresa especializada en transporte rápido tipo van. Ideal para viajes ejecutivos y grupos pequeños.
          </p>
  
          <h4 class="empresa-card__label">Tipos de Vehículos:</h4>
          <div class="empresa-card__chips">
            <span class="empresa-card__chip">Gacelas</span>
            <span class="empresa-card__chip">Aerovan</span>
          </div>
  
          <h4 class="empresa-card__label">Rutas Principales:</h4>
          <ul class="empresa-card__list">
            <li class="empresa-card__item">Neiva - Bogotá</li>
            <li class="empresa-card__item">Neiva - Cali</li>
            <li class="empresa-card__item">Neiva - Medellín</li>
            <li class="empresa-card__item">Neiva - Pitalito</li>
          </ul>
  
          <a class="empresa-card__btn" href="horarios.php" title="Ver horarios de buses disponibles">Ver horarios de buses</a>
        </div>
      </article>
  
    </div>
 
    </section>

    <?php require __DIR__ . '/includes/footer.php'; ?>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Terminal",
        "url": "http://localhost/terminal",
        "description": "Terminal de transporte con empresas vinculadas para viajes en Colombia",
        "areaServed": "Colombia"
      }
    </script>
