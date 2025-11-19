// ==============================================
// 1. CONFIGURACIÓN INICIAL Y LIBRERÍAS
// ==============================================
gsap.registerPlugin(ScrollTrigger);

// Inicializar Scroll Suave (Lenis)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ==============================================
// 2. ESCENA THREE.JS (FONDO INTERACTIVO)
// ==============================================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#webgl'),
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- CREACIÓN DE PARTÍCULAS (EL "CEREBRO DIGITAL") ---
const geometry = new THREE.BufferGeometry();
const count = 2000; // Cantidad de partículas
const positions = new Float32Array(count * 3);
const originalPositions = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    // Crear una nube aleatoria
    positions[i] = (Math.random() - 0.5) * 15;
    originalPositions[i] = positions[i];
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Material de las partículas
const material = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x00FFFF, // Cyan
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

camera.position.z = 5;

// ==============================================
// 3. INTERACTIVIDAD (MOUSE Y SCROLL)
// ==============================================
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

// Seguimiento del mouse
window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    
    // Normalizar coordenadas (-1 a 1) para WebGL
    targetX = (event.clientX / window.innerWidth) * 2 - 1;
    targetY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Loop de Animación 3D
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Rotación suave constante
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = -mouseY * 0.0005;

    // Efecto de "Olas" en las partículas
    const positions = particlesMesh.geometry.attributes.position.array;
    
    for(let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = originalPositions[i3];
        // Onda senoidal basada en tiempo y posición
        positions[i3 + 1] = originalPositions[i3 + 1] + Math.sin(elapsedTime + x) * 0.2;
    }
    particlesMesh.geometry.attributes.position.needsUpdate = true;

    // Reacción al movimiento del mouse (Parallax)
    particlesMesh.position.x += (targetX * 0.5 - particlesMesh.position.x) * 0.05;
    particlesMesh.position.y += (targetY * 0.5 - particlesMesh.position.y) * 0.05;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==============================================
// 4. ANIMACIONES GSAP (TEXTO Y UI)
// ==============================================

// Animación del Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // El borde sigue con un poco de retraso (smooth)
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Reveal Animations para Textos
const textElements = document.querySelectorAll('h2, p, .section-number');
textElements.forEach(text => {
    gsap.from(text, {
        scrollTrigger: {
            trigger: text,
            start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Parallax Effect para elementos específicos
gsap.utils.toArray('[data-speed]').forEach(el => {
    gsap.to(el, {
        y: (i, target) => -100 * target.dataset.speed,
        scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0
        }
    });
});

// Menú Overlay
const menuBtn = document.querySelector('.menu-btn');
const navOverlay = document.querySelector('.nav-overlay');
const navLinks = document.querySelectorAll('.nav-link');

menuBtn.addEventListener('click', () => {
    navOverlay.classList.toggle('active');
    document.querySelector('.hamburger').classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navOverlay.classList.remove('active');
    });
});

// Cambio de color del fondo basado en secciones
ScrollTrigger.create({
    trigger: "#artuetr5d",
    start: "top center",
    onEnter: () => {
        gsap.to(material.color, {r: 1, g: 0, b: 1}); // Cambia a Magenta
    },
    onLeaveBack: () => {
        gsap.to(material.color, {r: 0, g: 1, b: 1}); // Vuelve a Cyan
    }
});