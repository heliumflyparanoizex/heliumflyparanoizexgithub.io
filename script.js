// =================================================================
// SCRIPT.JS - INTERACTIVIDAD, LENIS Y GSAP
// =================================================================

let isInitialized = false;

/**
 * Generates a mailto link for a given service name.
 * @param {string} serviceName - The name of the service.
 * @returns {string} The generated mailto link.
 */
function generateMailtoLink(serviceName) {
    const email = 'artuetr5d@gmail.com';
    const subject = encodeURIComponent(`Consulta sobre: ${serviceName}`);
    const body = encodeURIComponent(`Hola, estoy interesado en el servicio: ${serviceName}`);
    return `mailto:${email}?subject=${subject}&body=${body}`;
}

function initSite() {
    if (isInitialized) return;
    isInitialized = true;

    // -----------------------------------------------------------------
    // 1. INICIALIZACIÓN DE LENIS (SMOOTH SCROLL)
    // -----------------------------------------------------------------
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integrar Lenis con GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // -----------------------------------------------------------------
    // 2. PRELOADER & STARTUP ANIMATIONS
    // -----------------------------------------------------------------
    const preloader = document.getElementById('preloader');

    // Timeline inicial
    const tl = gsap.timeline();

    if (preloader) {
        tl.to(preloader, {
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                preloader.style.visibility = 'hidden';
            }
        });
    }

    // Animación del Hero (se ejecuta después del preloader)
    tl.from('.hero-content', {
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out'
    }, "-=0.5"); // Solapa ligeramente con el fade out

    // -----------------------------------------------------------------
    // 3. NAVEGACIÓN Y MENÚ
    // -----------------------------------------------------------------
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            lenis.scrollTo(targetId);
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // -----------------------------------------------------------------
    // 4. TRANSICIÓN DE FONDOS (SCROLLTRIGGER)
    // -----------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const bgLayers = document.querySelectorAll('.bg-layer');

    sections.forEach((section, index) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => updateBackground(section.id),
            onEnterBack: () => updateBackground(section.id),
        });
    });

    function updateBackground(id) {
        bgLayers.forEach(layer => {
            layer.classList.remove('active');
            if (layer.id === `bg-${id}`) {
                layer.classList.add('active');
            }
        });
    }

    // -----------------------------------------------------------------
    // 5. ANIMACIONES DE ENTRADA (GSAP)
    // -----------------------------------------------------------------
    gsap.registerPlugin(ScrollTrigger);

    sections.forEach(section => {
        // Excluir hero-content porque ya se animó en el inicio
        const elements = section.querySelectorAll('.section-title, .section-subtitle, .artuetr5d-content, .memsyn5dx-container, .servicios-grid, .videos-grid, .multimedia-grid, .libros-grid, .social-icons-grid');

        gsap.from(elements, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // -----------------------------------------------------------------
    // 6. INTERACCIÓN CON EL MOUSE (PARALLAX)
    // -----------------------------------------------------------------
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;

        gsap.to('.hero-content', {
            x: xPos,
            y: yPos,
            duration: 1,
            ease: 'power2.out'
        });

        gsap.to('.bg-layer.active', {
            scale: 1.05,
            x: xPos * 0.5,
            y: yPos * 0.5,
            duration: 2,
            ease: 'power1.out'
        });
    });

    // -----------------------------------------------------------------
    // 7. ACORDEÓN (CÓDICE SINTÉRGICO)
    // -----------------------------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.nextElementSibling.classList.remove('active');
                }
            });

            content.classList.toggle('active');
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500);
        });
    });

    // -----------------------------------------------------------------
    // 8. LÓGICA DE BOTONES DE SERVICIO
    // -----------------------------------------------------------------
    document.querySelectorAll('.servicio-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = button.closest('.servicio-card').querySelector('.servicio-titulo').textContent;
            window.location.href = generateMailtoLink(serviceName);
        });
    });

    // -----------------------------------------------------------------
    // 9. SIMULADOR MEM-SYN5DX (SINTERGIC RESONANCE) - THREE.JS UPGRADE
    // -----------------------------------------------------------------
    const canvas = document.getElementById('memsyn-sim');
    if (canvas && typeof THREE !== 'undefined') {
        // --- CONFIGURACIÓN THREE.JS ---
        const scene = new THREE.Scene();
        // Usamos el fondo negro por defecto del renderer para mejor contraste de partículas
        // y un setup más simple y eficiente.

        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.z = 20;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // --- SISTEMA DE PARTÍCULAS (SHADER MATERIAL) ---
        // Geometría: Un plano de puntos densos (adaptativo según dispositivo)
        const isMobile = window.innerWidth < 768;
        const segX = isMobile ? 60 : 100;
        const segY = isMobile ? 35 : 60;

        const particlesGeometry = new THREE.PlaneGeometry(50, 30, segX, segY);
        const count = particlesGeometry.attributes.position.count;

        // Añadir atributo 'initialPosition' para referencia en vertex shader
        // (Aunque PlaneGeometry ya tiene 'position', necesitamos uno estático para volver a él)
        const initialPositions = new Float32Array(count * 3);
        const positions = particlesGeometry.attributes.position.array;
        for (let i = 0; i < count * 3; i++) {
            initialPositions[i] = positions[i];
        }
        particlesGeometry.setAttribute('initialPosition', new THREE.BufferAttribute(initialPositions, 3));

        // Shader Uniforms
        const uniforms = {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(9999, 9999) }, // Fuera de pantalla inicialmente
            uResolution: { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) },
            uColor1: { value: new THREE.Color(0x00FFFF) }, // Cian
            uColor2: { value: new THREE.Color(0xFF00FF) }  // Magenta
        };

        // Material Shader
        const particlesMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: `
                uniform float uTime;
                uniform vec2 uMouse;
                attribute vec3 initialPosition;
                varying float vDistance;

                void main() {
                    vec3 pos = initialPosition;

                    // Proyectar posición a espacio de pantalla (aproximado para interacción simple 2D en plano 3D)
                    // Asumimos que el plano está en Z=0 y la cámara mira de frente.
                    // Para mayor precisión, usamos la distancia en el mundo 3D entre el punto y el rayo del mouse.

                    // Efecto de Onda (Resonancia) constante
                    float wave = sin(pos.x * 0.5 + uTime) * 0.2 + cos(pos.y * 0.5 + uTime * 0.8) * 0.2;
                    pos.z += wave;

                    // Interacción Mouse (Distorsión Magnética)
                    // Convertimos coordenada mouse (normalizada -1 a 1 por JS) a espacio mundo aproximado
                    // Dado que la cámara está en z=20, el campo de visión es X ancho.

                    // En lugar de proyección compleja, pasamos el mouse ya proyectado al plano Z=0 desde JS.
                    float d = distance(pos.xy, uMouse);
                    float radius = 8.0;
                    float force = smoothstep(radius, 0.0, d);

                    // Empujar partículas lejos del mouse y hacia arriba en Z
                    vec2 dir = normalize(pos.xy - uMouse);
                    pos.xy += dir * force * 1.5;
                    pos.z += force * 5.0; // Levantar partículas cerca del mouse

                    vDistance = force; // Para colorear en fragment shader

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;

                    // Tamaño de partícula dinámico
                    gl_PointSize = (3.0 / -mvPosition.z) * 30.0;
                    if (gl_PointSize < 1.0) gl_PointSize = 1.0;
                }
            `,
            fragmentShader: `
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                varying float vDistance;

                void main() {
                    // Círculo suave para cada partícula
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    float dist = length(coord);
                    if (dist > 0.5) discard;

                    float strength = 1.0 - (dist * 2.0);
                    strength = pow(strength, 2.0);

                    // Mezclar colores: Magenta cerca del mouse, Cian lejos
                    vec3 color = mix(uColor1, uColor2, vDistance);

                    // Añadir brillo blanco en el centro
                    color += vec3(1.0) * strength * vDistance * 0.5;

                    gl_FragColor = vec4(color, strength * 0.8); // Alpha
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // --- MANEJO DE EVENTOS ---

        // Mouse Move
        function updateMouse(x, y) {
            // Convertir coordenadas de pantalla a coordenadas de mundo (plano Z=0)
            const vec = new THREE.Vector3();
            const pos = new THREE.Vector3();

            vec.set(
                (x / canvas.clientWidth) * 2 - 1,
                -(y / canvas.clientHeight) * 2 + 1,
                0.5
            );

            vec.unproject(camera);
            vec.sub(camera.position).normalize();

            const distance = -camera.position.z / vec.z;
            pos.copy(camera.position).add(vec.multiplyScalar(distance));

            uniforms.uMouse.value.set(pos.x, pos.y);
        }

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            updateMouse(e.clientX - rect.left, e.clientY - rect.top);
        });

        // Touch Move (Móvil)
        canvas.addEventListener('touchmove', (e) => {
            // Permitimos el scroll nativo (no llamamos preventDefault) para mejor UX
            // El usuario puede tocar y ver el efecto mientras hace scroll
            const rect = canvas.getBoundingClientRect();
            if (e.touches.length > 0) {
                updateMouse(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
            }
        }, { passive: true });

        canvas.addEventListener('mouseleave', () => {
             // Mover el punto de interacción lejos suavemente o dejarlo estático
             // uniforms.uMouse.value.set(9999, 9999);
        });

        // Resize
        function onWindowResize() {
            const container = canvas.parentElement;
            const width = container.clientWidth;
            const height = container.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);

            uniforms.uResolution.value.set(width, height);
        }
        window.addEventListener('resize', onWindowResize);

        // --- ANIMACIÓN LOOP ---
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();
            uniforms.uTime.value = elapsedTime;

            // Rotar levemente la cámara o el objeto para dar profundidad 3D constante
            particlesMesh.rotation.y = Math.sin(elapsedTime * 0.1) * 0.1;
            particlesMesh.rotation.x = Math.cos(elapsedTime * 0.1) * 0.05;

            renderer.render(scene, camera);
        }

        animate();
    }

    // -----------------------------------------------------------------
    // 10. ANIMACIÓN MATRIZ DE COMPETENCIAS (BARRAS DE PROGRESO)
    // -----------------------------------------------------------------
    const skillBars = document.querySelectorAll('.skill-progress');

    if (skillBars.length > 0) {
        ScrollTrigger.create({
            trigger: '.skills-matrix-container',
            start: 'top 80%',
            onEnter: () => {
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }
        });
    }

    // -----------------------------------------------------------------
    // 11. PDF VIEWER INTERACTIVO (CÓDICE)
    // -----------------------------------------------------------------
    const pdfCanvas = document.getElementById('pdf-canvas');
    if (pdfCanvas && typeof pdfjsLib !== 'undefined') {
        const ctx = pdfCanvas.getContext('2d');
        const pdfTabs = document.querySelectorAll('.codex-tab');
        const prevBtn = document.getElementById('pdf-prev');
        const nextBtn = document.getElementById('pdf-next');
        const pageNumDisplay = document.getElementById('pdf-page-num');
        const downloadBtn = document.getElementById('pdf-download');
        const loadingBar = document.getElementById('pdf-loading-bar');

        let pdfDoc = null;
        let pageNum = 1;
        let pageRendering = false;
        let pageNumPending = null;
        let scale = 1.5; // Escala inicial

        // Ajustar escala según dispositivo
        if (window.innerWidth < 768) scale = 0.8;

        function renderPage(num) {
            pageRendering = true;

            // Fetch page
            pdfDoc.getPage(num).then(function(page) {
                const viewport = page.getViewport({scale: scale});

                // Set canvas dimensions
                pdfCanvas.height = viewport.height;
                pdfCanvas.width = viewport.width;

                // Render context
                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };

                const renderTask = page.render(renderContext);

                // Wait for render to finish
                renderTask.promise.then(function() {
                    pageRendering = false;
                    loadingBar.style.display = 'none';

                    if (pageNumPending !== null) {
                        renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                });
            });

            // Update page counters
            pageNumDisplay.textContent = `${num} / ${pdfDoc.numPages}`;
        }

        function queueRenderPage(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        }

        function onPrevPage() {
            if (pageNum <= 1) return;
            pageNum--;
            queueRenderPage(pageNum);
        }

        function onNextPage() {
            if (pageNum >= pdfDoc.numPages) return;
            pageNum++;
            queueRenderPage(pageNum);
        }

        function loadPDF(url) {
            loadingBar.style.display = 'flex';
            // Cargar documento
            pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
                pdfDoc = pdfDoc_;
                pageNum = 1;
                renderPage(pageNum);
                downloadBtn.href = url;
            }).catch(function(error) {
                console.error('Error loading PDF:', error);
                loadingBar.innerHTML = 'Error loading Document';
            });
        }

        // Event Listeners
        prevBtn.addEventListener('click', onPrevPage);
        nextBtn.addEventListener('click', onNextPage);

        pdfTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all
                pdfTabs.forEach(t => t.classList.remove('active'));
                // Add active to clicked
                tab.classList.add('active');

                // Load PDF
                const url = tab.getAttribute('data-doc');
                loadPDF(url);
            });
        });

        // Cargar el primer PDF por defecto (Manifesto)
        if (pdfTabs.length > 0) {
            loadPDF(pdfTabs[0].getAttribute('data-doc'));
        }
    }

    // -----------------------------------------------------------------
    // 12. GALERÍA DINÁMICA & LIGHTBOX
    // -----------------------------------------------------------------
    const galleryContainer = document.getElementById('gallery-container');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');

    if (galleryContainer) {
        // Lista de imágenes nuevas (detectadas previamente)
        const galleryImages = [
            'assets/images/1770139943296.jpg',
            'assets/images/20ab6466e2e30106f02c1ad1668298f9.jpg',
            'assets/images/40dd707d91ad994cd68b8eaf80961eac.jpg',
            'assets/images/475ee13efc94be27662e66d298b2a5c2.jpg',
            'assets/images/75d6d55ec2e77e49fc542b313b1c94a9.jpg',
            'assets/images/87f20a6bfbec35b636cdd1b349985f18.jpg',
            'assets/images/91fc2ddb16d4a4c68b11580bda5f0134.jpg',
            'assets/images/9353b554cdfefaa0c93f122a651b2205.jpg',
            'assets/images/bef47e2924e2634d4e888be2b6f7b4c1.jpg',
            'assets/images/c0e3ec8819e6ec3043f7102bf57c0598.jpg',
            'assets/images/c396a99f21b4f4176ef9a491ab085147 (1).jpg',
            'assets/images/d2cbe5e000664f84cd9675cf6ef6b02a.jpg',
            'assets/images/e00f2be57f9f92bec9d2edc10c947beb.jpg',
            'assets/images/e26041023c1e4a5a60ad39225d2b9ea9.jpg',
            'assets/images/eecccdec0aa43c529abb21d4899b5dcd.jpg'
        ];

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

        // Cerrar Lightbox
        if (closeLightbox) {
            closeLightbox.addEventListener('click', () => {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        // Cerrar al hacer clic fuera de la imagen
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Inicializar cuando todos los recursos (imágenes, fuentes) estén cargados
if (typeof window !== 'undefined') {
    window.addEventListener('load', initSite);

    // Fallback de seguridad por si load falla o tarda demasiado (5 segundos)
    setTimeout(() => {
        if (!isInitialized) {
            console.warn("Load timeout triggered. Forcing init.");
            initSite();
        }
    }, 5000);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateMailtoLink };
}
