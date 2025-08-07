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
      <main className="flex min-h-screen flex-col items-center p-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
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
