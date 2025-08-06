import Link from "next/link";
import { LucideIcon } from "lucide-react";

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
    <Link href={href}>
      <div className="w-70 p-5 h-70 flex flex-col glass items-center justify-center text-center rounded-xl border border-neutral-700 ">
        <Icon size={80} className="mb-4 text-blue-600" />
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
          {description}
        </p>
      </div>
    </Link>
  );
}
