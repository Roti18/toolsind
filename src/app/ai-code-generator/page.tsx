import AiCode from "@/components/AiCode";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === "/ai-code-generator");

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function AICodePage() {
  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 mt-20">
      <AiCode />
    </div>
  );
}
