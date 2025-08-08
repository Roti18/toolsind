"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Card from "@/components/Card";
import toolsCard from "../../data/toolsCard";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = toolsCard.filter((tool) =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="flex min-h-screen flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-20 w-full max-w-7xl">
          {filteredTools.map((tool, index) => (
            <Card
              key={index}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              icon={tool.icon}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
