"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
  life: number
  maxLife: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []
    let mouseX = 0
    let mouseY = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticle = (x?: number, y?: number): Particle => ({
      x: x ?? Math.random() * canvas.width,
      y: y ?? Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3 - 0.1,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.7 ? 42 : 280, // Gold or purple
      life: 0,
      maxLife: Math.random() * 300 + 200,
    })

    // Initialize particles
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80)
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        // Update position
        p.x += p.speedX
        p.y += p.speedY
        p.life++

        // Mouse interaction
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const force = (150 - dist) / 150
          p.x -= dx * force * 0.01
          p.y -= dy * force * 0.01
          p.opacity = Math.min(p.opacity + 0.02, 0.8)
        }

        // Reset if out of bounds or expired
        if (
          p.life > p.maxLife ||
          p.x < -10 || p.x > canvas.width + 10 ||
          p.y < -10 || p.y > canvas.height + 10
        ) {
          particles[i] = createParticle(
            Math.random() * canvas.width,
            -5
          )
        }

        // Draw particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        const alpha = p.opacity * (1 - p.life / p.maxLife)
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${alpha})`)
        gradient.addColorStop(0.5, `hsla(${p.hue}, 60%, 50%, ${alpha * 0.3})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 40%, 30%, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw connections between nearby particles
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `hsla(${p.hue}, 60%, 60%, ${alpha * 0.1 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()

    const handleResize = () => resize()
    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseX = e.touches[0].clientX
        mouseY = e.touches[0].clientY
      }
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouse)
    window.addEventListener("touchmove", handleTouch)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouse)
      window.removeEventListener("touchmove", handleTouch)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100%", height: "100%" }}
    />
  )
}
