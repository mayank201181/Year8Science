import { notFound } from "next/navigation";
import { getTopic, topicIds } from "@/lib/topics";
import { TopicView } from "@/components/TopicView";

export function generateStaticParams() {
  return topicIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = getTopic(id);
  return { title: topic ? `${topic.title} · Year 8 Science` : "Topic" };
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = getTopic(id);
  if (!topic) notFound();
  return <TopicView topic={topic} />;
}
