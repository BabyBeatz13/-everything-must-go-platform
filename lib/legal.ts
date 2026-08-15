export type PolicyStatus = "draft" | "published" | "archived";

export type LegalSection = {
  heading: string;
  body: string[];
};

export type LegalPolicy = {
  slug: string;
  type: string;
  title: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  status: PolicyStatus;
  summary: string;
  toc: string[];
  sections: LegalSection[];
  supportRoute: string;
};

export const legalPolicies: LegalPolicy[] = [
  {
    slug: "terms",
    type: "terms",
    title: "Terms of Service",
    version: "0.1 Draft",
    effectiveDate: "2026-08-14",
    lastUpdated: "2026-08-14",
    status: "draft",
    summary: "Marketplace account, buyer/seller responsibilities, payments, shipping, returns, support, authenticity, and required legal review placeholders.",
    supportRoute: "/support",
    toc: [
      "Marketplace accounts",
      "Buyer responsibilities",
      "Seller responsibilities",
      "Purchases and payments",
      "Shipping and returns",
      "Product authenticity",
      "Prohibited conduct",
      "Account suspension and termination",
      "Support and risk review",
    ],
    sections: [
      {
        heading: "Draft notice",
        body: [
          "DRAFT — Requires business/legal review before production launch.",
          "This draft is intended to establish policy structure and required marketplace terms for internal review. It does not claim attorney approval, governing law, arbitration language, or final legal entity status.",
        ],
      },
      {
        heading: "Marketplace accounts",
        body: [
          "With an Everything Must Go marketplace account, users may browse products, place orders, manage listings, communicate with buyers and sellers, and access support and dispute tools.",
          "Users are responsible for maintaining accurate account information, secure login credentials, and compliance with all applicable platform standards.",
        ],
      },
      {
        heading: "Buyer responsibilities",
        body: [
          "Buyers must provide accurate shipping information, pay for orders through approved channels, and communicate promptly with sellers and support when issues arise.",
          "Buyers must not use fraudulent payment methods, attempt off-platform transactions, or manipulate reviews or dispute processes.",
        ],
      },
      {
        heading: "Seller responsibilities",
        body: [
          "Sellers must provide accurate listings, truthful product descriptions, valid inventory status, and compliance with marketplace standards for authenticity, shipping, returns, and customer communication.",
          "High-value categories such as fine jewelry, handbags, vintage goods, and fragrances may require additional disclosures and verification.",
        ],
      },
      {
        heading: "Purchases, fees, and payments",
        body: [
          "Marketplace fees, seller commissions, payment processing, payouts, chargebacks, and dispute handling may be subject to operational policies and configuration.",
          "Final legal terms for jurisdiction, liability caps, and service-level specifics require business and legal review before production approval.",
        ],
      },
      {
        heading: "Shipping, returns, and refunds",
        body: [
          "Shipping and delivery are governed by applicable seller rules, category requirements, and marketplace policies. Estimated delivery dates may be provided, while guaranteed delivery claims require actual qualification under the delivery guarantee system.",
          "Return eligibility varies by product type, seller policy, category rules, and authenticity/dispute review. This policy does not make every item automatically returnable.",
        ],
      },
      {
        heading: "Product authenticity and prohibited conduct",
        body: [
          "Everything Must Go prohibits counterfeit goods, false authenticity representations, fake certificates, misrepresented materials, deceptive brand claims, and fraudulent trading behavior.",
          "Sellers must cooperate with authenticity investigations, provide required disclosure information, and avoid product claims that are misleading or unsupported.",
        ],
      },
      {
        heading: "Account suspension, termination, and disputes",
        body: [
          "The marketplace may restrict, suspend, or terminate access where there are policy violations, fraud concerns, payment issues, shipping abuse, repeated cancellations, or risk concerns.",
          "Disputes, complaints, and escalations may be reviewed by support, moderation, compliance, or staff teams before final action is taken.",
        ],
      },
      {
        heading: "Policy changes and support",
        body: [
          "The marketplace may update policy terms, product rules, and compliance requirements over time. Material changes will be communicated through the app and support channels as applicable.",
          "Questions should be directed to the support center or the applicable compliance contact route for review.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    type: "privacy",
    title: "Privacy Policy",
    version: "0.1 Draft",
    effectiveDate: "2026-08-14",
    lastUpdated: "2026-08-14",
    status: "draft",
    summary: "Draft privacy architecture covering account, seller, order, shipping, payment, support, cookies, retention, and privacy requests.",
    supportRoute: "/account/privacy",
    toc: [
      "Account and profile data",
      "Orders, shipping, and payments",
      "Support and search activity",
      "Cookies and analytics",
      "Service providers and security",
      "Retention and privacy requests",
    ],
    sections: [
      {
        heading: "Draft notice",
        body: [
          "DRAFT — Requires business/legal review before production launch.",
          "This privacy policy draft describes the marketplace's intended data handling approach and must be reviewed against business, security, and legal requirements before launch.",
        ],
      },
      {
        heading: "Account and profile information",
        body: [
          "Everything Must Go may collect account details such as name, email, login credentials, address, phone number, seller profile data, and communications preferences when users create or manage an account.",
          "Buyer and seller account data may be used to process orders, coordinate shipping, support listings, and administer support or dispute workflows.",
        ],
      },
      {
        heading: "Orders, shipping, and payments",
        body: [
          "Order records, shipping addresses, tracking details, payment information, and fulfillment notes may be processed to complete transactions, prevent fraud, and support returns, refunds, and disputes.",
          "Stripe and related payment providers may process transaction data according to their own terms and security practices. Supabase may be used for application storage and platform operations.",
        ],
      },
      {
        heading: "Support, product, and search activity",
        body: [
          "Support tickets, product inquiries, search activity, category browsing, and marketplace interactions may be used to improve service quality, moderate listings, and support customer protection workflows.",
          "This includes data collected for authenticity review, disputes, and fraud prevention where necessary.",
        ],
      },
      {
        heading: "Cookies and analytics",
        body: [
          "The marketplace may use cookies and similar technologies for necessary site functionality, preference management, analytics, and marketing where consent is obtained through the site settings and consent framework.",
          "Consent categories include necessary cookies, preferences, analytics, and marketing. No fake or preselected consent state should be implied.",
        ],
      },
      {
        heading: "Service providers and security",
        body: [
          "The marketplace may rely on service providers such as Stripe, Supabase, analytics tools, and support infrastructure. These providers handle data according to their policies and the terms of the marketplace relationship.",
          "Security controls, fraud detection, and access management are used to reduce unauthorized access, misuse, and operational risk. The platform does not claim certifications not obtained.",
        ],
      },
      {
        heading: "Retention, deletion requests, and legal obligations",
        body: [
          "Data may be retained as needed for orders, payments, refunds, disputes, fraud/security review, taxes, accounting, legal obligations, and platform operations. Some records may be retained even if an account is deleted or deactivated.",
          "Users may request to view, correct, or delete information where permitted by law and platform policy. Deletion requests must be balanced against legal, fraud, tax, and order-support obligations.",
        ],
      },
    ],
  },
  {
    slug: "seller-agreement",
    type: "seller_agreement",
    title: "Seller Agreement",
    version: "0.1 Draft",
    effectiveDate: "2026-08-14",
    lastUpdated: "2026-08-14",
    status: "draft",
    summary: "Draft seller responsibilities, authenticity standards, payout rules, and compliance expectations for marketplace activation.",
    supportRoute: "/support",
    toc: [
      "Listing standards",
      "Authenticity and inventory",
      "Shipping and customer care",
      "Payouts, fees, and disputes",
      "Compliance and suspension",
    ],
    sections: [
      {
        heading: "Draft notice",
        body: [
          "DRAFT — Requires business/legal review before production launch.",
          "Seller activation requires agreement to the operational obligations and marketplace rules set out below. This draft is not final legal documentation and should be reviewed by legal and business teams before launch.",
        ],
      },
      {
        heading: "Accurate listings and authenticity",
        body: [
          "Sellers must provide accurate listings, truthful product information, required disclosures, and compliance with marketplace authenticity standards. Counterfeit goods, misrepresented materials, fake certifications, and deceptive branding are prohibited.",
          "For luxury and high-value categories, sellers must disclose material, condition, provenance, certificates, and authenticity status when required.",
        ],
      },
      {
        heading: "Inventory, shipping, and tracking",
        body: [
          "Sellers are responsible for inventory accuracy, shipping timelines, packaging quality, tracking updates, and customer communication. Orders should be fulfilled through approved marketplace channels and must not be diverted to off-platform payment arrangements.",
          "Where tracking is required, accurate tracking numbers and status updates must be provided promptly.",
        ],
      },
      {
        heading: "Returns, refunds, and customer communication",
        body: [
          "Sellers must respond to customer concerns, cooperate with returns and dispute review, and provide information relevant to the order and product condition. Returns and refunds are governed by marketplace policy, seller policy, and category rules.",
          "Failure to respond to customer protection concerns or authenticity disputes may trigger review, hold, or suspension.",
        ],
      },
      {
        heading: "Payouts, fees, and compliance",
        body: [
          "Seller payouts are subject to platform commission, Stripe Connect configuration, payout holds, chargeback risk, fraud review, and compliance checks. The marketplace may review payouts when policy violations or risk factors appear.",
          "Sellers must cooperate with internal investigations, fraud reviews, and compliance inquiries.",
        ],
      },
      {
        heading: "Suspension, termination, and investigations",
        body: [
          "Seller accounts may be temporarily suspended, placed into review, or terminated for violations involving counterfeit goods, prohibited products, false claims, shipping abuse, intellectual property issues, or repeated misconduct.",
          "Sellers must cooperate with investigations and provide supporting information when the marketplace or compliance teams request it.",
        ],
      },
    ],
  },
  {
    slug: "customer-protection",
    type: "customer_protection",
    title: "Customer Protection Policy",
    version: "0.1 Draft",
    effectiveDate: "2026-08-14",
    lastUpdated: "2026-08-14",
    status: "draft",
    summary: "Draft customer protection standards covering order issues, item disputes, authenticity concerns, and review-based resolution.",
    supportRoute: "/support",
    toc: [
      "Order issues",
      "Authenticity concerns",
      "Review process",
      "Seller accountability",
    ],
    sections: [
      {
        heading: "Draft notice",
        body: [
          "DRAFT — Requires business/legal review before production launch.",
          "Customer protection processes provide review-based support for disputes and order issues. This policy does not promise automatic refunds for every complaint and must be reviewed before launch.",
        ],
      },
      {
        heading: "Covered issues",
        body: [
          "The marketplace may review item-not-received, damaged item, wrong item, materially not-as-described, authenticity concern, seller failure to ship, and tracking problem cases.",
          "Eligibility for support depends on order details, product category, shipping records, seller response, and review findings.",
        ],
      },
      {
        heading: "Review process",
        body: [
          "Complaints may be reviewed by support, moderation, authenticity staff, or compliance teams. The marketplace may request documentation, evidence, or additional information before making a final determination.",
          "This policy does not guarantee outcomes for all complaints. Decisions are based on review findings and policy eligibility.",
        ],
      },
      {
        heading: "Seller accountability",
        body: [
          "Sellers are expected to respond to order concerns, shipping issues, and authenticity questions in a timely and cooperative manner. Repeated failure to meet basic customer service standards may trigger account review or restrictions.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    type: "returns",
    title: "Returns Policy",
    version: "0.1 Draft",
    effectiveDate: "2026-08-14",
    lastUpdated: "2026-08-14",
    status: "draft",
    summary: "Draft configurable return policy infrastructure for standard and category-specific marketplace exceptions.",
    supportRoute: "/support",
    toc: [
      "Return window",
      "Category-specific rules",
      "Damaged or wrong items",
      "Authenticity disputes",
      "Shipping responsibility",
    ],
    sections: [
      {
        heading: "Draft notice",
        body: [
          "DRAFT — Requires business/legal review before production launch.",
          "Return eligibility is configured by marketplace policy and category-specific operational rules. Not every item is automatically returnable.",
        ],
      },
      {
        heading: "Default rules",
        body: [
          "A default return window may be configured by policy, but category-specific exceptions, seller-specific rules, and legal restrictions may override or limit returns.",
          "Examples include non-returnable goods, damaged products, wrong products, authenticity disputes, and vintage or collectible categories that may have limited return options.",
        ],
      },
      {
        heading: "Seller and category rules",
        body: [
          "Return eligibility may vary based on category, product condition, disclosure completeness, seller policy, and operational review. Sellers are required to maintain clear return and shipping information where permitted.",
        ],
      },
    ],
  },
  {
    slug: "refunds",
    type: "refunds",
    title: "Refunds Policy",
    version: "0.1 Draft",
    effectiveDate: "2026-08-14",
    lastUpdated: "2026-08-14",
    status: "draft",
    summary: "Draft marketplace refund architecture covering review, restocking, shipping responsibility, and dispute handling.",
    supportRoute: "/support",
    toc: [
      "Refund review",
      "Eligible scenarios",
      "Shipping responsibility",
      "Restocking and categories",
    ],
    sections: [
      {
        heading: "Draft notice",
        body: [
          "DRAFT — Requires business/legal review before production launch.",
          "Refund outcomes are review-based and may depend on order details, product condition, dispute findings, and applicable seller policies.",
        ],
      },
      {
        heading: "Operational framework",
        body: [
          "Refund and reimbursement decisions may involve the marketplace, seller, support, or compliance processes. The platform may review cases involving damaged goods, mis-ships, not-as-described products, and authenticity concerns.",
        ],
      },
      {
        heading: "Limitations",
        body: [
          "Refund rights are not universal. Some categories may be non-returnable, some orders may have restocking fee placeholders, and some disputes may require additional substantiation before a refund is approved.",
        ],
      },
    ],
  },
  {
    slug: "shipping",
    type: "shipping",
    title: "Shipping Policy",
    version: "0.1 Draft",
    effectiveDate: "2026-08-14",
    lastUpdated: "2026-08-14",
    status: "draft",
    summary: "Draft shipping policy with service expectations, tracking duties, and delivery guarantee safety language.",
    supportRoute: "/support",
    toc: [
      "Seller responsibilities",
      "Tracking",
      "Delivery guarantee",
      "Exceptions",
    ],
    sections: [
      {
        heading: "Draft notice",
        body: [
          "DRAFT — Requires business/legal review before production launch.",
          "Delivery guarantee claims require a valid, operational guarantee system with qualifying products or orders only. Estimated delivery dates should be used unless the guarantee qualifies.",
        ],
      },
      {
        heading: "Shipping responsibilities",
        body: [
          "Sellers are responsible for fulfilling orders according to marketplace rules, shipping settings, tracking requirements, and customer communication standards. This includes prompt shipping, proper packaging, and accurate tracking details.",
        ],
      },
      {
        heading: "Delivery guarantee safety",
        body: [
          "The marketplace must not globally advertise a blanket guarantee such as 'Delivered in 5 days guaranteed' unless a product or order qualifies under the actual delivery guarantee system. Qualifying orders may show delivery guarantee eligibility and scheduled protection details; otherwise estimated delivery only is appropriate.",
        ],
      },
    ],
  },
  {
    slug: "authenticity",
    type: "authenticity",
    title: "Authenticity Policy",
    version: "0.1 Draft",
    effectiveDate: "2026-08-14",
    lastUpdated: "2026-08-14",
    status: "draft",
    summary: "Draft authenticity standards for fine jewelry, luxury goods, handbags, vintage items, and collectibles.",
    supportRoute: "/support",
    toc: [
      "Core authenticity rules",
      "Jewelry and diamonds",
      "Handbags and watches",
      "Vintage and collectibles",
    ],
    sections: [
      {
        heading: "Draft notice",
        body: [
          "DRAFT — Requires business/legal review before production launch.",
          "Everything Must Go requires truthful disclosure and authenticity standards for luxury, fine jewelry, watches, handbags, collectibles, and vintage goods.",
        ],
      },
      {
        heading: "Core obligations",
        body: [
          "Listings must not represent counterfeit goods as authentic, fake designer goods as genuine, or misleading materials as premium metals or natural stones. Platinum, gold, diamond, watch, and handbag listings must disclose relevant details in accordance with category rules.",
        ],
      },
      {
        heading: "Jewelry and gemstone rules",
        body: [
          "Fine jewelry listings should include metal type, karat value, weight, gemstone details, natural or lab-grown status, carat weight, certification lab, certification number, condition, country of origin, and authenticity declaration where applicable. Listings missing required high-value disclosures may go into review.",
        ],
      },
      {
        heading: "Luxury handbags and collectibles",
        body: [
          "Designer handbag listings should provide brand, model, materials, condition, serial or date code if applicable, country of manufacture, included accessories, and authentication status. Vintage or collectible goods subject to authenticity concerns may be further reviewed before approval.",
        ],
      },
    ],
  },
  {
    slug: "prohibited-items",
    type: "prohibited_items",
    title: "Prohibited & Restricted Items",
    version: "0.1 Draft",
    effectiveDate: "2026-08-14",
    lastUpdated: "2026-08-14",
    status: "draft",
    summary: "Draft restricted product rules covering counterfeit, dangerous goods, illegal products, and configurable marketplace restrictions.",
    supportRoute: "/support",
    toc: [
      "Counterfeit and stolen goods",
      "Dangerous and restricted goods",
      "Legal and compliance monitoring",
    ],
    sections: [
      {
        heading: "Draft notice",
        body: [
          "DRAFT — Requires business/legal review before production launch.",
          "The marketplace must maintain a configurable restricted goods framework. Product rules may change over time with legal, operational, and product risk review.",
        ],
      },
      {
        heading: "Prohibited categories",
        body: [
          "Counterfeit goods, stolen goods, illegal products, recalled products, dangerous goods, restricted weapons, illegal drugs, unauthorized prescription products, fraudulent products, restricted wildlife products, and sanctioned trade goods are prohibited or constrained according to applicable business policies.",
        ],
      },
      {
        heading: "Configurable compliance",
        body: [
          "The marketplace should maintain rules that can be updated as business or legal requirements change. This draft is not intended to permanently encode all jurisdictions or laws as if they were immutable.",
        ],
      },
    ],
  },
  {
    slug: "acceptable-use",
    type: "acceptable_use",
    title: "Acceptable Use Policy",
    version: "0.1 Draft",
    effectiveDate: "2026-08-14",
    lastUpdated: "2026-08-14",
    status: "draft",
    summary: "Draft acceptable use rules covering account behavior, buyer/seller conduct, IP, and moderation standards.",
    supportRoute: "/support",
    toc: [
      "Account behavior",
      "Marketplace conduct",
      "IP and reporting",
    ],
    sections: [
      {
        heading: "Draft notice",
        body: [
          "DRAFT — Requires business/legal review before production launch.",
          "This acceptable use policy sets out core rules for account activity, communications, and marketplace integrity and should be reviewed before production launch.",
        ],
      },
      {
        heading: "Prohibited conduct",
        body: [
          "Users and sellers may not participate in fraud, fake reviews, off-platform sales, shipping abuse, misrepresentation, counterfeit activity, unauthorized brand claims, or harassment. Abuse of support channels, review systems, or messaging may lead to restrictions.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    type: "cookies",
    title: "Cookie Policy",
    version: "0.1 Draft",
    effectiveDate: "2026-08-14",
    lastUpdated: "2026-08-14",
    status: "draft",
    summary: "Draft cookie and consent framework for necessary, preferences, analytics, and marketing cookies.",
    supportRoute: "/cookie-settings",
    toc: [
      "Necessary cookies",
      "Preferences and analytics",
      "Marketing",
    ],
    sections: [
      {
        heading: "Draft notice",
        body: [
          "DRAFT — Requires business/legal review before production launch.",
          "This cookie policy establishes the consent categories and management approach for site functionality, analytics, and marketing. Consent records should be created only through actual user choice.",
        ],
      },
      {
        heading: "Consent categories",
        body: [
          "The marketplace may use necessary cookies for core functionality and security. Preferences cookies may support saved choices, analytics cookies may help understand performance, and marketing cookies may be used only when consent is collected appropriately.",
        ],
      },
    ],
  },
];

export function getLegalPolicy(slug: string): LegalPolicy | undefined {
  return legalPolicies.find((policy) => policy.slug === slug);
}

export function getLegalPolicySlugs(): string[] {
  return legalPolicies.map((policy) => policy.slug);
}
