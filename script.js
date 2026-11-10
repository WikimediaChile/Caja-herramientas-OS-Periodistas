
(function () {
  'use strict';

  function iniciarCaja() {
    const raiz = document.getElementById('caja-periodistas');
    if (!raiz || raiz.dataset.inicializada === 'true') return;
    raiz.dataset.inicializada = 'true';
    document.body.classList.add('wmcl-caja-page');

    // Categorías organizadas según tareas periodísticas (claves estables para los filtros).
    const CATEGORIAS = {
      ori: 'Contextualizar y evaluar fuentes',
      src: 'Analizar ediciones y visualizaciones',
      dat: 'Explorar datos y perfiles',
      arc: 'Consultar archivos y documentos',
      img: 'Buscar recursos multimedia',
      geo: 'Explorar mapas y lugares'
    };

    const HERRAMIENTAS = [
      {
        id: 'wp', categoria: 'ori', nombre: 'Wikipedia en español', wikimedia: true,
        descripcion: 'Enciclopedia libre y colaborativa que permite consultar información, explorar referencias y revisar el historial de edición de sus artículos.',
        uso: 'Utiliza los artículos como punto de partida para investigar un tema. Revisa las referencias, consulta el historial para conocer qué cambios se han realizado y contrasta los datos con sus fuentes originales.',
        url: 'https://es.wikipedia.org'
      },
      {
        id: 'fn', categoria: 'ori', nombre: 'Guía de fuentes fiables', wikimedia: true, tipo: 'guia',
        descripcion: 'Recurso de la comunidad de Wikipedia que explica los criterios utilizados para evaluar la fiabilidad de las fuentes citadas en artículos enciclopédicos.',
        uso: 'Consulta los criterios sobre fiabilidad, independencia y verificabilidad de las fuentes. Pueden ayudarte a evaluar la información que encuentras en Wikipedia, aunque no reemplazan los estándares de verificación periodística.',
        url: 'https://es.wikipedia.org/wiki/Wikipedia:Fuentes_fiables'
      },
      {
        id: 'xt', categoria: 'src', nombre: 'XTools', wikimedia: true,
        descripcion: 'Conjunto de herramientas que permite consultar estadísticas sobre artículos, ediciones y cuentas de usuario en los proyectos Wikimedia.',
        uso: 'Busca un artículo de Wikipedia para explorar su historial de contribuciones, identificar las cuentas que lo han editado y observar patrones de actividad. Recuerda que una cuenta de usuario no necesariamente identifica a una persona.',
        url: 'https://xtools.wmcloud.org'
      },
      {
        id: 'pv', categoria: 'src', nombre: 'Pageviews Analysis', wikimedia: true,
        descripcion: 'Herramienta para analizar y comparar las visualizaciones de páginas de Wikipedia y otros proyectos Wikimedia a lo largo del tiempo.',
        uso: 'Busca un artículo y selecciona un período para observar sus visualizaciones. Puedes comparar varios artículos e identificar aumentos que coincidan con acontecimientos noticiosos. Las cifras representan visualizaciones, no personas únicas, y no explican por sí solas sus causas.',
        url: 'https://pageviews.wmcloud.org'
      },
      {
        id: 'wd', categoria: 'dat', nombre: 'Wikidata', wikimedia: true,
        descripcion: 'Base de conocimiento libre y colaborativa que reúne datos estructurados sobre personas, organizaciones, lugares, acontecimientos y otros temas.',
        uso: 'Busca una persona, institución o lugar para explorar sus datos, relaciones e identificadores. Revisa las referencias disponibles y contrasta la información con las fuentes originales antes de utilizarla en una investigación.',
        url: 'https://www.wikidata.org'
      },
      {
        id: 'wq', categoria: 'dat', nombre: 'Wikidata Query Service', wikimedia: true,
        descripcion: 'Servicio que permite realizar consultas sobre los datos de Wikidata para identificar relaciones, generar listados y explorar información estructurada.',
        uso: 'Comienza con las consultas de ejemplo disponibles en la plataforma. Puedes adaptarlas para explorar conjuntos de datos, como instituciones de un país o personas que han ocupado determinados cargos. Los resultados dependerán de la información disponible en Wikidata.',
        url: 'https://query.wikidata.org'
      },
      {
        id: 're', categoria: 'dat', nombre: 'Reasonator', wikimedia: true,
        descripcion: 'Herramienta que presenta la información de Wikidata en fichas visuales más fáciles de explorar, incluyendo relaciones entre personas, lugares y otros elementos.',
        uso: 'Busca un elemento de Wikidata o introduce su identificador, como Q123, para visualizar sus datos y relaciones. Utilízala para explorar conexiones y vuelve a Wikidata para revisar las declaraciones y sus referencias.',
        url: 'https://reasonator.toolforge.org'
      },
      {
        id: 'sc', categoria: 'dat', nombre: 'Scholia', wikimedia: true,
        descripcion: 'Herramienta que genera perfiles académicos de investigadores, instituciones, publicaciones y temas de investigación a partir de los datos disponibles en Wikidata.',
        uso: 'Busca especialistas o temas para explorar publicaciones, colaboraciones y áreas de investigación. Puede ayudarte a identificar posibles fuentes expertas, pero sus registros son incompletos y deben contrastarse con otras fuentes académicas.',
        url: 'https://scholia.toolforge.org'
      },
      {
        id: 'ws', categoria: 'arc', nombre: 'Wikisource', wikimedia: true,
        descripcion: 'Biblioteca digital colaborativa que reúne obras y documentos publicados, disponibles en dominio público o bajo licencias libres.',
        uso: 'Busca libros, discursos, cartas y otros textos históricos para consultar sus contenidos. Cuando esté disponible, revisa la reproducción del documento original y comprueba los datos bibliográficos antes de citarlo.',
        url: 'https://es.wikisource.org'
      },
      {
        id: 'wb', categoria: 'arc', nombre: 'Wayback Machine', wikimedia: false,
        descripcion: 'Archivo digital de Internet Archive que permite consultar capturas de páginas web realizadas en diferentes momentos.',
        uso: 'Introduce la dirección de un sitio para buscar versiones anteriores y comparar cambios en su contenido. Puede ser útil para recuperar información modificada o eliminada. Recuerda que no todas las páginas ni todas sus versiones están archivadas.',
        url: 'https://archive.org/web/'
      },
      {
        id: 'wc', categoria: 'img', nombre: 'Wikimedia Commons', wikimedia: true,
        descripcion: 'Repositorio colaborativo de imágenes, audios, videos y otros archivos multimedia disponibles bajo licencias libres o en dominio público.',
        uso: 'Busca fotografías, ilustraciones y otros archivos para acompañar una publicación. Antes de reutilizarlos, revisa su procedencia, autoría, licencia y condiciones de atribución en la página de cada archivo.',
        url: 'https://commons.wikimedia.org'
      },
      {
        id: 'wi', categoria: 'img', nombre: 'WISE', wikimedia: true,
        descripcion: 'Buscador experimental que permite encontrar imágenes y videos de Wikimedia Commons mediante descripciones de su contenido visual.',
        uso: 'Describe en palabras lo que quieres encontrar, por ejemplo, una persona frente a un edificio. La herramienta analiza el contenido visual, pero su cobertura es limitada, por lo que conviene complementar los resultados con la búsqueda de Wikimedia Commons.',
        url: 'https://wise.wmcloud.org/'
      },
      {
        id: 'ov', categoria: 'img', nombre: 'Openverse', wikimedia: false,
        descripcion: 'Buscador de imágenes y archivos de audio publicados en Internet bajo licencias Creative Commons o identificados como dominio público.',
        uso: 'Busca recursos multimedia y utiliza los filtros de licencia según tus necesidades. Antes de publicar, consulta la fuente original para verificar la licencia, la autoría y las condiciones de reutilización.',
        url: 'https://openverse.org'
      },
      {
        id: 'osm', categoria: 'geo', nombre: 'OpenStreetMap', wikimedia: false,
        descripcion: 'Proyecto colaborativo de cartografía abierta que reúne información geográfica sobre calles, edificios, rutas y otros elementos del territorio.',
        uso: 'Explora lugares y puntos de referencia para contextualizar geográficamente una noticia. También puedes consultar detalles del entorno, pero verifica la actualización y exactitud de los datos antes de utilizarlos como evidencia.',
        url: 'https://www.openstreetmap.org'
      }
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

    // Actualizar los botones existentes conserva el foco y permite recorrerlos con Tab.
    function actualizarFiltros() {
      chips.querySelectorAll('button[data-categoria]').forEach((boton) => {
        boton.setAttribute('aria-pressed', String(boton.dataset.categoria === estado.categoria));
      });
    }

    function renderizarHerramientas() {
      const consulta = normalizar(estado.consulta.trim());
      const resultados = HERRAMIENTAS.filter((herramienta) => {
        if (estado.categoria === 'wm' && !herramienta.wikimedia) return false;
        if (estado.categoria !== 'all' && estado.categoria !== 'wm' && herramienta.categoria !== estado.categoria) return false;
        const texto = normalizar([herramienta.nombre, herramienta.descripcion, herramienta.uso, CATEGORIAS[herramienta.categoria]].join(' '));
        return texto.includes(consulta);
      });

      contador.textContent = `${resultados.length} ${resultados.length === 1 ? 'recurso' : 'recursos'}`;
      grilla.innerHTML = resultados.length ? resultados.map((herramienta) => `
        <article class="cp-card">
          <div class="cp-card-meta">
            <span class="cp-tag ${herramienta.wikimedia ? 'cp-tag-wm' : ''}">${herramienta.wikimedia ? 'Ecosistema Wikimedia' : 'Herramienta externa'}</span>
            <span class="cp-tag cp-tag-topic">${escapar(CATEGORIAS[herramienta.categoria])}</span>
            ${herramienta.tipo === 'guia' ? '<span class="cp-tag cp-tag-type">Guía de consulta</span>' : ''}
          </div>
          <h3>${escapar(herramienta.nombre)}</h3>
          <p>${escapar(herramienta.descripcion)}</p>
          <details><summary>Cómo usarla</summary><p>${escapar(herramienta.uso)}</p></details>
          <div class="cp-card-actions"><a class="cp-tool-link" href="${escapar(herramienta.url)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${escapar(herramienta.nombre)} en una pestaña nueva">Abrir sitio <span aria-hidden="true">↗</span></a></div>
        </article>`).join('') : `
          <div class="cp-empty">
            <h3>No encontramos recursos con esa búsqueda</h3>
            <p>Prueba con otra palabra o vuelve a explorar todas las herramientas.</p>
            <button type="button" class="cp-reset" id="cp-reset">Ver todos los recursos</button>
          </div>`;
    }

    chips.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button[data-categoria]');
      if (!boton || !chips.contains(boton)) return;
      estado.categoria = boton.dataset.categoria;
      actualizarFiltros();
      renderizarHerramientas();
    });
    buscar.addEventListener('input', (evento) => {
      estado.consulta = evento.target.value;
      renderizarHerramientas();
    });
    grilla.addEventListener('click', (evento) => {
      if (!evento.target.closest('#cp-reset')) return;
      estado.consulta = '';
      estado.categoria = 'all';
      buscar.value = '';
      actualizarFiltros();
      renderizarHerramientas();
      buscar.focus(); // El botón desaparece; devolver el foco a un control útil.
    });

    // El menú móvil se comporta como un diálogo: retiene Tab y devuelve el foco al cerrar.
    const botonMenu = raiz.querySelector('#cp-mobile-toggle');
    const menu = raiz.querySelector('#cp-mobile-menu');
    const cerrarMenu = raiz.querySelector('#cp-mobile-close');
    const marca = raiz.querySelector('.cp-brand');
    let focoAnterior = null;

    function alternarMenu(abierto, devolverFoco = true) {
      if (abierto === !menu.hidden) return;
      if (abierto) focoAnterior = document.activeElement;
      menu.hidden = !abierto;
      botonMenu.setAttribute('aria-expanded', String(abierto));
      document.body.classList.toggle('wmcl-caja-menu-abierto', abierto);
      if (abierto) {
        cerrarMenu.focus();
      } else if (devolverFoco && focoAnterior && focoAnterior.isConnected) {
        focoAnterior.focus();
      }
    }

    botonMenu.addEventListener('click', () => alternarMenu(true));
    cerrarMenu.addEventListener('click', () => alternarMenu(false));
    menu.addEventListener('click', (evento) => {
      if (evento.target.closest('a')) alternarMenu(false, false);
    });
    document.addEventListener('keydown', (evento) => {
      if (menu.hidden) return;
      if (evento.key === 'Escape') {
        evento.preventDefault();
        alternarMenu(false);
        return;
      }
      if (evento.key !== 'Tab') return;
      const elementos = Array.from(menu.querySelectorAll('a[href], button:not([disabled])'));
      if (!elementos.length) return;
      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];
      if (evento.shiftKey && (document.activeElement === primero || !menu.contains(document.activeElement))) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && (document.activeElement === ultimo || !menu.contains(document.activeElement))) {
        evento.preventDefault();
        primero.focus();
      }
    });
    document.addEventListener('focusin', (evento) => {
      if (!menu.hidden && !menu.contains(evento.target)) cerrarMenu.focus();
    });
    // Evitar que el menú permanezca abierto si cambia a la vista de escritorio.
    const vistaMovil = window.matchMedia('(max-width: 1050px)');
    vistaMovil.addEventListener('change', (evento) => {
      if (!evento.matches && !menu.hidden) {
        alternarMenu(false, false);
        marca.focus();
      }
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
