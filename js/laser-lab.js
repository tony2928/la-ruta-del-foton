/* =========================================================
   Laboratorio conceptual: bombeo, inversión y cavidad
   ========================================================= */
(() => {
  "use strict";

  const root = document.getElementById("laser-lab");
  if (!root) return;

  const pump = root.querySelector("#pump");
  const pumpValue = root.querySelector("#pump-value");
  const alignButton = root.querySelector("#align-btn");
  const fireButton = root.querySelector("#fire-btn");
  const resetButton = root.querySelector("#reset-lab");
  const labVisual = root.querySelector("#lab-visual");
  const feedback = root.querySelector("#lab-feedback");

  const n2Bar = root.querySelector("#n2-bar");
  const n1Bar = root.querySelector("#n1-bar");
  const n2Value = root.querySelector("#n2-value");
  const n1Value = root.querySelector("#n1-value");

  const inversionStatus = root.querySelector("#inversion-status");
  const cavityStatus = root.querySelector("#cavity-status");
  const laserStatus = root.querySelector("#laser-status");

  const missionInversion = root.querySelector("#mission-inversion");
  const missionCavity = root.querySelector("#mission-cavity");
  const missionLaser = root.querySelector("#mission-laser");

  const state = {
    pump: 0,
    aligned: false,
    inversion: false,
    lasing: false
  };

  function populations(value) {
    // Modelo didáctico: el bombeo llena el nivel superior y el inferior se vacía.
    const n2 = Math.round(value * 0.85);
    const n1 = 100 - n2;
    return { n2, n1 };
  }

  function defaultMessage() {
    if (state.pump === 0) {
      return "El medio está en reposo. Sube el bombeo para excitar átomos.";
    }
    if (!state.inversion) {
      return "Aún no hay inversión: N₁ sigue siendo mayor que N₂. La emisión espontánea domina y la luz no se amplifica.";
    }
    if (!state.aligned) {
      return "Hay inversión, pero la cavidad está desalineada. Los fotones no encuentran los espejos y escapan.";
    }
    if (!state.lasing) {
      return "Hay inversión y cavidad alineada. Dispara un fotón para iniciar la emisión estimulada.";
    }
    return "¡Láser encendido! La emisión estimulada multiplica los fotones y el espejo parcial deja salir el haz.";
  }

  function setFeedback(message, tone) {
    feedback.textContent = message;
    feedback.classList.toggle("is-good", tone === "good");
    feedback.classList.toggle("is-warn", tone === "warn");
  }

  function refresh(message, tone) {
    const { n2, n1 } = populations(state.pump);
    state.inversion = n2 > n1;

    if (!state.inversion || !state.aligned) {
      state.lasing = false;
    }

    pumpValue.textContent = `${state.pump}%`;
    n2Bar.style.width = `${n2}%`;
    n1Bar.style.width = `${n1}%`;
    n2Value.textContent = String(n2);
    n1Value.textContent = String(n1);

    labVisual.style.setProperty("--pump", String(state.pump / 100));
    labVisual.classList.toggle("has-inversion", state.inversion);
    labVisual.classList.toggle("is-misaligned", !state.aligned);
    labVisual.classList.toggle("is-lasing", state.lasing);

    inversionStatus.textContent = state.inversion ? "Inversión: sí" : "Inversión: no";
    inversionStatus.classList.toggle("is-good", state.inversion);
    inversionStatus.classList.toggle("is-bad", !state.inversion);

    cavityStatus.textContent = state.aligned ? "Cavidad alineada" : "Cavidad desalineada";
    cavityStatus.classList.toggle("is-good", state.aligned);
    cavityStatus.classList.toggle("is-warn", !state.aligned);

    laserStatus.textContent = state.lasing ? "Láser encendido" : "Láser apagado";
    laserStatus.classList.toggle("is-good", state.lasing);
    laserStatus.classList.toggle("is-bad", !state.lasing);

    alignButton.setAttribute("aria-pressed", String(state.aligned));
    alignButton.textContent = state.aligned ? "Desalinear cavidad" : "Alinear cavidad";

    missionInversion.classList.toggle("is-done", state.inversion);
    missionCavity.classList.toggle("is-done", state.aligned);
    missionLaser.classList.toggle("is-done", state.lasing);

    if (message !== undefined) {
      setFeedback(message, tone);
    } else {
      setFeedback(defaultMessage(), state.lasing ? "good" : state.inversion ? "default" : "warn");
    }
  }

  pump.addEventListener("input", () => {
    state.pump = Number(pump.value);
    refresh();
  });

  alignButton.addEventListener("click", () => {
    state.aligned = !state.aligned;
    if (!state.aligned) state.lasing = false;
    refresh(
      state.aligned
        ? "Cavidad alineada. Si ya hay inversión, dispara un fotón."
        : "Cavidad desalineada: los fotones escapan y el láser se apaga.",
      state.aligned ? "default" : "warn"
    );
  });

  fireButton.addEventListener("click", () => {
    if (!state.inversion) {
      state.lasing = false;
      refresh("No hay inversión suficiente. Sube el bombeo hasta que N₂ supere a N₁.", "warn");
      return;
    }
    if (!state.aligned) {
      state.lasing = false;
      refresh("Hay inversión, pero la cavidad está desalineada. Alinea los espejos y vuelve a disparar.", "warn");
      return;
    }
    state.lasing = true;
    refresh("¡Láser encendido! Un fotón disparó la emisión estimulada; la cavidad multiplica la luz y el espejo parcial deja salir el haz.", "good");
  });

  resetButton.addEventListener("click", () => {
    state.pump = 0;
    state.aligned = false;
    state.lasing = false;
    pump.value = "0";
    refresh("Laboratorio reiniciado. Sube el bombeo para empezar.", "default");
  });

  refresh();
})();
