export type ShippingCarrier = "USPS" | "UPS" | "FedEx" | "DHL" | "Other";
export type ShipmentStatus =
  | "label_created"
  | "pre_transit"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "exception"
  | "delayed"
  | "returned_to_sender"
  | "unknown";

export type FulfillmentWorkflowStatus =
  | "paid"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered";

export type ShippingMethod = {
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

export type SellerShippingSettings = {
  id: string;
  sellerId: string;
  defaultHandlingTimeDays: number;
  shippingOriginCountry: string;
  shippingOriginState: string;
  processingDays: number;
  weekendProcessingPreference: boolean;
  returnAddress: string;
  localPickupEnabled: boolean;
  freeShippingThreshold?: number;
  updatedAt: string;
};

export type PackageDetails = {
  id: string;
  shipmentId: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  packageType?: string;
  fragile?: boolean;
  signatureRequired?: boolean;
  insuranceRequested?: boolean;
  declaredValue?: number;
};

export type DeliveryGuarantee = {
  eligible: boolean;
  reason?: string;
  guaranteedDeliveryDate?: string | null;
};

export type ShipmentExceptionType =
  | "tracking_not_updating"
  | "carrier_delay"
  | "lost_package"
  | "damaged_in_transit"
  | "returned_to_sender"
  | "wrong_address"
  | "delivery_attempted"
  | "delivered_missing";

export type ShipmentRecord = {
  id: string;
  orderId: string;
  sellerId?: string | null;
  carrier?: ShippingCarrier | null;
  serviceLevel?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  status: ShipmentStatus;
  lastTrackingUpdate?: string | null;
  shippedAt?: string | null;
  estimatedDelivery?: string | null;
  deliveredAt?: string | null;
  estimatedShipDate?: string | null;
  estimatedDeliveryStart?: string | null;
  estimatedDeliveryEnd?: string | null;
  actualShippedAt?: string | null;
  actualDeliveredAt?: string | null;
  deliveryGuaranteeEligible?: boolean;
  deliveryGuaranteeReason?: string | null;
  guaranteedDeliveryDate?: string | null;
  payoutHoldStatus?: "none" | "pending" | "active" | "released";
};
