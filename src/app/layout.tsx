import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SideNav } from "./side-nav";
import { InlineScript } from "@ui/inline-script";
import { ToasterProvider } from "@ui/toaster";

const beVietnamSans = Be_Vietnam_Pro({
  variable: "--font-bevietnam-sans",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neumorphism Design System",
  description: "Hệ thống thành phần giao diện Neumorphism (Soft UI) hoàn chỉnh",
};

// Đặt data-theme trước first paint để tránh flash sai theme
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      data-theme="light"
      suppressHydrationWarning
      className={`${beVietnamSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <InlineScript html={themeScript} />
      </head>
      <body className="min-h-full flex flex-col md:flex-row bg-background font-sans text-foreground">
        <SideNav />
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 lg:p-12 overflow-x-hidden">{children}</main>
        <ToasterProvider />
      </body>
    </html>
  );
}
