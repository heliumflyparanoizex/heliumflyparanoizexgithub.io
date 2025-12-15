// VARIABLES GLOBALES
let currentLanguage = 'es';

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguageSystem();
    initializeAccordion();
    initializeMenuToggle();
    initializeScrollAnimations();
    initializeServiceButtons();
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
    
    document.querySelectorAll('.servicio-card, .video-card, .media-card, .libro-card').forEach(element => {
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
            const message = currentLanguage === 'es' 
                ? `Estoy interesado en el servicio: ${serviceName}`
                : `I'm interested in the service: ${serviceName}`;
            
            // Aquí puedes agregar lógica para abrir un formulario o enviar un email
            console.log(message);
            alert(message);
        });
    });
    
    // CTA Button
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            const message = currentLanguage === 'es'
                ? 'Quiero discutir un proyecto personalizado'
                : 'I want to discuss a custom project';
            console.log(message);
            alert(message);
        });
    }
}

// EFECTOS DE PARALLAX SUTILES
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Efecto parallax en secciones con background
    document.querySelectorAll('section[style*="background-image"]').forEach(section => {
        const offset = scrollY * 0.5;
        section.style.backgroundPosition = `center ${offset}px`;
    });
});

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

// PRELOADER
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
