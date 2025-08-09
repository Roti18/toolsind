import Link from "next/link";
import { Github, Instagram, Linkedin } from "lucide-react";

const medsos = {
  github: "https://github.com/Roti18",
  instagram: "https://instagram.com/roti.co.id",
  linkedin: "https://linkedin.com/in/moch-zamroni-fahreza",
};

const platform = {
  ibm: "https://skillsbuild.org/",
  hacktiv8: "https://hacktiv8.com",
};

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800/90 text-xs sm:text-sm text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 lg:px-24 xl:px-10 2xl:px-0 2xl:py-6 xl:py-6 py-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        <div>
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
            IBM SkillsBuild
          </Link>
          .
        </div>
        <div className="flex justify-center md:justify-end gap-4">
          <Link
            href={medsos.github}
            target="_blank"
            className="text-zinc-400 hover:text-red-500 transition-colors duration-300"
          >
            <Github className="w-4 h-4 sm:w-6 sm:h-6" />
          </Link>
          <Link
            href={medsos.instagram}
            target="_blank"
            className="text-zinc-400 hover:text-red-500 transition-colors duration-300"
          >
            <Instagram className="w-4 h-4 sm:w-6 sm:h-6" />
          </Link>
          <Link
            href={medsos.linkedin}
            target="_blank"
            className="text-zinc-400 hover:text-red-500 transition-colors duration-300"
          >
            <Linkedin className="w-4 h-4 sm:w-6 sm:h-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
