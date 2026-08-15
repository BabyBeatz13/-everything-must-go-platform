import Link from "next/link";
import { notFound } from "next/navigation";
import PolicyLayout from "@/components/legal/PolicyLayout";
import { getLegalPolicy } from "@/lib/legal";

export default async function LegalPolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = getLegalPolicy(slug);

  if (!policy) {
    notFound();
  }

  return <PolicyLayout policy={policy} />;
}
