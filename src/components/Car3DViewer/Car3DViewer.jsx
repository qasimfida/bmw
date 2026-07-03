import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Car Model
const ProceduralCar = ({ color }) => {
  const group = useRef();

  const materials = useMemo(() => {
    return {
      bodyPaint: new THREE.MeshStandardMaterial({
        color: color || '#1c1c1c',
        metalness: 0.8,
        roughness: 0.2,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#000000',
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8,
        transmission: 0.5,
        ior: 1.5,
      }),
      rubber: new THREE.MeshStandardMaterial({
        color: '#0a0a0a',
        roughness: 0.9,
      }),
      rims: new THREE.MeshStandardMaterial({
        color: '#aaaaaa',
        metalness: 0.9,
        roughness: 0.2,
      }),
      headlights: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: 0.5,
      }),
      taillights: new THREE.MeshStandardMaterial({
        color: '#ff0000',
        emissive: '#ff0000',
        emissiveIntensity: 0.5,
      }),
      grille: new THREE.MeshStandardMaterial({
        color: '#050505',
        metalness: 0.5,
        roughness: 0.5,
      })
    };
  }, [color]);

  return (
    <group ref={group} dispose={null} position={[0, -0.2, 0]}>
      {/* Lower Body */}
      <mesh material={materials.bodyPaint} position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.5, 4.2]} />
      </mesh>
      {/* Upper Body */}
      <mesh material={materials.bodyPaint} position={[0, 0.9, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.4, 2.0]} />
      </mesh>
      {/* Windows */}
      <mesh material={materials.glass} position={[0, 0.9, 0.81]} rotation={[-0.5, 0, 0]} castShadow>
        <planeGeometry args={[1.4, 0.8]} />
      </mesh>
      <mesh material={materials.glass} position={[0, 0.9, -1.21]} rotation={[0.5, 0, 0]} castShadow>
        <planeGeometry args={[1.4, 0.8]} />
      </mesh>
      <mesh material={materials.glass} position={[0.76, 0.9, -0.2]} rotation={[0, Math.PI/2, 0]} castShadow>
        <planeGeometry args={[1.9, 0.35]} />
      </mesh>
      <mesh material={materials.glass} position={[-0.76, 0.9, -0.2]} rotation={[0, -Math.PI/2, 0]} castShadow>
        <planeGeometry args={[1.9, 0.35]} />
      </mesh>
      {/* Grille */}
      <mesh material={materials.grille} position={[0.2, 0.4, 2.11]} castShadow>
        <boxGeometry args={[0.5, 0.25, 0.05]} />
      </mesh>
      <mesh material={materials.grille} position={[-0.2, 0.4, 2.11]} castShadow>
        <boxGeometry args={[0.5, 0.25, 0.05]} />
      </mesh>
      {/* Lights */}
      <mesh material={materials.headlights} position={[0.7, 0.5, 2.11]} castShadow>
        <boxGeometry args={[0.4, 0.15, 0.05]} />
      </mesh>
      <mesh material={materials.headlights} position={[-0.7, 0.5, 2.11]} castShadow>
        <boxGeometry args={[0.4, 0.15, 0.05]} />
      </mesh>
      <mesh material={materials.taillights} position={[0.7, 0.5, -2.11]} castShadow>
        <boxGeometry args={[0.4, 0.15, 0.05]} />
      </mesh>
      <mesh material={materials.taillights} position={[-0.7, 0.5, -2.11]} castShadow>
        <boxGeometry args={[0.4, 0.15, 0.05]} />
      </mesh>
      {/* Wheels */}
      {[ [0.9, 0.3, 1.4], [-0.9, 0.3, 1.4], [0.9, 0.3, -1.2], [-0.9, 0.3, -1.2] ].map((pos, idx) => (
        <group key={idx} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={materials.rubber} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
          </mesh>
          <mesh material={materials.rims} position={[0, pos[0] > 0 ? 0.13 : -0.13, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Car3DViewer = ({ color, autoRotate = true, autoRotateSpeed = 1.5, className = "" }) => {
  return (
    <div className={`w-full h-full min-h-[400px] ${className}`}>
      <Canvas shadows camera={{ position: [5, 2, 5], fov: 45 }}>
        {/* We make background transparent so it blends with hero or details page */}
        
        <ambientLight intensity={0.5} />
        <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1} castShadow />
        <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={0.8} />
        <spotLight position={[-5, 5, -5]} angle={0.3} penumbra={1} intensity={0.8} />
        
        <Environment preset="studio" />

        <ProceduralCar color={color} />

        <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.5} far={10} color="#000000" />
        
        <OrbitControls 
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={4}
          maxDistance={10}
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
        />
      </Canvas>
    </div>
  );
};

export default Car3DViewer;
