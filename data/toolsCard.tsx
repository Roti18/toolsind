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
    description: "Buat kode instan pakai AI IBM-GRANITE.",
    icon: Code,
  },
  {
    href: "/qr-code-generator",
    title: "QR Code Generator",
    webName: namaWeb,
    description: "Buat dan scan QR code cepat.",
    icon: QrCode,
  },
  {
    href: "/convert",
    title: "File Converter",
    webName: namaWeb,
    description: "Ubah file ke format lain dengan mudah.",
    icon: FileBadge,
  },
  {
    href: "/text-case",
    title: "Text Case Converter",
    webName: namaWeb,
    description: "Ubah teks ke UPPERCASE, lowercase, dll.",
    icon: Text,
  },
  {
    href: "/password-generator",
    title: "Password Generator",
    webName: namaWeb,
    description: "Buat password aman & acak.",
    icon: RotateCcwKey,
  },
  {
    href: "/color-tools",
    title: "Color Tools",
    webName: namaWeb,
    description: "Pilih warna & salin kodenya.",
    icon: Palette,
  },
  {
    href: "/image-compressor",
    title: "Image Compressor",
    webName: namaWeb,
    description: "Kompres ukuran gambar instan.",
    icon: ImageDown,
  },
  {
    href: "/unit-converter",
    title: "Unit Converter",
    webName: namaWeb,
    description: "Konversi satuan panjang, suhu, berat, dll.",
    icon: Ruler,
  },
  {
    href: "/",
    title: "Markdown to HTML Converter",
    webName: namaWeb,
    description: "Ubah Markdown jadi HTML langsung.",
    icon: FileCode,
  },
  {
    href: "/",
    title: "Text Diff Checker",
    webName: namaWeb,
    description: "Bandingkan dua teks dengan mudah.",
    icon: GitCompare,
  },
  {
    href: "/",
    title: "Fake Data Generator",
    webName: namaWeb,
    description: "Hasilkan nama, email, dan data palsu.",
    icon: Database,
  },
  {
    href: "/",
    title: "JSON Formatter & Validator",
    webName: namaWeb,
    description: "Rapi dan validasi JSON instan.",
    icon: FileJson,
  },
  {
    href: "/",
    title: "Unix Timestamp Converter",
    webName: namaWeb,
    description: "Ubah timestamp ke waktu lokal.",
    icon: CalendarClock,
  },
  {
    href: "/",
    title: "Text Truncator / Limiter",
    webName: namaWeb,
    description: "Potong teks hingga N karakter.",
    icon: ScanLine,
  },
  {
    href: "/",
    title: "Lorem Ipsum Generator",
    webName: namaWeb,
    description: "Buat teks dummy cepat & praktis.",
    icon: Type,
  },
  {
    href: "/",
    title: "Currency Converter (Static)",
    webName: namaWeb,
    description: "Konversi mata uang dengan rate statis.",
    icon: DollarSign,
  },
];

export default toolsCard;
