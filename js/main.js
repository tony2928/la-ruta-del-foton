/* =========================================================
   La ruta del fotón — navegación, pestañas, He-Ne y exposición
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
    let settleTimer = 0;

    const setActive = (id) => {
      if (id === currentId) return;
      currentId = id;
      links.forEach((link) => link.removeAttribute("aria-current"));
      const link = byId.get(id);
      if (!link) return;

      link.setAttribute("aria-current", "true");
      const nav = link.parentElement;
      if (nav && nav.scrollWidth > nav.clientWidth) {
        link.scrollIntoView({
          block: "nearest",
          inline: "nearest"
        });
      }
    };

    const update = () => {
      const offset = (header ? header.offsetHeight : 70) + 40;
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
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(update, 180);
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

  /* ---------- Repetir animaciones de los procesos ---------- */
  function initProcessReplay() {
    document.querySelectorAll(".replay-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const panel = button.closest(".process-panel");
        if (!panel) return;
        panel.classList.remove("is-active");
        void panel.offsetWidth;
        panel.classList.add("is-active");
      });
    });
  }

  /* ---------- Esquema de helio-neón sincronizado ---------- */
  function initHeneSteps() {
    const figure = document.querySelector(".hene-figure");
    if (!figure) return;

    const svg = figure.querySelector("svg");
    const buttons = Array.from(document.querySelectorAll("[data-hene-step]"));
    const steps = Array.from(document.querySelectorAll(".hene-step"));
    const status = document.getElementById("hene-highlight-status");
    const showAll = document.getElementById("hene-show-all");
    if (!svg || !buttons.length) return;

    const messages = {
      "1": "Paso 1: la descarga eléctrica excita el helio.",
      "2": "Paso 2: el helio transfiere energía al neón.",
      "3": "Paso 3: el neón emite el fotón de 632.8 nm.",
      "4": "Paso 4: la cavidad amplifica y deja salir el haz."
    };

    const select = (step) => {
      svg.classList.add("is-focused");

      svg.querySelectorAll("[data-hene-part]").forEach((part) => {
        part.classList.toggle("is-highlighted", part.dataset.henePart === step);
      });

      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.heneStep === step));
      });

      steps.forEach((item) => {
        item.classList.toggle("is-active", item.dataset.step === step);
      });

      if (status) status.textContent = messages[step] || "";
    };

    const clear = () => {
      svg.classList.remove("is-focused");
      svg.querySelectorAll("[data-hene-part]").forEach((part) => part.classList.remove("is-highlighted"));
      buttons.forEach((button) => button.setAttribute("aria-pressed", "false"));
      steps.forEach((item) => item.classList.remove("is-active"));
      if (status) status.textContent = "Esquema completo visible.";
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => select(button.dataset.heneStep));
    });

    if (showAll) showAll.addEventListener("click", clear);
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
    const target = document.getElementById("presenter-target");
    const title = document.getElementById("presenter-title");
    const note = document.getElementById("presenter-note");
    const dots = document.getElementById("presenter-dots");
    const timerValue = document.getElementById("presenter-timer");
    const timerToggle = document.getElementById("presenter-timer-toggle");
    const timerReset = document.getElementById("presenter-timer-reset");
    const largeTextButton = document.getElementById("presenter-large-text");
    const help = panel.querySelector(".presenter-help");

    const stops = [
      {
        id: "inicio",
        label: "Portada",
        target: "0:00–0:35",
        note: "Comienza con un ejemplo cotidiano: un lector de códigos, la fibra óptica o un sensor LiDAR. Todos utilizan luz láser."
      },
      {
        id: "que-es",
        label: "¿Qué es un láser?",
        target: "0:35–1:20",
        note: "Explica el acrónimo y compara la luz de un foco con la de un láser: muchas longitudes de onda y direcciones frente a una banda estrecha, una dirección definida y coherencia. Aclara que no todo láser es rojo ni visible."
      },
      {
        id: "procesos",
        label: "Luz y materia",
        target: "1:20–2:25",
        note: "Muestra la absorción, la emisión espontánea y la emisión estimulada. Destaca que la emisión estimulada produce un segundo fotón idéntico: esa es la base de la amplificación."
      },
      {
        id: "receta",
        label: "Funcionamiento y laboratorio",
        target: "2:25–3:45",
        note: "Explica el medio activo, el bombeo, la inversión de población y la cavidad. Después pide a alguien que aumente el bombeo, mantenga el vaciado del nivel inferior al 100%, alinee la cavidad y dispare un fotón. Pregunta qué condición falta si no enciende."
      },
      {
        id: "propiedades",
        label: "Propiedades de la luz láser",
        target: "3:45–4:25",
        note: "Relaciona cada propiedad con una aplicación: la monocromaticidad con el color y el almacenamiento; la coherencia con la interferencia; la direccionalidad con el enfoque, el corte y el LiDAR. Los mini-experimentos permiten mostrarlo en vivo."
      },
      {
        id: "hene",
        label: "Ejemplo: láser de helio-neón",
        target: "4:25–5:20",
        note: "Explica que el helio transfiere energía al neón y que el neón emite a 632.8 nm. Usa los números de los pasos para resaltar cada parte del esquema. Muestra el cálculo: 632.8 nm → 4.74 × 10¹⁴ Hz → 3.14 × 10⁻¹⁹ J → 1.96 eV."
      },
      {
        id: "aplicaciones",
        label: "Aplicaciones",
        target: "5:20–5:55",
        note: "Elige dos tarjetas y pregunta cuál es la propiedad principal antes de mostrar la respuesta. Aclara que varias propiedades contribuyen y que no todo lector o sensor usa láser."
      },
      {
        id: "seguridad",
        label: "Seguridad",
        target: "5:55–6:30",
        note: "Explica que el riesgo depende del producto y del uso, y que nunca debe mirarse el haz. Recuerda las ideas principales: emisión estimulada, inversión de población y cavidad."
      },
      {
        id: "aporte",
        label: "Aporte del equipo",
        target: "6:30–7:00",
        note: "Explica que el laboratorio, la calculadora, los mini-experimentos y las actividades de repaso permiten comprobar los conceptos y presentarlos en clase."
      }
    ];

    let index = 0;
    let open = false;
    let closeTimer = 0;
    let lastFocus = null;
    let timerSeconds = 0;
    let timerId = 0;
    let timerRunning = false;

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const rest = seconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
    };

    const startTimer = () => {
      if (timerRunning) return;
      timerRunning = true;
      if (timerToggle) timerToggle.textContent = "Pausar";
      timerId = window.setInterval(() => {
        timerSeconds += 1;
        if (timerValue) timerValue.textContent = formatTime(timerSeconds);
      }, 1000);
    };

    const pauseTimer = () => {
      if (!timerRunning) return;
      timerRunning = false;
      window.clearInterval(timerId);
      timerId = 0;
      if (timerToggle) timerToggle.textContent = timerSeconds > 0 ? "Reanudar" : "Iniciar";
    };

    const resetTimer = () => {
      pauseTimer();
      timerSeconds = 0;
      if (timerValue) timerValue.textContent = "00:00";
      if (timerToggle) timerToggle.textContent = "Iniciar";
    };

    const renderDots = () => {
      if (!dots) return;

      if (dots.children.length === 0) {
        stops.forEach((stop, dotIndex) => {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "presenter-dot";
          dot.textContent = String(dotIndex + 1);
          dot.setAttribute("aria-label", `Ir a la sección ${dotIndex + 1}: ${stop.label}`);
          dot.addEventListener("click", () => {
            index = dotIndex;
            render();
            scrollToStop();
          });
          dots.appendChild(dot);
        });
      }

      Array.from(dots.children).forEach((dot, dotIndex) => {
        const active = dotIndex === index;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    };

    const render = () => {
      const stop = stops[index];
      if (progress) progress.textContent = `Sección ${index + 1} de ${stops.length}`;
      if (target) target.textContent = `Objetivo: ${stop.target}`;
      if (title) title.textContent = stop.label;
      if (note) note.textContent = stop.note;
      if (goLink) goLink.setAttribute("href", `#${stop.id}`);
      if (prevButton) prevButton.disabled = index === 0;
      if (nextButton) nextButton.disabled = index === stops.length - 1;
      renderDots();
    };

    const scrollToStop = () => {
      const stopTarget = document.getElementById(stops[index].id);
      if (stopTarget) {
        stopTarget.scrollIntoView({
          behavior: reduceMotion() ? "auto" : "smooth",
          block: "start"
        });
      }
    };

    const openPanel = () => {
      window.clearTimeout(closeTimer);
      lastFocus = document.activeElement;
      panel.hidden = false;
      open = true;
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("is-presenting");
      render();
      window.requestAnimationFrame(() => panel.classList.add("is-open"));
      startTimer();
      window.requestAnimationFrame(() => {
        if (closeButton) closeButton.focus();
      });
    };

    const closePanel = () => {
      open = false;
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("is-presenting");
      panel.classList.remove("is-open");
      pauseTimer();
      if (help) help.open = false;
      closeTimer = window.setTimeout(() => {
        if (!open) panel.hidden = true;
      }, 260);
      if (lastFocus instanceof HTMLElement) lastFocus.focus();
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

    if (timerToggle) {
      timerToggle.addEventListener("click", () => {
        if (timerRunning) pauseTimer();
        else startTimer();
      });
    }

    if (timerReset) {
      timerReset.addEventListener("click", resetTimer);
    }

    if (largeTextButton) {
      largeTextButton.addEventListener("click", () => {
        const pressed = largeTextButton.getAttribute("aria-pressed") === "true";
        const next = !pressed;
        largeTextButton.setAttribute("aria-pressed", String(next));
        largeTextButton.textContent = next ? "Texto normal" : "Texto grande";
        document.documentElement.classList.toggle("is-large-text", next);
      });
    }

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
      const targetElement = event.target;
      const isTyping =
        targetElement instanceof HTMLElement &&
        (targetElement.matches("input, textarea, select") || targetElement.isContentEditable);

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

      if (event.key === "?") {
        event.preventDefault();
        if (help) help.open = !help.open;
        return;
      }

      if (event.key.toLowerCase() === "t") {
        event.preventDefault();
        if (timerRunning) pauseTimer();
        else startTimer();
        return;
      }

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
    initProcessReplay();
    initHeneSteps();
    initPresenter();
    initToTop();
    initExternalLinks();
  });
})();
