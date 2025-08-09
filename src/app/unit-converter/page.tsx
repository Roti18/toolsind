import UnitConverter from "./UnitConverter";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === `/unit-converter`);

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function UnitConverterPage() {
  return <UnitConverter />;
}
