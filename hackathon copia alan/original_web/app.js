/* Orbital Farm · Controlador Minimalista, Animaciones de Gráficas, Mapa NASA POWER y Traductor Universal */

const PARAM_LABELS = {
  T2M: { es: "Temp. Media (°C)", en: "Mean Temp (°C)", isPct: false },
  T2M_MAX: { es: "Temp. Máxima (°C)", en: "Max Temp (°C)", isPct: false },
  T2M_MIN: { es: "Temp. Mínima (°C)", en: "Min Temp (°C)", isPct: false },
  PRECTOTCORR: { es: "Lluvia (mm/día)", en: "Rain (mm/day)", isPct: false },
  GWETROOT: { es: "Humedad Raíces (%)", en: "Root Moisture (%)", isPct: true },
  GWETTOP: { es: "Humedad Sup. (%)", en: "Surface Moisture (%)", isPct: true },
  GWETPROF: { es: "Humedad Perfil (%)", en: "Profile Moisture (%)", isPct: true },
  ALLSKY_SFC_SW_DWN: { es: "Radiación Solar (MJ/m²)", en: "Solar Rad. (MJ/m²)", isPct: false },
  RH2M: { es: "Humedad Aire (%)", en: "Air Humidity (%)", isPct: false },
  WS2M: { es: "Viento (m/s)", en: "Wind (m/s)", isPct: false },
  T2MDEW: { es: "Punto de Rocío (°C)", en: "Dew Point (°C)", isPct: false },
};

const BASE_ES = {
  appSubtitle: "Satélites NASA · Suelo Local · Rotaciones",
  navHome: "Portada",
  navNasa: "1. Mapa NASA",
  navDiag: "2. Tu Suelo y Clima",
  navScen: "3. Escenarios Futuros",
  navRot: "4. Rotaciones",
  statusReady: "Listo para consultar",
  langOtherOption: "Otro idioma...",
  translateBtn: "Traducir",
  heroKicker: "NASA SPACE APPS · AGRICULTURA RESILIENTE",
  heroTitle: "Diseña rotaciones de cultivo guiadas por satélites de la NASA y tu suelo",
  heroDesc: "Elige tu ubicación, ingresa las características reales de tu terreno y descubre cómo proteger tu cosecha, conservar agua y regenerar la fertilidad ante el cambio climático.",
  presetLabel: "Ubicación Inicial",
  currentCropLabel: "Tu Cultivo Actual",
  heroCtaMain: "Comenzar en el Mapa NASA →",
  heroCtaSoil: "Ir directo a Datos del Suelo",
  portalNasaTitle: "Mapa y Datos NASA POWER",
  portalNasaDesc: "Ubica tu parcela en el mapa satelital y elige variables climáticas claras para consultar en vivo.",
  portalDiagTitle: "Tu Suelo y Diagnóstico",
  portalDiagDesc: "Ingresa textura, materia orgánica, pH y riego para generar tus gráficas climáticas e hídricas.",
  portalScenTitle: "Escenarios Futuros",
  portalScenDesc: "Visualiza el futuro de tu cultivo bajo sequía extrema, calentamiento o lluvias intensas.",
  portalRotTitle: "Rotaciones y Mandala",
  portalRotDesc: "Ajusta prioridades, explora el Mandala vivo de raíces y descarga tu plan agronómico.",
  portalOpen: "Abrir →",
  nasaViewTitle: "1. Ubicación en Mapa y Consulta NASA POWER",
  nasaViewDesc: "Haz clic en tu terreno sobre el mapa, selecciona las variables que deseas medir y presiona Consultar para ver gráficas y tabla.",
  openOfficialDav: "Visor Oficial NASA ↗",
  goToDiagnostics: "Continuar a tu Suelo →",
  mapTitle: "Mapa Satelital de tu Parcela",
  layerSat: "Satélite",
  layerTopo: "Relieve",
  layerOsm: "Calles",
  latLabel: "Latitud (°)",
  lonLabel: "Longitud (°)",
  corridorLabel: "Región de Referencia",
  davConsoleTitle: "¿Qué datos satelitales deseas consultar?",
  davTemporalLabel: "Frecuencia de Datos",
  tempMonthly: "Mensual (Últimos años)",
  tempDaily: "Diaria (Detalle por día)",
  tempClim: "Promedio Histórico",
  davCommunityLabel: "Archivo NASA",
  davStartLabel: "Año o Fecha Inicio",
  davEndLabel: "Año o Fecha Fin",
  davParamsLabel: "Variables climáticas y del suelo",
  queryNasaBtn: "Consultar Datos NASA",
  downloadNasaCsvBtn: "Descargar CSV",
  nasaEmptyText: "Selecciona un punto en el mapa y presiona \"Consultar Datos NASA\" para generar la gráfica y tabla satelital.",
  davChartTitle: "Gráfica de Observaciones Satelitales",
  davTableTitle: "Tabla de Registros NASA POWER",
  diagTitle: "2. Datos de tu Suelo y Diagnóstico Climático",
  soilConfigTitle: "Ingresa la Información Local de tu Terreno",
  textureLabel: "Textura del Suelo",
  somLabel: "Materia Orgánica",
  phLabel: "Acidez / pH del Suelo",
  nLabel: "Nitrógeno Inicial (kg/ha)",
  slopeLabel: "Pendiente del Terreno (%)",
  irrigLabel: "Acceso a Agua / Riego",
  irrigRainfed: "Solo Lluvia (Sin riego)",
  irrigDeficit: "Riego Auxiliar / Limitado",
  irrigFull: "Riego Completo",
  recalcSoilBtn: "Generar Diagnóstico y Gráficas",
  diagEmptyText: "Ajusta los datos de tu suelo arriba y presiona \"Generar Diagnóstico y Gráficas\" para visualizar el balance hídrico de tu terreno junto a los datos de la NASA.",
  kpiPrecip: "Lluvia Anual vs. Demanda Agua",
  kpiWarming: "Cambio Térmico (10 años)",
  kpiExtremes: "Días Extremos al Año",
  kpiWetness: "Capacidad Hídrica de tu Suelo",
  historyChartTitle: "Tendencia Histórica NASA POWER (2016–2025)",
  climateChartTitle: "Humedad de tu Suelo Local vs. Clima NASA",
  monthlyTableTitle: "Tabla Mensual Clima NASA + Agua en tu Suelo",
  goToScenarios: "Ver Escenarios Futuros →",
  scenViewTitle: "3. Simulador de Escenarios Futuros",
  scenViewDesc: "Compara cómo resistirá tu siembra actual frente a rotaciones recomendadas bajo distintos futuros climáticos.",
  calcScenariosBtn: "Simular Todos los Escenarios",
  scenEmptyText: "Primero completa tus datos en \"2. Tu Suelo y Clima\" o presiona \"Simular Todos los Escenarios\" para calcular los resultados.",
  scenChartTitle: "Estabilidad de Cosecha: Siembra Actual vs. Rotación",
  scenTableTitle: "Resumen Comparativo por Escenario",
  goToRotations: "Diseñar Rotaciones →",
  rotViewTitle: "4. Estrategias de Rotación y Mandala Órbita-Raíz",
  rotViewDesc: "Ajusta tus prioridades para optimizar una rotación a 3 años (6 ciclos) adaptada a tu parcela.",
  exportPngBtn: "Guardar Mandala PNG",
  exportCsvBtn: "Exportar Plan CSV",
  prioritiesHead: "Tus Prioridades",
  prioSoil: "Salud del Suelo",
  prioWater: "Ahorro de Agua",
  prioClimate: "Resistencia a Clima Extremo",
  prioProfit: "Ingreso y Alimento",
  scenarioLabel: "Escenario a Optimizar",
  scenBaseline: "Clima Actual NASA POWER",
  scenWarmDry: "Calor y Sequía (+1.5°C / -15% lluvia)",
  scenExtreme: "Sequía Extrema (+2.5°C / -25% lluvia)",
  scenWet: "Lluvias Torrenciales (+1.2°C / +30% lluvia)",
  optimizeBtn: "Generar Rotaciones Óptimas",
  stratTitle: "Opciones Recomendadas",
  rotEmptyText: "Ajusta tus prioridades a la izquierda y presiona \"Generar Rotaciones Óptimas\" para revelar el Mandala y el plan agronómico.",
  mandalaTitle: "Mandala Vivo Órbita-Raíz",
  mandalaDesc: "Clima satelital NASA (exterior) conectado a tus cultivos y raíces (interior).",
  soilTrajectoryTitle: "Evolución de Materia Orgánica y Nitrógeno",
  compChartTitle: "Rotación vs. Siembra Actual",
  timelineTitle: "Plan Agronómico Ciclo por Ciclo (3 Años)",
  customOption: "Coordenadas Personalizadas",
  vsBaselineSom: "Ganancia MOS vs. Actual",
  vsBaselineWater: "Ahorro Hídrico (3 años)",
  vsBaselineYield: "Estabilidad Rendimiento",
  vsBaselineN: "Nitrógeno Fijado",
};

const BASE_EN = {
  appSubtitle: "NASA Satellites · Local Soil · Rotations",
  navHome: "Home",
  navNasa: "1. NASA Map",
  navDiag: "2. Soil & Climate",
  navScen: "3. Future Scenarios",
  navRot: "4. Rotations",
  statusReady: "Ready to query",
  langOtherOption: "Other language...",
  translateBtn: "Translate",
  heroKicker: "NASA SPACE APPS · RESILIENT AGRICULTURE",
  heroTitle: "Design crop rotations guided by NASA satellites and your local soil",
  heroDesc: "Select your location, enter your real soil conditions, and explore how to protect harvests, conserve water, and rebuild fertility under changing climates.",
  presetLabel: "Starting Location",
  currentCropLabel: "Your Current Crop",
  heroCtaMain: "Start on NASA Map →",
  heroCtaSoil: "Go straight to Soil Data",
  portalNasaTitle: "NASA POWER Map & Data",
  portalNasaDesc: "Locate your field on the satellite map and choose clear weather & soil variables to query live.",
  portalDiagTitle: "Your Soil & Diagnostics",
  portalDiagDesc: "Enter soil texture, organic matter, pH, and irrigation to generate climate and water charts.",
  portalScenTitle: "Future Scenarios",
  portalScenDesc: "See how your crop performs under severe drought, warming, or torrential rainfall.",
  portalRotTitle: "Rotations & Mandala",
  portalRotDesc: "Tune your priorities, explore the living orbital-root Mandala, and export your plan.",
  portalOpen: "Open →",
  nasaViewTitle: "1. Map Location & NASA POWER Query",
  nasaViewDesc: "Click your field on the map, pick the variables you want to inspect, and press Query to generate charts and tables.",
  openOfficialDav: "Official NASA Viewer ↗",
  goToDiagnostics: "Continue to Your Soil →",
  mapTitle: "Satellite Map of Your Field",
  layerSat: "Satellite",
  layerTopo: "Terrain",
  layerOsm: "Streets",
  latLabel: "Latitude (°)",
  lonLabel: "Longitude (°)",
  corridorLabel: "Reference Region",
  davConsoleTitle: "Which satellite data do you want to query?",
  davTemporalLabel: "Data Frequency",
  tempMonthly: "Monthly (Recent Years)",
  tempDaily: "Daily (Day-by-Day)",
  tempClim: "Historical Average",
  davCommunityLabel: "NASA Archive",
  davStartLabel: "Start Year or Date",
  davEndLabel: "End Year or Date",
  davParamsLabel: "Climate and soil variables",
  queryNasaBtn: "Query NASA Data",
  downloadNasaCsvBtn: "Download CSV",
  nasaEmptyText: "Pick a point on the map and press \"Query NASA Data\" to generate the satellite chart and table.",
  davChartTitle: "Satellite Observations Chart",
  davTableTitle: "NASA POWER Records Table",
  diagTitle: "2. Your Soil Data & Climate Diagnostics",
  soilConfigTitle: "Enter Your Field's Local Soil Information",
  textureLabel: "Soil Texture",
  somLabel: "Organic Matter",
  phLabel: "Soil Acidity / pH",
  nLabel: "Initial Nitrogen (kg/ha)",
  slopeLabel: "Field Slope (%)",
  irrigLabel: "Water Access / Irrigation",
  irrigRainfed: "Rainfed Only (Zero Irrigation)",
  irrigDeficit: "Supplemental / Limited Irrigation",
  irrigFull: "Full Irrigation",
  recalcSoilBtn: "Generate Diagnostics & Charts",
  diagEmptyText: "Adjust your soil inputs above and press \"Generate Diagnostics & Charts\" to see your local soil water balance alongside NASA data.",
  kpiPrecip: "Annual Rain vs. Water Demand",
  kpiWarming: "10-Yr Warming Shift",
  kpiExtremes: "Extreme Days / Year",
  kpiWetness: "Local Soil Water Capacity",
  historyChartTitle: "NASA POWER Historical Trend (2016–2025)",
  climateChartTitle: "Your Local Soil Moisture vs. NASA Climate",
  monthlyTableTitle: "Monthly NASA Climate + Local Soil Water Table",
  goToScenarios: "Explore Future Scenarios →",
  scenViewTitle: "3. Future Climate Scenarios Simulator",
  scenViewDesc: "Compare how your current crop performs against recommended rotations across climate futures.",
  calcScenariosBtn: "Simulate All Scenarios",
  scenEmptyText: "Complete your soil inputs in \"2. Soil & Climate\" or press \"Simulate All Scenarios\" to compute results.",
  scenChartTitle: "Harvest Stability: Current Crop vs. Rotation",
  scenTableTitle: "Scenario Comparison Summary",
  goToRotations: "Design Rotations →",
  rotViewTitle: "4. Rotation Strategies & Orbital-Root Mandala",
  rotViewDesc: "Tune your priorities to optimize a 3-year (6-season) rotation tailored to your land.",
  exportPngBtn: "Save Mandala PNG",
  exportCsvBtn: "Export CSV Plan",
  prioritiesHead: "Your Priorities",
  prioSoil: "Soil Health",
  prioWater: "Water Saving",
  prioClimate: "Extreme Weather Resilience",
  prioProfit: "Income & Food",
  scenarioLabel: "Scenario to Optimize",
  scenBaseline: "Current NASA POWER Climate",
  scenWarmDry: "Warm & Dry (+1.5°C / -15% rain)",
  scenExtreme: "Extreme Drought (+2.5°C / -25% rain)",
  scenWet: "Heavy Rain (+1.2°C / +30% rain)",
  optimizeBtn: "Generate Optimal Rotations",
  stratTitle: "Recommended Options",
  rotEmptyText: "Adjust your priorities on the left and press \"Generate Optimal Rotations\" to reveal the Mandala and field plan.",
  mandalaTitle: "Living Orbital-to-Root Mandala",
  mandalaDesc: "NASA satellite climate (outer ring) connected to your seasonal crops and roots (inner core).",
  soilTrajectoryTitle: "Organic Matter & Nitrogen Trajectory",
  compChartTitle: "Rotation vs. Current Crop",
  timelineTitle: "Season-by-Season Field Plan (3 Years)",
  customOption: "Custom Coordinates",
  vsBaselineSom: "SOM Gain vs. Current",
  vsBaselineWater: "Water Saved (3 yr)",
  vsBaselineYield: "Yield Stability",
  vsBaselineN: "Biological N Fixed",
};

const state = {
  lang: "es",
  dict: { ...BASE_ES },
  bootstrap: null,
  climate: null,
  optimization: null,
  scenariosMatrix: null,
  davResult: null,
  selectedStrategyIdx: 0,
  leafletMap: null,
  leafletMarker: null,
  leafletLayers: {},
  heroAngle: 0,
  // Flags de revelación progresiva: las gráficas se muestran cuando el usuario confirma/consulta
  nasaRevealed: false,
  diagRevealed: false,
  scenRevealed: false,
  rotRevealed: false,
};

const $ = (id) => document.getElementById(id);
const t = (k) => state.dict[k] || BASE_ES[k] || k;

function paramLabel(code) {
  const meta = PARAM_LABELS[code];
  if (!meta) return code;
  return state.lang.toLowerCase().startsWith("en") ? meta.en : meta.es;
}

function formatParamValue(code, rawVal) {
  if (rawVal === undefined || rawVal === null || rawVal <= -900) return "—";
  const num = Number(rawVal);
  if (Number.isNaN(num)) return "—";
  if (PARAM_LABELS[code]?.isPct) return `${Math.round(num * 100)}%`;
  return num.toFixed(1);
}

/* ==================== ANIMADOR DE GRÁFICAS CANVAS ==================== */
function animateChart(canvasId, drawFrameFn, durationMs = 480) {
  const start = performance.now();
  function step(now) {
    const raw = Math.min(1, (now - start) / durationMs);
    const eased = 1 - Math.pow(1 - raw, 3); // easeOutCubic
    drawFrameFn(eased);
    if (raw < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ==================== NAVEGACIÓN ==================== */
function showView(viewName) {
  document.querySelectorAll(".view").forEach((el) => el.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });
  const target = $(`view-${viewName}`);
  if (target) target.classList.add("active");

  if (viewName === "nasa" && state.leafletMap) {
    setTimeout(() => state.leafletMap.invalidateSize(), 120);
  }
  if (viewName === "diagnostics" && state.diagRevealed && state.climate) {
    renderClimateViews();
  }
  if (viewName === "scenarios" && state.scenRevealed && state.scenariosMatrix) {
    renderScenariosMatrix();
  }
  if (viewName === "rotations" && state.rotRevealed && state.optimization) {
    renderRotationsView();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==================== TRADUCTOR UNIVERSAL ==================== */
async function setLanguage(langCode) {
  const code = (langCode || "es").trim();
  state.lang = code;
  document.documentElement.dir = code.toLowerCase().startsWith("ar") ? "rtl" : "ltr";

  if (code === "es") state.dict = { ...BASE_ES };
  else if (code === "en") state.dict = { ...BASE_EN };
  else {
    updateNasaStatus(`Traduciendo (${code})...`, "loading");
    try {
      const resp = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_lang: code, source_lang: "es", texts: BASE_ES }),
      });
      const data = await resp.json();
      state.dict = data.translations || { ...BASE_ES };
    } catch {
      state.dict = { ...BASE_ES };
    }
  }
  applyTranslationsToDom();
}

function applyTranslationsToDom() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (k && state.dict[k]) el.textContent = state.dict[k];
  });
  populatePresetSelects();
  populateTextureSelect();
  populateCurrentCropSelect();
  if (state.nasaRevealed && state.davResult) renderDavResults();
  if (state.diagRevealed && state.climate) renderClimateViews();
  if (state.scenRevealed && state.scenariosMatrix) renderScenariosMatrix();
  if (state.rotRevealed && state.optimization) renderRotationsView();
}

/* ==================== SELECTORES ==================== */
function populatePresetSelects() {
  if (!state.bootstrap) return;
  const isEn = state.lang.toLowerCase().startsWith("en");
  [$("presetSelect"), $("homePresetSelect")].forEach((sel) => {
    if (!sel) return;
    const prev = sel.value || "bajio_mx";
    sel.innerHTML = "";
    state.bootstrap.presets.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = isEn ? p.name_en : p.name_es;
      sel.appendChild(opt);
    });
    const custom = document.createElement("option");
    custom.value = "custom";
    custom.textContent = t("customOption");
    sel.appendChild(custom);
    sel.value = prev;
  });
}

function populateTextureSelect() {
  if (!state.bootstrap) return;
  const sel = $("textureSelect");
  const prev = sel.value || "clay_loam";
  const isEn = state.lang.toLowerCase().startsWith("en");
  sel.innerHTML = "";
  state.bootstrap.soil_textures.forEach((tx) => {
    const opt = document.createElement("option");
    opt.value = tx.code;
    opt.textContent = isEn ? tx.label_en : tx.label_es;
    sel.appendChild(opt);
  });
  sel.value = prev;
}

function populateCurrentCropSelect() {
  if (!state.bootstrap) return;
  const isEn = state.lang.toLowerCase().startsWith("en");
  [$("homeCurrentCrop"), $("currentCropSelect")].forEach((sel) => {
    if (!sel) return;
    const prev = sel.value || "maize";
    sel.innerHTML = "";
    state.bootstrap.crops
      .filter((c) => c.group !== "cover")
      .forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = isEn ? c.name_en : c.name_es;
        sel.appendChild(opt);
      });
    sel.value = prev;
  });
}

/* ==================== ANIMACIÓN DE PORTADA ==================== */
function startHeroAnimation() {
  const canvas = $("heroOrbitCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function frame() {
    state.heroAngle += 0.0075;
    const w = canvas.width, h = canvas.height, cx = w / 2, cy = h / 2;
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(cx, cy, 16, cx, cy, 190);
    bg.addColorStop(0, "#143528");
    bg.addColorStop(0.6, "#0b1a14");
    bg.addColorStop(1, "#070e0b");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    [148, 108].forEach((r, idx) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(idx * 0.5 + state.heroAngle * (idx === 0 ? 0.22 : -0.18));
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.58, 0, 0, Math.PI * 2);
      ctx.strokeStyle = idx === 0 ? "rgba(94, 199, 230, 0.3)" : "rgba(88, 214, 141, 0.2)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 5]);
      ctx.stroke();
      ctx.restore();
    });
    ctx.setLineDash([]);

    const sx = cx + Math.cos(state.heroAngle * 1.3) * 140;
    const sy = cy + Math.sin(state.heroAngle * 1.3) * 82;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(cx, cy);
    ctx.strokeStyle = "rgba(94, 199, 230, 0.2)"; ctx.lineWidth = 1.3; ctx.stroke();

    ctx.beginPath(); ctx.arc(sx, sy, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = "#5ec7e6"; ctx.fill();

    ctx.beginPath(); ctx.arc(cx, cy, 46, 0, Math.PI * 2);
    const eg = ctx.createRadialGradient(cx - 12, cy - 12, 6, cx, cy, 46);
    eg.addColorStop(0, "#3db489"); eg.addColorStop(0.7, "#175341"); eg.addColorStop(1, "#0c231c");
    ctx.fillStyle = eg; ctx.fill();
    ctx.strokeStyle = "#58d68d"; ctx.lineWidth = 1.6; ctx.stroke();

    ctx.strokeStyle = "#58d68d"; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(cx, cy + 5); ctx.lineTo(cx, cy - 22); ctx.stroke();
    ctx.fillStyle = "#58d68d";
    ctx.beginPath();
    ctx.ellipse(cx - 10, cy - 15, 9, 4.2, -0.5, 0, Math.PI * 2);
    ctx.ellipse(cx + 10, cy - 19, 9, 4.2, 0.5, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ==================== MAPA LEAFLET ==================== */
function initInteractiveMap() {
  const lat = parseFloat($("latInput").value) || 20.6;
  const lon = parseFloat($("lonInput").value) || -101.2;

  if (typeof L !== "undefined") {
    try {
      const map = L.map("leafletMap", { worldCopyJump: true }).setView([lat, lon], 5);
      const sat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Esri" });
      const topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", { attribution: "OpenTopoMap" });
      const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "OSM" });
      sat.addTo(map);
      state.leafletLayers = { satellite: sat, topo, osm };
      state.leafletMap = map;
      state.leafletMarker = L.marker([lat, lon]).addTo(map);

      if (state.bootstrap) {
        state.bootstrap.presets.forEach((p) => {
          const m = L.circleMarker([p.latitude, p.longitude], {
            radius: 6.5, color: "#e6c25b", fillColor: "#58d68d", fillOpacity: 0.9,
          }).addTo(map);
          m.bindTooltip(p.name_es);
          m.on("click", () => selectPresetById(p.id, false));
        });
      }

      map.on("click", (e) => {
        const clat = Math.max(-65, Math.min(65, e.latlng.lat));
        const clon = Math.max(-180, Math.min(180, e.latlng.lng));
        $("latInput").value = clat.toFixed(2);
        $("lonInput").value = clon.toFixed(2);
        $("presetSelect").value = "custom";
        $("homePresetSelect").value = "custom";
        updateMapMarker(clat, clon);
      });

      $("mapLayerSelect").addEventListener("change", (ev) => {
        Object.values(state.leafletLayers).forEach((l) => map.removeLayer(l));
        if (state.leafletLayers[ev.target.value]) state.leafletLayers[ev.target.value].addTo(map);
      });
      return;
    } catch {
      // Fallback
    }
  }
  $("leafletMap").classList.add("hidden");
  $("fallbackMapCanvas").classList.remove("hidden");
  drawFallbackMap();
}

function updateMapMarker(lat, lon) {
  if (state.leafletMap && state.leafletMarker) {
    state.leafletMarker.setLatLng([lat, lon]);
    state.leafletMap.panTo([lat, lon]);
  }
  drawFallbackMap();
  $("heroLocationChip").textContent = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
  $("diagCoordPill").textContent = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
}

function drawFallbackMap() {
  const canvas = $("fallbackMapCanvas");
  if (!canvas || canvas.classList.contains("hidden")) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = "#09120e"; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(130, 195, 165, 0.14)";
  for (let x = 0; x <= w; x += w / 6) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y <= h; y += h / 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  const lat = parseFloat($("latInput").value) || 0;
  const lon = parseFloat($("lonInput").value) || 0;
  const tx = ((lon + 180) / 360) * w, ty = ((90 - lat) / 180) * h;
  ctx.strokeStyle = "#5ec7e6"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(tx, ty, 8, 0, Math.PI * 2); ctx.stroke();
}

/* ==================== VISOR NASA POWER ==================== */
function getSelectedDavParams() {
  return Array.from(document.querySelectorAll("#davParamsGrid input:checked")).map((i) => i.value);
}

async function runDavQuery() {
  const lat = parseFloat($("latInput").value) || 20.6;
  const lon = parseFloat($("lonInput").value) || -101.2;
  const community = $("davCommunity").value;
  const temporal = $("davTemporal").value;
  const start = $("davStart").value.trim() || "2023";
  const end = $("davEnd").value.trim() || "2025";
  const parameters = getSelectedDavParams();

  updateNasaStatus("Consultando NASA POWER...", "loading");
  const resp = await fetch("/api/nasa-viewer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude: lat, longitude: lon, community, temporal, parameters, start, end, format: "JSON" }),
  });
  state.davResult = await resp.json();
  state.nasaRevealed = true;
  $("nasaEmptyHint").classList.add("hidden");
  $("nasaResultsBlock").classList.remove("hidden");
  renderDavResults();
  // Sincronizar perfil climático en segundo plano para el siguiente paso
  await ensureClimateFetched();
}

function renderDavResults() {
  const res = state.davResult;
  if (!res) return;
  $("davSourceBadge").textContent = res.status === "LIVE_NASA_POWER" ? "NASA POWER en Vivo" : res.status;
  updateNasaStatus(res.status === "LIVE_NASA_POWER" ? "NASA POWER en Vivo" : "Base NASA Lista", res.status);

  const series = res.parameter_series || {};
  const paramNames = Object.keys(series);
  const table = $("davDataTable");
  if (!paramNames.length) {
    table.innerHTML = "<tr><td>Sin registros disponibles.</td></tr>";
    return;
  }

  const keys = Object.keys(series[paramNames[0]] || {}).filter((k) => !k.endsWith("13"));
  const recentKeys = keys.slice(-24);

  let html = `<thead><tr><th>Periodo</th>${paramNames.map((p) => `<th>${paramLabel(p)}</th>`).join("")}</tr></thead><tbody>`;
  recentKeys.slice().reverse().forEach((k) => {
    const prettyDate = k.length === 6 ? `${k.slice(0, 4)}-${k.slice(4)}` : k.length === 8 ? `${k.slice(0, 4)}-${k.slice(4, 6)}-${k.slice(6)}` : k;
    html += `<tr><td><strong>${prettyDate}</strong></td>${paramNames
      .map((p) => `<td>${formatParamValue(p, series[p]?.[k])}</td>`)
      .join("")}</tr>`;
  });
  html += "</tbody>";
  table.innerHTML = html;

  const chartParams = paramNames.slice(0, 3);
  animateChart("davSeriesCanvas", (prog) => drawDavSeriesChart(recentKeys, series, chartParams, prog));
}

function drawDavSeriesChart(keys, series, params, progress = 1) {
  const canvas = $("davSeriesCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#09120e"; ctx.fillRect(0, 0, w, h);
  if (!keys.length || !params.length) return;

  const colors = ["#58d68d", "#5ec7e6", "#f4a236"];
  const padL = 48, padR = 20, padT = 32, padB = 30;
  const pw = w - padL - padR, ph = h - padT - padB;

  const valFor = (p, k) => {
    const raw = Number(series[p]?.[k]);
    if (Number.isNaN(raw) || raw <= -900) return null;
    return PARAM_LABELS[p]?.isPct ? raw * 100 : raw;
  };

  const allVals = [];
  params.forEach((p) => keys.forEach((k) => { const v = valFor(p, k); if (v !== null) allVals.push(v); }));
  const minV = allVals.length ? Math.min(...allVals) : 0;
  const maxV = allVals.length ? Math.max(...allVals) : 10;
  const span = Math.max(1e-3, maxV - minV);

  ctx.strokeStyle = "rgba(150,200,175,0.12)";
  for (let i = 0; i <= 4; i++) {
    const y = padT + (i / 4) * ph;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.fillStyle = "#93aba0"; ctx.font = "10px Inter, sans-serif"; ctx.textAlign = "right";
    ctx.fillText((maxV - (i / 4) * span).toFixed(1), padL - 6, y + 3);
  }

  const maxIdx = Math.max(1, Math.floor((keys.length - 1) * progress));
  params.forEach((p, pi) => {
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= maxIdx; i++) {
      const v = valFor(p, keys[i]);
      if (v === null) continue;
      const x = padL + (i / Math.max(1, keys.length - 1)) * pw;
      const y = padT + ph - ((v - minV) / span) * ph;
      if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = colors[pi % colors.length]; ctx.lineWidth = 2.2; ctx.stroke();

    ctx.fillStyle = colors[pi % colors.length];
    ctx.font = "600 10.5px Inter, sans-serif"; ctx.textAlign = "left";
    ctx.fillText(`— ${paramLabel(p)}`, padL + pi * 170, 18);
  });

  ctx.fillStyle = "#93aba0"; ctx.font = "10px Inter, sans-serif"; ctx.textAlign = "center";
  [0, Math.floor(keys.length / 2), keys.length - 1].forEach((idx) => {
    if (keys[idx]) ctx.fillText(keys[idx], padL + (idx / Math.max(1, keys.length - 1)) * pw, h - 10);
  });
}

/* ==================== CARGA Y CÁLCULO DE SUELO + CLIMA ==================== */
function getPayloadParams() {
  return {
    soil: {
      texture: $("textureSelect").value || "clay_loam",
      som_pct: parseFloat($("somInput").value) || 1.8,
      ph: parseFloat($("phInput").value) || 7.3,
      initial_n_kg_ha: parseFloat($("nInput").value) || 42,
      slope_pct: parseFloat($("slopeInput").value) || 2.5,
      irrigation_mode: $("irrigSelect").value || "deficit",
    },
    priorities: {
      soil_health: parseFloat($("prioSoil").value) || 30,
      water_conservation: parseFloat($("prioWater").value) || 30,
      climate_resilience: parseFloat($("prioClimate").value) || 20,
      profit_food: parseFloat($("prioProfit").value) || 20,
    },
    current_crop_id: $("currentCropSelect").value || "maize",
  };
}

function updateNasaStatus(text, mode) {
  const pill = $("nasaStatusBadge");
  pill.className = "status-pill";
  if (mode === "LIVE_NASA_POWER") pill.classList.add("status-live");
  else if (mode === "CACHED_NASA_POWER") pill.classList.add("status-cached");
  else pill.classList.add("status-offline");
  $("nasaStatusText").textContent = text;
}

async function ensureClimateFetched() {
  const lat = parseFloat($("latInput").value) || 20.6;
  const lon = parseFloat($("lonInput").value) || -101.2;
  const presetVal = $("presetSelect").value;
  const climResp = await fetch("/api/climate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      latitude: lat,
      longitude: lon,
      preset_id: presetVal !== "custom" ? presetVal : null,
      prefer_live: true,
    }),
  });
  state.climate = await climResp.json();
  updateNasaStatus(
    state.climate.source_status === "LIVE_NASA_POWER" ? "NASA POWER en Vivo" : "NASA POWER Lista",
    state.climate.source_status
  );
  return state.climate;
}

async function runDiagnosisWithUserSoil() {
  updateNasaStatus("Calculando con tu suelo...", "loading");
  await ensureClimateFetched();
  const { soil, priorities, current_crop_id } = getPayloadParams();
  const resp = await fetch("/api/optimize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      climate: state.climate,
      soil,
      priorities,
      scenario: $("scenarioSelect").value || "baseline",
      num_years: 3,
      current_crop_id,
    }),
  });
  state.optimization = await resp.json();
  state.diagRevealed = true;
  $("diagEmptyHint").classList.add("hidden");
  $("diagResultsBlock").classList.remove("hidden");
  updateNasaStatus("Diagnóstico Actualizado", state.climate.source_status);
  renderClimateViews();
}

async function runAllScenarios() {
  updateNasaStatus("Simulando escenarios...", "loading");
  await ensureClimateFetched();
  const { soil, priorities, current_crop_id } = getPayloadParams();
  const resp = await fetch("/api/scenarios-matrix", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      climate: state.climate,
      soil,
      priorities,
      num_years: 3,
      current_crop_id,
    }),
  });
  state.scenariosMatrix = await resp.json();
  state.scenRevealed = true;
  $("scenEmptyHint").classList.add("hidden");
  $("scenResultsBlock").classList.remove("hidden");
  updateNasaStatus("Escenarios Simulados", state.climate.source_status);
  renderScenariosMatrix();
}

async function runOptimizationRotations() {
  updateNasaStatus("Optimizando rotaciones...", "loading");
  await ensureClimateFetched();
  const { soil, priorities, current_crop_id } = getPayloadParams();
  const resp = await fetch("/api/optimize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      climate: state.climate,
      soil,
      priorities,
      scenario: $("scenarioSelect").value || "baseline",
      num_years: 3,
      current_crop_id,
    }),
  });
  state.optimization = await resp.json();
  state.selectedStrategyIdx = 0;
  state.rotRevealed = true;
  $("rotEmptyHint").classList.add("hidden");
  $("rotResultsBlock").classList.remove("hidden");
  $("rotSidebarResults").classList.remove("hidden");
  updateNasaStatus("Rotaciones Listas", state.climate.source_status);
  renderRotationsView();
}

/* ==================== RENDER DIAGNÓSTICO (RESPONDE AL SUELO DEL USUARIO) ==================== */
function renderClimateViews() {
  const clim = state.climate;
  if (!clim) return;
  const ann = clim.annual_summary;
  const localSoilMonths = state.optimization?.local_soil_months || [];
  const awc = state.optimization?.soil?.effective_awc_mm_m || 150;

  $("diagLocationSubtitle").textContent = `${clim.location_label} (${clim.latitude}°, ${clim.longitude}°) · Elevación ${clim.elevation_m} m`;
  $("kpiPrecip").textContent = `${Math.round(ann.total_precip_mm)} / ${Math.round(ann.total_eto_mm)} mm`;
  $("kpiAridity").textContent = `Índice de Aridez: ${ann.aridity_index}`;
  const sign = ann.warming_trend_c_decade >= 0 ? "+" : "";
  $("kpiWarming").textContent = `${sign}${ann.warming_trend_c_decade} °C/déc`;
  $("kpiTempMean").textContent = `Temp. Media: ${ann.mean_temp_c} °C`;
  $("kpiExtremes").textContent = `${ann.heat_stress_days_yr}d calor · ${ann.frost_days_yr}d frío`;
  $("kpiDrySpell").textContent = `Sequía máx: ${ann.longest_dry_spell_days} días`;

  const meanLocalMoist = localSoilMonths.length
    ? Math.round(localSoilMonths.reduce((a, b) => a + b.local_moisture_pct, 0) / localSoilMonths.length)
    : Math.round(ann.mean_gwetroot * 100);
  $("kpiWetness").textContent = `${meanLocalMoist}% (${awc} mm/m)`;
  $("kpiAwc").textContent = `Satélite raíces: ${Math.round(ann.mean_gwetroot * 100)}%`;

  animateChart("historyChartCanvas", (prog) => drawHistoryChart(clim, prog));
  animateChart("climateCanvas", (prog) => drawClimatePulseChart(clim, localSoilMonths, prog));
  renderMonthlyClimateTable(clim, localSoilMonths);
}

function drawHistoryChart(climate, progress = 1) {
  const canvas = $("historyChartCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#09120e"; ctx.fillRect(0, 0, w, h);

  const series = climate.annual_series || [];
  if (!series.length) return;
  const padL = 46, padR = 40, padT = 30, padB = 28;
  const pw = w - padL - padR, ph = h - padT - padB;
  const colW = pw / series.length;
  const maxAnomP = Math.max(30, ...series.map((r) => Math.abs(r.precip_anomaly_pct || 0)));
  const temps = series.map((r) => r.mean_t2m_c);
  const tMin = Math.min(...temps) - 0.6, tMax = Math.max(...temps) + 0.6;
  const midY = padT + ph * 0.5;

  ctx.strokeStyle = "rgba(150,200,175,0.16)";
  ctx.beginPath(); ctx.moveTo(padL, midY); ctx.lineTo(w - padR, midY); ctx.stroke();

  series.forEach((r, i) => {
    const anom = (r.precip_anomaly_pct || 0) * progress;
    const bh = (Math.abs(anom) / maxAnomP) * (ph * 0.42);
    const x = padL + i * colW + colW * 0.22;
    const y = anom >= 0 ? midY - bh : midY;
    ctx.fillStyle = anom >= 0 ? "rgba(94, 199, 230, 0.48)" : "rgba(224, 108, 117, 0.48)";
    ctx.fillRect(x, y, colW * 0.56, Math.max(2, bh));
    ctx.fillStyle = "#93aba0"; ctx.font = "10px Inter, sans-serif"; ctx.textAlign = "center";
    ctx.fillText(String(r.year), padL + (i + 0.5) * colW, h - 8);
  });

  const maxIdx = Math.max(1, Math.floor((series.length - 1) * progress));
  ctx.beginPath();
  for (let i = 0; i <= maxIdx; i++) {
    const r = series[i];
    const x = padL + (i + 0.5) * colW;
    const y = padT + ph - ((r.mean_t2m_c - tMin) / Math.max(0.5, tMax - tMin)) * ph;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "#f4a236"; ctx.lineWidth = 2.4; ctx.stroke();

  ctx.textAlign = "left"; ctx.font = "600 10.5px Inter, sans-serif";
  ctx.fillStyle = "#f4a236"; ctx.fillText("— Temperatura Media (°C)", padL, 16);
  ctx.fillStyle = "#5ec7e6"; ctx.fillText("■ Variación de Lluvia (%)", padL + 175, 16);
}

function drawClimatePulseChart(climate, localSoilMonths, progress = 1) {
  const canvas = $("climateCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#09120e"; ctx.fillRect(0, 0, w, h);

  const months = climate.months;
  const padL = 48, padR = 42, padT = 30, padB = 28;
  const pw = w - padL - padR, ph = h - padT - padB;
  const maxWater = Math.max(120, ...months.map((m) => Math.max(m.precip_mm, m.eto_mm)));
  const colW = pw / 12;

  ctx.strokeStyle = "rgba(150,200,175,0.12)";
  for (let i = 0; i <= 4; i++) {
    const y = padT + (i / 4) * ph;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.fillStyle = "#93aba0"; ctx.font = "10px Inter, sans-serif"; ctx.textAlign = "right";
    ctx.fillText(`${Math.round(maxWater * (1 - i / 4))}mm`, padL - 6, y + 3);
  }

  months.forEach((m, i) => {
    const bh = (m.precip_mm / maxWater) * ph * progress;
    ctx.fillStyle = "rgba(94, 199, 230, 0.36)";
    ctx.fillRect(padL + i * colW + colW * 0.22, padT + ph - bh, colW * 0.56, bh);
    ctx.fillStyle = "#eef5f0"; ctx.font = "10px Inter, sans-serif"; ctx.textAlign = "center";
    ctx.fillText(m.label_es || m.label, padL + (i + 0.5) * colW, h - 8);
  });

  const maxIdx = Math.max(1, Math.floor(11 * progress));
  const drawCurve = (getter, color, dash = []) => {
    ctx.beginPath(); ctx.setLineDash(dash);
    for (let i = 0; i <= maxIdx; i++) {
      const x = padL + (i + 0.5) * colW;
      const y = padT + ph - Math.max(0, Math.min(1, getter(i))) * ph;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color; ctx.lineWidth = 2.3; ctx.stroke(); ctx.setLineDash([]);
  };

  drawCurve((i) => months[i].eto_mm / maxWater, "#f4a236");
  drawCurve((i) => months[i].gwetroot, "#93aba0", [4, 4]);
  if (localSoilMonths.length === 12) {
    drawCurve((i) => localSoilMonths[i].local_moisture_pct / 100, "#58d68d");
  }

  ctx.textAlign = "left"; ctx.font = "600 10.5px Inter, sans-serif";
  ctx.fillStyle = "#5ec7e6"; ctx.fillText("■ Lluvia", padL, 16);
  ctx.fillStyle = "#f4a236"; ctx.fillText("— Demanda Agua (ETo)", padL + 66, 16);
  ctx.fillStyle = "#58d68d"; ctx.fillText("— Humedad en TU Suelo (%)", padL + 215, 16);
}

function renderMonthlyClimateTable(climate, localSoilMonths) {
  const table = $("monthlyClimateTable");
  const rows = climate.months.map((m, idx) => {
    const loc = localSoilMonths[idx];
    const localMoist = loc ? `${loc.local_moisture_pct}% (${loc.local_available_mm} mm)` : `${Math.round(m.gwetroot * 100)}%`;
    const irrigTxt = loc ? `${loc.irrigation_mm} mm` : "0 mm";
    return `
    <tr>
      <td><strong>${m.label_es || m.label}</strong></td>
      <td>${m.t2m}°C</td>
      <td>${m.precip_mm} mm</td>
      <td>${loc ? loc.effective_rain_mm : m.precip_mm} mm</td>
      <td>${m.eto_mm} mm</td>
      <td>${irrigTxt}</td>
      <td style="color:#58d68d"><strong>${localMoist}</strong></td>
      <td>${Math.round(m.gwetroot * 100)}%</td>
    </tr>`;
  }).join("");
  table.innerHTML = `
    <thead><tr>
      <th>Mes</th><th>Temp. Media</th><th>Lluvia NASA</th><th>Lluvia Infiltrada en tu Suelo</th>
      <th>Demanda Agua (ETo)</th><th>Riego Estimado</th><th>Agua Útil en tu Suelo</th><th>Humedad Satelital Raíz</th>
    </tr></thead><tbody>${rows}</tbody>`;
}

/* ==================== RENDER ESCENARIOS FUTUROS ==================== */
function renderScenariosMatrix() {
  const matrix = state.scenariosMatrix;
  if (!matrix || !matrix.scenarios) return;
  const isEn = state.lang.toLowerCase().startsWith("en");

  $("scenarioCardsGrid").innerHTML = matrix.scenarios.map((s) => {
    const opt = s.optimal_strategy;
    const base = s.baseline;
    const deltaY = (opt.metrics.mean_yield_resilience_pct - base.metrics.mean_yield_resilience_pct).toFixed(1);
    return `
      <article class="scenario-card reveal-card">
        <h4>${isEn ? s.label_en : s.label_es}</h4>
        <p>${isEn ? s.desc_en : s.desc_es}</p>
        <div class="scen-stat-row"><span>Lluvia / Demanda</span><strong>${Math.round(s.climate_summary.total_precip_mm)} / ${Math.round(s.climate_summary.total_eto_mm)} mm</strong></div>
        <div class="scen-stat-row"><span>Tu Cultivo Actual</span><strong style="color:#e06c75">${base.metrics.mean_yield_resilience_pct}%</strong></div>
        <div class="scen-stat-row"><span>Con Rotación Óptima</span><strong style="color:#58d68d">${opt.metrics.mean_yield_resilience_pct}% (${deltaY >= 0 ? "+" : ""}${deltaY}%)</strong></div>
        <div class="scen-stat-row"><span>Materia Orgánica Final</span><strong style="color:#5ec7e6">${opt.metrics.som_end_pct}%</strong></div>
      </article>`;
  }).join("");

  $("scenariosTable").innerHTML = `
    <thead><tr>
      <th>Escenario Futuro</th><th>Cultivo Actual</th><th>Con Rotación</th>
      <th>MOS (Actual → Rotación)</th><th>Agua Ahorrada</th><th>Secuencia Recomendada</th>
    </tr></thead>
    <tbody>${matrix.scenarios.map((s) => {
      const opt = s.optimal_strategy;
      const base = s.baseline;
      const seq = opt.seasons.map((x) => (isEn ? x.crop_name_en : x.crop_name_es).split(" (")[0]).join(" → ");
      return `<tr>
        <td><strong>${isEn ? s.label_en : s.label_es}</strong></td>
        <td style="color:#e06c75">${base.metrics.mean_yield_resilience_pct}%</td>
        <td style="color:#58d68d"><strong>${opt.metrics.mean_yield_resilience_pct}%</strong></td>
        <td>${base.metrics.som_end_pct}% → <strong>${opt.metrics.som_end_pct}%</strong></td>
        <td>${opt.vs_baseline.water_saved_mm} mm</td>
        <td>${seq}</td>
      </tr>`;
    }).join("")}</tbody>`;

  animateChart("scenariosBarCanvas", (prog) => drawScenariosChart(matrix, prog));
}

function drawScenariosChart(matrix, progress = 1) {
  const canvas = $("scenariosBarCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#09120e"; ctx.fillRect(0, 0, w, h);

  const rows = matrix.scenarios || [];
  const padL = 44, padR = 20, padT = 34, padB = 44;
  const pw = w - padL - padR, ph = h - padT - padB;
  const grpW = pw / Math.max(1, rows.length);

  ctx.strokeStyle = "rgba(150,200,175,0.12)";
  for (let i = 0; i <= 4; i++) {
    const y = padT + (i / 4) * ph;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.fillStyle = "#93aba0"; ctx.font = "10px Inter, sans-serif"; ctx.textAlign = "right";
    ctx.fillText(`${100 - i * 25}%`, padL - 6, y + 3);
  }

  rows.forEach((s, i) => {
    const x0 = padL + i * grpW;
    const baseY = s.baseline.metrics.mean_yield_resilience_pct;
    const optY = s.optimal_strategy.metrics.mean_yield_resilience_pct;
    const bw = grpW * 0.28;

    const h1 = (baseY / 100) * ph * progress;
    ctx.fillStyle = "#e06c75";
    ctx.fillRect(x0 + grpW * 0.16, padT + ph - h1, bw, h1);
    if (progress > 0.85) {
      ctx.fillStyle = "#eef5f0"; ctx.font = "600 10px Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`${baseY}%`, x0 + grpW * 0.16 + bw / 2, padT + ph - h1 - 5);
    }

    const h2 = (optY / 100) * ph * progress;
    ctx.fillStyle = "#58d68d";
    ctx.fillRect(x0 + grpW * 0.52, padT + ph - h2, bw, h2);
    if (progress > 0.85) {
      ctx.fillText(`${optY}%`, x0 + grpW * 0.52 + bw / 2, padT + ph - h2 - 5);
    }

    const shortLabel = (s.label_es || "").split("(")[0].trim().slice(0, 17);
    ctx.fillStyle = "#93aba0"; ctx.font = "10px Inter, sans-serif"; ctx.textAlign = "center";
    ctx.fillText(shortLabel, x0 + grpW / 2, h - 14);
  });

  ctx.textAlign = "left"; ctx.font = "600 10.5px Inter, sans-serif";
  ctx.fillStyle = "#e06c75"; ctx.fillText("■ Cultivo Actual", padL, 18);
  ctx.fillStyle = "#58d68d"; ctx.fillText("■ Rotación Recomendada", padL + 135, 18);
}

/* ==================== RENDER ROTACIONES & MANDALA ==================== */
function renderRotationsView() {
  const opt = state.optimization;
  if (!opt || !opt.strategies) return;
  const isEn = state.lang.toLowerCase().startsWith("en");

  const container = $("strategyTabs");
  container.innerHTML = "";
  opt.strategies.forEach((strat, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `strategy-tab ${idx === state.selectedStrategyIdx ? "active" : ""}`;
    const seq = strat.seasons.map((s) => (isEn ? s.crop_name_en : s.crop_name_es).split(" (")[0]).join(" → ");
    btn.innerHTML = `
      <div>
        <div class="strategy-title">#${strat.rank} · ${strat.strategy_tag}</div>
        <div class="strategy-seq">${seq}</div>
      </div>
      <div class="strategy-score">${strat.composite_score}</div>`;
    btn.addEventListener("click", () => {
      state.selectedStrategyIdx = idx;
      renderRotationsView();
    });
    container.appendChild(btn);
  });

  renderSelectedStrategy();
}

function renderSelectedStrategy() {
  const opt = state.optimization;
  const strat = opt.strategies[state.selectedStrategyIdx];
  const base = opt.baseline;
  const d = strat.vs_baseline;
  const isEn = state.lang.toLowerCase().startsWith("en");

  const cards = [
    { label: t("vsBaselineSom"), val: `${d.som_gain_pct >= 0 ? "+" : ""}${d.som_gain_pct}% MOS`, pos: d.som_gain_pct >= 0 },
    { label: t("vsBaselineWater"), val: `${d.water_saved_mm >= 0 ? "+" : ""}${d.water_saved_mm} mm`, pos: d.water_saved_mm >= 0 },
    { label: t("vsBaselineYield"), val: `${d.yield_stability_gain_pct >= 0 ? "+" : ""}${d.yield_stability_gain_pct}%`, pos: d.yield_stability_gain_pct >= 0 },
    { label: t("vsBaselineN"), val: `${strat.metrics.biological_n_fixed_kg_ha} kg/ha`, pos: strat.metrics.biological_n_fixed_kg_ha > 0 },
  ];
  $("baselineDeltaGrid").innerHTML = cards
    .map((c) => `<div class="delta-card"><span>${c.label}</span><strong class="${c.pos ? "positive" : ""}">${c.val}</strong></div>`)
    .join("");

  animateChart("mandalaCanvas", (prog) => drawLivingMandala(opt.climate, strat, opt.soil, prog), 550);
  animateChart("soilTrajectoryCanvas", (prog) => drawSoilTrajectoryChart(strat, base, prog));
  animateChart("comparisonCanvas", (prog) => drawComparisonChart(strat, base, prog));

  $("seasonCardsGrid").innerHTML = strat.seasons.map((s) => `
    <article class="season-card" style="border-top-color:${s.color_hex}">
      <div class="season-top">
        <div>
          <div class="season-label">${s.season_label}</div>
          <h4 class="season-crop">${isEn ? s.crop_name_en : s.crop_name_es}</h4>
          <div class="season-sci">${s.scientific_name}</div>
        </div>
        <span class="family-pill">${s.family}</span>
      </div>
      <div class="season-metrics">
        <span>Estabilidad: <strong>${s.yield_resilience_pct}%</strong></span>
        <span>Agua Cubierta: <strong>${Math.round(s.water_stress_ks * 100)}%</strong></span>
        <span>Demanda / Lluvia: <strong>${Math.round(s.etc_mm)} / ${Math.round(s.effective_rain_mm)} mm</strong></span>
        <span>MOS Final: <strong>${s.som_end_pct}%</strong></span>
      </div>
    </article>`).join("");

  $("rotationPlanTable").innerHTML = `
    <thead><tr>
      <th>Ciclo</th><th>Cultivo</th><th>Familia Botánica</th><th>Prof. Raíz</th>
      <th>Demanda Agua</th><th>Lluvia Útil</th><th>Riego Auxiliar</th><th>Estabilidad Cosecha</th><th>Riesgo Plagas</th><th>MOS Final</th><th>Nitrógeno Final</th>
    </tr></thead>
    <tbody>${strat.seasons.map((s) => `
      <tr>
        <td><strong>${s.season_label}</strong></td>
        <td>${isEn ? s.crop_name_en : s.crop_name_es}</td>
        <td>${s.family}</td>
        <td>${s.root_depth_m} m</td>
        <td>${s.etc_mm} mm</td>
        <td>${s.effective_rain_mm} mm</td>
        <td>${s.irrigation_mm} mm</td>
        <td style="color:#58d68d"><strong>${s.yield_resilience_pct}%</strong></td>
        <td>${s.pest_risk_pct}%</td>
        <td><strong>${s.som_end_pct}%</strong></td>
        <td>${s.n_balance_end_kg_ha} kg/ha</td>
      </tr>`).join("")}</tbody>`;
}

function drawSoilTrajectoryChart(strat, base, progress = 1) {
  const canvas = $("soilTrajectoryCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#09120e"; ctx.fillRect(0, 0, w, h);

  const s1 = strat.seasons, s0 = base.seasons;
  const padL = 44, padR = 40, padT = 28, padB = 26;
  const pw = w - padL - padR, ph = h - padT - padB;
  const somVals = [...s1.map((x) => x.som_end_pct), ...s0.map((x) => x.som_end_pct)];
  const minS = Math.min(...somVals) - 0.15, maxS = Math.max(...somVals) + 0.15;
  const maxIdx = Math.max(1, Math.floor((s1.length - 1) * progress));

  const drawLine = (arr, getter, color, minV, maxV, dash = []) => {
    ctx.beginPath(); ctx.setLineDash(dash);
    for (let i = 0; i <= maxIdx; i++) {
      const x = padL + (i / Math.max(1, arr.length - 1)) * pw;
      const y = padT + ph - ((getter(arr[i]) - minV) / Math.max(0.05, maxV - minV)) * ph;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color; ctx.lineWidth = 2.4; ctx.stroke(); ctx.setLineDash([]);
  };

  drawLine(s1, (x) => x.som_end_pct, "#58d68d", minS, maxS);
  drawLine(s0, (x) => x.som_end_pct, "#e06c75", minS, maxS, [4, 4]);
  drawLine(s1, (x) => x.n_balance_end_kg_ha, "#5ec7e6", 0, 150);

  s1.forEach((x, i) => {
    ctx.fillStyle = "#93aba0"; ctx.font = "10px Inter, sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`Ciclo ${x.season_index}`, padL + (i / Math.max(1, s1.length - 1)) * pw, h - 7);
  });

  ctx.textAlign = "left"; ctx.font = "600 10.5px Inter, sans-serif";
  ctx.fillStyle = "#58d68d"; ctx.fillText("— Materia Orgánica Rotación", padL, 16);
  ctx.fillStyle = "#e06c75"; ctx.fillText("-- Actual", padL + 190, 16);
  ctx.fillStyle = "#5ec7e6"; ctx.fillText("— Nitrógeno", padL + 265, 16);
}

function drawComparisonChart(strategy, baseline, progress = 1) {
  const canvas = $("comparisonCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#09120e"; ctx.fillRect(0, 0, w, h);

  const rows = [
    { label: "Salud del Suelo", opt: strategy.metrics.soil_health_score, base: baseline.metrics.soil_health_score },
    { label: "Ahorro de Agua", opt: strategy.metrics.water_conservation_score, base: baseline.metrics.water_conservation_score },
    { label: "Resistencia Clima", opt: strategy.metrics.climate_resilience_score, base: baseline.metrics.climate_resilience_score },
    { label: "Estabilidad Cosecha", opt: strategy.metrics.mean_yield_resilience_pct, base: baseline.metrics.mean_yield_resilience_pct },
  ];
  const leftPad = 124, barW = w - leftPad - 40;
  ctx.font = "600 10.5px Inter, sans-serif";
  ctx.fillStyle = "#58d68d"; ctx.fillText("■ Rotación Óptima", 14, 18);
  ctx.fillStyle = "#e06c75"; ctx.fillText("■ Siembra Actual", 150, 18);

  rows.forEach((row, idx) => {
    const y = 34 + idx * 39;
    ctx.fillStyle = "#eef5f0"; ctx.font = "500 10.8px Inter, sans-serif"; ctx.textAlign = "left";
    ctx.fillText(row.label, 14, y + 14);
    const wOpt = Math.max(4, (Math.min(100, row.opt) / 100) * barW * progress);
    ctx.fillStyle = "#58d68d"; ctx.fillRect(leftPad, y + 2, wOpt, 10);
    ctx.fillStyle = "#eef5f0"; ctx.font = "600 10px Inter, sans-serif"; ctx.fillText(`${row.opt}`, leftPad + wOpt + 5, y + 10);

    const wBase = Math.max(4, (Math.min(100, row.base) / 100) * barW * progress);
    ctx.fillStyle = "rgba(224,108,117,0.75)"; ctx.fillRect(leftPad, y + 15, wBase, 8);
    ctx.fillStyle = "#93aba0"; ctx.fillText(`${row.base}`, leftPad + wBase + 5, y + 22);
  });
}

function drawLivingMandala(climate, strategy, soil, progress = 1) {
  const canvas = $("mandalaCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height, cx = w / 2, cy = h / 2;
  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createRadialGradient(cx, cy, 16, cx, cy, 235);
  bg.addColorStop(0, "#152d24"); bg.addColorStop(0.6, "#0b1712"); bg.addColorStop(1, "#070e0b");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

  [214, 180, 144, 106, 52].forEach((r, idx) => {
    ctx.beginPath(); ctx.arc(cx, cy, r * Math.min(1, 0.3 + 0.7 * progress), 0, Math.PI * 2);
    ctx.strokeStyle = idx === 0 ? "rgba(94,199,230,0.26)" : "rgba(150,210,175,0.13)";
    ctx.lineWidth = 1;
    if (idx % 2 === 1) ctx.setLineDash([4, 4]); else ctx.setLineDash([]);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  const months = climate.months;
  const maxPrec = Math.max(40, ...months.map((m) => m.precip_mm));
  months.forEach((m, i) => {
    const a0 = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
    const aMid = 0.5 * (a0 + a1);
    const sunNorm = Math.min(1, m.sw_dwn_mj_m2_day / 30);

    ctx.beginPath(); ctx.arc(cx, cy, 204, a0 + 0.03, a1 - 0.03);
    ctx.strokeStyle = `rgba(244, 178, 66, ${(0.25 + sunNorm * 0.65) * progress})`;
    ctx.lineWidth = 4 + sunNorm * 4.5; ctx.stroke();

    const rainLen = (8 + (m.precip_mm / maxPrec) * 24) * progress;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(aMid) * 196, cy + Math.sin(aMid) * 196);
    ctx.lineTo(cx + Math.cos(aMid) * (196 - rainLen), cy + Math.sin(aMid) * (196 - rainLen));
    ctx.strokeStyle = "#5ec7e6"; ctx.lineWidth = 2.8; ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + Math.cos(aMid) * 162, cy + Math.sin(aMid) * 162, (2.5 + m.gwetroot * 4.2) * progress, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(94,199,230,${0.35 + m.gwetroot * 0.5})`; ctx.fill();

    ctx.fillStyle = "rgba(225,240,230,0.78)"; ctx.font = "600 9px Inter, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(m.label_es || m.label, cx + Math.cos(aMid) * 224, cy + Math.sin(aMid) * 224);
  });

  const seasons = strategy.seasons;
  const isEn = state.lang.toLowerCase().startsWith("en");
  seasons.forEach((s, idx) => {
    const a0 = (idx / seasons.length) * Math.PI * 2 - Math.PI / 2 + 0.03;
    const a1 = ((idx + 1) / seasons.length) * Math.PI * 2 - Math.PI / 2 - 0.03;
    const aMid = 0.5 * (a0 + a1);
    const arcSpan = (a1 - a0) * progress;

    ctx.beginPath(); ctx.arc(cx, cy, 126, a0, a0 + arcSpan);
    ctx.strokeStyle = s.color_hex; ctx.lineWidth = 19; ctx.stroke();

    const rootReach = (32 + (s.root_depth_m / 1.6) * 38) * progress;
    const filaments = s.root_morphology === "taproot" ? 3 : 6;
    for (let f = 0; f < filaments; f++) {
      const ang = a0 + ((f + 1) / (filaments + 1)) * (a1 - a0);
      const rStart = 115, rEnd = rStart - rootReach;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * rStart, cy + Math.sin(ang) * rStart);
      ctx.quadraticCurveTo(
        cx + Math.cos(ang + (f % 2 === 0 ? 0.09 : -0.09)) * (0.5 * (rStart + rEnd)),
        cy + Math.sin(ang + (f % 2 === 0 ? 0.09 : -0.09)) * (0.5 * (rStart + rEnd)),
        cx + Math.cos(ang) * rEnd,
        cy + Math.sin(ang) * rEnd
      );
      ctx.strokeStyle = s.color_hex + "BB";
      ctx.lineWidth = s.root_morphology === "taproot" ? 2.1 : 1.2; ctx.stroke();

      if (s.root_morphology === "nodulated" && progress > 0.6) {
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ang) * (rEnd + 8), cy + Math.sin(ang) * (rEnd + 8), 2.8, 0, Math.PI * 2);
        ctx.fillStyle = "#58d68d"; ctx.fill();
      }
    }

    if (progress > 0.7) {
      const shortName = (isEn ? s.crop_name_en : s.crop_name_es).split(" ")[0];
      ctx.fillStyle = "#08120e"; ctx.font = "700 9.5px Inter, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`C${s.season_index} ${shortName}`, cx + Math.cos(aMid) * 126, cy + Math.sin(aMid) * 126);
    }
  });

  const coreGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 50);
  coreGrad.addColorStop(0, "#3b291d"); coreGrad.addColorStop(1, "#111e19");
  ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI * 2);
  ctx.fillStyle = coreGrad; ctx.fill();
  ctx.strokeStyle = "#58d68d"; ctx.lineWidth = 1.8; ctx.stroke();

  ctx.fillStyle = "#eef5f0"; ctx.font = "700 18px Inter, sans-serif"; ctx.textAlign = "center";
  ctx.fillText(`${strategy.composite_score}`, cx, cy - 9);
  ctx.fillStyle = "#58d68d"; ctx.font = "600 9.5px Inter, sans-serif";
  ctx.fillText(`MOS ${strategy.metrics.som_end_pct}%`, cx, cy + 7);
  ctx.fillStyle = "#93aba0"; ctx.font = "500 8.5px Inter, sans-serif";
  ctx.fillText(`AWC ${soil.effective_awc_mm_m} mm/m`, cx, cy + 20);

  $("mandalaLegend").innerHTML = `
    <span class="legend-chip"><span class="legend-dot" style="background:#f4b242"></span>Radiación Solar NASA</span>
    <span class="legend-chip"><span class="legend-dot" style="background:#5ec7e6"></span>Lluvia y Humedad</span>
    <span class="legend-chip"><span class="legend-dot" style="background:#58d68d"></span>Fijación de Nitrógeno</span>`;
}

/* ==================== PRESETS & EVENTOS ==================== */
function selectPresetById(id) {
  if (!state.bootstrap) return;
  const preset = state.bootstrap.presets.find((p) => p.id === id);
  if (!preset) return;

  $("presetSelect").value = id;
  $("homePresetSelect").value = id;
  $("latInput").value = preset.latitude.toFixed(2);
  $("lonInput").value = preset.longitude.toFixed(2);

  const s = preset.default_soil;
  $("textureSelect").value = s.texture;
  $("somInput").value = s.som_pct; $("somVal").textContent = s.som_pct;
  $("phInput").value = s.ph; $("phVal").textContent = s.ph;
  $("nInput").value = s.initial_n_kg_ha;
  $("slopeInput").value = s.slope_pct;
  $("irrigSelect").value = s.irrigation_mode;

  updateMapMarker(preset.latitude, preset.longitude);
  $("heroLocationChip").textContent = `${preset.name_es} · ${preset.latitude.toFixed(2)}°, ${preset.longitude.toFixed(2)}°`;
}

function wireEvents() {
  document.querySelectorAll("[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
  });
  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => showView(btn.dataset.goto));
  });
  $("brandHomeBtn").addEventListener("click", () => showView("home"));
  $("startExploreBtn").addEventListener("click", () => showView("nasa"));

  $("langSelect").addEventListener("change", (ev) => {
    const val = ev.target.value;
    const isCustom = val === "custom";
    $("customLangInput").classList.toggle("hidden", !isCustom);
    $("applyCustomLangBtn").classList.toggle("hidden", !isCustom);
    if (!isCustom) setLanguage(val);
  });
  $("applyCustomLangBtn").addEventListener("click", () => {
    const custom = $("customLangInput").value.trim();
    if (custom) setLanguage(custom);
  });

  $("presetSelect").addEventListener("change", (e) => selectPresetById(e.target.value));
  $("homePresetSelect").addEventListener("change", (e) => selectPresetById(e.target.value));
  $("homeCurrentCrop").addEventListener("change", (e) => { $("currentCropSelect").value = e.target.value; });
  $("currentCropSelect").addEventListener("change", (e) => { $("homeCurrentCrop").value = e.target.value; });

  $("fallbackMapCanvas").addEventListener("click", (e) => {
    const rect = e.target.getBoundingClientRect();
    const lon = ((e.clientX - rect.left) / rect.width) * 360 - 180;
    const lat = 90 - ((e.clientY - rect.top) / rect.height) * 180;
    $("latInput").value = Math.max(-65, Math.min(65, lat)).toFixed(2);
    $("lonInput").value = lon.toFixed(2);
    updateMapMarker(lat, lon);
  });

  $("runDavQueryBtn").addEventListener("click", () => {
    const lat = parseFloat($("latInput").value) || 20.6;
    const lon = parseFloat($("lonInput").value) || -101.2;
    updateMapMarker(lat, lon);
    runDavQuery();
  });

  $("downloadDavCsvBtn").addEventListener("click", async () => {
    const resp = await fetch("/api/nasa-viewer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: parseFloat($("latInput").value) || 20.6,
        longitude: parseFloat($("lonInput").value) || -101.2,
        community: $("davCommunity").value,
        temporal: $("davTemporal").value,
        parameters: getSelectedDavParams(),
        start: $("davStart").value.trim() || "2023",
        end: $("davEnd").value.trim() || "2025",
        format: "CSV",
      }),
    });
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "nasa_power_viewer_data.csv"; a.click();
    URL.revokeObjectURL(url);
  });

  $("somInput").addEventListener("input", () => ($("somVal").textContent = $("somInput").value));
  $("phInput").addEventListener("input", () => ($("phVal").textContent = $("phInput").value));
  [["prioSoil", "prioSoilVal"], ["prioWater", "prioWaterVal"], ["prioClimate", "prioClimateVal"], ["prioProfit", "prioProfitVal"]].forEach(
    ([i, l]) => $(i).addEventListener("input", () => ($(l).textContent = $(i).value))
  );

  $("recalcDiagBtn").addEventListener("click", runDiagnosisWithUserSoil);
  $("runScenariosBtn").addEventListener("click", runAllScenarios);
  $("optimizeBtn").addEventListener("click", runOptimizationRotations);
  $("scenarioSelect").addEventListener("change", () => {
    if (state.rotRevealed) runOptimizationRotations();
  });

  $("exportPngBtn").addEventListener("click", () => {
    const a = document.createElement("a");
    a.download = "orbital_farm_mandala.png";
    a.href = $("mandalaCanvas").toDataURL("image/png");
    a.click();
  });
  $("exportCsvBtn").addEventListener("click", async () => {
    if (!state.optimization) return;
    const strat = state.optimization.strategies[state.selectedStrategyIdx];
    const resp = await fetch("/api/export-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strategy: strat }),
    });
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "orbital_farm_rotation_plan.csv"; a.click();
    URL.revokeObjectURL(url);
  });
}

async function init() {
  const resp = await fetch("/api/bootstrap");
  state.bootstrap = await resp.json();
  populatePresetSelects();
  populateTextureSelect();
  populateCurrentCropSelect();
  wireEvents();
  startHeroAnimation();
  initInteractiveMap();
  selectPresetById("bajio_mx");
}

init();
