import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useMotionPreference } from './MotionPreferenceProvider';

export const ThreeHeroScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion, performanceTier } = useMotionPreference();
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || prefersReducedMotion) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 2. WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: performanceTier !== 'low',
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
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Lighting (Warm Sovereign Gold Accents)
    const ambientLight = new THREE.AmbientLight(0x221c08, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffe08a, 3.2);
    dirLight1.position.set(5, 8, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd4af37, 2.0);
    dirLight2.position.set(-6, -4, -2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xfff5cc, 2.5, 12);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // 4. Gold Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.18,
      wireframe: false,
    });

    const wireframeGold = new THREE.MeshBasicMaterial({
      color: 0xffe08a,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    // 5. Hero 3D Objects Group
    const group = new THREE.Group();
    scene.add(group);

    // Central Floating Faceted Gold Gem (Icosahedron)
    const coreGeometry = new THREE.IcosahedronGeometry(1.3, 0);
    const coreMesh = new THREE.Mesh(coreGeometry, goldMaterial);
    group.add(coreMesh);

    // Outer Wireframe Hologram Casing
    const wireCasingGeo = new THREE.IcosahedronGeometry(1.48, 1);
    const wireCasingMesh = new THREE.Mesh(wireCasingGeo, wireframeGold);
    group.add(wireCasingMesh);

    // Concentric Orbiting Gold Rings
    const ring1Geo = new THREE.TorusGeometry(2.3, 0.045, 16, 80);
    const ring1 = new THREE.Mesh(ring1Geo, goldMaterial);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.9, 0.035, 16, 90);
    const ring2 = new THREE.Mesh(ring2Geo, goldMaterial);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    group.add(ring2);

    // 6. Floating 3D Gold Dust Particles
    const particleCount = performanceTier === 'low' ? 70 : 160;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      scales[i] = Math.random();
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffe08a,
      size: 0.065,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Interactive Pointer & Touch Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = (e.touches[0].clientX / window.innerWidth - 0.5) * 1.5;
        mouse.targetY = (e.touches[0].clientY / window.innerHeight - 0.5) * 1.5;
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // 9. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth pointer damping
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;

      // Object rotation
      coreMesh.rotation.y += delta * 0.45;
      coreMesh.rotation.x += delta * 0.25;

      wireCasingMesh.rotation.y -= delta * 0.3;
      wireCasingMesh.rotation.z += delta * 0.2;

      ring1.rotation.z += delta * 0.35;
      ring1.rotation.y += delta * 0.15;

      ring2.rotation.x -= delta * 0.28;
      ring2.rotation.z += delta * 0.22;

      particles.rotation.y += delta * 0.05;

      // Group reaction to pointer
      group.rotation.y = mouse.x * 0.6;
      group.rotation.x = -mouse.y * 0.4;
      group.position.x = mouse.x * 0.25;
      group.position.y = -mouse.y * 0.2;

      // Gentle floating oscillation
      const time = clock.getElapsedTime();
      group.position.y += Math.sin(time * 1.2) * 0.003;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean-up & Resource Disposal
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      coreGeometry.dispose();
      wireCasingGeo.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      particleGeo.dispose();
      goldMaterial.dispose();
      wireframeGold.dispose();
      particleMat.dispose();

      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [performanceTier, prefersReducedMotion]);

  if (prefersReducedMotion || !webGlSupported) {
    // Elegant fallback: golden radial glow with CSS rings
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-80 h-80 rounded-full border border-[#D4AF37]/30 animate-pulse opacity-60" />
        <div className="absolute w-96 h-96 rounded-full border border-[#FFE08A]/20" />
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-[#D4AF37]/10 to-transparent blur-2xl" />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.92 }}
    />
  );
};
