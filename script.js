// =================================================================
// SCRIPT.JS - INTERACTIVIDAD Y ANIMACIONES
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. NAVEGACIÓN Y MENÚ
    // -----------------------------------------------------------------
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // -----------------------------------------------------------------
    // 2. ACORDEÓN (CÓDICE SINTÉRGICO)
    // -----------------------------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            
            // Cierra todos los demás
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.nextElementSibling.classList.remove('active');
                }
            });

            // Abre o cierra el actual
            content.classList.toggle('active');
        });
    });

    // -----------------------------------------------------------------
    // 3. FONDO INTERACTIVO ANIMADO (RED NEURONAL)
    // -----------------------------------------------------------------
    const canvas = document.getElementById('interactive-bg');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        // Ajustar el número de partículas para que sea visible pero no sobrecargue
        const numberOfParticles = (width * height) / 15000; 
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    window.addEventListener('resize', initCanvas);
    initCanvas();

    // Clase Partícula
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.directionX = Math.random() * 0.5 - 0.25; // Movimiento lento
            this.directionY = Math.random() * 0.5 - 0.25;
            this.size = Math.random() * 2 + 1;
            this.color = 'rgba(0, 255, 255, 0.8)'; // Cian
        }

        update() {
            // Reversa si toca los bordes
            if (this.x > width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            this.x += this.directionX;
            this.y += this.directionY;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Manejo de Mouse
    canvas.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Conectar Partículas (Red Neuronal)
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                               ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                
                // Conectar solo si están cerca
                if (distance < (width / 7) * (height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(138, 43, 226, ${opacityValue})`; // Color Accent (Púrpura)
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Conectar al Mouse (Interacción)
    function connectToMouse() {
        if (mouse.x !== null && mouse.y !== null) {
            for (let i = 0; i < particles.length; i++) {
                let distance = ((particles[i].x - mouse.x) * (particles[i].x - mouse.x)) +
                               ((particles[i].y - mouse.y) * (particles[i].y - mouse.y));
                
                if (distance < mouse.radius * mouse.radius) {
                    let opacityValue = 1 - (distance / (mouse.radius * mouse.radius));
                    ctx.strokeStyle = `rgba(255, 0, 255, ${opacityValue})`; // Color Secondary (Magenta)
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Bucle de Animación
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connect();
        connectToMouse();
    }

    animate();

    // -----------------------------------------------------------------
    // 4. EFECTO GIROSCOPIO (PARA MÓVILES)
    // -----------------------------------------------------------------
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (event) => {
            const body = document.body;
            const gamma = event.gamma; // Movimiento de izquierda a derecha (-90 a 90)
            const beta = event.beta;   // Movimiento de adelante a atrás (-180 a 180)

            // Normalizar valores a un rango pequeño para un efecto sutil
            const xTilt = (gamma / 90) * 5; // Max 5px
            const yTilt = (beta / 180) * 5; // Max 5px

            // Aplicar un sutil desplazamiento a los elementos principales
            body.style.setProperty('--x-tilt', `${xTilt}px`);
            body.style.setProperty('--y-tilt', `${yTilt}px`);
            
            // Mover el punto de referencia del mouse para el fondo interactivo
            // Esto es un efecto visual, no un movimiento real del mouse
            if (mouse.x === null && mouse.y === null) {
                // Si el mouse no está activo, usa el centro de la pantalla como base
                mouse.x = width / 2 + xTilt * 50; 
                mouse.y = height / 2 + yTilt * 50;
            }
            
        }, true);
    }
    
    // Añadir variables CSS para el efecto giroscopio (necesario para que funcione el JS)
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        body {
            --x-tilt: 0px;
            --y-tilt: 0px;
            transition: transform 0.1s ease-out;
        }
        .hero-content, .section-title, .section-subtitle {
            transform: translate(var(--x-tilt), var(--y-tilt));
            transition: transform 0.1s ease-out;
        }
    `;
    document.head.appendChild(styleSheet);
    
    // -----------------------------------------------------------------
    // 5. LÓGICA DE BOTONES DE SERVICIO (MANTENIDA)
    // -----------------------------------------------------------------
    document.querySelectorAll('.servicio-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = button.closest('.servicio-card').querySelector('.servicio-titulo').textContent;
            const email = 'artuetr5d@gmail.com';
            const subject = encodeURIComponent(`Consulta sobre: ${serviceName}`);
            const body = encodeURIComponent(`Hola, estoy interesado en el servicio: ${serviceName}`);
            
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        });
    });
});
