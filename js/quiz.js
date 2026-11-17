/* =========================================================
   Quiz de repaso: una pregunta a la vez, pistas y reintento
   ========================================================= */
(() => {
  "use strict";

  const root = document.getElementById("quiz-root");
  if (!root) return;

  const live = document.getElementById("quiz-live");

  const questions = [
    {
      text: "¿Qué significa el acrónimo LASER?",
      options: [
        "Light Amplification by Stimulated Emission of Radiation",
        "Light Absorption by Spontaneous Emission of Radiation",
        "Laser Amplification by Stimulated Energy Radiation"
      ],
      answer: 0,
      explain:
        "Significa amplificación de luz por emisión estimulada de radiación. Esa es la idea central: la luz se amplifica gracias a la emisión estimulada.",
      hint: "Piensa en las palabras amplification, stimulated, emission y radiation.",
      section: "#que-es",
      sectionLabel: "la introducción"
    },
    {
      text: "¿Qué proceso produce un segundo fotón idéntico al incidente?",
      options: ["Absorción", "Emisión espontánea", "Emisión estimulada"],
      answer: 2,
      explain:
        "En la emisión estimulada, el fotón incidente provoca que el átomo emita otro fotón con la misma frecuencia, fase y dirección. Ese es el efecto multiplicador.",
      hint: "No es el proceso que ocurre por casualidad: hay un fotón que lo provoca.",
      section: "#procesos",
      sectionLabel: "los procesos luz-materia"
    },
    {
      text: "¿Por qué se necesita inversión de población?",
      options: [
        "Para que el medio se enfríe",
        "Para que la emisión estimulada supere a la absorción",
        "Para que el láser sea siempre visible"
      ],
      answer: 1,
      explain:
        "Con más átomos en el nivel superior que en el inferior, la emisión estimulada gana a la absorción y la luz se amplifica en lugar de atenuarse.",
      hint: "La inversión cambia quién gana: absorción o emisión estimulada.",
      section: "#receta",
      sectionLabel: "el funcionamiento"
    },
    {
      text: "Si el espejo de salida se desalinea, ¿qué pasa?",
      options: [
        "El láser sale con más potencia",
        "La cavidad pierde retroalimentación y no hay amplificación",
        "El color cambia automáticamente a verde"
      ],
      answer: 1,
      explain:
        "La cavidad necesita que los fotones reboten entre los espejos. Si el espejo se desalinea, los fotones escapan y la emisión estimulada no se multiplica.",
      hint: "La cavidad necesita retroalimentación; sin espejos alineados, los fotones escapan.",
      section: "#receta",
      sectionLabel: "la cavidad óptica"
    },
    {
      text: "¿Cuál es una práctica segura con un láser?",
      options: [
        "Mirar el haz para comprobar que está encendido",
        "Usar gafas de sol en lugar de gafas láser",
        "Nunca apuntar el haz a los ojos y usar protección adecuada"
      ],
      answer: 2,
      explain:
        "Nunca se mira el haz directo o reflejado. La protección debe ser específica para la longitud de onda; las gafas de sol no sustituyen a las gafas láser.",
      hint: "La prioridad es proteger los ojos y usar la protección correcta para esa λ.",
      section: "#seguridad",
      sectionLabel: "la seguridad"
    },
    {
      text: "¿Qué condición debe cumplirse para que la ganancia supere las pérdidas?",
      options: [
        "Que la cavidad esté alineada y haya inversión suficiente",
        "Que el láser sea rojo y visible",
        "Que el bombeo sea cero"
      ],
      answer: 0,
      explain:
        "La ganancia depende de la inversión y las pérdidas de la cavidad. El láser enciende cuando la ganancia supera el umbral y la cavidad retroalimenta la luz.",
      hint: "Piensa en el medidor de ganancia y pérdidas del laboratorio.",
      section: "#receta",
      sectionLabel: "el umbral del láser"
    },
    {
      text: "En el láser de helio-neón, ¿quién emite el fotón de 632.8 nm?",
      options: ["El helio", "El neón", "El espejo"],
      answer: 1,
      explain:
        "El helio absorbe la energía de la descarga y la transfiere al neón. El neón es el que emite el fotón de 632.8 nm al bajar de nivel.",
      hint: "El helio transfiere energía; el que emite es el otro gas.",
      section: "#hene",
      sectionLabel: "el ejemplo del He-Ne"
    },
    {
      text: "¿Cuál es la diferencia principal entre un LED y un láser?",
      options: [
        "El LED usa emisión espontánea; el láser, emisión estimulada y cavidad",
        "El LED es más coherente que el láser",
        "El láser no necesita energía para funcionar"
      ],
      answer: 0,
      explain:
        "Un LED emite por emisión espontánea: luz incoherente, en varias direcciones y con una banda más ancha. El láser usa emisión estimulada y una cavidad óptica.",
      hint: "Recuerda los tres procesos y para qué sirve la cavidad.",
      section: "#procesos",
      sectionLabel: "los procesos luz-materia"
    }
  ];

  const answers = new Array(questions.length).fill(null);
  const checked = new Array(questions.length).fill(false);
  const hints = new Array(questions.length).fill(false);

  let queue = questions.map((_, index) => index);
  let position = 0;

  function setLive(message) {
    if (live) live.textContent = message;
  }

  function feedbackFor(current) {
    const question = questions[current];
    const isCorrect = answers[current] === question.answer;

    if (isCorrect) {
      return `<strong>Correcto.</strong> ${question.explain} <a href="${question.section}">Repasa ${question.sectionLabel}</a>.`;
    }

    return `<strong>Incorrecto.</strong> La respuesta correcta es: ${question.options[question.answer]}. ${question.explain} <a href="${question.section}">Repasa ${question.sectionLabel}</a>.`;
  }

  function renderQuestion(options = {}) {
    if (position >= queue.length) {
      renderSummary({ focus: true });
      return;
    }

    const current = queue[position];
    const question = questions[current];
    const checkedHere = checked[current];
    const progress = ((position + 1) / queue.length) * 100;
    const isCorrect = answers[current] === question.answer;

    const optionsHtml = question.options
      .map((option, optionIndex) => {
        let className = "";
        if (checkedHere) {
          if (optionIndex === question.answer) className = "is-correct";
          else if (optionIndex === answers[current]) className = "is-wrong";
        }

        return `
          <label class="${className}">
            <input type="radio" name="q${current}" value="${optionIndex}" ${answers[current] === optionIndex ? "checked" : ""} ${checkedHere ? "disabled" : ""}>
            <span>${option}</span>
          </label>`;
      })
      .join("");

    const feedbackHtml = checkedHere ? feedbackFor(current) : "";

    root.innerHTML = `
      <div class="quiz-shell">
        <div class="quiz-progress">
          <p class="quiz-progress-text">Pregunta ${position + 1} de ${queue.length}</p>
          <div class="quiz-progress-bar" aria-hidden="true"><span class="quiz-progress-fill" style="width:${progress}%"></span></div>
        </div>
        <section class="quiz-question ${checkedHere ? (isCorrect ? "is-correct" : "is-wrong") : ""}" role="group" aria-labelledby="quiz-question-title-${current}" data-question="${current}">
          <h3 class="quiz-question-title" id="quiz-question-title-${current}">
            <span class="quiz-num">${String(current + 1).padStart(2, "0")}</span>
            <span>${question.text}</span>
          </h3>
          <div class="quiz-options" role="radiogroup" aria-label="Opciones de respuesta" aria-describedby="quiz-feedback-${current}">
            ${optionsHtml}
          </div>
          <p class="quiz-hint" id="quiz-hint-${current}" ${hints[current] ? "" : "hidden"}>${question.hint}</p>
          <div class="quiz-actions">
            <button type="button" class="btn btn--ghost" id="quiz-hint-btn">${hints[current] ? "Ocultar pista" : "Ver pista"}</button>
            <button type="button" class="btn btn--primary" id="quiz-check" ${checkedHere ? "hidden" : ""}>Comprobar</button>
            <button type="button" class="btn btn--primary" id="quiz-next" ${checkedHere ? "" : "hidden"}>${position === queue.length - 1 ? "Ver resultados" : "Siguiente →"}</button>
          </div>
          <p class="quiz-feedback ${checkedHere ? "is-visible" : ""}" id="quiz-feedback-${current}">${feedbackHtml}</p>
        </section>
      </div>`;

    const optionsGroup = root.querySelector(".quiz-options");
    const feedback = root.querySelector(`#quiz-feedback-${current}`);

    root.querySelectorAll(`input[name="q${current}"]`).forEach((radio) => {
      radio.addEventListener("change", () => {
        answers[current] = Number(radio.value);
        if (optionsGroup) optionsGroup.removeAttribute("aria-invalid");
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("is-visible");
        }
      });
    });

    const hintButton = root.querySelector("#quiz-hint-btn");
    if (hintButton) {
      hintButton.addEventListener("click", () => {
        hints[current] = !hints[current];
        const hint = root.querySelector(`#quiz-hint-${current}`);
        if (hint) hint.hidden = !hints[current];
        hintButton.textContent = hints[current] ? "Ocultar pista" : "Ver pista";
      });
    }

    const checkButton = root.querySelector("#quiz-check");
    if (checkButton) {
      checkButton.addEventListener("click", () => {
        if (answers[current] === null) {
          if (optionsGroup) optionsGroup.setAttribute("aria-invalid", "true");
          if (feedback) {
            feedback.textContent = "Elige una opción antes de comprobar.";
            feedback.classList.add("is-visible");
          }
          const firstRadio = root.querySelector(`input[name="q${current}"]`);
          if (firstRadio) firstRadio.focus();
          return;
        }

        checked[current] = true;
        const correctNow = answers[current] === question.answer;
        setLive(
          `${correctNow ? "Correcto." : "Incorrecto."} ${question.explain}`
        );
        renderQuestion({ focus: "next" });
      });
    }

    const nextButton = root.querySelector("#quiz-next");
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        position += 1;
        if (position >= queue.length) {
          renderSummary({ focus: true });
        } else {
          renderQuestion({ focus: "first", announce: true });
        }
      });
    }

    if (options.focus === "next") {
      window.requestAnimationFrame(() => {
        const next = root.querySelector("#quiz-next");
        if (next) next.focus();
      });
    } else if (options.focus === "first") {
      window.requestAnimationFrame(() => {
        const first = root.querySelector(`input[name="q${current}"]`);
        if (first) first.focus();
      });
    }

    if (options.announce) {
      setLive(`Pregunta ${position + 1} de ${queue.length}. ${question.text}`);
    }
  }

  function renderSummary(options = {}) {
    const correct = questions.filter((question, index) => answers[index] === question.answer).length;
    const wrong = questions
      .map((question, index) => ({ question, index }))
      .filter(({ question, index }) => answers[index] !== question.answer);

    const sections = [];
    const seen = new Set();
    wrong.forEach(({ question }) => {
      if (!seen.has(question.section)) {
        seen.add(question.section);
        sections.push({ href: question.section, label: question.sectionLabel });
      }
    });

    root.innerHTML = `
      <div class="quiz-summary">
        <h3 id="quiz-summary-title" tabindex="-1">Resultado: ${correct} de ${questions.length}</h3>
        <p>
          ${
            correct === questions.length
              ? "Puedes explicar la relación entre absorción, emisión estimulada, inversión de población y cavidad."
              : "Repasa las preguntas falladas y vuelve a intentarlo. Las explicaciones te indican qué conviene revisar."
          }
        </p>
        ${
          wrong.length
            ? `<p>Te conviene repasar: ${sections.map((section) => `<a href="${section.href}">${section.label}</a>`).join(", ")}.</p>`
            : ""
        }
        <div class="quiz-summary-actions">
          ${wrong.length ? '<button type="button" class="btn btn--primary" id="quiz-retry-wrong">Repasar falladas</button>' : ""}
          <button type="button" class="btn btn--ghost" id="quiz-reset">Reiniciar</button>
        </div>
      </div>`;

    const retryButton = root.querySelector("#quiz-retry-wrong");
    if (retryButton) {
      retryButton.addEventListener("click", () => {
        queue = wrong.map(({ index }) => index);
        position = 0;
        queue.forEach((index) => {
          checked[index] = false;
          answers[index] = null;
        });
        renderQuestion({ focus: "first", announce: true });
      });
    }

    const resetButton = root.querySelector("#quiz-reset");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        answers.fill(null);
        checked.fill(false);
        hints.fill(false);
        queue = questions.map((_, index) => index);
        position = 0;
        renderQuestion({ focus: "first" });
      });
    }

    if (options.focus) {
      window.requestAnimationFrame(() => {
        const title = root.querySelector("#quiz-summary-title");
        if (title) title.focus();
      });
    }

    setLive(`Resultado: ${correct} de ${questions.length}.`);
  }

  if (live) {
    live.textContent = "";
  }

  renderQuestion();
})();
