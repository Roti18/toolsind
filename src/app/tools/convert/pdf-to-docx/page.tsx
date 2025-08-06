import FileUpload from "@/components/FileUpload";

export const metadata = {
  title: "File Converter",
  icons: {
    icon: "/file.svg",
  },
};
export default function ConverterPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-red-500 mb-10 text-center">
          PDF ke DOCX Converter
        </h1>
        <FileUpload />
      </div>
    </div>
  );
}
