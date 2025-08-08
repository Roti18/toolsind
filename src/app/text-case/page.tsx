import TextCaseConverter from "@/components/TextCaseConverter";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === "/text-case");

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function TextCasePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 mt-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
          {/* Card */}
          <div className="relative overflow-hidden group rounded-2xl p-6 border border-zinc-800 bg-zinc-900/60 backdrop-blur-md shadow-lg">
            {/* Hover Glow */}
            <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
              <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-15 blur-2xl animate-pulse" />
            </div>
            {/* Komponen Converter */}
            <TextCaseConverter />
          </div>
        </div>
      </div>
    </main>
  );
}
