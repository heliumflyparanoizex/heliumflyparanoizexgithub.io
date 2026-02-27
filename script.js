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

    // --- HERO SPHERE (PARTICLE SYSTEM) ---
    // Geometría base: Icosaedro con alta subdivisión (CORREGIDO PARA EVITAR CRASH)
    const sphereGeometry = new THREE.IcosahedronGeometry(4, 4); // Radio 4, detalle 4 (suficiente para puntos)

    // Convertir geometría a puntos (Particle System)
    // Extraemos posiciones y agregamos un atributo 'random' para variedad en el shader
    const positionAttribute = sphereGeometry.attributes.position;
    const vertexCount = positionAttribute.count;

    const randoms = new Float32Array(vertexCount);
    for(let i = 0; i < vertexCount; i++) {
        randoms[i] = Math.random();
    }

    sphereGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    // Custom Shader Material: Noise + Fresnel + Chromatic Aberration
    const sphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(0x00FFFF) }, // Cian base
            uFresnelColor: { value: new THREE.Color(0xFF00FF) }, // Magenta rim
            uMouse: { value: new THREE.Vector2(0, 0) },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
            uniform float uTime;
            uniform vec2 uMouse;
            attribute float aRandom;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying float vNoise;
            varying float vDistanceToMouse;

            // Simplex Noise Function (Simplified)
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
                const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

                // First corner
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 = v - i + dot(i, C.xxx) ;

                // Other corners
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );

                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
                vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

                // Permutations
                i = mod289(i);
                vec4 p = permute( permute( permute(
                            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

                // Gradients: 7x7 points over a square, mapped onto an octahedron.
                // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
                float n_ = 0.142857142857; // 1.0/7.0
                vec3  ns = n_ * D.wyz - D.xzx;

                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);

                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );

                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));

                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);

                //Normalise gradients
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;

                // Mix final noise value
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                            dot(p2,x2), dot(p3,x3) ) );
            }

            void main() {
                vNormal = normal;

                // Noise Calculation for Displacement
                float noise = snoise(position * 0.5 + uTime * 0.2);
                vNoise = noise;

                // Displace Vertex along normal
                vec3 newPos = position + normal * noise * 1.5;

                // Interaction: Mouse Influence (Simple repulsion/attraction)
                // Convert mouse to world space roughly or just use screen space proximity
                // Here we simply add a subtle twist based on position

                vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
                gl_Position = projectionMatrix * mvPosition;

                // Point Size based on depth and noise (Sparkle effect)
                // Ajustado para asegurar visibilidad
                gl_PointSize = (10.0 / -mvPosition.z) * (1.0 + aRandom * 2.0);

                vPosition = newPos;
            }
        `,
        fragmentShader: `
            uniform vec3 uColor;
            uniform vec3 uFresnelColor;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying float vNoise;

            void main() {
                // Circular Particle
                vec2 coord = gl_PointCoord - vec2(0.5);
                float dist = length(coord);
                if (dist > 0.5) discard;

                // Fresnel Effect Calculation (View Direction dot Normal)
                // Since these are points, we approximate normal based on sphere position
                vec3 viewDir = normalize(cameraPosition - vPosition);
                vec3 norm = normalize(vNormal); // Or vPosition for sphere
                float fresnel = dot(viewDir, norm);
                fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
                fresnel = pow(fresnel, 2.0); // Sharpen rim

                // Chromatic Aberration / Color Shift
                // Mix base color with Fresnel Color based on rim intensity + noise
                vec3 finalColor = mix(uColor, uFresnelColor, fresnel + vNoise * 0.3);

                // Add inner glow
                float strength = 1.0 - (dist * 2.0);
                strength = pow(strength, 1.5);

                gl_FragColor = vec4(finalColor * 1.5, strength * (0.8 + fresnel * 0.4));
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    sphereMesh = new THREE.Points(sphereGeometry, sphereMaterial);
    webglScene.add(sphereMesh);


    // --- RESIZE HANDLER ---
    window.addEventListener('resize', () => {
        webglCamera.aspect = window.innerWidth / window.innerHeight;
        webglCamera.updateProjectionMatrix();
        webglRenderer.setSize(window.innerWidth, window.innerHeight);
        if(sphereMesh.material.uniforms.uResolution) {
             sphereMesh.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
    });

    // --- MOUSE LISTENER FOR UNIFORMS ---
    document.addEventListener('mousemove', (e) => {
        // Normalize mouse -1 to 1
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        if(sphereMesh) {
             sphereMesh.material.uniforms.uMouse.value.set(x, y);
        }
    });

    // --- RENDER LOOP ---
    function animate() {
        requestAnimationFrame(animate);

        const time = webglClock.getElapsedTime();

        if (sphereMesh) {
            sphereMesh.material.uniforms.uTime.value = time;
            sphereMesh.rotation.y = time * 0.05; // Slow rotation
            sphereMesh.rotation.z = time * 0.02;
        }

        webglRenderer.render(webglScene, webglCamera);
    }
    animate();

    // --- GSAP SCROLLTRIGGER INTEGRATION FOR SPHERE ---
    // Make sure GSAP and ScrollTrigger are registered
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // 1. Initial State (Hero Section)
        // Keep it visible and centered

        // 2. Scroll Animation
        // As user scrolls down from #inicio, move sphere to back or side and fade out slightly
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
                z: -10, // Move back
                y: 5,   // Move up
                ease: "power1.inOut"
            }, 0)
            .to(sphereMesh.rotation, {
                x: 2.0, // Rotate
                ease: "none"
            }, 0)
            .to(sphereMesh.scale, {
                x: 0.5,
                y: 0.5,
                z: 0.5,
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
    // 0. INICIALIZACIÓN DE WEBGL EXPERIENCE (THREE.JS)
    // -----------------------------------------------------------------
    initWebGLExperience();

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
    module.exports = { generateMailtoLink, CONTACT_EMAIL };
}
