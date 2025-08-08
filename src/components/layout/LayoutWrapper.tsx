"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Header from "./Header";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const isHome = pathname === "/";

  return (
    <>
      <Header {...(isHome ? { searchQuery, setSearchQuery } : {})} />
      <div>{children}</div>
    </>
  );
}
