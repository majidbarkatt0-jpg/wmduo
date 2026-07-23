/**
 * WM DUO - Automated Order Fulfillment System
 * 
 * When a customer buys on wmduo.com → Shopify checkout → Order comes in
 * This system auto-fulfills the order by placing it with the supplier.
 * 
 * Currently supports: AliExpress / CJ Dropshipping manual workflow
 * For FULL automation: Connect CJ Dropshipping API
 */

// Product → Supplier mapping
// Each product SKU maps to a supplier URL for auto-ordering
export const SUPPLIER_MAP: Record<string, {
  name: string;
  type: 'aliexpress' | 'cj' | 'spocket' | 'brand';
  url: string;
  costPrice: number;
  ourPrice: number;
  shipping: number;
  notes: string;
}> = {
  "WM-AROMA-001": {
    name: "Aromatherapy Oil Diffuser + LED",
    type: "aliexpress",
    url: "https://www.aliexpress.com/item/1005001234567.html",
    costPrice: 6.50,
    ourPrice: 29.99,
    shipping: 3.50,
    notes: "AliExpress - Ships from China (10-15 days) or CJ US warehouse (5-7 days)"
  },
  "WM-CAR-PUR-001": {
    name: "Car Air Purifier HEPA Mini",
    type: "aliexpress",
    url: "https://www.aliexpress.com/item/1005001234568.html",
    costPrice: 8.00,
    ourPrice: 34.99,
    shipping: 4.00,
    notes: "AliExpress - Ships from China (10-15 days)"
  },
  "WM-TRACK-001": {
    name: "Bluetooth Tracker Key Finder",
    type: "aliexpress",
    url: "https://www.aliexpress.com/item/1005001234569.html",
    costPrice: 3.00,
    ourPrice: 24.99,
    shipping: 1.50,
    notes: "AliExpress - Ships from China (10-18 days) - Very lightweight"
  },
  "WM-PROJ-1080-001": {
    name: "Portable Mini Projector 1080p",
    type: "aliexpress",
    url: "https://www.aliexpress.com/item/1005001234570.html",
    costPrice: 21.00,
    ourPrice: 76.99,
    shipping: 8.00,
    notes: "AliExpress - Ships from China (12-18 days) - Fragile, use bubble wrap"
  },
  "WM-LEVOIT-001": {
    name: "LEVOIT Core Mini Air Purifier",
    type: "brand",
    url: "https://www.amazon.com/dp/B08R6TYVHY",
    costPrice: 14.00,
    ourPrice: 49.99,
    shipping: 5.00,
    notes: "Brand product - Source from LEVOIT official/Alibaba. Amazon FBA for fastest shipping."
  },
  "WM-DREO-FAN-001": {
    name: "DREO Tower Fan",
    type: "brand",
    url: "https://www.amazon.com/dp/B0B1234567",
    costPrice: 24.00,
    ourPrice: 69.99,
    shipping: 8.00,
    notes: "Brand product - Source from DREO official/Alibaba. Large item - higher shipping."
  },
  "WM-CASTLE-001": {
    name: "CastleView Mini 210° Projector",
    type: "aliexpress",
    url: "https://www.aliexpress.com/item/1005001234571.html",
    costPrice: 21.00,
    ourPrice: 89.99,
    shipping: 8.00,
    notes: "AliExpress - Ships from China (12-18 days)"
  },
  "WM-FLAME-DIFF-001": {
    name: "Flame Aroma Diffuser - 3D Fireplace Essential Oil Diffuser",
    type: "cj",
    url: "https://cjdropshipping.com/product/new-flame-aromatherapy-machine-colorful-essential-oil-diffuser-home-large-fog-volume-flame-humidifier-3d-flame-fireplace-machine-p-2410050244571620700.html",
    costPrice: 12.00,
    ourPrice: 57.99,
    shipping: 5.00,
    notes: "CJ Dropshipping - Ships from China (10-15 days) or US warehouse (5-7 days). Remote control + USB-C included."
  }
};

export interface OrderItem {
  sku: string;
  title: string;
  quantity: number;
  price: number;
}

export interface FulfillmentOrder {
  orderNumber: string;
  email: string;
  items: OrderItem[];
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    address1: string;
    city: string;
    zip?: string;
    country: string;
  };
}

/**
 * Calculate total cost for an order (product cost + shipping)
 */
export function calculateOrderCost(items: OrderItem[]): { totalCost: number; totalShipping: number; totalProfit: number } {
  let totalCost = 0;
  let totalShipping = 0;
  
  for (const item of items) {
    const supplier = SUPPLIER_MAP[item.sku];
    if (supplier) {
      totalCost += supplier.costPrice * item.quantity;
      totalShipping += supplier.shipping * item.quantity;
    }
  }
  
  return {
    totalCost,
    totalShipping,
    totalProfit: 0, // Will be calculated when sell price is known
  };
}

/**
 * Generate the fulfillment instructions for manual or semi-auto fulfillment
 */
export function generateFulfillmentInstructions(order: FulfillmentOrder): string {
  let instructions = `=== FULFILLMENT ORDER #${order.orderNumber} ===\n\n`;
  instructions += `Customer: ${order.email}\n`;
  instructions += `Ship To: ${order.shippingAddress.address1}, ${order.shippingAddress.city} ${order.shippingAddress.zip || ''}, ${order.shippingAddress.country}\n\n`;
  instructions += `ITEMS TO ORDER:\n`;
  
  for (const item of order.items) {
    const supplier = SUPPLIER_MAP[item.sku];
    if (supplier) {
      instructions += `\n📦 ${item.title} x${item.quantity}\n`;
      instructions += `   SKU: ${item.sku}\n`;
      instructions += `   Cost: $${(supplier.costPrice * item.quantity).toFixed(2)}\n`;
      instructions += `   Our Price: $${(item.price * item.quantity).toFixed(2)}\n`;
      instructions += `   Profit: $${((item.price - supplier.costPrice) * item.quantity).toFixed(2)}\n`;
      instructions += `   Order From: ${supplier.url}\n`;
      instructions += `   Notes: ${supplier.notes}\n`;
    } else {
      instructions += `\n📦 ${item.title} x${item.quantity}\n`;
      instructions += `   ⚠️ No supplier configured for SKU: ${item.sku}\n`;
    }
  }
  
  instructions += `\n=== TOTAL PROFIT: $${calculateTotalProfit(order.items)} ===\n`;
  
  return instructions;
}

function calculateTotalProfit(items: OrderItem[]): number {
  let profit = 0;
  for (const item of items) {
    const supplier = SUPPLIER_MAP[item.sku];
    if (supplier) {
      profit += (item.price - supplier.costPrice) * item.quantity;
    }
  }
  return profit;
}

/**
 * Marketplace URLs for sourcing each product
 */
export function getSupplierUrl(sku: string): string | null {
  return SUPPLIER_MAP[sku]?.url || null;
}

/**
 * Get all supplier info as a JSON-friendly object
 */
export function getAllSupplierInfo() {
  const info: Record<string, any> = {};
  for (const [sku, supplier] of Object.entries(SUPPLIER_MAP)) {
    info[sku] = {
      name: supplier.name,
      type: supplier.type,
      url: supplier.url,
      costPrice: supplier.costPrice,
      ourPrice: supplier.ourPrice,
      shipping: supplier.shipping,
      margin: Math.round(((supplier.ourPrice - supplier.costPrice - supplier.shipping) / supplier.ourPrice) * 100),
      profit: supplier.ourPrice - supplier.costPrice - supplier.shipping,
    };
  }
  return info;
}
