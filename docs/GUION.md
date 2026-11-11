# Guion de exposición — 7 minutos

**Proyecto:** La ruta del fotón — Estudio y aplicación de la emisión láser  
**Formato:** demostración de la página + explicación del aporte del equipo.

## Antes de entrar

- Abre `index.html` con doble clic en Chrome o Edge.
- Presiona `F11` para pantalla completa.
- Pulsa **Presentar** y prueba que avancen las 9 paradas con las flechas.
- Abre `docs/la-ruta-del-foton.pdf` en otra ventana, como respaldo.
- Silencia notificaciones y revisa que la laptop esté conectada.
- Ten el guion impreso o en el teléfono; no dependas de la memoria.

## Reparto sugerido

| Rol | Quién | Qué presenta |
|---|---|---|
| 1 | Coordinación | Portada, definición, cierre y aporte del equipo. |
| 2 | Fundamentos | Procesos luz-materia, He-Ne y cálculo de energía. |
| 3 | Desarrollo | Laboratorio interactivo, calculadora y quiz. |
| 4 | Aplicaciones y fuentes | Propiedades, aplicaciones, seguridad y referencias. |

Todos deben poder responder al menos una pregunta del jurado. Si alguien no puede asistir, avisen al maestro con anticipación.

## Guion

### 0:00–0:35 · Portada (Rol 1)

**Di:**  
“¿Qué tienen en común el lector del supermercado, la fibra que nos da internet y el sensor de un auto? Los tres usan luz láser. En esta página vamos a seguir la ruta de un fotón para entender qué hace especial a esa luz y cómo se usa en tecnología real.”

**Haz:**  
Muestra la portada y el mapa de las 7 estaciones. No avances todavía.

**Transición:**  
“Empecemos por lo básico: ¿qué es un láser?”

### 0:35–1:20 · ¿Qué es un láser? (Rol 1)

**Di:**  
“Láser significa *Light Amplification by Stimulated Emission of Radiation*: amplificación de luz por emisión estimulada de radiación. No es una lámpara más brillante: es luz organizada. Un foco emite muchas longitudes de onda, en todas direcciones y con fases desordenadas. Un láser emite una banda estrecha, en una dirección preferente y con coherencia.”

**Haz:**  
Señala el comparador de foco y láser. Menciona el mito: no todo láser es rojo ni visible; el CO₂ emite en infrarrojo.

**Transición:**  
“Para entender cómo se organiza esa luz, veamos qué pasa entre un fotón y un átomo.”

### 1:20–2:25 · Los tres procesos (Rol 2)

**Di:**  
“Hay tres procesos. En la absorción, el átomo recibe un fotón, sube de nivel y el fotón desaparece. En la emisión espontánea, el átomo se relaja solo y emite un fotón en una dirección aleatoria; eso pasa en un LED. En la emisión estimulada, un fotón provoca que un átomo excitado emita un segundo fotón idéntico: misma frecuencia, misma fase y misma dirección. Ese es el efecto multiplicador del láser.”

**Haz:**  
Cambia entre las tres pestañas. En emisión estimulada, señala los dos fotones que salen juntos y di: “el fotón incidente no se pierde: se suma un clon”.

**Transición:**  
“Pero para que ese efecto gane, hacen falta tres ingredientes y una condición.”

### 2:25–3:45 · La receta y el laboratorio (Rol 3)

**Di:**  
“Un láser necesita un medio activo, una fuente de bombeo, una inversión de población y una cavidad óptica. La inversión significa que hay más átomos en el nivel superior que en el inferior. La cavidad son dos espejos: uno refleja casi todo y el otro es parcialmente reflectante. La ganancia debe superar las pérdidas: eso es el umbral.”

**Haz:**  
Sube el bombeo a 70%, alinea la cavidad y dispara un fotón. Muestra el cambio de estados y el haz.

**Pregunta al público:**  
“¿Qué pasa si dejo el bombeo bajo? ¿Y si desalineo el espejo?”

**Respuesta breve:**  
“Sin inversión, gana la emisión espontánea; sin cavidad, los fotones escapan y no hay amplificación. El láser no enciende por arte: necesita las dos condiciones y un fotón semilla.”

**Transición:**  
“Ya tenemos luz amplificada. ¿Qué la hace distinta de otras fuentes?”

### 3:45–4:25 · Propiedades (Rol 4)

**Di:**  
“La luz láser se describe con tres propiedades. Monocromaticidad: una banda muy estrecha de longitudes de onda; no es perfecta, es cuasi-monocromática. Coherencia: las ondas mantienen una fase estable, en el espacio y en el tiempo. Direccionalidad: el haz se dispersa poco y se puede enfocar en un punto muy pequeño.”

**Haz:**  
Señala las tres tarjetas y la tabla de aplicación. Aclara que no son propiedades absolutas: los láseres reales son “casi” monocromáticos y “muy” direccionales, no perfectos.

**Transición:**  
“Un ejemplo real y muy didáctico es el láser de helio-neón.”

### 4:25–5:20 · He-Ne y el cálculo (Rol 2)

**Di:**  
“En el He-Ne, la descarga eléctrica excita el helio a un estado metaestable de unos 20.61 eV. El helio transfiere esa energía al neón, que queda en un nivel cercano a 20.66 eV. La transición del neón produce fotones de 632.8 nm; el nivel inferior se vacía rápido y la inversión se mantiene. Los espejos amplifican la luz y el espejo parcial deja salir el haz rojo.”

**Haz:**  
Recorre el esquema de niveles. Luego muestra el cálculo:

- `λ = 632.8 nm = 6.328 × 10⁻⁷ m`
- `f = c/λ = 4.74 × 10¹⁴ Hz`
- `E = hf = 3.14 × 10⁻¹⁹ J`
- `E = 1.96 eV`

**Aclara:**  
“Es la energía de un solo fotón; no es una medición experimental. Usamos el valor nominal de 632.8 nm y redondeamos.”

**Transición:**  
“Esa energía y esas propiedades son las que hacen posibles las aplicaciones.”

### 5:20–5:55 · Aplicaciones (Rol 4)

**Di:**  
“En fibra óptica, la direccionalidad permite acoplar y guiar la luz; la coherencia ayuda en sistemas coherentes. En almacenamiento, la longitud de onda corta permite un punto más pequeño: CD 780 nm, DVD 650 nm y Blu-ray 405 nm. En impresión, el láser expone un tambor; el tóner hace la imagen. En LiDAR, un pulso viaja, rebota y vuelve; el tiempo de vuelo da la distancia. En sensores, la coherencia permite interferencia estable.”

**Haz:**  
Elige dos tarjetas del detector y pregunta la propiedad principal antes de revelarla. No respondas todas: el tiempo es corto.

**Transición:**  
“Y como toda tecnología poderosa, hay que usarla con cuidado.”

### 5:55–6:30 · Seguridad y cierre (Rol 4)

**Di:**  
“La clase de riesgo depende del producto y del uso, no solo de la potencia. Nunca se mira el haz directo o reflejado. No se usan gafas de sol: se usan gafas específicas para la longitud de onda. No se abren lectores de CD/DVD ni impresoras: el producto puede ser Clase 1, pero el interior no. Un puntero láser no es un juguete.”

**Cierre:**  
“La emisión láser no es magia: es luz organizada por emisión estimulada, inversión de población y una cavidad. Esa física está detrás de la fibra, el almacenamiento, la impresión, los sensores y la medicina.”

### 6:30–7:00 · Aporte del equipo (Rol 1)

**Di:**  
“Nuestro aporte es el laboratorio virtual guiado. No solo mostramos el resultado: obligamos al usuario a subir el bombeo, alinear la cavidad y disparar un fotón, y a ver qué condición falta. Así, la inversión de población y la cavidad dejan de ser definiciones y se vuelven una cadena de decisiones y consecuencias. Lo acompañamos con la calculadora de fotones, el detector de propiedades y el quiz.”

**Haz:**  
Muestra el laboratorio o el panel de aporte. Termina con la frase:

> “La página enseña el tema y, al mismo tiempo, deja claro por qué un Ingeniero en Sistemas debería entenderlo.”

## Preguntas probable del jurado

1. **¿Por qué el haz del He-Ne es rojo?**  
   Porque la diferencia de energía entre los niveles del neón corresponde a 632.8 nm, en la región roja del espectro.

2. **¿Por qué no usar un LED?**  
   Un LED emite por emisión espontánea: luz incoherente, con muchas direcciones y una banda más ancha. El láser usa emisión estimulada y una cavidad.

3. **¿El haz se ve en el aire?**  
   En aire limpio, normalmente no se ve el haz; se ve el punto en una superficie o la dispersión en polvo o humo.

4. **¿Una impresora láser es peligrosa?**  
   El producto completo suele ser Clase 1; el láser está encerrado. No se debe abrir para mirar el interior.

5. **¿Qué significa coherencia?**  
   Que las ondas mantienen una relación de fase estable. Eso permite interferencia y enfoque; no significa que todo láser sea perfectamente coherente.

6. **¿Por qué se necesita inversión de población?**  
   Para que la emisión estimulada supere a la absorción. Sin inversión, el medio absorbe más de lo que amplifica.

7. **¿Qué pasa si quito un espejo?**  
   Se pierde la retroalimentación de la cavidad; los fotones escapan y no hay amplificación sostenida.

8. **¿La simulación es real?**  
   No. Es un modelo conceptual para razonar la cadena causal; no reproduce potencias, pérdidas ni tiempos de un láser real.

9. **¿De dónde sacaron las fuentes?**  
   De organismos institucionales y técnicos: FDA, OSHA, NASA, NOAA, HyperPhysics, RP Photonics, SPIE, Thorlabs, FOA y Xerox. Están en APA 7 al final de la página y en `docs/FUENTES.md`.

10. **¿Cuál es el aporte del equipo?**  
    El laboratorio virtual guiado y el modo exposición: convierten conceptos abstractos en decisiones con consecuencias y permiten demostrar la página en vivo.

## Plan B

- **Falla el cañón:** usa el PDF de respaldo o la pantalla de la laptop.
- **Falla Internet:** la página funciona desde la carpeta local; no necesita red.
- **Falla JavaScript:** muestra el PDF y explica con las secciones estáticas; el contenido principal sigue visible.
- **Se acaba el tiempo:** salta una aplicación y el quiz; nunca omitas el laboratorio ni el cierre.

## Checklist de 5 minutos antes

- [ ] Página abierta y probada.
- [ ] `F11` y botón **Presentar** funcionando.
- [ ] Laboratorio probado con bombeo, cavidad y disparo.
- [ ] PDF de respaldo abierto.
- [ ] Notificaciones silenciadas.
- [ ] Cargador conectado.
- [ ] Guion a la mano.
- [ ] Cada integrante sabe qué parte le toca.
