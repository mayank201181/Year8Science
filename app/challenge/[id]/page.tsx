import { notFound } from "next/navigation";
import { getTopic, topicIds } from "@/lib/topics";
import { ChallengeRunner } from "@/components/ChallengeRunner";

export function generateStaticParams() {
  return topicIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = getTopic(id);
  return { title: topic ? `${topic.title} Challenge` : "Challenge" };
}

export default async function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = getTopic(id);
  if (!topic) notFound();
  return <ChallengeRunner topic={topic} />;
}
