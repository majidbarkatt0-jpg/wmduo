// Seed 6 new products into WM Duo database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  {
    name: "Aromatherapy Essential Oil Diffuser - Ultrasonic Cool Mist with 7-Color LED",
    description: "Transform any room into a peaceful sanctuary with our Ultrasonic Aromatherapy Essential Oil Diffuser. 7-color LED mood lighting, ultrasonic technology, ultra-quiet operation, and auto shut-off. 300ml capacity runs up to 10 hours.",
    price: 29.99,
    compareAt: 49.99,
    category: "Home & Wellness",
    imageUrl: "https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=800",
      "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=800",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800"
    ]),
    features: JSON.stringify(["Ultrasonic Technology", "7-Color LED Mood Light", "Ultra-Quiet Under 25dB", "Auto Shut-Off Safety", "300ml Capacity - 10 Hour Run Time"]),
    specs: JSON.stringify({ capacity: "300ml", coverage: "300 sq ft", noise: "<25dB", power: "USB 5V/2A", material: "BPA-Free PP + ABS" }),
    sku: "WM-AROMA-001",
    stock: 999,
    featured: false,
    rating: 4.8,
    reviewCount: 0,
    status: "active"
  },
  {
    name: "Car Air Purifier - Mini HEPA Filter with Negative Ions, USB Powered",
    description: "Keep your car's cabin air pure and fresh with our compact Car Air Purifier. 3-stage HEPA filtration removes 99.97% of pollutants. Negative ion generator freshens the air. Ultra-compact fits any cup holder.",
    price: 34.99,
    compareAt: 59.99,
    category: "Auto Accessories",
    imageUrl: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
      "https://images.unsplash.com/photo-1576675784434-f8e9fb5bdc1e?w=800"
    ]),
    features: JSON.stringify(["3-Stage HEPA Filtration", "Negative Ion Generator", "Ultra-Compact Cup Holder Design", "USB Powered", "Whisper-Quiet Under 35dB"]),
    specs: JSON.stringify({ filtration: "Pre-filter + HEPA + Carbon", ions: "10 million/cm³", noise: "<35dB", power: "USB 5V", dimensions: "6.3 x 2.8 x 2.8 inches" }),
    sku: "WM-CAR-PUR-001",
    stock: 999,
    featured: false,
    rating: 4.7,
    reviewCount: 0,
    status: "active"
  },
  {
    name: "Bluetooth Tracker Key Finder - Smart Anti-Loss Tag for Keys, Wallet & Phone",
    description: "Never lose your keys again! Smart Bluetooth Tracker with 100ft range, two-way finding, 80dB buzzer, and free app. Ultra-slim design fits any wallet. Replaceable battery lasts 12 months.",
    price: 24.99,
    compareAt: 39.99,
    category: "Gadgets & Tech",
    imageUrl: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800",
      "https://images.unsplash.com/photo-1578439231583-9eca0a363860?w=800",
      "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=800"
    ]),
    features: JSON.stringify(["Bluetooth 5.0 - 100ft Range", "Two-Way Finding (Find Phone Too)", "Loud 80dB Buzzer", "Ultra-Slim 1.5 inch Design", "Replaceable CR2032 Battery - 12 Months"]),
    specs: JSON.stringify({ technology: "Bluetooth 5.0", range: "100ft (30m)", battery: "CR2032 (12 months)", buzzer: "80dB", waterproof: "IP65", compatibility: "iOS 13+ / Android 6+" }),
    sku: "WM-TRACK-001",
    stock: 999,
    featured: false,
    rating: 4.6,
    reviewCount: 0,
    status: "active"
  },
  {
    name: "Portable Mini Projector - Native 1080p Full HD with WiFi & Bluetooth",
    description: "Turn any wall into a movie theater! Native 1080p Full HD, 200 ANSI lumens, WiFi 6 & Bluetooth 5.0, auto keystone & focus. Projects up to 120 inches. Ultra-portable at only 1.2 lbs.",
    price: 76.99,
    compareAt: 129.99,
    category: "Projectors",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800",
      "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800"
    ]),
    features: JSON.stringify(["Native 1080p Full HD Resolution", "200 ANSI Lumens Brightness", "WiFi 6 & Bluetooth 5.0", "Auto Keystone & Focus", "120-Inch Display", "Built-in Hi-Fi Speakers"]),
    specs: JSON.stringify({ resolution: "Native 1920x1080", brightness: "200 ANSI Lumens", display: '40"-120"', connectivity: "WiFi 6, BT 5.0, HDMI, USB", speakers: "Built-in 5W Stereo", weight: "1.2 lbs" }),
    sku: "WM-PROJ-1080-001",
    stock: 999,
    featured: true,
    rating: 4.9,
    reviewCount: 0,
    status: "active"
  },
  {
    name: "LEVOIT Core Mini Air Purifier - HEPA Filter for Bedroom & Office (178 sq ft)",
    description: "Breathe cleaner, sleep better with the LEVOIT Core Mini Air Purifier. True HEPA filtration captures 99.97% of particles. Ultra-quiet 25dB operation. Compact design perfect for bedrooms and offices.",
    price: 49.99,
    compareAt: 69.99,
    category: "Air Quality",
    imageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800",
      "https://images.unsplash.com/photo-1600494607702-394326d9edc2?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800"
    ]),
    features: JSON.stringify(["True HEPA Captures 99.97%", "Ultra-Quiet 25dB Operation", "Compact 6.5 inch Design", "Aromatherapy Sponge Included", "3-Stage Filtration System", "ENERGY STAR Certified"]),
    specs: JSON.stringify({ filtration: "3-Stage: Pre + HEPA + Carbon", coverage: "178 sq ft", noise: "25dB-38dB", power: "7W max", dimensions: "10.4 x 6.5 x 6.5 inches", filterLife: "6-8 months" }),
    sku: "WM-LEVOIT-001",
    stock: 999,
    featured: true,
    rating: 4.9,
    reviewCount: 0,
    status: "active"
  },
  {
    name: "DREO Tower Fan - 25ft/s Velocity, 90° Oscillation Quiet Floor Fan for Bedroom",
    description: "Powerful cooling, whisper-quiet comfort. DREO Tower Fan with 25ft/s HyperFlow, 90° oscillation, and ultra-quiet 25dB operation. 4 speeds, 4 modes, 8-hour timer, remote control included.",
    price: 69.99,
    compareAt: 99.99,
    category: "Home Cooling",
    imageUrl: "https://images.unsplash.com/photo-1582560475093-ba66ac1e0c4f?w=600",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1582560475093-ba66ac1e0c4f?w=800",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800",
      "https://images.unsplash.com/photo-1600494607702-394326d9edc2?w=800"
    ]),
    features: JSON.stringify(["25ft/s HyperFlow Technology", "90° Wide Oscillation", "Ultra-Quiet 25dB Sleep Mode", "4 Speeds + 4 Modes", "8-Hour Timer", "Remote Control Included"]),
    specs: JSON.stringify({ airflow: "25 ft/s (7.6 m/s)", oscillation: "90°", speeds: "4 + 4 Modes", timer: "1-8 Hours", noise: "25dB-48dB", power: "40W max", dimensions: "36 x 12 x 12 inches" }),
    sku: "WM-DREO-FAN-001",
    stock: 999,
    featured: true,
    rating: 4.8,
    reviewCount: 0,
    status: "active"
  }
];

async function main() {
  console.log("Seeding 6 products into WM Duo database...\n");

  for (const product of products) {
    try {
      const slug = product.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .substring(0, 200);

      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) {
        console.log(`⏭ Skipping (exists): ${product.name}`);
        continue;
      }

      await prisma.product.create({
        data: {
          ...product,
          slug,
        },
      });
      console.log(`✅ Added: ${product.name}`);
      console.log(`   URL: https://wmduo.com/products/${slug}`);
    } catch (err) {
      console.error(`❌ Error adding ${product.name}:`, err.message);
    }
  }

  // Show all products
  const all = await prisma.product.findMany({ where: { status: "active" }, orderBy: { createdAt: "desc" } });
  console.log(`\n📊 Total active products in DB: ${all.length}`);
  all.forEach(p => console.log(`   - ${p.name} ($${p.price})`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
