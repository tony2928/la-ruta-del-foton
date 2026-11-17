/* =========================================================
   Laboratorio conceptual: bombeo, vaciado, inversión y umbral
   ========================================================= */
(() => {
  "use strict";

  const root = document.getElementById("laser-lab");
  if (!root) return;

  const pump = root.querySelector("#pump");
  const pumpValue = root.querySelector("#pump-value");
  const drain = root.querySelector("#drain");
  const drainValue = root.querySelector("#drain-value");
  const alignButton = root.querySelector("#align-btn");
  const fireButton = root.querySelector("#fire-btn");
  const resetButton = root.querySelector("#reset-lab");
  const labVisual = root.querySelector("#lab-visual");
  const feedback = root.querySelector("#lab-feedback");
  const statusLive = root.querySelector("#lab-status-live");

  const n2Dots = root.querySelector("#n2-dots");
  const n1Dots = root.querySelector("#n1-dots");
  const n2Value = root.querySelector("#n2-value");
  const n1Value = root.querySelector("#n1-value");

  const gainMeter = root.querySelector("#gain-meter");
  const gainFill = root.querySelector("#gain-fill");
  const lossMarker = root.querySelector("#loss-marker");
  const gainValue = root.querySelector("#gain-value");
  const lossValue = root.querySelector("#loss-value");

  const inversionStatus = root.querySelector("#inversion-status");
  const thresholdStatus = root.querySelector("#threshold-status");
  const cavityStatus = root.querySelector("#cavity-status");
  const laserStatus = root.querySelector("#laser-status");

  const missionInversion = root.querySelector("#mission-inversion");
  const missionThreshold = root.querySelector("#mission-threshold");
  const missionCavity = root.querySelector("#mission-cavity");
  const missionLaser = root.querySelector("#mission-laser");

  const photonCount = root.querySelector("#photon-count");
  const predictionButtons = Array.from(root.querySelectorAll("[data-predict]"));
  const predictionFeedback = root.querySelector(".prediction-feedback");

  const DOTS = 20;
  const MAX_GAIN = 70;
  const LOSS = 26;

  const state = {
    pump: 0,
    drain: 100,
    aligned: false,
    inversion: false,
    aboveThreshold: false,
    hasSeed: false,
    lasing: false
  };

  let photonTimer = 0;

  function buildDots(container) {
    if (!container) return;
    container.innerHTML = "";
    for (let index = 0; index < DOTS; index += 1) {
      const dot = document.createElement("span");
      container.appendChild(dot);
    }
  }

  function renderDots(container, value) {
    if (!container) return;
    const filled = Math.max(0, Math.min(DOTS, Math.round(value / 5)));
    Array.from(container.children).forEach((dot, index) => {
      dot.classList.toggle("is-on", index < filled);
    });
    container.setAttribute("aria-label", `${value}% de los átomos en este nivel`);
  }

  function populations(pumpValue, drainValue) {
    // Modelo didáctico de tres niveles: el bombeo llena N2 y el vaciado retira átomos de N1.
    const n2 = Math.round(pumpValue * 0.9);
    const n1 = Math.round(100 - drainValue * 0.8);
    return { n2, n1, gap: n2 - n1 };
  }

  function gainFor(gap) {
    return Math.round(Math.max(0, gap) * 0.9);
  }

  function stopPhotonCascade() {
    if (photonTimer) {
      window.clearInterval(photonTimer);
      photonTimer = 0;
    }
    if (photonCount) photonCount.textContent = "0";
  }

  function startPhotonCascade() {
    stopPhotonCascade();
    if (!photonCount) return;

    const sequence = [1, 2, 4, 8, 16, 32];
    let index = 0;
    photonCount.textContent = String(sequence[index]);

    photonTimer = window.setInterval(() => {
      index += 1;
      if (index >= sequence.length) {
        window.clearInterval(photonTimer);
        photonTimer = 0;
        return;
      }
      photonCount.textContent = String(sequence[index]);
    }, 160);
  }

  function setFeedback(message, tone) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.toggle("is-good", tone === "good");
    feedback.classList.toggle("is-warn", tone === "warn");
  }

  function defaultMessage() {
    if (state.pump === 0) {
      return "El medio está en reposo. Aumenta el bombeo para excitar átomos.";
    }
    if (!state.inversion) {
      return "Aún no hay inversión: N₁ es mayor o igual que N₂. Sube el bombeo o el vaciado del nivel inferior.";
    }
    if (!state.aboveThreshold) {
      return "Hay inversión, pero la ganancia no supera las pérdidas de la cavidad. Sube un poco más el bombeo.";
    }
    if (!state.aligned) {
      return "Hay inversión y ganancia suficiente, pero la cavidad está desalineada: los fotones escapan.";
    }
    if (!state.lasing) {
      return "Todo listo: hay inversión, ganancia y cavidad alineada. Dispara un fotón para iniciar la emisión estimulada.";
    }
    return "¡Láser encendido! La emisión estimulada multiplica los fotones y el espejo parcial deja salir el haz.";
  }

  function refresh(message, tone) {
    const wasLasing = state.lasing;
    const { n2, n1, gap } = populations(state.pump, state.drain);
    const gain = gainFor(gap);

    state.inversion = gap > 0;
    state.aboveThreshold = gain > LOSS;

    if (!state.aligned || !state.aboveThreshold) {
      state.hasSeed = false;
      state.lasing = false;
    } else if (state.hasSeed) {
      state.lasing = true;
    }

    if (pumpValue) pumpValue.textContent = `${state.pump}%`;
    if (drainValue) drainValue.textContent = `${state.drain}%`;
    if (n2Value) n2Value.textContent = String(n2);
    if (n1Value) n1Value.textContent = String(n1);

    renderDots(n2Dots, n2);
    renderDots(n1Dots, n1);

    if (gainFill) gainFill.style.width = `${Math.min(100, (gain / MAX_GAIN) * 100)}%`;
    if (lossMarker) lossMarker.style.left = `${(LOSS / MAX_GAIN) * 100}%`;
    if (gainValue) gainValue.textContent = String(gain);
    if (lossValue) lossValue.textContent = String(LOSS);

    if (gainMeter) {
      gainMeter.classList.toggle("is-above", gain > LOSS);
      gainMeter.setAttribute(
        "aria-label",
        `Ganancia ${gain}, pérdidas ${LOSS}; ${gain > LOSS ? "umbral superado" : "bajo el umbral"}.`
      );
    }

    labVisual.style.setProperty("--pump", String(state.pump / 100));
    labVisual.style.setProperty("--drain", String(state.drain / 100));
    labVisual.classList.toggle("has-inversion", state.inversion);
    labVisual.classList.toggle("is-misaligned", !state.aligned);
    labVisual.classList.toggle("is-above-threshold", state.aboveThreshold);
    labVisual.classList.toggle("is-lasing", state.lasing);
    labVisual.classList.toggle("is-escaping", state.inversion && !state.aligned);

    if (inversionStatus) {
      inversionStatus.textContent = state.inversion
        ? `Inversión: sí (ΔN ${gap})`
        : `Inversión: no (ΔN ${gap})`;
      inversionStatus.classList.toggle("is-good", state.inversion);
      inversionStatus.classList.toggle("is-bad", !state.inversion);
    }

    if (thresholdStatus) {
      thresholdStatus.textContent = state.aboveThreshold ? "Umbral superado" : "Bajo el umbral";
      thresholdStatus.classList.toggle("is-good", state.aboveThreshold);
      thresholdStatus.classList.toggle("is-warn", !state.aboveThreshold);
    }

    if (cavityStatus) {
      cavityStatus.textContent = state.aligned ? "Cavidad alineada" : "Cavidad desalineada";
      cavityStatus.classList.toggle("is-good", state.aligned);
      cavityStatus.classList.toggle("is-warn", !state.aligned);
    }

    if (laserStatus) {
      laserStatus.textContent = state.lasing ? "Láser encendido" : "Láser apagado";
      laserStatus.classList.toggle("is-good", state.lasing);
      laserStatus.classList.toggle("is-bad", !state.lasing);
    }

    alignButton.setAttribute("aria-pressed", String(state.aligned));
    alignButton.textContent = state.aligned ? "Desalinear cavidad" : "Alinear cavidad";

    if (missionInversion) missionInversion.classList.toggle("is-done", state.inversion);
    if (missionThreshold) missionThreshold.classList.toggle("is-done", state.aboveThreshold);
    if (missionCavity) missionCavity.classList.toggle("is-done", state.aligned);
    if (missionLaser) missionLaser.classList.toggle("is-done", state.lasing);

    if (state.lasing && !wasLasing) startPhotonCascade();
    else if (!state.lasing && wasLasing) stopPhotonCascade();

    if (statusLive) {
      statusLive.textContent =
        `Inversión ${state.inversion ? "sí" : "no"}. ` +
        `${state.aboveThreshold ? "Umbral superado" : "Bajo el umbral"}. ` +
        `Cavidad ${state.aligned ? "alineada" : "desalineada"}. ` +
        `Láser ${state.lasing ? "encendido" : "apagado"}.`;
    }

    if (message !== undefined) {
      setFeedback(message, tone);
    } else {
      const ready = state.inversion && state.aboveThreshold && state.aligned;
      setFeedback(defaultMessage(), state.lasing ? "good" : ready ? "default" : "warn");
    }
  }

  function onParameterChange() {
    state.pump = Number(pump.value);
    state.drain = Number(drain.value);
    refresh();
  }

  pump.addEventListener("input", onParameterChange);
  drain.addEventListener("input", onParameterChange);

  alignButton.addEventListener("click", () => {
    state.aligned = !state.aligned;
    if (!state.aligned) state.hasSeed = false;
    refresh(
      state.aligned
        ? "Cavidad alineada. Si la ganancia supera las pérdidas, dispara un fotón."
        : "Cavidad desalineada: los fotones escapan y el láser se apaga.",
      state.aligned ? "default" : "warn"
    );
  });

  fireButton.addEventListener("click", () => {
    if (!state.inversion) {
      state.hasSeed = false;
      refresh("No hay inversión. Sube el bombeo o el vaciado del nivel inferior antes de disparar.", "warn");
      return;
    }

    if (!state.aboveThreshold) {
      state.hasSeed = false;
      refresh("Hay inversión, pero la ganancia no supera las pérdidas. Sube el bombeo y vuelve a intentarlo.", "warn");
      return;
    }

    if (!state.aligned) {
      state.hasSeed = false;
      refresh("Hay inversión y ganancia, pero la cavidad está desalineada. Alinea los espejos y vuelve a disparar.", "warn");
      return;
    }

    state.hasSeed = true;
    refresh(
      "¡Láser encendido! Un fotón disparó la emisión estimulada; la cavidad multiplica la luz y el espejo parcial deja salir el haz.",
      "good"
    );
  });

  resetButton.addEventListener("click", () => {
    state.pump = 0;
    state.drain = 100;
    state.aligned = false;
    state.hasSeed = false;
    pump.value = "0";
    drain.value = "100";
    predictionButtons.forEach((item) => {
      item.setAttribute("aria-pressed", "false");
      item.classList.remove("is-correct", "is-wrong");
    });
    if (predictionFeedback) {
      predictionFeedback.textContent = "";
      predictionFeedback.classList.remove("is-good", "is-warn");
    }
    refresh("Laboratorio reiniciado. Aumenta el bombeo para empezar.", "default");
  });

  predictionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const correct = button.dataset.predict === "correct";
      predictionButtons.forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
        item.classList.toggle("is-correct", item === button && correct);
        item.classList.toggle("is-wrong", item === button && !correct);
      });

      if (predictionFeedback) {
        predictionFeedback.textContent = correct
          ? "Correcto: si el nivel inferior no se vacía, N₁ se acumula y la inversión desaparece."
          : "Piensa en N₁: si se acumula, la diferencia con N₂ se reduce y la inversión se pierde.";
        predictionFeedback.classList.toggle("is-good", correct);
        predictionFeedback.classList.toggle("is-warn", !correct);
      }
    });
  });

  buildDots(n2Dots);
  buildDots(n1Dots);
  refresh();
})();
