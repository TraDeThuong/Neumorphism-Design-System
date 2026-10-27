"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@ui/theme-toggle";
import { Menu, X } from "lucide-react";

const sections = [
  {
    title: "Tổng quan",
    items: [{ href: "/", label: "Giới thiệu" }],
  },
  {
    title: "Foundations",
    items: [{ href: "/foundations", label: "Màu sắc & Typography" }],
  },
  {
    title: "Components",
    items: [
      { href: "/components", label: "Danh sách" },
      { href: "/components/typography", label: "Typography" },
      { href: "/components/button", label: "Button" },
      { href: "/components/card", label: "Card" },
      { href: "/stats-card", label: "Stats Card" },
      { href: "/table", label: "Table (Bảng dữ liệu)" },
      { href: "/modal", label: "Modal" },
      { href: "/dialog", label: "Dialog" },
      { href: "/badge", label: "Badge (Huy hiệu)" },
      { href: "/segmented-control", label: "Segmented Control" },
      { href: "/components/toast", label: "Toast" },
      { href: "/components/loader", label: "Loader & Skeleton" },
      { href: "/components/input", label: "Input & Textarea" },
      { href: "/components/selection", label: "Selection Controls" },
      { href: "/components/form", label: "Form (Biểu mẫu)" },
    ],
  },
  {
    title: "Charts",
    items: [{ href: "/charts/barchart", label: "Bar Chart" }],
  },
];

export function SideNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="text-sm font-semibold">Neumorphism</p>
          <p className="text-xs text-muted-foreground">Design System</p>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex flex-col gap-6 p-4">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-1.5 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {section.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        active
                          ? "bg-accent font-medium text-foreground"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4 text-xs text-muted-foreground">
        Neumorphism Design System
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top App Bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border/40 bg-card/95 backdrop-blur-md px-4 py-3 shadow-[0_2px_8px_var(--shadow-dark)]">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-xl bg-background border border-border/40 text-foreground shadow-[2px_2px_4px_var(--shadow-dark),-2px_-2px_4px_var(--shadow-light)] active:shadow-[inset_1.5px_1.5px_3px_var(--shadow-dark)]"
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu navigation"}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div>
            <p className="text-xs font-bold leading-none text-foreground">Neumorphism</p>
            <p className="text-[10px] text-muted-foreground">Design System</p>
          </div>
        </div>

        <ThemeToggle />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="h-full w-72 max-w-[80vw] overflow-y-auto bg-card shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <NavContent />
          </aside>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:block sticky top-0 h-screen w-64 shrink-0 overflow-y-auto border-r border-border bg-card">
        <NavContent />
      </aside>
    </>
  );
}

export default SideNav;
