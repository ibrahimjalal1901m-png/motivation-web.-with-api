import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useMotionPreference } from './MotionPreferenceProvider';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Compass } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface StageInfo {
  number: string;
  name: string;
  title: string;
  quote: string;
  directive: string;
  color: string;
}

const STAGES: StageInfo[] = [
  {
    number: 'STAGE 1',
    name: 'DREAM',
    title: 'The Sovereign Vision',
    quote: 'Every achievement begins with an audacious vision refused by the ordinary mind.',
    directive: 'Define your destination with razor-sharp specificity. If the goal does not intimidate you, it is too small for your potential.',
    color: '#FFE08A',
  },
  {
    number: 'STAGE 2',
    name: 'DISCIPLINE',
    title: 'The Relentless Furnace',
    quote: 'Your daily habits shape your future long before the external world notices.',
    directive: 'Eliminate emotional deliberation. Execute the standard whether feeling inspired, exhausted, triumphant, or beaten down.',
    color: '#D4AF37',
  },
  {
    number: 'STAGE 3',
    name: 'BECOME',
    title: 'The Inevitable Apex',
    quote: 'Keep showing up in cold silence until your results speak for you.',
    directive: 'When your identity is forged through unbroken promises to yourself, victory ceases to be luck—it becomes pure arithmetic.',
    color: '#FBBF24',
  },
];

export const Interactive3DObject: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const { prefersReducedMotion, performanceTier } = useMotionPreference();
  const [webGlSupported, setWebGlSupported] = useState(true);

  // References to smoothly alter 3D object rotation speed and geometry distortion
  const stageTargetSpeedRef = useRef(1.0);

  const activeStage = STAGES[activeStageIndex];

  useEffect(() => {
    stageTargetSpeedRef.current = (activeStageIndex + 1) * 0.8;
  }, [activeStageIndex]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || prefersReducedMotion) return;

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

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: performanceTier !== 'low',
      });
    } catch {
      setWebGlSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(performanceTier === 'high' ? Math.min(window.devicePixelRatio || 1, 2) : 1);
    container.appendChild(renderer.domElement);

    // Lights
    const ambLight = new THREE.AmbientLight(0x221c08, 2.0);
    scene.add(ambLight);

    const goldLight1 = new THREE.DirectionalLight(0xffe08a, 3.5);
    goldLight1.position.set(4, 5, 3);
    scene.add(goldLight1);

    const goldLight2 = new THREE.DirectionalLight(0xd4af37, 2.2);
    goldLight2.position.set(-4, -3, -2);
    scene.add(goldLight2);

    // Dynamic 3D Sculpture Group
    const group = new THREE.Group();
    scene.add(group);

    // Gold Torus Knot (Sculptural Core)
    const torusKnotGeo = new THREE.TorusKnotGeometry(1.0, 0.32, 80, 16, 2, 3);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.22,
    });
    const knotMesh = new THREE.Mesh(torusKnotGeo, goldMat);
    group.add(knotMesh);

    // Outer Halo Ring
    const haloGeo = new THREE.RingGeometry(1.9, 1.96, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffe08a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    group.add(haloMesh);

    // Floating micro-satellites
    const satCount = 8;
    const satGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xfff0b3 });
    const satellites: THREE.Mesh[] = [];

    for (let i = 0; i < satCount; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      const angle = (i / satCount) * Math.PI * 2;
      sat.position.set(Math.cos(angle) * 1.92, Math.sin(angle) * 1.92, 0);
      group.add(sat);
      satellites.push(sat);
    }

    // Interactive pointer drag / movement
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      rotationVelocityY = deltaX * 0.006;
      rotationVelocityX = deltaY * 0.006;

      group.rotation.y += rotationVelocityY;
      group.rotation.x += rotationVelocityX;

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const canvasElem = renderer.domElement;
    canvasElem.addEventListener('mousedown', onPointerDown);
    canvasElem.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 400;
      height = container.clientHeight || 400;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const speed = stageTargetSpeedRef.current;

      if (!isDragging) {
        group.rotation.y += delta * 0.45 * speed;
        group.rotation.x += delta * 0.25 * speed;
      }

      haloMesh.rotation.z += delta * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      canvasElem.removeEventListener('mousedown', onPointerDown);
      canvasElem.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);

      torusKnotGeo.dispose();
      haloGeo.dispose();
      satGeo.dispose();
      goldMat.dispose();
      haloMat.dispose();
      satMat.dispose();

      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [performanceTier, prefersReducedMotion]);

  const handleSelectStage = (idx: number) => {
    soundFx.playClick();
    setActiveStageIndex(idx);
  };

  return (
    <section className="py-20 lg:py-28 bg-[#09090C] relative border-t border-b border-white/[0.05] overflow-hidden">
      {/* Background ambient gold gradient */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFE08A]" />
              <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#D4AF37]">
                Interactive 3D Experience
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-white tracking-tight">
              Build Your Future
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed">
            Interact with the sculpture. Walk through the 3 operational stages that separate wishful thinking from ruthless manifestation.
          </p>
        </div>

        {/* Interactive 3D Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: 3D Canvas Interactive Viewport (5 Columns) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px] rounded-2xl bg-[#111114] border border-[#D4AF37]/35 shadow-2xl p-6 gold-glow-card">
            {/* 3D Container */}
            <div
              ref={mountRef}
              className="w-full h-80 sm:h-96 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
            >
              {!webGlSupported && (
                <div className="w-48 h-48 rounded-full border-2 border-dashed border-[#D4AF37] flex items-center justify-center text-center p-4">
                  <span className="text-xs font-mono text-[#FFE08A] uppercase">
                    3D Sculpture Fallback
                  </span>
                </div>
              )}
            </div>

            <div className="absolute bottom-3 text-center pointer-events-none">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Drag to rotate 3D sculpture in real-time
              </span>
            </div>
          </div>

          {/* Right: Stage Content & Dynamic Selector (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Stage Selector Tabs */}
            <div className="grid grid-cols-3 gap-2.5 p-1.5 rounded-xl bg-[#111114] border border-white/[0.08]">
              {STAGES.map((stg, idx) => {
                const isActive = activeStageIndex === idx;
                return (
                  <button
                    key={stg.name}
                    onClick={() => handleSelectStage(idx)}
                    className={`py-3 px-3 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FFE08A] to-[#D4AF37] text-[#080808] font-bold shadow-lg'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest">
                      {stg.number}
                    </span>
                    <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider">
                      {stg.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stage Card Presentation */}
            <div className="p-8 sm:p-10 rounded-2xl bg-[#111114] border border-[#D4AF37]/30 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <span className="px-3 py-1 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#FFE08A] text-xs font-mono font-bold tracking-widest">
                  {activeStage.number} • {activeStage.name}
                </span>
                <span className="text-xs font-mono text-zinc-500 uppercase">
                  ACTIVE PROGRESSION
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  {activeStage.title}
                </h3>
                <blockquote className="font-display text-lg sm:text-xl text-[#FFE08A] italic leading-relaxed font-medium">
                  "{activeStage.quote}"
                </blockquote>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-2">
                  {activeStage.directive}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Unwavering Commitment Required</span>
                </div>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    const next = (activeStageIndex + 1) % STAGES.length;
                    setActiveStageIndex(next);
                  }}
                  className="flex items-center gap-1.5 text-xs uppercase font-mono tracking-wider font-semibold text-[#FFE08A] hover:text-white transition-colors"
                >
                  <span>Advance Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
