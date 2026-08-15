import type {
  Conversation,
  HelpArticle,
  StaffMember,
  StaffRolePermissionMap,
  SupportCategory,
  SupportMessage,
  SupportRole,
  SupportStatus,
  SupportTicket,
  TicketPriority,
} from "@/types/support";

export const supportCategories: SupportCategory[] = [
  "Order problem",
  "Shipping issue",
  "Tracking issue",
  "Return",
  "Refund",
  "Payment issue",
  "Seller issue",
  "Product authenticity concern",
  "Account/login issue",
  "Website issue",
  "General question",
  "Other",
];

export const supportStatuses: SupportStatus[] = [
  "new",
  "open",
  "waiting_on_customer",
  "waiting_on_seller",
  "waiting_on_support",
  "escalated",
  "resolved",
  "closed",
];

export const supportPriorities: TicketPriority[] = ["low", "normal", "high", "urgent"];

export const supportRoles: SupportRole[] = [
  "owner",
  "admin",
  "support_manager",
  "support_agent",
  "seller_support",
  "authenticity_reviewer",
  "finance_support",
  "moderation_staff",
];

export const staffRolePermissions: StaffRolePermissionMap = {
  owner: [
    "full_access",
    "manage_admin_roles",
    "approve_refunds",
    "manage_seller_suspensions",
    "manage_payout_holds",
    "authenticity_decisions",
    "marketplace_configuration",
  ],
  admin: [
    "view_staff",
    "assign_roles",
    "manage_support",
    "escalate_tickets",
    "view_support_metrics",
    "review_risk_flags",
  ],
  support_manager: [
    "assign_tickets",
    "reassign_tickets",
    "escalate_tickets",
    "view_support_metrics",
    "manage_support_agents",
  ],
  support_agent: [
    "read_assigned_tickets",
    "reply_to_tickets",
    "see_basic_order_context",
    "no_payout_changes",
    "no_refund_execution",
    "no_seller_verification_changes",
  ],
  seller_support: [
    "seller_onboarding_support",
    "seller_profile_support",
    "seller_order_support",
    "no_customer_payment_controls",
  ],
  authenticity_reviewer: [
    "access_authenticity_evidence",
    "review_luxury_listings",
    "no_unrelated_finance_data",
  ],
  finance_support: [
    "payment_investigation",
    "refund_investigation",
    "no_product_moderation",
  ],
  moderation_staff: [
    "review_message_flags",
    "moderate_abuse_reports",
    "no_finance_controls",
  ],
};

export const supportTickets: SupportTicket[] = [
  {
    id: "TKT-1001",
    ticketNumber: "EMG-1001",
    customerId: "cust_001",
    sellerId: "seller_101",
    orderId: "ord_201",
    productId: "prod_881",
    assignedStaffUser: "staff_001",
    category: "Shipping issue",
    priority: "high",
    status: "open",
    subject: "Tracking has not updated after dispatch",
    description: "I placed an order for a luxury handbag and the tracking page has not updated since the package left the warehouse. Please confirm the shipment status.",
    createdAt: "2026-08-12T14:20:00.000Z",
    updatedAt: "2026-08-12T17:30:00.000Z",
    evidenceNotes: "Carrier scan screenshot attached.",
  },
  {
    id: "TKT-1002",
    ticketNumber: "EMG-1002",
    customerId: "cust_002",
    sellerId: null,
    orderId: "ord_145",
    productId: null,
    assignedStaffUser: null,
    category: "Refund",
    priority: "urgent",
    status: "new",
    subject: "Need help with a delayed refund",
    description: "The return was approved but the refund is still missing from my payment account. Please advise on the time frame.",
    createdAt: "2026-08-14T09:05:00.000Z",
    updatedAt: "2026-08-14T09:05:00.000Z",
    evidenceNotes: "Proof of approval attached.",
  },
  {
    id: "TKT-1003",
    ticketNumber: "EMG-1003",
    customerId: "cust_003",
    sellerId: "seller_221",
    orderId: "ord_771",
    productId: "prod_221",
    assignedStaffUser: "staff_002",
    category: "Product authenticity concern",
    priority: "urgent",
    status: "escalated",
    subject: "Authenticity review requested for luxury watch",
    description: "The item arrived with a missing serial number and I am requesting an authenticity review before the product is accepted.",
    createdAt: "2026-08-10T12:00:00.000Z",
    updatedAt: "2026-08-12T11:15:00.000Z",
    resolvedAt: null,
    evidenceNotes: "Photos and serial number evidence supplied.",
  },
];

export const supportMessages: SupportMessage[] = [
  {
    id: "MSG-1",
    ticketId: "TKT-1001",
    senderType: "customer",
    senderId: "cust_001",
    senderName: "Mila Carter",
    content: "My order shipped but the carrier has not updated the package. Can you check the delivery status?",
    createdAt: "2026-08-12T14:35:00.000Z",
  },
  {
    id: "MSG-2",
    ticketId: "TKT-1001",
    senderType: "support_staff",
    senderId: "staff_001",
    senderName: "Ava Thompson",
    content: "We are reviewing the carrier scan and the seller shipping settings now. I will update you shortly.",
    createdAt: "2026-08-12T17:12:00.000Z",
  },
  {
    id: "MSG-3",
    ticketId: "TKT-1002",
    senderType: "customer",
    senderId: "cust_002",
    senderName: "Jordan Reed",
    content: "The return was approved, but the reimbursement still has not posted. Please advise.",
    createdAt: "2026-08-14T09:08:00.000Z",
  },
  {
    id: "MSG-4",
    ticketId: "TKT-1003",
    senderType: "internal_note",
    senderId: "staff_009",
    senderName: "Internal note",
    content: "Luxury authentication desk requested additional product evidence before final classification.",
    createdAt: "2026-08-12T11:18:00.000Z",
    internalOnly: true,
  },
];

export const supportConversations: Conversation[] = [
  {
    id: "conv_order_201",
    type: "order",
    title: "Order 201 seller conversation",
    participantIds: ["cust_001", "seller_101"],
    orderId: "ord_201",
    productId: "prod_881",
    sellerId: "seller_101",
    status: "active",
    updatedAt: "2026-08-12T17:30:00.000Z",
  },
  {
    id: "conv_support_1001",
    type: "support",
    title: "Support ticket EMG-1001",
    participantIds: ["cust_001", "staff_001"],
    orderId: "ord_201",
    sellerId: "seller_101",
    status: "active",
    updatedAt: "2026-08-12T17:30:00.000Z",
  },
];

export const helpArticles: HelpArticle[] = [
  {
    id: "help-buying",
    title: "Buying on Everything Must Go",
    slug: "buying",
    category: "Buying",
    summary: "Everything you need to know about shopping, checkout, order updates, and support.",
    body: "Our marketplace combines secure payments, seller verification, and customer protection. If you have questions about product listings, order status, or authenticity, contact support through your account or the help center.",
    published: true,
    sortOrder: 1,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "help-shipping",
    title: "Shipping and tracking",
    slug: "shipping",
    category: "Shipping",
    summary: "Understand delivery estimates, tracking updates, and dispute escalation for shipping problems.",
    body: "Tracking updates are provided by the seller and carrier. If your parcel has not updated within the expected timeline, you can open a shipping issue ticket or contact the seller from the order detail page.",
    published: true,
    sortOrder: 2,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "help-authenticity",
    title: "Luxury goods and authenticity",
    slug: "authentication-luxury-goods",
    category: "Authentication & luxury goods",
    summary: "Learn how the marketplace protects high-value luxury purchases and how to request review.",
    body: "High-value categories include watches, jewelry, handbags, and collectibles. If an item appears incorrect or counterfeit, escalate the ticket with photos and serial details for review.",
    published: true,
    sortOrder: 3,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
];

export const staffMembers: StaffMember[] = [
  { id: "staff_001", name: "Ava Thompson", role: "support_agent", status: "active", skills: ["Orders", "Shipping"], assignedTickets: 2 },
  { id: "staff_002", name: "Marcus Flynn", role: "support_manager", status: "active", skills: ["Refunds", "Payments"], assignedTickets: 4 },
  { id: "staff_003", name: "Leah Patel", role: "authenticity_reviewer", status: "active", skills: ["Jewelry/authenticity", "Designer handbags"], assignedTickets: 1 },
  { id: "staff_004", name: "Nora Brooks", role: "finance_support", status: "active", skills: ["Payments", "Refunds"], assignedTickets: 3 },
];

export function getSupportTicketById(ticketId: string) {
  return supportTickets.find((ticket) => ticket.id === ticketId || ticket.ticketNumber === ticketId) ?? null;
}

export function getConversationById(conversationId: string) {
  return supportConversations.find((conversation) => conversation.id === conversationId) ?? null;
}

export function getHelpArticleBySlug(slug: string) {
  return helpArticles.find((article) => article.slug === slug && article.published) ?? null;
}

export function getRolePermissions(role: string) {
  return staffRolePermissions[role] ?? [];
}

export function getSupportMetrics() {
  const total = supportTickets.length;
  const newTickets = supportTickets.filter((ticket) => ticket.status === "new").length;
  const urgent = supportTickets.filter((ticket) => ticket.priority === "urgent").length;
  const escalated = supportTickets.filter((ticket) => ticket.status === "escalated").length;
  const waitingCustomer = supportTickets.filter((ticket) => ticket.status === "waiting_on_customer").length;
  const waitingSeller = supportTickets.filter((ticket) => ticket.status === "waiting_on_seller").length;
  const waitingSupport = supportTickets.filter((ticket) => ticket.status === "waiting_on_support").length;

  return {
    total,
    newTickets,
    urgent,
    escalated,
    waitingCustomer,
    waitingSeller,
    waitingSupport,
    resolvedToday: 2,
    avgResponseTime: "4.2h",
    avgResolutionTime: "18.6h",
  };
}
