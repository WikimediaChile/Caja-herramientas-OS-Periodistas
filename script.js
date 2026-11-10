
(function () {
  'use strict';

  function iniciarCaja() {
    const raiz = document.getElementById('caja-periodistas');
    if (!raiz || raiz.dataset.inicializada === 'true') return;
    raiz.dataset.inicializada = 'true';
    document.body.classList.add('wmcl-caja-page');

    const CATEGORIAS = {
      ori: 'Orientarte y contextualizar',
      src: 'Rastrear autoría y fuentes',
      dat: 'Datos y perfiles',
      arc: 'Archivo y documentos',
      img: 'Imágenes y licencias',
      geo: 'Mapas y ubicación'
    };

    // Contenido de las 14 herramientas conservado del repositorio original.
    // wikimedia: true = proyecto o herramienta del ecosistema Wikimedia.
    const HERRAMIENTAS = [
      { id: 'wp', categoria: 'ori', nombre: 'Wikipedia en español', wikimedia: true, descripcion: 'Enciclopedia colaborativa con historial público de cada cambio.', uso: 'Úsala como mapa: parte por las referencias del final. En el menú Herramientas, “Información de la página” muestra cuántas ediciones y editores tiene.', url: 'https://es.wikipedia.org' },
      { id: 'fn', categoria: 'ori', nombre: 'Guía de fuentes fiables', wikimedia: true, descripcion: 'Criterios de la comunidad para decidir qué fuentes sirven en Wikipedia.', uso: 'Léela para entender por qué una afirmación se mantiene o se elimina, y aplica los mismos criterios a tu reporteo.', url: 'https://es.wikipedia.org/wiki/Wikipedia:Fuentes_fiables' },
      { id: 'xt', categoria: 'src', nombre: 'XTools', wikimedia: true, descripcion: 'Estadísticas de páginas y editores de los proyectos Wikimedia.', uso: 'Revisa quiénes han editado más un artículo, cuándo se concentraron los cambios y qué cuentas participaron.', url: 'https://xtools.wmcloud.org' },
      { id: 'pv', categoria: 'src', nombre: 'Pageviews Analysis', wikimedia: true, descripcion: 'Visitas diarias de cualquier artículo de Wikipedia.', uso: 'Compara artículos y busca picos de interés que coincidan con hechos noticiosos.', url: 'https://pageviews.wmcloud.org' },
      { id: 'wd', categoria: 'dat', nombre: 'Wikidata', wikimedia: true, descripcion: 'Base de datos estructurada de personas, organizaciones, cargos y fechas.', uso: 'Cada dato indica su fuente. Parte desde la ficha de una persona u organización y cruza la información.', url: 'https://www.wikidata.org' },
      { id: 'wq', categoria: 'dat', nombre: 'Wikidata Query Service', wikimedia: true, descripcion: 'Consultas sobre los datos estructurados de Wikidata.', uso: 'Genera listas que serían lentas de armar a mano. Empieza desde los ejemplos que ofrece el sitio.', url: 'https://query.wikidata.org' },
      { id: 're', categoria: 'dat', nombre: 'Reasonator', wikimedia: true, descripcion: 'Muestra las fichas de Wikidata en un formato legible.', uso: 'Pega el código de un ítem de Wikidata (por ejemplo, Q123) para leerlo como una ficha ordenada.', url: 'https://reasonator.toolforge.org' },
      { id: 'sc', categoria: 'dat', nombre: 'Scholia', wikimedia: true, descripcion: 'Perfiles de investigadores, instituciones y publicaciones construidos desde Wikidata.', uso: 'Encuentra especialistas y sus publicaciones cuando buscas voces expertas para una nota.', url: 'https://scholia.toolforge.org' },
      { id: 'ws', categoria: 'arc', nombre: 'Wikisource', wikimedia: true, descripcion: 'Textos y documentos históricos en dominio público.', uso: 'Consulta documentos completos y cita desde el original, no desde fragmentos.', url: 'https://es.wikisource.org' },
      { id: 'wb', categoria: 'arc', nombre: 'Wayback Machine', wikimedia: false, descripcion: 'Archivo de versiones antiguas de páginas web, del Internet Archive.', uso: 'Recupera lo que cambió o desapareció y archiva toda página antes de citarla.', url: 'https://archive.org/web/' },
      { id: 'wc', categoria: 'img', nombre: 'Wikimedia Commons', wikimedia: true, descripcion: 'Repositorio de imágenes, audios y videos con licencias libres.', uso: 'Cada archivo indica su licencia y cómo atribuir al autor. Revisa siempre la página del archivo.', url: 'https://commons.wikimedia.org' },
      { id: 'wi', categoria: 'img', nombre: 'WISE', wikimedia: true, descripcion: 'Buscador experimental que encuentra medios de Commons según su contenido visual.', uso: 'Describe lo que buscas. En su fase inicial solo indexaba una parte de Commons (“Media of the Day”), así que complementa con la búsqueda de Commons.', url: 'https://wise.wmcloud.org/' },
      { id: 'ov', categoria: 'img', nombre: 'Openverse', wikimedia: false, descripcion: 'Buscador de imágenes y audios con licencias abiertas.', uso: 'Filtra por licencia y copia la atribución sugerida.', url: 'https://openverse.org' },
      { id: 'osm', categoria: 'geo', nombre: 'OpenStreetMap', wikimedia: false, descripcion: 'Mapa colaborativo y abierto del mundo, construido por una comunidad de personas voluntarias.', uso: 'Confirma calles, edificios y puntos de referencia para ubicar dónde ocurre un hecho y dar contexto geográfico a tu nota.', url: 'https://www.openstreetmap.org' }
    ];

    const buscar = raiz.querySelector('#cp-q');
    const chips = raiz.querySelector('#cp-chips');
    const contador = raiz.querySelector('#cp-count');
    const grilla = raiz.querySelector('#cp-grid');
    const estado = { consulta: '', categoria: 'all' };

    const escapar = (texto) => String(texto).replace(/[&<>"']/g, (caracter) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[caracter]);

    const normalizar = (texto) => texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    function renderizarFiltros() {
      const filtros = [['all', 'Todas'], ...Object.entries(CATEGORIAS), ['wm', 'Solo ecosistema Wikimedia']];
      chips.innerHTML = filtros.map(([clave, etiqueta]) =>
        `<button type="button" class="cp-chip" data-categoria="${escapar(clave)}" aria-pressed="${estado.categoria === clave}">${escapar(etiqueta)}</button>`
      ).join('');
    }

    function renderizarHerramientas() {
      const consulta = normalizar(estado.consulta.trim());
      const resultados = HERRAMIENTAS.filter((herramienta) => {
        if (estado.categoria === 'wm' && !herramienta.wikimedia) return false;
        if (estado.categoria !== 'all' && estado.categoria !== 'wm' && herramienta.categoria !== estado.categoria) return false;
        const texto = normalizar([herramienta.nombre, herramienta.descripcion, herramienta.uso, CATEGORIAS[herramienta.categoria]].join(' '));
        return texto.includes(consulta);
      });

      contador.textContent = `${resultados.length} ${resultados.length === 1 ? 'herramienta' : 'herramientas'}`;
      grilla.innerHTML = resultados.length ? resultados.map((herramienta) => `
        <article class="cp-card">
          <div class="cp-card-meta">
            <span class="cp-tag ${herramienta.wikimedia ? 'cp-tag-wm' : ''}">${herramienta.wikimedia ? 'Ecosistema Wikimedia' : 'Aliada externa'}</span>
            <span class="cp-tag cp-tag-topic">${escapar(CATEGORIAS[herramienta.categoria])}</span>
          </div>
          <h3>${escapar(herramienta.nombre)}</h3>
          <p>${escapar(herramienta.descripcion)}</p>
          <details><summary>Cómo usarla</summary><p>${escapar(herramienta.uso)}</p></details>
          <div class="cp-card-actions"><a class="cp-tool-link" href="${escapar(herramienta.url)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${escapar(herramienta.nombre)} en una pestaña nueva">Abrir sitio <span aria-hidden="true">↗</span></a></div>
        </article>`).join('') : '<p class="cp-empty">No encontramos herramientas con esa búsqueda. Prueba con otra palabra o quita el filtro.</p>';
    }

    chips.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button[data-categoria]');
      if (!boton || !chips.contains(boton)) return;
      estado.categoria = boton.dataset.categoria;
      renderizarFiltros();
      renderizarHerramientas();
    });
    buscar.addEventListener('input', (evento) => {
      estado.consulta = evento.target.value;
      renderizarHerramientas();
    });

    // Menú móvil, independiente de los scripts del tema de WordPress.
    const botonMenu = raiz.querySelector('#cp-mobile-toggle');
    const menu = raiz.querySelector('#cp-mobile-menu');
    const cerrarMenu = raiz.querySelector('#cp-mobile-close');
    const alternarMenu = (abierto) => {
      menu.hidden = !abierto;
      botonMenu.setAttribute('aria-expanded', String(abierto));
      botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
      if (abierto) cerrarMenu.focus(); else botonMenu.focus();
    };
    botonMenu.addEventListener('click', () => alternarMenu(true));
    cerrarMenu.addEventListener('click', () => alternarMenu(false));
    menu.addEventListener('click', (evento) => {
      if (evento.target.closest('a')) alternarMenu(false);
    });
    raiz.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && !menu.hidden) alternarMenu(false);
    });

    renderizarFiltros();
    renderizarHerramientas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarCaja);
  } else {
    iniciarCaja();
  }
})();
