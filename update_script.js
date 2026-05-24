const fs = require('fs');

const fileContent = fs.readFileSync('script.js', 'utf8');

const targetStr = `            const item = document.createElement('div');
            item.className = 'gallery-item';`;

const replacementStr = `            const item = document.createElement('div');
            item.className = 'gallery-item focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400';
            item.tabIndex = 0;
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'Ver imagen en pantalla completa');`;

let newContent = fileContent.replace(targetStr, replacementStr);

const targetStr2 = `            // Evento Click para Lightbox
            item.addEventListener('click', () => {
                lightbox.style.display = 'block';
                lightboxImg.src = src;
                document.body.style.overflow = 'hidden'; // Bloquear scroll
            });`;

const replacementStr2 = `            const openLightbox = () => {
                lightbox.style.display = 'block';
                lightboxImg.src = src;
                document.body.style.overflow = 'hidden'; // Bloquear scroll
            };

            // Evento Click para Lightbox
            item.addEventListener('click', openLightbox);

            // Evento de teclado para Accesibilidad
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox();
                }
            });`;

newContent = newContent.replace(targetStr2, replacementStr2);

fs.writeFileSync('script.js', newContent);
