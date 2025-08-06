import Link from "next/link";
import { Github, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-20 w-full py-4 text-sm text-gray-500 flex justify-between items-center">
      <div>
        © 2025 ToolsInd. All rights reserved. | Created for the{" "}
        <Link
          href="https://hacktiv8.com"
          className="hover:underline"
          target="_blank"
        >
          Hacktiv8
        </Link>{" "}
        x{" "}
        <Link
          href="https://www.ibm.com"
          className="hover:underline"
          target="_blank"
        >
          IBM Capstone Project
        </Link>
        .
      </div>

      <div className="flex gap-6">
        <Link href="https://github.com/username" target="_blank">
          <Github />
        </Link>
        <Link href="https://instagram.com/username" target="_blank">
          <Instagram />
        </Link>
        <Link href="https://linkedin.com/in/username" target="_blank">
          <Linkedin />
        </Link>
      </div>
    </footer>
  );
}
