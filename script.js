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

// Global variables for WebGL Experience to be accessible by other functions if needed
let webglScene, webglCamera, webglRenderer, sphereMesh;
let webglClock;

if (typeof THREE !== 'undefined') {
    webglClock = new THREE.Clock();
}

// --- WebGL Experience Controller ---
const WebGLController = {
    scene: null,
    camera: null,
    renderer: null,
    clock: null,
    container: null,
    width: 0,
    height: 0,
    mouse: new THREE.Vector2(),

    // Scene Objects
    particles: null,
    laser: null,

    init: function() {
        const canvas = document.getElementById('webgl-experience');
        if (!canvas || typeof THREE === 'undefined') return;

        this.container = canvas;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.clock = new THREE.Clock();

        // Scene
        this.scene = new THREE.Scene();
        // Fog for depth (Dark Grey/Black)
        this.scene.fog = new THREE.FogExp2(0x050505, 0.002);

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 30; // Closer for the sphere impact

        this.initSphere();

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // --- POST PROCESSING (EffectComposer) ---
        // Basic RGB Shift for Chromatic Aberration
        // We'll use a simple Full Screen Quad approach to avoid huge bundle size
        this.initPostProcessing();

        // Event Listeners
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Start Loop
        this.animate();
        console.log("WebGL Controller Initialized");
    },

    onResize: function() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Update Render Target Size
        if (this.renderTarget) {
             const pixelRatio = this.renderer.getPixelRatio();
             this.renderTarget.setSize(this.width * pixelRatio, this.height * pixelRatio);
        }

        // Update Resolution Uniforms
        if (this.particles) {
            this.particles.material.uniforms.uResolution.value.set(this.width, this.height);
        }
    },

    onMouseMove: function(event) {
        // Normalize mouse coordinates (-1 to 1)
        this.mouse.x = (event.clientX / this.width) * 2 - 1;
        this.mouse.y = -(event.clientY / this.height) * 2 + 1;
    },

    initSphere: function() {
        // --- 1. GEOMETRY (Sphere) ---
        // Optimization: Reduce particles on mobile
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 1500 : 5000; // Reduced from 3000/8000 for better performance

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const randoms = new Float32Array(particleCount * 3); // For noise/disintegration

        const r = 10; // Radius of the sphere

        for (let i = 0; i < particleCount; i++) {
            // Fibonacci Sphere Distribution (Even distribution on sphere surface)
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;

            const x = r * Math.cos(theta) * Math.sin(phi);
            const y = r * Math.sin(theta) * Math.sin(phi);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            randoms[i * 3] = (Math.random() - 0.5) * 2; // -1 to 1
            randoms[i * 3 + 1] = (Math.random() - 0.5) * 2;
            randoms[i * 3 + 2] = (Math.random() - 0.5) * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
        geometry.setAttribute('initialPosition', new THREE.BufferAttribute(positions.slice(), 3)); // Save initial state

        // --- 2. MATERIAL (Shader) ---
        // Colors: Dark Grey base, Lime Green accents
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector3(0, 0, 0) }, // Mouse projected to world
                uResolution: { value: new THREE.Vector2(this.width, this.height) },
                uDisintegration: { value: 0.0 }, // 0 = Sphere, 1 = Dust
                uColorBase: { value: new THREE.Color(0x888888) }, // Silver/Grey
                uColorAccent: { value: new THREE.Color(0x39FF14) } // Neon Lime Green
            },
            vertexShader: `
                uniform float uTime;
                uniform float uDisintegration;
                uniform vec3 uMouse;

                attribute vec3 aRandom;
                attribute vec3 initialPosition;

                varying float vDistanceToMouse;
                varying float vDisintegration;

                // Simplex Noise Function (Simplified)
                float random (vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                void main() {
                    vec3 pos = initialPosition;

                    // --- 1. Disintegration Logic ---
                    // Explode outwards based on random direction and disintegration factor
                    // Add some curl/noise
                    float noise = sin(pos.y * 0.5 + uTime) * cos(pos.x * 0.5 + uTime);

                    vec3 explosionDir = normalize(pos) + (aRandom * 0.5);
                    pos += explosionDir * uDisintegration * 50.0; // Explosion radius

                    // Add some rotation/swirl when disintegrated
                    if (uDisintegration > 0.1) {
                        float angle = uDisintegration * 2.0 * (length(pos.xy) * 0.1);
                        float s = sin(angle);
                        float c = cos(angle);
                        float nx = pos.x * c - pos.z * s;
                        float nz = pos.x * s + pos.z * c;
                        pos.x = nx;
                        pos.z = nz;
                    }

                    // --- 2. Mouse Interaction (Magnetic) ---
                    // Only active when sphere is mostly intact
                    float d = distance(pos, uMouse);
                    vDistanceToMouse = d;

                    if (uDisintegration < 0.5) {
                        float force = max(0.0, (10.0 - d) / 10.0); // Radius 10 interaction
                        // Repulse or Attract? Let's gently attract/distort
                        vec3 dir = normalize(pos - uMouse);
                        pos += dir * force * 1.5 * sin(uTime * 2.0); // Pulse effect
                    }

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;

                    // Size attenuation
                    gl_PointSize = (4.0 / -mvPosition.z) * 50.0;

                    vDisintegration = uDisintegration;
                }
            `,
            fragmentShader: `
                uniform vec3 uColorBase;
                uniform vec3 uColorAccent;

                varying float vDistanceToMouse;
                varying float vDisintegration;

                void main() {
                    // Circular particle
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    if (length(coord) > 0.5) discard;

                    // Soft edge
                    float strength = 1.0 - (length(coord) * 2.0);
                    strength = pow(strength, 2.0);

                    // Color mixing
                    // Base is Grey. Mouse proximity turns it Lime Green.
                    // High disintegration also adds Green sparkles.

                    vec3 color = uColorBase;

                    // Mouse glow
                    float glow = max(0.0, (10.0 - vDistanceToMouse) / 10.0);
                    color = mix(color, uColorAccent, glow * 0.8);

                    // Disintegration random sparkles
                    if (vDisintegration > 0.1) {
                         // Random flicker based on gl_FragCoord could be too noisy, keep it simple
                         color = mix(color, uColorAccent, vDisintegration * 0.5);
                    }

                    gl_FragColor = vec4(color, strength);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        this.initLaser();
    },

    initLaser: function() {
        // --- LASER / PHOTON BEAM ---
        // A glowing trail that follows a spline curve down the page

        // 1. Define Curve Points (approximate section positions in 3D space)
        // Adjust these to weave through your content
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),         // Hero (Start)
            new THREE.Vector3(10, -20, -10),    // Architecture (Right)
            new THREE.Vector3(-10, -40, -5),    // ARTUETR5D (Left)
            new THREE.Vector3(5, -60, -15),     // MEM-SYN5DX (Center-Right)
            new THREE.Vector3(0, -80, 0),       // Codex (Center)
            new THREE.Vector3(-8, -100, -10),   // Services (Left)
            new THREE.Vector3(8, -120, -5),     // Gallery (Right)
            new THREE.Vector3(0, -140, 0)       // Footer (End)
        ]);

        // 2. Tube Geometry along the curve
        // Optimization: Reduce segments on mobile
        const isMobile = window.innerWidth < 768;
        const segments = isMobile ? 50 : 100;
        const radialSegments = isMobile ? 4 : 8;

        const tubeGeometry = new THREE.TubeGeometry(curve, segments, 0.4, radialSegments, false);

        // 3. Material (Glowing Green Energy)
        const tubeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uProgress: { value: 0 }, // Driven by scroll
                uColorCore: { value: new THREE.Color(0xFFFFFF) }, // White Hot Center
                uColorGlow: { value: new THREE.Color(0x39FF14) }  // Neon Lime Glow
            },
            vertexShader: `
                uniform float uTime;
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vViewPosition;

                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform float uProgress;
                uniform vec3 uColorCore;
                uniform vec3 uColorGlow;

                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vViewPosition;

                void main() {
                    // Calculate "Head" of the laser based on scroll progress
                    // uProgress goes 0 -> 1.
                    // We want a trail behind it.

                    float headPos = uProgress;
                    float trailLength = 0.3; // Length of the laser beam

                    // Distance of this fragment from the "head" along the tube (vUv.x)
                    float dist = headPos - vUv.x;

                    // Visible range: just behind the head
                    if (dist < 0.0 || dist > trailLength) discard;

                    // Intensity fades out along the trail
                    float alpha = 1.0 - (dist / trailLength);
                    alpha = pow(alpha, 2.0); // Non-linear fade

                    // Core glow (Fresnel effect)
                    vec3 viewDir = normalize(vViewPosition);
                    float fresnel = dot(viewDir, vNormal);
                    fresnel = pow(1.0 - abs(fresnel), 2.0);

                    vec3 color = mix(uColorGlow, uColorCore, fresnel * alpha);

                    // Add some energy pulse
                    float pulse = sin(vUv.x * 50.0 - uTime * 10.0);
                    color += uColorGlow * pulse * 0.2;

                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });

        this.laser = new THREE.Mesh(tubeGeometry, tubeMaterial);
        this.scene.add(this.laser);
    },

    initPostProcessing: function() {
        // Optimization: Skip Post-Processing on Mobile if performance is critical
        // But Chromatic Aberration is a key visual request, so we keep it light.
        // We can lower resolution of the render target on mobile.

        const isMobile = window.innerWidth < 768;
        const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);

        // 1. Render Target (Scene Buffer)
        this.renderTarget = new THREE.WebGLRenderTarget(
            this.width * pixelRatio,
            this.height * pixelRatio
        );

        // 2. Post Scene (Just a plane filling the screen)
        this.postScene = new THREE.Scene();
        this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // 3. Chromatic Aberration Shader
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null }, // The rendered scene texture
                uAberration: { value: 0.0 }, // Intensity driven by scroll velocity
                uTime: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float uAberration;
                varying vec2 vUv;

                void main() {
                    // Split RGB channels based on uAberration offset
                    // Red shift
                    vec4 r_tex = texture2D(tDiffuse, vUv + vec2(uAberration, 0.0));
                    // Green (No shift)
                    vec4 g_tex = texture2D(tDiffuse, vUv);
                    // Blue shift (Opposite)
                    vec4 b_tex = texture2D(tDiffuse, vUv - vec2(uAberration, 0.0));

                    // Mix colors and maximize alpha to keep fringes visible
                    gl_FragColor = vec4(r_tex.r, g_tex.g, b_tex.b, max(max(r_tex.a, g_tex.a), b_tex.a));
                }
            `,
            transparent: true
        });

        this.postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial);
        this.postScene.add(this.postQuad);
    },

    animate: function() {
        requestAnimationFrame(this.animate.bind(this));

        const elapsedTime = this.clock.getElapsedTime();

        // Update Uniforms
        if (this.laser) {
             this.laser.material.uniforms.uTime.value = elapsedTime;
        }

        if (this.particles) {
            this.particles.material.uniforms.uTime.value = elapsedTime;

            // Mouse Raycasting for 3D interaction
            // Project mouse (2D NDC) to 3D world at Sphere depth (Z=0 approximately)
            // Camera Z=30. Sphere Z=0.
            const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
            vector.unproject(this.camera);
            const dir = vector.sub(this.camera.position).normalize();
            const distance = -this.camera.position.z / dir.z; // Intersection with Z=0 plane
            const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

            this.particles.material.uniforms.uMouse.value.copy(pos);

            // Slow rotation of the sphere (only when intact)
            if (this.particles.material.uniforms.uDisintegration.value < 0.8) {
                this.particles.rotation.y = elapsedTime * 0.05;
            }
        }

        // --- RENDER PIPELINE ---

        if (this.renderTarget && this.postQuad) {
            // 1. Render Scene to Texture
            this.renderer.setRenderTarget(this.renderTarget);
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);

            // 2. Render Post Quad to Screen
            this.renderer.setRenderTarget(null);
            this.postQuad.material.uniforms.tDiffuse.value = this.renderTarget.texture;

            // Calculate Velocity for Aberration (Simulated for now, hook to Lenis later)
            // Ideally pass `lenis.velocity` here via a global or shared state.
            // For now, let's just make it static or pulse slightly to show it works.
            // Or access lenis instance if available globally? (It is local in initSite)

            // Fallback: Pulse aberration slightly
            // this.postQuad.material.uniforms.uAberration.value = 0.005 + Math.sin(elapsedTime * 5.0) * 0.002;

            this.renderer.render(this.postScene, this.postCamera);
        } else {
            // Fallback standard render
            this.renderer.render(this.scene, this.camera);
        }
    }
};

function initWebGLExperience() {
    WebGLController.init();
    initScrollAnimations();
}

function initScrollAnimations() {
    // Ensure GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const controller = WebGLController;

    // --- Phase 1: Disintegration (Hero -> Architecture) ---
    // Trigger: Scrolling out of the Hero section
    // Action: Increase uDisintegration from 0 to 1

    ScrollTrigger.create({
        trigger: "#inicio",
        start: "top top",
        end: "bottom center",
        scrub: 1, // Smooth scrubbing
        onUpdate: (self) => {
            if (controller.particles) {
                // Map scroll progress (0 to 1) directly to disintegration
                // 0 = Sphere, 1 = Full Dust Explosion
                // We use self.progress to drive the animation

                // Ease the value slightly for a more "explosive" feel at the start
                const progress = self.progress;
                controller.particles.material.uniforms.uDisintegration.value = progress;

                // Also scale up the entire particle system slightly to simulate camera fly-through
                const scale = 1 + progress * 2.0;
                controller.particles.scale.set(scale, scale, scale);

                // Fade out opacity if needed (optional, handled by shader spread)
            }
        }
    });

    // --- Phase 2: Galaxy/Black Hole Formation (Architecture -> ARTUETR5D) ---
    // Trigger: Scrolling through the content sections
    // Action: Modulate the particle behavior to swirl

    // We can add a second uniform for "Swirl" or "Vortex" mode later if desired,
    // or just rely on the disintegration noise.
    // For now, let's keep the particles suspended as "Star Dust" throughout the page.

    // Optional: Move camera or particles based on global scroll
    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
            if (controller.particles) {
                // Slowly rotate the entire galaxy of particles as user scrolls down
                controller.particles.rotation.z = self.progress * Math.PI * 0.5; // 90 deg rotation
                controller.particles.rotation.x = self.progress * Math.PI * 0.2;
            }

            if (controller.laser) {
                // Move the laser head along the path
                // self.progress (0 to 1) matches the tube's UV.x (0 to 1)
                controller.laser.material.uniforms.uProgress.value = self.progress;
            }
        }
    });
}

/**
 * Configura los fondos dinámicos basados en la galería de imágenes.
 * Se llama al inicio para reemplazar el contenido de #bg-container.
 */
function setupDynamicBackgrounds() {
    const bgContainer = document.getElementById('bg-container');
    const sections = document.querySelectorAll('section');

    // Lista de imágenes de la galería (usando las solicitadas a partir de la 3ra imagen)
    // Indices originales: 0, 1 (excluidas), 2...14 (incluidas)
    const allGalleryImages = [
        'assets/images/1770139943296.jpg', // 0 (Excluida)
        'assets/images/20ab6466e2e30106f02c1ad1668298f9.jpg', // 1 (Excluida)
        'assets/images/40dd707d91ad994cd68b8eaf80961eac.jpg', // 2
        'assets/images/475ee13efc94be27662e66d298b2a5c2.jpg', // 3
        'assets/images/75d6d55ec2e77e49fc542b313b1c94a9.jpg', // 4
        'assets/images/87f20a6bfbec35b636cdd1b349985f18.jpg', // 5
        'assets/images/91fc2ddb16d4a4c68b11580bda5f0134.jpg', // 6
        'assets/images/9353b554cdfefaa0c93f122a651b2205.jpg', // 7
        'assets/images/bef47e2924e2634d4e888be2b6f7b4c1.jpg', // 8
        'assets/images/c0e3ec8819e6ec3043f7102bf57c0598.jpg', // 9
        'assets/images/c396a99f21b4f4176ef9a491ab085147 (1).jpg', // 10
        'assets/images/d2cbe5e000664f84cd9675cf6ef6b02a.jpg', // 11
        'assets/images/e00f2be57f9f92bec9d2edc10c947beb.jpg', // 12
        'assets/images/e26041023c1e4a5a60ad39225d2b9ea9.jpg', // 13
        'assets/images/eecccdec0aa43c529abb21d4899b5dcd.jpg'  // 14
    ];

    // Filtramos las imágenes a usar (a partir del índice 2)
    const backgroundImages = allGalleryImages.slice(2);

    if (bgContainer && sections.length > 0) {
        // Limpiar contenedor actual
        bgContainer.innerHTML = '';

        sections.forEach((section, index) => {
            // Seleccionar imagen ciclicamente
            const imgIndex = index % backgroundImages.length;
            const imgSrc = backgroundImages[imgIndex];

            const layer = document.createElement('div');
            layer.className = 'bg-layer';
            // La primera capa (index 0) debe estar activa inicialmente
            if (index === 0) layer.classList.add('active');

            layer.id = `bg-${section.id}`;
            layer.style.backgroundImage = `url('${imgSrc}')`;

            bgContainer.appendChild(layer);
        });
        console.log("Dynamic backgrounds configured.");
    } else {
        console.warn("Could not configure dynamic backgrounds: container or sections missing.");
    }
}

function initSite() {
    if (isInitialized) return;
    isInitialized = true;

    // -----------------------------------------------------------------
    // 0. INICIALIZACIÓN DE WEBGL EXPERIENCE (THREE.JS)
    // -----------------------------------------------------------------
    initWebGLExperience();

    // -----------------------------------------------------------------
    // 0.1 CONFIGURACIÓN DE FONDOS DINÁMICOS DESDE GALERÍA
    // -----------------------------------------------------------------
    setupDynamicBackgrounds();

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
    lenis.on('scroll', (e) => {
        ScrollTrigger.update();

        // Pass scroll velocity to WebGL Controller for Chromatic Aberration
        if (WebGLController.postQuad) {
            // Normalize velocity roughly. Max scroll speed ~20-50?
            // Effect range: 0.0 to 0.02
            const velocity = Math.abs(e.velocity);
            const intensity = Math.min(velocity * 0.001, 0.02);

            // Smoothly interpolate current value to target intensity
            // (Simplistic lerp for now, handled in loop would be better but this works on scroll event)
            WebGLController.postQuad.material.uniforms.uAberration.value = intensity;
        }
    });

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
    const bgLayers = document.querySelectorAll('.bg-layer'); // Note: This might need refreshing if called before setupDynamicBackgrounds finishes, but since setupDynamicBackgrounds is synchronous DOM manip, it should be fine if we re-query.

    // Re-query layers after dynamic generation
    const updatedBgLayers = document.querySelectorAll('.bg-layer');

    sections.forEach((section, index) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => updateBackground(section.id, updatedBgLayers),
            onEnterBack: () => updateBackground(section.id, updatedBgLayers),
        });
    });

    function updateBackground(id, layers) {
        layers.forEach(layer => {
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
