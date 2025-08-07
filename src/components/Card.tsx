import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface CardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export default function Card({
  title,
  description,
  href,
  icon: Icon,
}: CardProps) {
  return (
    <Link href={href} rel="noopener noreferrer">
      <div className="w-70 h-[260px] p-6 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/60 to-zinc-800/80 backdrop-blur-xl overflow-hidden shadow-lg group hover:shadow-red-500/40 transition-all duration-500 hover:scale-[1.03] hover:border-red-500 flex flex-col justify-between cursor-pointer">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
          <div className="absolute -inset-20 bg-gradient-to-tr from-red-400 via-white to-black opacity-10 blur-2xl animate-pulse" />
        </div>

        {/* Icon and content */}
        <div>
          <Icon
            size={64}
            className="text-red-500 mb-4 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110"
          />
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-200 group-hover:from-white group-hover:to-white transition-all duration-500">
            {title}
          </h3>
          <p className="text-sm text-zinc-400 mt-2 line-clamp-4">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
