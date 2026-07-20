"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, ContactShadows, RoundedBox, Float } from "@react-three/drei"
import * as THREE from "three"
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw } from "lucide-react"

// Premium 3D Product Viewer with smooth orbital controls
function ProductModel({ autoRotate }: { autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  const lensRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    if (lensRef.current) {
      lensRef.current.position.z = 1.8 + Math.sin(t * 1.2) * 0.015
    }
    if (glowRef.current) {
      if (glowRef.current.material) {
        const mat = glowRef.current.material as THREE.MeshBasicMaterial
        mat.opacity = 0.06 + Math.sin(t * 2) * 0.03
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <RoundedBox args={[2.4, 0.9, 1.8]} radius={0.1} smoothness={4}>
        <meshPhysicalMaterial
          color="#14141A"
          metalness={0.85}
          roughness={0.12}
          clearcoat={0.4}
          clearcoatRoughness={0.3}
          envMapIntensity={0.6}
        />
      </RoundedBox>

      {/* Top glass panel */}
      <RoundedBox args={[1.8, 0.04, 1.2]} radius={0.02} smoothness={4} position={[0, 0.47, 0]}>
        <meshPhysicalMaterial
          color="#0D0D12"
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.5}
          envMapIntensity={0.3}
        />
      </RoundedBox>

      {/* Gold accent - top */}
      <mesh position={[0, 0.35, 0.95]}>
        <boxGeometry args={[2.2, 0.05, 0.02]} />
        <meshPhysicalMaterial color="#E8A94C" metalness={0.8} roughness={0.25} emissive="#E8A94C" emissiveIntensity={0.1} />
      </mesh>

      {/* Gold accent - bottom */}
      <mesh position={[0, -0.1, 0.95]}>
        <boxGeometry args={[2.2, 0.05, 0.02]} />
        <meshPhysicalMaterial color="#E8A94C" metalness={0.8} roughness={0.25} emissive="#E8A94C" emissiveIntensity={0.08} />
      </mesh>

      {/* Gold accent - logo plate */}
      <RoundedBox args={[0.5, 0.1, 0.02]} radius={0.02} smoothness={4} position={[0, 0.32, -0.95]}>
        <meshPhysicalMaterial color="#E8A94C" metalness={0.7} roughness={0.3} emissive="#E8A94C" emissiveIntensity={0.15} />
      </RoundedBox>

      {/* Lens housing */}
      <group position={[0, 0.2, 1.0]}>
        <mesh>
          <cylinderGeometry args={[0.45, 0.5, 0.35, 48]} />
          <meshPhysicalMaterial color="#1A1A23" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Lens ring - gold */}
        <mesh position={[0, 0, 0.2]}>
          <torusGeometry args={[0.42, 0.03, 16, 48]} />
          <meshPhysicalMaterial color="#E8A94C" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Lens glass */}
        <mesh ref={lensRef} position={[0, 0, 0.22]}>
          <circleGeometry args={[0.38, 48]} />
          <meshPhysicalMaterial
            color="#6C63FF"
            metalness={0.1}
            roughness={0.05}
            transparent
            opacity={0.4}
            envMapIntensity={1.5}
            ior={2.5}
            reflectivity={0.8}
          />
        </mesh>
        {/* Inner glow */}
        <mesh ref={glowRef} position={[0, 0, 0.15]}>
          <circleGeometry args={[0.3, 32]} />
          <meshBasicMaterial color="#6C63FF" transparent opacity={0.06} />
        </mesh>
      </group>

      {/* Stand */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 0.12, 48]} />
        <meshPhysicalMaterial color="#1A1A23" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Base ring */}
      <mesh position={[0, -0.75, 0]}>
        <torusGeometry args={[0.8, 0.04, 16, 48]} />
        <meshPhysicalMaterial color="#E8A94C" metalness={0.5} roughness={0.5} emissive="#E8A94C" emissiveIntensity={0.04} />
      </mesh>

      {/* Side vents - left */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`vl${i}`} position={[-1.25, 0.25 - i * 0.09, -0.3 + i * 0.12]}>
          <boxGeometry args={[0.02, 0.015, 0.08]} />
          <meshPhysicalMaterial color="#0D0D12" metalness={0.3} roughness={0.9} />
        </mesh>
      ))}

      {/* Side vents - right */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`vr${i}`} position={[1.25, 0.25 - i * 0.09, -0.3 + i * 0.12]}>
          <boxGeometry args={[0.02, 0.015, 0.08]} />
          <meshPhysicalMaterial color="#0D0D12" metalness={0.3} roughness={0.9} />
        </mesh>
      ))}

      {/* Cooling fan grille - top */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={`fg${i}`} position={[-0.3 + i * 0.3, 0.48, -0.6]}>
          <boxGeometry args={[0.25, 0.01, 0.02]} />
          <meshPhysicalMaterial color="#0D0D12" metalness={0.5} roughness={0.8} />
        </mesh>
      ))}

      {/* Power LED */}
      <mesh position={[0.9, -0.05, 0.95]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>

      {/* Small status LED */}
      <mesh position={[0.9, -0.12, 0.95]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="#E8A94C" opacity={0.5} transparent />
      </mesh>
    </group>
  )
}

function ViewerControls({
  isFullscreen,
  onToggleFullscreen,
  onReset,
  onZoomIn,
  onZoomOut,
}: {
  isFullscreen: boolean
  onToggleFullscreen: () => void
  onReset: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#1A1A23]/90 backdrop-blur-md rounded-2xl px-4 py-2 border border-[#2A2A35] shadow-premium z-10">
      <button
        onClick={onZoomOut}
        className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#2A2A35] rounded-xl transition-all"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        onClick={onReset}
        className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#2A2A35] rounded-xl transition-all"
        title="Reset View"
      >
        <RotateCw className="w-4 h-4" />
      </button>
      <button
        onClick={onZoomIn}
        className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#2A2A35] rounded-xl transition-all"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-[#2A2A35]" />
      <button
        onClick={onToggleFullscreen}
        className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#2A2A35] rounded-xl transition-all"
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  )
}

export default function ProductViewer360() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null!)
  const controlsRef = useRef<any>(null)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  const handleReset = useCallback(() => {
    setAutoRotate(true)
    setTimeout(() => setAutoRotate(false), 500)
  }, [])

  const handleZoomIn = useCallback(() => {
    if (controlsRef.current) {
      const cam = controlsRef.current.object
      const dir = new THREE.Vector3()
      cam.getWorldDirection(dir)
      cam.position.addScaledVector(dir, 0.3)
      controlsRef.current.update()
    }
  }, [])

  const handleZoomOut = useCallback(() => {
    if (controlsRef.current) {
      const cam = controlsRef.current.object
      const dir = new THREE.Vector3()
      cam.getWorldDirection(dir)
      cam.position.addScaledVector(dir, -0.3)
      controlsRef.current.update()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative bg-gradient-to-b from-[#0D0D12] to-[#0A0A0F] rounded-3xl overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "w-full aspect-square max-w-lg mx-auto"
      }`}
    >
      <Canvas
        camera={{ position: [4, 2, 4.5], fov: 30 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ camera }) => { camera.position.set(4, 2, 4.5) }}
      >
        <color attach="background" args={["#0D0D12"]} />
        
        {/* Self-contained lighting (no external HDR dependency) */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={2.0} />
        <directionalLight position={[-5, 3, -2]} intensity={0.6} color="#6C63FF" />
        <spotLight position={[0, 5, 0]} intensity={0.3} color="#E8A94C" angle={0.5} penumbra={0.5} />
        
        <Float speed={0.8} rotationIntensity={0.03} floatIntensity={0.2}>
          <ProductModel autoRotate={autoRotate} />
        </Float>

        <ContactShadows position={[0, -0.85, 0]} opacity={0.5} scale={6} blur={3} far={4} />

        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={3}
          minPolarAngle={0.5}
          maxPolarAngle={2.2}
          minDistance={2.5}
          maxDistance={8}
          target={[0, 0, 0]}
          onStart={() => setAutoRotate(false)}
          onEnd={() => {}}
        />
      </Canvas>

      {/* View angle indicators */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#1A1A23]/80 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-[#2A2A35]">
        <RotateCw className="w-3 h-3 text-[#E8A94C]" />
        <span className="text-xs text-[#A1A1AA] font-medium">Drag to rotate • Scroll to zoom</span>
      </div>

      <ViewerControls
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onReset={handleReset}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </div>
  )
}
