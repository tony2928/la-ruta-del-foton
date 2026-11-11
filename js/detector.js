/* =========================================================
   Detector de propiedades: aplicaciones y propiedad principal
   ========================================================= */
(() => {
  "use strict";

  const cards = Array.from(document.querySelectorAll(".app-card[data-app]"));
  if (!cards.length) return;

  const score = document.getElementById("detector-score");
  const reset = document.getElementById("detector-reset");

  const labels = {
    mono: "Monocromaticidad",
    coherencia: "Coherencia",
    direccion: "Direccionalidad"
  };

  const data = {
    fibra: {
      answer: "direccion",
      explain:
        "La direccionalidad permite acoplar el haz al núcleo de la fibra y mantenerlo guiado por reflexión total interna. En sistemas coherentes, la coherencia también es clave; la monocromaticidad permite usar varias longitudes de onda (WDM)."
    },
    almacenamiento: {
      answer: "mono",
      explain:
        "La longitud de onda única y corta permite enfocar en un punto muy pequeño y leer los pits del disco. Por eso el Blu-ray (405 nm) guarda más que el DVD (650 nm) y el CD (780 nm). La direccionalidad también ayuda a enfocar."
    },
    impresora: {
      answer: "direccion",
      explain:
        "El láser escribe un patrón fino sobre un tambor fotoconductor; la direccionalidad y la focalización permiten un punto pequeño y controlado. El tóner se adhiere a las zonas cargadas y luego se funde con calor."
    },
    lector: {
      answer: "mono",
      explain:
        "El filtro y el detector se optimizan para un color definido, lo que ayuda a rechazar la luz ambiente. La direccionalidad permite barrer el código con un haz fino. Muchos lectores modernos ya usan cámaras en lugar de láser."
    },
    lidar: {
      answer: "direccion",
      explain:
        "Un pulso de luz viaja en una dirección, rebota y vuelve; el tiempo de vuelo da la distancia. La direccionalidad permite escanear puntos y la monocromaticidad ayuda a filtrar la luz de fondo."
    },
    sensores: {
      answer: "coherencia",
      explain:
        "La interferencia entre haces permite medir distancias y deformaciones muy pequeñas. La coherencia mantiene el patrón estable; la monocromaticidad ayuda a que la interferencia sea limpia."
    }
  };

  function updateScore() {
    if (!score) return;
    const correct = cards.filter((card) => card.classList.contains("is-correct")).length;
    score.textContent = `Aciertos: ${correct} / ${cards.length}`;
  }

  function answerCard(card, button) {
    if (card.dataset.answered === "true") return;

    const app = card.dataset.app;
    const info = data[app];
    if (!info) return;

    const selected = button.dataset.property;
    const isCorrect = selected === info.answer;
    const feedback = card.querySelector(".app-feedback");
    const buttons = Array.from(card.querySelectorAll("[data-property]"));

    card.dataset.answered = "true";
    card.classList.add(isCorrect ? "is-correct" : "is-wrong");

    buttons.forEach((item) => {
      item.disabled = true;
      item.setAttribute("aria-pressed", String(item === button));
      item.classList.remove("is-selected", "is-correct", "is-wrong");
      if (item.dataset.property === info.answer) item.classList.add("is-correct");
    });

    button.classList.add("is-selected");
    if (!isCorrect) button.classList.add("is-wrong");

    if (feedback) {
      feedback.innerHTML = isCorrect
        ? `<strong>Correcto.</strong> ${info.explain}`
        : `<strong>Casi.</strong> La propiedad principal aquí es <strong>${labels[info.answer]}</strong>. ${info.explain}`;
    }

    updateScore();
  }

  cards.forEach((card) => {
    card.querySelectorAll("[data-property]").forEach((button) => {
      button.addEventListener("click", () => answerCard(card, button));
    });
  });

  if (reset) {
    reset.addEventListener("click", () => {
      cards.forEach((card) => {
        delete card.dataset.answered;
        card.classList.remove("is-correct", "is-wrong");
        const feedback = card.querySelector(".app-feedback");
        if (feedback) feedback.textContent = "";
        card.querySelectorAll("[data-property]").forEach((button) => {
          button.disabled = false;
          button.setAttribute("aria-pressed", "false");
          button.classList.remove("is-selected", "is-correct", "is-wrong");
        });
      });
      updateScore();
    });
  }

  updateScore();
})();
