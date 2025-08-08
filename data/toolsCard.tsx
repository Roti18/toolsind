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
  icon: string;
  href: string;
}

const namaWeb = "ToolsInd";

const toolsCard = [
  {
    href: "/tools/ai-code-generator",
    title: "AI Code Generator",
    titleIco: namaWeb,
    description: "Buat kode instan pakai AI IBM-GRANITE.",
    icon: Code,
  },
  {
    href: "/tools/qr-code-generator",
    title: "QR Code Generator",
    titleIco: namaWeb,
    description: "Buat dan scan QR code cepat.",
    icon: QrCode,
  },
  {
    href: "/tools/convert",
    title: "File Converter",
    titleIco: namaWeb,
    description: "Ubah file ke format lain dengan mudah.",
    icon: FileBadge,
  },
  {
    href: "/",
    title: "Text Case Converter",
    titleIco: namaWeb,
    description: "Ubah teks ke UPPERCASE, lowercase, dll.",
    icon: Text,
  },
  {
    href: "/",
    title: "Password Generator",
    titleIco: namaWeb,
    description: "Buat password aman & acak.",
    icon: RotateCcwKey,
  },
  {
    href: "/",
    title: "Color Tools",
    titleIco: namaWeb,
    description: "Pilih warna & salin kodenya.",
    icon: Palette,
  },
  {
    href: "/",
    title: "Image Compressor",
    titleIco: namaWeb,
    description: "Kompres ukuran gambar instan.",
    icon: ImageDown,
  },
  {
    href: "/",
    title: "Unit Converter",
    titleIco: namaWeb,
    description: "Konversi satuan panjang, suhu, berat, dll.",
    icon: Ruler,
  },
  {
    href: "/",
    title: "Markdown to HTML Converter",
    titleIco: namaWeb,
    description: "Ubah Markdown jadi HTML langsung.",
    icon: FileCode,
  },
  {
    href: "/",
    title: "Text Diff Checker",
    titleIco: namaWeb,
    description: "Bandingkan dua teks dengan mudah.",
    icon: GitCompare,
  },
  {
    href: "/",
    title: "Fake Data Generator",
    titleIco: namaWeb,
    description: "Hasilkan nama, email, dan data palsu.",
    icon: Database,
  },
  {
    href: "/",
    title: "JSON Formatter & Validator",
    titleIco: namaWeb,
    description: "Rapi dan validasi JSON instan.",
    icon: FileJson,
  },
  {
    href: "/",
    title: "Unix Timestamp Converter",
    titleIco: namaWeb,
    description: "Ubah timestamp ke waktu lokal.",
    icon: CalendarClock,
  },
  {
    href: "/",
    title: "Text Truncator / Limiter",
    titleIco: namaWeb,
    description: "Potong teks hingga N karakter.",
    icon: ScanLine,
  },
  {
    href: "/",
    title: "Lorem Ipsum Generator",
    titleIco: namaWeb,
    description: "Buat teks dummy cepat & praktis.",
    icon: Type,
  },
  {
    href: "/",
    title: "Currency Converter (Static)",
    titleIco: namaWeb,
    description: "Konversi mata uang dengan rate statis.",
    icon: DollarSign,
  },
];

export default toolsCard;
