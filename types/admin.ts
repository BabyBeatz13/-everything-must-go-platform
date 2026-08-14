export type AdminRole = "admin" | "customer" | "vendor";

export type AdminMetricCard = {
  label: string;
  value: string;
  accent?: string;
};

export type AdminModerationDecision =
  | "approved"
  | "rejected"
  | "needs_more_information"
  | "suspended"
  | "pending_review";

export type AdminRiskLevel = "low" | "medium" | "high" | "critical";

export type AdminAuditAction =
  | "seller_approval"
  | "seller_rejection"
  | "seller_suspension"
  | "listing_removal"
  | "authenticity_decision"
  | "refund_approval"
  | "payout_hold"
  | "fee_setting_change"
  | "user_suspension"
  | "case_decision";
