import UnixTimestampConverter from "@/components/UnixTimeStepConverter";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find(
  (tool) => tool.href === `/unix-timestamp-converter`
);

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function UnixTimeStepPage() {
  return <UnixTimestampConverter />;
}
