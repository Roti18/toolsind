import {
  QrCode,
  FileBadge,
  Text,
  RotateCcwKey,
  Palette,
  ImageDown,
  Ruler,
  FileCode,
  GitCompare,
  Database,
  FileJson,
  ScanLine,
  CalendarClock,
  Type,
  DollarSign,
  Code,
} from "lucide-react";

export interface ToolCard {
  id: number;
  title: string;
  description: string;
  webName: string;
  icon: string;
  href: string;
}

const namaWeb = "ToolsInd";

const toolsCard = [
  {
    href: "/ai-code-generator",
    title: "AI Code Generator",
    webName: namaWeb,
    description: "Instantly generate code using IBM-GRANITE AI.",
    icon: Code,
  },
  {
    href: "/qr-code-generator",
    title: "QR Code Generator",
    webName: namaWeb,
    description: "Quickly create and scan QR codes.",
    icon: QrCode,
  },
  {
    href: "/convert",
    title: "File Converter",
    webName: namaWeb,
    description: "Easily convert files to other formats.",
    icon: FileBadge,
  },
  {
    href: "/text-case",
    title: "Text Case Converter",
    webName: namaWeb,
    description: "Convert text to UPPERCASE, lowercase, etc.",
    icon: Text,
  },
  {
    href: "/password-generator",
    title: "Password Generator",
    webName: namaWeb,
    description: "Generate secure & random passwords.",
    icon: RotateCcwKey,
  },
  {
    href: "/color-tools",
    title: "Color Tools",
    webName: namaWeb,
    description: "Pick colors & copy the code.",
    icon: Palette,
  },
  {
    href: "/image-compressor",
    title: "Image Compressor",
    webName: namaWeb,
    description: "Instantly compress image sizes.",
    icon: ImageDown,
  },
  {
    href: "/unit-converter",
    title: "Unit Converter",
    webName: namaWeb,
    description: "Convert length, temperature, weight, etc.",
    icon: Ruler,
  },
  {
    href: "/markdown-html-converter",
    title: "Markdown to HTML Converter",
    webName: namaWeb,
    description: "Convert Markdown to HTML instantly.",
    icon: FileCode,
  },
  {
    href: "/text-diff",
    title: "Text Diff Checker",
    webName: namaWeb,
    description: "Easily compare two pieces of text.",
    icon: GitCompare,
  },
  {
    href: "/fake-data",
    title: "Fake Data Generator",
    webName: namaWeb,
    description: "Generate fake names, emails, and more.",
    icon: Database,
  },
  {
    href: "/json-formatter-validator",
    title: "JSON Formatter & Validator",
    webName: namaWeb,
    description: "Format and validate JSON instantly.",
    icon: FileJson,
  },
  {
    href: "/unix-timestamp-converter",
    title: "Unix Timestamp Converter",
    webName: namaWeb,
    description: "Convert timestamps to local time.",
    icon: CalendarClock,
  },
  {
    href: "/text-truncator-limiter",
    title: "Text Truncator / Limiter",
    webName: namaWeb,
    description: "Trim text to N characters.",
    icon: ScanLine,
  },
  {
    href: "/lorem-ipsum-generator",
    title: "Lorem Ipsum Generator",
    webName: namaWeb,
    description: "Quickly generate dummy placeholder text.",
    icon: Type,
  },
  {
    href: "/currency-converter",
    title: "Currency Converter (Real-time)",
    webName: namaWeb,
    description: "Convert currencies using static rates.",
    icon: DollarSign,
  },
];

export default toolsCard;
