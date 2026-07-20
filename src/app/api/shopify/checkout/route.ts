import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken, getStoreUrl } from '@/lib/shopify';

const SHOPIFY_STORE = '1iw1ss-rv.myshopify.com';
const ACCESS_TOKEN = 'SHOPIFY_ACCESS_TOKEN';

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
    const { variantId, quantity, email, firstName, lastName, address1, city, country, zip, phone } = body;

    if (!variantId || !quantity) {
      return NextResponse.json(
        { error: 'variantId and quantity are required' },
        { status: 400 }
      );
    }

    // Build the GraphQL input
    const input: any = {
      lineItems: [{ variantId, quantity: quantity || 1 }],
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

    const result = await response.json();

    if (result.errors) {
      return NextResponse.json(
        { error: result.errors[0]?.message || 'Shopify API error' },
        { status: 500 }
      );
    }

    const draftOrder = result.data?.draftOrderCreate?.draftOrder;
    const userErrors = result.data?.draftOrderCreate?.userErrors;

    if (userErrors?.length > 0) {
      return NextResponse.json(
        { error: userErrors[0]?.message, fields: userErrors[0]?.field },
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
      { error: error.message || 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
