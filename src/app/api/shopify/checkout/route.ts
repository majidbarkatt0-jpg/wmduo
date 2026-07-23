import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAccessToken, getStoreUrl } from '@/lib/shopify';

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
if (!SHOPIFY_STORE) {
  console.warn('⚠️ SHOPIFY_STORE environment variable not configured');
}
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '';

// Input validation schema
const checkoutInputSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(99, "Maximum 99 items"),
  email: z.string().email("Valid email required").optional(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  address1: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  zip: z.string().max(20).optional(),
  phone: z.string().max(30).optional(),
});

// GraphQL mutation to create a checkout (draft order with payment link)
const CREATE_CHECKOUT_MUTATION = `
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        invoiceUrl
        name
        totalPrice
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 🔒 Validate input with Zod schema
    const validation = checkoutInputSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    
    const { variantId, quantity, email, firstName, lastName, address1, city, country, zip, phone } = validation.data;

    if (!SHOPIFY_STORE) {
      return NextResponse.json(
        { error: 'Shopify store not configured' },
        { status: 500 }
      );
    }

    // Build the GraphQL input
    const input: any = {
      lineItems: [{ variantId, quantity }],
    };

    // Add customer info if provided
    if (email) input.email = email;
    if (firstName || lastName || address1 || city || country) {
      input.shippingAddress = {
        firstName: firstName || 'Customer',
        lastName: lastName || '',
        address1: address1 || 'N/A',
        city: city || 'N/A',
        country: country || 'US',
        ...(zip && { zip }),
        ...(phone && { phone }),
      };
    }

    // Call Shopify Admin API
    const response = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/2024-07/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: CREATE_CHECKOUT_MUTATION,
          variables: { input },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Shopify API error (${response.status}):`, errorText.slice(0, 300));
      return NextResponse.json(
        { error: 'Checkout service temporarily unavailable' },
        { status: 502 }
      );
    }

    const result = await response.json();

    if (result.errors) {
      console.error('Shopify GraphQL errors:', result.errors);
      return NextResponse.json(
        { error: 'Failed to create checkout. Please try again.' },
        { status: 500 }
      );
    }

    const draftOrder = result.data?.draftOrderCreate?.draftOrder;
    const userErrors = result.data?.draftOrderCreate?.userErrors;

    if (userErrors?.length > 0) {
      return NextResponse.json(
        { error: userErrors[0]?.message || 'Checkout validation failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: draftOrder.invoiceUrl,
      orderName: draftOrder.name,
      orderId: draftOrder.id,
      totalPrice: draftOrder.totalPrice,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout. Please try again.' },
      { status: 500 }
    );
  }
}
