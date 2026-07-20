import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const topic = request.headers.get('X-Shopify-Topic') || '';
    const shopDomain = request.headers.get('X-Shopify-Shop-Domain') || '';
    
    console.log(`📦 Shopify Webhook: ${topic} from ${shopDomain}`);
    
    if (topic === 'orders/create') {
      const order = {
        id: body.id,
        orderNumber: body.order_number,
        email: body.email,
        totalPrice: body.total_price,
        currency: body.currency,
        createdAt: body.created_at,
        customer: body.customer ? {
          firstName: body.customer.first_name,
          lastName: body.customer.last_name,
          email: body.customer.email,
        } : null,
        shippingAddress: body.shipping_address ? {
          address1: body.shipping_address.address1,
          city: body.shipping_address.city,
          province: body.shipping_address.province,
          zip: body.shipping_address.zip,
          country: body.shipping_address.country,
        } : null,
        lineItems: (body.line_items || []).map((item: any) => ({
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          sku: item.sku,
          variantId: item.variant_id,
        })),
      };
      
      console.log(`✅ Order #${order.orderNumber} received from ${order.email}`);
      console.log(`   Total: $${order.totalPrice} ${order.currency}`);
      console.log(`   Items: ${JSON.stringify(order.lineItems.map((i: any) => i.title))}`);
      
      // AUTO-FULFILLMENT LOGIC:
      // For each item, find the supplier and place the order
      // Since we're using CJ Dropshipping / AliExpress, we would:
      // 1. Look up the supplier for each SKU
      // 2. Place the order with the supplier
      // 3. Get tracking number
      // 4. Update Shopify order with tracking
      
      // For now, we log the order and it can be fulfilled manually
      // In production, this would auto-place orders with CJ Dropshipping API
      
      return NextResponse.json({ 
        success: true, 
        message: `Order #${order.orderNumber} recorded`,
        needsFulfillment: true,
      });
    }
    
    if (topic === 'orders/fulfilled') {
      console.log(`📦 Order fulfilled: ${body.order_number}`);
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
