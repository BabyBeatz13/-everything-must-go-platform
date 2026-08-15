export type CarrierCode = "USPS" | "UPS" | "FedEx" | "DHL" | "Other";

export type ShippingMethodDefinition = {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedMinDays: number;
  estimatedMaxDays: number;
  active: boolean;
  sellerId: string | null;
  applicableCategories: string[];
  freeShippingThreshold?: number;
};

export type DeliveryWindow = {
  estimatedShipDate: string | null;
  estimatedDeliveryStart: string | null;
  estimatedDeliveryEnd: string | null;
  actualShippedAt: string | null;
  actualDeliveredAt: string | null;
};

export type DeliveryGuarantee = {
  eligible: boolean;
  reason: string | null;
  guaranteedDeliveryDate: string | null;
};

export type ShippingCarrierService = {
  code: CarrierCode;
  serviceLevel: string;
  label: string;
};

export const carrierServices: ShippingCarrierService[] = [
  { code: "USPS", serviceLevel: "Priority Mail", label: "USPS Priority Mail" },
  { code: "UPS", serviceLevel: "Ground", label: "UPS Ground" },
  { code: "FedEx", serviceLevel: "Express Saver", label: "FedEx Express Saver" },
  { code: "DHL", serviceLevel: "Express Worldwide", label: "DHL Express Worldwide" },
  { code: "Other", serviceLevel: "Manual", label: "Other / Manual" },
];

export const defaultShippingMethods: ShippingMethodDefinition[] = [
  {
    id: "method-standard",
    name: "Standard",
    description: "Reliable ground delivery for everyday shopping.",
    price: 12.99,
    estimatedMinDays: 4,
    estimatedMaxDays: 7,
    active: true,
    sellerId: null,
    applicableCategories: ["Electronics", "Home", "Beauty", "Fitness"],
  },
  {
    id: "method-expedited",
    name: "Expedited",
    description: "Faster delivery for time-sensitive shipments.",
    price: 24.99,
    estimatedMinDays: 2,
    estimatedMaxDays: 4,
    active: true,
    sellerId: null,
    applicableCategories: ["Electronics", "Studio", "Health"],
  },
  {
    id: "method-express",
    name: "Express",
    description: "Priority handling for urgent orders.",
    price: 39.99,
    estimatedMinDays: 1,
    estimatedMaxDays: 2,
    active: true,
    sellerId: null,
    applicableCategories: ["Luxury Jewelry", "Luxury Handbags", "Watches"],
    freeShippingThreshold: 1500,
  },
  {
    id: "method-free-shipping",
    name: "Free Shipping",
    description: "No-charge standard delivery after the configured threshold.",
    price: 0,
    estimatedMinDays: 4,
    estimatedMaxDays: 8,
    active: true,
    sellerId: null,
    applicableCategories: ["Fashion", "Home", "Beauty"],
    freeShippingThreshold: 299,
  },
  {
    id: "method-local-pickup",
    name: "Local Pickup",
    description: "Pickup from the seller or local partner location.",
    price: 0,
    estimatedMinDays: 1,
    estimatedMaxDays: 2,
    active: true,
    sellerId: null,
    applicableCategories: ["Home", "Studio"],
  },
];

export function getBusinessDaysOffset(date: Date, days: number) {
  const result = new Date(date);
  let remaining = days;

  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      remaining -= 1;
    }
  }

  return result;
}

export function calculateDeliveryWindow({
  paymentDate,
  handlingDays,
  shippingMethod,
  shipByDate,
}: {
  paymentDate: Date | string;
  handlingDays: number;
  shippingMethod: ShippingMethodDefinition;
  shipByDate?: Date | string | null;
}): DeliveryWindow {
  const base = new Date(paymentDate);
  const estimatedShip = shipByDate ? new Date(shipByDate) : getBusinessDaysOffset(base, Math.max(handlingDays, 1));
  const start = getBusinessDaysOffset(estimatedShip, shippingMethod.estimatedMinDays);
  const end = getBusinessDaysOffset(estimatedShip, shippingMethod.estimatedMaxDays);

  return {
    estimatedShipDate: estimatedShip.toISOString(),
    estimatedDeliveryStart: start.toISOString(),
    estimatedDeliveryEnd: end.toISOString(),
    actualShippedAt: null,
    actualDeliveredAt: null,
  };
}

export function evaluateDeliveryGuarantee({
  sellerVerified,
  onTimeShippingRate,
  inventoryAvailable,
  handlingTimeDays,
  shippingMethod,
  destination,
  carrier,
  category,
}: {
  sellerVerified: boolean;
  onTimeShippingRate: number;
  inventoryAvailable: boolean;
  handlingTimeDays: number;
  shippingMethod: ShippingMethodDefinition;
  destination: string;
  carrier: CarrierCode;
  category: string;
}): DeliveryGuarantee {
  const eligible =
    sellerVerified &&
    onTimeShippingRate >= 0.96 &&
    inventoryAvailable &&
    handlingTimeDays <= 2 &&
    shippingMethod.active &&
    shippingMethod.estimatedMaxDays <= 5 &&
    destination !== "remote" &&
    carrier !== "Other" &&
    !["Collectibles", "Luxury Jewelry", "Luxury Handbags", "Watches"].includes(category);

  return {
    eligible,
    reason: eligible ? null : "Not yet eligible for a guaranteed delivery promise.",
    guaranteedDeliveryDate: eligible ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString() : null,
  };
}

export function getShippingTimeline(
  status: string,
  trackingNumber?: string | null,
  estimatedDelivery?: string | null,
): Array<{ label: string; value: string; active: boolean }> {
  const base = [
    { label: "Processing", value: "Order confirmed", active: status !== "pending" },
    { label: "Ready to ship", value: trackingNumber ? "Package prepared" : "Awaiting package", active: status === "ready_to_ship" || status === "shipped" || status === "out_for_delivery" || status === "delivered" },
    { label: "Shipped", value: trackingNumber ? "Tracked" : "Pending", active: status === "shipped" || status === "out_for_delivery" || status === "delivered" },
    { label: "In transit", value: estimatedDelivery ? "On route" : "Awaiting carrier", active: status === "in_transit" || status === "out_for_delivery" || status === "delivered" },
    { label: "Delivered", value: estimatedDelivery ? "ETA" : "Pending", active: status === "delivered" },
  ];

  return base.map((item) => ({
    ...item,
    active: item.active || status === "delivered",
  }));
}
