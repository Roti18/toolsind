import QRCodePageClient from "../../../components/QRCodePageClient";

export const metadata = {
  title: "QR GENERATOR",
  icons: {
    icon: "/file.svg",
  },
};

export default function Page() {
  return <QRCodePageClient />;
}
