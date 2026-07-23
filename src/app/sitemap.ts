import { prisma } from "@/lib/prisma"

export default async function sitemap() {
  const baseUrl = "https://wmduo.com"

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/checkout`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/shipping`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/warranty`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.2 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.2 },
  ]

  // Dynamic product pages
  try {
    const products = await prisma.product.findMany({
      where: { status: "active" },
      select: { slug: true, updatedAt: true },
    })

    const productPages = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

    // Blog posts
    const blogPosts = [
      {
        url: `${baseUrl}/blog/flame-aroma-diffuser-3d-fireplace-essential-oil-diffuser-guide`,
        lastModified: new Date("2026-07-20"),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
    ]

    return [...staticPages, ...productPages, ...blogPosts]
  } catch (error) {
    console.error("Sitemap: DB fetch failed, returning static pages only", error)
    return staticPages
  }
}
