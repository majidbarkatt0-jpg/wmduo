import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/shopify';

export async function GET() {
  try {
    const result = await getProducts();
    
    if (result.errors) {
      return NextResponse.json({ error: result.errors[0]?.message || 'Shopify API error' }, { status: 500 });
    }

    const products = result.data?.products?.edges?.map((edge: any) => edge.node) || [];
    
    return NextResponse.json({
      success: true,
      total: products.length,
      products: products.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        handle: p.handle,
        status: p.status,
        price: p.variants?.edges?.[0]?.node?.price,
        compareAtPrice: p.variants?.edges?.[0]?.node?.compareAtPrice,
        sku: p.variants?.edges?.[0]?.node?.sku,
        inventory: p.variants?.edges?.[0]?.node?.inventoryQuantity,
        images: p.images?.edges?.map((img: any) => img.node.originalSrc) || [],
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
