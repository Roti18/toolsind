"use client";
import React, { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import HeaderRightText from "./HeaderRightText";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div
          className={`flex items-center ${
            isMobile ? "justify-center" : "justify-between"
          }`}
        >
          {/* KIRI */}
          {(!isMobile || isHome) && (
            <>
              {isHome && !isMobile && (
                <Link href="/">
                  <div className="flex items-center space-x-4 group h-16 cursor-pointer">
                    <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:bg-gradient-to-br group-hover:from-red-600 group-hover:to-black group-hover:border-red-500 group-hover:shadow-red-500/40 group-hover:shadow-md transition-all duration-300 ease-in-out">
                      <Wrench
                        size={28}
                        className="text-red-500 group-hover:text-white group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-red-500">
                        ToolsInd
                      </h1>
                      <p className="text-sm text-zinc-400">
                        A Curated Collection of Smart & Modern Developer Tools
                      </p>
                    </div>
                  </div>
                </Link>
              )}

              {!isHome && !isMobile && (
                <Link href="/">
                  <div className="flex items-center space-x-4 group h-16 cursor-pointer">
                    <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:bg-gradient-to-br group-hover:from-red-600 group-hover:to-black group-hover:border-red-500 group-hover:shadow-red-500/40 group-hover:shadow-md transition-all duration-300 ease-in-out">
                      <Wrench
                        size={28}
                        className="text-red-500 group-hover:text-white group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-red-500 group-hover:text-white transition-colors duration-300">
                        ToolsInd
                      </h1>
                      <p className="text-sm text-zinc-400">
                        A Curated Collection of Smart & Modern Developer Tools
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </>
          )}

          {/* TENGAH */}
          {isHome && isMobile && (
            <div className="mx-auto text-center">
              <h1 className="text-2xl font-bold text-red-500">ToolsInd</h1>
              <p className="text-xs text-zinc-400 mt-1">
                A Curated Collection of Smart & Modern Developer Tools
              </p>
            </div>
          )}

          {/* KANAN */}
          {(!isHome || !isMobile) && (
            <>
              {!isMobile && searchQuery !== undefined ? (
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-red-400 transition-colors duration-300">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.15 6.15z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search apps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery?.(e.target.value)}
                    className="w-80 pl-10 pr-4 py-2.5 cursor-pointer rounded-xl bg-zinc-900 text-white placeholder-zinc-500 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:bg-zinc-800 focus:shadow-red-500/10 focus:shadow-lg transition-all duration-300"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery?.("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-400 transition-colors duration-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <HeaderRightText />
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
