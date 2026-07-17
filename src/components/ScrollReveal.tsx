"use client"

import { useRef, useEffect, useState } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  animation?: "up" | "left" | "right" | "scale" | "tilt" | "card"
  delay?: number
  threshold?: number
}

export default function ScrollReveal({
  children,
  className = "",
  animation = "up",
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, threshold])

  const getAnimationClass = () => {
    if (!isVisible) {
      switch (animation) {
        case "up": return "opacity-0 translate-y-12"
        case "left": return "opacity-0 -translate-x-16"
        case "right": return "opacity-0 translate-x-16"
        case "scale": return "opacity-0 scale-75"
        case "tilt": return "opacity-0 -translate-y-8 rotate-x-12"
        case "card": return "opacity-0"
        default: return "opacity-0 translate-y-12"
      }
    }
    switch (animation) {
      case "tilt": return "opacity-100 translate-y-0 rotate-x-0 animate-tilt-in"
      case "card": return "opacity-100 animate-card-enter"
      default: return "opacity-100 translate-x-0 translate-y-0 scale-100"
    }
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${getAnimationClass()} ${className}`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  )
}
