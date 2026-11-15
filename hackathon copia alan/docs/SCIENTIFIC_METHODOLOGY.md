# Scientific Methodology — Orbital Farm

## 1. NASA Earth Observations Pipeline (`orbital_farm/nasa_power.py`)

Orbital Farm queries two complementary endpoints from the **NASA POWER (Prediction of Worldwide Energy Resources)** Agroclimatology (`AG`) archive:

1. **Multi-Year Monthly & Annual Endpoint** (`/api/temporal/monthly/point`, `2016–2025`):
   - `T2M`, `T2M_MAX`, `T2M_MIN` (°C): Air temperature at 2 m (MERRA-2 reanalysis).
   - `PRECTOTCORR` (mm/day): Bias-corrected total precipitation.
   - `ALLSKY_SFC_SW_DWN` (MJ/m²/day in `AG` community): All-sky downward shortwave irradiance from NASA CERES SYN1deg.
   - `RH2M` (%) & `WS2M` (m/s): 2-meter relative humidity and wind speed.
   - `GWETROOT` & `GWETTOP` (0–1): MERRA-2 root-zone (0–100 cm) and surface (0–5 cm) soil wetness indices.
   - Elevation $z$ (m) extracted directly from GeoJSON `geometry.coordinates[2]`.
2. **Daily Extreme-Weather Endpoint** (`/api/temporal/daily/point`, `2024–2025`):
   - Computes annual heat-stress frequency (`T2M_MAX >= 35°C`), frost-risk days (`T2M_MIN <= 2°C`), longest consecutive dry spell (`PRECTOTCORR < 1.0 mm/day`), and erosive storm events (`PRECTOTCORR >= 25.0 mm/day`).

All missing records (`<= -900` / `-999.0`) and annual aggregate keys (`YYYY13`) are filtered prior to computing 12-month normals and ordinary least-squares warming trends (°C/decade).

---

## 2. Reference Evapotranspiration & Soil Hydrology (`orbital_farm/soil_water.py`)

Monthly reference evapotranspiration $ET_0$ (mm/day) is computed using the **FAO-56 Penman-Monteith** equation (Allen et al., 1998):

$$ET_0 = \frac{0.408 \Delta (R_n - G) + \gamma \frac{900}{T_{\text{mean}} + 273} u_2 (e_s - e_a)}{\Delta + \gamma (1 + 0.34 u_2)}$$

where atmospheric pressure $P$ and psychrometric constant $\gamma = 0.000665 P$ are derived from NASA POWER point elevation $z$.

### Local Soil Hydraulics

Farmers select their local soil texture (`loamy_sand`, `sandy_loam`, `loam`, `clay_loam`, `silty_clay`), Soil Organic Matter (`SOM %`), pH, initial mineral nitrogen (kg N/ha), slope (%), and irrigation capability (`rainfed`, `deficit`, `full`).

Total Available Water ($TAW$, mm) scales with crop rooting depth $Z_r$ (m) and SOM-adjusted Available Water Capacity ($AWC$):

$$TAW = \left(AWC_{\text{base}} + 12.0 \cdot \text{clamp}(\text{SOM} - 2.0, -1.5, 4.0)\right) \cdot Z_r$$

Effective precipitation $P_{\text{eff}}$ accounts for textural infiltration rate, slope runoff penalty, SOM infiltration improvement, and residue mulch cover carried over from the preceding crop.

---

## 3. Crop Simulation & Multi-Objective Optimization (`orbital_farm/optimizer.py`)

Each 3-year plan spans **6 semi-annual seasons** (hemisphere- and equatorial-bimodal-aware). For each season:

1. **Thermal & GDD Viability**: Growing Degree Days $\sum \max(0, T_{\text{mean}} - T_{\text{base}}) \cdot d_m$ are compared against crop GDD requirements, combined with heat-limit and frost-limit penalties.
2. **Root-Zone Water Stress ($K_s$)**: Simulated month-by-month using the crop's FAO-56 $K_c$ progression and initial moisture blended with NASA MERRA-2 `GWETROOT`.
3. **Nitrogen Cycling & Botanical Family Rules**:
   - Legumes and legume cover crops add biologically fixed N to the soil pool.
   - Consecutive crops from the same botanical family incur pest/disease carryover penalties; Brassicaceae (`canola`) before cereals (`Poaceae`) provide biofumigation benefits; legumes preceding heavy feeders (`maize`, `winter_wheat`, `potato`) confer nitrogen synergy bonuses.
4. **Beam Search Optimization**: A width-48 Beam Search explores feasible multi-year sequences weighted by the farmer's four priority sliders (`Soil Health`, `Water Conservation`, `Extreme Weather Resilience`, `Income & Food Security`), returning the Top-3 structurally diverse strategies alongside a **Conventional Cereal Monoculture Baseline** counterfactual.
5. **Climate Stress Simulator**: Evaluates strategies under observed baseline, `+1.5°C / -15% Rain`, and `+2.5°C / -25% Rain` shock scenarios.

---

## 4. Assumptions & Limitations

- NASA POWER provides ~0.5° × 0.625° (MERRA-2) and 1° × 1° (CERES) gridded meteorology; micro-topographic frost pockets and plot-scale soil heterogeneity are approximated through user-supplied local soil inputs.
- Yield resilience is modeled as a normalized biophysical index (0–100%) rather than farm-gate dollar revenue, which varies with local market prices.
