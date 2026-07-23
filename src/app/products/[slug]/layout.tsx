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

export default async function ProductLayout({ params, children }: Props) {
  // Inject JSON-LD structured data for Google rich snippets
  try {
    const { slug } = await params
    const product = await prisma.product.findUnique({ where: { slug } })

    if (product) {
      const images: string[] = product.images ? JSON.parse(product.images) : [product.imageUrl || ""]
      const features: string[] = product.features ? JSON.parse(product.features) : []

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description.slice(0, 500),
        sku: product.sku || "",
        mpn: product.sku || "",
        brand: {
          "@type": "Brand",
          name: "WM Duo",
        },
        image: images,
        offers: {
          "@type": "Offer",
          url: `https://wmduo.com/products/${product.slug}`,
          priceCurrency: "USD",
          price: product.price,
          priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
          itemCondition: "https://schema.org/NewCondition",
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: 0,
              currency: "USD",
            },
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "US",
            },
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "US",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 30,
            returnMethod: "https://schema.org/ReturnByMail",
            returnFees: "https://schema.org/FreeReturn",
          },
        },
        ...(product.reviewCount > 0 ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        } : {}),
      }

      if (product.compareAt && product.compareAt > product.price) {
        ;(jsonLd.offers as any).priceSpecification = {
          "@type": "UnitPriceSpecification",
          price: product.price,
          priceCurrency: "USD",
          valueAddedTaxIncluded: false,
        }
      }

      return (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
        </>
      )
    }
  } catch {
    // Silently fail — structured data is optional enhancement
  }

  return <>{children}</>
}
