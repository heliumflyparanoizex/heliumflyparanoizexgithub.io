// Read script.js, modify it, write back
const fs = require('fs');

let content = fs.readFileSync('script.js', 'utf8');

const searchGalleryGen = `
        // Generar items de galería
        galleryImages.forEach(src => {
            const item = document.createElement('div');
            item.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Entity Record';
            img.loading = 'lazy'; // Lazy load nativo

            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            overlay.innerHTML = '<i class="fas fa-expand-arrows-alt"></i>';

            item.appendChild(img);
            item.appendChild(overlay);

            // Evento Click para Lightbox
            item.addEventListener('click', () => {
                lightbox.style.display = 'block';
                lightboxImg.src = src;
                document.body.style.overflow = 'hidden'; // Bloquear scroll
            });

            galleryContainer.appendChild(item);
        });
`;

const replaceGalleryGen = `
        let lastFocusedElement = null;

        // Generar items de galería
        galleryImages.forEach(src => {
            const item = document.createElement('div');
            item.className = 'gallery-item focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]';
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'Ver imagen ampliada');

            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Entity Record';
            img.loading = 'lazy'; // Lazy load nativo

            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            overlay.innerHTML = '<i class="fas fa-expand-arrows-alt" aria-hidden="true"></i>';

            item.appendChild(img);
            item.appendChild(overlay);

            // Evento Click para Lightbox
            item.addEventListener('click', () => {
                lastFocusedElement = document.activeElement;
                lightbox.style.display = 'block';
                lightboxImg.src = src;
                document.body.style.overflow = 'hidden'; // Bloquear scroll
                if (closeLightbox) closeLightbox.focus();
            });

            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });

            galleryContainer.appendChild(item);
        });
`;

content = content.replace(searchGalleryGen, replaceGalleryGen);

const searchLightboxClose = `
        // Cerrar Lightbox
        if (closeLightbox) {
            closeLightbox.addEventListener('click', () => {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            });

            // Cerrar con Enter/Espacio en el botón
            closeLightbox.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    lightbox.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }

        // Cerrar al hacer clic fuera de la imagen
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Cerrar con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
`;

const replaceLightboxClose = `
        const closeLightboxAction = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
            if (lastFocusedElement) {
                lastFocusedElement.focus();
                lastFocusedElement = null;
            }
        };

        // Cerrar Lightbox
        if (closeLightbox) {
            closeLightbox.addEventListener('click', closeLightboxAction);

            // Cerrar con Enter/Espacio en el botón
            closeLightbox.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    closeLightboxAction();
                }
            });
        }

        // Cerrar al hacer clic fuera de la imagen
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightboxAction();
            }
        });

        // Cerrar con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                closeLightboxAction();
            }
        });
`;

content = content.replace(searchLightboxClose, replaceLightboxClose);

fs.writeFileSync('script.js', content, 'utf8');
console.log('script.js modified');
