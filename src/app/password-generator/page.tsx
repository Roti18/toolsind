import PasswordGenerator from "./PasswordGenerator";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === "/password-generator");

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function PasswordGeneratorPage() {
  return (
    <main className="p-6 ">
      <PasswordGenerator />
    </main>
  );
}
