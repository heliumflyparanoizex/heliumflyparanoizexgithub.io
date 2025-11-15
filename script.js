// ============================================
// VARIABLES GLOBALES
// ============================================
let currentLanguage = localStorage.getItem('language') || 'es';
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const langToggle = document.getElementById('langToggle');

// ============================================
// MENÚ HAMBURGUESA
// ============================================
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ============================================
// SELECTOR DE IDIOMA
// ============================================
langToggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    localStorage.setItem('language', currentLanguage);
    updateLanguage();
});

function updateLanguage() {
    // Actualizar el botón de idioma
    langToggle.querySelector('.lang-text').textContent = currentLanguage.toUpperCase();
    
    // Actualizar todos los elementos con atributos data-es y data-en
    document.querySelectorAll('[data-es][data-en]').forEach(element => {
        const text = currentLanguage === 'es' ? element.dataset.es : element.dataset.en;
        element.textContent = text;
    });
    
    // Actualizar el atributo lang del HTML
    document.documentElement.lang = currentLanguage;
}

// Inicializar idioma al cargar la página
window.addEventListener('load', () => {
    updateLanguage();
});

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observar elementos para animación de scroll
document.querySelectorAll('.section-title, .media-card, .video-card, .proyecto-card, .libro-card').forEach(element => {
    element.classList.add('reveal');
    observer.observe(element);
});

// ============================================
// EFECTO GLITCH MEJORADO Y SUTIL
// ============================================
const glitchText = document.querySelector('.glitch-text');
if (glitchText) {
    setInterval(() => {
        // Efecto glitch aleatorio y sutil
        if (Math.random() > 0.97) {
            const offset1 = Math.random() * 2 - 1;
            const offset2 = Math.random() * 2 - 1;
            
            glitchText.style.textShadow = `
                ${offset1}px 0 #FF00FF,
                ${offset2}px 0 #00FFFF
            `;
            
            setTimeout(() => {
                glitchText.style.textShadow = `
                    -1px 0 #FF00FF,
                    1px 0 #8F00FF
                `;
            }, 80);
        }
    }, 300);
}

// ============================================
// SMOOTH SCROLL PARA NAVEGACIÓN
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 70; // Restar altura del header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// PARALLAX EFFECT SUTIL
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const sections = document.querySelectorAll('section[style*="background-image"]');
    
    sections.forEach(section => {
        const yPos = scrolled * 0.5;
        section.style.backgroundPosition = `center ${yPos}px`;
    });
});

// ============================================
// LAZY LOADING PARA VIDEOS
// ============================================
const videos = document.querySelectorAll('video');
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Los videos con controles se cargan automáticamente
            // Solo prevenimos reproducción automática
        } else {
            // Pausar video cuando sale de vista
            if (entry.target.tagName === 'VIDEO') {
                entry.target.pause();
            }
        }
    });
}, { threshold: 0.3 });

videos.forEach(video => {
    videoObserver.observe(video);
});

// ============================================
// DETECCIÓN DE CAMBIOS DE TAMAÑO DE VENTANA
// ============================================
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ============================================
// ANIMACIÓN DE CARGA
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ============================================
// MEJORA DE RENDIMIENTO: DEBOUNCE PARA SCROLL
// ============================================
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Las animaciones se manejan con CSS
            ticking = false;
        });
        ticking = true;
    }
});

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c🌌 HELIUM FLY PARANOIZEX 🌌', 'color: #00FFFF; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px #00FFFF;');
console.log('%cArquitecto de Realidades Digitales', 'color: #FF00FF; font-size: 14px; font-weight: bold;');
console.log('%cCreador de ARTUETR5D - Realidad Sostenida en Tiempo Real', 'color: #8F00FF; font-size: 12px;');
console.log('%c\n¿Buscas la verdad? La realidad es lo que construyes.\n', 'color: #FFD700; font-size: 12px; font-style: italic;');

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que el idioma se carga correctamente
    updateLanguage();
    
    // Inicializar animaciones de scroll
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(element => {
        observer.observe(element);
    });
});
