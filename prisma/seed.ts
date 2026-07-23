import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const products = [
  // ===== 1. CASTLEVIEW MINI (THE ORIGINAL PRODUCT - KEEP EXACTLY ONE) =====
  {
    name: "CastleView™ Mini 210° Smart Projector",
    slug: "castleview-mini-210-smart-projector",
    description: "Turn any room into a magical window — the world's most compact 210° rotating smart projector. Auto-focus, keystone correction, and built-in Android TV. 200M+ TikTok views for a reason. Perfect for bedrooms, living rooms, and offices.",
    price: 89,
    compareAt: 142,
    category: "Projectors",
    imageUrl: "https://images.unsplash.com/photo-1626379806184-0b98d5c11c11?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1626379806184-0b98d5c11c11?w=600",
      "https://images.unsplash.com/photo-1596984682893-5f1c5e9a65c4?w=600",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    ]),
    features: JSON.stringify([
      "210° Rotation Arm — project on walls or ceilings",
      "Auto Keystone + Auto Focus — zero setup",
      "Built-in Android TV — Netflix, YouTube, Prime",
      "WiFi 6 + Bluetooth 5.3 — fast streaming",
      "4K Input Support — stunning clarity",
      "Dual 8W Speakers — room-filling sound"
    ]),
    specs: JSON.stringify({
      "Resolution": "1920×1080 (Full HD)",
      "Brightness": "200 ANSI Lumens",
      "Display Tech": "LCD",
      "Contrast Ratio": "10000:1",
      "Lamp Life": "50,000 hours",
      "Connectivity": "HDMI 2.1, USB-C, WiFi 6, BT 5.3",
      "Audio": "Dual 8W Stereo Speakers",
      "Weight": "1.2 kg",
      "What's in the Box": "Projector, Remote, Power Adapter, HDMI Cable, User Manual"
    }),
    sku: "CVM-210-BLK",
    stock: 250,
    featured: true,
    rating: 4.9,
    reviewCount: 2847,
  },

  // ===== 2. AUDIO — HEADPHONES & EARBUDS =====
  {
    name: "SoundFlare Pro ANC Wireless Headphones",
    slug: "soundflare-pro-anc-headphones",
    description: "Premium over-ear headphones with adaptive noise cancellation, 60-hour battery life, and ultra-comfortable memory foam ear cushions. LDAC support for hi-res audio streaming. Fold-flat design with carrying case.",
    price: 79,
    compareAt: 149,
    category: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600",
      "https://images.unsplash.com/photo-1588156979435-379b97a631c0?w=600",
    ]),
    features: JSON.stringify([
      "Adaptive ANC — 4 ambient modes",
      "60hr battery (ANC off) / 40hr (ANC on)",
      "LDAC + AAC + SBC codecs",
      "Memory foam ear cushions",
      "Fold-flat design with hard case",
      "Multipoint connection — 2 devices at once"
    ]),
    specs: JSON.stringify({
      "Driver": "40mm Neodymium",
      "Frequency Response": "20Hz - 40kHz",
      "ANC": "Adaptive up to -40dB",
      "Battery": "60hr (ANC off) / 40hr (ANC on)",
      "Charging": "USB-C (fast charge: 5min = 5hr)",
      "Bluetooth": "5.3",
      "Weight": "250g",
      "Includes": "Hard case, USB-C cable, 3.5mm cable, airplane adapter"
    }),
    sku: "SF-PRO-ANC-BLK",
    stock: 500,
    featured: true,
    rating: 4.8,
    reviewCount: 3456,
  },
  {
    name: "PulseBuds Air True Wireless Earbuds",
    slug: "pulsebuds-air-tws-earbuds",
    description: "Ultra-compact true wireless earbuds with 12mm drivers, spatial audio, and AI call noise cancellation. IPX5 sweatproof with wireless charging case. 40hr total battery.",
    price: 49,
    compareAt: 89,
    category: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600",
    ]),
    features: JSON.stringify([
      "12mm Dynamic Drivers — deep bass",
      "Spatial Audio with head tracking",
      "AI ENC for crystal-clear calls",
      "IPX5 sweat & water resistant",
      "Wireless Qi charging case",
      "40hr total (8hr buds + 32hr case)"
    ]),
    specs: JSON.stringify({
      "Driver": "12mm Dynamic",
      "Battery": "8hr buds / 40hr with case",
      "Charging": "USB-C + Wireless Qi",
      "Water Resistance": "IPX5",
      "Bluetooth": "5.3",
      "Latency": "60ms (low-latency mode)",
      "Weight": "4.5g per earbud",
      "Colors": "Matte Black, Pearl White"
    }),
    sku: "PB-AIR-TWS-BK",
    stock: 800,
    featured: true,
    rating: 4.7,
    reviewCount: 5678,
  },
  {
    name: "BassPulse Go Portable Bluetooth Speaker",
    slug: "basspulse-go-bt-speaker",
    description: "Rugged 30W portable Bluetooth speaker with 360° sound, IPX7 waterproof rating, and 24-hour battery. Built-in power bank function charges your phone. Perfect for outdoor adventures.",
    price: 39,
    compareAt: 69,
    category: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
    ]),
    features: JSON.stringify([
      "30W 360° Room-Filling Sound",
      "IPX7 Waterproof — floats in water",
      "24hr Battery Life",
      "Built-in Power Bank (charge your phone)",
      "TWS Pairing — stereo with 2 speakers",
      "Built-in mic for speakerphone calls"
    ]),
    specs: JSON.stringify({
      "Power": "30W (2 × 15W drivers)",
      "Battery": "24 hours",
      "Waterproof": "IPX7 (1m depth, 30min)",
      "Bluetooth": "5.3",
      "Speakerphone": "Yes (AI noise reduction)",
      "Power Bank": "USB-A output 5V/2A",
      "Weight": "580g",
      "Colors": "Black, Camo, Sand, Blue"
    }),
    sku: "BP-GO-BT30-BK",
    stock: 650,
    featured: false,
    rating: 4.6,
    reviewCount: 2789,
  },

  // ===== 3. CHARGING & POWER =====
  {
    name: "VoltMax GaN 65W 3-Port Charger",
    slug: "voltmax-gan-65w-charger",
    description: "Ultra-compact GaN (Gallium Nitride) 65W charger with 2 USB-C and 1 USB-A ports. Charge a MacBook Pro, iPad, and iPhone simultaneously. 60% smaller than traditional 65W chargers. Foldable prongs for travel.",
    price: 35,
    compareAt: 59,
    category: "Charging",
    imageUrl: "https://images.unsplash.com/photo-1617766706763-fe0b6b2a3cde?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1617766706763-fe0b6b2a3cde?w=600",
      "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=600",
    ]),
    features: JSON.stringify([
      "GaN III Technology — compact & cool",
      "65W total: 45W + 20W + 18W",
      "2× USB-C + 1× USB-A",
      "Charge MacBook Pro 14\" at full speed",
      "Foldable US/EU/UK prongs",
      "Universal compatibility — laptops, tablets, phones"
    ]),
    specs: JSON.stringify({
      "Total Power": "65W",
      "Ports": "2× USB-C PD 3.0 + 1× USB-A QC 3.0",
      "USB-C1 Output": "45W (MacBook/Air)",
      "USB-C2 Output": "20W (iPhone/iPad)",
      "USB-A Output": "18W (QC 3.0)",
      "Technology": "GaN III (Gallium Nitride)",
      "Size": "52 × 52 × 30mm",
      "Weight": "120g"
    }),
    sku: "VM-GAN65-BLK",
    stock: 1200,
    featured: true,
    rating: 4.9,
    reviewCount: 8901,
  },
  {
    name: "PowerTank 20000mAh Magnetic Power Bank",
    slug: "powertank-20k-magnetic-powerbank",
    description: "Slim 20,000mAh magnetic wireless power bank with foldable kickstand. Snap onto your phone for MagSafe charging at 15W. Also has 2 USB-C ports for wired charging. LED display shows exact remaining battery.",
    price: 45,
    compareAt: 79,
    category: "Charging",
    imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600",
      "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=600",
    ]),
    features: JSON.stringify([
      "20000mAh capacity — 5+ phone charges",
      "15W Magnetic Wireless Charging (MagSafe)",
      "Built-in foldable kickstand",
      "2× USB-C PD (20W each)",
      "LED percentage display",
      "Airplane safe — under 100Wh"
    ]),
    specs: JSON.stringify({
      "Capacity": "20000mAh / 74Wh",
      "Wireless Output": "15W (MagSafe compatible)",
      "USB-C Input": "20W PD (self-charge in 2hr)",
      "USB-C Output": "20W PD each",
      "Total Output": "30W max",
      "Size": "105 × 68 × 18mm",
      "Weight": "340g",
      "Includes": "Power bank, USB-C to C cable, travel pouch"
    }),
    sku: "PT-20K-MAG-BK",
    stock: 700,
    featured: true,
    rating: 4.7,
    reviewCount: 4567,
  },
  {
    name: "ChargeLink Pro Braided USB-C Cable 2m",
    slug: "chargelink-pro-usbc-cable-2m",
    description: "Premium braided USB-C to USB-C cable with 100W PD charging and 10Gbps data transfer. Triple-braided nylon jacket tested to 20,000 bends. Aluminum connector housing with LED indicator.",
    price: 12,
    compareAt: 19,
    category: "Charging",
    imageUrl: "https://images.unsplash.com/photo-1609592424919-c72e1ab4c72e?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1609592424919-c72e1ab4c72e?w=600",
    ]),
    features: JSON.stringify([
      "100W PD Fast Charging",
      "10Gbps Data Transfer",
      "Triple-Braided Nylon — 20,000 bend tested",
      "Aluminum housing with LED",
      "2 meter length",
      "USB 3.2 Gen 2 certified"
    ]),
    specs: JSON.stringify({
      "Connector": "USB-C to USB-C",
      "Length": "2 meters",
      "Charging": "100W PD 3.0",
      "Data": "10Gbps (USB 3.2 Gen 2)",
      "Video": "4K@60Hz DisplayPort Alt Mode",
      "Jacket": "Triple-braided nylon",
      "Bend Rating": "20,000+ cycles",
      "Colors": "Black, White, Braided Gray"
    }),
    sku: "CL-PRO-USBC-2M",
    stock: 3000,
    featured: false,
    rating: 4.8,
    reviewCount: 12345,
  },

  // ===== 4. SMART HOME =====
  {
    name: "AuraHub Smart WiFi Plug 4-Pack",
    slug: "aurahub-smart-wifi-plug-4pack",
    description: "Smart WiFi plugs with real-time energy monitoring, away mode simulation, and voice control. Schedule lights and devices to turn on/off automatically. Works with Alexa, Google Home, and Siri.",
    price: 22,
    compareAt: 39,
    category: "Smart Home",
    imageUrl: "https://images.unsplash.com/photo-1534105615251-0c2a6da3c1b3?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1534105615251-0c2a6da3c1b3?w=600",
    ]),
    features: JSON.stringify([
      "Real-time energy monitoring in app",
      "Away mode — random on/off while traveling",
      "Voice control: Alexa, Google, Siri",
      "Scheduling & scenes",
      "4-pack value — cover your whole home",
      "Compact design — doesn't block adjacent outlets"
    ]),
    specs: JSON.stringify({
      "Connectivity": "WiFi 2.4GHz",
      "App": "AuraHub (iOS & Android)",
      "Voice": "Alexa, Google Assistant, Siri Shortcuts",
      "Rating": "15A / 1800W",
      "Monitoring": "Real-time power consumption",
      "Package": "4 smart plugs",
      "Warranty": "2 years"
    }),
    sku: "AH-PLUG-4PK-WH",
    stock: 1500,
    featured: false,
    rating: 4.5,
    reviewCount: 6789,
  },
  {
    name: "GlowSync RGBIC WiFi Lightstrip 5m",
    slug: "glowsync-rgbic-lightstrip-5m",
    description: "WiFi-enabled RGBIC lightstrip with 16 million colors, music sync visualizer, and app control. 5 meters long with adhesive backing. Cuttable every 3 LEDs. Perfect for TV backlight, desk, or bedroom ambiance.",
    price: 18,
    compareAt: 29,
    category: "Smart Home",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600",
      "https://images.unsplash.com/photo-1534105615251-0c2a6da3c1b3?w=600",
    ]),
    features: JSON.stringify([
      "RGBIC — multiple colors at once",
      "16 million colors + preset scenes",
      "Music sync visualizer",
      "App + voice control",
      "5m length, cuttable every 3 LEDs",
      "Works with Alexa & Google"
    ]),
    specs: JSON.stringify({
      "Length": "5 meters (16.4 ft)",
      "LED Count": "300 LEDs (60/m)",
      "Technology": "RGBIC (independent control)",
      "Control": "WiFi app + Voice (Alexa/Google)",
      "Power": "24W (5V/3A adapter included)",
      "Cut Points": "Every 3 LEDs",
      "Lifespan": "50,000 hours",
      "Colors": "16 million + 50+ scenes"
    }),
    sku: "GS-RGBIC-5M-BK",
    stock: 2000,
    featured: false,
    rating: 4.6,
    reviewCount: 12340,
  },

  // ===== 5. PHONE ACCESSORIES =====
  {
    name: "GripCase Pro Magnetic Phone Stand",
    slug: "gripcase-pro-magnetic-stand",
    description: "Ultra-slim magnetic phone grip and stand that sticks to any phone or case. 360° rotating ring, vertical/horizontal stand modes, and magnetic car mount compatible. One-hand operation made easy.",
    price: 15,
    compareAt: 25,
    category: "Phone Accessories",
    imageUrl: "https://images.unsplash.com/photo-1589496934918-95d4c6e7c8c9?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1589496934918-95d4c6e7c8c9?w=600",
    ]),
    features: JSON.stringify([
      "Ultra-thin — 2.5mm profile",
      "360° rotating metal ring",
      "Vertical + horizontal stand modes",
      "Magnetic car mount compatible",
      "Strong adhesive — holds any phone",
      "Works with MagSafe cases"
    ]),
    specs: JSON.stringify({
      "Material": "Zinc alloy + silicone",
      "Thickness": "2.5mm",
      "Rotation": "360°",
      "Stand Modes": "Vertical & Horizontal",
      "Magnetic": "Yes (car mount compatible)",
      "Adhesive": "3M VHB (removable)",
      "Weight": "18g",
      "Colors": "Black, Silver, Rose Gold, Midnight Blue"
    }),
    sku: "GC-PRO-MAG-BK",
    stock: 5000,
    featured: false,
    rating: 4.4,
    reviewCount: 23456,
  },
  {
    name: "ClearShield Tempered Glass Screen Protector",
    slug: "clearshield-tempered-glass-screen",
    description: "Premium 9H tempered glass screen protector with anti-fingerprint oleophobic coating. Ultra-clear 99.9% transparency with auto-alignment frame for bubble-free installation. Pack of 3.",
    price: 9,
    compareAt: 15,
    category: "Phone Accessories",
    imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600",
    ]),
    features: JSON.stringify([
      "9H Hardness — scratch resistant",
      "Auto-alignment frame — easy install",
      "Oleophobic coating — no fingerprints",
      "99.9% transparency",
      "2.5D rounded edges",
      "Pack of 3 — great value"
    ]),
    specs: JSON.stringify({
      "Material": "Premium Tempered Glass",
      "Hardness": "9H",
      "Thickness": "0.26mm",
      "Transparency": "99.9%",
      "Coating": "Oleophobic (anti-fingerprint)",
      "Edge": "2.5D rounded",
      "Package": "3× screen protectors + installation kit",
      "Compatibility": "Universal — order by phone model"
    }),
    sku: "CS-GLASS-3PK",
    stock: 10000,
    featured: false,
    rating: 4.5,
    reviewCount: 34567,
  },

  // ===== 6. GAMING ACCESSORIES =====
  {
    name: "PhantomX Wireless Gaming Controller",
    slug: "phantomx-wireless-gaming-controller",
    description: "Premium wireless controller with Hall Effect joysticks (zero drift), mechanical face buttons, and 40-hour battery. RGB lightbar, programmable back paddles, and low-latency 2.4GHz + Bluetooth. Works with PC, Switch, Android, and iOS.",
    price: 44,
    compareAt: 69,
    category: "Gaming",
    imageUrl: "https://images.unsplash.com/photo-1592840496694-26d035b52ed2?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1592840496694-26d035b52ed2?w=600",
      "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=600",
    ]),
    features: JSON.stringify([
      "Hall Effect joysticks — NEVER drift",
      "Mechanical face buttons — clicky feel",
      "40hr battery — USB-C charging",
      "RGB lightbar + 4 programmable back paddles",
      "Dual mode: 2.4GHz dongle + Bluetooth",
      "Works on PC, Switch, Android, iOS"
    ]),
    specs: JSON.stringify({
      "Connectivity": "2.4GHz + Bluetooth 5.3",
      "Battery": "40 hours (2hr full charge)",
      "Joysticks": "Hall Effect (magnetic, zero drift)",
      "Buttons": "Mechanical switches (5M clicks)",
      "Extra Features": "4 back paddles, RGB, turbo",
      "Platform": "PC, Switch, Android, iOS",
      "Weight": "280g",
      "Includes": "Controller, dongle, USB-C cable, case"
    }),
    sku: "PX-WGC-BLK",
    stock: 400,
    featured: true,
    rating: 4.8,
    reviewCount: 3456,
  },
  {
    name: "IceFrost Laptop Cooling Pad",
    slug: "icefrost-laptop-cooling-pad",
    description: "Gaming laptop cooling pad with 6 silent RGB fans, adjustable height, and dual USB ports. Drops temps by 15-25°C. Honeycomb mesh design for maximum airflow. Fits laptops up to 17 inches.",
    price: 29,
    compareAt: 49,
    category: "Gaming",
    imageUrl: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=600",
    ]),
    features: JSON.stringify([
      "6 silent RGB fans — 1200-1800 RPM",
      "Lowers laptop temp by 15-25°C",
      "6 adjustable height angles",
      "2 USB hub ports",
      "Fits 14\" to 17.3\" laptops",
      "Blue LED backlight (not garish)"
    ]),
    specs: JSON.stringify({
      "Fan Count": "6 (quiet 120mm)",
      "Fan Speed": "1200-1800 RPM ±10%",
      "Noise Level": "18-25 dBA",
      "Airflow": "75 CFM",
      "Height Settings": "6 angles",
      "USB Ports": "2 (USB 2.0 hub)",
      "Max Laptop Size": "17.3\"",
      "Weight": "850g",
      "Power": "USB 5V (adapter included)"
    }),
    sku: "IF-LCP-BK",
    stock: 350,
    featured: false,
    rating: 4.6,
    reviewCount: 2345,
  },
  {
    name: "SpeedLink Premium HDMI 2.1 Cable 3m",
    slug: "speedlink-hdmi-21-cable-3m",
    description: "Certified HDMI 2.1 cable supporting 8K@60Hz, 4K@120Hz, 48Gbps bandwidth, eARC, VRR, and ALLM. Braided nylon jacket, gold-plated connectors, and aluminum housing. Future-proof your gaming setup.",
    price: 16,
    compareAt: 28,
    category: "Gaming",
    imageUrl: "https://images.unsplash.com/photo-1609592424919-c72e1ab4c72e?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1609592424919-c72e1ab4c72e?w=600",
    ]),
    features: JSON.stringify([
      "HDMI 2.1 certified — 48Gbps",
      "8K@60Hz / 4K@120Hz",
      "eARC, VRR, ALLM, HDR10+",
      "Braided nylon jacket",
      "Gold-plated corrosion-free connectors",
      "Aluminum housing with strain relief"
    ]),
    specs: JSON.stringify({
      "Version": "HDMI 2.1",
      "Bandwidth": "48 Gbps",
      "Resolution": "8K@60Hz / 4K@120Hz",
      "Features": "eARC, VRR, ALLM, HDR10+, Dolby Vision",
      "Length": "3 meters",
      "Connector": "Gold-plated (24K)",
      "Jacket": "Braided nylon",
      "Bend Rating": "15,000+ cycles"
    }),
    sku: "SL-HDMI21-3M",
    stock: 2000,
    featured: false,
    rating: 4.7,
    reviewCount: 5678,
  },

  // ===== 7. WEARABLES =====
  {
    name: "FitCore Active Smart Watch",
    slug: "fitcore-active-smart-watch",
    description: "Advanced fitness smartwatch with 1.43\" AMOLED display, GPS, heart rate & SpO2 monitoring, and 100+ workout modes. 14-day battery life. 5ATM waterproof with always-on display. iOS & Android compatible.",
    price: 69,
    compareAt: 129,
    category: "Wearables",
    imageUrl: "https://images.unsplash.com/photo-1546868871-af0de0ae72b5?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1546868871-af0de0ae72b5?w=600",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600",
    ]),
    features: JSON.stringify([
      "1.43\" AMOLED — always-on display",
      "Built-in GPS + GLONASS",
      "Heart rate, SpO2, sleep tracking",
      "100+ workout modes",
      "14-day battery life",
      "5ATM waterproof — swim ready"
    ]),
    specs: JSON.stringify({
      "Display": "1.43\" AMOLED 466×466",
      "Battery": "14 days typical",
      "GPS": "Built-in (GPS + GLONASS)",
      "Sensors": "HR, SpO2, accelerometer, gyro, compass",
      "Water Rating": "5ATM (50m)",
      "Workout Modes": "100+",
      "Compatibility": "iOS 14+ / Android 8+",
      "Weight": "52g",
      "Straps": "Interchangeable 22mm"
    }),
    sku: "FC-ACTIVE-BK",
    stock: 350,
    featured: true,
    rating: 4.6,
    reviewCount: 7890,
  },

  // ===== 8. LAPTOP ACCESSORIES =====
  {
    name: "HubMate 7-in-1 USB-C Hub",
    slug: "hubmate-7in1-usbc-hub",
    description: "Ultra-slim 7-in-1 USB-C hub with 4K HDMI, 100W PD pass-through, 10Gbps USB 3.2 ports, SD/TF card reader, and 3.5mm audio. Aluminum body matches your laptop. Essential for MacBook, iPad Pro, and PC laptops.",
    price: 28,
    compareAt: 45,
    category: "Laptop Accessories",
    imageUrl: "https://images.unsplash.com/photo-1624393213046-5b4c1521a1f9?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1624393213046-5b4c1521a1f9?w=600",
    ]),
    features: JSON.stringify([
      "4K@60Hz HDMI output",
      "100W PD 3.0 pass-through charging",
      "10Gbps USB 3.2 Gen 2 ports × 2",
      "SD + TF card reader (UHS-II)",
      "3.5mm audio out",
      "Space gray aluminum — matches MacBook"
    ]),
    specs: JSON.stringify({
      "Ports": "HDMI 4K@60Hz, PD 100W, USB 3.2×2, SD, TF, 3.5mm",
      "HDMI": "4K@60Hz HDR",
      "PD Charging": "100W pass-through",
      "USB Speed": "10Gbps (USB 3.2 Gen 2)",
      "Card Reader": "UHS-II (up to 312MB/s)",
      "Material": "Aluminum alloy",
      "Cable": "Built-in 15cm",
      "Weight": "62g"
    }),
    sku: "HM-7IN1-SG",
    stock: 900,
    featured: true,
    rating: 4.7,
    reviewCount: 6789,
  },
  {
    name: "ErgoLift Premium Laptop Stand",
    slug: "ergolift-premium-laptop-stand",
    description: "Adjustable aluminum laptop stand with ventilated design for better airflow and ergonomics. Raises your screen to eye level, reducing neck strain. Fits all laptops from 10\" to 17\". Folds flat for travel.",
    price: 32,
    compareAt: 55,
    category: "Laptop Accessories",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    ]),
    features: JSON.stringify([
      "Adjustable height — 5 to 15 cm",
      "Open design — improves cooling 20%",
      "Fits 10\" to 17\" laptops",
      "Folds flat — travel friendly",
      "Silicone pads — no scratches",
      "Weighted base — stable on any desk"
    ]),
    specs: JSON.stringify({
      "Material": "Aluminum alloy + silicone",
      "Height Range": "5 - 15 cm (2 - 6 inches)",
      "Compatibility": "10\" to 17\" laptops",
      "Foldable": "Yes — 2cm flat",
      "Weight": "420g",
      "Max Load": "5 kg",
      "Colors": "Space Gray, Silver"
    }),
    sku: "EL-LAPTOP-STD-SG",
    stock: 600,
    featured: false,
    rating: 4.8,
    reviewCount: 4567,
  },
  {
    name: "NylonPro Laptop Sleeve 15.6\"",
    slug: "nylonpro-laptop-sleeve-156",
    description: "Premium padded laptop sleeve with 1680D ballistic nylon, fleece-lined interior, and water-resistant exterior. Features front pocket for charger & accessories. Meets TSA laptop guidelines.",
    price: 19,
    compareAt: 34,
    category: "Laptop Accessories",
    imageUrl: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600",
    ]),
    features: JSON.stringify([
      "1680D ballistic nylon — military grade",
      "Fleece-lined interior — scratch free",
      "Water-resistant exterior",
      "Front accessory pocket",
      "Meets TSA laptop guidelines",
      "Padded handles + removable shoulder strap"
    ]),
    specs: JSON.stringify({
      "Material": "1680D Ballistic Nylon",
      "Interior": "Soft fleece lining",
      "Water Resistance": "Yes (DWR coated)",
      "Fit": "15.6\" laptops (also fits 14\")",
      "Pockets": "Front zip pocket + pen loops",
      "Carry": "Padded handle + removable strap",
      "Weight": "240g",
      "Colors": "Black, Navy, Gray"
    }),
    sku: "NP-SLEEVE-156-BK",
    stock: 800,
    featured: false,
    rating: 4.5,
    reviewCount: 3456,
  },
]

async function main() {
  console.log("🌱 Seeding database with REAL products...")

  // Clean existing products
  await prisma.product.deleteMany({})
  console.log("  ✓ Cleared existing products")

  // Create products
  for (const product of products) {
    await prisma.product.create({ data: product })
  }
  console.log(`  ✓ Created ${products.length} products across 8 categories`)

  // Create admin user if not exists
  const existingAdmin = await prisma.user.findUnique({ where: { email: "admin@wmduo.com" } })
  if (!existingAdmin) {
    const password = await bcrypt.hash("Admin@123456", 12)
    await prisma.user.create({
      data: {
        name: "WM Duo Admin",
        email: "admin@wmduo.com",
        password,
        role: "admin",
      },
    })
    console.log("  ✓ Created admin user (admin@wmduo.com / Admin@123456)")
  } else {
    console.log("  ✓ Admin user already exists")
  }

  console.log("✅ Seed complete!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
