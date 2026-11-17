/* =========================================================
   Calculadora de fotones: λ → f, E (J) y E (eV)
   ========================================================= */
(() => {
  "use strict";

  const root = document.getElementById("photon-calculator");
  if (!root) return;

  const range = root.querySelector("#wavelength-range");
  const numberInput = root.querySelector("#wavelength-input");
  const wavelengthOutput = root.querySelector("#wavelength-output");
  const swatch = root.querySelector("#wavelength-swatch");
  const regionLabel = root.querySelector("#wavelength-region");
  const freqValue = root.querySelector("#freq-value");
  const energyJ = root.querySelector("#energy-j");
  const energyEv = root.querySelector("#energy-ev");
  const substitution = root.querySelector("#calc-substitution");
  const presets = Array.from(root.querySelectorAll("[data-wavelength]"));
  const marker = root.querySelector("#spectrum-marker");
  const error = root.querySelector("#wavelength-error");
  const live = root.querySelector("#calc-live");
  const energyUpper = root.querySelector("#energy-upper");
  const energyArrow = root.querySelector("#energy-arrow");
  const energyGapLabel = root.querySelector("#energy-gap-label");
  const energyUpperLabel = root.querySelector("#energy-upper-label");

  const H = 6.62607015e-34; // J·s
  const C = 299792458; // m/s
  const EV = 1.602176634e-19; // J
  const MIN = 100;
  const MAX = 1600;

  const numberFormatter = new Intl.NumberFormat("es-MX", {
    maximumSignificantDigits: 4
  });

  function clamp(value) {
    return Math.min(MAX, Math.max(MIN, value));
  }

  function formatNumber(value) {
    if (!Number.isFinite(value)) return "—";
    return numberFormatter.format(value);
  }

  function formatSci(value) {
    if (!Number.isFinite(value) || value === 0) {
      return { html: "0", text: "0" };
    }

    const exponent = Math.floor(Math.log10(Math.abs(value)));
    const mantissa = value / Math.pow(10, exponent);
    return {
      html: `${mantissa.toFixed(3)} × 10<sup>${exponent}</sup>`,
      text: `${mantissa.toFixed(3)} × 10^${exponent}`
    };
  }

  function regionFor(wavelength) {
    if (wavelength < 280) return { label: "Ultravioleta C (no visible)", region: "uv" };
    if (wavelength < 315) return { label: "Ultravioleta B (no visible)", region: "uv" };
    if (wavelength < 380) return { label: "Ultravioleta A (no visible)", region: "uv" };
    if (wavelength < 450) return { label: "Violeta visible", region: "visible" };
    if (wavelength < 495) return { label: "Azul visible", region: "visible" };
    if (wavelength < 570) return { label: "Verde visible", region: "visible" };
    if (wavelength < 590) return { label: "Amarillo visible", region: "visible" };
    if (wavelength < 620) return { label: "Naranja visible", region: "visible" };
    if (wavelength <= 750) return { label: "Rojo visible", region: "visible" };
    return { label: "Infrarrojo (no visible)", region: "ir" };
  }

  function rgbFor(wavelength) {
    if (wavelength < 380) {
      return wavelength < 280 ? "#4c1d95" : "#6d28d9";
    }

    if (wavelength > 780) {
      return "#7f1d1d";
    }

    // El rojo del He-Ne se percibe como rojo; la rampa se vuelve más profunda hacia 750 nm.
    if (wavelength >= 620 && wavelength <= 750) {
      const t = (wavelength - 620) / 130;
      const green = Math.round(57 * (1 - t));
      const blue = Math.round(70 * (1 - t));
      return `rgb(230, ${green}, ${blue})`;
    }

    let r = 0;
    let g = 0;
    let b = 0;

    if (wavelength < 440) {
      r = -(wavelength - 440) / (440 - 380);
      b = 1;
    } else if (wavelength < 490) {
      g = (wavelength - 440) / (490 - 440);
      b = 1;
    } else if (wavelength < 510) {
      g = 1;
      b = -(wavelength - 510) / (510 - 490);
    } else if (wavelength < 580) {
      r = (wavelength - 510) / (580 - 510);
      g = 1;
    } else if (wavelength < 645) {
      r = 1;
      g = -(wavelength - 645) / (645 - 580);
    } else {
      r = 1;
    }

    let factor = 1;
    if (wavelength > 700) factor = 0.3 + (0.7 * (780 - wavelength)) / 80;
    else if (wavelength < 420) factor = 0.3 + (0.7 * (wavelength - 380)) / 40;

    const gamma = 0.8;
    const channel = (value) => Math.round(255 * Math.pow(Math.max(0, value) * factor, gamma));
    return `rgb(${channel(r)}, ${channel(g)}, ${channel(b)})`;
  }

  function showError(message) {
    if (!error) return;
    error.textContent = message;
    error.hidden = false;
    numberInput.setAttribute("aria-invalid", "true");
  }

  function clearError() {
    if (!error) return;
    error.textContent = "";
    error.hidden = true;
    numberInput.setAttribute("aria-invalid", "false");
  }

  function syncPresets(value) {
    presets.forEach((button) => {
      const preset = Number(button.dataset.wavelength);
      const active = Math.abs(preset - value) < 0.05;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function updateEnergyDiagram(energyEvValue) {
    if (!energyUpper || !energyArrow || !energyGapLabel) return;

    const logMin = Math.log10(0.7);
    const logMax = Math.log10(13);
    const t = Math.min(1, Math.max(0, (Math.log10(energyEvValue) - logMin) / (logMax - logMin)));
    const upperY = 100 - t * 60;

    energyUpper.setAttribute("y1", upperY.toFixed(1));
    energyUpper.setAttribute("y2", upperY.toFixed(1));
    energyArrow.setAttribute("y2", upperY.toFixed(1));
    energyGapLabel.setAttribute("y", (upperY - 8).toFixed(1));
    if (energyUpperLabel) energyUpperLabel.setAttribute("y", (upperY - 8).toFixed(1));
    energyGapLabel.textContent = `ΔE ≈ ${formatNumber(energyEvValue)} eV`;
  }

  function update(wavelength, announce = false) {
    const value = clamp(Number(wavelength));
    if (!Number.isFinite(value)) return;

    const lambda = value * 1e-9;
    const frequency = C / lambda;
    const energy = H * frequency;
    const electronVolts = energy / EV;
    const region = regionFor(value);
    const scientific = formatSci(energy);

    range.value = String(value);
    numberInput.value = String(value);
    wavelengthOutput.textContent = `${formatNumber(value)} nm`;
    range.setAttribute("aria-valuetext", `${formatNumber(value)} nanómetros, ${region.label}`);

    freqValue.innerHTML = `${formatNumber(frequency / 1e12)} THz`;
    energyJ.innerHTML = `${scientific.html} J`;
    energyEv.innerHTML = `${formatNumber(electronVolts)} eV`;
    regionLabel.textContent = region.label;

    swatch.dataset.region = region.region;
    swatch.style.backgroundColor = rgbFor(value);

    substitution.innerHTML =
      `λ = ${formatNumber(value)} × 10<sup>-9</sup> m; ` +
      `f = c/λ = ${formatNumber(frequency / 1e12)} × 10<sup>12</sup> Hz; ` +
      `E = hf = ${scientific.html} J = ${formatNumber(electronVolts)} eV.`;

    if (marker) {
      const position = ((value - MIN) / (MAX - MIN)) * 100;
      marker.style.left = `${Math.max(0, Math.min(100, position))}%`;
    }

    updateEnergyDiagram(electronVolts);
    syncPresets(value);
    clearError();

    if (announce && live) {
      live.textContent =
        `${formatNumber(value)} nanómetros, ${region.label}. ` +
        `Frecuencia ${formatNumber(frequency / 1e12)} terahercios. ` +
        `Energía ${scientific.text} joules, ${formatNumber(electronVolts)} electronvoltios.`;
    }
  }

  function handleNumberInput() {
    const raw = numberInput.value.trim();

    if (raw === "") {
      showError("Escribe una longitud de onda entre 100 y 1600 nm.");
      return;
    }

    const value = Number(raw);
    if (!Number.isFinite(value)) {
      showError("Escribe un número válido entre 100 y 1600 nm.");
      return;
    }

    if (value < MIN || value > MAX) {
      const adjusted = clamp(value);
      showError(`El valor debe estar entre ${MIN} y ${MAX} nm; se ajustó a ${formatNumber(adjusted)} nm.`);
      update(adjusted, true);
      return;
    }

    update(value, true);
  }

  range.addEventListener("input", () => update(range.value));
  range.addEventListener("change", () => update(range.value, true));

  numberInput.addEventListener("change", handleNumberInput);

  presets.forEach((button) => {
    button.addEventListener("click", () => {
      update(button.dataset.wavelength, true);
      range.focus();
    });
  });

  update(632.8);
})();
