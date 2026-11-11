# Despliegue en GitHub y Cloudflare Pages

La página es un sitio estático: no necesita build, servidor, base de datos ni variables de entorno. `index.html` debe quedar en la raíz del repositorio y todos los recursos usan rutas relativas.

## 1. Antes de publicar

- [ ] Reemplaza los 4 placeholders `[Integrante N]` en `index.html`, sección `#equipo`.
- [ ] Revisa que los roles y las descripciones correspondan al trabajo real.
- [ ] Abre `index.html` con doble clic y prueba el laboratorio, la calculadora, el quiz y el modo exposición.
- [ ] Genera el PDF de respaldo (ver al final).
- [ ] Decide si el repositorio será público o privado. Cloudflare Pages puede conectarse a ambos; el sitio publicado será público.

## 2. Crear el repositorio en GitHub

1. Entra a [github.com](https://github.com) y crea un repositorio nuevo.
2. Nombre sugerido: `la-ruta-del-foton`.
3. No agregues README, `.gitignore` ni licencia desde GitHub: ya están en esta carpeta.
4. Copia la URL del repositorio, por ejemplo:

```text
https://github.com/TU-USUARIO/la-ruta-del-foton.git
```

## 3. Subir los archivos

### Opción A: GitHub Desktop

1. Abre GitHub Desktop.
2. **File → Add local repository** y selecciona esta carpeta.
3. Si no es un repositorio, acepta **create a repository**.
4. Escribe un mensaje de commit, por ejemplo `Página La ruta del fotón`.
5. Pulsa **Commit to main** y luego **Publish repository**.
6. Si quieres que sea privado, marca la casilla correspondiente.

### Opción B: Git desde la terminal

Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Página La ruta del fotón"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/la-ruta-del-foton.git
git push -u origin main
```

Si Git pide autenticación, usa GitHub Desktop o un token personal. No guardes tokens dentro del proyecto.

## 4. Publicar en Cloudflare Pages

1. Entra a [dash.cloudflare.com](https://dash.cloudflare.com) y crea una cuenta gratuita si no tienes.
2. En el menú, abre **Workers & Pages**.
3. Pulsa **Create** → **Pages** → **Connect to Git**.
4. Autoriza a Cloudflare para acceder a GitHub si es la primera vez.
5. Selecciona el repositorio `la-ruta-del-foton`.
6. Configura el proyecto:

| Campo | Valor |
|---|---|
| Project name | `la-ruta-del-foton` |
| Production branch | `main` |
| Framework preset | **None** |
| Build command | **Vacío** |
| Build output directory | **`/`** |
| Root directory | **`/`** (o vacío, según la interfaz) |

7. Pulsa **Save and Deploy**.
8. Espera el primer despliegue. Cloudflare mostrará una URL parecida a:

```text
https://la-ruta-del-foton.pages.dev
```

Si el subdominio ya está ocupado, Cloudflare agregará un sufijo. Puedes cambiar el nombre del proyecto para obtener otro subdominio.

## 5. Probar la URL publicada

- [ ] Abre la URL en una ventana de incógnito.
- [ ] Revisa que carguen `css/styles.css`, `js/*.js` y `assets/favicon.svg`.
- [ ] Prueba el laboratorio, la calculadora, el quiz y el modo exposición.
- [ ] Revisa la consola del navegador: no debe haber errores 404.
- [ ] Abre la URL en el teléfono y comprueba que no haya scroll horizontal.
- [ ] Comparte la URL con el equipo y con el maestro.

## 6. Actualizar la página

Cada vez que hagas `push` a la rama `main`, Cloudflare Pages volverá a desplegar automáticamente.

```bash
git add .
git commit -m "Ajustes de contenido"
git push
```

Si no ves los cambios, recarga con `Ctrl + F5` o abre una ventana de incógnito.

## 7. Problemas comunes

### La página carga sin estilos

- Revisa que `css/styles.css` exista y que la ruta sea `./css/styles.css`.
- En GitHub, confirma que la carpeta se llama `css` (minúsculas) y que el archivo está dentro.
- Cloudflare/Linux distingue mayúsculas de minúsculas: `CSS/` no es lo mismo que `css/`.

### La página carga, pero los botones no hacen nada

- Abre la consola del navegador.
- Verifica que `js/main.js`, `js/laser-lab.js`, `js/photon-calculator.js`, `js/detector.js` y `js/quiz.js` estén en la carpeta `js/`.
- Confirma que no bloqueaste JavaScript.
- La página no usa módulos ES; los scripts deben cargarse con `defer` en el orden actual.

### Cloudflare muestra “Build failed”

- Framework preset: **None**.
- Build command: **vacío**.
- Build output directory: **`/`**.
- El repositorio no necesita `package.json` ni `npm install`.

### El repositorio es privado y Cloudflare no lo ve

- Vuelve a autorizar la GitHub App de Cloudflare.
- Selecciona el repositorio en la lista de acceso.
- Puedes hacer el repositorio público si el maestro necesita revisar el código.

### El subdominio `la-ruta-del-foton.pages.dev` está ocupado

- Cambia el nombre del proyecto en Cloudflare, por ejemplo `la-ruta-del-foton-fisica`.
- La URL cambiará; actualízala en el README y en el guion si la compartes.

### Quiero un dominio propio

- Es opcional. Cloudflare Pages permite agregar un dominio personalizado.
- Para la actividad no es necesario: el dominio `*.pages.dev` es suficiente.

## 8. Alternativa con Wrangler

Si tienes Node.js y prefieres la terminal:

```bash
npx wrangler pages deploy . --project-name la-ruta-del-foton
```

Wrangler pedirá iniciar sesión en Cloudflare. No guardes credenciales en el repositorio.

## 9. PDF de respaldo

Para generar el PDF desde el navegador:

1. Abre `index.html`.
2. Pulsa `Ctrl + P`.
3. Destino: **Guardar como PDF**.
4. Márgenes: predeterminados; activa **Gráficos de fondo**.
5. Guarda como `docs/la-ruta-del-foton.pdf`.

El PDF no sustituye la página, pero sirve si el proyector o el navegador fallan el día de la exposición.

## 10. Checklist final

- [ ] Nombres reales en `#equipo`.
- [ ] Página probada sin Internet.
- [ ] URL de Cloudflare probada en incógnito.
- [ ] PDF de respaldo generado.
- [ ] Guion de exposición revisado.
- [ ] Cada integrante sabe qué parte presentar.
- [ ] Enlaces de referencias abren correctamente.
- [ ] No hay errores en la consola.
