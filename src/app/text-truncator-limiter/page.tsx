import TextTruncator from "@/components/TextTruncator";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === `/text-truncator-limiter`);

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function TextTruncatorPage() {
  return <TextTruncator />;
}
