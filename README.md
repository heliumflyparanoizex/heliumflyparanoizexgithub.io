# 🌌 Helium Fly ParanoizeX - Sitio Web Oficial

**Arquitecto de Realidades Digitales | Creador de ARTUETR5D**

## 📋 Descripción

Sitio web personal completamente rediseñado con:
- ✨ Diseño inmersivo inspirado en lusion.co
- 🔤 Efectos glitch dinámicos y animaciones futuristas
- 🍔 Menú hamburguesa responsivo
- 🌐 Selector de idioma (Español/English)
- 🎬 Integración multimedia (Spotify, YouTube, TikTok, Videos locales)
- 📚 Secciones de proyectos, manifiestos y libros
- 📱 Completamente responsivo (móvil, tablet, escritorio)

## 🚀 Estructura de Archivos

```
/
├── index.html              # Página principal
├── style.css              # Estilos (glitch, inmersivos, responsivos)
├── script.js              # Interactividad (menú, idioma, scroll effects)
├── README.md              # Este archivo
└── assets/
    ├── Logo-2025oct02-10-13-56p.m..png
    ├── portada.jpg
    ├── Whisk_95f1dfbced.jpg
    ├── whisk_storyboarda4f6cf832f2142958777f2ba6d16df.png
    ├── artuetr5d.mp4
    ├── Conciencia_Artificial.mp4
    ├── Perdidos_en_Amnesia.mp4
    ├── El_Códice_de_la_Coherencia.mp4
    ├── Visual_elements_interlocking_202506060904.mp4
    ├── Visual_elements_interlocking_202506061007.mp4
    └── [PDFs y documentos]
```

## 📝 Cómo Subir a GitHub

### ⚠️ IMPORTANTE: Estructura Correcta

Los archivos **DEBEN estar en la raíz del repositorio**, NO dentro de una carpeta `website/`.

### Opción 1: Subida Manual (Recomendado para principiantes)

1. **Ve a tu repositorio en GitHub:**
   ```
   https://github.com/heliumflyparanoizex/heliumflyparanoizexgithub.io
   ```

2. **Haz clic en "Add file" > "Upload files"**

3. **Arrastra TODOS los archivos y carpetas:**
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
   - Carpeta `assets/` (con todos sus contenidos)

4. **Escribe un mensaje de commit:**
   ```
   Rediseño completo: Diseño inmersivo, menú hamburguesa, selector de idioma
   ```

5. **Haz clic en "Commit changes"**

### Opción 2: Git desde la Terminal

```bash
# 1. Clonar el repositorio
git clone https://github.com/heliumflyparanoizex/heliumflyparanoizexgithub.io.git
cd heliumflyparanoizexgithub.io

# 2. Eliminar archivos antiguos (si existen)
rm -rf website/ index.html style.css script.js

# 3. Copiar los nuevos archivos a la raíz
cp -r /ruta/a/heliumfly-website/* .

# 4. Añadir todos los archivos
git add .

# 5. Hacer commit
git commit -m "Rediseño completo: Diseño inmersivo, menú hamburguesa, selector de idioma"

# 6. Subir a GitHub
git push origin main
```

## ✅ Verificar que Funciona

1. **Espera 2-3 minutos** para que GitHub Pages construya el sitio
2. **Visita tu página:**
   ```
   https://heliumflyparanoizex.github.io/
   ```
3. **Verifica que:**
   - ✅ Se carga correctamente
   - ✅ El menú hamburguesa funciona (en móvil)
   - ✅ El selector de idioma cambia el contenido
   - ✅ Los videos se cargan
   - ✅ Los efectos glitch funcionan

## 🎨 Características Principales

### Menú Hamburguesa
- Aparece automáticamente en dispositivos móviles (< 768px)
- Se cierra al hacer clic en un enlace
- Animación suave de apertura/cierre

### Selector de Idioma
- Botón "ES/EN" en el header
- Cambia todo el contenido entre Español e Inglés
- Se guarda la preferencia en localStorage

### Efectos Visuales
- **Glitch:** Efecto dinámico en el título principal
- **Scanlines:** Líneas de escaneo animadas en el fondo
- **Glassmorphism:** Efecto de vidrio en las tarjetas
- **Scroll Reveal:** Animaciones al hacer scroll
- **Parallax sutil:** Movimiento en el fondo del hero

### Multimedia
- Reproductores de Spotify (artista, podcast, playlist)
- Reproductor de YouTube
- Enlace directo a TikTok
- Videos locales con controles nativos

## 🌐 Secciones

1. **Inicio (Hero)** - Presentación principal con efectos glitch
2. **ARTUETR5D** - Sección destacada con video y documentación
3. **Multimedia** - Reproductores de Spotify, YouTube y TikTok
4. **Transmisiones** - Galería de videos locales
5. **Proyectos y Manifiestos** - EIDOLONS, LVU, TRTC, ARS-S, P-P, CARSS
6. **Manuscritos Decodificados** - Tus libros en Amazon
7. **Conecta Conmigo** - Enlaces a redes sociales

## 🔧 Personalización

### Cambiar Colores

Edita las variables CSS en `style.css`:

```css
:root {
    --color-principal: #00FFFF;    /* Cian */
    --color-secundario: #FF00FF;   /* Magenta */
    --color-terciario: #8F00FF;    /* Violeta */
    --color-acento: #FFD700;       /* Dorado */
    --color-fondo: #0a0a14;        /* Fondo */
}
```

### Cambiar Tipografía

Las fuentes se definen en las variables CSS:

```css
--font-primary: 'Rajdhani', 'Courier New', monospace;
--font-secondary: 'Orbitron', 'Arial', sans-serif;
```

### Añadir Más Contenido

Simplemente añade nuevas secciones siguiendo la estructura HTML existente.

## 📱 Responsividad

El sitio está optimizado para:
- 📱 **Móviles:** < 480px
- 📱 **Tablets:** 480px - 1024px
- 🖥️ **Escritorio:** > 1024px

## 🚀 Próximas Mejoras

- [ ] Formulario de contacto funcional
- [ ] Blog dinámico con Jekyll
- [ ] Galería de imágenes interactiva
- [ ] Modo oscuro/claro (toggle)
- [ ] Google Analytics
- [ ] Comentarios en el blog

## 📞 Soporte

Si tienes problemas:

1. **Verifica que los archivos estén en la raíz** (no en una carpeta)
2. **Revisa la configuración de GitHub Pages** en Settings > Pages
3. **Limpia el caché del navegador** (Ctrl+Shift+Delete)
4. **Espera 5 minutos** para que GitHub Pages reconstruya el sitio

## 📄 Licencia

Contenido original de Helium Fly ParanoizeX © 2025

---

**Creado con 💜 por Manus AI**  
*Arquitecto de Realidades Digitales*
