import TextDiffChecker from "@/components/TextDiffChecker";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === "/text-diff");

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function TextDiffPage() {
  return (
    <main className="min-h-screen bg-gray-950 p-6">
      <TextDiffChecker />
    </main>
  );
}
