export type AmazonAffiliateConfig = {
  associateTag: string;
  accessKey: string;
  secretKey: string;
  region: string;
};

export function getAmazonAffiliateConfig(): AmazonAffiliateConfig {
  return {
    associateTag: process.env.AMAZON_ASSOCIATE_TAG ?? "",
    accessKey: process.env.AMAZON_ACCESS_KEY ?? "",
    secretKey: process.env.AMAZON_SECRET_KEY ?? "",
    region: process.env.AMAZON_REGION ?? "us-east-1",
  };
}

export function isAmazonAffiliateConfigured(): boolean {
  const config = getAmazonAffiliateConfig();

  return Boolean(
    config.associateTag && config.accessKey && config.secretKey && config.region,
  );
}

export function buildAmazonPartnerUrl(productUrl: string): string {
  const config = getAmazonAffiliateConfig();

  if (!config.associateTag) {
    return productUrl;
  }

  const url = new URL(productUrl);
  url.searchParams.set("tag", config.associateTag);

  return url.toString();
}

export function getAffiliateServiceSummary() {
  return {
    configured: isAmazonAffiliateConfigured(),
    region: getAmazonAffiliateConfig().region,
    associateTag: getAmazonAffiliateConfig().associateTag,
  };
}
