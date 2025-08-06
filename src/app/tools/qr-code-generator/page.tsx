import QRCodePageClient from "./QRCodePageClient";

export const metadata = {
  title: "QR GENERATOR",
  description: "ini deskipsi",
  icons: {
    icon: "/file.svg",
  },
};

export default function Page() {
  return <QRCodePageClient />;
}
