// =================================================================
// SCRIPT.JS - INTERACTIVIDAD, LENIS Y GSAP
// =================================================================

let isInitialized = false;

// Constant for the contact email address
const CONTACT_EMAIL = 'artuetr5d@gmail.com';

/**
 * Generates a mailto link for a given service name.
 * @param {string} serviceName - The name of the service.
 * @returns {string} The generated mailto link.
 */
function generateMailtoLink(serviceName) {
    const subject = encodeURIComponent(`Consulta sobre: ${serviceName}`);
    const body = encodeURIComponent(`Hola, estoy interesado en el servicio: ${serviceName}`);
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

// Global variables for WebGL Experience to be accessible by other functions if needed
let webglScene, webglCamera, webglRenderer, sphereMesh;
let webglClock;

if (typeof THREE !== 'undefined') {
    webglClock = new THREE.Clock();
}

/**
 * Calculates the openness of the hand (tension) based on MediaPipe landmarks.
 * @param {Array} landmarks - Hand landmarks.
 * @returns {number} Tension value between 0.1 and 2.5.
 */
function calculateHandOpenness(landmarks) {
    if (!landmarks || !Array.isArray(landmarks) || landmarks.length < 21) return 1.0;

    // Puntos clave: muñeca (0), puntas de los dedos (8, 12, 16, 20)
    const wrist = landmarks[0];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    // Safety check for landmark objects
    if (!wrist || !indexTip || !middleTip || !ringTip || !pinkyTip) return 1.0;

    // Calcular distancias medias desde la muñeca a las puntas
    const distIndex = Math.hypot(indexTip.x - wrist.x, indexTip.y - wrist.y);
    const distMiddle = Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y);
    const distRing = Math.hypot(ringTip.x - wrist.x, ringTip.y - wrist.y);
    const distPinky = Math.hypot(pinkyTip.x - wrist.x, pinkyTip.y - wrist.y);

    const avgDist = (distIndex + distMiddle + distRing + distPinky) / 4.0;

    // Normalizar (0.1 puño cerrado, 0.6 mano abierta aprox)
    let tension = (avgDist - 0.1) * 2.0 + 0.5;
    return Math.max(0.1, Math.min(tension, 2.5)); // Limitar entre 0.1 y 2.5
}

function initWebGLExperience() {
    const canvas = document.getElementById('webgl-experience');
    if (!canvas || typeof THREE === 'undefined') return;

    // --- ESCENA Y CÁMARA ---
    webglScene = new THREE.Scene();

    // Configuración de cámara para ver la esfera en el centro
    webglCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    webglCamera.position.z = 12; // Ajustado para ver la esfera completa

    // --- RENDERER ---
    webglRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    webglRenderer.setSize(window.innerWidth, window.innerHeight);
    webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- NUEVO SISTEMA DE PARTÍCULAS INTERACTIVAS (REEMPLAZA HERO SPHERE) ---
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 5000 : 15000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    // Inicializar posiciones aleatorias
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 400;
        targetPositions[i] = positions[i];
        colors[i] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Shaders Cuánticos para Distorsión Espacial y Aberración Cromática (Realidad Sostenida)
    const vertexShader = `
        varying vec3 vColor;
        uniform float uTime;
        uniform float uTension;
        uniform float uScrollTension;

        void main() {
            vColor = color;

            vec3 pos = position;

            // Ondas espaciales dinámicas basadas en el tiempo y posición
            float tensionCombined = max(uTension, uScrollTension);
            float waveX = sin(pos.y * 0.015 + uTime * 1.2) * 3.0 * tensionCombined;
            float waveY = cos(pos.x * 0.015 + uTime * 1.2) * 3.0 * tensionCombined;
            float waveZ = sin(pos.z * 0.01 + uTime) * 4.0 * tensionCombined;

            pos.x += waveX;
            pos.y += waveY;
            pos.z += waveZ;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

            // El tamaño del punto reacciona a la profundidad y la tensión
            gl_PointSize = (2.5 * tensionCombined + 1.0) * (200.0 / -mvPosition.z);
            if(gl_PointSize < 1.0) gl_PointSize = 1.0;
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    const fragmentShader = `
        varying vec3 vColor;
        uniform float uTime;

        void main() {
            // Forma circular difuminada
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            if (dist > 0.5) discard;

            // Aberración Cromática (Desplazamiento RGB en los bordes)
            float aberration = dist * 0.4;

            float r = vColor.r + center.x * aberration;
            float g = vColor.g;
            float b = vColor.b - center.x * aberration;

            // Suavizado del borde
            float alpha = (0.5 - dist) * 2.5;

            gl_FragColor = vec4(r, g, b, alpha * 0.85);
        }
    `;

    const sphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uTension: { value: 1.0 },
            uScrollTension: { value: 1.0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true
    });

    sphereMesh = new THREE.Points(geometry, sphereMaterial);

    // Scale it down a bit so it fits perfectly
    sphereMesh.scale.set(0.1, 0.1, 0.1);
    webglScene.add(sphereMesh);

    // Sistema de Paletas de Degradado (LVU)
    const palettes = {
        lvu: [new THREE.Color(0x00e5ff), new THREE.Color(0x0055ff)], // Cyan a Azul profundo
        nebula: [new THREE.Color(0xff00ff), new THREE.Color(0x5500ff)], // Rosa a Morado
        solar: [new THREE.Color(0xffaa00), new THREE.Color(0xff0000)], // Amarillo a Rojo
        quantum: [new THREE.Color(0x00ffaa), new THREE.Color(0x0088ff)] // Esmeralda a Azul
    };

    function applyPalette(paletteName) {
        if (!palettes[paletteName]) return;
        const c1 = palettes[paletteName][0];
        const c2 = palettes[paletteName][1];

        for(let i=0; i<PARTICLE_COUNT; i++) {
            // Interpolar basándose en un patrón pseudo-aleatorio para dar efecto de volumen mixto
            const mixRatio = (Math.sin(i * 0.01) + 1.0) / 2.0;
            const finalColor = c1.clone().lerp(c2, mixRatio);
            colors[i*3] = finalColor.r;
            colors[i*3+1] = finalColor.g;
            colors[i*3+2] = finalColor.b;
        }
        geometry.attributes.color.needsUpdate = true;
    }

    // Iniciar con la paleta base del LVU
    applyPalette('lvu');

    // UI Listeners para Paletas
    document.querySelectorAll('.palette-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.palette-btn').forEach(b => {
                b.classList.remove('border-white/40');
                b.classList.add('border-transparent');
            });
            e.target.classList.add('border-white/40');
            e.target.classList.remove('border-transparent');
            applyPalette(e.target.dataset.palette);
        });
    });

    // Generadores de Arquetipos (Plantillas 3D)
    function getBaseShapeScale() {
        return 25; // Escala base
    }

    const shapes = {
        fireworks: () => {
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const r = Math.random() * 80;
                const theta = Math.random() * 2 * Math.PI;
                const phi = Math.acos((Math.random() * 2) - 1);

                targetPositions[i*3] = r * Math.sin(phi) * Math.cos(theta);
                targetPositions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
                targetPositions[i*3+2] = r * Math.cos(phi);
            }
        },
        heart: () => {
            const scale = 3.5;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const t = Math.random() * Math.PI * 2;
                const r = Math.random();

                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
                const z = (Math.random() - 0.5) * 10;

                targetPositions[i*3] = x * scale * Math.sqrt(r);
                targetPositions[i*3+1] = y * scale * Math.sqrt(r) + 10;
                targetPositions[i*3+2] = z;
            }
        },
        flower: () => {
            const scale = 1.5;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const u = Math.random() * Math.PI * 2;
                const v = Math.random() * Math.PI;

                const r = 30 * Math.sin(4 * u) * Math.sin(v);

                targetPositions[i*3] = r * Math.cos(u) * scale;
                targetPositions[i*3+1] = r * Math.sin(u) * scale;
                targetPositions[i*3+2] = (Math.random() - 0.5) * 20;
            }
        },
        saturn: () => {
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                if (Math.random() > 0.6) {
                    // Planeta
                    const r = Math.random() * 25;
                    const theta = Math.random() * 2 * Math.PI;
                    const phi = Math.acos((Math.random() * 2) - 1);
                    targetPositions[i*3] = r * Math.sin(phi) * Math.cos(theta);
                    targetPositions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
                    targetPositions[i*3+2] = r * Math.cos(phi);
                } else {
                    // Anillos
                    const r = 35 + Math.random() * 30;
                    const theta = Math.random() * 2 * Math.PI;
                    targetPositions[i*3] = r * Math.cos(theta);
                    targetPositions[i*3+1] = (Math.random() - 0.5) * 4;
                    targetPositions[i*3+2] = r * Math.sin(theta);
                }
            }
            // Rotar
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                let y = targetPositions[i*3+1];
                let z = targetPositions[i*3+2];
                targetPositions[i*3+1] = y * Math.cos(0.4) - z * Math.sin(0.4);
                targetPositions[i*3+2] = y * Math.sin(0.4) + z * Math.cos(0.4);
            }
        },
        buddha: () => {
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const rand = Math.random();
                if (rand < 0.2) {
                    // Cabeza
                    const r = Math.random() * 8;
                    const theta = Math.random() * 2 * Math.PI;
                    const phi = Math.acos((Math.random() * 2) - 1);
                    targetPositions[i*3] = r * Math.sin(phi) * Math.cos(theta);
                    targetPositions[i*3+1] = r * Math.sin(phi) * Math.sin(theta) + 35;
                    targetPositions[i*3+2] = r * Math.cos(phi);
                } else if (rand < 0.6) {
                    // Torso
                    const h = Math.random() * 35;
                    const r = (1 - (h / 45)) * 18 * Math.random();
                    const theta = Math.random() * 2 * Math.PI;
                    targetPositions[i*3] = r * Math.cos(theta);
                    targetPositions[i*3+1] = h - 5;
                    targetPositions[i*3+2] = r * Math.sin(theta);
                } else {
                    // Base (Piernas cruzadas)
                    const theta = Math.random() * 2 * Math.PI;
                    const r = Math.random() * 25;
                    targetPositions[i*3] = r * Math.cos(theta);
                    targetPositions[i*3+1] = (Math.random() - 0.5) * 5 - 10;
                    targetPositions[i*3+2] = r * Math.sin(theta) * 0.7; // Aplanar un poco
                }
            }
        }
    };

    function applyShape(shapeName) {
        if (shapes[shapeName]) {
            shapes[shapeName]();
        }
    }

    // Iniciar con fireworks
    applyShape('fireworks');

    // UI Listeners para Formas
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.template-btn').forEach(b => {
                b.classList.remove('bg-white/10', 'border-white/20');
            });
            e.currentTarget.classList.add('bg-white/10', 'border-white/20');
            applyShape(e.currentTarget.dataset.shape);
        });
    });

    // Animación de interpolación (lerp) hacia las targetPositions
    function updateParticlesLerp() {
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
            positions[i] += (targetPositions[i] - positions[i]) * 0.05;
        }
        geometry.attributes.position.needsUpdate = true;
    }

    // --- MediaPipe Hands Logic ---
    let handTension = 1.0;
    let isCameraActive = false;
    let cameraInstance = null;

    const videoElement = document.getElementById('webcam-video');
    const previewContainer = document.getElementById('video-preview-container');
    const btnStartCamera = document.getElementById('btn-start-camera');
    const cameraStatus = document.getElementById('camera-status');
    const loader = document.getElementById('loader');
    const cameraBtnText = document.getElementById('camera-btn-text');

    function onResults(results) {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            const targetTension = calculateHandOpenness(landmarks);

            // Suavizar la transición de tensión
            handTension += (targetTension - handTension) * 0.1;
            sphereMesh.material.uniforms.uTension.value = handTension;
        } else {
            // Regresar a la tensión normal suavemente si no hay mano
            handTension += (1.0 - handTension) * 0.05;
            sphereMesh.material.uniforms.uTension.value = handTension;
        }
    }

    // Iniciar MediaPipe solo si se requiere
    function startMediaPipe() {
        if (typeof Hands === 'undefined') {
            console.error("MediaPipe Hands not loaded.");
            return;
        }

        loader.classList.remove('hidden');

        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);

        cameraInstance = new Camera(videoElement, {
            onFrame: async () => {
                await hands.send({image: videoElement});
            },
            width: 640,
            height: 480
        });

        cameraInstance.start()
            .then(() => {
                loader.classList.add('hidden');
                previewContainer.style.display = 'block';
                cameraStatus.textContent = 'Cámara on';
                isCameraActive = true;
                cameraBtnText.textContent = "Desactivar Realidad Sostenida";
            })
            .catch((err) => {
                console.error(err);
                loader.classList.add('hidden');
                alert("No se pudo iniciar la cámara.");
            });
    }

    function stopMediaPipe() {
        if (cameraInstance) {
            cameraInstance.stop();
            const stream = videoElement.srcObject;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
            videoElement.srcObject = null;
        }
        previewContainer.style.display = 'none';
        cameraStatus.textContent = 'Cámara off';
        isCameraActive = false;
        cameraBtnText.textContent = "Activar Realidad Sostenida";

        // Reset tension
        gsap.to(sphereMesh.material.uniforms.uTension, { value: 1.0, duration: 1.0 });
    }

    if (btnStartCamera) {
        btnStartCamera.addEventListener('click', () => {
            if (isCameraActive) {
                stopMediaPipe();
            } else {
                startMediaPipe();
            }
        });
    }


    // --- RESIZE HANDLER ---
    window.addEventListener('resize', () => {
        webglCamera.aspect = window.innerWidth / window.innerHeight;
        webglCamera.updateProjectionMatrix();
        webglRenderer.setSize(window.innerWidth, window.innerHeight);
        if(sphereMesh.material.uniforms.uResolution) {
             sphereMesh.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
    });

    // Scroll interaction for particles (when camera is off)
    let particleScrollTimeout;
    let targetScrollTension = 1.0;

    // Asignamos globalmente un listener simple en window además de lenis para asegurar reactividad
    window.addEventListener('scroll', () => {
        if (!isCameraActive && sphereMesh) {
            targetScrollTension = 2.5; // Expande las partículas
            clearTimeout(particleScrollTimeout);
            particleScrollTimeout = setTimeout(() => {
                targetScrollTension = 1.0; // Contrae
            }, 200);
        }
    });


    // --- RENDER LOOP ---
    function animate() {
        requestAnimationFrame(animate);

        const time = webglClock.getElapsedTime();

        if (sphereMesh) {
            sphereMesh.material.uniforms.uTime.value = time;
            sphereMesh.rotation.y = time * 0.1; // Slow rotation

            // Lerp para suavizar el efecto de scroll en uScrollTension
            sphereMesh.material.uniforms.uScrollTension.value += (targetScrollTension - sphereMesh.material.uniforms.uScrollTension.value) * 0.1;

            updateParticlesLerp();
        }

        webglRenderer.render(webglScene, webglCamera);
    }
    animate();

    // --- GSAP SCROLLTRIGGER INTEGRATION FOR SPHERE ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const tlSphere = gsap.timeline({
            scrollTrigger: {
                trigger: "#inicio",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        if (sphereMesh) {
            tlSphere.to(sphereMesh.position, {
                y: 20,   // Move up
                ease: "power1.inOut"
            }, 0)
            .to(sphereMesh.rotation, {
                x: 1.0,
                ease: "none"
            }, 0)
            .to(sphereMesh.scale, {
                x: 0.05,
                y: 0.05,
                z: 0.05,
                ease: "power1.inOut"
            }, 0);
        }
    }
}

/**
 * Updates all static mailto links in the DOM to use the centralized email constant.
 * This ensures consistency across the site without manually editing HTML.
 */
function updateStaticEmailLinks() {
    const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
    mailtoLinks.forEach(link => {
        const href = link.getAttribute('href');
        const emailMatch = href.match(/mailto:([^?]+)/);

        if (emailMatch && emailMatch[1] !== CONTACT_EMAIL) {
            // Replace the email in the href attribute
            const newHref = href.replace(emailMatch[1], CONTACT_EMAIL);
            link.setAttribute('href', newHref);

            // If the link text is exactly the old email, update it to the new one
            // We trim to avoid issues with whitespace
            if (link.textContent.trim() === emailMatch[1]) {
                 // Check if the link has children (like icons) to avoid overwriting them entirely if not intended
                 // In the provided HTML, the email link has an icon: <i class="fas fa-envelope"></i>\n artuetr5d@gmail.com
                 // So we need to be careful.
                 // Strategy: traverse child nodes and replace text nodes that match the email.

                 link.childNodes.forEach(node => {
                     if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === emailMatch[1]) {
                         node.textContent = node.textContent.replace(emailMatch[1], CONTACT_EMAIL);
                     }
                 });
            }
        } else if (emailMatch && emailMatch[1] === CONTACT_EMAIL) {
             // Even if the email matches, let's ensure the displayed text matches (if it's meant to be the email)
             // This handles cases where the HTML might have the right href but wrong text, or vice versa if we change the constant.
             // However, strictly speaking, the requirement is to update based on the constant.

             // Let's look for text nodes containing the *old* email if we knew it, but we don't necessarily know the "old" one if we just look at the constant.
             // But we can check if the text content *looks* like an email and is NOT the current constant.
             // For now, let's just stick to updating the href.
        }
    });

    // Specifically target elements that display the email text but might not be links or might need specific updating
    // Based on index.html: <a href="mailto:artuetr5d@gmail.com" class="email-link"><i class="fas fa-envelope"></i>\n artuetr5d@gmail.com</a>
    // The previous loop handles the href. Now let's handle the text content more robustly for specific known classes if needed.
    // The previous loop's text node logic should cover the case in index.html where the text is a direct child.
}

function initSite() {
    if (isInitialized) return;
    isInitialized = true;

    // Update static email links
    updateStaticEmailLinks();

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
    // 4. TRANSICIÓN DE FONDOS (VIDEOS ANIMADOS CON SCROLL)
    // -----------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const bgVideo1 = document.getElementById('bg-video-1');
    const bgVideo2 = document.getElementById('bg-video-2');

    if (bgVideo1 && bgVideo2) {
        // Mapear los 14 videos a la ruta correspondiente
        const videoSources = Array.from({ length: 14 }, (_, i) => `assets/animaciones fondo pag/${i + 1}.mp4`);
        let currentVideoIndex = 0;
        let activeVideoEl = bgVideo1;
        let hiddenVideoEl = bgVideo2;

        activeVideoEl.src = videoSources[currentVideoIndex];
        activeVideoEl.load();
        activeVideoEl.play().catch(e => console.warn("Autoplay prevenido. Interacción requerida.", e));

        // Preload next
        if (videoSources.length > 1) {
            hiddenVideoEl.src = videoSources[1];
            hiddenVideoEl.load();
        }

        // Cambiar el video según la sección mediante el scroll (crossfade)
        lenis.on('scroll', (e) => {
            const progress = e.progress; // 0 to 1
            const totalVideos = videoSources.length;
            const targetIndex = Math.min(Math.floor(progress * totalVideos), totalVideos - 1);

            if (targetIndex !== currentVideoIndex && targetIndex >= 0) {
                currentVideoIndex = targetIndex;

                // Preparar el video oculto con la nueva fuente si es necesario
                const currentSrc = hiddenVideoEl.getAttribute('src');
                if (currentSrc !== videoSources[currentVideoIndex]) {
                    hiddenVideoEl.src = videoSources[currentVideoIndex];
                    hiddenVideoEl.load();
                }

                hiddenVideoEl.play().catch(() => {});

                // Ejecutar crossfade
                hiddenVideoEl.classList.add('active');
                activeVideoEl.classList.remove('active');

                // Pausar el video que se ocultó después de la transición
                const prevActive = activeVideoEl;
                setTimeout(() => {
                    // Only pause if it's still not the active video (prevents freezing on rapid scrolls)
                    if (!prevActive.classList.contains('active')) {
                        prevActive.pause();
                    }
                }, 1000); // 1s coincide con el CSS transition

                // Intercambiar referencias
                const temp = activeVideoEl;
                activeVideoEl = hiddenVideoEl;
                hiddenVideoEl = temp;
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

        let lastFocusedElement = null;

        const openLightbox = (src, triggerElement) => {
            lastFocusedElement = triggerElement;
            lightbox.style.display = 'block';
            lightboxImg.src = src;
            document.body.style.overflow = 'hidden'; // Bloquear scroll
            if (closeLightbox) {
                closeLightbox.focus();
            }
        };

        const closeLightboxModal = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        };

        // Generar items de galería
        galleryImages.forEach(src => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.tabIndex = 0;
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'Open image in lightbox');

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
                openLightbox(src, item);
            });

            // Evento Teclado para Lightbox
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(src, item);
                }
            });

            galleryContainer.appendChild(item);
        });

        // Cerrar Lightbox
        if (closeLightbox) {
            closeLightbox.addEventListener('click', closeLightboxModal);

            // Cerrar con Enter/Espacio en el botón
            closeLightbox.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    closeLightboxModal();
                }
            });
        }

        // Cerrar al hacer clic fuera de la imagen
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightboxModal();
            }
        });

        // Cerrar con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                closeLightboxModal();
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
    module.exports = { generateMailtoLink, CONTACT_EMAIL, calculateHandOpenness };
}
