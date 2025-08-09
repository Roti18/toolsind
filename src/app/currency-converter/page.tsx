import CurrencyConverter from "@/components/CurrencyConverter";
import toolsCard from "../../../data/toolsCard";

const tool = toolsCard.find((tool) => tool.href === "/currency-converter");

export const metadata = {
  title: `${tool?.webName} | ${tool?.title}`,
};

export default function CurrencyConverterPage() {
  return <CurrencyConverter />;
}
