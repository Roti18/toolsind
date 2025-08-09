// src/app/json-tools/page.tsx
import JsonFormatterValidator from "@/components/JsonFormatterValidator";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find(
  (tool) => tool.href === "/json-formatter-validator"
);

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function JsonToolsPage() {
  return (
    <main className="p-6">
      <JsonFormatterValidator />
    </main>
  );
}
