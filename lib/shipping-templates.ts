export const sellerShippingSettingsTemplate = {
  defaultHandlingTimeDays: 2,
  shippingOriginCountry: "US",
  shippingOriginState: "CA",
  processingDays: 2,
  weekendProcessingPreference: false,
  returnAddress: "Seller returns department (private address not public)",
  localPickupEnabled: false,
  freeShippingThreshold: 299,
};

export const highValueCategories = [
  "Gold Chains",
  "Diamond Chains",
  "Luxury Jewelry",
  "Vintage Jewelry",
  "Luxury Handbags",
  "Designer Handbags",
  "Watches",
  "Collectibles",
  "Vintage Toys",
  "Vintage Bags",
];

export const deliveryProtectionTriggers = [
  "item_not_shipped",
  "excessively_late_shipment",
  "lost_package",
  "damaged_package",
  "tracking_inconsistency",
  "delivered_but_not_received",
];

export const defaultShipmentTimeline = [
  { status: "label_created", label: "Label created" },
  { status: "pre_transit", label: "Order prepared" },
  { status: "in_transit", label: "In transit" },
  { status: "out_for_delivery", label: "Out for delivery" },
  { status: "delivered", label: "Delivered" },
];
