/* =========================================================
   Detector de propiedades: aplicaciones y propiedad principal
   ========================================================= */
(() => {
  "use strict";

  const cards = Array.from(document.querySelectorAll(".app-card[data-app]"));
  if (!cards.length) return;

  const score = document.getElementById("detector-score");
  const check = document.getElementById("detector-check");
  const retry = document.getElementById("detector-retry");
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

  const selectedChip = (card) => card.querySelector("[data-property][aria-pressed='true']");
  const isChecked = (card) => card.classList.contains("is-correct") || card.classList.contains("is-wrong");

  function updateScore() {
    if (!score) return;

    const correct = cards.filter((card) => card.classList.contains("is-correct")).length;
    const checked = cards.filter(isChecked).length;

    if (checked === 0) {
      score.textContent = "Sin comprobar";
    } else if (checked < cards.length) {
      score.textContent = `Aciertos: ${correct} / ${cards.length} · faltan ${cards.length - checked} por comprobar`;
    } else {
      score.textContent = `Aciertos: ${correct} / ${cards.length}`;
    }

    const wrong = cards.filter((card) => card.classList.contains("is-wrong")).length;
    if (retry) retry.hidden = wrong === 0;
    if (check) check.disabled = checked === cards.length && correct === cards.length;
  }

  function clearCard(card) {
    card.classList.remove("is-correct", "is-wrong", "is-selected", "is-unanswered");
    const feedback = card.querySelector(".app-feedback");
    if (feedback) feedback.textContent = "";

    card.querySelectorAll("[data-property]").forEach((button) => {
      button.disabled = false;
      button.setAttribute("aria-pressed", "false");
      button.classList.remove("is-selected", "is-correct", "is-wrong");
    });

    const cardRetry = card.querySelector(".app-retry");
    if (cardRetry) cardRetry.hidden = true;
  }

  function selectProperty(card, button) {
    if (isChecked(card)) return;

    card.querySelectorAll("[data-property]").forEach((item) => {
      const selected = item === button;
      item.setAttribute("aria-pressed", String(selected));
      item.classList.toggle("is-selected", selected);
    });

    card.classList.remove("is-unanswered");
    card.classList.add("is-selected");

    const feedback = card.querySelector(".app-feedback");
    if (feedback) feedback.textContent = "";
  }

  function checkAll() {
    if (!cards.every((card) => selectedChip(card))) {
      cards.forEach((card) => {
        card.classList.toggle("is-unanswered", !selectedChip(card));
      });

      if (score) score.textContent = `Responde las ${cards.length} tarjetas para comprobar.`;
      const firstMissing = cards.find((card) => !selectedChip(card));
      if (firstMissing) {
        const target = firstMissing.querySelector("[data-property]");
        if (target) target.focus();
      }
      return;
    }

    cards.forEach((card) => {
      const info = data[card.dataset.app];
      const selected = selectedChip(card);
      if (!info || !selected) return;

      const isCorrect = selected.dataset.property === info.answer;
      const feedback = card.querySelector(".app-feedback");
      const cardRetry = card.querySelector(".app-retry");

      card.classList.remove("is-unanswered", "is-selected");
      card.classList.add(isCorrect ? "is-correct" : "is-wrong");

      card.querySelectorAll("[data-property]").forEach((item) => {
        item.disabled = true;
        item.classList.remove("is-correct", "is-wrong");
        if (item.dataset.property === info.answer) item.classList.add("is-correct");
      });

      if (!isCorrect) selected.classList.add("is-wrong");

      if (feedback) {
        feedback.innerHTML = isCorrect
          ? `<strong>Correcto.</strong> ${info.explain} <a href="#propiedades">Repasa las propiedades</a>.`
          : `<strong>Casi.</strong> La propiedad que más se aprovecha aquí es <strong>${labels[info.answer]}</strong>. ${info.explain} <a href="#propiedades">Repasa las propiedades</a>.`;
      }

      if (cardRetry) cardRetry.hidden = isCorrect;
    });

    updateScore();
  }

  function retryCard(card) {
    clearCard(card);
    updateScore();
  }

  cards.forEach((card) => {
    card.querySelectorAll("[data-property]").forEach((button) => {
      button.addEventListener("click", () => selectProperty(card, button));
    });

    const cardRetry = card.querySelector(".app-retry");
    if (cardRetry) {
      cardRetry.addEventListener("click", () => retryCard(card));
    }
  });

  if (check) {
    check.addEventListener("click", checkAll);
  }

  if (retry) {
    retry.addEventListener("click", () => {
      cards.filter((card) => card.classList.contains("is-wrong")).forEach((card) => retryCard(card));
      updateScore();
      const firstWrong = cards.find((card) => !isChecked(card));
      if (firstWrong) {
        const target = firstWrong.querySelector("[data-property]");
        if (target) target.focus();
      }
    });
  }

  if (reset) {
    reset.addEventListener("click", () => {
      cards.forEach((card) => clearCard(card));
      updateScore();
    });
  }

  updateScore();
})();
