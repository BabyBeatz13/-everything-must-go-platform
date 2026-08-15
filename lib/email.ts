export type EmailTemplateName =
  | "ticket_opened"
  | "support_reply"
  | "ticket_resolved"
  | "order_shipped"
  | "return_approved"
  | "refund_approved"
  | "seller_message"
  | "case_escalation";

export type EmailTemplateInput = {
  subject: string;
  to: string;
  body: string;
};

export function getEmailTemplate(name: EmailTemplateName, params: Record<string, string>): EmailTemplateInput {
  const templates: Record<EmailTemplateName, (values: Record<string, string>) => EmailTemplateInput> = {
    ticket_opened: ({ number, customerName }) => ({
      subject: `We received your support ticket ${number}`,
      to: customerName,
      body: `Hello ${customerName}, we have received your support ticket ${number}. A member of our team will respond soon.`,
    }),
    support_reply: ({ ticketNumber, agentName }) => ({
      subject: `Update on ticket ${ticketNumber}`,
      to: agentName,
      body: `A support update has been posted to ${ticketNumber}. Please review the latest conversation.`,
    }),
    ticket_resolved: ({ ticketNumber }) => ({
      subject: `Ticket ${ticketNumber} has been resolved`,
      to: "customer",
      body: `Your support ticket ${ticketNumber} has been marked resolved. If you need anything else, please reply to the thread.`,
    }),
    order_shipped: ({ orderNumber }) => ({
      subject: `Order ${orderNumber} has shipped`,
      to: "customer",
      body: `Your order ${orderNumber} is on the way and tracking details are available in your account.`,
    }),
    return_approved: ({ orderNumber }) => ({
      subject: `Return approved for ${orderNumber}`,
      to: "customer",
      body: `Your return request for ${orderNumber} has been approved.`,
    }),
    refund_approved: ({ refundNumber }) => ({
      subject: `Refund ${refundNumber} approved`,
      to: "customer",
      body: `Your refund ${refundNumber} has been approved and is being processed.`,
    }),
    seller_message: ({ sellerName }) => ({
      subject: `New message from ${sellerName}`,
      to: "customer",
      body: `You have a new message from ${sellerName} regarding your order or item.`,
    }),
    case_escalation: ({ caseId }) => ({
      subject: `Escalation created for ${caseId}`,
      to: "support",
      body: `A support escalation has been created for case ${caseId}.`,
    }),
  };

  return templates[name](params);
}

export function sendEmailPlaceholder(name: EmailTemplateName, values: Record<string, string>) {
  return getEmailTemplate(name, values);
}
