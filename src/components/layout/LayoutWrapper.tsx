"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import toolsCard from "../../../data/toolsCard";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ambil semua href dari toolsCard
  const validPaths = toolsCard.map((tool) => tool.href);
  const isValidPath = pathname === "/" || validPaths.includes(pathname);

  return (
    <>
      {isValidPath && <Header />}
      <div>{children}</div>
      {isValidPath && <Footer />}
    </>
  );
}
