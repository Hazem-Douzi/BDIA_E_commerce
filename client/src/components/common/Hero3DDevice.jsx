import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Futuristic Smart Device - Abstract Placeholder
const SmartDevice = ({ onDeviceClick }) => {
  const meshRef = useRef();
  const [isClicked, setIsClicked] = useState(false);
  const [scale, setScale] = useState(1);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle Y-axis rotation
      meshRef.current.rotation.y += delta * 0.3;
      
      // Click animation
      if (isClicked) {
        const targetScale = 1.2;
        setScale(prev => {
          if (prev >= targetScale) {
            setTimeout(() => {
              setScale(1);
              setIsClicked(false);
            }, 200);
            return prev;
          }
          return prev + delta * 3;
        });
      }
      
      meshRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = () => {
    setIsClicked(true);
    setScale(1.2);
    if (onDeviceClick) {
      onDeviceClick();
    }
  };

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.6}
      floatingRange={[0.3, 0.7]}
    >
      <group ref={meshRef} onClick={handleClick} onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }} onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}>
        {/* Main Device Body - Futuristic Phone/Projector */}
        <group position={[0, 0, 0]}>
          {/* Central Core */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 2, 0.15]} />
            <meshStandardMaterial
              color="#1e293b"
              emissive="#0f172a"
              emissiveIntensity={0.3}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* Screen/Display Area */}
          <mesh position={[0, 0.3, 0.08]}>
            <planeGeometry args={[0.9, 1.2]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive="#3b82f6"
              emissiveIntensity={isClicked ? 1.5 : 0.8}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Holographic Projection Effect */}
          <mesh position={[0, 0.8, 0.1]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.6, 0.8, 8, 1, true]} />
            <meshStandardMaterial
              color="#6366f1"
              emissive="#818cf8"
              emissiveIntensity={isClicked ? 1.2 : 0.6}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Glowing Frame Edges */}
          {[
            [0, 0, 0.08], // Front
            [0, 0, -0.08], // Back
          ].map((pos, i) => (
            <group key={i} position={pos}>
              {/* Top edge */}
              <mesh position={[0, 1, 0]}>
                <boxGeometry args={[1.3, 0.05, 0.02]} />
                <meshStandardMaterial
                  color="#6366f1"
                  emissive="#4f46e5"
                  emissiveIntensity={1}
                />
              </mesh>
              {/* Bottom edge */}
              <mesh position={[0, -1, 0]}>
                <boxGeometry args={[1.3, 0.05, 0.02]} />
                <meshStandardMaterial
                  color="#6366f1"
                  emissive="#4f46e5"
                  emissiveIntensity={1}
                />
              </mesh>
              {/* Left edge */}
              <mesh position={[-0.6, 0, 0]}>
                <boxGeometry args={[0.02, 2.1, 0.02]} />
                <meshStandardMaterial
                  color="#6366f1"
                  emissive="#4f46e5"
                  emissiveIntensity={1}
                />
              </mesh>
              {/* Right edge */}
              <mesh position={[0.6, 0, 0]}>
                <boxGeometry args={[0.02, 2.1, 0.02]} />
                <meshStandardMaterial
                  color="#6366f1"
                  emissive="#4f46e5"
                  emissiveIntensity={1}
                />
              </mesh>
            </group>
          ))}

          {/* Corner Accents */}
          {[
            [-0.6, 1, 0.09],
            [0.6, 1, 0.09],
            [-0.6, -1, 0.09],
            [0.6, -1, 0.09],
          ].map((pos, i) => (
            <mesh key={i} position={pos}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color="#60a5fa"
                emissive="#3b82f6"
                emissiveIntensity={isClicked ? 2 : 1.5}
              />
            </mesh>
          ))}

          {/* Pulse Ring Effect on Click */}
          {isClicked && (
            <mesh position={[0, 0, 0]}>
              <ringGeometry args={[1.5, 1.6, 32]} />
              <meshStandardMaterial
                color="#6366f1"
                emissive="#818cf8"
                emissiveIntensity={2}
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* Floating Particles Around Device */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 1.5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle * 2) * radius;
            const z = Math.sin(angle) * 0.3;
            
            return (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[0.03, 6, 6]} />
                <meshStandardMaterial
                  color="#60a5fa"
                  emissive="#3b82f6"
                  emissiveIntensity={1}
                />
              </mesh>
            );
          })}
        </group>
      </group>
    </Float>
  );
};

// Scene Content Component
const DeviceScene = ({ onDeviceClick }) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 0, 5]} intensity={1.2} color="#6366f1" />
      <pointLight position={[0, 0, -5]} intensity={0.6} color="#8b5cf6" />

      {/* Subtle Background Plane - Removed to prevent black rectangle */}

      {/* Main Device */}
      <SmartDevice onDeviceClick={onDeviceClick} />
    </>
  );
};

// Text Overlay Component (HTML)
const ActivationText = ({ visible, message }) => {
  if (!visible) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
      <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl border border-white/20 animate-pulse">
        <p className="text-lg font-semibold text-center whitespace-nowrap">
          {message}
        </p>
      </div>
    </div>
  );
};

// Main Hero 3D Device Component
const Hero3DDevice = ({ position = 'right' }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [message, setMessage] = useState('');

  const handleDeviceClick = () => {
    const messages = [
      'Exploring the Future!',
      'Device Activated!',
      'Welcome to Innovation!',
      'Future is Here!',
      'Technology Unlocked!'
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    setMessage(randomMessage);
    setIsActivated(true);
    
    setTimeout(() => {
      setIsActivated(false);
    }, 3000);
  };

  const positionClasses = position === 'left' 
    ? 'left-4 md:left-8 lg:left-12' 
    : 'right-4 md:right-8 lg:right-12';

  return (
    <div className={`relative ${positionClasses} w-full md:w-80 lg:w-96 h-[400px] md:h-[500px] lg:h-[600px]`}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <DeviceScene onDeviceClick={handleDeviceClick} />
      </Canvas>

      {/* Click Hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-gray-400 text-xs md:text-sm animate-pulse">
          Click to interact
        </p>
      </div>

      {/* Activation Text Overlay */}
      <ActivationText visible={isActivated} message={message} />
    </div>
  );
};

export default Hero3DDevice;

