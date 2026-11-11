# Registro de pruebas

**Fecha:** 10 de noviembre de 2026  
**Entorno:** Windows, Node.js 22.16, Playwright 1.65, Chromium; pruebas con `file://` y con `python -m http.server 4173`.  
**Página:** `index.html`

## Resultado general

| Área | Resultado |
|---|---|
| Apertura local (`file://`) | Correcta, sin errores de consola ni peticiones fallidas. |
| Servidor local (`http://127.0.0.1:4173`) | Correcta, sin errores de consola. |
| Laboratorio | Correcto: bombeo, inversión, cavidad, disparo y estados. |
| Calculadora | Correcta: 632.8 nm → 473.8 THz → 3.139 × 10⁻¹⁹ J → 1.959 eV. |
| Pestañas de procesos | Correctas con clic y con teclado (flechas). |
| Detector de propiedades | Correcto: aciertos, errores, explicación y reinicio. |
| Quiz | Correcto: 5/5 con respuestas correctas y retroalimentación. |
| Modo exposición | Correcto: abrir, avanzar, retroceder y cerrar. |
| Responsive | Sin scroll horizontal de 360 a 1920 px. |
| Movimiento reducido | Animaciones desactivadas; contenido visible. |
| Accesibilidad automática | axe-core: 0 violaciones en 1440 px y 390 px. |
| Enlaces | 21/21 respondieron HTTP 200. |
| Impresión / PDF | PDF generado; diseño de laboratorio y referencias revisado. |

## Pruebas funcionales

### 1. Laboratorio

Acción: bombeo a 70%, clic en “Alinear cavidad”, clic en “Disparar fotón”.

Resultado:

- Inversión: sí.
- Cavidad: alineada.
- Láser: encendido.
- Misiones: las tres completadas.
- Feedback: “¡Láser encendido! Un fotón disparó la emisión estimulada…”.

También se probó:

- [x] Bombeo bajo: no hay inversión y el láser no enciende.
- [x] Cavidad desalineada: hay inversión, pero no hay haz.
- [x] Reinicio: vuelve a 0%, cavidad desalineada y láser apagado.

### 2. Calculadora

Acción: cambiar la longitud de onda y leer los resultados.

| λ | Frecuencia | Energía | Región |
|---|---|---|---|
| 632.8 nm | 473.8 THz | 3.139 × 10⁻¹⁹ J = 1.959 eV | Rojo visible |
| 405 nm | 740.2 THz | 4.905 × 10⁻¹⁹ J = 3.061 eV | Violeta visible |
| 1550 nm | 193.4 THz | 1.282 × 10⁻¹⁹ J = 0.7999 eV | Infrarrojo |

- [x] La sustitución se muestra en “Ver la sustitución”.
- [x] El color y la región cambian con la longitud de onda.
- [x] Los presets actualizan el control y el resultado.

### 3. Pestañas de los procesos

- [x] Clic en “Absorción”, “Emisión espontánea” y “Emisión estimulada”.
- [x] Flecha derecha desde la primera pestaña selecciona la segunda y muestra su panel.
- [x] Solo un panel está visible a la vez.
- [x] Las animaciones se reinician al cambiar de pestaña.

### 4. Detector de propiedades

- [x] Respuesta correcta en “Fibra óptica” → feedback correcto y marcador “Aciertos: 1 / 6”.
- [x] Respuesta incorrecta en “Almacenamiento óptico” → feedback con la respuesta correcta.
- [x] “Reiniciar detector” limpia tarjetas, botones y marcador.

### 5. Quiz

- [x] 5 preguntas generadas con opciones y feedback.
- [x] Respuestas correctas: “Obtuviste 5 de 5…”.
- [x] Preguntas sin responder: se marcan y el resumen indica cuántas faltan.
- [x] “Reiniciar” vuelve a mostrar el quiz limpio.

### 6. Modo exposición

- [x] Abre con el botón “Presentar”.
- [x] “Siguiente” pasa de “Parada 1 de 9” a “Parada 2 de 9”.
- [x] El enlace “Ir a la sección” apunta al `id` correcto.
- [x] “Anterior” y “Cerrar” funcionan.
- [x] `Esc` cierra el panel; las flechas navegan cuando está abierto.
- [x] El botón de pantalla completa solicita `requestFullscreen()` y contempla el error.

## Pruebas técnicas

### Apertura local

Script de Playwright sobre `file:///C:/codigos/tareas/fisica/index.html`:

- `consoleErrors`: `[]`
- `pageErrors`: `[]`
- `failedRequests`: `[]`
- Título correcto, `h1` presente, pestañas, laboratorio, calculadora, detector, quiz y presentador funcionando.

### Responsive

| Ancho | `scrollWidth` | Desbordamiento |
|---|---|---|
| 360 px | 360 | No |
| 390 px | 390 | No |
| 768 px | 768 | No |
| 1024 px | 1024 | No |
| 1366 px | 1366 | No |
| 1920 px | 1920 | No |

### Accesibilidad

- axe-core con etiquetas WCAG 2.0/2.1 A y AA: **0 violaciones** a 1440 px y 390 px.
- Un solo `h1` y jerarquía de encabezados.
- `lang="es-MX"`.
- Sin IDs duplicados.
- Sin `aria-controls`, `aria-labelledby`, `label[for]` ni anclas rotas.
- Tablas con desplazamiento horizontal accesibles por teclado (`tabindex="0"` y `role="region"`).
- Enlaces de referencias subrayados para no depender solo del color.
- Botones primarios con contraste suficiente para texto blanco.

### Enlaces

21 referencias verificadas con `GET` y redirecciones seguidas: **todas respondieron 200**.

### Movimiento reducido

Con `prefers-reduced-motion: reduce`, la duración de animación calculada es ~`0.00001s`; el contenido y los controles siguen disponibles.

### Impresión / PDF

- PDF generado en A4 con `printBackground: true`.
- Se revisaron capturas del diseño de impresión de `#receta` y `#referencias`.
- El laboratorio ocupa el ancho de la página en impresión.
- Las URLs de las referencias no se duplican.

### Página 404

- `404.html` carga correctamente con estilos inline en el servidor local.
- El botón “Volver al inicio” apunta a `/`, que funciona en Cloudflare Pages.

## Limitaciones conocidas

- El laboratorio es un **modelo conceptual**: no simula potencias, pérdidas, tiempos de vida ni modos reales.
- Los diagramas SVG se reducen en pantallas muy pequeñas; el texto y las explicaciones cubren el contenido.
- La prueba en el proyector físico del salón y con el equipo real queda pendiente para el día de la exposición.
- Los nombres del equipo son placeholders hasta que se editen en `#equipo`.

## Reproducir las pruebas

```bash
# Servidor local
python -m http.server 4173

# Captura de la página
npx playwright screenshot --viewport-size "1440,900" "http://127.0.0.1:4173/" captura.png

# PDF de respaldo
npx playwright pdf --format A4 "http://127.0.0.1:4173/" respaldo.pdf
```

Los scripts de comprobación usados durante el desarrollo se ejecutaron fuera de la carpeta del proyecto, para no agregar dependencias al sitio.
