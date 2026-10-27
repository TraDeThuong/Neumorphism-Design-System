"use client";

import * as React from "react";
import Link from "next/link";
import {
  Badge,
  type BadgeVariant,
  type BadgeSize,
  type BadgeShape,
  type BadgeIndicator,
} from "@ui/badge";
import { Button } from "@ui/button";
import { toast } from "@ui/toaster";
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  ChevronRight,
  Eye,
  ShieldCheck,
  AlertTriangle,
  HardHat,
  Camera,
  Users,
  Bell,
  Activity,
  Tag,
  CheckCircle2,
  XCircle,
  Radio,
  SlidersHorizontal,
} from "lucide-react";

const VARIANT_OPTIONS: Array<{ id: BadgeVariant; label: string; color: string }> = [
  { id: "default", label: "Default", color: "var(--foreground)" },
  { id: "primary", label: "Primary", color: "var(--primary)" },
  { id: "secondary", label: "Secondary", color: "var(--muted-foreground)" },
  { id: "success", label: "Success", color: "var(--success)" },
  { id: "warning", label: "Warning", color: "var(--warning)" },
  { id: "danger", label: "Danger", color: "var(--danger)" },
  { id: "info", label: "Info", color: "var(--info)" },
  { id: "outline", label: "Outline", color: "var(--border)" },
];

const SIZE_OPTIONS: BadgeSize[] = ["sm", "md", "lg"];
const SHAPE_OPTIONS: BadgeShape[] = ["pill", "rounded"];
const INDICATOR_OPTIONS: BadgeIndicator[] = ["none", "dot", "icon"];

const ICON_PRESETS = [
  { id: "shield-check", label: "ShieldCheck", icon: ShieldCheck },
  { id: "alert-triangle", label: "AlertTriangle", icon: AlertTriangle },
  { id: "hardhat", label: "HardHat", icon: HardHat },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "bell", label: "Bell", icon: Bell },
  { id: "activity", label: "Activity", icon: Activity },
];

const INITIAL_FILTER_TAGS = [
  { id: "area", text: "Khu vực: Hố móng B2", variant: "primary" as BadgeVariant },
  { id: "risk", text: "Mức độ: Nghiêm trọng", variant: "danger" as BadgeVariant },
  { id: "item", text: "Thiết bị: Mũ bảo hộ", variant: "warning" as BadgeVariant },
  { id: "status", text: "Trạng thái: Chưa xử lý", variant: "info" as BadgeVariant },
  { id: "shift", text: "Ca trực: Ca ngày", variant: "secondary" as BadgeVariant },
];

export default function BadgeShowcasePage() {
  // Playground state
  const [content, setContent] = React.useState("Tuân thủ an toàn");
  const [variant, setVariant] = React.useState<BadgeVariant>("success");
  const [size, setSize] = React.useState<BadgeSize>("md");
  const [shape, setShape] = React.useState<BadgeShape>("pill");
  const [indicator, setIndicator] = React.useState<BadgeIndicator>("dot");
  const [selectedIconId, setSelectedIconId] = React.useState<string>("shield-check");
  const [useCustomIcon, setUseCustomIcon] = React.useState(false);

  const [hasCount, setHasCount] = React.useState(false);
  const [count, setCount] = React.useState(12);
  const [maxCount, setMaxCount] = React.useState(99);

  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [removable, setRemovable] = React.useState(false);
  const [interactive, setInteractive] = React.useState(false);

  const [copied, setCopied] = React.useState(false);

  // Dynamic filter tags state for Section 5
  const [filterTags, setFilterTags] = React.useState(INITIAL_FILTER_TAGS);

  const SelectedIcon = React.useMemo(() => {
    const found = ICON_PRESETS.find((item) => item.id === selectedIconId);
    return found ? found.icon : ShieldCheck;
  }, [selectedIconId]);

  const generatedCode = React.useMemo(() => {
    const lines: string[] = [];
    lines.push(`<Badge`);
    if (variant !== "default") lines.push(`  variant="${variant}"`);
    if (size !== "md") lines.push(`  size="${size}"`);
    if (shape !== "pill") lines.push(`  shape="${shape}"`);
    if (indicator !== "none" && !useCustomIcon) lines.push(`  indicator="${indicator}"`);
    if (useCustomIcon) {
      const iconName = ICON_PRESETS.find((i) => i.id === selectedIconId)?.label || "ShieldCheck";
      lines.push(`  icon={<${iconName} />}`);
    }
    if (hasCount) {
      lines.push(`  count={${count}}`);
      if (maxCount !== 99) lines.push(`  maxCount={${maxCount}}`);
    }
    if (loading) lines.push(`  loading={true}`);
    if (disabled) lines.push(`  disabled={true}`);
    if (removable) lines.push(`  removable={true}\n  onRemove={() => console.log("Removed")}`);
    if (interactive) lines.push(`  onClick={() => console.log("Badge clicked")}`);
    lines.push(`>`);
    lines.push(`  ${content}`);
    lines.push(`</Badge>`);
    return lines.join("\n");
  }, [
    content,
    variant,
    size,
    shape,
    indicator,
    useCustomIcon,
    selectedIconId,
    hasCount,
    count,
    maxCount,
    loading,
    disabled,
    removable,
    interactive,
  ]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Đã sao chép mã JSX Badge vào clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBadgeClick = () => {
    if (interactive && !disabled && !loading) {
      toast.success(`Bạn đã bấm vào Badge: "${content}"`);
    }
  };

  const handleBadgeRemove = () => {
    toast.error(`Đã xóa nhãn: "${content}"`);
  };

  const handleRemoveFilterTag = (id: string, text: string) => {
    setFilterTags((prev) => prev.filter((tag) => tag.id !== id));
    toast.error(`Đã gỡ bộ lọc: "${text}"`);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 pb-24">
      {/* Header */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Link href="/components" className="hover:text-foreground">
            Components
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-primary font-bold">Badge</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Badge (Huy hiệu & Nhãn)</h1>
            <p className="mt-2 text-base text-muted-foreground leading-relaxed max-w-3xl">
              Huy hiệu trạng thái, nhãn phân loại (Tags) và bộ đếm số lượng (Counter) được hoàn thiện theo
              phong cách Neumorphism với đường viền nổi khối 3D quang học, tích hợp chỉ báo chấm tín hiệu,
              icon tự động, nút xóa $X$, bộ đếm giới hạn và khả năng tương tác nhấn nhả mượt mà.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm">
            <Sparkles className="size-3.5 text-accent" />
            Tactile Soft UI
          </span>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 1. INTERACTIVE STUDIO / PLAYGROUND */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sliders className="size-5 text-primary" />
              Studio thử nghiệm trực tiếp
            </h2>
            <p className="text-sm text-muted-foreground">
              Tùy biến cấu hình huy hiệu, thử nghiệm trực tiếp trạng thái tương tác và nhận mã JSX tức thì.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setContent("Tuân thủ an toàn");
              setVariant("success");
              setSize("md");
              setShape("pill");
              setIndicator("dot");
              setUseCustomIcon(false);
              setHasCount(false);
              setCount(12);
              setMaxCount(99);
              setLoading(false);
              setDisabled(false);
              setRemovable(false);
              setInteractive(false);
              toast.success("Đã hoàn tác cấu hình mặc định");
            }}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <RotateCcw className="size-3.5" />
            Đặt lại mặc định
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm overflow-y-auto max-h-[720px]">
            {/* 1. Content Text */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                1. Nội dung văn bản
              </label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Nhập nội dung nhãn..."
              />
            </div>

            {/* 2. Variant */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                2. Biến thể màu sắc (Variant)
              </label>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {VARIANT_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setVariant(item.id)}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border py-1.5 text-[11px] font-semibold transition-all capitalize ${
                      variant === item.id
                        ? "border-primary bg-background text-foreground shadow-sm ring-1 ring-primary"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="size-2 rounded-full shrink-0" style={{ background: item.color }} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Size & Shape */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  3. Kích thước (Size)
                </label>
                <div className="mt-2 flex gap-1 rounded-xl border border-border bg-background p-1">
                  {SIZE_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`flex-1 rounded-lg py-1 text-xs font-bold transition-all uppercase ${
                        size === s
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  4. Hình dáng (Shape)
                </label>
                <div className="mt-2 flex gap-1 rounded-xl border border-border bg-background p-1">
                  {SHAPE_OPTIONS.map((sh) => (
                    <button
                      key={sh}
                      type="button"
                      onClick={() => setShape(sh)}
                      className={`flex-1 rounded-lg py-1 text-xs font-bold transition-all capitalize ${
                        shape === sh
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {sh}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Indicator */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                5. Chỉ báo (Indicator)
              </label>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {INDICATOR_OPTIONS.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => {
                      setIndicator(ind);
                      setUseCustomIcon(false);
                    }}
                    className={`rounded-lg py-1.5 text-xs font-semibold transition-all capitalize ${
                      indicator === ind && !useCustomIcon
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Icon picker toggle */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <input
                  type="checkbox"
                  checked={useCustomIcon}
                  onChange={(e) => setUseCustomIcon(e.target.checked)}
                  className="rounded"
                />
                Dùng icon tùy biến (prop icon)
              </label>
              {useCustomIcon && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {ICON_PRESETS.map((item) => {
                    const Ico = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedIconId(item.id)}
                        className={`flex size-8 items-center justify-center rounded-xl border transition-all ${
                          selectedIconId === item.id
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-background text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Ico className="size-4" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Count Settings */}
            <div className="border-t border-border pt-3">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <input
                  type="checkbox"
                  checked={hasCount}
                  onChange={(e) => setHasCount(e.target.checked)}
                  className="rounded"
                />
                Bộ đếm số lượng (Count Badge)
              </label>
              {hasCount && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-muted-foreground">Số lượng (count):</span>
                    <input
                      type="number"
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-muted-foreground">Tối đa (maxCount):</span>
                    <input
                      type="number"
                      value={maxCount}
                      onChange={(e) => setMaxCount(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Behavior Switches */}
            <div className="grid grid-cols-2 gap-2.5 border-t border-border pt-3">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={loading}
                  onChange={(e) => setLoading(e.target.checked)}
                  className="rounded"
                />
                Đang tải (loading)
              </label>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(e) => setDisabled(e.target.checked)}
                  className="rounded"
                />
                Vô hiệu (disabled)
              </label>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={removable}
                  onChange={(e) => setRemovable(e.target.checked)}
                  className="rounded"
                />
                Nút xóa (removable)
              </label>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={interactive}
                  onChange={(e) => setInteractive(e.target.checked)}
                  className="rounded"
                />
                Bấm được (interactive)
              </label>
            </div>
          </div>

          {/* Canvas & Code Stage (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Live Badge Stage */}
            <div className="relative flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-border bg-background p-8 transition-colors shadow-sm">
              <div className="absolute top-3 left-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Eye className="size-3.5 text-primary" />
                Live Preview
              </div>

              {interactive && (
                <div className="absolute top-3 right-4 text-[11px] font-medium text-primary">
                  Thử bấm vào badge ↓
                </div>
              )}

              <div className="flex items-center justify-center transition-all duration-300">
                <Badge
                  variant={variant}
                  size={size}
                  shape={shape}
                  indicator={useCustomIcon ? "none" : indicator}
                  icon={useCustomIcon ? <SelectedIcon /> : undefined}
                  count={hasCount ? count : undefined}
                  maxCount={maxCount}
                  loading={loading}
                  disabled={disabled}
                  removable={removable}
                  onRemove={removable ? handleBadgeRemove : undefined}
                  onClick={interactive ? handleBadgeClick : undefined}
                >
                  {content}
                </Badge>
              </div>

              <div className="mt-8 text-center text-xs text-muted-foreground">
                Bóng đổ kép Neumorphism tự động đảo sáng tối khi chuyển Theme.
              </div>
            </div>

            {/* Generated Code */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  JSX Code Generator
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
      {/* 2. THE 8 COLOR VARIANTS */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hệ 8 biến thể màu sắc (Variants)</h2>
          <p className="text-sm text-muted-foreground">
            Bảng màu ngữ cảnh đầy đủ phục vụ phân loại trạng thái trong vận hành công trường.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-xs text-muted-foreground">variant=&quot;default&quot;</span>
            <Badge variant="default">Mặc định (Default)</Badge>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-xs text-muted-foreground">variant=&quot;primary&quot;</span>
            <Badge variant="primary">Chính (Primary)</Badge>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-xs text-muted-foreground">variant=&quot;secondary&quot;</span>
            <Badge variant="secondary">Thứ cấp (Secondary)</Badge>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-xs text-muted-foreground">variant=&quot;success&quot;</span>
            <Badge variant="success">An toàn (Success)</Badge>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-xs text-muted-foreground">variant=&quot;warning&quot;</span>
            <Badge variant="warning">Cảnh báo (Warning)</Badge>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-xs text-muted-foreground">variant=&quot;danger&quot;</span>
            <Badge variant="danger">Nguy hiểm (Danger)</Badge>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-xs text-muted-foreground">variant=&quot;info&quot;</span>
            <Badge variant="info">Thông tin (Info)</Badge>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-xs text-muted-foreground">variant=&quot;outline&quot;</span>
            <Badge variant="outline">Đường viền (Outline)</Badge>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. INDICATORS: DOT, ICON, COUNT, LOADING */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Chỉ báo trực quan (Indicators & Counter)</h2>
          <p className="text-sm text-muted-foreground">
            Hỗ trợ chấm tín hiệu trực tuyến, icon thông minh theo màu, bộ đếm thông báo và biểu tượng đang tải.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Dot */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="font-mono text-xs font-bold text-muted-foreground">indicator=&quot;dot&quot;</span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" indicator="dot">
                Trực tuyến
              </Badge>
              <Badge variant="danger" indicator="dot">
                Ngoại tuyến
              </Badge>
              <Badge variant="warning" indicator="dot">
                Chờ phản hồi
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Chấm màu đồng bộ với tone nền, tạo đèn tín hiệu trạng thái.</p>
          </div>

          {/* Icon */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="font-mono text-xs font-bold text-muted-foreground">indicator=&quot;icon&quot;</span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" indicator="icon">
                Đã duyệt
              </Badge>
              <Badge variant="danger" indicator="icon">
                Vi phạm
              </Badge>
              <Badge variant="info" indicator="icon">
                Thông báo
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Tự động gắn icon mặc định theo ngữ cảnh (CircleCheck, AlertCircle...).</p>
          </div>

          {/* Count */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="font-mono text-xs font-bold text-muted-foreground">count=&#123;number&#125;</span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary" count={5}>
                Tin nhắn
              </Badge>
              <Badge variant="danger" count={142} maxCount={99}>
                Cảnh báo
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Bộ đếm tự động giới hạn với tiền tố <code className="font-mono text-xs">99+</code> khi vượt maxCount.</p>
          </div>

          {/* Loading */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="font-mono text-xs font-bold text-muted-foreground">loading=&#123;true&#125;</span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info" loading>
                Đang đồng bộ
              </Badge>
              <Badge variant="secondary" loading>
                Đang xử lý
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Hiệu ứng quay mượt mà, tự động tắt khi hệ thống bật reduced motion.</p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. SIZES & SHAPES */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kích thước (Size) & Hình dáng (Shape)</h2>
          <p className="text-sm text-muted-foreground">
            Lựa chọn linh hoạt giữa hình viên thuốc (<code className="font-mono text-xs">pill</code> - tròn) và
            bo góc squircle (<code className="font-mono text-xs">rounded</code>).
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          {/* Pill */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs font-bold text-primary">shape=&quot;pill&quot; (Bo tròn viên thuốc)</span>
            <div className="flex flex-wrap items-center gap-3">
              <Badge size="sm" shape="pill" variant="primary">
                Size SM
              </Badge>
              <Badge size="md" shape="pill" variant="primary">
                Size MD (Mặc định)
              </Badge>
              <Badge size="lg" shape="pill" variant="primary">
                Size LG
              </Badge>
            </div>
          </div>

          {/* Rounded */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs font-bold text-primary">shape=&quot;rounded&quot; (Bo góc hiện đại)</span>
            <div className="flex flex-wrap items-center gap-3">
              <Badge size="sm" shape="rounded" variant="secondary">
                Size SM
              </Badge>
              <Badge size="md" shape="rounded" variant="secondary">
                Size MD
              </Badge>
              <Badge size="lg" shape="rounded" variant="secondary">
                Size LG
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. INTERACTIVE REMOVABLE TAGS */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Nhóm nhãn bộ lọc có thể gỡ (Removable Tags)</h2>
            <p className="text-sm text-muted-foreground">
              Bấm vào nút <strong className="text-danger">X</strong> để gỡ bỏ từng tiêu chí lọc sự cố công trường.
            </p>
          </div>
          {filterTags.length < INITIAL_FILTER_TAGS.length && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterTags(INITIAL_FILTER_TAGS);
                toast.success("Đã khôi phục toàn bộ nhãn lọc");
              }}
            >
              <RotateCcw className="size-3.5 mr-1" />
              Khôi phục bộ lọc
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 rounded-2xl border border-border bg-background p-6 shadow-nm-pressed min-h-[90px] items-center">
          {filterTags.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              Tất cả các nhãn lọc đã được gỡ. Hãy bấm &quot;Khôi phục bộ lọc&quot; để tải lại.
            </p>
          ) : (
            filterTags.map((tag) => (
              <Badge
                key={tag.id}
                variant={tag.variant}
                size="md"
                removable
                onRemove={() => handleRemoveFilterTag(tag.id, tag.text)}
              >
                {tag.text}
              </Badge>
            ))
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. REAL-WORLD USE CASES IN SMART PPE */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kịch bản thực tế trong hệ thống Smart PPE</h2>
          <p className="text-sm text-muted-foreground">
            Minh họa cách phối hợp Badge trong danh sách nhân sự, thiết bị IoT và hàng đợi sự cố an toàn.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {/* Card 1: Worker Profile */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">Nguyễn Văn An</span>
                <Badge variant="success" size="sm" indicator="dot">
                  Đang làm việc
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Mã NV: PPE-0842 · Phân khu Giàn giáo</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <Badge variant="primary" size="sm">
                  Ca sáng
                </Badge>
                <Badge variant="success" size="sm" indicator="icon">
                  Mũ đạt chuẩn
                </Badge>
                <Badge variant="outline" size="sm">
                  Dây đai an toàn
                </Badge>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Tỷ lệ tuân thủ:</span>
              <strong className="text-success font-bold">99.4%</strong>
            </div>
          </div>

          {/* Card 2: AI Camera Status */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">Camera AI #04</span>
                <Badge variant="info" size="sm" indicator="dot">
                  30 FPS
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Vị trí: Cổng chính & Trạm cân xe</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <Badge variant="secondary" size="sm">
                  RTSP Stream
                </Badge>
                <Badge variant="danger" size="sm" count={2}>
                  Vi phạm
                </Badge>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Độ chính xác:</span>
              <strong className="text-primary font-bold">98.2%</strong>
            </div>
          </div>

          {/* Card 3: IoT Sensor Device */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">Cảm biến Khí H2S</span>
                <Badge variant="warning" size="sm" indicator="dot">
                  Cảnh báo nồng độ
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Hầm kỹ thuật B2 · Pin: 84%</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <Badge variant="outline" size="sm">
                  Zigbee Mesh
                </Badge>
                <Badge variant="warning" size="sm" indicator="icon">
                  12.4 ppm
                </Badge>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Chu kỳ hiệu chuẩn:</span>
              <strong className="text-muted-foreground">Còn 14 ngày</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. PROPS REFERENCE TABLE */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tài liệu API & Bảng thuộc tính (BadgeProps)</h2>
          <p className="text-sm text-muted-foreground">
            Danh sách đầy đủ các thuộc tính có sẵn của component <code className="font-mono text-xs">Badge</code>.
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
                <td className="px-4 py-3 font-mono font-bold text-primary">children</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">ReactNode</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Văn bản hoặc phần tử nội dung chính của huy hiệu.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">variant</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">
                  &quot;default&quot; | &quot;primary&quot; | &quot;secondary&quot; | &quot;success&quot; | &quot;warning&quot; | &quot;danger&quot; | &quot;info&quot; | &quot;outline&quot;
                </td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;default&quot;</td>
                <td className="px-4 py-3 text-foreground">Phong cách màu sắc và bóng đổ Neumorphic tương ứng.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">size</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;md&quot;</td>
                <td className="px-4 py-3 text-foreground">Kích thước chiều cao và cỡ chữ (sm: 20px, md: 24px, lg: 32px).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">shape</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;pill&quot; | &quot;rounded&quot;</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;pill&quot;</td>
                <td className="px-4 py-3 text-foreground">Hình dạng bo góc: viên thuốc tròn (rounded-full) hoặc squircle (rounded-xl).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">indicator</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;none&quot; | &quot;dot&quot; | &quot;icon&quot;</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;none&quot;</td>
                <td className="px-4 py-3 text-foreground">Hiển thị chấm đèn tín hiệu hoặc icon ngữ cảnh tự động.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">icon</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">ReactNode</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Tùy biến icon tùy ý đặt ở đầu huy hiệu.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">count</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">number</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Bộ đếm thông báo hiển thị trong ô khắc chìm bên phải.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">maxCount</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">number</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">99</td>
                <td className="px-4 py-3 text-foreground">Ngưỡng hiển thị tối đa (vượt quá sẽ hiển thị {maxCount}+).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">loading</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">boolean</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">false</td>
                <td className="px-4 py-3 text-foreground">Hiển thị spinner xoay và làm mờ tương tác khi nạp dữ liệu.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">removable</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">boolean</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">false</td>
                <td className="px-4 py-3 text-foreground">Hiển thị nút X cho phép người dùng gỡ bỏ nhãn.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">onRemove</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">() =&gt; void</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Callback được gọi khi nhấn vào nút X xóa nhãn.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">onClick</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">MouseEventHandler</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Chuyển Badge thành nút bấm tương tác (có hiệu ứng nổi nhả tactile).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. CODE IMPORT SNIPPET */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Hướng dẫn nhập vào dự án</h2>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs leading-6 text-foreground">
{`import { Badge, type BadgeProps } from "@ui/badge";

export function ExampleBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success" indicator="dot">
        Trực tuyến
      </Badge>
      
      <Badge variant="danger" count={12}>
        Vi phạm
      </Badge>
      
      <Badge variant="primary" removable onRemove={() => console.log("Removed")}>
        Khu vực: Hầm B2
      </Badge>
    </div>
  );
}`}
          </pre>
        </div>
      </section>
    </div>
  );
}
