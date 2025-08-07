"use client";
import { usePathname } from "next/navigation";
import toolsCard from "../../../data/toolsCard";

const HeaderRightText = () => {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const matchedTool = toolsCard.find((tool) => pathname.includes(tool.href));
  if (!matchedTool) return null;

  return (
    <div className="text-right">
      <span className="font-bold text-2xl text-red-500 group-hover:text-white transition-colors duration-300">
        {matchedTool.title}
      </span>
      <p className="text-sm text-zinc-400">{matchedTool.description}</p>
    </div>
  );
};

export default HeaderRightText;
