import ColorToolsClient from "@/components/ColorToolsClient";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === "/color-tools");

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function ColorToolsPage() {
  return <ColorToolsClient />;
}
