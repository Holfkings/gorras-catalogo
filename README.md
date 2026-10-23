# Noche & Co. — Catálogo de Gorras

Base responsive lista para que el cliente aporte las fotos reales de sus gorras.
El diseño usa una paleta cálida y armónica (base oscura `#18140f`, acento terracota `#e07b39`, verde oliva `#6f8f71`), animaciones con "profundidad" (capas de fondo que flotan, tarjetas que sobresalen al pasar el ratón, sombras profundas) y un HTML/CSS/JS limpio, **sin tocar** las imágenes de la marca más allá del swap de `src`.

## Cómo verlo sin instalar nada

Desde la carpeta raíz:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

> Sin un servidor estático el `fetch`/modulo no se comporta igual; este es un sitio plano (HTML + CSS + JS), así que `http.server` es suficiente.

## Añadir las fotos del cliente

El catálogo viene con un **placeholder simbólico** (un SVG de gorra con el texto "Foto en camino"). Cuando lleguen las fotos:

1. Guarda cada foto en `img/<id>.jpg` (o `.webp` si se genera la versión WebP).
2. En `js/main.js` cambia `data-src="img/g01.jpg"` a la ruta real, y en el HTML el `src` del `<img>` (guarda la misma estructura `.card__img--load` para que el placeholder se eleve al cargar la foto).
3. La estructura del HTML/CSS/JS **no se toca**: solo el `src`. El pipeline `srcset`/WebP/lazy-loading se deja preparado en `css/styles.css` para cuando se añada.

Ejemplo de estructura:

```html
<div class="card__img-wrap">
  <div class="card__placeholder">SVG de gorra + "Foto en camino"</div>
  <img class="card__img" data-src="img/g01.jpg" alt="Gorra Ventedana" loading="lazy" />
</div>
```

Cuando la imagen cargue, la clase `card__img--load` se añade por JS y el placeholder se desvanece.

## Estado de la base

| Archivo | Estado |
|---|---|
| `index.html` | ✅ burla / estructura lista |
| `css/styles.css` | ✅ paleta, animaciones con profundidad, responsive |
| `js/main.js` | ✅ catálogo, filtros, reveal, menú móvil |
| `img/` | 📁 no existe aún (se crea al subir fotos) |

## Rutas clave

- Hero: `#inicio` (capas profundas animadas, baño de luz terracota)
- Catálogo: `#catalogo` (grid responsive + filtros por categoría)
- Contacto: `#contacto` (formulario + métricas)

## Buenas prácticas aplicadas

- `prefers-reduced-motion` no está explícito aquí; se recomienda añadir dentro de la siguiente tarea si se quiere.
- TODO los textos alternativos (`alt`) de las imágenes están listos para completar con la descripción real.
- Los colores están en `:root` para cambiarlos en un solo lugar si el cliente ajusta la marca.
