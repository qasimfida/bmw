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
const CarModel = ({ url, bodyColor = '#2f426f', secondaryColor = '#ffffff', rimColor = '#e0e0e0', envMapIntensity = 3, scale = 1.5, position = [0, -0.05, 0], rotation = [0, Math.PI, 0] }) => {
  const { scene } = useGLTF(url);
  
  // Clone the scene so we can mutate materials safely
  const copiedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    // Traverse the model to apply custom materials
    copiedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Try to identify the body material by name (common names in car models)
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
          // If we already replaced it with our custom PhysicalMaterial, just update the color
          if (child.material.isCustomCarPaint) {
            child.material.color.set(bodyColor);
          } else {
            // First time: replace it
            child.material = new THREE.MeshPhysicalMaterial({
              name: child.material.name, // Preserve name so the check works next time
              color: new THREE.Color(bodyColor),
              metalness: 0.8,
              roughness: 0.2,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
              envMapIntensity: envMapIntensity,
            });
            child.material.isCustomCarPaint = true;
          }
        }
        // Match the massive white side panels and bonnet for secondary color
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
              metalness: 0.8,
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
              color: '#000000',
              metalness: 0.9,
              roughness: 0.1,
              transparent: true,
              opacity: 0.8,
              transmission: 0.5,
              ior: 1.5,
              envMapIntensity: 2,
            });
            child.material.isCustomGlass = true;
          }
        }
        // Match tires / rubber (ensure we don't accidentally catch rim)
        // Note: meshesm8rim0011mtl is the tyre rubber on the BMW model
        else if (matName.includes('rubber') || matName.includes('tire') || matName === 'meshesm8rim0011mtl') {
          if (!child.material.isCustomRubber) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#222222',
              roughness: 0.8,
              metalness: 0.1,
            });
            child.material.isCustomRubber = true;
          }
        }
        // Match rims / alloys (in this Ferrari model, it's 'metal_gray')
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
              metalness: 0.9,
              roughness: 0.2,
            });
            child.material.isCustomRim = true;
          }
        }
      }
    });
  }, [copiedScene, bodyColor, secondaryColor, rimColor, envMapIntensity]);

  // Some models are huge or tiny, let's auto-scale/center it roughly
  return (
    <primitive 
      object={copiedScene} 
      position={position} 
      rotation={rotation} 
      scale={scale} 
    />
  );
};

// ─── Moving HDR Environment Lights ───────────────────────────────────────────
const MovingStudioLights = ({ bgColor = '#2de8cd' }) => {
  const light1Ref = useRef();
  const light2Ref = useRef();
  const light3Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(t * 0.4) * 5;
      light1Ref.current.position.z = Math.cos(t * 0.4) * 5;
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.sin(t * 0.3 + Math.PI) * 8;
      light2Ref.current.position.z = Math.cos(t * 0.3 + Math.PI) * 8;
    }
    if (light3Ref.current) {
      light3Ref.current.position.y = 3 + Math.sin(t * 0.5) * 2;
    }
  });

  return (
    <>
      {/* Key light */}
      <pointLight ref={light1Ref} position={[5, 4, 5]} intensity={4} color="#ffffff" distance={20} />
      {/* Fill light */}
      <pointLight ref={light2Ref} position={[-8, 3, -5]} intensity={3} color={bgColor} distance={25} />
      {/* Top light */}
      <pointLight ref={light3Ref} position={[0, 5, 0]} intensity={2} color="#e0eeff" distance={15} />
      {/* Rim light */}
      <spotLight position={[0, 8, -6]} angle={0.4} penumbra={0.8} intensity={5} color="#6040ff" castShadow />
      {/* Ambient */}
      <ambientLight intensity={0.4} color="#ffffff" />
    </>
  );
};

// ─── Auto-rotating Camera ─────────────────────────────────────────────────────
const CameraRig = ({ hasInteracted }) => {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());
  const timeRef = useRef(0);
  const startedRef = useRef(false);
  const startDelayRef = useRef(3.0); // seconds before animation kicks in

  useFrame((_, delta) => {
    if (hasInteracted) {
      startedRef.current = false;
      timeRef.current = 0;
      return;
    }

    startDelayRef.current -= delta;
    if (startDelayRef.current > 0) return;
    startedRef.current = true;

    timeRef.current += delta;
    const t = timeRef.current;

    const theta = t / 10;
    const radius = 6.5;
    const tx = radius * Math.sin(theta);
    const tz = radius * Math.cos(theta);
    const ty = 1.0 + Math.sin(t * 0.25) * 0.4;

    targetRef.current.set(tx, ty, tz);
    camera.position.lerp(targetRef.current, 0.025);
    camera.lookAt(0, 0.2, 0);
  });

  return null;
};

// ─── Floor ────────────────────────────────────────────────────────────────────
const StudioFloor = ({ bgColor }) => {
  const col = useMemo(() => {
    const c = new THREE.Color(bgColor);
    // Darken slightly, but not to pitch black
    c.multiplyScalar(0.2);
    return c;
  }, [bgColor]);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.68, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={0.8}
        mixStrength={0.6}
        roughness={0.9}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color={col}
        metalness={0.0}
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
  modelType,
}) => {
  const [randomModel] = useState(() => Math.random() > 0.5 ? 'ferrari' : 'bmw');
  const activeModelType = modelType || randomModel;
  
  const [hasInteracted, setHasInteracted] = useState(false);
  const controlsRef = useRef();

  const handleStart = () => {
    setHasInteracted(true);
  };
  const handleEnd = () => {
    // Intentionally leaving this empty as we don't want it to resume
  };

  return (
    <div className={`w-full h-full min-h-[400px] ${className}`} style={{ background: 'transparent' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [5, 1.8, 6], fov: 30, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        {bgLightColor !== 'transparent' && <color attach="background" args={[bgLightColor]} />}
        {bgLightColor !== 'transparent' && <fog attach="fog" args={[bgLightColor, 10, 35]} />}

        {/* Lights */}
        <MovingStudioLights bgColor={bgLightColor === 'transparent' ? '#ffffff' : bgLightColor} />

        {/* Environment */}
        <Environment preset="studio" environmentIntensity={0.6} />

        {/* Floor */}
        {bgLightColor !== 'transparent' && <StudioFloor bgColor={bgLightColor} />}

        {/* Real Car Model */}
        <Float floatIntensity={0.08} speed={1.2} rotationIntensity={0.04}>
          {/* We use React.Suspense so the scene waits for the GLTF to load */}
          <React.Suspense fallback={null}>
            {activeModelType === 'ferrari' ? (
              <CarModel url={ferrariUrl} bodyColor={color || '#2f426f'} secondaryColor={secondaryColor} rimColor={rimColor} envMapIntensity={3.5} scale={1.5} position={[0, -0.05, 0]} rotation={[0, Math.PI, 0]} />
            ) : (
              <CarModel url={bmwUrl} bodyColor={color || '#1B69D4'} secondaryColor={secondaryColor} rimColor={rimColor} envMapIntensity={3.5} scale={0.5} position={[0, -0.05, 0]} rotation={[0, Math.PI, 0]} />
            )}
          </React.Suspense>
        </Float>

        {/* Contact shadow */}
        <ContactShadows
          resolution={1024}
          scale={10}
          blur={2.5}
          opacity={0.6}
          far={8}
          color="#000000"
          position={[0, -0.675, 0]}
        />

        {/* Ambient sparkles */}
        <Sparkles count={60} scale={7} size={1.5} speed={0.2} opacity={0.15} color={bgLightColor} />

        {/* Camera auto-animation */}
        <CameraRig hasInteracted={hasInteracted} />

        {/* Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={3.5}
          maxDistance={12}
          onStart={handleStart}
          onEnd={handleEnd}
          autoRotate={!hasInteracted && autoRotate}
          autoRotateSpeed={autoRotateSpeed}
          target={[0, 0.1, 0]}
        />
      </Canvas>
    </div>
  );
};

export default Car3DViewer;