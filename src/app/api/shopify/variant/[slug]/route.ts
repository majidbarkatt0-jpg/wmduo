import { NextResponse } from 'next/server';

// Hardcoded variant IDs for WM Duo products
// These are created in Shopify via the admin API
const VARIANT_MAP: Record<string, { variantId: string; shopifyId: string }> = {
  "wm-castleview-projector": {
    variantId: "gid://shopify/ProductVariant/48020601274519",
    shopifyId: "gid://shopify/Product/9674999308439",
  },
  "aromatherapy-essential-oil-diffuser-ultrasonic-cool-mist-with-7-color-led": {
    variantId: "gid://shopify/ProductVariant/48036188848279",
    shopifyId: "gid://shopify/Product/9675014373527",
  },
  "car-air-purifier-mini-hepa-filter-with-negative-ions-usb-powered": {
    variantId: "gid://shopify/ProductVariant/48036188881047",
    shopifyId: "gid://shopify/Product/9675014406295",
  },
  "bluetooth-tracker-key-finder-smart-anti-loss-tag-for-keys-wallet-phone": {
    variantId: "gid://shopify/ProductVariant/48036188913815",
    shopifyId: "gid://shopify/Product/9675014439063",
  },
  "portable-mini-projector-native-1080p-full-hd-with-wifi-bluetooth": {
    variantId: "gid://shopify/ProductVariant/48036188946583",
    shopifyId: "gid://shopify/Product/9675014471831",
  },
  "levoit-core-mini-air-purifier-hepa-filter-for-bedroom-office-178-sq-ft": {
    variantId: "gid://shopify/ProductVariant/48036189044887",
    shopifyId: "gid://shopify/Product/9675014537367",
  },
  "dreo-tower-fan-25ft-s-velocity-90-oscillation-quiet-floor-fan-for-bedroom": {
    variantId: "gid://shopify/ProductVariant/48036189077655",
    shopifyId: "gid://shopify/Product/9675014570135",
  },
};

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  
  // Try exact match
  if (VARIANT_MAP[slug]) {
    return NextResponse.json({ 
      success: true, 
      ...VARIANT_MAP[slug],
      slug,
    });
  }

  // Fuzzy match - check if slug contains any of our keys or vice versa
  for (const [key, value] of Object.entries(VARIANT_MAP)) {
    if (slug.includes(key) || key.includes(slug)) {
      return NextResponse.json({ 
        success: true, 
        ...value,
        slug: key,
      });
    }
  }

  return NextResponse.json(
    { error: 'No variant found for this product', slug },
    { status: 404 }
  );
}
