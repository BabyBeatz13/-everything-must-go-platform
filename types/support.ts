export type SupportCategory =
  | "Order problem"
  | "Shipping issue"
  | "Tracking issue"
  | "Return"
  | "Refund"
  | "Payment issue"
  | "Seller issue"
  | "Product authenticity concern"
  | "Account/login issue"
  | "Website issue"
  | "General question"
  | "Other";

export type SupportStatus =
  | "new"
  | "open"
  | "waiting_on_customer"
  | "waiting_on_seller"
  | "waiting_on_support"
  | "escalated"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "normal" | "high" | "urgent";

export type SupportRole =
  | "owner"
  | "admin"
  | "support_manager"
  | "support_agent"
  | "seller_support"
  | "authenticity_reviewer"
  | "finance_support"
  | "moderation_staff";

export type SupportMessageType =
  | "customer"
  | "support_staff"
  | "seller"
  | "admin"
  | "internal_note";

export type SupportTicket = {
  id: string;
  ticketNumber: string;
  customerId: string;
  sellerId?: string | null;
  orderId?: string | null;
  productId?: string | null;
  assignedStaffUser?: string | null;
  category: SupportCategory;
  priority: TicketPriority;
  status: SupportStatus;
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  evidenceNotes?: string;
};

export type SupportMessage = {
  id: string;
  ticketId: string;
  senderType: SupportMessageType;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  internalOnly?: boolean;
};

export type Conversation = {
  id: string;
  type: "support" | "seller" | "order";
  title: string;
  participantIds: string[];
  orderId?: string | null;
  productId?: string | null;
  sellerId?: string | null;
  status: "active" | "archived" | "moderated";
  updatedAt: string;
};

export type HelpArticle = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  body: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type StaffRolePermissionMap = Record<string, string[]>;

export type StaffMember = {
  id: string;
  name: string;
  role: SupportRole;
  status: "active" | "suspended";
  skills: string[];
  assignedTickets: number;
};
