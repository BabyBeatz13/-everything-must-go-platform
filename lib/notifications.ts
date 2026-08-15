export type NotificationTarget = "customer" | "seller" | "staff";

export type NotificationPayload = {
  title: string;
  description: string;
  target: NotificationTarget;
  createdAt: string;
};

export const notificationTemplates: NotificationPayload[] = [
  {
    title: "New seller message",
    description: "A seller sent you a message about your order.",
    target: "customer",
    createdAt: "2026-08-14T08:00:00.000Z",
  },
  {
    title: "Support reply",
    description: "A support agent has answered your latest ticket.",
    target: "customer",
    createdAt: "2026-08-12T17:15:00.000Z",
  },
  {
    title: "Ticket assigned",
    description: "You have a new urgent ticket assigned to your queue.",
    target: "staff",
    createdAt: "2026-08-14T07:40:00.000Z",
  },
  {
    title: "Authenticity request",
    description: "A luxury authenticity review has been requested for one of your listings.",
    target: "seller",
    createdAt: "2026-08-13T12:00:00.000Z",
  },
];

export function getNotificationsByTarget(target: NotificationTarget) {
  return notificationTemplates.filter((item) => item.target === target);
}
