"use client";
import React from "react";
import toolsCard from "../../data/toolsCard";

interface ToolsListProps {
  searchQuery: string;
}

const ToolsList: React.FC<ToolsListProps> = ({ searchQuery }) => {
  const filteredTools = toolsCard.filter((tool) =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTools.map((tool) => (
        <a
          key={tool.title}
          href={tool.href}
          className="group bg-zinc-900 border border-zinc-800 p-5 rounded-2xl transition-all hover:border-red-500 hover:shadow-lg hover:shadow-red-500/10"
        >
          <div className="flex items-center gap-4">
            <tool.icon className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
            <div>
              <h2 className="text-white font-semibold text-lg group-hover:text-red-400 transition-colors">
                {tool.title}
              </h2>
              <p className="text-sm text-zinc-400">{tool.description}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default ToolsList;
