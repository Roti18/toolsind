import FakeDataGenerator from "@/components/FakeData";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === "/fake-data");

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function FakeDataPage() {
  return <FakeDataGenerator />;
}
