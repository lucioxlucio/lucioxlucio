# Portfolio · Lucio Calocero

Sitio estático (HTML + CSS + JavaScript, sin build ni dependencias que instalar).
Funciona en cualquier hosting estático: GitHub Pages, Netlify, Vercel, Cloudflare Pages.

## Estructura

```
index.html            Estructura de la página y SEO
css/style.css         Todo el diseño (desktop y mobile)
js/app.js             Navegación, idiomas, proyectos, menú mobile, formulario
js/scene.js           Cabeza 3D y objetos 3D (three.js)
data/projects.json    ← Categorías y proyectos (lo que más vas a editar)
data/i18n.json        ← Textos de la interfaz y de "Sobre mí" (ES / EN)
assets/               Video de la home, retrato, modelos .glb
media/                ← Videos e imágenes de cada proyecto (una carpeta por proyecto)
favicon.svg
```

## Probarlo en tu computadora

No se puede abrir `index.html` con doble clic (el navegador bloquea la carga de datos).
Desde la carpeta del proyecto:

```
python3 -m http.server 8000
```

y abre http://localhost:8000

## Agregar o editar un proyecto

Todo está en `data/projects.json`. Cada proyecto es un bloque así:

```json
{
  "n": "Branca",
  "d": ["Texto en español.\nSegunda línea.", "Text in English.\nSecond line."],
  "l": [{ "t": "www.wearecoco.studio", "u": "https://www.wearecoco.studio" }],
  "tools": ["figma", "adobe", "magnific"],
  "m": { "type": "video", "src": "media/motion-graphics/branca/video.mp4", "poster": "media/motion-graphics/branca/poster.jpg" }
}
```

- `n`: nombre. Si cambia según el idioma: `["Afiches", "Posters"]`.
- `d`: descripción `[español, inglés]`. `\n` es un salto de línea. Para un enlace dentro del texto: `[[@usuario|https://instagram.com/usuario]]`.
- `l`: enlaces que se muestran al final de la descripción.
- `tools`: `figma`, `adobe`, `blender`, `magnific`. Vacío `[]` para no mostrar ninguno.
- `m`: el video, la imagen o el slider del proyecto. Con `null` se muestra un recuadro vacío.

Formatos de `m`:

```json
{ "type": "video",  "src": "media/…/video.mp4", "poster": "media/…/poster.jpg" }
{ "type": "image",  "src": "media/…/01.jpg" }
{ "type": "slider", "dir": "h", "slides": ["media/…/01.jpg", "media/…/02.jpg"] }   // "h" horizontal, "v" vertical
```

Para agregar un proyecto, copia un bloque dentro de la categoría. Para sacarlo, borra el bloque.
El orden del archivo es el orden en pantalla. Cada categoría tiene un `id` (se usa en los enlaces).

Los enlaces directos tienen esta forma: `#proyectos.motion-graphics.branca` (categoría y nombre en minúsculas, sin tildes ni espacios).

## Videos e imágenes

Hay una carpeta por proyecto dentro de `media/` (`media/<categoria>/<proyecto>/`).
Recomendación: videos MP4 (H.264) sin audio, de hasta 1600 px de ancho y pocos MB; imágenes en JPG o WebP de hasta 2000 px.
Para el recuadro de proyecto la proporción es 16:9.

## Textos de la interfaz y de "Sobre mí"

Están en `data/i18n.json` (bloque `es` y bloque `en`). Las claves `a1`…`a7` son los párrafos de Sobre mí, `o1`…`o4` las frases de los objetos 3D.

## Formulario de contacto

Envía a un Google Apps Script. La URL está en `js/app.js` (variable `FORM_ENDPOINT`).
Si cambias el script y creas una nueva implementación, la URL cambia y hay que actualizarla ahí.
Probarlo recién cuando el sitio esté publicado: escribe un mensaje y revisa tu Gmail (y spam).

## Modelos 3D

Archivos `.glb` en `assets/models/` (`cabeza`, `flor`, `jorginho`, `panchaso`, `reno12`). Para reemplazar uno, mantén el nombre.
Se recomienda que cada modelo pese menos de 1 MB. three.js se carga desde un CDN (jsdelivr, versión fija); si el CDN no responde, la web sigue funcionando y el botón de contacto aparece como texto.

## Publicar

1. Sube esta carpeta a un repositorio de GitHub.
2. Conéctalo a un hosting estático (GitHub Pages, Netlify, Vercel o Cloudflare Pages). No hay comando de build: la carpeta raíz es el sitio.
3. Conecta tu dominio desde el panel del hosting.

Para crear nuevas versiones del portfolio, en GitHub puedes marcar el repositorio como plantilla (Settings → "Template repository") y crear copias con "Use this template".

## Pendiente antes de lanzar

- Cargar `m` y `tools` de cada proyecto.
- Agregar `assets/img/og.jpg` (1200×630) y descomentar la línea `og:image` de `index.html` para la vista previa al compartir.
- Probar en celular real y en varios navegadores; revisar velocidad con PageSpeed Insights.
