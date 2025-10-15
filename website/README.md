# Helium Fly ParanoizeX - Sitio Web Oficial

## 🌟 Descripción

Sitio web personal de Helium Fly ParanoizeX, Arquitecto de Realidades Digitales y creador de ARTUETR5D (Arte de Universo Expansivo en Tiempo Real - Quinta Dimensión).

## 📁 Estructura del Proyecto

```
website/
├── index.html                 # Página principal
├── assets/
│   ├── images/               # Imágenes, logos y portadas
│   ├── videos/               # Videos (opcional, se usan enlaces externos)
│   └── docs/                 # PDFs y documentos descargables
├── _posts/                   # Entradas del blog (para Jekyll)
├── _config.yml              # Configuración de Jekyll (a crear)
└── README.md                # Este archivo
```

## 🚀 Características Implementadas

### ✅ Completadas

- [x] Diseño responsivo y moderno con efectos futuristas
- [x] Integración de reproductores de Spotify (artista, podcast, playlist)
- [x] Integración de reproductores de YouTube
- [x] Enlaces a TikTok
- [x] Sección destacada de ARTUETR5D con video y documentación
- [x] Galería de proyectos y manifiestos (CARSS, LVU, EIDOLONS, etc.)
- [x] Sección de libros con portadas y enlaces a Amazon
- [x] Enlaces a todas las redes sociales
- [x] Efectos visuales: glitch, scan-line, grid overlay, glassmorphism
- [x] Animaciones de scroll reveal
- [x] Logo oficial integrado en el header

### 🔄 Próximas Mejoras

- [ ] Configuración de Jekyll para el blog
- [ ] Sistema de comentarios en el blog
- [ ] Galería de imágenes interactiva
- [ ] Formulario de contacto funcional
- [ ] Modo oscuro/claro (toggle)
- [ ] Menú hamburguesa para móviles
- [ ] Carga de videos locales (actualmente se usan embeds de YouTube)

## 📝 Cómo Configurar el Blog con Jekyll

### Paso 1: Crear el archivo `_config.yml`

Crea un archivo `_config.yml` en la raíz del proyecto con el siguiente contenido:

```yaml
# Configuración del sitio
title: Helium Fly ParanoizeX
description: Arquitecto de Realidades Digitales | ARTUETR5D
author: Jesús Javier Hernández Chávez
email: tu-email@ejemplo.com
url: "https://heliumflyparanoizex.github.io"
baseurl: ""

# Configuración de Jekyll
markdown: kramdown
theme: minima
plugins:
  - jekyll-feed
  - jekyll-seo-tag

# Configuración del blog
permalink: /blog/:year/:month/:day/:title/
paginate: 10
paginate_path: "/blog/page:num/"

# Configuración de colecciones
collections:
  posts:
    output: true
    permalink: /blog/:year/:month/:day/:title/

# Excluir archivos
exclude:
  - README.md
  - Gemfile
  - Gemfile.lock
```

### Paso 2: Crear entradas de blog

Las entradas de blog se crean en la carpeta `_posts/` con el formato:

```
YYYY-MM-DD-titulo-del-post.md
```

Ejemplo: `2025-10-14-protocolo-de-creacion-1.md`

Contenido de ejemplo:

```markdown
---
layout: post
title: "Protocolo de Creación 1: El Nacimiento de ARTUETR5D"
date: 2025-10-14 12:00:00 -0600
categories: [tecnología, artuetr5d]
tags: [realidad-sostenida, hologramas, innovación]
author: Helium Fly ParanoizeX
---

La historia detrás de la tecnología que permite tocar hologramas...

## El Inicio

Todo comenzó con una pregunta simple pero profunda: ¿Y si pudiéramos tocar la luz?

## El Desarrollo

[Continúa tu historia aquí...]

## Conclusión

La manifestación de ARTUETR5D es solo el comienzo...
```

### Paso 3: Habilitar Jekyll en GitHub Pages

1. Ve a la configuración de tu repositorio en GitHub
2. Navega a **Settings** > **Pages**
3. En **Build and deployment**, selecciona:
   - Source: **Deploy from a branch**
   - Branch: **main** (o la rama que uses)
   - Folder: **/ (root)**
4. GitHub detectará automáticamente Jekyll y construirá tu sitio

### Paso 4: Crear una página de blog

Crea un archivo `blog.html` en la raíz del proyecto:

```html
---
layout: default
title: Blog
---

<div class="blog-container">
  <h1>Transmisiones del Arquitecto</h1>
  
  {% for post in site.posts %}
    <article class="blog-post">
      <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
      <p class="date">{{ post.date | date: "%d de %B, %Y" }}</p>
      <p>{{ post.excerpt }}</p>
      <a href="{{ post.url }}">Leer más →</a>
    </article>
  {% endfor %}
</div>
```

## 🎨 Personalización de Colores

Los colores se definen en las variables CSS al inicio del archivo `index.html`:

```css
:root {
    --color-principal: #00FFFF;    /* Cian */
    --color-secundario: #FF00FF;   /* Magenta */
    --color-terciario: #8F00FF;    /* Violeta */
    --color-acento: #FFD700;       /* Dorado */
    --color-fondo: #0a0a14;        /* Azul noche oscuro */
}
```

Puedes modificar estos valores para cambiar toda la paleta de colores del sitio.

## 📱 Responsividad

El sitio está optimizado para:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1024px)
- 🖥️ Escritorio (> 1024px)

## 🔧 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos avanzados (Grid, Flexbox, Animations)
- **JavaScript** - Interactividad y animaciones
- **Jekyll** - Generador de sitios estáticos (para el blog)
- **GitHub Pages** - Hosting gratuito

## 📦 Cómo Subir a GitHub

### Método 1: Edición Directa (Recomendado para principiantes)

1. Ve a tu repositorio: `https://github.com/heliumflyparanoizex/heliumflyparanoizexgithub.io`
2. Haz clic en "Add file" > "Upload files"
3. Arrastra todos los archivos de la carpeta `website/`
4. Escribe un mensaje de commit: "Actualización completa del sitio web"
5. Haz clic en "Commit changes"

### Método 2: Git desde la terminal

```bash
# Clonar el repositorio (si aún no lo has hecho)
git clone https://github.com/heliumflyparanoizex/heliumflyparanoizexgithub.io.git
cd heliumflyparanoizexgithub.io

# Copiar los archivos del website
cp -r /ruta/al/website/* .

# Añadir todos los archivos
git add .

# Hacer commit
git commit -m "Actualización completa del sitio web con ARTUETR5D y multimedia"

# Subir los cambios
git push origin main
```

## 🌐 URL del Sitio

Una vez subido, tu sitio estará disponible en:

**https://heliumflyparanoizex.github.io/**

Los cambios pueden tardar 2-3 minutos en publicarse.

## 📚 Recursos Adicionales

- [Documentación de Jekyll](https://jekyllrb.com/docs/)
- [GitHub Pages](https://pages.github.com/)
- [Markdown Guide](https://www.markdownguide.org/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

## 🆘 Soporte

Si tienes alguna pregunta o problema, puedes:
- Revisar la documentación de GitHub Pages
- Consultar los foros de Jekyll
- Contactarme a través de las redes sociales en el sitio

---

**Creado con 💜 por Helium Fly ParanoizeX**  
*Arquitecto de Realidades Digitales*

