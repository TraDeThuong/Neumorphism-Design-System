"use client";

import * as React from "react";
import Link from "next/link";
import {
  StatsCard,
  RaisedInsetStatsCard,
  InsetRaisedStatsCard,
  SoftExtrudedStatsCard,
  DeepElevationStatsCard,
  BentoConsoleStats,
  type StatsCardVariant,
  type StatsCardTone,
  type StatsSurfaceEffect,
} from "@ui/stats-cards";
import { SculptedModal } from "@ui/modal";
import { Button } from "@ui/button";
import { toast } from "@ui/toaster";
import {
  Users,
  HardHat,
  ShieldAlert,
  ShieldCheck,
  Camera,
  AlertTriangle,
  Activity,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Layers,
  Sliders,
  ChevronRight,
  Eye,
  UserCheck,
  UserX,
  Gauge,
  Boxes,
} from "lucide-react";

type CardMode = "raised-inset" | "inset-raised";

const ICON_OPTIONS = [
  { id: "shield-check", label: "Bảo hộ (ShieldCheck)", icon: ShieldCheck },
  { id: "users", label: "Công nhân (Users)", icon: Users },
  { id: "user-check", label: "Hoạt động (UserCheck)", icon: UserCheck },
  { id: "hardhat", label: "Mũ bảo hộ (HardHat)", icon: HardHat },
  { id: "alert-triangle", label: "Cảnh báo (AlertTriangle)", icon: AlertTriangle },
  { id: "shield-alert", label: "Vi phạm (ShieldAlert)", icon: ShieldAlert },
  { id: "camera", label: "Camera AI (Camera)", icon: Camera },
  { id: "activity", label: "Hoạt động (Activity)", icon: Activity },
];

const TONE_OPTIONS: Array<{ id: StatsCardTone; label: string; color: string }> = [
  { id: "default", label: "Default", color: "var(--foreground)" },
  { id: "primary", label: "Primary", color: "var(--primary)" },
  { id: "success", label: "Success", color: "var(--success)" },
  { id: "warning", label: "Warning", color: "var(--warning)" },
  { id: "danger", label: "Danger", color: "var(--danger)" },
  { id: "info", label: "Info", color: "var(--info)" },
];

const VARIANT_OPTIONS: Array<{
  id: StatsCardVariant;
  label: string;
  badge: string;
  description: string;
}> = [
  {
    id: "classic",
    label: "Dòng 1: Cổ điển (Classic)",
    badge: "Dual-Shadow",
    description: "Raised-Inset / Inset-Raised đối xứng",
  },
  {
    id: "soft-extruded",
    label: "Dòng 2: Nổi Vừa (Soft Extruded)",
    badge: "3D Soft UI",
    description: "Độ nổi 6px/14px, gờ sáng mép, khay thông số chìm",
  },
  {
    id: "deep-elevation",
    label: "Dòng 3: Siêu Nổi (Deep Elevation)",
    badge: "High-Relief 3D",
    description: "Độ nổi 10px/22px, chữ nổi <Typography variant='embossed'>",
  },
  {
    id: "bento-console",
    label: "Dòng 4: Bento Console Bất Đối Xứng",
    badge: "Special Cockpit",
    description: "Kiến trúc đặc biệt 3 khối chuyên dụng: 5 cột + 4 cột + 3 cột",
  },
];

const SIZE_OPTIONS = ["sm", "md", "lg", "xl"] as const;
const DEPTH_OPTIONS = ["soft", "medium", "deep"] as const;
const BORDER_OPTIONS = ["none", "subtle", "accent", "glow"] as const;
const SURFACE_EFFECT_OPTIONS: StatsSurfaceEffect[] = [
  "raised",
  "inset",
  "raised-inset",
  "inset-raised",
  "flat",
];

export default function StatsCardPage() {
  // Playground state
  const [selectedVariant, setSelectedVariant] = React.useState<StatsCardVariant>("bento-console");
  const [mode, setMode] = React.useState<CardMode>("raised-inset");
  const [tone, setTone] = React.useState<StatsCardTone>("primary");
  const [size, setSize] = React.useState<"sm" | "md" | "lg" | "xl">("md");
  const [depth, setDepth] = React.useState<"soft" | "medium" | "deep">("medium");
  const [border, setBorder] = React.useState<"none" | "subtle" | "accent" | "glow">("subtle");
  const [iconEffect, setIconEffect] = React.useState<StatsSurfaceEffect>("raised-inset");
  const [contentEffect, setContentEffect] = React.useState<StatsSurfaceEffect>("inset");
  const [selectedIconId, setSelectedIconId] = React.useState<string>("shield-check");

  const [title, setTitle] = React.useState("Tỷ lệ tuân thủ PPE");
  const [value, setValue] = React.useState("98.4%");
  const [description, setDescription] = React.useState("Đo lường trên 1,248 công nhân trực ca");
  const [hasDescription, setHasDescription] = React.useState(true);

  const [hasTrend, setHasTrend] = React.useState(true);
  const [trendValue, setTrendValue] = React.useState("+2.4%");
  const [trendLabel, setTrendLabel] = React.useState("so với tuần trước");
  const [trendDirection, setTrendDirection] = React.useState<"up" | "down" | "neutral">("up");
  const [trendPositive, setTrendPositive] = React.useState<boolean>(true);

  const [hasProgress, setHasProgress] = React.useState(true);
  const [progress, setProgress] = React.useState(98);
  const [progressLabel, setProgressLabel] = React.useState("Chỉ tiêu an toàn ca trực");

  const [hasFooter, setHasFooter] = React.useState(false);
  const [footerText, setFooterText] = React.useState("Cập nhật tự động mỗi 15 giây");

  const [hover, setHover] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [isClickable, setIsClickable] = React.useState(true);
  const [activeModal, setActiveModal] = React.useState<string | null>(null);

  const [copied, setCopied] = React.useState(false);

  const CurrentIcon = React.useMemo(() => {
    const found = ICON_OPTIONS.find((item) => item.id === selectedIconId);
    return found ? found.icon : ShieldCheck;
  }, [selectedIconId]);

  const SelectedCardComponent = mode === "raised-inset" ? RaisedInsetStatsCard : InsetRaisedStatsCard;

  const generatedCode = React.useMemo(() => {
    if (selectedVariant === "bento-console") {
      return `<BentoConsoleStats
  scale={{
    title: "Quy mô nhân sự & Trạng thái hoạt động",
    badgeText: "Directory Pulse",
    totalValue: 1248,
    totalLabel: "Tổng nhân sự",
    totalSub: "Tài khoản toàn công ty",
    activeValue: 1180,
    activeLabel: "Đang hoạt động",
    activeSub: "Sẵn sàng đăng nhập",
    activeRate: 95,
  }}
  security={{
    title: "Bảo mật xác thực hai bước",
    badgeText: "TOTP 2FA",
    percent: 85,
    currentValue: 1060,
    totalValue: 1248,
    description: "Tài khoản kích hoạt mã bảo vệ Google Authenticator.",
    statusLabel: "Độ phủ an ninh",
    statusText: "Mức độ: Rất tốt",
  }}
  sentinel={{
    title: "An ninh & Truy cập",
    count: 5,
    label: "Tài khoản bị khóa",
    description: "Nhập sai mật khẩu hoặc bị vô hiệu hóa",
    statusText: "Cần quản trị xử lý",
    isWarning: true,
  }}
  loading={${loading}}
/>`;
    }

    if (selectedVariant === "deep-elevation") {
      const iconName =
        ICON_OPTIONS.find((i) => i.id === selectedIconId)?.label.split(" ")[1].replace("(", "").replace(")", "") ||
        "ShieldCheck";
      return `<DeepElevationStatsCard
  title="${title}"
  value="${value}"
  icon={${iconName}}
  tone="${tone}"
  ${hasProgress ? `progress={${progress}}\n  progressLabel="${progressLabel}"` : ""}${
        hasDescription && description ? `\n  description="${description}"` : ""
      }
  ${loading ? `loading={true}` : ""}
/>`;
    }

    if (selectedVariant === "soft-extruded") {
      const iconName =
        ICON_OPTIONS.find((i) => i.id === selectedIconId)?.label.split(" ")[1].replace("(", "").replace(")", "") ||
        "ShieldCheck";
      return `<SoftExtrudedStatsCard
  title="${title}"
  value="${value}"
  icon={${iconName}}
  tone="${tone}"
  ${hasProgress ? `progress={${progress}}\n  progressLabel="${progressLabel}"` : ""}${
        hasDescription && description ? `\n  description="${description}"` : ""
      }
  ${loading ? `loading={true}` : ""}
/>`;
    }

    // Classic
    const compName = mode === "raised-inset" ? "RaisedInsetStatsCard" : "InsetRaisedStatsCard";
    const iconName =
      ICON_OPTIONS.find((i) => i.id === selectedIconId)?.label.split(" ")[1].replace("(", "").replace(")", "") ||
      "ShieldCheck";

    const lines: string[] = [];
    lines.push(`<${compName}`);
    lines.push(`  title="${title}"`);
    lines.push(`  value="${value}"`);
    lines.push(`  icon={${iconName}}`);
    if (tone !== "default") lines.push(`  tone="${tone}"`);
    if (size !== "md") lines.push(`  size="${size}"`);
    if (depth !== "medium") lines.push(`  depth="${depth}"`);
    if (border !== "subtle") lines.push(`  border="${border}"`);
    if (iconEffect !== "raised-inset") lines.push(`  iconEffect="${iconEffect}"`);
    if (contentEffect !== "inset") lines.push(`  contentEffect="${contentEffect}"`);
    if (hasDescription && description) lines.push(`  description="${description}"`);

    if (hasTrend) {
      lines.push(`  trend={{`);
      lines.push(`    value: "${trendValue}",`);
      if (trendLabel) lines.push(`    label: "${trendLabel}",`);
      lines.push(`    direction: "${trendDirection}",`);
      lines.push(`    positive: ${trendPositive},`);
      lines.push(`  }}`);
    }

    if (hasProgress) {
      lines.push(`  progress={${progress}}`);
      if (progressLabel) lines.push(`  progressLabel="${progressLabel}"`);
    }

    if (hasFooter && footerText) {
      lines.push(`  footer={<span>${footerText}</span>}`);
    }

    if (!hover) lines.push(`  hover={false}`);
    if (loading) lines.push(`  loading={true}`);
    if (isClickable) lines.push(`  onClick={() => openDetailModal()}`);
    lines.push(`/>`);

    return lines.join("\n");
  }, [
    selectedVariant,
    mode,
    selectedIconId,
    title,
    value,
    tone,
    size,
    depth,
    border,
    iconEffect,
    contentEffect,
    hasDescription,
    description,
    hasTrend,
    trendValue,
    trendLabel,
    trendDirection,
    trendPositive,
    hasProgress,
    progress,
    progressLabel,
    hasFooter,
    footerText,
    hover,
    loading,
    isClickable,
  ]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Đã sao chép mã nguồn JSX vào clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = () => {
    setActiveModal("playground");
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-14 pb-24">
      {/* Header */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Link href="/components" className="hover:text-foreground">
            Components
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-primary font-bold">Stats Card</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Stats Card & Bento Console</h1>
            <p className="mt-2 text-base text-muted-foreground leading-relaxed max-w-3xl">
              Thư viện thành phần thống kê KPI & đo lường hỗ trợ đầy đủ 4 phong cách thiết kế Neumorphism:
              từ trường phái <strong className="text-foreground">Cổ điển đối xứng</strong>,{" "}
              <strong className="text-foreground">3D Nổi Vừa</strong>,{" "}
              <strong className="text-foreground">Siêu Nổi Chữ Khắc</strong> đến{" "}
              <strong className="text-foreground">Bento Console Bất Đối Xứng</strong> kiến trúc đặc biệt.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm">
            <Sparkles className="size-3.5 text-accent" />
            Soft UI v2.5 • 4 Kiến trúc
          </span>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 1. VARIANT SELECTOR BANNER */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Chọn 1 trong 4 Kiến Trúc Thiết Kế (Design Variant Selector)
          </span>
          <span className="text-xs font-medium text-primary">Tích hợp sẵn trong stats-cards.tsx</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VARIANT_OPTIONS.map((v) => {
            const isSelected = selectedVariant === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v.id)}
                className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-300 ${
                  isSelected
                    ? "border-primary bg-card shadow-[4px_4px_12px_var(--shadow-dark),-4px_-4px_12px_var(--shadow-light)] ring-2 ring-primary/40"
                    : "border-border bg-background/80 hover:bg-card hover:shadow-sm"
                }`}
              >
                <div className="flex w-full items-center justify-between pb-2">
                  <span className="text-xs font-bold text-foreground">{v.label}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {v.badge}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">{v.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. INTERACTIVE PLAYGROUND / STUDIO */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sliders className="size-5 text-primary" />
              Studio thử nghiệm trực tiếp
            </h2>
            <p className="text-sm text-muted-foreground">
              Đang xem trực quan: <strong className="text-foreground">{VARIANT_OPTIONS.find((v) => v.id === selectedVariant)?.label}</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedVariant("bento-console");
              setMode("raised-inset");
              setTone("primary");
              setSize("md");
              setDepth("medium");
              setBorder("subtle");
              setIconEffect("raised-inset");
              setContentEffect("inset");
              setSelectedIconId("shield-check");
              setTitle("Tỷ lệ tuân thủ PPE");
              setValue("98.4%");
              setDescription("Đo lường trên 1,248 công nhân trực ca");
              setHasDescription(true);
              setHasTrend(true);
              setTrendValue("+2.4%");
              setTrendLabel("so với tuần trước");
              setTrendDirection("up");
              setTrendPositive(true);
              setHasProgress(true);
              setProgress(98);
              setProgressLabel("Chỉ tiêu an toàn ca trực");
              setHasFooter(false);
              setHover(true);
              setLoading(false);
              setIsClickable(false);
              toast.success("Đã đặt lại cấu hình mặc định");
            }}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <RotateCcw className="size-3.5" />
            Đặt lại mặc định
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Controls Panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm overflow-y-auto max-h-[780px]">
            {/* Variant Switcher inside controls */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                1. Biến thể kiến trúc (Variant)
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {VARIANT_OPTIONS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v.id)}
                    className={`rounded-xl px-2.5 py-2 text-xs font-semibold transition-all text-left ${
                      selectedVariant === v.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "border border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="block truncate">{v.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedVariant === "classic" && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  2. Chế độ nổi/chìm (Classic Mode)
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("raised-inset")}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      mode === "raised-inset"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "border border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Raised → Inset
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("inset-raised")}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      mode === "inset-raised"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "border border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Inset → Raised
                  </button>
                </div>
              </div>
            )}

            {/* Tone selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tone màu ngữ cảnh
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {TONE_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTone(item.id)}
                    className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-all ${
                      tone === item.id
                        ? "border-primary bg-background text-foreground shadow-sm ring-1 ring-primary"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span
                      className="size-3 rounded-full shrink-0"
                      style={{ background: item.color }}
                    />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content inputs */}
            <div className="space-y-3 border-t border-border pt-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Tiêu đề (Title)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Giá trị chính (Value)
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold font-mono text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Biểu tượng (Icon)
                </label>
                <select
                  value={selectedIconId}
                  onChange={(e) => setSelectedIconId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                >
                  {ICON_OPTIONS.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Behavior toggles */}
            <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={loading}
                  onChange={(e) => setLoading(e.target.checked)}
                  className="rounded"
                />
                Trạng thái Skeleton
              </label>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={hover}
                  onChange={(e) => setHover(e.target.checked)}
                  className="rounded"
                />
                Hiệu ứng Hover 3D
              </label>
            </div>
          </div>

          {/* Preview & Code Stage (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Live Canvas */}
            <div className="relative flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-border bg-background p-6 transition-colors">
              <div className="absolute top-3 left-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Eye className="size-3.5 text-primary" />
                Live Preview ({selectedVariant})
              </div>

              {selectedVariant === "bento-console" ? (
                <div className="w-full pt-6">
                  <BentoConsoleStats
                    scale={{
                      title: "Quy mô nhân sự & Trạng thái hoạt động",
                      badgeText: "Directory Pulse",
                      totalValue: 1248,
                      totalLabel: "Tổng nhân sự",
                      totalSub: "Tài khoản toàn công ty",
                      activeValue: 1180,
                      activeLabel: "Đang hoạt động",
                      activeSub: "Sẵn sàng đăng nhập",
                      activeRate: 95,
                    }}
                    security={{
                      title: "Bảo mật xác thực hai bước",
                      badgeText: "TOTP 2FA",
                      percent: 85,
                      currentValue: 1060,
                      totalValue: 1248,
                      description: "Tài khoản kích hoạt mã bảo vệ Google Authenticator.",
                      statusLabel: "Độ phủ an ninh",
                      statusText: "Mức độ: Rất tốt",
                    }}
                    sentinel={{
                      title: "An ninh & Truy cập",
                      count: 5,
                      label: "Tài khoản bị khóa",
                      description: "Nhập sai mật khẩu hoặc bị vô hiệu hóa",
                      statusText: "Cần quản trị xử lý",
                      isWarning: true,
                    }}
                    loading={loading}
                  />
                </div>
              ) : selectedVariant === "deep-elevation" ? (
                <div className="w-full max-w-sm pt-6 transition-all duration-300">
                  <DeepElevationStatsCard
                    title={title}
                    value={value}
                    icon={CurrentIcon}
                    tone={tone}
                    progress={hasProgress ? progress : undefined}
                    progressLabel={hasProgress ? progressLabel : undefined}
                    description={hasDescription ? description : undefined}
                    loading={loading}
                    onClick={isClickable ? handleCardClick : undefined}
                  />
                </div>
              ) : selectedVariant === "soft-extruded" ? (
                <div className="w-full max-w-sm pt-6 transition-all duration-300">
                  <SoftExtrudedStatsCard
                    title={title}
                    value={value}
                    icon={CurrentIcon}
                    tone={tone}
                    progress={hasProgress ? progress : undefined}
                    progressLabel={hasProgress ? progressLabel : undefined}
                    description={hasDescription ? description : undefined}
                    loading={loading}
                    onClick={isClickable ? handleCardClick : undefined}
                  />
                </div>
              ) : (
                <div className="w-full max-w-sm pt-6 transition-all duration-300">
                  <SelectedCardComponent
                    title={title}
                    value={value}
                    icon={CurrentIcon}
                    tone={tone}
                    size={size}
                    depth={depth}
                    border={border}
                    iconEffect={iconEffect}
                    contentEffect={contentEffect}
                    description={hasDescription ? description : undefined}
                    trend={
                      hasTrend
                        ? {
                            value: trendValue,
                            label: trendLabel,
                            direction: trendDirection,
                            positive: trendPositive,
                          }
                        : undefined
                    }
                    progress={hasProgress ? progress : undefined}
                    progressLabel={hasProgress ? progressLabel : undefined}
                    footer={hasFooter ? <span>{footerText}</span> : undefined}
                    hover={hover}
                    loading={loading}
                    onClick={isClickable ? handleCardClick : undefined}
                  />
                </div>
              )}

              <div className="mt-6 text-center text-xs text-muted-foreground">
                Tự động thích ứng hoàn hảo với Dark Mode và Light Mode của hệ thống.
              </div>
            </div>

            {/* Generated Code Block */}
            <div className="relative rounded-2xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  JSX Code Generator ({selectedVariant})
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-success" />
                      Đã chép
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      Sao chép JSX
                    </>
                  )}
                </button>
              </div>

              <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs leading-5 text-foreground max-h-56">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. BỘ 4 THIẾT KẾ KIẾN TRÚC THỐNG KÊ (SHOWCASE ALL 4)      */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="size-5 text-primary" />
            Bộ 4 Thiết Kế Kiến Trúc Thống Kê (4 Design Architectures)
          </h2>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Xem thực tế và so sánh trực diện cả 4 dòng thiết kế được cung cấp sẵn trong component{" "}
            <code className="font-mono text-xs text-primary">stats-cards.tsx</code>.
          </p>
        </div>

        {/* --------------------------------------------------------- */}
        {/* DÒNG 4: BENTO CONSOLE (ĐẶT ĐẦU VÌ LÀ ĐẶC BIỆT NHẤT)       */}
        {/* --------------------------------------------------------- */}
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" />
                <h3 className="text-base font-black text-foreground">
                  Dòng 4: Bố cục Bento Console Bất Đối Xứng (Kiến trúc đặc biệt — Không đại trà)
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bố cục 3 khối chuyên trách: Quy mô nhân sự Pulse (5 cột) • Đồng hồ Gauge 2FA (4 cột) • Đèn Sentinel Access (3 cột)
              </p>
            </div>
            <span className="rounded-md bg-indigo-500/15 px-2.5 py-1 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Khuyên Dùng cho Trang Chủ & Users
            </span>
          </div>

          <div className="p-2 bg-background/50 rounded-2xl">
            <BentoConsoleStats
              scale={{
                title: "Quy mô nhân sự & Trạng thái hoạt động",
                badgeText: "Directory Pulse",
                totalValue: 1248,
                totalLabel: "Tổng nhân sự",
                totalSub: "Tài khoản toàn công ty",
                activeValue: 1180,
                activeLabel: "Đang hoạt động",
                activeSub: "Sẵn sàng đăng nhập",
                activeRate: 95,
              }}
              security={{
                title: "Bảo mật xác thực hai bước",
                badgeText: "TOTP 2FA",
                percent: 85,
                currentValue: 1060,
                totalValue: 1248,
                description: "Tài khoản kích hoạt mã bảo vệ Google Authenticator.",
                statusLabel: "Độ phủ an ninh",
                statusText: "Mức độ: Rất tốt",
              }}
              sentinel={{
                title: "An ninh & Truy cập",
                count: 5,
                label: "Tài khoản bị khóa",
                description: "Nhập sai mật khẩu hoặc bị vô hiệu hóa",
                statusText: "Cần quản trị xử lý",
                isWarning: true,
              }}
            />
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* DÒNG 3: THIẾT KẾ SIÊU NỔI (DEEP ELEVATION 3D)              */}
        {/* --------------------------------------------------------- */}
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
                <h3 className="text-base font-black text-foreground">
                  Dòng 3: Thiết kế Siêu Nổi (Deep 3D Elevation + Chữ nổi &lt;Typography variant=&quot;embossed&quot;&gt;)
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bóng sâu 10px/22px, gờ phản quang kép, con số chữ nổi 3D đa hướng tạo hiệu ứng khắc kim loại
              </p>
            </div>
            <span className="rounded-md bg-amber-500/15 px-2.5 py-1 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
              Độ nổi Cao Nhất
            </span>
          </div>

          <div className="p-3 bg-background/50 rounded-2xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DeepElevationStatsCard
                title="Tổng nhân sự"
                value="1,248"
                icon={Users}
                tone="primary"
                description="Tài khoản nhân sự trong hệ thống"
              />
              <DeepElevationStatsCard
                title="Đang hoạt động"
                value="1,180"
                icon={UserCheck}
                tone="success"
                description="Sẵn sàng hoạt động & đăng nhập"
              />
              <DeepElevationStatsCard
                title="Đã bật TOTP 2FA"
                value="1,060"
                icon={ShieldCheck}
                tone="info"
                progress={85}
                progressLabel="85% bảo vệ"
                description="Độ phủ an ninh đạt chuẩn cao"
              />
              <DeepElevationStatsCard
                title="Tài khoản bị khóa"
                value="05"
                icon={UserX}
                tone="warning"
                description="Cần quản trị viên kiểm tra"
              />
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* DÒNG 2: NEUMORPHISM 3D NỔI VỪA (SOFT EXTRUDED)             */}
        {/* --------------------------------------------------------- */}
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-primary" />
                <h3 className="text-base font-bold text-foreground">
                  Dòng 2: Thiết kế Neumorphism 3D Nổi Vừa (Soft Extruded)
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bóng 6px/14px, gờ phản quang mỏng trên đỉnh, quầng sáng ambient glow góc, khay lõm đáy
              </p>
            </div>
            <span className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">
              Cân Bằng & Hiện Đại
            </span>
          </div>

          <div className="p-3 bg-background/50 rounded-2xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SoftExtrudedStatsCard
                title="Tổng nhân sự"
                value="1,248"
                icon={Users}
                tone="primary"
                description="Nhân sự toàn hệ thống"
              />
              <SoftExtrudedStatsCard
                title="Đang hoạt động"
                value="1,180"
                icon={UserCheck}
                tone="success"
                description="Sẵn sàng đăng nhập"
              />
              <SoftExtrudedStatsCard
                title="Đã bật TOTP 2FA"
                value="1,060"
                icon={ShieldCheck}
                tone="info"
                progress={85}
                progressLabel="85%"
                description="Bảo mật cấp hai"
              />
              <SoftExtrudedStatsCard
                title="Tài khoản bị khóa"
                value="05"
                icon={UserX}
                tone="warning"
                description="Cần xem xét trạng thái"
              />
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* DÒNG 1: STATS HIỆN TẠI (CLASSIC SOFT UI ĐỐI XỨNG)         */}
        {/* --------------------------------------------------------- */}
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                <h3 className="text-base font-bold text-foreground">
                  Dòng 1: Stats hiện tại (Classic Raised-Inset & Inset-Raised)
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Hai trường phái đối xứng kinh điển: RaisedInsetStatsCard và InsetRaisedStatsCard
              </p>
            </div>
            <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-bold text-muted-foreground">
              Classic Thư Viện
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 p-3 bg-background/50 rounded-2xl">
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary block">Raised → Inset (Vỏ nổi, lõi chìm):</span>
              <RaisedInsetStatsCard
                title="Tỷ lệ tuân thủ mũ bảo hộ"
                value="99.2%"
                icon={HardHat}
                tone="success"
                progress={99}
                progressLabel="Mục tiêu ca ngày: 95%"
                trend={{ value: "+3.1%", label: "so với hôm qua", direction: "up", positive: true }}
                description="Đã phát hiện 1,420 lượt đội mũ bảo hộ đúng chuẩn."
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-primary block">Inset → Raised (Vỏ chìm, lõi nổi):</span>
              <InsetRaisedStatsCard
                title="Camera AI phân tích PPE"
                value="38 / 40"
                icon={Camera}
                tone="info"
                progress={95}
                progressLabel="Băng thông luồng video ổn định"
                trend={{ value: "95%", label: "thiết bị trực tuyến", direction: "neutral" }}
                description="02 camera tại Cổng 3 đang trong chu kỳ tự cân chỉnh quang học."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. TÀI LIỆU API & PROPS                                   */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tài liệu API & Thuộc tính (Props)</h2>
          <p className="text-sm text-muted-foreground">
            Bảng tham số của các component trong file <code className="font-mono text-xs text-primary">@ui/stats-cards</code>.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-background text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Thuộc tính</th>
                <th className="px-4 py-3 font-semibold">Kiểu dữ liệu</th>
                <th className="px-4 py-3 font-semibold">Mặc định</th>
                <th className="px-4 py-3 font-semibold">Mô tả chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">variant</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">
                  &quot;classic&quot; | &quot;soft-extruded&quot; | &quot;deep-elevation&quot; | &quot;bento-console&quot;
                </td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;soft-extruded&quot;</td>
                <td className="px-4 py-3 text-foreground">
                  Lựa chọn 1 trong 4 kiến trúc thiết kế thống kê Neumorphic.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">title</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">string</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">bắt buộc</td>
                <td className="px-4 py-3 text-foreground">Tiêu đề của thẻ chỉ số (ví dụ: &quot;Tổng nhân sự&quot;).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">value</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">React.ReactNode</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">bắt buộc</td>
                <td className="px-4 py-3 text-foreground">Con số thống kê chính hiển thị khổ lớn.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">icon</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">LucideIcon</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Biểu tượng Lucide hiển thị trong ổ cắm 3D.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">tone</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">
                  &quot;default&quot; | &quot;primary&quot; | &quot;success&quot; | &quot;warning&quot; | &quot;danger&quot; | &quot;info&quot;
                </td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;default&quot;</td>
                <td className="px-4 py-3 text-foreground">Tone màu ngữ cảnh áp dụng cho giá trị, icon và khay tiến độ.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">progress</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">number (0 - 100)</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Tự động dựng thanh tiến độ chìm 3D bên dưới.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. CODE IMPORT SNIPPET                                    */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Hướng dẫn nhập vào dự án</h2>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-4">
            Import trực tiếp từ đường dẫn alias <code className="font-mono text-xs">@ui/stats-cards</code> trong toàn bộ hệ thống:
          </p>

          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs leading-6 text-foreground">
{`// 1. Sử dụng Dòng 4: Bố cục Bento Console Bất Đối Xứng
import { BentoConsoleStats } from "@ui/stats-cards";

<BentoConsoleStats
  scale={{ totalValue: 1248, activeValue: 1180, activeRate: 95 }}
  security={{ percent: 85, currentValue: 1060, totalValue: 1248 }}
  sentinel={{ count: 5, isWarning: true }}
/>

// 2. Sử dụng component thống nhất với variant
import { StatsCard } from "@ui/stats-cards";
<StatsCard variant="deep-elevation" title="Tổng nhân sự" value="1,248" icon={Users} tone="primary" />`}
          </pre>
        </div>
      </section>

      {/* ========================================================= */}
      {/* INTEGRATED MODAL                                          */}
      {/* ========================================================= */}
      <SculptedModal
        open={activeModal === "playground"}
        onOpenChange={(open) => setActiveModal(open ? "playground" : null)}
        title={`Chi tiết chỉ số: ${title}`}
        description="Thông tin phân tích chuyên sâu được mở trực tiếp khi tương tác với Stats Card"
        icon={CurrentIcon ? <CurrentIcon size={20} /> : undefined}
        size="md"
        accentColor={tone !== "default" ? `var(--${tone})` : undefined}
        border={border}
        footer={
          <Button variant="primary" onClick={() => setActiveModal(null)}>
            Đóng hộp thoại
          </Button>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-nm-pressed">
            <span className="text-muted-foreground font-semibold">Giá trị hiện thời:</span>
            <span className="text-xl font-extrabold text-primary">{value}</span>
          </div>

          {hasProgress && (
            <div className="rounded-xl border border-border bg-background p-3 space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-muted-foreground">{progressLabel}</span>
                <span className="text-primary">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-card shadow-nm-inset">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {hasDescription && description && (
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>
      </SculptedModal>
    </div>
  );
}
