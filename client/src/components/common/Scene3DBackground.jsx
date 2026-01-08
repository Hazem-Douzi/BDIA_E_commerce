import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Low-poly Drone Model
const Drone = ({ position }) => {
  const meshRef = useRef();
  
  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.8}
      floatingRange={[0.2, 0.5]}
    >
      <group ref={meshRef} position={position} scale={[0.8, 0.8, 0.8]}>
        {/* Main body */}
        <mesh>
          <boxGeometry args={[1, 0.3, 1]} />
          <meshStandardMaterial 
            color="#6366f1" 
            emissive="#4f46e5" 
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Propeller arms */}
        {[
          [0.7, 0, 0.7],
          [-0.7, 0, 0.7],
          [0.7, 0, -0.7],
          [-0.7, 0, -0.7],
        ].map((pos, i) => (
          <group key={i} position={pos}>
            <mesh>
              <boxGeometry args={[0.1, 0.05, 0.5]} />
              <meshStandardMaterial 
                color="#818cf8" 
                emissive="#6366f1" 
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Propeller */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} />
              <meshStandardMaterial 
                color="#a5b4fc" 
                emissive="#818cf8" 
                emissiveIntensity={0.4}
                transparent
                opacity={0.8}
              />
            </mesh>
          </group>
        ))}
        {/* LED lights */}
        {[
          [0.4, 0.2, 0.4],
          [-0.4, 0.2, 0.4],
          [0.4, 0.2, -0.4],
          [-0.4, 0.2, -0.4],
        ].map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color="#60a5fa" 
              emissive="#3b82f6" 
              emissiveIntensity={1}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

// Low-poly Laptop Model
const Laptop = ({ position }) => {
  const meshRef = useRef();
  
  return (
    <Float
      speed={1.2}
      rotationIntensity={0.3}
      floatIntensity={0.6}
      floatingRange={[0.15, 0.4]}
    >
      <group ref={meshRef} position={position} rotation={[0, Math.PI / 4, 0]}>
        {/* Base */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[1.5, 0.1, 1]} />
          <meshStandardMaterial 
            color="#475569" 
            emissive="#334155" 
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.4, -0.3]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[1.4, 0.9, 0.05]} />
          <meshStandardMaterial 
            color="#1e293b" 
            emissive="#0f172a" 
            emissiveIntensity={0.1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Screen glow */}
        <mesh position={[0, 0.4, -0.27]} rotation={[-0.3, 0, 0]}>
          <planeGeometry args={[1.3, 0.85]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            emissive="#2563eb" 
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
        {/* Keyboard area */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.4, 0.02, 0.95]} />
          <meshStandardMaterial 
            color="#64748b" 
            emissive="#475569" 
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Low-poly Headphones Model
const Headphones = ({ position }) => {
  const meshRef = useRef();
  
  return (
    <Float
      speed={1.8}
      rotationIntensity={0.4}
      floatIntensity={0.7}
      floatingRange={[0.2, 0.5]}
    >
      <group ref={meshRef} position={position} rotation={[0.2, Math.PI / 6, 0]}>
        {/* Left ear cup */}
        <mesh position={[-0.5, 0, 0]}>
          <torusGeometry args={[0.3, 0.15, 8, 16]} />
          <meshStandardMaterial 
            color="#6366f1" 
            emissive="#4f46e5" 
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Right ear cup */}
        <mesh position={[0.5, 0, 0]}>
          <torusGeometry args={[0.3, 0.15, 8, 16]} />
          <meshStandardMaterial 
            color="#6366f1" 
            emissive="#4f46e5" 
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Headband */}
        <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.9, 8]} />
          <meshStandardMaterial 
            color="#475569" 
            emissive="#334155" 
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Glowing accents */}
        {[-0.5, 0.5].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.35]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color="#60a5fa" 
              emissive="#3b82f6" 
              emissiveIntensity={1.5}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

// Abstract geometric shape - Data Packet
const DataPacket = ({ position, color, size = 0.3 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[size * 0.6, 8, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.8}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

// Camera controller with mouse parallax
const CameraController = () => {
  const { camera } = useThree();
  const initialPosition = useRef([camera.position.x, camera.position.y, camera.position.z]);
  const [mouse, setMouse] = useState([0, 0]);

  useEffect(() => {
    // Store initial camera position
    initialPosition.current = [camera.position.x, camera.position.y, camera.position.z];
    
    const handleMouseMove = (e) => {
      const x = ((e.clientX / window.innerWidth) * 2 - 1) * 0.3;
      const y = (-(e.clientY / window.innerHeight) * 2 + 1) * 0.3;
      setMouse([x, y]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera]);

  useFrame(() => {
    const targetX = initialPosition.current[0] + mouse[0];
    const targetY = initialPosition.current[1] + mouse[1];
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// Main Scene Component
const SceneContent = () => {
  return (
    <>
      <CameraController />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#6366f1" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#3b82f6" />

      {/* Fog */}
      <fog attach="fog" args={['#0f172a', 10, 30]} />

      {/* Hero Objects */}
      <Drone position={[-4, 2, -3]} />
      <Laptop position={[4, -1, -4]} />
      <Headphones position={[-3, -2, 2]} />

      {/* Abstract Background Elements - Data Packets */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 8 + (i % 3) * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 6;
        const colors = ['#6366f1', '#8b5cf6', '#3b82f6', '#60a5fa'];
        
        return (
          <DataPacket
            key={i}
            position={[x, y, z]}
            color={colors[i % colors.length]}
            size={0.2 + Math.random() * 0.2}
          />
        );
      })}

      {/* Circuit Node Particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 20;
        
        return (
          <mesh key={`particle-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial 
              color="#60a5fa" 
              emissive="#3b82f6" 
              emissiveIntensity={1}
            />
          </mesh>
        );
      })}
    </>
  );
};

// Main 3D Background Component
const Scene3DBackground = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render on mobile for performance
  if (isMobile) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]} // Limit pixel ratio for performance
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default Scene3DBackground;

