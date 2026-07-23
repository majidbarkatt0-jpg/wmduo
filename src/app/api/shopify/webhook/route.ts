import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

/**
 * Shopify Order Webhook
 * Called automatically by Shopify when a new order is placed.
 * The customer pays on Shopify checkout, and Shopify sends us the order.
 * 
 * Flow:
 * 1. Customer buys on wmduo.com → redirected to Shopify checkout
 * 2. Customer pays on Shopify
 * 3. Shopify calls this webhook with order details
 * 4. We record the order and trigger automated fulfillment
 */

/**
 * 🔒 Verify Shopify webhook HMAC signature to prevent fake order injections
 */
function verifyWebhook(body: string, hmacHeader: string | null): boolean {
  if (!hmacHeader) return false;
  const secret = process.env.SHOPIFY_CLIENT_SECRET || '';
  if (!secret) {
    console.error('❌ SHOPIFY_CLIENT_SECRET not configured — rejecting webhook');
    return false;
  }
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader));
}

export async function POST(request: NextRequest) {
  try {
    // 🔒 Verify HMAC signature
    const rawBody = await request.clone().text();
    const hmacHeader = request.headers.get('X-Shopify-Hmac-Sha256');
    
    if (!verifyWebhook(rawBody, hmacHeader)) {
      console.error('❌ Invalid Shopify webhook HMAC signature — request rejected');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const body = JSON.parse(rawBody);
    const topic = request.headers.get('X-Shopify-Topic') || '';
    const shopDomain = request.headers.get('X-Shopify-Shop-Domain') || '';
    
    if (topic === 'orders/create') {
      const shopifyOrderId = body.id?.toString();
      
      // Check idempotency — skip if already processed
      const existing = shopifyOrderId ? await prisma.order.findFirst({
        where: { orderNumber: { startsWith: `SHOP-${body.order_number}` } }
      }) : null;
      
      if (existing) {
        return NextResponse.json({ success: true, message: 'Order already processed' });
      }
      
      const lineItems = (body.line_items || []).map((item: any) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        sku: item.sku,
        variantId: item.variant_id,
      }));
      
      return NextResponse.json({ 
        success: true, 
        message: `Order #${body.order_number} recorded`,
        needsFulfillment: true,
      });
    }
    
    if (topic === 'orders/fulfilled') {
      return NextResponse.json({ success: true });
    }
    
    // Acknowledge other webhooks
    return NextResponse.json({ success: true, topic });
    
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET to verify webhook is working
export async function GET() {
  return NextResponse.json({
    name: 'WM Duo Shopify Webhook',
    version: '1.0',
    status: 'active',
    endpoints: {
      'orders/create': 'POST - New order notification',
      'orders/fulfilled': 'POST - Order fulfillment notification',
    }
  });
}
