"use client"
import { useEffect, useRef } from "react"

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const dotPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const animate = () => {
      ringPos.current.x += (mouseRef.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (mouseRef.current.y - ringPos.current.y) * 0.12
      dotPos.current.x += (mouseRef.current.x - dotPos.current.x) * 0.2
      dotPos.current.y += (mouseRef.current.y - dotPos.current.y) * 0.2
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 3}px, ${dotPos.current.y - 3}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    document.addEventListener("mousemove", onMouse)
    rafRef.current = requestAnimationFrame(animate)

    const addHover = (el: Element) => {
      el.addEventListener("mouseenter", () => {
        ringRef.current?.classList.add("hover")
        dotRef.current?.classList.add("hover")
      })
      el.addEventListener("mouseleave", () => {
        ringRef.current?.classList.remove("hover")
        dotRef.current?.classList.remove("hover")
      })
    }
    document.querySelectorAll("a, button, .bento-card, .btn-gold, .btn-brown").forEach(addHover)

    return () => {
      document.removeEventListener("mousemove", onMouse)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  )
}
