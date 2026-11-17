# Registro de pruebas

**Fecha:** 11 de noviembre de 2026

**Entorno:** Windows, Node.js 22.16, Playwright CLI, Chromium; pruebas con `file://` y con `python -m http.server 4173`.
**Página:** `index.html`

## Resultado general

| Área | Resultado |
|---|---|
| Apertura local (`file://`) | Correcta, sin errores de consola ni peticiones fallidas. |
| Servidor local (`http://127.0.0.1:4173`) | Correcta, sin errores de consola. |
| Laboratorio | Correcto: bombeo, vaciado, inversión, umbral, cavidad, disparo y cascada de fotones. |
| Calculadora | Correcta: UV, visible e infrarrojo; 632.8 nm → 473.8 THz → 3.139 × 10⁻¹⁹ J → 1.959 eV. |
| Pestañas de procesos | Correctas con clic y con teclado; incluye “Repetir animación”. |
| Mini-experimentos de propiedades | Correctos: ancho espectral, fase e interferencia, distancia y diámetro del haz. |
| Actividad de propiedades | Correcta: selección, comprobación global, reintento y explicaciones. |
| Cuestionario | Correcto: 8 preguntas, una por una, pistas, reintento de falladas y resumen. |
| Esquema de He-Ne | Correcto: los cuatro pasos resaltan su parte del diagrama. |
| Modo exposición | Correcto: 9 secciones, temporizador, puntos de salto, texto grande, atajos y foco. |
| Responsive | Sin scroll horizontal de 360 a 1920 px. |
| Movimiento reducido | Animaciones desactivadas; contenido visible. |
| Accesibilidad automática | axe-core: 0 violaciones en 1366 px y 390 px. |
| Enlaces | 21/21 verificados previamente; las URLs no se modificaron. |
| Impresión | Revisada con emulación de impresión; los controles interactivos se ocultan. El PDF de respaldo no se regeneró en esta versión. |

## Pruebas funcionales

### 1. Laboratorio

Acción: bombeo a 70%, vaciado del nivel inferior a 100%, clic en “Alinear cavidad” y clic en “Disparar fotón”.

Resultado:

- N₂ = 63; N₁ = 20; ΔN = 43.
- Ganancia = 39; pérdidas = 26; umbral superado.
- Cavidad alineada; láser encendido.
- Pasos: los cuatro completados.
- Contador de fotones: avanza de 1 a 32.
- Feedback: “¡Láser encendido! Un fotón disparó la emisión estimulada…”.

También se probó:

- [x] Vaciado a 0%: N₁ sube a 100, desaparece la inversión y el láser se apaga.
- [x] Cavidad desalineada con inversión y ganancia: el láser se apaga y aparece la ruta de escape.
- [x] Reinicio: bombeo 0%, vaciado 100%, N₂ = 0, N₁ = 20, cavidad desalineada y láser apagado.
- [x] Predicción “Se pierde”: feedback correcto; el reinicio limpia la predicción.
- [x] El texto del modelo aclara que las escalas son arbitrarias y que no se simulan potencias ni tiempos reales.

### 2. Calculadora

Acción: cambiar la longitud de onda con el control, el campo numérico y los presets.

| λ | Frecuencia | Energía | Región |
|---|---|---|---|
| 254 nm | 1,180 THz | 7.821 × 10⁻¹⁹ J = 4.881 eV | Ultravioleta C |
| 405 nm | 740.2 THz | 4.905 × 10⁻¹⁹ J = 3.061 eV | Violeta visible |
| 632.8 nm | 473.8 THz | 3.139 × 10⁻¹⁹ J = 1.959 eV | Rojo visible |
| 1550 nm | 193.4 THz | 1.282 × 10⁻¹⁹ J = 0.7999 eV | Infrarrojo |

- [x] El marcador del espectro se mueve con la longitud de onda.
- [x] El preset activo se resalta y actualiza el control.
- [x] El diagrama de niveles cambia con la energía y muestra ΔE.
- [x] Un valor vacío o no numérico muestra un mensaje y marca el campo como inválido.
- [x] La sustitución se muestra en “Ver la sustitución”.
- [x] El color y la región cambian con la longitud de onda; el rojo se vuelve más profundo hacia 750 nm.

### 3. Pestañas de los procesos

- [x] Clic en “Absorción”, “Emisión espontánea” y “Emisión estimulada”.
- [x] Flecha derecha desde la primera pestaña selecciona la segunda y muestra su panel.
- [x] Solo un panel está visible a la vez.
- [x] “Repetir animación” reinicia la secuencia y la línea de tiempo.
- [x] Las preguntas de predicción se despliegan sin afectar la animación.

### 4. Mini-experimentos de propiedades

- [x] Ancho espectral de 1 a 60 nm: la banda roja cambia de tamaño.
- [x] Fase de 0° a 180°: las ondas se alinean, se desfasan y quedan en oposición.
- [x] El patrón de interferencia baja su contraste al acercarse a 180°.
- [x] Distancia de 1 a 100 m: el diámetro del haz cambia de 1 a 100 mm y el punto crece en el esquema.

### 5. Actividad de propiedades

- [x] Selección de una propiedad por tarjeta con `aria-pressed`.
- [x] “Comprobar todas” con las seis respuestas correctas → “Aciertos: 6 / 6”.
- [x] Una respuesta incorrecta muestra la propiedad correcta y la explicación.
- [x] “Reintentar fallidas” limpia solo las tarjetas incorrectas.
- [x] El botón de reintento de una tarjeta también funciona.
- [x] “Reiniciar” limpia selecciones, explicaciones y marcador.
- [x] Si faltan tarjetas, la actividad avisa y lleva el foco a la primera pendiente.

### 6. Cuestionario de repaso

- [x] 8 preguntas generadas, una por pregunta y con barra de avance.
- [x] “Ver pista” muestra una pista sin revelar la respuesta.
- [x] Respuesta correcta: feedback con explicación y enlace al apartado.
- [x] Respuesta incorrecta: feedback con la respuesta correcta y enlace al apartado.
- [x] “Siguiente” avanza y anuncia la nueva pregunta en la región `aria-live`.
- [x] “Ver resultados” muestra el resumen con la puntuación.
- [x] “Repasar falladas” vuelve solo a las preguntas incorrectas.
- [x] “Reiniciar” limpia respuestas, pistas y puntuación.

### 7. Esquema de helio-neón

- [x] Los botones 1 a 4 resaltan el grupo correspondiente del SVG.
- [x] El texto del paso activo se marca en rojo.
- [x] “Mostrar todo el esquema” quita el resaltado.
- [x] El estado se anuncia en una región `aria-live`.

### 8. Modo exposición

- [x] Abre con el botón “Presentar” y con la tecla `P`.
- [x] Los 9 puntos permiten saltar a cada sección.
- [x] “Siguiente” y “Anterior” actualizan título, objetivo y barra de progreso.
- [x] El temporizador inicia, se pausa y se reinicia.
- [x] “Texto grande” cambia la escala a 112.5% y se puede desactivar.
- [x] `?` abre la ayuda de atajos; `T` controla el tiempo; `Esc` cierra.
- [x] Al abrir, el foco pasa al botón de cerrar; al cerrar, vuelve al botón “Presentar”.
- [x] “Pantalla completa” solicita `requestFullscreen()` y contempla el error.

## Pruebas técnicas

### Apertura local

Navegación con `file:///C:/codigos/tareas/fisica/index.html`:

- Título correcto y contenido visible.
- Laboratorio: bombeo 70%, vaciado 100%, cavidad alineada y disparo → láser encendido.
- Calculadora: 1.959 eV para 632.8 nm.
- Cuestionario generado y mini-experimentos disponibles.
- `consoleErrors`: `[]`
- `pageErrors`: `[]`
- `failedRequests`: `[]`

### Servidor local

`python -m http.server 4173` y `http://127.0.0.1:4173/`:

- Sin errores de consola.
- Todas las interacciones funcionan igual que con `file://`.

### Responsive

| Ancho | `scrollWidth` | Desbordamiento |
|---|---|---|
| 360 px | 360 | No |
| 390 px | 390 | No |
| 768 px | 768 | No |
| 1024 px | 1024 | No |
| 1366 px | 1366 | No |
| 1920 px | 1920 | No |

El menú superior usa desplazamiento horizontal en móvil y no genera una segunda fila de enlaces.

### Accesibilidad

- axe-core con etiquetas WCAG 2.0/2.1 A y AA: **0 violaciones** a 1366 px y 390 px.
- Un solo `h1`; jerarquía de encabezados revisada.
- `lang="es-MX"`.
- Sin IDs duplicados.
- Sin `aria-controls`, `aria-labelledby`, `aria-describedby`, `label[for]` ni anclas rotas.
- Botones con nombre accesible; sin controles sin etiqueta.
- Tablas con desplazamiento horizontal accesibles por teclado (`tabindex="0"` y `role="region"`).
- El laboratorio anuncia un resumen del estado en una región `aria-live`; el feedback visual queda disponible sin duplicar anuncios.
- La calculadora anuncia el resultado al soltar el control o cambiar el valor, no en cada píxel del deslizador.
- El cuestionario usa `aria-describedby`, `aria-invalid` y una región `aria-live` persistente.

### Movimiento reducido

Con `prefers-reduced-motion: reduce`, la duración de animación calculada es ~`0.00001s`; el contenido y los controles siguen disponibles.

### Impresión

- Emulación de impresión revisada: se ocultan controles del laboratorio, predicciones, mini-experimentos, actividad de propiedades y panel de exposición.
- Las tres pestañas de procesos se muestran como paneles estáticos.
- El PDF de respaldo **no se regeneró** en esta versión; la página sigue siendo la fuente principal.

### Página 404

- `404.html` carga correctamente con estilos inline.
- El botón “Volver al inicio” apunta a `/`, que funciona en Cloudflare Pages.

## Limitaciones conocidas

- El laboratorio es un **modelo conceptual**: no simula potencias, pérdidas, tiempos de vida ni modos reales. La escala de ganancia es arbitraria.
- Los diagramas SVG se reducen en pantallas muy pequeñas; el texto y las explicaciones cubren el contenido.
- La prueba en el proyector físico del salón queda pendiente para el día de la exposición.
- Los nombres del equipo son placeholders hasta que se editen en `#equipo`.
- El PDF de respaldo no se actualizó con los cambios de esta versión.

## Reproducir las pruebas

```bash
# Servidor local
python -m http.server 4173

# Captura de la página
npx playwright screenshot --viewport-size "1440,900" "http://127.0.0.1:4173/" captura.png
```

Las comprobaciones de interacción y accesibilidad se ejecutaron con Playwright fuera de la carpeta del proyecto, para no agregar dependencias al sitio.
