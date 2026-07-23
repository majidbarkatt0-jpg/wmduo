import Link from "next/link"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "WM Duo Blog — Product Guides, Reviews & Home Wellness Tips",
  description:
    "Expert guides on aromatherapy diffusers, air purifiers, projectors, and smart home gadgets. Tips for better home wellness, air quality, and ambiance.",
  keywords:
    "aromatherapy guide, essential oil diffuser tips, air purifier guide, home wellness blog, WM Duo blog, smart home tips, projector buying guide",
  openGraph: {
    title: "WM Duo Blog — Product Guides & Home Wellness",
    description: "Expert guides on aromatherapy, air purifiers, projectors & smart gadgets.",
    url: "https://wmduo.com/blog",
    siteName: "WM Duo",
    type: "website",
    images: [
      {
        url: "https://cdn.shopify.com/s/files/1/0740/3867/3559/t/1/assets/wmduo-logo.png?v=1784536181",
        width: 1000,
        height: 1000,
        alt: "WM Duo Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WM Duo Blog — Product Guides & Home Wellness",
    description: "Expert guides on aromatherapy, air purifiers, projectors & smart gadgets.",
    images: ["https://cdn.shopify.com/s/files/1/0740/3867/3559/t/1/assets/wmduo-logo.png?v=1784536181"],
  },
}

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  image: string
  author: string
}

const blogPosts: BlogPost[] = [
  {
    slug: "flame-aroma-diffuser-3d-fireplace-essential-oil-diffuser-guide",
    title: "3D Flame Aroma Diffuser: The Complete Guide to Fireplace Essential Oil Diffusers",
    excerpt:
      "Discover how a 3D flame aroma diffuser transforms your space with realistic fireplace effects and aromatherapy. Complete guide with tips, benefits, and buying advice.",
    date: "July 20, 2026",
    readTime: "8 min read",
    category: "Aromatherapy",
    image:
      "https://cdn.shopify.com/s/files/1/0740/3867/3559/files/c56dc8fd-a546-487e-a631-bcd574b0b004_trans.jpg?v=1784538017",
    author: "WM Duo Team",
  },
]

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white-soft">
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-brown-deep font-[family-name:var(--font-heading)]">
              WM Duo <span className="text-[#E8A94C]">Blog</span>
            </h1>
            <p className="mt-4 text-lg text-brown-mid max-w-2xl mx-auto">
              Expert guides, product deep-dives, and wellness tips to help you get the most from your smart home devices.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="pb-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bento-card bento-card--white overflow-hidden hover:border-[#E8A94C]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8A94C]/5"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-brown-mid mb-3">
                      <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-gold text-xs font-medium">
                        {post.category}
                      </span>
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-brown-deep group-hover:text-[#E8A94C] transition-colors duration-200">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-brown-mid leading-relaxed">{post.excerpt}</p>
                    <div className="mt-4 flex items-center gap-2 text-[#E8A94C] text-sm font-medium">
                      Read More <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {blogPosts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-brown-mid text-lg">More articles coming soon. Stay tuned!</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="pb-24 px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-12 text-center border border-gold/10">
            <h2 className="text-2xl md:text-3xl font-bold text-brown-deep">Stay Updated</h2>
            <p className="mt-3 text-brown-mid">
              Get the latest product guides and home wellness tips delivered to your inbox.
            </p>
            <a
              href="https://wmduo.com"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#E8A94C] text-black font-semibold rounded-xl hover:bg-[#D48832] transition-colors"
            >
              Visit Our Store <span>→</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
