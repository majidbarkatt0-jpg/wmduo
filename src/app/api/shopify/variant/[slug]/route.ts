import { NextResponse } from 'next/server';

const VARIANT_MAP: Record<string, { variantId: string; shopifyId: string }> = {
  "wm-castleview-projector": { variantId: "gid://shopify/ProductVariant/48020601274519", shopifyId: "gid://shopify/Product/9674999308439" },
  "aromatherapy-essential-oil-diffuser-ultrasonic-cool-mist-with-7-color-led": { variantId: "gid://shopify/ProductVariant/48036188848279", shopifyId: "gid://shopify/Product/9675014373527" },
  "car-air-purifier-mini-hepa-filter-with-negative-ions-usb-powered": { variantId: "gid://shopify/ProductVariant/48036188881047", shopifyId: "gid://shopify/Product/9675014406295" },
  "bluetooth-tracker-key-finder-smart-anti-loss-tag-for-keys-wallet-phone": { variantId: "gid://shopify/ProductVariant/48036188913815", shopifyId: "gid://shopify/Product/9675014439063" },
  "portable-mini-projector-native-1080p-full-hd-with-wifi-bluetooth": { variantId: "gid://shopify/ProductVariant/48036188946583", shopifyId: "gid://shopify/Product/9675014471831" },
  "levoit-core-mini-air-purifier-hepa-filter-for-bedroom-office-178-sq-ft": { variantId: "gid://shopify/ProductVariant/48036189044887", shopifyId: "gid://shopify/Product/9675014537367" },
  "dreo-tower-fan-25ft-s-velocity-90-oscillation-quiet-floor-fan-for-bedroom": { variantId: "gid://shopify/ProductVariant/48036189077655", shopifyId: "gid://shopify/Product/9675014570135" },
  "flame-aroma-diffuser-3d-fireplace-essential-oil-diffuser-humidifier": { variantId: "gid://shopify/ProductVariant/48036235149463", shopifyId: "gid://shopify/Product/9675025711255" },
};

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (VARIANT_MAP[slug]) {
      return NextResponse.json({ success: true, ...VARIANT_MAP[slug], slug });
    }
    return NextResponse.json({ error: 'No variant found for this product', slug }, { status: 404 });
  } catch (error) {
    console.error('Variant lookup error:', error);
    return NextResponse.json({ error: 'Failed to look up product variant' }, { status: 500 });
  }
}
