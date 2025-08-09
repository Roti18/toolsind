import MarkdownConverter from "./MarkdownConverter";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === "/markdown-html-converter");

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function MardownToHTML() {
  return (
    <main>
      <MarkdownConverter />
    </main>
  );
}
