import FileUpload from "@/components/FileUpload";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === "/convert");

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function ConverterPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <FileUpload />
      </div>
    </div>
  );
}
