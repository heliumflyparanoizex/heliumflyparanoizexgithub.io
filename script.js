// VARIABLES GLOBALES
let currentLanguage = 'es';

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguageSystem();
    initializeAccordion();
    initializeMenuToggle();
    initializeScrollAnimations();
    initializeServiceButtons();
    initializeTabs();
    initializeParallax();
    initializeGyroscope();
});

// SISTEMA DE IDIOMAS
function initializeLanguageSystem() {
    const langToggle = document.getElementById('langToggle');
    
    // Cargar idioma guardado
    const savedLanguage = localStorage.getItem('language') || 'es';
    currentLanguage = savedLanguage;
    updateLanguageDisplay();
    
    langToggle.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
        localStorage.setItem('language', currentLanguage);
        updateLanguageDisplay();
    });
}

function updateLanguageDisplay() {
    const langToggle = document.getElementById('langToggle');
    langToggle.querySelector('.lang-text').textContent = currentLanguage.toUpperCase();
    
    // Actualizar todos los elementos con atributos de idioma
    document.querySelectorAll('[data-es][data-en]').forEach(element => {
        const text = currentLanguage === 'es' ? element.dataset.es : element.dataset.en;
        
        if (element.tagName === 'INPUT' || element.tagName === 'BUTTON' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
            if (element.tagName === 'BUTTON') {
                element.textContent = text;
            }
        } else if (element.tagName === 'A' && element.classList.contains('social-link')) {
            // Para los enlaces de redes sociales, actualizar solo el span
            const span = element.querySelector('span');
            if (span) {
                span.textContent = text;
            }
        } else {
            element.textContent = text;
        }
    });
}

// ACORDEÓN
function initializeAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Cerrar todos los demás items
            document.querySelectorAll('.accordion-item').forEach(el => {
                el.classList.remove('active');
            });
            
            // Abrir el actual si no estaba abierto
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// MENÚ HAMBURGUESA
function initializeMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ANIMACIONES DE SCROLL
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.servicio-card, .video-card, .media-card, .libro-card, .accordion-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
}

// BOTONES DE SERVICIOS
function initializeServiceButtons() {
    document.querySelectorAll('.servicio-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = button.closest('.servicio-card').querySelector('.servicio-titulo').textContent;
            const email = 'artuetr5d@gmail.com';
            const subject = encodeURIComponent(`Consulta sobre: ${serviceName}`);
            const body = encodeURIComponent(`Hola, estoy interesado en el servicio: ${serviceName}`);
            
            // Abrir cliente de correo
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        });
    });
}

// SISTEMA DE PESTAÑAS
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remover clase active de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Agregar clase active al botón y contenido seleccionado
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// EFECTOS DE PARALLAX
function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Efecto parallax en secciones con background
        document.querySelectorAll('section[style*="background-image"]').forEach(section => {
            const offset = scrollY * 0.5;
            section.style.backgroundPosition = `center ${offset}px`;
        });
        
        // Efecto de movimiento sutil en elementos
        document.querySelectorAll('.hero-content').forEach(element => {
            const offset = scrollY * 0.3;
            element.style.transform = `translateY(${offset}px)`;
        });
    });
}

// GIROSCOPIO Y MOVIMIENTO DEL DISPOSITIVO
function initializeGyroscope() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (event) => {
            const alpha = event.alpha; // Rotación Z
            const beta = event.beta;   // Rotación X
            const gamma = event.gamma; // Rotación Y
            
            // Aplicar efecto sutil de movimiento basado en giroscopio
            const xMove = (gamma / 90) * 10; // Máximo 10px
            const yMove = (beta / 90) * 10;
            
            document.querySelectorAll('.servicio-card, .video-card, .media-card').forEach(element => {
                element.style.transform = `perspective(1000px) rotateX(${yMove * 0.5}deg) rotateY(${xMove * 0.5}deg)`;
            });
        });
    }
}

// ANIMACIÓN DE GLITCH MEJORADA
const glitchText = document.querySelector('.glitch-text');
if (glitchText) {
    glitchText.addEventListener('mouseover', () => {
        glitchText.style.animation = 'glitch-animation 0.3s infinite';
    });
    
    glitchText.addEventListener('mouseout', () => {
        glitchText.style.animation = 'glitch-animation 3s infinite';
    });
}

// EFECTO DE CLICK EN ELEMENTOS
document.addEventListener('click', (e) => {
    // Crear efecto de ripple en clics
    if (e.target.classList.contains('servicio-btn') || 
        e.target.classList.contains('doc-card') || 
        e.target.classList.contains('libro-link')) {
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple-animation 0.6s ease-out';
        
        const rect = e.target.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        
        e.target.style.position = 'relative';
        e.target.style.overflow = 'hidden';
        e.target.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// ANIMACIÓN DE CARGA
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// SCROLL SUAVE MEJORADO
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// EFECTO DE HOVER EN IMÁGENES
document.querySelectorAll('.esquema-img').forEach(img => {
    img.addEventListener('mouseover', () => {
        img.style.transform = 'scale(1.05) rotate(1deg)';
    });
    
    img.addEventListener('mouseout', () => {
        img.style.transform = 'scale(1) rotate(0deg)';
    });
});

// ANIMACIÓN DE ENTRADA DE SECCIONES
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'fadeInUp 0.8s ease-out';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    sectionObserver.observe(section);
});

// EFECTO DE SCROLL INDICADOR
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const nextSection = document.querySelector('#artuetr5d');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ANIMACIÓN CSS PARA RIPPLE
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// DETECTOR DE PREFERENCIA DE MOVIMIENTO REDUCIDO
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none !important';
        el.style.transition = 'none !important';
    });
}
