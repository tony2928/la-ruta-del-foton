/* =========================================================
   Mini-experimentos de propiedades: espectro, fase y distancia
   ========================================================= */
(() => {
  "use strict";

  const spectrumWidth = document.getElementById("spectrum-width");
  const spectrumBand = document.getElementById("spectrum-band");
  const spectrumWidthValue = document.getElementById("spectrum-width-value");

  function updateSpectrum() {
    if (!spectrumWidth || !spectrumBand || !spectrumWidthValue) return;
    const value = Number(spectrumWidth.value);
    spectrumWidthValue.textContent = String(value);
    spectrumBand.style.width = `${Math.max(2, (value / 60) * 100)}%`;
    spectrumWidth.setAttribute("aria-valuetext", `${value} nanómetros de ancho espectral`);
  }

  if (spectrumWidth) {
    spectrumWidth.addEventListener("input", updateSpectrum);
    updateSpectrum();
  }

  const coherencePhase = document.getElementById("coherence-phase");
  const coherencePhaseValue = document.getElementById("coherence-phase-value");
  const waveRef = document.getElementById("wave-ref");
  const waveShift = document.getElementById("wave-shift");
  const coherenceLabel = document.getElementById("coherence-label");
  const interferenceBar = document.getElementById("interference-bar");

  function wavePath(phaseDegrees, y0 = 28, amplitude = 14) {
    const phase = (phaseDegrees * Math.PI) / 180;
    let path = `M 6 ${y0}`;

    for (let x = 6; x <= 274; x += 2) {
      const y = y0 - amplitude * Math.sin(((x - 6) / 48) * 2 * Math.PI + phase);
      path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }

    return path;
  }

  function updateCoherence() {
    if (!coherencePhase || !waveShift || !coherencePhaseValue) return;

    const value = Number(coherencePhase.value);
    const phase = (value * Math.PI) / 180;

    if (waveRef) waveRef.setAttribute("d", wavePath(0, 28, 14));
    waveShift.setAttribute("d", wavePath(value, 54, 14));
    coherencePhaseValue.textContent = `${value}°`;
    coherencePhase.setAttribute("aria-valuetext", `${value} grados de diferencia de fase`);

    if (coherenceLabel) {
      coherenceLabel.textContent = value === 0 ? "EN FASE" : value === 180 ? "EN OPOSICIÓN" : "DESFASADAS";
    }

    if (interferenceBar) {
      const contrast = 0.15 + 0.85 * Math.cos(phase / 2) ** 2;
      interferenceBar.style.opacity = contrast.toFixed(2);
    }
  }

  if (coherencePhase) {
    coherencePhase.addEventListener("input", updateCoherence);
    updateCoherence();
  }

  const distanceRange = document.getElementById("distance-range");
  const distanceValue = document.getElementById("distance-value");
  const spotValue = document.getElementById("spot-value");
  const laserSpot = document.getElementById("laser-spot");

  function updateDistance() {
    if (!distanceRange || !distanceValue || !spotValue || !laserSpot) return;

    const distance = Number(distanceRange.value);
    const spotMm = Math.round(distance * 1); // 1 mrad ≈ 1 mm de diámetro por metro.
    const radius = 1.5 + Math.sqrt(distance) * 0.55;

    distanceValue.textContent = String(distance);
    spotValue.textContent = String(spotMm);
    laserSpot.setAttribute("r", radius.toFixed(1));
    distanceRange.setAttribute(
      "aria-valuetext",
      `${distance} metros; diámetro del haz ${spotMm} milímetros`
    );
  }

  if (distanceRange) {
    distanceRange.addEventListener("input", updateDistance);
    updateDistance();
  }
})();
