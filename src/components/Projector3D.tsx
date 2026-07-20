"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Float, MeshTransmissionMaterial, ContactShadows, RoundedBox } from "@react-three/drei"
import * as THREE from "three"

function ProjectorBody() {
  const lensRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.05
    }
    if (lensRef.current) {
      lensRef.current.position.z = 1.8 + Math.sin(t * 1.5) * 0.02
      lensRef.current.scale.x = 0.5 + Math.sin(t * 0.8) * 0.02
      lensRef.current.scale.y = 0.5 + Math.sin(t * 0.8) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Main Body - Premium dark housing */}
      <RoundedBox args={[2.2, 0.8, 1.6]} radius={0.08} smoothness={4} position={[0, 0.3, 0]}>
        <meshPhysicalMaterial
          color="#1A1A23"
          metalness={0.9}
          roughness={0.15}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
          envMapIntensity={0.8}
        />
      </RoundedBox>

      {/* Top Panel - Glass/glossy finish */}
      <RoundedBox args={[1.6, 0.05, 1.0]} radius={0.03} smoothness={4} position={[0, 0.72, 0]}>
        <meshPhysicalMaterial
          color="#0D0D12"
          metalness={0.5}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </RoundedBox>

      {/* Gold accent stripe */}
      <mesh position={[0, 0.3, 0.82]}>
        <boxGeometry args={[2.0, 0.06, 0.02]} />
        <meshPhysicalMaterial color="#E8A94C" metalness={0.7} roughness={0.3} emissive="#E8A94C" emissiveIntensity={0.15} />
      </mesh>

      {/* Gold accent stripe bottom */}
      <mesh position={[0, -0.1, 0.82]}>
        <boxGeometry args={[2.0, 0.06, 0.02]} />
        <meshPhysicalMaterial color="#E8A94C" metalness={0.7} roughness={0.3} emissive="#E8A94C" emissiveIntensity={0.1} />
      </mesh>

      {/* Lens Housing */}
      <group position={[0, 0.3, 0.9]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.45, 0.3, 32]} />
          <meshPhysicalMaterial
            color="#2A2A35"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Lens glass */}
        <mesh ref={lensRef} position={[0, 0, 0.18]}>
          <circleGeometry args={[0.35, 32]} />
          <MeshTransmissionMaterial
            backside
            thickness={0.5}
            roughness={0.05}
            chromaticAberration={0.1}
            ior={1.5}
            color="#6C63FF"
            envMapIntensity={0.5}
          />
        </mesh>
        {/* Lens ring - gold */}
        <mesh position={[0, 0, 0.15]}>
          <torusGeometry args={[0.38, 0.03, 16, 32]} />
          <meshPhysicalMaterial color="#E8A94C" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Light beam from lens */}
      <mesh position={[0, 0.3, 2.5]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.15, 1.5, 8]} />
        <meshBasicMaterial color="#6C63FF" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* Vents on side */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[1.18, 0.3 - i * 0.08, -0.3 + i * 0.1]}>
          <boxGeometry args={[0.02, 0.02, 0.06]} />
          <meshPhysicalMaterial color="#0D0D12" metalness={0.5} roughness={0.8} />
        </mesh>
      ))}

      {/* Vents on other side */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`v${i}`} position={[-1.18, 0.3 - i * 0.08, -0.3 + i * 0.1]}>
          <boxGeometry args={[0.02, 0.02, 0.06]} />
          <meshPhysicalMaterial color="#0D0D12" metalness={0.5} roughness={0.8} />
        </mesh>
      ))}

      {/* Brand plate */}
      <RoundedBox args={[0.6, 0.12, 0.02]} radius={0.02} smoothness={4} position={[0, 0.55, -0.85]}>
        <meshPhysicalMaterial color="#E8A94C" metalness={0.6} roughness={0.4} />
      </RoundedBox>

      {/* Base/Stand */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 0.1, 32]} />
        <meshPhysicalMaterial color="#1A1A23" metalness={0.7} roughness={0.5} />
      </mesh>

      {/* Base bottom ring */}
      <mesh position={[0, -0.65, 0]}>
        <torusGeometry args={[0.7, 0.04, 16, 32]} />
        <meshPhysicalMaterial color="#E8A94C" metalness={0.5} roughness={0.6} emissive="#E8A94C" emissiveIntensity={0.05} />
      </mesh>

      {/* LED power indicator */}
      <mesh position={[0.8, 0.1, 0.85]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>
    </group>
  )
}

function FloatingParticles() {
  const count = 60
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 8
    }
    return pos
  }, [])

  const sizes = useMemo(() => {
    return Float32Array.from({ length: count }, () => Math.random() * 2 + 1)
  }, [])

  const pointsRef = useRef<THREE.Points>(null!)
  const particleTimeRef = useRef(0)

  useFrame((_state, delta) => {
    particleTimeRef.current += delta
    if (pointsRef.current) {
      pointsRef.current.rotation.y = particleTimeRef.current * 0.02
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#E8A94C"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}



export default function Projector3DScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [4, 2.5, 5], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0D0D12"]} />
        
        {/* Self-contained lighting (no external HDR dependency) */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.8} castShadow />
        <directionalLight position={[-5, 3, -2]} intensity={0.5} color="#6C63FF" />
        <spotLight position={[0, 5, 0]} intensity={0.5} color="#E8A94C" angle={0.5} penumbra={0.5} />
        <pointLight position={[-3, 1, 3]} intensity={0.8} color="#6C63FF" />
        
        {/* Main scene */}
        <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.3}>
          <ProjectorBody />
        </Float>
        
        <FloatingParticles />
        
        {/* Ground shadow */}
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.4}
          scale={6}
          blur={2.5}
          far={4}
        />
        
        {/* Orbital controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  )
}
