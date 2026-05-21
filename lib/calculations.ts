export interface LineItemCalculation {
  tablePrice: number;
  quantity: number;
  discountPercent: number;
  discountAmount: number;
  promotionalPrice?: number;
  promotionalMonths: number;
  standardPriceAfterPromo?: number;
  billingType: 'monthly' | 'yearly' | 'one-time' | 'consumption' | 'addon';
}

export function calculateLineItem(item: LineItemCalculation) {
  const monthlyTablePrice = item.tablePrice * item.quantity;
  
  let discountAmount = item.discountAmount;
  if (item.discountPercent > 0 && !discountAmount) {
    discountAmount = monthlyTablePrice * (item.discountPercent / 100);
  }
  
  const monthlyPromotionalPrice = item.promotionalPrice || 
    (monthlyTablePrice - discountAmount);
  
  const monthlyStandardPrice = item.standardPriceAfterPromo || monthlyTablePrice;
  
  return {
    monthlyTablePrice,
    monthlyPromotionalPrice,
    monthlyStandardPrice,
    discountAmount,
    discountPercent: item.discountPercent,
    promotionalMonths: item.promotionalMonths,
  };
}

export function calculateMonthlyTotal(lineItems: any[]) {
  let totalMonthly = 0;
  let totalMonthlyPromo = 0;
  
  lineItems.forEach((item) => {
    const calc = calculateLineItem(item);
    totalMonthly += calc.monthlyTablePrice;
    totalMonthlyPromo += calc.monthlyPromotionalPrice;
  });
  
  return {
    totalMonthly,
    totalMonthlyPromo,
  };
}

export function calculateImplementationTotal(lineItems: any[]) {
  return lineItems
    .filter((item) => item.billingType === 'one-time')
    .reduce((sum, item) => sum + (item.tablePrice * item.quantity), 0);
}

export function calculateDiscountAmount(price: number, discountPercent: number) {
  return price * (discountPercent / 100);
}

export function calculatePromotionalPeriod(
  monthlyPrice: number,
  months: number,
  monthlyStandardPrice: number
) {
  const promoTotal = monthlyPrice * months;
  const standardTotal = monthlyStandardPrice * months;
  const savings = standardTotal - promoTotal;
  
  return {
    promoTotal,
    standardTotal,
    savings,
  };
}

export function calculateAnnualTotal(
  monthlyTable: number,
  monthlyPromo: number,
  promotionalMonths: number,
  implementationCost: number = 0
) {
  const remainingMonths = 12 - promotionalMonths;
  const promoTotal = monthlyPromo * promotionalMonths;
  const standardTotal = monthlyTable * remainingMonths;
  const annualRecurring = promoTotal + standardTotal;
  const total = annualRecurring + implementationCost;
  
  return {
    annualRecurring,
    promoTotal,
    standardTotal,
    implementationCost,
    total,
  };
}

export function calculateAnnualDiscount(monthlyTable: number, monthlyPromo: number, months: number = 12) {
  const standardCost = monthlyTable * months;
  const promoCost = monthlyPromo * months;
  const savings = standardCost - promoCost;
  const savingsPercent = (savings / standardCost) * 100;
  
  return {
    standardCost,
    promoCost,
    savings,
    savingsPercent,
  };
}

export function calculateFirstYearTotal(
  monthlyPromo: number,
  monthlyStandard: number,
  promotionalMonths: number,
  implementationCost: number = 0
) {
  const promoMonthsCost = monthlyPromo * promotionalMonths;
  const standardMonthsCost = monthlyStandard * (12 - promotionalMonths);
  const total = promoMonthsCost + standardMonthsCost + implementationCost;
  
  return {
    promoMonthsCost,
    standardMonthsCost,
    implementationCost,
    total,
  };
}

export function calculateEconomy(
  monthlyTable: number,
  monthlyPromo: number,
  promotionalMonths: number
) {
  const monthlyEconomy = monthlyTable - monthlyPromo;
  const totalEconomy = monthlyEconomy * promotionalMonths;
  
  return {
    monthlyEconomy,
    totalEconomy,
  };
}

export function formatCommercialSummary(lineItems: any[]) {
  let summary = {
    totalMonthlyTable: 0,
    totalMonthlyPromo: 0,
    totalImplementation: 0,
    totalDiscount: 0,
    itemCount: lineItems.length,
    items: [] as any[],
  };
  
  lineItems.forEach((item) => {
    const calc = calculateLineItem(item);
    
    if (item.billingType === 'one-time') {
      summary.totalImplementation += calc.monthlyTablePrice;
    } else {
      summary.totalMonthlyTable += calc.monthlyTablePrice;
      summary.totalMonthlyPromo += calc.monthlyPromotionalPrice;
    }
    
    summary.totalDiscount += calc.discountAmount;
    
    summary.items.push({
      productName: item.productName,
      plan: item.plan,
      monthlyTablePrice: calc.monthlyTablePrice,
      monthlyPromotionalPrice: calc.monthlyPromotionalPrice,
      discountAmount: calc.discountAmount,
    });
  });
  
  return summary;
}
