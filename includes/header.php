<?php
$pagina = $pagina ?? 'inicio';

$paginas = [
    'index'       => ['archivo' => 'index.php',        'titulo' => 'Inicio'],
    'horarios'    => ['archivo' => 'horarios.php',     'titulo' => 'Horarios'],
    'servicios'   => ['archivo' => 'servicios.php',    'titulo' => 'Servicios'],
    'vehiculos'   => ['archivo' => 'vehiculos.php',    'titulo' => 'Vehículos'],
    'empresas'    => ['archivo' => 'empresas.php',     'titulo' => 'Empresas'],
    'cotizaciones'=> ['archivo' => 'cotizaciones.php', 'titulo' => 'Cotizaciones'],
    'tiquetes'    => ['archivo' => 'tiquetes.php',     'titulo' => 'Tiquetes'],
    'contacto'    => ['archivo' => 'contacto.php',     'titulo' => 'Contacto'],
];
?>
<!--seccion header-->
<header>
  <div class="header">
    <div class="header__contenedor">
      <div class="header__barra">
        <div class="header__logo">
          <img class="header__img" src="build/img/logo.svg" alt="logo del sistema web terminal">
          <h1 class="header__titulo">Terminal</h1>
        </div>
        <button class="header__menu-btn" id="menuBtn" type="button" aria-label="Abrir menú" aria-expanded="false">
          <span class="header__menu-linea"></span>
          <span class="header__menu-linea"></span>
          <span class="header__menu-linea"></span>
        </button>
        <nav class="navegacion" id="navegacion">
<?php foreach ($paginas as $key => $pag): ?>
          <a href="<?= $pag['archivo'] ?>" class="navegacion__link<?= $pagina === $key ? ' activo' : '' ?>"><?= $pag['titulo'] ?></a>
<?php endforeach; ?>
        </nav>
      </div>
    </div>
  </div>
</header>
<script>
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuBtn');
  const navegacion = document.getElementById('navegacion');
  if (menuBtn && navegacion) {
    menuBtn.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      navegacion.classList.toggle('navegacion--abierta');
    });
  }
});
</script>
