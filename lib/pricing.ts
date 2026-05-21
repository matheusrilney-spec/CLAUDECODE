export interface PricingItem {
  id: string;
  productFamily: string;
  productCode: string;
  plan: string;
  currency: string;
  billingType: 'monthly' | 'yearly' | 'one-time' | 'consumption' | 'addon';
  metric: string;
  tier?: number;
  price: number;
  priceTable: string;
  sourceSheet: string;
  sourceRef: string;
}

let pricingCatalog: PricingItem[] = [];

export async function loadPricingCatalog(): Promise<PricingItem[]> {
  if (pricingCatalog.length > 0) {
    return pricingCatalog;
  }
  
  try {
    const response = await fetch('/data/pricingCatalog.json');
    if (!response.ok) {
      console.error('Failed to load pricing catalog');
      return [];
    }
    pricingCatalog = await response.json();
    return pricingCatalog;
  } catch (error) {
    console.error('Error loading pricing catalog:', error);
    return [];
  }
}

export function getPricingByProductAndPlan(
  productCode: string,
  plan: string,
  tier?: number
): PricingItem | null {
  return pricingCatalog.find(
    (item) =>
      item.productCode === productCode &&
      item.plan === plan &&
      (tier ? item.tier === tier : true)
  ) || null;
}

export function getPricingByFamily(productFamily: string): PricingItem[] {
  return pricingCatalog.filter((item) => item.productFamily === productFamily);
}

export function getAllProductFamilies(): string[] {
  const families = new Set(pricingCatalog.map((item) => item.productFamily));
  return Array.from(families);
}

export function getPlansByProductCode(productCode: string): string[] {
  const plans = new Set(
    pricingCatalog
      .filter((item) => item.productCode === productCode)
      .map((item) => item.plan)
  );
  return Array.from(plans);
}

export function getTiersByProductAndPlan(
  productCode: string,
  plan: string
): number[] {
  const tiers = pricingCatalog
    .filter((item) => item.productCode === productCode && item.plan === plan)
    .map((item) => item.tier)
    .filter((tier) => tier !== undefined) as number[];
  
  return [...new Set(tiers)].sort((a, b) => a - b);
}
