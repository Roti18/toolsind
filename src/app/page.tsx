"use client";
import Header from "@/components/Header";
import Card from "@/components/Card";
import toolsCard from "../../data/toolsCard";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {toolsCard.map((tool, index) => (
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
      <div className="border-t-2 border-t-neutral-700 p-5 px-20">
        <Footer />
      </div>
    </div>
  );
}
