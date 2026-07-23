import { Film, Sparkles, Cpu, Zap, Wind, Package } from "lucide-react"

export const CATEGORY_META: Record<string, { icon: any; color: string; emoji: string; desc: string }> = {
  "Projectors": { icon: Film, color: "#E8A94C", emoji: "📽️", desc: "Smart projectors for home cinema" },
  "Home & Wellness": { icon: Sparkles, color: "#34D399", emoji: "🌿", desc: "Wellness essentials for your home" },
  "Auto Accessories": { icon: Cpu, color: "#06B6D4", emoji: "🚗", desc: "Smart gadgets for your car" },
  "Gadgets & Tech": { icon: Zap, color: "#6C63FF", emoji: "🔧", desc: "Clever tech for everyday life" },
  "Air Quality": { icon: Wind, color: "#A855F7", emoji: "💨", desc: "Breathe cleaner at home or work" },
  "Home Cooling": { icon: Wind, color: "#F97316", emoji: "🌀", desc: "Stay cool with premium fans" },
}

export const FALLBACK_CAT_META = { icon: Package, color: "#E8A94C", emoji: "📦", desc: "Premium quality products" }
