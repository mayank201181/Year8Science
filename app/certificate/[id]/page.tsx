import { notFound } from "next/navigation";
import { getTopic, topicIds } from "@/lib/topics";
import { Certificate } from "@/components/Certificate";

export function generateStaticParams() {
  return topicIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = getTopic(id);
  return { title: topic ? `${topic.title} Certificate` : "Certificate" };
}

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = getTopic(id);
  if (!topic) notFound();
  return <Certificate topic={topic} />;
}
