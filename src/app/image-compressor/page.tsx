import ImageCompressor from "./ImageCompressor";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === "/image-compressor");

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function HomePage() {
  return <ImageCompressor />;
}
