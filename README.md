# La ruta del fotón

Página educativa interactiva sobre **estudio y aplicación de la emisión láser**, elaborada para la Unidad 3 de Física de Ingeniería en Sistemas Computacionales.

El recorrido va de la definición de láser a las aplicaciones, con un laboratorio conceptual, una calculadora de fotones, un detector de propiedades, un quiz y un modo exposición para la clase.

## Qué incluye

- Siete estaciones de contenido: introducción, procesos luz-materia, receta del láser, propiedades, He-Ne, aplicaciones y seguridad.
- Laboratorio interactivo **“Enciende el láser”** con tres misiones: inversión de población, cavidad y emisión.
- Calculadora de fotones: longitud de onda → frecuencia → energía en J y eV.
- Detector de propiedades y quiz con retroalimentación.
- Modo exposición con 9 paradas y notas para el expositor.
- Referencias en APA 7, sin Wikipedia ni libros.
- Funciona sin Internet, sin frameworks y sin CDN.

## Abrir la página

1. Abre `index.html` con doble clic.
2. La página funciona desde el sistema de archivos (`file://`), sin servidor.
3. Si quieres probarla con un servidor local:

```bash
python -m http.server 4173
```

Y visita `http://127.0.0.1:4173/`.

> No uses `fetch`, módulos ES ni recursos externos: la página está pensada para abrirse directamente y también para publicarse como sitio estático.

## Estructura

```text
.
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  ├─ main.js
│  ├─ laser-lab.js
│  ├─ photon-calculator.js
│  ├─ detector.js
│  └─ quiz.js
├─ assets/
│  └─ favicon.svg
├─ docs/
│  ├─ FUENTES.md
│  ├─ GUION.md
│  ├─ QA.md
│  ├─ DESPLIEGUE.md
│  └─ la-ruta-del-foton.pdf
├─ 404.html
├─ _headers
├─ .gitignore
└─ README.md
```

## Editar los nombres del equipo

Los cuatro nombres están **solo** en la sección `#equipo` de `index.html`, dentro del bloque marcado con:

```html
<!-- EDITAR AQUÍ: reemplaza los cuatro placeholders [Integrante N] por los nombres del equipo. -->
```

Reemplaza `[Integrante 1]`, `[Integrante 2]`, `[Integrante 3]` y `[Integrante 4]`. Los roles y las descripciones son una propuesta de reparto; ajústalos si el equipo se organizó de otra forma.

El resto de la página y el guion usan los roles (“quien coordina”, “quien presenta los fundamentos”…) para no repetir placeholders.

## Cómo exponer

1. Abre `index.html` en Chrome o Edge.
2. Presiona `F11` o el botón **Pantalla completa** dentro del modo exposición.
3. Pulsa **Presentar** en la barra superior.
4. Usa las flechas `←` y `→` para recorrer las 9 paradas; `Esc` cierra el panel.
5. Ten a la mano `docs/la-ruta-del-foton.pdf` como respaldo si falla el proyector.

El guion completo, con tiempos, frases y preguntas probable del jurado, está en [`docs/GUION.md`](docs/GUION.md).

## Publicar en GitHub y Cloudflare Pages

La página no necesita build: `index.html` está en la raíz y todos los recursos usan rutas relativas.

Resumen:

1. Crea un repositorio llamado `la-ruta-del-foton`.
2. Sube el contenido de esta carpeta a la rama `main`.
3. En Cloudflare Pages, conecta el repositorio con:
   - Framework preset: **None**
   - Build command: **vacío**
   - Build output directory: **`/`**
4. Cloudflare publicará el sitio en `https://la-ruta-del-foton.pages.dev` (o un nombre similar si el subdominio está ocupado).

Los pasos detallados, la solución de problemas y la alternativa con `wrangler` están en [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md).

## Fuentes y rigor

- 21 fuentes institucionales y técnicas en APA 7.
- Sin Wikipedia, sin libros y sin monografías.
- Los enlaces se verificaron en noviembre de 2026.
- El dossier de fuentes, con la relación entre afirmaciones y referencias, está en [`docs/FUENTES.md`](docs/FUENTES.md).
- Los modelos interactivos son **conceptuales**: no son simulaciones numéricas ni mediciones experimentales.

## Pruebas

El registro de pruebas está en [`docs/QA.md`](docs/QA.md). Incluye:

- Apertura con `file://` y con servidor local.
- Laboratorio, calculadora, pestañas, detector, quiz y modo exposición.
- Revisión responsive de 360 a 1920 px sin scroll horizontal.
- Movimiento reducido.
- Revisión de accesibilidad con axe-core (0 violaciones en escritorio y móvil).
- Verificación de los 21 enlaces (todos respondieron 200).
- Generación del PDF de respaldo.

## Tecnología

- HTML5 semántico.
- CSS3 con variables, grid, flexbox y `prefers-reduced-motion`.
- JavaScript puro con scripts clásicos y `defer` (sin módulos ES, para que funcione con `file://`).
- SVG inline para diagramas y animaciones.
- Sin cookies, sin analítica y sin peticiones externas.

## Nota

La página es material educativo. No sustituye la capacitación en seguridad láser ni las normas aplicables. No se debe usar un láser real sin supervisión y protección adecuadas.
