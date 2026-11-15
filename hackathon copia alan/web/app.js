/* Orbital Farm · Interfaz Sencilla y Visual para el Agricultor (Paleta Azul Claro y Blanco) */

const PARAM_LABELS = {
  T2M: { es: "Temperatura (°C)", en: "Temperature (°C)", isPct: false },
  PRECTOTCORR: { es: "Lluvia (mm/día)", en: "Rain (mm/day)", isPct: false },
  GWETROOT: { es: "Humedad en raíces (%)", en: "Root Moisture (%)", isPct: true },
};

const BASE_ES = {
  appSubtitle: "Guía fácil con datos de la NASA para tu tierra",
  navHome: "🏠 Inicio",
  navNasa: "1. Mi Terreno",
  navDiag: "2. Agua y Tierra",
  navScen: "3. Si Hay Sequía",
  navRot: "4. Qué Sembrar",
  statusReady: "Listo para usar",
  langOtherOption: "Otro idioma...",
  translateBtn: "Traducir",
  heroKicker: "AYUDA PRÁCTICA PARA EL CAMPO · DATOS NASA",
  heroTitle: "Cuida tu tierra, ahorra agua y asegura tu cosecha",
  heroDesc: "Elige dónde está tu terreno y qué siembras hoy. En pocos clics verás cómo viene el clima y qué cultivos conviene alternar los próximos 3 años.",
  presetLabel: "¿Dónde está tu terreno?",
  currentCropLabel: "¿Qué siembras hoy?",
  heroCtaMain: "1. Revisar el clima de mi terreno →",
  heroCtaPlan: "Ir directo a qué me conviene sembrar",
  portalNasaTitle: "Ubica tu Terreno",
  portalNasaDesc: "Marca tu zona en el mapa y mira cuánta lluvia y calor hubo en los últimos años.",
  portalDiagTitle: "Agua y Tierra",
  portalDiagDesc: "Cuéntanos cómo es tu suelo para saber cuánta agua guarda y en qué meses falta lluvia.",
  portalScenTitle: "Si Hay Sequía o Calor",
  portalScenDesc: "Mira qué pasa con tu cosecha si el año viene muy seco, caluroso o con lluvias fuertes.",
  portalRotTitle: "Qué Sembrar",
  portalRotDesc: "Recibe un plan fácil de 3 años con dibujos claros de raíces y qué plantar cada temporada.",
  portalOpen: "Entrar →",
  nasaViewTitle: "1. Marca tu Terreno y Mira el Clima",
  nasaViewDesc: "Elige una región o haz clic en el mapa sobre tu terreno y presiona el botón azul.",
  downloadNasaCsvBtn: "Descargar tabla (CSV)",
  mapTitle: "Mapa de tu Parcela",
  layerSat: "Vista Satélite",
  layerTopo: "Relieve",
  layerOsm: "Caminos y Calles",
  corridorLabel: "Región cercana",
  advCoordsToggle: "Ingresar coordenadas exactas (opcional)",
  latLabel: "Latitud (°)",
  lonLabel: "Longitud (°)",
  davConsoleTitle: "¿Qué revisamos desde el satélite?",
  queryNasaBtn: "🔍 Ver clima de mi terreno",
  nasaEmptyText: "Presiona \"Ver clima de mi terreno\" para ver en 3 segundos la temperatura, lluvia y humedad de tu zona.",
  davChartTitle: "Lluvia y Temperatura de los últimos meses",
  goToDiagnostics: "Siguiente: Revisar mi Tierra y Agua →",
  diagTitle: "2. Cuéntanos cómo es tu Tierra y Riego",
  soilConfigTitle: "Datos sencillos de tu parcela",
  textureLabel: "¿Cómo es tu tierra?",
  irrigLabel: "¿Cómo riegas?",
  irrigRainfed: "Solo lluvia (temporal)",
  irrigDeficit: "Riego de apoyo / limitado",
  irrigFull: "Riego completo",
  somLabel: "Fertilidad / Tierra oscura",
  phLabel: "Acidez de la tierra (pH)",
  nLabel: "Nitrógeno inicial (kg/ha)",
  slopeLabel: "Inclinación / pendiente (%)",
  recalcSoilBtn: "💧 Revisar agua y salud de mi tierra",
  diagEmptyText: "Presiona \"Revisar agua y salud de mi tierra\" para ver en 3 segundos si la lluvia alcanza para tu cultivo.",
  climateChartTitle: "Meses con lluvia vs. meses secos",
  monthlyTableTitle: "Resumen mes por mes (fácil de leer)",
  goToScenarios: "Siguiente: Ver qué pasa si hay sequía →",
  scenViewTitle: "3. ¿Qué pasa con tu cosecha si cambia el clima?",
  scenViewDesc: "Compara tu cultivo actual contra una rotación inteligente en 4 situaciones posibles del clima.",
  calcScenariosBtn: "☀️ Calcular qué pasa en cada clima",
  scenEmptyText: "Presiona \"Calcular qué pasa en cada clima\" para comparar qué tanto se protege tu cosecha.",
  scenChartTitle: "¿Cuánta cosecha logras en cada clima? (Si sigues igual vs. Cambiando cultivos)",
  goToRotations: "Siguiente: Ver qué me conviene sembrar →",
  rotViewTitle: "4. Tu Plan Recomendado para los Próximos 3 Años",
  rotViewDesc: "Elige qué te importa más cuidar y mira los cultivos que mejor funcionan juntos en tu terreno.",
  exportPngBtn: "Guardar dibujo (PNG)",
  exportCsvBtn: "Descargar plan (CSV)",
  prioritiesHead: "¿Qué te importa más?",
  scenarioLabel: "Clima para tu plan",
  scenBaseline: "Clima normal actual",
  scenWarmDry: "Año caluroso y seco",
  scenExtreme: "Sequía fuerte",
  scenWet: "Lluvias muy fuertes",
  optimizeBtn: "🌾 Ver qué me conviene sembrar",
  stratTitle: "Elige una de estas 3 opciones",
  rotEmptyText: "Presiona \"Ver qué me conviene sembrar\" para ver en dibujos claros el plan de 3 años para tu tierra.",
  mandalaTitle: "Rueda de Siembra (3 Años)",
  mandalaDesc: "Cada parte del círculo es una temporada de siembra.",
  soilTrajectoryTitle: "¿Mejora tu tierra con el tiempo?",
  timelineTitle: "Qué plantar temporada por temporada (3 años)",
  customOption: "Ubicación marcada en el mapa",
};

const BASE_EN = {
  appSubtitle: "Easy NASA satellite guide for your farmland",
  navHome: "🏠 Home",
  navNasa: "1. My Field",
  navDiag: "2. Water & Soil",
  navScen: "3. Drought Risk",
  navRot: "4. What to Plant",
  statusReady: "Ready to use",
  langOtherOption: "Other language...",
  translateBtn: "Translate",
  heroKicker: "PRACTICAL FIELD GUIDE · NASA DATA",
  heroTitle: "Protect your soil, save water, and secure your harvest",
  heroDesc: "Pick your location and current crop. In a few clicks you will see your local weather and the best 3-year planting plan.",
  presetLabel: "Where is your field?",
  currentCropLabel: "What do you grow today?",
  heroCtaMain: "1. Check my field weather →",
  heroCtaPlan: "Go straight to planting plan",
  portalNasaTitle: "Locate Your Field",
  portalNasaDesc: "Mark your area on the map and view recent rain and temperature.",
  portalDiagTitle: "Water & Soil",
  portalDiagDesc: "Describe your soil to see how much water it holds and which months are dry.",
  portalScenTitle: "Drought & Heat Risk",
  portalScenDesc: "See how your harvest fares in dry, hot, or heavy-rain years.",
  portalRotTitle: "What to Plant",
  portalRotDesc: "Get a simple 3-year plan with clear root drawings and seasonal cards.",
  portalOpen: "Open →",
  nasaViewTitle: "1. Mark Your Field & Check Weather",
  nasaViewDesc: "Pick a region or click your field on the map, then press the blue button.",
  downloadNasaCsvBtn: "Download table (CSV)",
  mapTitle: "Field Map",
  layerSat: "Satellite",
  layerTopo: "Terrain",
  layerOsm: "Roads",
  corridorLabel: "Nearby region",
  advCoordsToggle: "Enter exact coordinates (optional)",
  latLabel: "Latitude (°)",
  lonLabel: "Longitude (°)",
  davConsoleTitle: "What does the satellite check?",
  queryNasaBtn: "🔍 Check my field weather",
  nasaEmptyText: "Press \"Check my field weather\" to see temperature, rain, and soil moisture in 3 seconds.",
  davChartTitle: "Recent Rain & Temperature",
  goToDiagnostics: "Next: Check Soil & Water →",
  diagTitle: "2. Tell Us About Your Soil & Water",
  soilConfigTitle: "Simple details of your land",
  textureLabel: "What is your soil like?",
  irrigLabel: "How do you water?",
  irrigRainfed: "Rain only",
  irrigDeficit: "Limited / supplemental watering",
  irrigFull: "Full irrigation",
  somLabel: "Soil fertility / dark matter",
  phLabel: "Soil acidity (pH)",
  nLabel: "Initial nitrogen (kg/ha)",
  slopeLabel: "Field slope (%)",
  recalcSoilBtn: "💧 Check soil water & health",
  diagEmptyText: "Press \"Check soil water & health\" to see in 3 seconds if rainfall is enough for your crop.",
  climateChartTitle: "Rainy Months vs. Dry Months",
  monthlyTableTitle: "Month-by-Month Summary (Easy to Read)",
  goToScenarios: "Next: Check Drought Risk →",
  scenViewTitle: "3. What Happens If the Weather Changes?",
  scenViewDesc: "Compare keeping your current crop vs. rotating crops across 4 weather situations.",
  calcScenariosBtn: "☀️ Check harvest in each weather",
  scenEmptyText: "Press \"Check harvest in each weather\" to compare harvest protection.",
  scenChartTitle: "Expected Harvest in Each Weather (Same Crop vs. Rotation)",
  goToRotations: "Next: See What to Plant →",
  rotViewTitle: "4. Your Recommended 3-Year Plan",
  rotViewDesc: "Choose what matters most to you and see the best crops to plant together.",
  exportPngBtn: "Save drawing (PNG)",
  exportCsvBtn: "Download plan (CSV)",
  prioritiesHead: "What matters most to you?",
  scenarioLabel: "Weather to plan for",
  scenBaseline: "Normal current weather",
  scenWarmDry: "Hot & dry year",
  scenExtreme: "Severe drought",
  scenWet: "Very heavy rain",
  optimizeBtn: "🌾 Show best crops to plant",
  stratTitle: "Pick one of these 3 plans",
  rotEmptyText: "Press \"Show best crops to plant\" to reveal clear visuals and your 3-year planting guide.",
  mandalaTitle: "3-Year Planting Wheel",
  mandalaDesc: "Each slice shows one planting season.",
  soilTrajectoryTitle: "Does Your Soil Improve Over Time?",
  timelineTitle: "Season-by-Season Planting Guide (3 Years)",
  customOption: "Point marked on map",
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
  nasaRevealed: false,
  diagRevealed: false,
  scenRevealed: false,
  rotRevealed: false,
};

const $ = (id) => document.getElementById(id);
const t = (k) => state.dict[k] || BASE_ES[k] || k;
const isEn = () => state.lang.toLowerCase().startsWith("en");

const STRATEGY_TAGS_ES = {
  "Regenerative Cover & Soil-Builder": "Cuidado máximo del suelo",
  "Drought-Shield Resilient Mix": "Resistente a sequía y calor",
  "Multi-Family Bio-Diverse Rotation": "Mezcla variada (menos plagas)",
  "Nitrogen-Cycling Balanced Rotation": "Abono natural y equilibrio",
  "Adaptive Diversified Strategy": "Plan variado equilibrado",
};

function friendlyStrategyTag(tag) {
  if (isEn()) return tag;
  return STRATEGY_TAGS_ES[tag] || tag;
}

function friendlySeasonLabel(label) {
  if (isEn() || !label) return label || "";
  return label
    .replace("Warm Season", "Temporada cálida")
    .replace("Cool Season", "Temporada fresca")
    .replace("Season A", "Temporada A")
    .replace("Season B", "Temporada B");
}

function formatMonthCode(k) {
  const monthsEs = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  if (k && k.length === 6) {
    const yr = k.slice(2, 4);
    const mIdx = parseInt(k.slice(4, 6), 10) - 1;
    return `${monthsEs[mIdx] || k.slice(4)} '${yr}`;
  }
  return k;
}

/* ==================== ANIMADOR SUAVE DE GRÁFICAS ==================== */
function animateChart(canvasId, drawFrameFn, durationMs = 420) {
  const start = performance.now();
  function step(now) {
    const raw = Math.min(1, (now - start) / durationMs);
    const eased = 1 - Math.pow(1 - raw, 3);
    drawFrameFn(eased);
    if (raw < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ==================== NAVEGACIÓN INTUITIVA ==================== */
function showView(viewName) {
  document.querySelectorAll(".view").forEach((el) => el.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });
  const target = $(`view-${viewName}`);
  if (target) target.classList.add("active");

  if (viewName === "nasa") {
    if (state.leafletMap) setTimeout(() => state.leafletMap.invalidateSize(), 120);
    if (!state.nasaRevealed) runDavQuery();
  }
  if (viewName === "diagnostics") {
    if (!state.diagRevealed) runDiagnosisWithUserSoil();
    else if (state.climate) renderClimateViews();
  }
  if (viewName === "scenarios") {
    if (!state.scenRevealed) runAllScenarios();
    else if (state.scenariosMatrix) renderScenariosMatrix();
  }
  if (viewName === "rotations") {
    if (!state.rotRevealed) runOptimizationRotations();
    else if (state.optimization) renderRotationsView();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==================== TRADUCTOR ==================== */
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
  [$("presetSelect"), $("homePresetSelect")].forEach((sel) => {
    if (!sel) return;
    const prev = sel.value || "bajio_mx";
    sel.innerHTML = "";
    state.bootstrap.presets.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = isEn() ? p.name_en : p.name_es;
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
  sel.innerHTML = "";
  state.bootstrap.soil_textures.forEach((tx) => {
    const opt = document.createElement("option");
    opt.value = tx.code;
    opt.textContent = isEn() ? tx.label_en : tx.label_es;
    sel.appendChild(opt);
  });
  sel.value = prev;
}

function populateCurrentCropSelect() {
  if (!state.bootstrap) return;
  [$("homeCurrentCrop"), $("currentCropSelect")].forEach((sel) => {
    if (!sel) return;
    const prev = sel.value || "maize";
    sel.innerHTML = "";
    state.bootstrap.crops
      .filter((c) => c.group !== "cover")
      .forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = isEn() ? c.name_en : c.name_es;
        sel.appendChild(opt);
      });
    sel.value = prev;
  });
}

function updateSoilBadges() {
  const som = parseFloat($("somInput").value) || 1.8;
  $("somVal").textContent = som.toFixed(1);
  $("somBadge").textContent = som < 1.5 ? "Pobre" : som < 2.8 ? "Media" : "Muy fértil";

  const ph = parseFloat($("phInput").value) || 7.0;
  $("phVal").textContent = ph.toFixed(1);
  $("phBadge").textContent = ph < 6.0 ? "Ácida" : ph <= 7.5 ? "Normal" : "Salitrosa";
}

/* ==================== ILUSTRACIÓN ANIMADA DE PORTADA (AZUL CLARO Y BLANCO) ==================== */
function startHeroAnimation() {
  const canvas = $("heroOrbitCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function frame() {
    state.heroAngle += 0.014;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Cielo azul claro a blanco
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#cfe8ff");
    sky.addColorStop(0.65, "#f0f7ff");
    sky.addColorStop(1, "#ffffff");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Sol amigable
    const sunPulse = 25 + Math.sin(state.heroAngle) * 1.8;
    ctx.beginPath();
    ctx.arc(62, 56, sunPulse + 9, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(251, 191, 36, 0.25)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(62, 56, sunPulse, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24";
    ctx.fill();

    // Nube y gotitas de lluvia suaves
    const cloudX = 285 + Math.sin(state.heroAngle * 0.6) * 8;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cloudX, 62, 22, 0, Math.PI * 2);
    ctx.arc(cloudX + 24, 56, 26, 0, Math.PI * 2);
    ctx.arc(cloudX + 48, 64, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    for (let i = 0; i < 4; i++) {
      const dropY = 92 + ((state.heroAngle * 22 + i * 18) % 52);
      ctx.beginPath();
      ctx.ellipse(cloudX + 4 + i * 14, dropY, 2.5, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Satélite NASA amigable arriba en el centro
    const satX = 185 + Math.cos(state.heroAngle * 0.7) * 28;
    const satY = 44 + Math.sin(state.heroAngle * 0.7) * 5;
    ctx.strokeStyle = "rgba(29, 111, 214, 0.25)";
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(satX, satY + 10);
    ctx.lineTo(195, 195);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#1d6fd6";
    ctx.fillRect(satX - 10, satY - 6, 20, 12);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(satX - 24, satY - 4, 12, 8);
    ctx.fillRect(satX + 12, satY - 4, 12, 8);

    // Tierra fértil y plantas sanas
    ctx.fillStyle = "#8b5a3c";
    ctx.beginPath();
    ctx.ellipse(195, 255, 165, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#dcfce7";
    ctx.beginPath();
    ctx.ellipse(195, 225, 155, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3 plantitas creciendo
    [125, 195, 265].forEach((px, idx) => {
      const sway = Math.sin(state.heroAngle + idx) * 2;
      const py = 222;
      ctx.strokeStyle = "#15803d";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.quadraticCurveTo(px + sway, py - 24, px + sway * 1.4, py - 46);
      ctx.stroke();

      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.ellipse(px - 11 + sway, py - 28, 12, 6, -0.45, 0, Math.PI * 2);
      ctx.ellipse(px + 11 + sway, py - 35, 12, 6, 0.45, 0, Math.PI * 2);
      ctx.fill();
    });

    // Etiquetas claras para el agricultor
    ctx.fillStyle = "#0f2942";
    ctx.font = "700 12px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("☀️ Sol y Calor", 66, 108);
    ctx.fillText("🛰️ Datos NASA", satX, 24);
    ctx.fillText("🌧️ Lluvia", cloudX + 24, 162);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("🌱 Tierra sana y buena cosecha", 195, 265);

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
            radius: 7, color: "#ffffff", weight: 2, fillColor: "#1d6fd6", fillOpacity: 0.95,
          }).addTo(map);
          m.bindTooltip(p.name_es);
          m.on("click", () => {
            selectPresetById(p.id);
            runDavQuery();
          });
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
  const coordsTxt = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
  $("heroLocationChip").textContent = `Ubicación elegida: ${coordsTxt}`;
  $("diagCoordPill").textContent = `Punto: ${coordsTxt}`;
  if ($("mapCoordBadge")) $("mapCoordBadge").textContent = `Punto: ${coordsTxt}`;
}

function drawFallbackMap() {
  const canvas = $("fallbackMapCanvas");
  if (!canvas || canvas.classList.contains("hidden")) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = "#e0f2fe";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#bfdbfe";
  for (let x = 0; x <= w; x += w / 6) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y <= h; y += h / 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  const lat = parseFloat($("latInput").value) || 0;
  const lon = parseFloat($("lonInput").value) || 0;
  const tx = ((lon + 180) / 360) * w, ty = ((90 - lat) / 180) * h;
  ctx.fillStyle = "#1d6fd6";
  ctx.beginPath(); ctx.arc(tx, ty, 9, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3; ctx.stroke();
}

/* ==================== CONEXIÓN HÍBRIDA (SERVIDOR PYTHON O GITHUB PAGES ESTÁTICO) ==================== */
let useStaticEngine = window.location.protocol === "file:";

async function apiRequest(endpoint, payload = null, method = "POST") {
  if (!useStaticEngine) {
    try {
      const opts = { method };
      if (payload !== null && method !== "GET") {
        opts.headers = { "Content-Type": "application/json" };
        opts.body = JSON.stringify(payload);
      }
      const resp = await fetch(endpoint, opts);
      if (resp.ok) return await resp.json();
    } catch {
      // Sin servidor Python -> activar modo estático para GitHub Pages
    }
    useStaticEngine = true;
  }

  const eng = window.OrbitalStaticEngine;
  if (!eng) throw new Error("Static engine unavailable");
  if (endpoint === "/api/bootstrap") return eng.bootstrap();
  if (endpoint === "/api/climate") return await eng.climate(payload || {});
  if (endpoint === "/api/nasa-viewer") return await eng.nasaViewer(payload || {});
  if (endpoint === "/api/optimize") return eng.optimize(payload || {});
  if (endpoint === "/api/scenarios-matrix") return eng.scenariosMatrix(payload || {});
  throw new Error(`Unsupported endpoint in static mode: ${endpoint}`);
}

/* ==================== PASO 1: CONSULTA CLIMA NASA ==================== */
async function runDavQuery() {
  const lat = parseFloat($("latInput").value) || 20.6;
  const lon = parseFloat($("lonInput").value) || -101.2;

  updateNasaStatus("Consultando clima...", "loading");
  state.davResult = await apiRequest("/api/nasa-viewer", {
    latitude: lat,
    longitude: lon,
    community: "AG",
    temporal: "monthly",
    parameters: ["T2M", "PRECTOTCORR", "GWETROOT"],
    start: "2023",
    end: "2025",
    format: "JSON",
  });
  state.nasaRevealed = true;
  $("nasaEmptyHint").classList.add("hidden");
  $("nasaResultsBlock").classList.remove("hidden");
  await ensureClimateFetched();
  renderDavResults();
}

function renderDavResults() {
  const res = state.davResult;
  if (!res) return;
  $("davSourceBadge").textContent = res.status === "LIVE_NASA_POWER" ? "Satélite NASA en vivo" : "Base NASA lista";
  updateNasaStatus(res.status === "LIVE_NASA_POWER" ? "Conectado a NASA" : "Datos NASA listos", res.status);

  const series = res.parameter_series || {};
  const tMap = series.T2M || {};
  const pMap = series.PRECTOTCORR || {};
  const gMap = series.GWETROOT || {};

  const keys = Object.keys(tMap).filter((k) => !k.endsWith("13") && tMap[k] > -900);
  const recentKeys = keys.slice(-18);

  if (recentKeys.length) {
    const avgT = recentKeys.reduce((a, k) => a + Number(tMap[k]), 0) / recentKeys.length;
    const avgP = recentKeys.reduce((a, k) => a + Math.max(0, Number(pMap[k] || 0)), 0) / recentKeys.length;
    const avgG = recentKeys.reduce((a, k) => a + Math.max(0, Number(gMap[k] || 0)), 0) / recentKeys.length;

    $("kpiNasaTemp").textContent = `${avgT.toFixed(1)} °C`;
    $("kpiNasaTempNote").textContent = avgT > 24 ? "Clima caluroso" : avgT > 15 ? "Clima templado" : "Clima fresco";

    const annualRainEst = Math.round(avgP * 365);
    $("kpiNasaRain").textContent = `${annualRainEst} mm/año`;
    $("kpiNasaRainNote").textContent = annualRainEst < 500 ? "Zona seca (poca lluvia)" : annualRainEst < 900 ? "Lluvia moderada" : "Buena lluvia";

    const moistPct = Math.round(avgG * 100);
    $("kpiNasaMoist").textContent = `${moistPct}%`;
    $("kpiNasaMoistNote").textContent = moistPct < 38 ? "Tierra seca" : moistPct < 65 ? "Humedad media" : "Tierra húmeda";
  }

  animateChart("davSeriesCanvas", (prog) => drawDavSeriesChart(recentKeys, series, prog));
}

function drawDavSeriesChart(keys, series, progress = 1) {
  const canvas = $("davSeriesCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  if (!keys.length) return;

  const padL = 56, padR = 52, padT = 38, padB = 34;
  const pw = w - padL - padR, ph = h - padT - padB;
  const colW = pw / keys.length;

  const rains = keys.map((k) => Math.max(0, Number(series.PRECTOTCORR?.[k] || 0) * 30));
  const temps = keys.map((k) => Number(series.T2M?.[k] || 20));
  const maxRain = Math.max(120, ...rains);
  const minT = Math.min(...temps) - 3, maxT = Math.max(...temps) + 3;

  // Líneas suaves de guía
  ctx.strokeStyle = "#e2effd";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (i / 4) * ph;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.fillStyle = "#466380"; ctx.font = "600 11px Segoe UI, sans-serif"; ctx.textAlign = "right";
    ctx.fillText(`${Math.round(maxRain * (1 - i / 4))} mm`, padL - 8, y + 4);
  }

  // Barras azules de lluvia
  keys.forEach((k, i) => {
    const bh = (rains[i] / maxRain) * ph * progress;
    const x = padL + i * colW + colW * 0.2;
    ctx.fillStyle = "#7dd3fc";
    ctx.fillRect(x, padT + ph - bh, colW * 0.6, bh);
    if (i % 2 === 0 || keys.length <= 12) {
      ctx.fillStyle = "#0f2942"; ctx.font = "600 11px Segoe UI, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(formatMonthCode(k), padL + (i + 0.5) * colW, h - 10);
    }
  });

  // Línea naranja de temperatura
  const maxIdx = Math.max(1, Math.floor((keys.length - 1) * progress));
  ctx.beginPath();
  for (let i = 0; i <= maxIdx; i++) {
    const x = padL + (i + 0.5) * colW;
    const y = padT + ph - ((temps[i] - minT) / Math.max(2, maxT - minT)) * ph;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 3; ctx.stroke();

  keys.slice(0, maxIdx + 1).forEach((k, i) => {
    const x = padL + (i + 0.5) * colW;
    const y = padT + ph - ((temps[i] - minT) / Math.max(2, maxT - minT)) * ph;
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#f59e0b"; ctx.fill();
  });

  // Leyenda clara arriba
  ctx.textAlign = "left"; ctx.font = "700 12.5px Segoe UI, sans-serif";
  ctx.fillStyle = "#0284c7"; ctx.fillText("■ Lluvia mensual (mm)", padL, 20);
  ctx.fillStyle = "#d97706"; ctx.fillText("● Temperatura (°C)", padL + 175, 20);
}

/* ==================== CARGA CLIMA Y SUELO ==================== */
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
  state.climate = await apiRequest("/api/climate", {
    latitude: lat,
    longitude: lon,
    preset_id: presetVal !== "custom" ? presetVal : null,
    prefer_live: true,
  });
  updateNasaStatus(
    state.climate.source_status === "LIVE_NASA_POWER" ? "Conectado a NASA" : "Datos NASA listos",
    state.climate.source_status
  );
  return state.climate;
}

async function runDiagnosisWithUserSoil() {
  updateNasaStatus("Calculando...", "loading");
  await ensureClimateFetched();
  const { soil, priorities, current_crop_id } = getPayloadParams();
  state.optimization = await apiRequest("/api/optimize", {
    climate: state.climate,
    soil,
    priorities,
    scenario: $("scenarioSelect").value || "baseline",
    num_years: 3,
    current_crop_id,
  });
  state.diagRevealed = true;
  $("diagEmptyHint").classList.add("hidden");
  $("diagResultsBlock").classList.remove("hidden");
  updateNasaStatus("Tierra revisada", state.climate.source_status);
  renderClimateViews();
}

async function runAllScenarios() {
  updateNasaStatus("Calculando climas...", "loading");
  await ensureClimateFetched();
  const { soil, priorities, current_crop_id } = getPayloadParams();
  state.scenariosMatrix = await apiRequest("/api/scenarios-matrix", {
    climate: state.climate,
    soil,
    priorities,
    num_years: 3,
    current_crop_id,
  });
  state.scenRevealed = true;
  $("scenEmptyHint").classList.add("hidden");
  $("scenResultsBlock").classList.remove("hidden");
  updateNasaStatus("Climas listos", state.climate.source_status);
  renderScenariosMatrix();
}

async function runOptimizationRotations() {
  updateNasaStatus("Buscando cultivos...", "loading");
  await ensureClimateFetched();
  const { soil, priorities, current_crop_id } = getPayloadParams();
  state.optimization = await apiRequest("/api/optimize", {
    climate: state.climate,
    soil,
    priorities,
    scenario: $("scenarioSelect").value || "baseline",
    num_years: 3,
    current_crop_id,
  });
  state.selectedStrategyIdx = 0;
  state.rotRevealed = true;
  $("rotEmptyHint").classList.add("hidden");
  $("rotResultsBlock").classList.remove("hidden");
  $("rotSidebarResults").classList.remove("hidden");
  updateNasaStatus("Plan listo", state.climate.source_status);
  renderRotationsView();
}

/* ==================== PASO 2: RENDER DE AGUA Y TIERRA ==================== */
function renderClimateViews() {
  const clim = state.climate;
  if (!clim) return;
  const ann = clim.annual_summary;
  const localSoilMonths = state.optimization?.local_soil_months || [];
  const awc = state.optimization?.soil?.effective_awc_mm_m || 150;
  const som = parseFloat($("somInput").value) || 1.8;

  $("diagLocationSubtitle").textContent = `${clim.location_label} (${clim.latitude}°, ${clim.longitude}°)`;

  const rainMm = Math.round(ann.total_precip_mm);
  const needMm = Math.round(ann.total_eto_mm);
  const waterRatio = rainMm / Math.max(1, needMm);

  let verdictText = "";
  if (waterRatio >= 0.85) {
    verdictText = "✅ En 3 segundos: La lluvia cubre bien la mayor parte del año. Tu tierra guarda buena humedad.";
  } else if (waterRatio >= 0.5) {
    verdictText = "⚠️ En 3 segundos: La lluvia alcanza solo en temporada húmeda. En meses secos conviene ahorrar agua o elegir cultivos resistentes.";
  } else {
    verdictText = "🔴 En 3 segundos: Llueve menos de lo que pide el cultivo. Es muy importante cuidar la humedad del suelo y elegir cultivos aguantadores.";
  }
  $("diagQuickVerdict").textContent = verdictText;

  $("kpiPrecip").textContent = `${rainMm} / ${needMm} mm`;
  $("kpiAridity").textContent = waterRatio >= 0.85 ? "✅ Lluvia suficiente" : waterRatio >= 0.5 ? "⚠️ Falta agua en meses secos" : "🔴 Zona seca";

  const meanLocalMoist = localSoilMonths.length
    ? Math.round(localSoilMonths.reduce((a, b) => a + b.local_moisture_pct, 0) / localSoilMonths.length)
    : Math.round(ann.mean_gwetroot * 100);
  $("kpiWetness").textContent = `${awc} litros/m²`;
  $("kpiAwc").textContent = awc >= 160 ? "✅ Buena reserva de agua" : awc >= 120 ? "Reserva media" : "⚠️ Se seca rápido";

  const sign = ann.warming_trend_c_decade >= 0 ? "+" : "";
  $("kpiWarming").textContent = `${sign}${ann.warming_trend_c_decade} °C`;
  $("kpiTempMean").textContent = `Temp. media actual: ${ann.mean_temp_c} °C`;

  $("kpiExtremes").textContent = `${ann.heat_stress_days_yr} días calor`;
  $("kpiDrySpell").textContent = `Máx. sin lluvia: ${ann.longest_dry_spell_days} días seguidos`;

  animateChart("soilTankCanvas", (prog) => drawSoilTankDiagram(awc, meanLocalMoist, som, prog));
  animateChart("climateCanvas", (prog) => drawClimatePulseChart(clim, localSoilMonths, prog));
  renderMonthlyClimateTable(clim, localSoilMonths);
}

/* DIBUJO FÁCIL DE ENTENDER: TANQUE DE AGUA EN LA TIERRA */
function drawSoilTankDiagram(awc, moistPct, somPct, progress = 1) {
  const canvas = $("soilTankCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  // Cielo suave
  ctx.fillStyle = "#e0f2fe";
  ctx.fillRect(24, 16, w - 48, 50);

  // Plantita arriba
  ctx.strokeStyle = "#16a34a"; ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.moveTo(w / 2, 66); ctx.lineTo(w / 2, 32); ctx.stroke();
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.ellipse(w / 2 - 12, 46, 11, 5.5, -0.4, 0, Math.PI * 2);
  ctx.ellipse(w / 2 + 12, 40, 11, 5.5, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Contorno del tanque de tierra
  const tx = 58, ty = 66, tw = 165, th = 165;
  ctx.fillStyle = "#f5ebe0";
  ctx.fillRect(tx, ty, tw, th);

  // Capa oscura arriba (fertilidad / materia orgánica)
  const humusH = Math.min(34, 10 + somPct * 4.5);
  ctx.fillStyle = "#5c4033";
  ctx.fillRect(tx, ty, tw, humusH);

  // Nivel de agua guardada (azul claro transparente)
  const fillFrac = Math.max(0.15, Math.min(0.95, moistPct / 100)) * progress;
  const waterH = (th - 10) * fillFrac;
  const wy = ty + th - waterH;
  const wg = ctx.createLinearGradient(0, wy, 0, ty + th);
  wg.addColorStop(0, "rgba(56, 189, 248, 0.65)");
  wg.addColorStop(1, "rgba(2, 132, 199, 0.85)");
  ctx.fillStyle = wg;
  ctx.fillRect(tx + 2, wy, tw - 4, waterH);

  // Borde del tanque
  ctx.strokeStyle = "#1d6fd6";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(tx, ty, tw, th);

  // Etiquetas claras al lado derecho
  const rx = 242;
  ctx.textAlign = "left";
  ctx.fillStyle = "#0f2942";
  ctx.font = "800 18px Segoe UI, sans-serif";
  ctx.fillText(`${moistPct}% llena`, rx, 102);

  ctx.fillStyle = "#0284c7";
  ctx.font = "700 13px Segoe UI, sans-serif";
  ctx.fillText(`💧 Guarda ${awc} litros/m²`, rx, 128);

  ctx.fillStyle = "#5c4033";
  ctx.font = "700 12.5px Segoe UI, sans-serif";
  ctx.fillText(`🟤 Tierra fértil: ${somPct.toFixed(1)}%`, rx, 160);

  ctx.fillStyle = "#466380";
  ctx.font = "600 12px Segoe UI, sans-serif";
  const tip = awc >= 160 ? "Retiene muy bien la lluvia." : awc >= 120 ? "Retención normal." : "Deja pasar el agua rápido.";
  ctx.fillText(tip, rx, 188);
}

function drawClimatePulseChart(climate, localSoilMonths, progress = 1) {
  const canvas = $("climateCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  const months = climate.months;
  const padL = 54, padR = 24, padT = 36, padB = 32;
  const pw = w - padL - padR, ph = h - padT - padB;
  const maxWater = Math.max(120, ...months.map((m) => Math.max(m.precip_mm, m.eto_mm)));
  const colW = pw / 12;

  ctx.strokeStyle = "#e2effd";
  for (let i = 0; i <= 4; i++) {
    const y = padT + (i / 4) * ph;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.fillStyle = "#466380"; ctx.font = "600 11px Segoe UI, sans-serif"; ctx.textAlign = "right";
    ctx.fillText(`${Math.round(maxWater * (1 - i / 4))} mm`, padL - 8, y + 4);
  }

  months.forEach((m, i) => {
    const bh = (m.precip_mm / maxWater) * ph * progress;
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(padL + i * colW + colW * 0.22, padT + ph - bh, colW * 0.56, bh);
    ctx.fillStyle = "#0f2942"; ctx.font = "700 11px Segoe UI, sans-serif"; ctx.textAlign = "center";
    ctx.fillText(m.label_es || m.label, padL + (i + 0.5) * colW, h - 10);
  });

  const maxIdx = Math.max(1, Math.floor(11 * progress));
  const drawCurve = (getter, color) => {
    ctx.beginPath();
    for (let i = 0; i <= maxIdx; i++) {
      const x = padL + (i + 0.5) * colW;
      const y = padT + ph - Math.max(0, Math.min(1, getter(i))) * ph;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke();
  };

  drawCurve((i) => months[i].eto_mm / maxWater, "#f59e0b");
  if (localSoilMonths.length === 12) {
    drawCurve((i) => localSoilMonths[i].local_moisture_pct / 100, "#16a34a");
  }

  ctx.textAlign = "left"; ctx.font = "700 12px Segoe UI, sans-serif";
  ctx.fillStyle = "#2563eb"; ctx.fillText("■ Lluvia", padL, 19);
  ctx.fillStyle = "#d97706"; ctx.fillText("— Agua que pide el campo", padL + 75, 19);
  ctx.fillStyle = "#15803d"; ctx.fillText("— Humedad de tu tierra", padL + 265, 19);
}

function renderMonthlyClimateTable(climate, localSoilMonths) {
  const table = $("monthlyClimateTable");
  const rows = climate.months.map((m, idx) => {
    const loc = localSoilMonths[idx];
    const moist = loc ? loc.local_moisture_pct : Math.round(m.gwetroot * 100);
    const diff = m.precip_mm - m.eto_mm;
    let statusBadge = `<span class="badge-status badge-ok">✅ Alcanza bien</span>`;
    if (diff < -45 && moist < 45) statusBadge = `<span class="badge-status badge-risk">🔴 Mes seco (falta agua)</span>`;
    else if (diff < -10) statusBadge = `<span class="badge-status badge-warn">⚠️ Agua justa</span>`;

    return `
    <tr>
      <td><strong>${m.label_es || m.label}</strong></td>
      <td>${m.t2m} °C</td>
      <td>${Math.round(m.precip_mm)} mm</td>
      <td><strong>${moist}%</strong></td>
      <td>${statusBadge}</td>
    </tr>`;
  }).join("");
  table.innerHTML = `
    <thead><tr>
      <th>Mes</th><th>Temperatura</th><th>Lluvia</th><th>Humedad en tu tierra</th><th>¿Alcanza el agua?</th>
    </tr></thead><tbody>${rows}</tbody>`;
}

/* ==================== PASO 3: SI HAY SEQUÍA (ESCENARIOS) ==================== */
function renderScenariosMatrix() {
  const matrix = state.scenariosMatrix;
  if (!matrix || !matrix.scenarios) return;

  const icons = {
    baseline: "🌤️",
    warm_dry_15: "🌡️",
    extreme_25: "🌵",
    wet_extreme_12: "⛈️",
  };

  $("scenarioCardsGrid").innerHTML = matrix.scenarios.map((s) => {
    const opt = s.optimal_strategy;
    const base = s.baseline;
    const basePct = Math.round(base.metrics.mean_yield_resilience_pct);
    const optPct = Math.round(opt.metrics.mean_yield_resilience_pct);
    const diff = optPct - basePct;
    const icon = icons[s.scenario_id] || "🌦️";

    return `
      <article class="scenario-card reveal-card">
        <h4>${icon} ${isEn() ? s.label_en : s.label_es}</h4>
        <p>${isEn() ? s.desc_en : s.desc_es}</p>

        <div class="bar-compare-row">
          <div class="bar-compare-head">
            <span>Si sigues igual</span>
            <strong style="color:#b91c1c">${basePct}%</strong>
          </div>
          <div class="progress-track"><div class="progress-fill-bad" style="width:${basePct}%"></div></div>
        </div>

        <div class="bar-compare-row">
          <div class="bar-compare-head">
            <span>Cambiando cultivos</span>
            <strong style="color:#15803d">${optPct}% (${diff >= 0 ? "+" : ""}${diff}%)</strong>
          </div>
          <div class="progress-track"><div class="progress-fill-good" style="width:${optPct}%"></div></div>
        </div>
      </article>`;
  }).join("");

  animateChart("scenariosBarCanvas", (prog) => drawScenariosChart(matrix, prog));
}

function drawScenariosChart(matrix, progress = 1) {
  const canvas = $("scenariosBarCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  const rows = matrix.scenarios || [];
  const padL = 52, padR = 24, padT = 38, padB = 46;
  const pw = w - padL - padR, ph = h - padT - padB;
  const grpW = pw / Math.max(1, rows.length);

  ctx.strokeStyle = "#e2effd";
  for (let i = 0; i <= 4; i++) {
    const y = padT + (i / 4) * ph;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.fillStyle = "#466380"; ctx.font = "600 11px Segoe UI, sans-serif"; ctx.textAlign = "right";
    ctx.fillText(`${100 - i * 25}%`, padL - 8, y + 4);
  }

  rows.forEach((s, i) => {
    const x0 = padL + i * grpW;
    const baseY = s.baseline.metrics.mean_yield_resilience_pct;
    const optY = s.optimal_strategy.metrics.mean_yield_resilience_pct;
    const bw = Math.min(48, grpW * 0.28);

    const h1 = (baseY / 100) * ph * progress;
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(x0 + grpW * 0.22, padT + ph - h1, bw, h1);
    if (progress > 0.8) {
      ctx.fillStyle = "#991b1b"; ctx.font = "700 11.5px Segoe UI, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`${Math.round(baseY)}%`, x0 + grpW * 0.22 + bw / 2, padT + ph - h1 - 6);
    }

    const h2 = (optY / 100) * ph * progress;
    ctx.fillStyle = "#1d6fd6";
    ctx.fillRect(x0 + grpW * 0.52, padT + ph - h2, bw, h2);
    if (progress > 0.8) {
      ctx.fillStyle = "#1e40af";
      ctx.fillText(`${Math.round(optY)}%`, x0 + grpW * 0.52 + bw / 2, padT + ph - h2 - 6);
    }

    const shortLabel = (isEn() ? s.label_en : s.label_es).split("(")[0].trim().slice(0, 20);
    ctx.fillStyle = "#0f2942"; ctx.font = "700 11.5px Segoe UI, sans-serif"; ctx.textAlign = "center";
    ctx.fillText(shortLabel, x0 + grpW * 0.48, h - 14);
  });

  ctx.textAlign = "left"; ctx.font = "700 12.5px Segoe UI, sans-serif";
  ctx.fillStyle = "#dc2626"; ctx.fillText("■ Si sigues igual (cosecha %)", padL, 20);
  ctx.fillStyle = "#1d6fd6"; ctx.fillText("■ Cambiando cultivos (cosecha %)", padL + 230, 20);
}

/* ==================== PASO 4: QUÉ SEMBRAR Y GRÁFICAS CLARAS ==================== */
function renderRotationsView() {
  const opt = state.optimization;
  if (!opt || !opt.strategies) return;

  const container = $("strategyTabs");
  container.innerHTML = "";
  opt.strategies.forEach((strat, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `strategy-tab ${idx === state.selectedStrategyIdx ? "active" : ""}`;
    const seq = strat.seasons.slice(0, 3).map((s) => (isEn() ? s.crop_name_en : s.crop_name_es).split(" (")[0]).join(" → ");
    btn.innerHTML = `
      <div>
        <div class="strategy-title">Opción ${strat.rank} · ${friendlyStrategyTag(strat.strategy_tag)}</div>
        <div class="strategy-seq">${seq} ...</div>
      </div>
      <div class="strategy-score">${Math.round(strat.composite_score)}</div>`;
    btn.addEventListener("click", () => {
      state.selectedStrategyIdx = idx;
      renderRotationsView();
    });
    container.appendChild(btn);
  });

  renderSelectedStrategy();
}

function cropBenefitText(s) {
  if (s.root_morphology === "nodulated") return "🌿 Aporta abono natural (nitrógeno) a la tierra.";
  if (s.root_depth_m >= 1.25) return "💧 Raíz profunda: busca agua abajo y aguanta calor.";
  if (s.group === "cover") return "🛡️ Cubre el suelo para que no se seque ni salga maleza.";
  return "🌾 Buen cultivo de cosecha y alimento.";
}

function renderSelectedStrategy() {
  const opt = state.optimization;
  const strat = opt.strategies[state.selectedStrategyIdx];
  const base = opt.baseline;
  const d = strat.vs_baseline;

  const cards = [
    { label: "💧 Agua ahorrada", val: `${d.water_saved_mm >= 0 ? "+" : ""}${Math.round(d.water_saved_mm)} mm`, sub: "Menos agua desperdiciada" },
    { label: "📈 Mejora de cosecha", val: `${d.yield_stability_gain_pct >= 0 ? "+" : ""}${d.yield_stability_gain_pct}%`, sub: "Cosecha más segura" },
    { label: "🌱 Tierra más fértil", val: `${d.som_gain_pct >= 0 ? "+" : ""}${d.som_gain_pct}%`, sub: "Más materia orgánica" },
    { label: "🌿 Abono natural gratis", val: `${Math.round(strat.metrics.biological_n_fixed_kg_ha)} kg/ha`, sub: "Nitrógeno fijado al suelo" },
  ];
  $("baselineDeltaGrid").innerHTML = cards
    .map((c) => `<article class="kpi-card"><span class="kpi-label">${c.label}</span><strong class="kpi-value">${c.val}</strong><small class="kpi-sub">${c.sub}</small></article>`)
    .join("");

  animateChart("mandalaCanvas", (prog) => drawLivingMandala(opt.climate, strat, opt.soil, prog), 500);
  animateChart("rootsDiagramCanvas", (prog) => drawRootsUndergroundDiagram(strat, prog), 450);
  animateChart("soilTrajectoryCanvas", (prog) => drawSoilTrajectoryChart(strat, base, prog));

  $("seasonCardsGrid").innerHTML = strat.seasons.map((s) => {
    const yieldPct = Math.round(s.yield_resilience_pct);
    const waterPct = Math.round(s.water_stress_ks * 100);
    const pestTxt = s.pest_risk_pct < 20 ? "✅ Bajo" : s.pest_risk_pct < 38 ? "⚠️ Medio" : "🔴 Alto";
    return `
    <article class="season-card" style="border-top-color:${s.color_hex}">
      <div class="season-top">
        <div>
          <div class="season-label">Ciclo ${s.season_index} · ${friendlySeasonLabel(s.season_label)}</div>
          <h4 class="season-crop">${isEn() ? s.crop_name_en : s.crop_name_es}</h4>
        </div>
      </div>
      <p class="season-benefit">${cropBenefitText(s)}</p>
      <div class="season-metrics">
        <div>Cosecha esperada: <strong>${yieldPct}%</strong></div>
        <div class="progress-track"><div class="progress-fill-good" style="width:${yieldPct}%"></div></div>
        <div>Agua cubierta: <strong>${waterPct}%</strong> · Riesgo plagas: <strong>${pestTxt}</strong></div>
      </div>
    </article>`;
  }).join("");

  $("rotationPlanTable").innerHTML = `
    <thead><tr>
      <th>Temporada</th><th>Qué sembrar</th><th>Cosecha esperada</th><th>Agua cubierta</th>
    </tr></thead>
    <tbody>${strat.seasons.map((s) => `
      <tr>
        <td><strong>Ciclo ${s.season_index} (${friendlySeasonLabel(s.season_label)})</strong></td>
        <td><strong>${isEn() ? s.crop_name_en : s.crop_name_es}</strong></td>
        <td><span class="badge-status badge-ok">${Math.round(s.yield_resilience_pct)}%</span></td>
        <td>${Math.round(s.water_stress_ks * 100)}%</td>
      </tr>`).join("")}</tbody>`;
}

/* DIBUJO CLARO DE RAÍCES BAJO TIERRA (FÁCIL PARA TODAS LAS EDADES) */
function drawRootsUndergroundDiagram(strat, progress = 1) {
  const canvas = $("rootsDiagramCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Cielo arriba y tierra abajo
  const skyH = 74;
  ctx.fillStyle = "#e0f2fe";
  ctx.fillRect(0, 0, w, skyH);

  const soilGrad = ctx.createLinearGradient(0, skyH, 0, h);
  soilGrad.addColorStop(0, "#8b5a3c");
  soilGrad.addColorStop(0.45, "#a67c52");
  soilGrad.addColorStop(1, "#d6b89c");
  ctx.fillStyle = soilGrad;
  ctx.fillRect(0, skyH, w, h - skyH);

  // Línea de césped/suelo
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(0, skyH - 4, w, 6);

  // Mostrar los primeros 4 ciclos o cultivos únicos del plan
  const shown = strat.seasons.slice(0, 4);
  const colW = w / shown.length;

  shown.forEach((s, i) => {
    const cx = colW * (i + 0.5);
    // Planta arriba
    ctx.strokeStyle = "#15803d"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, skyH - 2); ctx.lineTo(cx, skyH - 32); ctx.stroke();
    ctx.fillStyle = s.color_hex || "#16a34a";
    ctx.beginPath();
    ctx.arc(cx, skyH - 36, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.5; ctx.stroke();

    // Nombre del cultivo arriba en azul oscuro
    const shortName = (isEn() ? s.crop_name_en : s.crop_name_es).split(" (")[0].split(" ")[0];
    ctx.fillStyle = "#0f2942";
    ctx.font = "800 11.5px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${i + 1}. ${shortName}`, cx, 18);

    // Raíces abajo proporcionales a root_depth_m
    const maxRootPx = 142;
    const rLen = Math.min(maxRootPx, Math.max(45, (s.root_depth_m / 1.5) * maxRootPx)) * progress;

    ctx.strokeStyle = "#fef3c7";
    ctx.lineWidth = s.root_morphology === "taproot" ? 3 : 2;

    const branches = s.root_morphology === "taproot" ? 3 : 5;
    for (let b = 0; b < branches; b++) {
      const offset = (b - (branches - 1) / 2) * 11;
      ctx.beginPath();
      ctx.moveTo(cx, skyH + 2);
      ctx.quadraticCurveTo(cx + offset * 0.7, skyH + rLen * 0.5, cx + offset, skyH + rLen);
      ctx.stroke();

      // Bolitas de abono natural si es leguminosa (nodulated)
      if (s.root_morphology === "nodulated" && progress > 0.5) {
        ctx.beginPath();
        ctx.arc(cx + offset * 0.8, skyH + rLen * 0.65, 3.8, 0, Math.PI * 2);
        ctx.fillStyle = "#4ade80";
        ctx.fill();
      }
    }

    // Etiqueta de profundidad abajo
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 10.5px Segoe UI, sans-serif";
    const tag = s.root_morphology === "nodulated" ? "Abona tierra" : s.root_depth_m >= 1.2 ? "Raíz honda" : "Raíz media";
    ctx.fillText(tag, cx, h - 10);
  });
}

/* RUEDA DE SIEMBRA CLARA (PALETA BLANCA Y AZUL CLARO) */
function drawLivingMandala(climate, strategy, soil, progress = 1) {
  const canvas = $("mandalaCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height, cx = w / 2, cy = h / 2;
  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  // Aro exterior azul muy suave
  ctx.beginPath();
  ctx.arc(cx, cy, 206, 0, Math.PI * 2);
  ctx.fillStyle = "#f0f7ff";
  ctx.fill();
  ctx.strokeStyle = "#bae6fd";
  ctx.lineWidth = 2;
  ctx.stroke();

  const months = climate.months;
  const maxPrec = Math.max(40, ...months.map((m) => m.precip_mm));
  months.forEach((m, i) => {
    const a0 = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
    const aMid = 0.5 * (a0 + a1);
    const sunNorm = Math.min(1, m.sw_dwn_mj_m2_day / 30);

    ctx.beginPath();
    ctx.arc(cx, cy, 194, a0 + 0.04, a1 - 0.04);
    ctx.strokeStyle = `rgba(245, 158, 11, ${(0.35 + sunNorm * 0.55) * progress})`;
    ctx.lineWidth = 6;
    ctx.stroke();

    const rainLen = (6 + (m.precip_mm / maxPrec) * 20) * progress;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(aMid) * 184, cy + Math.sin(aMid) * 184);
    ctx.lineTo(cx + Math.cos(aMid) * (184 - rainLen), cy + Math.sin(aMid) * (184 - rainLen));
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#0f2942";
    ctx.font = "700 10.5px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(m.label_es || m.label, cx + Math.cos(aMid) * 216, cy + Math.sin(aMid) * 216);
  });

  const seasons = strategy.seasons;
  seasons.forEach((s, idx) => {
    const a0 = (idx / seasons.length) * Math.PI * 2 - Math.PI / 2 + 0.04;
    const a1 = ((idx + 1) / seasons.length) * Math.PI * 2 - Math.PI / 2 - 0.04;
    const aMid = 0.5 * (a0 + a1);
    const arcSpan = (a1 - a0) * progress;

    ctx.beginPath();
    ctx.arc(cx, cy, 126, a0, a0 + arcSpan);
    ctx.strokeStyle = s.color_hex;
    ctx.lineWidth = 26;
    ctx.stroke();

    // Raíces hacia el centro
    const rootReach = (26 + (s.root_depth_m / 1.6) * 32) * progress;
    for (let f = 0; f < 4; f++) {
      const ang = a0 + ((f + 1) / 5) * (a1 - a0);
      const rStart = 112, rEnd = rStart - rootReach;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * rStart, cy + Math.sin(ang) * rStart);
      ctx.lineTo(cx + Math.cos(ang) * rEnd, cy + Math.sin(ang) * rEnd);
      ctx.strokeStyle = "#8b5a3c";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      if (s.root_morphology === "nodulated" && progress > 0.6) {
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ang) * (rEnd + 5), cy + Math.sin(ang) * (rEnd + 5), 3, 0, Math.PI * 2);
        ctx.fillStyle = "#16a34a";
        ctx.fill();
      }
    }

    if (progress > 0.65) {
      const shortName = (isEn() ? s.crop_name_en : s.crop_name_es).split(" ")[0];
      ctx.fillStyle = "#0f2942";
      ctx.font = "800 10.5px Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${s.season_index}. ${shortName}`, cx + Math.cos(aMid) * 126, cy + Math.sin(aMid) * 126);
    }
  });

  // Centro limpio blanco y azul
  ctx.beginPath();
  ctx.arc(cx, cy, 50, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#1d6fd6";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#1d6fd6";
  ctx.font = "800 20px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${Math.round(strategy.composite_score)}`, cx, cy - 8);
  ctx.fillStyle = "#15803d";
  ctx.font = "700 10.5px Segoe UI, sans-serif";
  ctx.fillText("Plan de 3 años", cx, cy + 12);

  $("mandalaLegend").innerHTML = `
    <span class="legend-chip"><span class="legend-dot" style="background:#f59e0b"></span>Sol y calor</span>
    <span class="legend-chip"><span class="legend-dot" style="background:#0284c7"></span>Lluvia del mes</span>
    <span class="legend-chip"><span class="legend-dot" style="background:#16a34a"></span>Abono natural</span>`;
}

function drawSoilTrajectoryChart(strat, base, progress = 1) {
  const canvas = $("soilTrajectoryCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  const s1 = strat.seasons, s0 = base.seasons;
  const padL = 56, padR = 28, padT = 36, padB = 30;
  const pw = w - padL - padR, ph = h - padT - padB;
  const somVals = [...s1.map((x) => x.som_end_pct), ...s0.map((x) => x.som_end_pct)];
  const minS = Math.min(...somVals) - 0.15, maxS = Math.max(...somVals) + 0.15;
  const maxIdx = Math.max(1, Math.floor((s1.length - 1) * progress));

  ctx.strokeStyle = "#e2effd";
  for (let i = 0; i <= 3; i++) {
    const y = padT + (i / 3) * ph;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.fillStyle = "#466380"; ctx.font = "600 11px Segoe UI, sans-serif"; ctx.textAlign = "right";
    ctx.fillText(`${(maxS - (i / 3) * (maxS - minS)).toFixed(1)}%`, padL - 8, y + 4);
  }

  const drawLine = (arr, getter, color, dash = []) => {
    ctx.beginPath(); ctx.setLineDash(dash);
    for (let i = 0; i <= maxIdx; i++) {
      const x = padL + (i / Math.max(1, arr.length - 1)) * pw;
      const y = padT + ph - ((getter(arr[i]) - minS) / Math.max(0.05, maxS - minS)) * ph;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color; ctx.lineWidth = 3.2; ctx.stroke(); ctx.setLineDash([]);
  };

  drawLine(s1, (x) => x.som_end_pct, "#16a34a");
  drawLine(s0, (x) => x.som_end_pct, "#ef4444", [6, 5]);

  s1.forEach((x, i) => {
    ctx.fillStyle = "#0f2942"; ctx.font = "700 11px Segoe UI, sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`Ciclo ${x.season_index}`, padL + (i / Math.max(1, s1.length - 1)) * pw, h - 9);
  });

  ctx.textAlign = "left"; ctx.font = "700 12.5px Segoe UI, sans-serif";
  ctx.fillStyle = "#15803d"; ctx.fillText("— Tierra con rotación (mejora)", padL, 20);
  ctx.fillStyle = "#dc2626"; ctx.fillText("-- Sembrando siempre lo mismo (baja)", padL + 235, 20);
}

/* ==================== PRESETS Y EVENTOS ==================== */
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
  $("somInput").value = s.som_pct;
  $("phInput").value = s.ph;
  $("nInput").value = s.initial_n_kg_ha;
  $("slopeInput").value = s.slope_pct;
  $("irrigSelect").value = s.irrigation_mode;
  updateSoilBadges();

  updateMapMarker(preset.latitude, preset.longitude);
  $("heroLocationChip").textContent = `${preset.name_es} · Listo`;
  state.nasaRevealed = false;
  state.diagRevealed = false;
  state.scenRevealed = false;
  state.rotRevealed = false;
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

  $("presetSelect").addEventListener("change", (e) => {
    selectPresetById(e.target.value);
    runDavQuery();
  });
  $("homePresetSelect").addEventListener("change", (e) => selectPresetById(e.target.value));
  $("homeCurrentCrop").addEventListener("change", (e) => {
    $("currentCropSelect").value = e.target.value;
    state.diagRevealed = false;
    state.scenRevealed = false;
    state.rotRevealed = false;
  });
  $("currentCropSelect").addEventListener("change", (e) => {
    $("homeCurrentCrop").value = e.target.value;
  });

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
    let blob;
    if (!useStaticEngine) {
      try {
        const resp = await fetch("/api/nasa-viewer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: parseFloat($("latInput").value) || 20.6,
            longitude: parseFloat($("lonInput").value) || -101.2,
            community: "AG",
            temporal: "monthly",
            parameters: ["T2M", "PRECTOTCORR", "GWETROOT"],
            start: "2023",
            end: "2025",
            format: "CSV",
          }),
        });
        if (resp.ok) blob = await resp.blob();
      } catch {}
    }
    if (!blob) {
      const series = state.davResult?.parameter_series || {};
      const keys = Object.keys(series.T2M || {}).filter((k) => !k.endsWith("13"));
      const rows = ["Periodo,Temperatura_C,Lluvia_mm_dia,Humedad_Raices"];
      keys.forEach((k) => rows.push(`${k},${series.T2M?.[k] ?? ""},${series.PRECTOTCORR?.[k] ?? ""},${series.GWETROOT?.[k] ?? ""}`));
      blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "clima_nasa_terreno.csv"; a.click();
    URL.revokeObjectURL(url);
  });

  $("somInput").addEventListener("input", updateSoilBadges);
  $("phInput").addEventListener("input", updateSoilBadges);
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
    a.download = "rueda_siembra_3_anos.png";
    a.href = $("mandalaCanvas").toDataURL("image/png");
    a.click();
  });

  $("exportCsvBtn").addEventListener("click", async () => {
    if (!state.optimization) return;
    const strat = state.optimization.strategies[state.selectedStrategyIdx];
    let blob;
    if (!useStaticEngine) {
      try {
        const resp = await fetch("/api/export-csv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ strategy: strat }),
        });
        if (resp.ok) blob = await resp.blob();
      } catch {}
    }
    if (!blob && window.OrbitalStaticEngine) {
      const csvStr = window.OrbitalStaticEngine.buildCsv(strat);
      blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
    }
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "plan_siembra_3_anos.csv"; a.click();
    URL.revokeObjectURL(url);
  });
}

async function init() {
  state.bootstrap = await apiRequest("/api/bootstrap", null, "GET");
  populatePresetSelects();
  populateTextureSelect();
  populateCurrentCropSelect();
  wireEvents();
  startHeroAnimation();
  initInteractiveMap();
  selectPresetById("bajio_mx");
}

init();
