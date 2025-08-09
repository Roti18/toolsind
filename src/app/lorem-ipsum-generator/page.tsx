import LoremIpsumGenerator from "@/components/LoremIpsumGenerator";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === "/lorem-ipsum-generator");

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function LoremIpsumPage() {
  return <LoremIpsumGenerator />;
}
