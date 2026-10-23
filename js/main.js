(() => {
  "use strict";

  // Catálogo de gorras. Los datos viven en `data/gorras.json` (fetch), no aquí,
  // para que el swap de fotos se reduzca a subir el archivo `img/<id>.jpg` y
  // que el JSON apunte a él. HTML/CSS/JS no se tocan por ahí.
  // Contrato de cada elemento:
  //   id      TEXT PK  -> img/<id>.jpg
  //   cat     texto    -> "deportivas" | "clásicas"
  //   name    texto    -> nombre visible
  //   color   texto    -> color/divisor
  //   price   texto    -> precio (ej. "45.000")
  //   note    texto    -> subtítulo conciso
  //   sale    boolean  -> para descuentos; el CSS/imagen se encarga del badge

  async function loadCatalog() {
    try {
      const res = await fetch("data/gorras.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("No se pudo cargar data/gorras.json", err);
      return [];
    }
  }

  const grid = document.getElementById("grid");
  const empty = document.getElementById("empty");
  let activeFilter = "todas";
  let catalog = [];

  // SVG placeholder (gorra genérica). Solo se muestra mientras no llegue la
  // foto real del cliente. Cuando llegue, el <img> tiene `src` apuntando a
  // `img/<id>.jpg` y la clase `card__img--load` se activa al cargar.
  function placeholderSVG() {
    return `<svg viewBox="0 0 240 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="300" fill="#221b13"/>
      <rect x="45" y="218" width="150" height="18" rx="9" fill="#e07b39"/>
      <path d="M55 218 Q120 120 185 218 L185 234 Q120 160 55 234 Z" fill="url(#pg)"/>
      <rect x="80" y="204" width="80" height="12" rx="6" fill="#221b13"/>
      <circle cx="120" cy="158" r="14" fill="#e07b39"/>
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#e07b39"/>
          <stop offset="1" stop-color="#221b13"/>
        </linearGradient>
      </defs>
    </svg>`;
  }

  function cardHtml(p) {
    return `
      <article class="card card--enter" data-cat="${p.cat}">
        <div class="card__img-wrap">
          <div class="card__placeholder">
            ${placeholderSVG()}
            <span>Foto en camino</span>
          </div>
          <img class="card__img" src="${p.img || "img/${p.id}.jpg"}"
               alt="${p.name}" loading="lazy" />
        </div>
        <div class="card__body">
          <span class="card__cat">${p.cat}</span>
          <h3 class="card__name">${p.name}</h3>
          <p class="card__price">${p.price}</p>
          <p class="muted" style="margin:0;font-size:0.82rem;">${p.note}</p>
          <button class="card__buy" data-id="${p.id}">Ver detalle →</button>
        </div>
      </article>`;
  }

  function render(items) {
    grid.innerHTML = items.map(cardHtml).join("");
    empty.hidden = items.length > 0;
    document.querySelectorAll(".card--enter").forEach((el) => {
      el.classList.remove("is-visible");
    });
  }

  // ---------- Filtros ----------
  document.querySelectorAll(".filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeFilter = btn.dataset.filter;
      const items = activeFilter === "todas"
        ? catalog
        : catalog.filter((p) => p.cat === activeFilter);
      render(items);
    });
  });

  // ---------- Botones "Ver detalle" ----------
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".card__buy");
    if (!btn) return;
    alert(`Detalle de la gorra ${btn.dataset.id}. (En este base se muestra un aviso.)`);
  });

  // ---------- Imágenes: elevar el placeholder al cargar ----------
  grid.addEventListener("load", (e) => {
    const img = e.target;
    const card = img.closest(".card");
    if (card) img.classList.add("card__img--load");
  }, true);

  // ---------- Reveal en scroll ----------
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          ent.target.classList.add("is-visible");
          cardObserver.unobserve(ent.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // ---------- Header fijo + menú móvil ----------
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  let navOpen = false;

  toggle.addEventListener("click", () => {
    navOpen = !navOpen;
    toggle.setAttribute("aria-expanded", navOpen);
    document.querySelector(".nav").classList.toggle("is-open", navOpen);
    toggle.setAttribute("aria-label", navOpen ? "Cerrar menú" : "Abrir menú");
  });

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      navOpen = false;
      toggle.setAttribute("aria-expanded", "false");
      document.querySelector(".nav").classList.remove("is-open");
    });
  });

  // Scroll suave para los links internos
  document.querySelectorAll("a[href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href === "#" || href === "") return;
      const t = document.querySelector(href);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Animación de profundidad del hero (solo si el usuario no pidió reducir el
  // movimiento).
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".hero__layer").forEach((el) => {
      el.style.animation = "none";
    });
  }

  // Año dinámico
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Inicialización ----------
  loadCatalog().then((data) => {
    catalog = data;
    render(catalog);
  });
})();
