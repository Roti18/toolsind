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
  const is404Page = pathname === "/404"; // Tambahkan ini

  if (is404Page) {
    return <>{children}</>; // Hilangkan header jika 404
  }

  return (
    <>
      <Header {...(isHome ? { searchQuery, setSearchQuery } : {})} />
      <div>{children}</div>
    </>
  );
}
