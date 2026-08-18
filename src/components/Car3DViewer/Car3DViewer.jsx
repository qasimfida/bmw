import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  ContactShadows,
  Environment,
  MeshReflectorMaterial,
  Float,
  Sparkles,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';

// Import the real car models
import ferrariUrl from '../../assets/model/ferrari.glb';
import bmwUrl from '../../assets/model/bmw_m4_competition_m_package.glb';

// ─── Real Car Model ────────────────────────────────────────────────────────
const CarModel = ({ 
  url, 
  bodyColor = '#2f426f', 
  secondaryColor = '#ffffff', 
  rimColor = '#e0e0e0', 
  envMapIntensity = 3.2, 
  scale = 1.5, 
  position = [0, -0.05, 0], 
  rotation = [0, Math.PI, 0],
  isEngineRunning = false
}) => {
  const { scene } = useGLTF(url);
  
  // Clone the scene so we can mutate materials safely
  const copiedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    copiedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const matName = child.material.name.toLowerCase();
        
        // Match common body paint material names
        if (
          matName.includes('body') ||
          matName.includes('paint') ||
          matName.includes('coat') ||
          matName.includes('car_color') ||
          matName.includes('exterior') ||
          matName.includes('metallic') ||
          matName.includes('caliper') ||
          matName.includes('pillars')
        ) {
          if (child.material.isCustomCarPaint) {
            child.material.color.set(bodyColor);
          } else {
            child.material = new THREE.MeshPhysicalMaterial({
              name: child.material.name,
              color: new THREE.Color(bodyColor),
              metalness: 0.85,
              roughness: 0.18,
              clearcoat: 1.0,
              clearcoatRoughness: 0.04,
              envMapIntensity: envMapIntensity,
            });
            child.material.isCustomCarPaint = true;
          }
        }
        // Match white side panels / livery / bonnet
        else if (
          matName.includes('white41') ||
          matName.includes('livery') ||
          matName.includes('ff41') ||
          matName.includes('zx1') ||
          matName.includes('black15')
        ) {
          if (child.material.isCustomSecondaryPaint) {
            child.material.color.set(secondaryColor);
          } else {
            child.material = new THREE.MeshPhysicalMaterial({
              name: child.material.name,
              color: new THREE.Color(secondaryColor),
              metalness: 0.85,
              roughness: 0.2,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
              envMapIntensity: envMapIntensity,
            });
            child.material.isCustomSecondaryPaint = true;
          }
        }
        // Match windows / glass
        else if (matName.includes('glass') || matName.includes('window')) {
          if (!child.material.isCustomGlass) {
            child.material = new THREE.MeshPhysicalMaterial({
              color: '#08080c',
              metalness: 0.95,
              roughness: 0.05,
              transparent: true,
              opacity: 0.85,
              transmission: 0.6,
              ior: 1.52,
              envMapIntensity: 2.5,
            });
            child.material.isCustomGlass = true;
          }
        }
        // Match tires / rubber
        else if (matName.includes('rubber') || matName.includes('tire') || matName === 'meshesm8rim0011mtl') {
          if (!child.material.isCustomRubber) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#1a1a1c',
              roughness: 0.85,
              metalness: 0.05,
            });
            child.material.isCustomRubber = true;
          }
        }
        // Match rims / alloys
        else if (
          matName.includes('rim') || 
          matName.includes('alloy') || 
          matName === 'metal_gray' ||
          (matName.includes('wheel') && !matName.includes('rubber') && !matName.includes('tire'))
        ) {
          if (child.material.isCustomRim) {
            child.material.color.set(rimColor);
          } else {
            child.material = new THREE.MeshStandardMaterial({
              name: child.material.name,
              color: new THREE.Color(rimColor),
              metalness: 0.92,
              roughness: 0.18,
            });
            child.material.isCustomRim = true;
          }
        }
      }
    });
  }, [copiedScene, bodyColor, secondaryColor, rimColor, envMapIntensity, isEngineRunning]);

  return (
    <primitive 
      object={copiedScene} 
      position={position} 
      rotation={rotation} 
      scale={scale} 
    />
  );
};

// ─── Studio Lights with Dynamic Soft Glow ─────────────────────────────────────
const MovingStudioLights = ({ bgColor = '#2563EB' }) => {
  const light1Ref = useRef();
  const light2Ref = useRef();

  useFrame(({ clock }) => {
    // Very slow rotation to prevent "blinking" but maintain dynamic studio reflections
    const t = clock.getElapsedTime() * 0.15;
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(t) * 6;
      light1Ref.current.position.z = Math.cos(t) * 6;
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.sin(t + Math.PI) * 7;
      light2Ref.current.position.z = Math.cos(t + Math.PI) * 7;
    }
  });

  return (
    <>
      {/* Key overhead studio light */}
      <pointLight ref={light1Ref} position={[5, 4.5, 5]} intensity={4.2} color="#ffffff" distance={25} />
      {/* Dynamic cool fill/rim light */}
      <pointLight ref={light2Ref} position={[-7, 3, -5]} intensity={3.0} color={bgColor === 'transparent' ? '#60a5fa' : bgColor} distance={25} />
      {/* Top softbox */}
      <pointLight position={[0, 6, 0]} intensity={2.2} color="#f0f4ff" distance={20} />
      {/* Sharp dramatic rim light */}
      <spotLight position={[0, 7, -6]} angle={0.45} penumbra={0.8} intensity={4.5} color="#3b82f6" castShadow />
      {/* Subtle ambient floor bounce */}
      <ambientLight intensity={0.5} color="#e2e8f0" />
    </>
  );
};

// ─── Scroll-Synchronized Animated Rig ──────────────────────────────────────────
const ScrollCarRig = ({ scrollProgress = 0, modelType, color, secondaryColor, rimColor, isEngineRunning }) => {
  const groupRef = useRef();
  const targetRotation = useRef(Math.PI * 0.85); // Start at front-3/4 angle
  const currentRotation = useRef(Math.PI * 0.85);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Synchronize rotation with scroll:
    // 0.00 -> Front 3/4 hero view (~150°)
    // 0.25 -> Transitioning toward Side profile (~90°)
    // 0.50 -> Sleek Side profile & aero specs (~0°)
    // 0.75 -> Rear 3/4 diffuser & taillights pass (~ -90° / 270°)
    // 1.00 -> Full dramatic 360 spin completion back to hero pose
    const baseAngle = Math.PI * 0.85; // Initial front 3/4 angle
    const totalRotation = Math.PI * 2.2; // Full smooth spin across the scroll journey
    targetRotation.current = baseAngle + scrollProgress * totalRotation;

    // Smooth inertia interpolation (lerp) for 60fps cinematic fluidity
    currentRotation.current = THREE.MathUtils.lerp(
      currentRotation.current,
      targetRotation.current,
      Math.min(delta * 6.5, 1)
    );

    groupRef.current.rotation.y = currentRotation.current;

    // Subtle gentle floating breath
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = -0.05 + Math.sin(time * 1.2) * 0.02;

    // Subtle responsive camera parallax depth based on scroll — zoomed out to display full car
    const targetCamY = 1.35 - scrollProgress * 0.35;
    const targetCamZ = 7.6 - Math.sin(scrollProgress * Math.PI) * 0.7;
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, 0.05);
    state.camera.lookAt(0, 0.1, 0);
  });

  return (
    <group ref={groupRef} position={[0, -0.08, 0]}>
      <React.Suspense fallback={null}>
        {modelType === 'ferrari' ? (
          <CarModel 
            url={ferrariUrl} 
            bodyColor={color || '#2f426f'} 
            secondaryColor={secondaryColor} 
            rimColor={rimColor} 
            envMapIntensity={3.5} 
            scale={1.25} 
            position={[0, -0.05, 0]} 
            rotation={[0, 0, 0]} 
            isEngineRunning={isEngineRunning}
          />
        ) : (
          <CarModel 
            url={bmwUrl} 
            bodyColor={color || '#1B69D4'} 
            secondaryColor={secondaryColor} 
            rimColor={rimColor} 
            envMapIntensity={3.5} 
            scale={0.42} 
            position={[0, -0.05, 0]} 
            rotation={[0, 0, 0]} 
            isEngineRunning={isEngineRunning}
          />
        )}
      </React.Suspense>
    </group>
  );
};

// ─── Studio Floor with Wet Asphalt Reflection ─────────────────────────────────
const StudioFloor = ({ bgColor }) => {
  const col = useMemo(() => {
    const c = new THREE.Color(bgColor === 'transparent' ? '#08080a' : bgColor);
    c.multiplyScalar(0.18);
    return c;
  }, [bgColor]);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.68, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={0.85}
        mixStrength={0.7}
        roughness={0.88}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color={col}
        metalness={0.1}
      />
    </mesh>
  );
};

// ─── Main Car3DViewer Component ───────────────────────────────────────────────
const Car3DViewer = ({
  color,
  secondaryColor = '#ffffff',
  bgLightColor = 'transparent',
  rimColor = '#e0e0e0',
  autoRotate = true,
  autoRotateSpeed = 1.2,
  className = '',
  modelType = 'bmw',
  scrollProgress = undefined, // When supplied, activates synchronized scroll animation
  isEngineRunning = false,
}) => {
  const isScrollDriven = scrollProgress !== undefined;
  const [hasInteracted, setHasInteracted] = useState(false);
  const controlsRef = useRef();

  return (
    <div className={`w-full h-full min-h-[380px] ${className}`} style={{ background: 'transparent' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [5.2, 1.4, 7.6], fov: 28, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: "high-performance",
        }}
      >
        {bgLightColor !== 'transparent' && <color attach="background" args={[bgLightColor]} />}
        {bgLightColor !== 'transparent' && <fog attach="fog" args={[bgLightColor, 12, 40]} />}

        {/* Dynamic Studio Lighting */}
        <MovingStudioLights bgColor={bgLightColor} />

        {/* High-end Environment Map */}
        <Environment preset="studio" environmentIntensity={0.65} />

        {/* Studio Floor */}
        <StudioFloor bgColor={bgLightColor} />

        {/* Real Car Model with Scroll Animation or Interactive Float */}
        {isScrollDriven ? (
          <ScrollCarRig 
            scrollProgress={scrollProgress} 
            modelType={modelType} 
            color={color} 
            secondaryColor={secondaryColor} 
            rimColor={rimColor} 
            isEngineRunning={isEngineRunning}
          />
        ) : (
          <Float floatIntensity={0.06} speed={1.2} rotationIntensity={0.03}>
            <React.Suspense fallback={null}>
              {modelType === 'ferrari' ? (
                <CarModel 
                  url={ferrariUrl} 
                  bodyColor={color || '#2f426f'} 
                  secondaryColor={secondaryColor} 
                  rimColor={rimColor} 
                  envMapIntensity={3.5} 
                  scale={1.5} 
                  position={[0, -0.05, 0]} 
                  rotation={[0, Math.PI, 0]} 
                  isEngineRunning={isEngineRunning}
                />
              ) : (
                <CarModel 
                  url={bmwUrl} 
                  bodyColor={color || '#1B69D4'} 
                  secondaryColor={secondaryColor} 
                  rimColor={rimColor} 
                  envMapIntensity={3.5} 
                  scale={0.5} 
                  position={[0, -0.05, 0]} 
                  rotation={[0, Math.PI, 0]} 
                  isEngineRunning={isEngineRunning}
                />
              )}
            </React.Suspense>
          </Float>
        )}

        {/* Realistic Contact Shadow */}
        <ContactShadows
          resolution={1024}
          scale={10}
          blur={2.2}
          opacity={0.7}
          far={8}
          color="#000000"
          position={[0, -0.675, 0]}
        />

        {/* Ambient Subtle Sparkles */}
        <Sparkles count={40} scale={8} size={1.2} speed={0.2} opacity={0.15} color={bgLightColor === 'transparent' ? '#93c5fd' : bgLightColor} />

        {/* Orbit Controls (Active when not scroll-driven) */}
        {!isScrollDriven && (
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.15}
            minDistance={3.2}
            maxDistance={12}
            onStart={() => setHasInteracted(true)}
            autoRotate={!hasInteracted && autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            target={[0, 0.15, 0]}
          />
        )}
      </Canvas>
    </div>
  );
};

export default Car3DViewer;