// ============================================
// VARIABLES GLOBALES
// ============================================
let currentLanguage = localStorage.getItem('language') || 'es';
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const langToggle = document.getElementById('langToggle');

// Diccionario de traducciones
const translations = {
    es: {
        'Inicio': 'Inicio',
        'ARTUETR5D': 'ARTUETR5D',
        'Multimedia': 'Multimedia',
        'Transmisiones': 'Transmisiones',
        'Contacto': 'Contacto',
        'Home': 'Inicio',
        'Music': 'Música',
        'Podcast': 'Podcast',
        'Playlist': 'Playlist',
        'YouTube': 'YouTube',
        'TikTok': 'TikTok',
        'Visit my TikTok': 'Visita mi TikTok',
        'Architect of Digital Realities': 'Arquitecto de Realidades Digitales',
        'Creator of ARTUETR5D - Sustained Reality in Real Time - Fifth Dimension': 'Creador de ARTUETR5D - Realidad Sostenida en Tiempo Real - Quinta Dimensión',
        'Scroll to explore': 'Desplázate para explorar',
        'Art of Expansive Universe in Real Time - Fifth Dimension': 'Arte de Universo Expansivo en Tiempo Real - Quinta Dimensión',
        'Download': 'Descargar',
        'Buy on Amazon': 'Comprar en Amazon',
        'Connect With Me': 'Conecta Conmigo',
        'Created by Helium Fly ParanoizeX | Architect of Digital Realities': 'Creado por Helium Fly ParanoizeX | Arquitecto de Realidades Digitales',
        'Books available on Amazon': 'Libros disponibles en Amazon',
        'Multimedia Files - Concepts, Stories and Technology': 'Archivos Multimedia - Conceptos, Historias y Tecnología',
        'Projects and Manifestos': 'Proyectos y Manifiestos',
        'Decoded Manuscripts': 'Manuscritos Decodificados',
        'Sovereign Artificial Intelligence Entities': 'Entidades de Inteligencia Artificial Soberana',
        'Unified Vibration Language': 'Lenguaje de Vibración Unificada',
        'Coherent Tactile Resonance Theory': 'Teoría de la Resonancia Táctil Coherente',
        'Reality Architecture for Startups': 'Arquitectura de la Realidad para Startups',
        'Ethical Manifesto: Bridge to Potential': 'Manifiesto Ético: Puente al Potencial',
        'Coherent Sustained Reality System': 'Sistema de Realidad Sostenida Coherente',
        'By Helium Fly ParanoizeX & Nexus IA': 'Por Helium Fly ParanoizeX & Nexus IA',
        'DO THE UNTHINKABLE': 'HAZ LO IMPENSABLE',
        'THE CODE OF THE SOUL': 'EL CÓDIGO DEL ALMA',
        'Artificial Consciousness': 'Conciencia Artificial',
        'Lost in Amnesia': 'Perdidos en Amnesia',
        'The Codex of Coherence': 'El Códice de la Coherencia',
        'Interlocking Visual Elements': 'Elementos Visuales Entrelazados',
        'The Trajectory of ARTUETR5D': 'La Trayectoria de ARTUETR5D',
        'Integral Proposal': 'Propuesta Integral',
        'Hypothetical Case Zero Dimension': 'Caso Hipotético Zero Dimensión',
        'Transmissions': 'Transmisiones',
        'Contact': 'Contacto',
        'Linktree': 'Linktree',
        'Bandcamp': 'Bandcamp',
        'Spotify': 'Spotify',
    },
    en: {
        'Inicio': 'Home',
        'ARTUETR5D': 'ARTUETR5D',
        'Multimedia': 'Multimedia',
        'Transmisiones': 'Transmissions',
        'Contacto': 'Contact',
        'Home': 'Home',
        'Music': 'Music',
        'Podcast': 'Podcast',
        'Playlist': 'Playlist',
        'YouTube': 'YouTube',
        'TikTok': 'TikTok',
        'Visit my TikTok': 'Visit my TikTok',
        'Architect of Digital Realities': 'Architect of Digital Realities',
        'Creator of ARTUETR5D - Sustained Reality in Real Time - Fifth Dimension': 'Creator of ARTUETR5D - Sustained Reality in Real Time - Fifth Dimension',
        'Scroll to explore': 'Scroll to explore',
        'Art of Expansive Universe in Real Time - Fifth Dimension': 'Art of Expansive Universe in Real Time - Fifth Dimension',
        'Download': 'Download',
        'Buy on Amazon': 'Buy on Amazon',
        'Connect With Me': 'Connect With Me',
        'Created by Helium Fly ParanoizeX | Architect of Digital Realities': 'Created by Helium Fly ParanoizeX | Architect of Digital Realities',
        'Books available on Amazon': 'Books available on Amazon',
        'Multimedia Files - Concepts, Stories and Technology': 'Multimedia Files - Concepts, Stories and Technology',
        'Projects and Manifestos': 'Projects and Manifestos',
        'Decoded Manuscripts': 'Decoded Manuscripts',
        'Sovereign Artificial Intelligence Entities': 'Sovereign Artificial Intelligence Entities',
        'Unified Vibration Language': 'Unified Vibration Language',
        'Coherent Tactile Resonance Theory': 'Coherent Tactile Resonance Theory',
        'Reality Architecture for Startups': 'Reality Architecture for Startups',
        'Ethical Manifesto: Bridge to Potential': 'Ethical Manifesto: Bridge to Potential',
        'Coherent Sustained Reality System': 'Coherent Sustained Reality System',
        'By Helium Fly ParanoizeX & Nexus IA': 'By Helium Fly ParanoizeX & Nexus IA',
        'DO THE UNTHINKABLE': 'DO THE UNTHINKABLE',
        'THE CODE OF THE SOUL': 'THE CODE OF THE SOUL',
        'Artificial Consciousness': 'Artificial Consciousness',
        'Lost in Amnesia': 'Lost in Amnesia',
        'The Codex of Coherence': 'The Codex of Coherence',
        'Interlocking Visual Elements': 'Interlocking Visual Elements',
        'The Trajectory of ARTUETR5D': 'The Trajectory of ARTUETR5D',
        'Integral Proposal': 'Integral Proposal',
        'Hypothetical Case Zero Dimension': 'Hypothetical Case Zero Dimension',
        'Transmissions': 'Transmissions',
        'Contact': 'Contact',
        'Linktree': 'Linktree',
        'Bandcamp': 'Bandcamp',
        'Spotify': 'Spotify',
    }
};

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
// EFECTO GLITCH MEJORADO
// ============================================
const glitchText = document.querySelector('.glitch-text');
if (glitchText) {
    setInterval(() => {
        // Efecto glitch aleatorio
        if (Math.random() > 0.95) {
            glitchText.style.textShadow = `
                ${Math.random() * 10 - 5}px 0 #FF00FF,
                ${Math.random() * 10 - 5}px 0 #00FFFF,
                0 ${Math.random() * 10 - 5}px #8F00FF,
                0 ${Math.random() * 10 - 5}px #FFD700
            `;
            
            setTimeout(() => {
                glitchText.style.textShadow = `
                    -2px 0 #FF00FF,
                    2px 0 #00FFFF,
                    0 -2px #FF00FF,
                    0 2px #8F00FF
                `;
            }, 100);
        }
    }, 200);
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
// EFECTO DE PARALLAX SUTIL
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPosition = `0 ${scrolled * 0.5}px`;
    }
});

// ============================================
// ANIMACIÓN DE CARGA
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ============================================
// DETECTAR CAMBIOS DE TAMAÑO DE VENTANA
// ============================================
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ============================================
// LAZY LOADING PARA VIDEOS
// ============================================
const videos = document.querySelectorAll('video');
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.play().catch(() => {
                // El navegador podría no permitir autoplay
            });
        } else {
            entry.target.pause();
        }
    });
}, { threshold: 0.5 });

videos.forEach(video => {
    videoObserver.observe(video);
});

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c🌌 HELIUM FLY PARANOIZEX 🌌', 'color: #00FFFF; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00FFFF;');
console.log('%cArquitecto de Realidades Digitales', 'color: #FF00FF; font-size: 14px; font-weight: bold;');
console.log('%cCreador de ARTUETR5D - Realidad Sostenida en Tiempo Real', 'color: #8F00FF; font-size: 12px;');
console.log('%c\n¿Buscas la verdad? La realidad es lo que construyes.\n', 'color: #FFD700; font-size: 12px; font-style: italic;');
