"use client"

import { useState, useRef, useCallback } from "react"

interface Props {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

export default function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel, afterLabel }: Props) {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setSliderPos((x / rect.width) * 100)
  }, [])

  const handleMouseDown = () => { dragging.current = true }
  const handleMouseUp = () => { dragging.current = false }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging.current) updatePosition(e.clientX)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-ew-resize bg-[#14141A] border border-[#2A2A35]"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* After image (full) */}
      <img
        src={afterImage}
        alt="After"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        loading="lazy"
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeImage}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: "none" }}
          draggable={false}
          loading="lazy"
        />
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10 z-10">
        <span className="text-[#E8A94C] font-semibold">Before:</span> {beforeLabel || "Before"}
      </div>
      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10 z-10">
        <span className="text-[#34D399] font-semibold">After:</span> {afterLabel || "After"}
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 z-20"
        style={{ left: `calc(${sliderPos}% - 1.5px)` }}
      >
        {/* Vertical line */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-white shadow-lg" />

        {/* Handle circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border-2 border-[#E8A94C] flex items-center justify-center">
          <div className="flex gap-1">
            <ChevronIcon direction="left" />
            <ChevronIcon direction="right" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      className={direction === "right" ? "transform rotate-180" : ""}
    >
      <path
        d="M7 1L2 6L7 11"
        stroke="#6C63FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
