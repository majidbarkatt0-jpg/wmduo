"use client"
import { useRef, useState, useEffect } from "react"

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function RevealWrapper({ children, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || revealed) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.disconnect() } },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [revealed])

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-900`}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
        filter: revealed ? "blur(0)" : "blur(4px)",
        transitionDelay: `${delay}ms`,
        transitionProperty: "opacity, transform, filter",
        transitionDuration: "900ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  )
}
