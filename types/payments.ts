export type StripePaymentStatus =
  | "pending_payment"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type StripeFulfillmentStatus =
  | "pending_payment"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export type SellerTransferStatus = "pending" | "completed" | "failed" | "reversed" | "cancelled";

export type SellerConnectStatus = {
  stripeAccountId: string | null;
  onboardingComplete: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
};

export type MoneyBreakdownCents = {
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  platformFeeCents: number;
  totalCents: number;
};

export type SellerTransferRecord = {
  sellerId: string;
  orderId: string;
  stripeTransferId: string | null;
  grossSalesCents: number;
  platformFeeCents: number;
  sellerAmountCents: number;
  currency: string;
  transferStatus: SellerTransferStatus;
};

export type PlatformFeeRecord = {
  orderId: string;
  orderItemId: string | null;
  sellerId: string | null;
  feeAmountCents: number;
  feeType: "commission" | "refund_adjustment" | "dispute_adjustment";
  currency: string;
};
