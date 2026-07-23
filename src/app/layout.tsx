import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers"

export const metadata: Metadata = {
  title: "WM Duo — Premium Tech Accessories & Smart Gadgets",
  description: "Premium tech accessories — audio, charging, gaming, smart home, and lifestyle gear. Free shipping worldwide. 30-day returns.",
  keywords: "WM Duo, tech accessories, smart gadgets, premium tech",
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  twitter: {
    card: "summary_large_image",
    title: "WM Duo — Premium Tech",
    description: "Premium tech accessories — audio, charging, gaming, smart home.",
    images: ["/icon.png"],
  },
  openGraph: {
    title: "WM Duo — Premium Tech Accessories",
    description: "Premium tech accessories. Free worldwide shipping.",
    url: "https://wmduo.com",
    siteName: "WM Duo",
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#F5F0E8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="antialiased">
        <div className="bg-grain" />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
