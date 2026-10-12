import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useMotionPreference } from './MotionPreferenceProvider';
import { Sparkles, Volume2, VolumeX, Eye, Maximize2, Minimize2, ChevronDown, Compass, RotateCcw } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface BubbleData {
  mesh: THREE.Mesh;
  type: 'glass' | 'gold' | 'champagne' | 'obsidian';
  basePos: THREE.Vector3;
  baseScale: number;
  driftSpeed: THREE.Vector3;
  rotSpeed: THREE.Vector3;
  phase: number;
  ringMesh?: THREE.Mesh;
  innerSpark?: THREE.Mesh;
}

interface WaypointDirective {
  threshold: number;
  range: [number, number];
  realm: string;
  depth: string;
  quote: string;
  directive: string;
}

const WAYPOINTS: WaypointDirective[] = [
  {
    threshold: 0.05,
    range: [0.0, 0.18],
    realm: 'I. THE SOVEREIGN VISION',
    depth: '10m',
    quote: 'Every achievement begins with an audacious vision refused by the ordinary mind.',
    directive: 'Define your destination with razor-sharp specificity. Dream bigger.',
  },
  {
    threshold: 0.28,
    range: [0.20, 0.38],
    realm: 'II. THE ARCHITECTURE OF DISCIPLINE',
    depth: '38m',
    quote: 'Eliminate emotional deliberation. Execute the standard unconditionally.',
    directive: 'Consistency over comfort. Never negotiate with weakness.',
  },
  {
    threshold: 0.52,
    range: [0.44, 0.62],
    realm: 'III. THE DAILY FORGE',
    depth: '72m',
    quote: 'Your daily habits forge your future long before the external world notices.',
    directive: 'Master the mundane. Every repetition adds compound interest to your sovereignty.',
  },
  {
    threshold: 0.74,
    range: [0.66, 0.84],
    realm: 'IV. UNBROKEN STANDARDS',
    depth: '102m',
    quote: 'Keep showing up in cold silence until your results speak for you.',
    directive: 'Visual proof over verbal promises. Let dominance be your only marketing.',
  },
  {
    threshold: 0.94,
    range: [0.86, 1.0],
    realm: 'V. THE INEVITABLE APEX',
    depth: '130m',
    quote: 'When identity is forged through unbroken promises, victory is pure arithmetic.',
    directive: 'You have entered the apex tier. Become unstoppable.',
  },
];

export const ScrollBubbleUniverse3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion, performanceTier } = useMotionPreference();
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [activeWaypoint, setActiveWaypoint] = useState<WaypointDirective | null>(WAYPOINTS[0]);
  const [waypointOpacity, setWaypointOpacity] = useState(1);
  const [isInteractiveMode, setIsInteractiveMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showHUD, setShowHUD] = useState(true);

  const depthTextRef = useRef<HTMLSpanElement | null>(null);
  const waypointCardRef = useRef<HTMLDivElement | null>(null);
  const waypointRealmRef = useRef<HTMLSpanElement | null>(null);
  const waypointDepthRef = useRef<HTMLSpanElement | null>(null);
  const waypointQuoteRef = useRef<HTMLParagraphElement | null>(null);
  const waypointDirectiveRef = useRef<HTMLParagraphElement | null>(null);
  const hudRealmRef = useRef<HTMLSpanElement | null>(null);

  // References for animation state
  const stateRef = useRef({
    targetProgress: 0,
    currentProgress: 0,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    isInteracting: false,
    dragStart: { x: 0, y: 0 },
    interactiveRotation: { x: 0, y: 0 },
    lastMilestoneIndex: -1,
    manualCameraOffset: { x: 0, y: 0, z: 0 },
  });

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
    if (next) soundFx.playSuccess();
  }, [soundEnabled]);

  const toggleInteractiveMode = useCallback(() => {
    setIsInteractiveMode((prev) => {
      const next = !prev;
      stateRef.current.isInteracting = next;
      if (!next) {
        stateRef.current.interactiveRotation = { x: 0, y: 0 };
        stateRef.current.manualCameraOffset = { x: 0, y: 0, z: 0 };
      }
      soundFx.playClick();
      return next;
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    // Test WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.016);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 250);
    camera.position.set(0, 0, 16);

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: performanceTier !== 'low',
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebGlSupported(false);
      return;
    }

    const dpr = performanceTier === 'high' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0x221a0a, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffe08a, 3.2);
    dirLight1.position.set(12, 18, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd4af37, 1.8);
    dirLight2.position.set(-14, -12, -6);
    scene.add(dirLight2);

    // Camera Point Light (travels with visitor to illuminate passing bubbles)
    const cameraPointLight = new THREE.PointLight(0xfff5cc, 2.8, 32);
    cameraPointLight.position.set(0, 0, 16);
    scene.add(cameraPointLight);

    // Section Dynamic Lights
    const sectionLightHero = new THREE.PointLight(0xffe08a, 2.6, 50);
    sectionLightHero.position.set(0, 2, 6);
    scene.add(sectionLightHero);

    const sectionLightDiscipline = new THREE.PointLight(0xd4af37, 3.0, 55);
    sectionLightDiscipline.position.set(0, -2, -45);
    scene.add(sectionLightDiscipline);

    const sectionLightApex = new THREE.PointLight(0xfbbf24, 3.5, 60);
    sectionLightApex.position.set(0, 0, -100);
    scene.add(sectionLightApex);

    // 5. Materials
    // A. 24K Polished Metallic Gold
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.94,
      roughness: 0.12,
    });

    // B. Satin Champagne Gold
    const champagneMat = new THREE.MeshStandardMaterial({
      color: 0xf5d76e,
      metalness: 0.72,
      roughness: 0.32,
    });

    // C. Deep Obsidian Onyx Pearl
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      metalness: 0.90,
      roughness: 0.16,
    });

    // D. Transparent Glass Bubble (High-end Custom Fresnel Glass Shader)
    const fresnelVertexShader = `
      varying vec3 vWorldNormal;
      varying vec3 vViewPosition;
      void main() {
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fresnelFragmentShader = `
      varying vec3 vWorldNormal;
      varying vec3 vViewPosition;
      uniform vec3 uRimColor;
      uniform vec3 uBaseColor;
      uniform float uFresnelBias;
      uniform float uFresnelScale;
      uniform float uFresnelPower;
      uniform float uOpacity;

      void main() {
        vec3 normal = normalize(vWorldNormal);
        vec3 viewDir = normalize(vViewPosition);

        // Fresnel reflection factor
        float fresnel = uFresnelBias + uFresnelScale * pow(1.0 - max(dot(viewDir, normal), 0.0), uFresnelPower);
        fresnel = clamp(fresnel, 0.0, 1.0);

        // Subtle specular highlight from camera light
        vec3 lightDir = normalize(vec3(0.4, 0.7, 0.6));
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 36.0) * 1.4;

        vec3 color = mix(uBaseColor, uRimColor, fresnel) + vec3(spec * 0.95, spec * 0.88, spec * 0.6);
        float alpha = clamp(fresnel * uOpacity + 0.12 + spec * 0.45, 0.0, 0.94);

        gl_FragColor = vec4(color, alpha);
      }
    `;

    const createGlassMaterial = (baseColor = 0x111115, rimColor = 0xffe08a) => {
      return new THREE.ShaderMaterial({
        vertexShader: fresnelVertexShader,
        fragmentShader: fresnelFragmentShader,
        uniforms: {
          uBaseColor: { value: new THREE.Color(baseColor) },
          uRimColor: { value: new THREE.Color(rimColor) },
          uFresnelBias: { value: 0.08 },
          uFresnelScale: { value: 0.92 },
          uFresnelPower: { value: 2.1 },
          uOpacity: { value: 0.88 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });
    };

    const goldHaloMat = new THREE.MeshBasicMaterial({
      color: 0xffe08a,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
    });

    // 6. Geometry Pool
    const sphereSegments = performanceTier === 'low' ? 16 : 32;
    const sphereGeoUnit = new THREE.SphereGeometry(1, sphereSegments, sphereSegments);
    const ringGeoUnit = new THREE.TorusGeometry(1.45, 0.035, 12, 48);

    // 7. Bubble Universe Generator
    const bubbleCount = performanceTier === 'low' ? 36 : performanceTier === 'medium' ? 56 : 74;
    const bubbles: BubbleData[] = [];
    const bubbleUniverseGroup = new THREE.Group();
    scene.add(bubbleUniverseGroup);

    // Corridor range: Z from +24 down to -128
    const corridorLength = 152;
    const startZ = 24;

    for (let i = 0; i < bubbleCount; i++) {
      const p = i / bubbleCount;
      const zPos = startZ - p * corridorLength + (Math.sin(i * 9.1) * 3);
      
      // Golden ratio spiral distribution around flight corridor
      const angle = (i * 2.39996) % (Math.PI * 2);
      const radius = 2.4 + ((i * 3.7) % 7.8);
      const xPos = Math.cos(angle) * radius + Math.sin(p * Math.PI * 3.6) * 2.8;
      const yPos = Math.sin(angle) * radius * 0.75 + Math.cos(p * Math.PI * 2.8) * 1.6;

      const isFeature = i % 7 === 0;
      const baseScale = isFeature ? 1.45 + ((i * 1.3) % 0.85) : 0.45 + ((i * 2.1) % 0.78);

      let type: BubbleData['type'] = 'glass';
      const mod = i % 10;
      if (mod === 1 || mod === 5) type = 'gold';
      else if (mod === 3 || mod === 8) type = 'champagne';
      else if (mod === 7) type = 'obsidian';

      let mat: THREE.Material;
      if (type === 'gold') mat = goldMat;
      else if (type === 'champagne') mat = champagneMat;
      else if (type === 'obsidian') mat = obsidianMat;
      else mat = createGlassMaterial(0x0a0a0e, mod === 0 ? 0xfff0b3 : 0xd4af37);

      const mesh = new THREE.Mesh(sphereGeoUnit, mat);
      mesh.position.set(xPos, yPos, zPos);
      mesh.scale.setScalar(baseScale);
      bubbleUniverseGroup.add(mesh);

      // Add orbital halo ring to selected gold or feature bubbles
      let ringMesh: THREE.Mesh | undefined;
      if (type === 'gold' || isFeature) {
        ringMesh = new THREE.Mesh(ringGeoUnit, goldHaloMat);
        ringMesh.position.copy(mesh.position);
        ringMesh.scale.setScalar(baseScale);
        ringMesh.rotation.x = (i * 0.4) % Math.PI;
        ringMesh.rotation.y = (i * 0.7) % Math.PI;
        bubbleUniverseGroup.add(ringMesh);
      }

      // Add inner floating gold spark inside glass bubbles
      let innerSpark: THREE.Mesh | undefined;
      if (type === 'glass' && baseScale > 0.8) {
        const sparkGeo = new THREE.IcosahedronGeometry(0.24, 0);
        innerSpark = new THREE.Mesh(sparkGeo, goldMat);
        innerSpark.position.copy(mesh.position);
        bubbleUniverseGroup.add(innerSpark);
      }

      bubbles.push({
        mesh,
        type,
        basePos: new THREE.Vector3(xPos, yPos, zPos),
        baseScale,
        driftSpeed: new THREE.Vector3(
          Math.sin(i * 1.7) * 0.4,
          Math.cos(i * 2.3) * 0.35,
          Math.sin(i * 3.1) * 0.2
        ),
        rotSpeed: new THREE.Vector3(
          0.004 + (i % 5) * 0.002,
          0.005 + (i % 7) * 0.002,
          0.003 + (i % 3) * 0.002
        ),
        phase: i * 0.85,
        ringMesh,
        innerSpark,
      });
    }

    // 8. Milestone Portals along the corridor
    const portalRings: { mesh: THREE.Mesh; z: number }[] = [];
    const portalZCoords = [4, -30, -66, -100, -126];

    portalZCoords.forEach((pz, idx) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(0, 0, pz);

      // Outer Portal Ring
      const pRingGeo = new THREE.TorusGeometry(3.8, 0.04, 16, 64);
      const pRingMat = new THREE.MeshBasicMaterial({
        color: 0xffe08a,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const pRing = new THREE.Mesh(pRingGeo, pRingMat);
      pGroup.add(pRing);

      // Inner halo ring
      const innerRingGeo = new THREE.TorusGeometry(3.35, 0.02, 12, 48);
      const innerRing = new THREE.Mesh(innerRingGeo, goldHaloMat);
      pGroup.add(innerRing);

      scene.add(pGroup);
      portalRings.push({ mesh: pRing, z: pz });
    });

    // 9. Golden Particle Constellation Corridor
    const particleCount = performanceTier === 'low' ? 250 : performanceTier === 'medium' ? 480 : 700;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleInitialOffsets = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const p = i / particleCount;
      const z = startZ + 6 - p * (corridorLength + 16);
      const angle = (i * 1.618) * Math.PI * 2;
      const radius = 1.6 + (Math.sin(i * 4.3) + 1.2) * 4.6;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.7;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particleInitialOffsets[i * 3] = x;
      particleInitialOffsets[i * 3 + 1] = y;
      particleInitialOffsets[i * 3 + 2] = z;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffe08a,
      size: 0.15,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 10. Scroll & Mouse Event Handlers
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      stateRef.current.targetProgress = progress;

      // Update depth readout directly without triggering React re-renders
      const depthMeters = Math.round(progress * 130 * 10) / 10;
      if (depthTextRef.current) {
        depthTextRef.current.textContent = `-${depthMeters}m`;
      }

      // Identify active waypoint and opacity
      let activeWp: WaypointDirective | null = null;
      let opacity = 0;

      for (let wp of WAYPOINTS) {
        if (progress >= wp.range[0] && progress <= wp.range[1]) {
          activeWp = wp;
          const mid = (wp.range[0] + wp.range[1]) / 2;
          const halfSpan = (wp.range[1] - wp.range[0]) / 2;
          const dist = Math.abs(progress - mid);
          opacity = Math.max(0, 1 - dist / halfSpan);
          break;
        }
      }

      if (hudRealmRef.current && activeWp) {
        hudRealmRef.current.textContent = activeWp.realm;
      }

      if (waypointCardRef.current) {
        if (activeWp && opacity > 0.05) {
          waypointCardRef.current.style.opacity = `${opacity}`;
          if (waypointRealmRef.current && waypointRealmRef.current.textContent !== activeWp.realm) {
            waypointRealmRef.current.textContent = activeWp.realm;
          }
          if (waypointDepthRef.current) {
            waypointDepthRef.current.textContent = `DEPTH ${activeWp.depth}`;
          }
          if (waypointQuoteRef.current) {
            waypointQuoteRef.current.textContent = `“${activeWp.quote}”`;
          }
          if (waypointDirectiveRef.current) {
            waypointDirectiveRef.current.textContent = activeWp.directive;
          }
        } else {
          waypointCardRef.current.style.opacity = '0';
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      stateRef.current.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      stateRef.current.targetMouseY = (e.clientY / window.innerHeight - 0.5) * -2;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Initial sync
    handleScroll();

    // 11. Animation Render Loop (Deterministic, Reversible, High-Performance)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      const st = stateRef.current;
      // Lerp scroll progression: silky smooth 60/120fps glide
      st.currentProgress += (st.targetProgress - st.currentProgress) * 0.085;
      const progress = st.currentProgress;

      // Lerp mouse parallax
      st.mouseX += (st.targetMouseX - st.mouseX) * 0.05;
      st.mouseY += (st.targetMouseY - st.mouseY) * 0.05;

      // Camera Path Spline Calculation
      const baseTravelZ = 16 - progress * 142;
      const curveX = Math.sin(progress * Math.PI * 3.6) * 3.2;
      const curveY = Math.cos(progress * Math.PI * 2.8) * 1.8;

      const camX = curveX + st.mouseX * 1.6 + st.interactiveRotation.y * 5;
      const camY = curveY + st.mouseY * 1.2 - st.interactiveRotation.x * 3;
      const camZ = baseTravelZ;

      camera.position.set(camX, camY, camZ);

      // Camera Look-Ahead Point
      const lookAheadProgress = Math.min(progress + 0.04, 1.0);
      const lookAheadZ = 16 - lookAheadProgress * 142;
      const lookAheadX = Math.sin(lookAheadProgress * Math.PI * 3.6) * 3.2;
      const lookAheadY = Math.cos(lookAheadProgress * Math.PI * 2.8) * 1.8;

      camera.lookAt(lookAheadX, lookAheadY, lookAheadZ - 12);

      // Cinematic roll banking
      camera.rotation.z = Math.sin(progress * Math.PI * 3.6) * 0.06;

      // Update travelling light position
      cameraPointLight.position.set(camX, camY + 0.5, camZ - 2);

      // Dynamic Section Lights
      sectionLightHero.intensity = 2.0 + Math.max(0, 1 - progress * 4) * 2.5;
      sectionLightDiscipline.intensity = 1.5 + Math.exp(-Math.pow((progress - 0.5) * 6, 2)) * 3.0;
      sectionLightApex.intensity = 1.5 + Math.max(0, (progress - 0.75) * 4) * 3.5;

      // Animate Bubbles
      bubbles.forEach((b) => {
        const wobbleX = Math.sin(time * 0.8 + b.phase) * 0.45;
        const wobbleY = Math.cos(time * 0.9 + b.phase) * 0.4;
        const wobbleZ = Math.sin(time * 0.6 + b.phase) * 0.3;

        // Proximity calculation: bubbles drift laterally and enlarge smoothly as camera nears
        const distToCamZ = b.mesh.position.z - camZ;
        const proximity = Math.max(0, 1.0 - Math.abs(distToCamZ) / 18);
        const lateralDiverge = (b.mesh.position.x > camX ? 1 : -1) * proximity * 0.85;

        // Position is pure function of (time, progress, basePos) -> 100% reversible!
        b.mesh.position.x = b.basePos.x + wobbleX + lateralDiverge;
        b.mesh.position.y = b.basePos.y + wobbleY + (b.driftSpeed.y * Math.sin(progress * Math.PI * 4));
        b.mesh.position.z = b.basePos.z + wobbleZ;

        // Rotation
        b.mesh.rotation.x += b.rotSpeed.x;
        b.mesh.rotation.y += b.rotSpeed.y;

        // Dynamic scale deformation
        const breath = 1.0 + Math.sin(time * 1.8 + b.phase) * 0.05 + proximity * 0.09;
        b.mesh.scale.setScalar(b.baseScale * breath);

        if (b.ringMesh) {
          b.ringMesh.position.copy(b.mesh.position);
          b.ringMesh.rotation.z += 0.01;
          b.ringMesh.scale.setScalar(b.baseScale * breath);
        }

        if (b.innerSpark) {
          b.innerSpark.position.copy(b.mesh.position);
          b.innerSpark.rotation.x += 0.02;
          b.innerSpark.rotation.y += 0.03;
        }
      });

      // Animate Milestone Portals
      portalRings.forEach((p, pIdx) => {
        p.mesh.rotation.z += 0.005 * (pIdx % 2 === 0 ? 1 : -1);
        const dist = Math.abs(p.z - camZ);
        if (dist < 12) {
          const portalIntensity = 1 - dist / 12;
          p.mesh.scale.setScalar(1 + portalIntensity * 0.15);

          // Audio chime on passing portal
          if (dist < 2.5 && soundFx.enabled && st.lastMilestoneIndex !== pIdx) {
            st.lastMilestoneIndex = pIdx;
            soundFx.playChime();
          }
        } else {
          p.mesh.scale.setScalar(1.0);
        }
      });

      if (portalRings.every(p => Math.abs(p.z - camZ) > 8)) {
        st.lastMilestoneIndex = -1;
      }

      // Animate Golden Particles along curved spiral flow
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const particlePosArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const initialZ = particleInitialOffsets[i3 + 2];
        const initialX = particleInitialOffsets[i3];
        const initialY = particleInitialOffsets[i3 + 1];

        const curl = Math.sin(time * 0.5 + initialZ * 0.08) * 0.35;
        particlePosArray[i3] = initialX + curl + Math.sin(progress * Math.PI * 3 + i) * 0.25;
        particlePosArray[i3 + 1] = initialY + Math.cos(time * 0.6 + i) * 0.3;
        particlePosArray[i3 + 2] = initialZ;
      }
      posAttr.needsUpdate = true;

      // Render
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      bubbles.forEach((b) => {
        b.mesh.geometry.dispose();
        if (Array.isArray(b.mesh.material)) {
          b.mesh.material.forEach((m) => m.dispose());
        } else {
          b.mesh.material.dispose();
        }
        if (b.ringMesh) {
          b.ringMesh.geometry.dispose();
          (b.ringMesh.material as THREE.Material).dispose();
        }
        if (b.innerSpark) {
          b.innerSpark.geometry.dispose();
          (b.innerSpark.material as THREE.Material).dispose();
        }
      });

      sphereGeoUnit.dispose();
      ringGeoUnit.dispose();
      goldMat.dispose();
      champagneMat.dispose();
      obsidianMat.dispose();
      goldHaloMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [prefersReducedMotion, performanceTier]);

  if (!webGlSupported) {
    return null;
  }

  return (
    <>
      {/* Fixed Fullscreen 3D Bubble Canvas Layer */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          background: 'transparent',
          touchAction: 'none',
        }}
      />

      {/* Dynamic 3D Motivational Heading Reveal Overlay (fades in smoothly as you travel between bubbles) */}
      <div
        ref={waypointCardRef}
        className="fixed top-24 right-6 sm:right-10 z-30 pointer-events-none transition-opacity duration-300 max-w-sm hidden md:flex flex-col items-end text-right"
        style={{ opacity: 0 }}
      >
        <div className="px-5 py-3.5 rounded-xl bg-[#09090b]/80 border border-[#D4AF37]/35 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col gap-1.5">
          <div className="flex items-center justify-end gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[#FFE08A]">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span ref={waypointRealmRef}>I. THE SOVEREIGN VISION</span>
            <span className="text-zinc-600">•</span>
            <span ref={waypointDepthRef} className="text-zinc-400">DEPTH 10m</span>
          </div>
          <p ref={waypointQuoteRef} className="font-display text-xs text-white font-semibold leading-snug">
            “Every achievement begins with an audacious vision refused by the ordinary mind.”
          </p>
          <p ref={waypointDirectiveRef} className="text-[11px] text-zinc-400 font-sans leading-normal">
            Define your destination with razor-sharp specificity. Dream bigger.
          </p>
        </div>
      </div>

      {/* Luxury 3D Cosmos Flight Navigation HUD */}
      {showHUD && (
        <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#09090b]/85 border border-[#D4AF37]/30 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)] text-xs text-white">
            <div className="w-2 h-2 rounded-full bg-[#FFE08A] animate-ping" />
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#FFE08A] font-bold">
                COSMOS DEPTH:
              </span>
              <span ref={depthTextRef} className="font-mono text-zinc-300 font-semibold">
                -0.0m
              </span>
            </div>

            <div className="h-3 w-px bg-white/15" />

            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-medium">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span ref={hudRealmRef} className="truncate max-w-[170px]">
                I. THE SOVEREIGN VISION
              </span>
            </div>

            <div className="h-3 w-px bg-white/15" />

            {/* Audio Feedback Button */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute 3D audio feedback' : 'Enable 3D audio feedback'}
              aria-label={soundEnabled ? 'Mute 3D audio feedback' : 'Enable 3D audio feedback'}
              className="p-1 rounded text-zinc-400 hover:text-[#FFE08A] transition-colors cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-[#FFE08A]" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
