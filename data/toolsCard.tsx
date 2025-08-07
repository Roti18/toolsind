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

const toolsCard = [
  {
    href: "/tools/ai-code-generator",
    title: "AI Code Generator",
    description: "Buat potongan kode instan dengan bantuan AI IBM-GRANITE",
    icon: Code,
  },
  {
    href: "/tools/qr-code-generator",
    title: "QR Code Generator",
    description: "Buat & scan QR code dengan cepat",
    icon: QrCode,
  },
  {
    href: "/tools/convert",
    title: "File Converter",
    description: "Konversi file ke format yang tepat tanpa ribet",
    icon: FileBadge,
  },
  {
    href: "/",
    title: "Text Case Converter",
    description: "Ubah teks ke UPPERCASE, lowercase, CamelCase, dsb.",
    icon: Text,
  },
  {
    href: "/",
    title: "Password Generator",
    description:
      "Pilih panjang, karakter khusus, dll → hasilkan password aman.",
    icon: RotateCcwKey,
  },
  {
    href: "/",
    title: "Color Tools",
    description: "Pilih warna dan lihat kodenya.",
    icon: Palette,
  },
  {
    href: "/",
    title: "Image Compressor",
    description: "Upload gambar → kompres ukuran file.",
    icon: ImageDown,
  },
  {
    href: "/",
    title: "Unit Converter",
    description: "Misalnya: panjang (cm ⇄ inch), suhu, berat, dll.",
    icon: Ruler,
  },
  {
    href: "/",
    title: "Markdown to HTML Converter",
    description: "Masukkan Markdown → lihat hasil HTML-nya.",
    icon: FileCode,
  },
  {
    href: "/",
    title: "Text Diff Checker",
    description: "Bandingkan dua teks → tampilkan perbedaannya.",
    icon: GitCompare,
  },
  {
    href: "/",
    title: "Fake Data Generator",
    description: "Hasilkan data dummy seperti nama, email, alamat",
    icon: Database,
  },
  {
    href: "/",
    title: "JSON Formatter & Validator",
    description: "Paste JSON → tampilkan versi yang rapi.",
    icon: FileJson,
  },
  {
    href: "/",
    title: "Unix Timestamp Converter",
    description: "Timestamp ⇄ waktu manusia (datetime lokal).",
    icon: CalendarClock,
  },
  {
    href: "/",
    title: "Text Truncator / Limiter",
    description: "Masukkan teks → potong hingga N karakter + tambah ...",
    icon: ScanLine,
  },
  {
    href: "/",
    title: "Lorem Ipsum Generator",
    description: "Hasilkan teks dummy untuk desain/layout.",
    icon: Type,
  },
  {
    href: "/",
    title: "Currency Converter (Static)",
    description: "Konversi mata uang (bisa pakai rate statis dulu).",
    icon: DollarSign,
  },
];

export default toolsCard;
