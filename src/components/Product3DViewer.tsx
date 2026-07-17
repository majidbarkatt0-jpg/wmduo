"use client"

import { useRef, useState, useEffect } from "react"

interface Product3DViewerProps {
  imageUrl: string
  alt?: string
  className?: string
  badges?: Array<{ text: string; position: string; color: string; delay?: string }>
  glowColor?: string
}

export default function Product3DViewer({
  imageUrl,
  alt = "Product",
  className = "",
  badges = [],
  glowColor = "rgba(139,92,246,0.15)",
}: Product3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const autoRotateRef = useRef<number>(0)

  // Auto-rotation
  useEffect(() => {
    if (!isAutoRotating) return
    let angle = 0
    const animate = () => {
      angle += 0.003
      if (!isHovered) {
        setRotation({
          x: Math.sin(angle) * 3,
          y: Math.sin(angle * 0.7) * 10,
        })
      }
      autoRotateRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(autoRotateRef.current)
  }, [isAutoRotating, isHovered])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsAutoRotating(false)
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x, y })
    setRotation({
      x: (y - 0.5) * -15,
      y: (x - 0.5) * 20,
    })
  }

  const handleMouseLeave = () => {
    setIsAutoRotating(true)
    setRotation({ x: 0, y: 0 })
  }

  // Glow follows mouse
  const glowX = mousePos.x * 100
  const glowY = mousePos.y * 100

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center ${className}`}
      style={{ perspective: "1200px" }}
    >
      {/* Outer glow rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-purple-300/20 animate-spin-slow"
          style={{ boxShadow: `0 0 60px ${glowColor}` }}
        />
        <div className="w-56 h-56 sm:w-80 sm:h-80 rounded-full border border-blue-300/15 animate-spin-slower absolute" />
        <div className="w-40 h-40 sm:w-60 sm:h-60 rounded-full bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 blur-2xl absolute animate-pulse" />
      </div>

      {/* 3D Product container */}
      <div
        className="relative group cursor-grab active:cursor-grabbing"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
          transition: isAutoRotating ? "none" : "transform 0.1s ease",
        }}
      >
        {/* Dynamic glow that follows mouse */}
        <div
          className="absolute -inset-8 rounded-[2.5rem] blur-2xl opacity-60 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${glowColor} 0%, transparent 60%)`,
          }}
        />

        {/* Image */}
        <div className="relative" style={{ transform: "translateZ(40px)" }}>
          <img
            src={imageUrl}
            alt={alt}
            className="w-full max-w-md rounded-[2rem] shadow-2xl relative z-10 
                       transition-all duration-500 
                       group-hover:shadow-[0_30px_60px_rgba(139,92,246,0.25)]
                       group-hover:brightness-110"
            draggable={false}
          />

          {/* Shine overlay */}
          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Floating badges */}
        {badges.map((badge, i) => (
          <div
            key={i}
            className={`absolute ${badge.position} bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-100 text-sm font-bold animate-bounce z-20`}
            style={{
              animationDelay: badge.delay || `${i * 0.5}s`,
              transform: `translateZ(${30 + i * 10}px)`,
              color: badge.color,
            }}
          >
            {badge.text}
          </div>
        ))}
      </div>

      {/* 3D Depth layers for parallax effect */}
      <div
        className="absolute w-32 h-32 rounded-full bg-purple-500/5 blur-3xl"
        style={{
          transform: `translateZ(-50px) translateX(${(mousePos.x - 0.5) * -20}px) translateY(${(mousePos.y - 0.5) * -20}px)`,
          transition: "transform 0.3s ease",
          top: "30%",
          left: "20%",
        }}
      />
      <div
        className="absolute w-24 h-24 rounded-full bg-blue-500/5 blur-3xl"
        style={{
          transform: `translateZ(-30px) translateX(${(mousePos.x - 0.5) * 30}px) translateY(${(mousePos.y - 0.5) * 30}px)`,
          transition: "transform 0.3s ease",
          bottom: "20%",
          right: "25%",
        }}
      />
    </div>
  )
}
