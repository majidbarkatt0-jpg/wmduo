import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const product = await prisma.product.findUnique({ where: { slug } })

    if (!product) {
      return {
        title: "Product Not Found — WM Duo",
        description: "The requested product could not be found.",
      }
    }

    return {
      title: `${product.name} — WM Duo`,
      description: product.description.slice(0, 160),
      keywords: `${product.name}, ${product.category || "tech accessories"}, WM Duo, ${product.sku || ""}`,
      openGraph: {
        title: `${product.name} — WM Duo`,
        description: product.description.slice(0, 160),
        url: `https://wmduo.com/products/${product.slug}`,
        siteName: "WM Duo",
        images: product.imageUrl
          ? [{ url: product.imageUrl, width: 1200, height: 900, alt: product.name }]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} — WM Duo`,
        description: product.description.slice(0, 160),
        images: product.imageUrl ? [product.imageUrl] : [],
      },
    }
  } catch {
    return {
      title: "WM Duo — Premium Tech Accessories",
      description: "Premium tech accessories and smart gadgets.",
    }
  }
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>
}
