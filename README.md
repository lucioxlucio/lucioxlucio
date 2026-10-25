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

### Cómo conectar tus videos e imágenes (si no los ves en la web)

Subir los archivos a `media/` **no alcanza**: cada proyecto tiene que decir qué archivo usa, en su campo `m` de `data/projects.json`. Mientras `m` sea `null`, se muestra un recuadro vacío.

Dos formas:

1. **Automática (recomendada):** pon los archivos en `media/<categoria>/<proyecto>/` y corre en tu computadora, desde la carpeta del proyecto:
   `python3 tools/generar-media.py` (Mac) o `python tools/generar-media.py` (Windows).
   El script completa el campo `m` de todos los proyectos y te avisa de errores (carpetas con nombre mal escrito, mayúsculas o espacios). Luego sube `data/projects.json` a GitHub.
   - 1 video → video (una imagen llamada `poster.jpg` es la portada).
   - 1 imagen → imagen. Varias imágenes → slider horizontal en orden alfabético (`01.jpg`, `02.jpg`…).
   - Imágenes cuyo nombre empieza con `scroll` (`scroll-01.jpg`…) → se apilan en una sola columna con scroll.
2. **Manual:** edita `m` a mano en `data/projects.json` (ver formatos abajo).

Los nombres de carpeta son el nombre del proyecto en minúsculas, sin tildes y con guiones (`Universal Hotel Supply` → `universal-hotel-supply`).
GitHub Pages distingue mayúsculas: `Video.MP4` no es lo mismo que `video.mp4`. Usa minúsculas y sin espacios.
Después de subir cambios espera uno o dos minutos y recarga con Ctrl+Shift+R.

### Imágenes más grandes que el recuadro

El recuadro de cada proyecto funciona como máscara y la imagen se desplaza adentro (desktop y mobile):
- Imagen **alta** (por ejemplo una landing page): llena el ancho del recuadro y se desplaza hacia abajo.
- Imagen **ancha** (por ejemplo una ilustración muy larga): llena el alto y se desplaza hacia los costados. En desktop, la rueda del mouse también la mueve.
- Imagen de proporción parecida al recuadro (16:9): lo llena sin scroll.
Si quieres forzar el comportamiento, agrega `"fit": "y"`, `"x"` o `"c"` en `m`.

Formatos de `m`:

```json
{ "type": "video",  "src": "media/…/video.mp4", "poster": "media/…/poster.jpg" }
{ "type": "image",  "src": "media/…/01.jpg" }          // varias apiladas: "src": ["media/…/a.jpg", "media/…/b.jpg"]
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
