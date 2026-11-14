import type { Metadata } from "next";
import { AstraVideoCollection } from "@/components/AstraVideoCollection";

export const metadata: Metadata = {
  title: "Real-life Videos Astra | Year 8 Science Lab",
  description: "Teacher–student science video lessons with props, whiteboard explanations and questions.",
};

export default function RealLifeVideosAstraPage() {
  return <AstraVideoCollection />;
}
