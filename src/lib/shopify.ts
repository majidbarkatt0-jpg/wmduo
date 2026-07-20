// Shopify API Integration for WM Duo
import { NextResponse } from 'next/server';

// Read from environment variables (set in .env and Vercel)
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || '1iw1ss-rv.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || '28aa1a0fd5cbeac5c82605a534d9d0df';
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || 'SHOPIFY_CLIENT_SECRET';

// Access token from user (can also be set via env var)
let accessToken: string | null = process.env.SHOPIFY_ACCESS_TOKEN || 'SHOPIFY_ACCESS_TOKEN' || null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string) {
  accessToken = token;
}

export function getStoreUrl() {
  return SHOPIFY_STORE;
}

export function getClientId() {
  return CLIENT_ID;
}

export function getClientSecret() {
  return CLIENT_SECRET;
}

// Generate the OAuth authorization URL
export function getAuthUrl(redirectUri: string, state: string) {
  const scopes = 'read_products,write_products,read_orders';
  return `https://${SHOPIFY_STORE}/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string, redirectUri: string) {
  const response = await fetch(
    `https://${SHOPIFY_STORE}/admin/oauth/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  return data;
}

// Shopify API helper - make authenticated requests
export async function shopifyFetch(query: string, variables?: any) {
  if (!accessToken) {
    throw new Error('Shopify not authenticated. Install the app first.');
  }

  const response = await fetch(
    `https://${SHOPIFY_STORE}/admin/api/2024-07/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  return response.json();
}

// Get all products from Shopify
export async function getProducts() {
  const query = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            description
            handle
            status
            variants(first: 1) {
              edges {
                node {
                  id
                  price
                  compareAtPrice
                  sku
                  inventoryQuantity
                }
              }
            }
            images(first: 5) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;
  return shopifyFetch(query);
}

// Create a product in Shopify
export async function createProduct(productData: any) {
  const mutation = `
    mutation createProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  return shopifyFetch(mutation, { input: productData });
}

// Create an order in Shopify (manual order)
export async function createOrder(orderData: any) {
  const mutation = `
    mutation createOrder($input: OrderCreateInput!) {
      orderCreate(input: $input) {
        order {
          id
          name
          email
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  return shopifyFetch(mutation, { input: orderData });
}

// Get shop info
export async function getShopInfo() {
  const query = `
    query {
      shop {
        name
        email
        myshopifyDomain
        currencyCode
        plan {
          displayName
        }
      }
    }
  `;
  return shopifyFetch(query);
}
