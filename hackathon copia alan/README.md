# Orbital Farm — Guía Agrícola Clara con Datos NASA

Herramienta práctica y visual para ayudar a agricultores de cualquier edad a decidir qué cultivos alternar durante los próximos 3 años usando datos climáticos satelitales de **NASA POWER** y las características reales de su suelo.

---

## Características principales

- **Interfaz clara en azul claro y blanco:** Diseñada para entenderse en 3 segundos, sin tecnicismos innecesarios.
- **Navegación paso a paso:** `Inicio` → `1. Mi Terreno` → `2. Agua y Tierra` → `3. Si Hay Sequía` → `4. Qué Sembrar`.
- **Ayudas rápidas (`?`):** Círculos grises con signo de interrogación que explican conceptos al pasar el mouse.
- **Gráficas fáciles de leer:** Tanque de agua en el suelo, barras de riesgo climático, dibujo de raíces bajo tierra y rueda de siembra a 3 años.
- **Modo híbrido (Servidor Python + GitHub Pages):** Funciona tanto con el servidor Python completo (`python app.py`) como de forma estática directa en **GitHub Pages** usando `web/static-fallback.js`.

---

## Estructura del proyecto

```text
├── index.html                    # Redirección automática a ./web/ para GitHub Pages
├── app.py                        # Servidor local / nube (soporta $PORT y --public)
├── requirements.txt              # Dependencias Python (numpy, pandas)
├── Procfile / render.yaml        # Configuración lista para despliegue público en nube
├── LICENSE                       # Licencia pública MIT
├── .gitignore
├── .github/workflows/ci.yml      # Pruebas automáticas en GitHub Actions
├── orbital_farm/                 # Backend Python (NASA POWER, hidrología FAO-56 y optimizador)
├── web/                          # Interfaz web accesible y simplificada (azul claro y blanco)
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── static-fallback.js        # Motor cliente para funcionar sin backend en GitHub Pages
├── original_web/                 # Copia intacta de la interfaz HTML/CSS/JS original
├── docs/                         # Metodología científica
└── tests/                        # Pruebas unitarias y de integración
```

---

## Cómo usar localmente

```bash
pip install -r requirements.txt
python app.py
```

Abrirá automáticamente `http://127.0.0.1:8765`.  
Para compartirlo en tu red local:
```bash
python app.py --public --no-browser
```

Ejecutar pruebas:
```bash
python -m unittest discover -s tests -v
```

---

## Cómo subirlo a GitHub y hacerlo público

### 1. Subir a un repositorio público en GitHub
Si aún no tienes Git instalado, puedes subir los archivos desde la página web de GitHub (*Add file → Upload files*) o con Git en tu terminal:
```bash
git init
git add .
git commit -m "Versión pública de Orbital Farm"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/orbital-farm.git
git push -u origin main
```

### 2. Publicar gratis en GitHub Pages (1 clic, sin servidor)
1. Entra a tu repositorio público en GitHub.
2. Ve a **Settings → Pages**.
3. En **Source**, elige **Deploy from a branch**, selecciona `main` y la carpeta `/ (root)`, y presiona **Save**.
4. En 1–2 minutos tu app estará pública en `https://TU_USUARIO.github.io/orbital-farm/`.

### 3. (Opcional) Publicar con el backend Python completo en Render o Railway
El proyecto ya incluye `render.yaml`, `Procfile` y soporte automático para `$PORT` y `0.0.0.0` en `app.py`:
- Conecta tu repositorio en [Render](https://render.com) (detectará `render.yaml` automáticamente) o en Railway.
