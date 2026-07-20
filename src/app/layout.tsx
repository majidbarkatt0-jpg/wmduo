import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers"

export const metadata: Metadata = {
  title: "WM Duo — Premium Tech Accessories & Smart Gadgets",
  description: "Premium tech accessories — audio, charging, gaming, smart home, and lifestyle gear. Free shipping worldwide. 30-day returns.",
  keywords: "WM Duo, tech accessories, smart gadgets, premium tech, audio, charging, gaming, smart home",
  icons: {
    icon: "https://cdn.shopify.com/s/files/1/0740/3867/3559/t/1/assets/wmduo-logo.png?v=1784536181",
    apple: "https://cdn.shopify.com/s/files/1/0740/3867/3559/t/1/assets/wmduo-logo.png?v=1784536181",
  },
  twitter: {
    card: "summary_large_image",
    title: "WM Duo — Premium Tech Accessories & Smart Gadgets",
    description: "Discover premium tech accessories — audio, charging, gaming, smart home, and more.",
    images: ["https://cdn.shopify.com/s/files/1/0740/3867/3559/t/1/assets/wmduo-logo.png?v=1784536181"],
  },
  openGraph: {
    title: "WM Duo — Premium Tech Accessories & Smart Gadgets",
    description: "Discover premium tech accessories — audio, charging, gaming, smart home, and more. Free worldwide shipping.",
    url: "https://wmduo.com",
    siteName: "WM Duo",
    locale: "en_US",
    type: "website",
    images: [{
      url: "https://cdn.shopify.com/s/files/1/0740/3867/3559/t/1/assets/wmduo-logo.png?v=1784536181",
      width: 1000,
      height: 1000,
      alt: "WM Duo",
    }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
          as="style"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon - WM Duo Logo */}
        <link rel="icon" href="https://cdn.shopify.com/s/files/1/0740/3867/3559/t/1/assets/wmduo-logo.png?v=1784536181" />
        <link rel="apple-touch-icon" href="https://cdn.shopify.com/s/files/1/0740/3867/3559/t/1/assets/wmduo-logo.png?v=1784536181" />

        {/* Performance hints */}
        <meta name="theme-color" content="#0D0D12" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
