import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | MediCare HIS",
    default: "Sistem Informasi Rumah Sakit MediCare",
  },
  description:
    "Sistem Informasi Rumah Sakit yang modern dan komprehensif untuk manajemen kesehatan yang efisien.",
  keywords: [
    "Hospital",
    "Management",
    "System",
    "Healthcare",
    "MediCare",
    "Medical Records",
  ],
  authors: [{ name: "MediCare Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#0E9AA7" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakartaSans.variable} font-jakarta-sans ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
