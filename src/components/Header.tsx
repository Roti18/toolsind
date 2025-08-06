"use client";
import React, { useState } from "react";
import Image from "next/image";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="fixed glass top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-foreground/10">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-glass-500/60 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-5 mt-5">
          <div className="flex items-center space-x-3 group h-12">
            <div className="w-16 h-16 bg-glass-500/10 rounded-xl flex items-center justify-center border border-neutral-700 group-hover:bg-glass-500/15 group-hover:border-glass-500/30 transition-all duration-300">
              <Image
                src="/globe.svg"
                alt="ToolsInd"
                width={40}
                height={40}
                className="w-10 h-10 group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-foreground group-hover:text-glass-500 transition-colors duration-300">
                ToolsInd
              </h1>
              <p className="text-sm text-foreground/60">App Collection</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg
                className="w-4 h-4 text-foreground/50 group-hover:text-glass-500 transition-colors duration-300"
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground placeholder-foreground/50 focus:outline-none focus:border-glass-500/50 focus:bg-foreground/10 focus:shadow-lg focus:shadow-glass-500/10 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-glass-500 transition-colors duration-300"
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
        </div>
      </div>
    </header>
  );
};

export default Header;
