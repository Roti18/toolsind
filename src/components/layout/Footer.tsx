import Link from "next/link";
import { Github, Instagram, Linkedin } from "lucide-react";

const medsos = {
  github: "https://github.com/Roti18",
  instagram: "https://instagram.com/roti.co.id",
  linkedin: "https://linkedin.com/in/moch-zamroni-fahreza",
};
const platform = {
  ibm: "https://www.ibm.com",
  hacktiv8: "https://hacktiv8.com",
};

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800/90 text-sm text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          © 2025 <span className="text-white font-medium">ToolsInd</span>. All
          rights reserved. | Created for{" "}
          <Link
            href={platform.hacktiv8}
            className="text-red-500 hover:underline transition-colors duration-300"
            target="_blank"
          >
            Hacktiv8
          </Link>{" "}
          x{" "}
          <Link
            href={platform.ibm}
            className="text-red-500 hover:underline transition-colors duration-300"
            target="_blank"
          >
            IBM Capstone Project
          </Link>
          .
        </div>

        <div className="flex gap-6">
          <Link
            href={medsos.github}
            target="_blank"
            className="text-zinc-400 hover:text-red-500 transition-colors duration-300"
          >
            <Github />
          </Link>
          <Link
            href={medsos.instagram}
            target="_blank"
            className="text-zinc-400 hover:text-red-500 transition-colors duration-300"
          >
            <Instagram />
          </Link>
          <Link
            href={medsos.linkedin}
            target="_blank"
            className="text-zinc-400 hover:text-red-500 transition-colors duration-300"
          >
            <Linkedin />
          </Link>
        </div>
      </div>
    </footer>
  );
}
