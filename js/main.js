/* =========================================================
   La ruta del fotón — navegación, pestañas y modo exposición
   ========================================================= */
(() => {
  "use strict";

  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Barra de progreso ---------- */
  function initProgress() {
    const bar = document.getElementById("progress-bar");
    if (!bar) return;

    let ticking = false;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.width = `${(progress * 100).toFixed(2)}%`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Navegación activa ---------- */
  function initNavSpy() {
    const links = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
    if (!links.length) return;

    const byId = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const header = document.querySelector(".site-header");
    let currentId = "";
    let ticking = false;

    const setActive = (id) => {
      if (id === currentId) return;
      currentId = id;
      links.forEach((link) => link.removeAttribute("aria-current"));
      const link = byId.get(id);
      if (link) link.setAttribute("aria-current", "true");
    };

    const update = () => {
      const offset = (header ? header.offsetHeight : 70) + 18;
      let activeId = "";

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= offset) {
          activeId = section.id;
        }
      }

      setActive(activeId);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------- Pestañas de los tres procesos ---------- */
  function initTabs() {
    const tablist = document.querySelector(".tablist");
    if (!tablist) return;

    const tabs = Array.from(tablist.querySelectorAll("[role='tab']"));
    const panels = tabs
      .map((tab) => document.getElementById(tab.getAttribute("aria-controls")))
      .filter(Boolean);

    const activate = (tab, moveFocus) => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      });

      panels.forEach((panel) => {
        panel.classList.remove("is-active");
        panel.hidden = panel.id !== tab.getAttribute("aria-controls");
      });

      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (panel) {
        // Reinicia las animaciones al volver a una pestaña.
        panel.hidden = false;
        void panel.offsetWidth;
        panel.classList.add("is-active");
      }

      if (moveFocus) tab.focus();
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab, false));
    });

    tablist.addEventListener("keydown", (event) => {
      const index = tabs.indexOf(document.activeElement);
      if (index === -1) return;

      let next = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;

      event.preventDefault();
      activate(tabs[next], true);
    });
  }

  /* ---------- Modo exposición ---------- */
  function initPresenter() {
    const panel = document.getElementById("presenter");
    const toggle = document.getElementById("presenter-toggle");
    if (!panel || !toggle) return;

    const closeButton = document.getElementById("presenter-close");
    const prevButton = document.getElementById("presenter-prev");
    const nextButton = document.getElementById("presenter-next");
    const goLink = document.getElementById("presenter-go");
    const fullscreenButton = document.getElementById("presenter-fullscreen");
    const progress = document.getElementById("presenter-progress");
    const title = document.getElementById("presenter-title");
    const note = document.getElementById("presenter-note");

    const stops = [
      {
        id: "inicio",
        label: "Portada",
        note: "Comienza con un ejemplo cotidiano: un lector de códigos, la fibra óptica o un sensor LiDAR. Todos utilizan luz láser."
      },
      {
        id: "que-es",
        label: "¿Qué es un láser?",
        note: "Explica el acrónimo y compara la luz de un foco con la de un láser: muchas longitudes de onda y direcciones frente a una banda estrecha, una dirección definida y coherencia. Aclara que no todo láser es rojo ni visible."
      },
      {
        id: "procesos",
        label: "Luz y materia",
        note: "Muestra la absorción, la emisión espontánea y la emisión estimulada. Destaca que la emisión estimulada produce un segundo fotón idéntico: esa es la base de la amplificación."
      },
      {
        id: "receta",
        label: "Funcionamiento y laboratorio",
        note: "Explica el medio activo, el bombeo, la inversión de población y la cavidad. Después pide a alguien que aumente el bombeo, alinee la cavidad y dispare un fotón. Pregunta qué condición falta si no enciende."
      },
      {
        id: "propiedades",
        label: "Propiedades de la luz láser",
        note: "Relaciona cada propiedad con una aplicación: la monocromaticidad con el color y el almacenamiento; la coherencia con la interferencia; la direccionalidad con el enfoque, el corte y el LiDAR."
      },
      {
        id: "hene",
        label: "Ejemplo: láser de helio-neón",
        note: "Explica que el helio transfiere energía al neón y que el neón emite a 632.8 nm. Muestra el cálculo: 632.8 nm → 4.74 × 10¹⁴ Hz → 3.14 × 10⁻¹⁹ J → 1.96 eV."
      },
      {
        id: "aplicaciones",
        label: "Aplicaciones",
        note: "Elige dos tarjetas y pregunta cuál es la propiedad principal antes de mostrar la respuesta. Aclara que varias propiedades contribuyen y que no todo lector o sensor usa láser."
      },
      {
        id: "seguridad",
        label: "Seguridad",
        note: "Explica que el riesgo depende del producto y del uso, y que nunca debe mirarse el haz. Recuerda las ideas principales: emisión estimulada, inversión de población y cavidad."
      },
      {
        id: "aporte",
        label: "Aporte del equipo",
        note: "Explica que el laboratorio, la calculadora y las actividades de repaso permiten comprobar los conceptos y presentarlos en clase."
      }
    ];

    let index = 0;
    let open = false;
    let closeTimer = 0;

    const render = () => {
      const stop = stops[index];
      progress.textContent = `Sección ${index + 1} de ${stops.length}`;
      title.textContent = stop.label;
      note.textContent = stop.note;
      goLink.setAttribute("href", `#${stop.id}`);
      prevButton.disabled = index === 0;
      nextButton.disabled = index === stops.length - 1;
    };

    const scrollToStop = () => {
      const target = document.getElementById(stops[index].id);
      if (target) {
        target.scrollIntoView({
          behavior: reduceMotion() ? "auto" : "smooth",
          block: "start"
        });
      }
    };

    const openPanel = () => {
      window.clearTimeout(closeTimer);
      panel.hidden = false;
      open = true;
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("is-presenting");
      render();
      window.requestAnimationFrame(() => panel.classList.add("is-open"));
    };

    const closePanel = () => {
      open = false;
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("is-presenting");
      panel.classList.remove("is-open");
      closeTimer = window.setTimeout(() => {
        if (!open) panel.hidden = true;
      }, 260);
    };

    const move = (delta) => {
      index = Math.min(stops.length - 1, Math.max(0, index + delta));
      render();
      scrollToStop();
    };

    toggle.addEventListener("click", () => {
      if (open) closePanel();
      else openPanel();
    });

    closeButton.addEventListener("click", closePanel);
    prevButton.addEventListener("click", () => move(-1));
    nextButton.addEventListener("click", () => move(1));
    goLink.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToStop();
    });

    fullscreenButton.addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
          fullscreenButton.textContent = "Salir de pantalla completa";
        } else {
          await document.exitFullscreen();
          fullscreenButton.textContent = "Pantalla completa";
        }
      } catch (error) {
        fullscreenButton.textContent = "Usa F11 para pantalla completa";
      }
    });

    document.addEventListener("fullscreenchange", () => {
      fullscreenButton.textContent = document.fullscreenElement
        ? "Salir de pantalla completa"
        : "Pantalla completa";
    });

    document.addEventListener("keydown", (event) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.matches("input, textarea, select") || target.isContentEditable);

      if (event.key === "Escape" && open) {
        event.preventDefault();
        closePanel();
        return;
      }

      if (isTyping) return;

      if (event.key.toLowerCase() === "p" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        if (open) closePanel();
        else openPanel();
        return;
      }

      if (!open) return;

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        move(1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        move(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        index = 0;
        render();
        scrollToStop();
      } else if (event.key === "End") {
        event.preventDefault();
        index = stops.length - 1;
        render();
        scrollToStop();
      }
    });

    render();
  }

  /* ---------- Botón volver arriba ---------- */
  function initToTop() {
    const button = document.getElementById("to-top");
    if (!button) return;

    let ticking = false;
    const update = () => {
      button.classList.toggle("is-visible", window.scrollY > 600);
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );

    update();
  }

  /* ---------- Enlaces externos ---------- */
  function initExternalLinks() {
    document.querySelectorAll("a[href^='http']").forEach((link) => {
      if (!link.target) link.target = "_blank";
      if (!link.rel) link.rel = "noopener noreferrer";
    });
  }

  /* ---------- Arranque ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initProgress();
    initNavSpy();
    initTabs();
    initPresenter();
    initToTop();
    initExternalLinks();
  });
})();
