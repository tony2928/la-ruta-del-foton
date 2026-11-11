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

  const H = 6.62607015e-34; // J·s
  const C = 299792458; // m/s
  const EV = 1.602176634e-19; // J
  const MIN = 380;
  const MAX = 1600;

  function clamp(value) {
    return Math.min(MAX, Math.max(MIN, value));
  }

  function formatNumber(value, digits = 4) {
    if (!Number.isFinite(value)) return "—";
    return new Intl.NumberFormat("es-MX", {
      maximumSignificantDigits: digits
    }).format(value);
  }

  function formatSci(value, digits = 4) {
    if (!Number.isFinite(value) || value === 0) return "0";
    const exponent = Math.floor(Math.log10(Math.abs(value)));
    const mantissa = value / Math.pow(10, exponent);
    return `${mantissa.toFixed(digits - 1)} × 10<sup>${exponent}</sup>`;
  }

  function regionFor(wavelength) {
    if (wavelength < 380) return { label: "Ultravioleta (no visible)", region: "uv" };
    if (wavelength < 450) return { label: "Violeta visible", region: "visible" };
    if (wavelength < 495) return { label: "Azul visible", region: "visible" };
    if (wavelength < 570) return { label: "Verde visible", region: "visible" };
    if (wavelength < 590) return { label: "Amarillo visible", region: "visible" };
    if (wavelength < 620) return { label: "Naranja visible", region: "visible" };
    if (wavelength <= 750) return { label: "Rojo visible", region: "visible" };
    return { label: "Infrarrojo (no visible)", region: "ir" };
  }

  function rgbFor(wavelength) {
    if (wavelength < 380 || wavelength > 780) {
      return wavelength < 380 ? "#6d28d9" : "#7f1d1d";
    }

    // El rojo del He-Ne (632.8 nm) se percibe como rojo, no como naranja.
    if (wavelength >= 620 && wavelength <= 750) {
      return "#e63946";
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

  function update(wavelength) {
    const value = clamp(Number(wavelength));
    if (!Number.isFinite(value)) return;

    const lambda = value * 1e-9;
    const frequency = C / lambda;
    const energy = H * frequency;
    const electronVolts = energy / EV;
    const region = regionFor(value);

    range.value = String(value);
    numberInput.value = String(value);
    wavelengthOutput.textContent = `${formatNumber(value, 4)} nm`;
    range.setAttribute("aria-valuetext", `${formatNumber(value, 4)} nanómetros, ${region.label}`);

    freqValue.innerHTML = `${formatNumber(frequency / 1e12, 4)} THz`;
    energyJ.innerHTML = `${formatSci(energy, 4)} J`;
    energyEv.innerHTML = `${formatNumber(electronVolts, 4)} eV`;
    regionLabel.textContent = region.label;

    swatch.dataset.region = region.region;
    swatch.style.backgroundColor = rgbFor(value);

    substitution.innerHTML =
      `λ = ${formatNumber(value, 4)} × 10<sup>-9</sup> m; ` +
      `f = c/λ = ${formatNumber(frequency / 1e12, 4)} × 10<sup>12</sup> Hz; ` +
      `E = hf = ${formatSci(energy, 4)} J = ${formatNumber(electronVolts, 4)} eV.`;
  }

  range.addEventListener("input", () => update(range.value));

  numberInput.addEventListener("change", () => {
    if (numberInput.value === "") {
      update(range.value);
      return;
    }
    update(numberInput.value);
  });

  presets.forEach((button) => {
    button.addEventListener("click", () => {
      update(button.dataset.wavelength);
      range.focus();
    });
  });

  update(632.8);
})();
