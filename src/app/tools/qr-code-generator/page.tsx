import QRCodePageClient from "../../../components/QRCodePageClient";
import toolsCard from "../../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === "/tools/convert");

export const metadata = {
  title: tool?.title,
};

export default function Page() {
  return <QRCodePageClient />;
}
