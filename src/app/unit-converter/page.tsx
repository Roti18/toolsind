import UnitConverter from "@/components/UnitConverter";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === `/unit-converter`);

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function Home() {
  return <UnitConverter />;
}
