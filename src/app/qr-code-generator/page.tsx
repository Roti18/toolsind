import QRCodePageClient from "../../components/QRCodePageClient";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === "/qr-code-generator");

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function Page() {
  return <QRCodePageClient />;
}
