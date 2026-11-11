/* =========================================================
   Quiz de repaso con retroalimentación
   ========================================================= */
(() => {
  "use strict";

  const root = document.getElementById("quiz-root");
  if (!root) return;

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
        "Significa amplificación de luz por emisión estimulada de radiación. Esa es la idea central: la luz se amplifica gracias a la emisión estimulada."
    },
    {
      text: "¿Qué proceso produce un segundo fotón idéntico al incidente?",
      options: ["Absorción", "Emisión espontánea", "Emisión estimulada"],
      answer: 2,
      explain:
        "En la emisión estimulada, el fotón incidente provoca que el átomo emita otro fotón con la misma frecuencia, fase y dirección. Ese es el efecto multiplicador."
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
        "Con más átomos en el nivel superior que en el inferior, la emisión estimulada gana a la absorción y la luz se amplifica en lugar de atenuarse."
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
        "La cavidad necesita que los fotones reboten entre los espejos. Si el espejo se desalinea, los fotones escapan y la emisión estimulada no se multiplica."
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
        "Nunca se mira el haz directo o reflejado. La protección debe ser específica para la longitud de onda; las gafas de sol no sustituyen a las gafas láser."
    }
  ];

  function render() {
    root.innerHTML = `
      <div class="quiz-list">
        ${questions
          .map(
            (question, index) => `
          <fieldset class="quiz-question" data-question="${index}">
            <legend><span class="quiz-num">0${index + 1}</span> ${question.text}</legend>
            <div class="quiz-options">
              ${question.options
                .map(
                  (option, optionIndex) => `
                <label>
                  <input type="radio" name="q${index}" value="${optionIndex}">
                  <span>${option}</span>
                </label>`
                )
                .join("")}
            </div>
            <p class="quiz-feedback" id="quiz-feedback-${index}"></p>
          </fieldset>`
          )
          .join("")}
      </div>
      <div class="quiz-actions">
        <button type="button" class="btn btn--primary" id="quiz-check">Comprobar respuestas</button>
        <button type="button" class="btn btn--ghost" id="quiz-reset">Reiniciar</button>
      </div>
      <p class="quiz-summary" id="quiz-summary" aria-live="polite"></p>
    `;

    root.querySelector("#quiz-check").addEventListener("click", check);
    root.querySelector("#quiz-reset").addEventListener("click", render);
  }

  function check() {
    let correctCount = 0;
    let answered = 0;

    questions.forEach((question, index) => {
      const fieldset = root.querySelector(`[data-question="${index}"]`);
      const feedback = root.querySelector(`#quiz-feedback-${index}`);
      const selected = root.querySelector(`input[name="q${index}"]:checked`);
      if (!fieldset || !feedback) return;

      fieldset.classList.remove("is-correct", "is-wrong");
      feedback.classList.add("is-visible");

      if (!selected) {
        fieldset.classList.add("is-wrong");
        feedback.textContent = `Sin responder. La respuesta correcta es: ${question.options[question.answer]}. ${question.explain}`;
        return;
      }

      answered += 1;
      const value = Number(selected.value);
      if (value === question.answer) {
        correctCount += 1;
        fieldset.classList.add("is-correct");
        feedback.textContent = `Correcto. ${question.explain}`;
      } else {
        fieldset.classList.add("is-wrong");
        feedback.textContent = `Incorrecto. La respuesta correcta es: ${question.options[question.answer]}. ${question.explain}`;
      }
    });

    const summary = root.querySelector("#quiz-summary");
    if (summary) {
      if (answered < questions.length) {
        summary.textContent = `Respondiste ${answered} de ${questions.length}. Obtuviste ${correctCount} aciertos; completa las que faltan y vuelve a comprobar.`;
      } else if (correctCount === questions.length) {
        summary.textContent = `Obtuviste ${correctCount} de ${questions.length}. Puedes explicar la relación entre absorción, emisión estimulada, inversión de población y cavidad.`;
      } else {
        summary.textContent = `Obtuviste ${correctCount} de ${questions.length}. Repasa los apartados de procesos, funcionamiento y seguridad, y vuelve a intentarlo.`;
      }
    }
  }

  render();
})();
