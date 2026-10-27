"use client";

import * as React from "react";
import Link from "next/link";
import {
  SegmentedControl,
  type SegmentedControlOption,
  type SegmentedControlSize,
} from "@ui/segmented-control";
import { Button } from "@ui/button";
import { Badge } from "@ui/badge";
import { toast } from "@ui/toast";
import {
  Sliders,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ChevronRight,
  Eye,
  Layers,
  LayoutGrid,
  List,
  BarChart3,
  Map,
  Sun,
  Sunset,
  Moon,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  Clock,
  Activity,
  CheckCircle2,
  Video,
  Camera,
  HardHat,
  Bell,
  Cpu,
} from "lucide-react";

// Option Presets
const PRESET_VIEW_OPTIONS: SegmentedControlOption[] = [
  { value: "grid", label: "Lưới thẻ", icon: <LayoutGrid /> },
  { value: "list", label: "Danh sách", icon: <List /> },
  { value: "analytics", label: "Phân tích", icon: <BarChart3 /> },
  { value: "map", label: "Bản đồ", icon: <Map /> },
];

const PRESET_TIME_OPTIONS: SegmentedControlOption[] = [
  { value: "day", label: "Hôm nay", icon: <Clock /> },
  { value: "week", label: "Tuần này", icon: <Calendar /> },
  { value: "month", label: "Tháng này", icon: <Calendar /> },
  { value: "year", label: "Năm 2026", icon: <Calendar /> },
];

const PRESET_SHIFT_OPTIONS: SegmentedControlOption[] = [
  { value: "morning", label: "Ca sáng (07:00)", icon: <Sun /> },
  { value: "afternoon", label: "Ca chiều (15:00)", icon: <Sunset /> },
  { value: "night", label: "Ca đêm (23:00)", icon: <Moon /> },
];

const PRESET_RISK_OPTIONS: SegmentedControlOption[] = [
  { value: "all", label: "Tất cả", icon: <Activity /> },
  { value: "safe", label: "Tuân thủ", icon: <ShieldCheck /> },
  { value: "warning", label: "Nhắc nhở", icon: <AlertTriangle /> },
  { value: "danger", label: "Vi phạm", icon: <ShieldAlert /> },
];

const PRESET_CAMERA_OPTIONS: SegmentedControlOption[] = [
  { value: "cam-1", label: "Cổng chính", icon: <Camera /> },
  { value: "cam-2", label: "Hố móng B2", icon: <Camera /> },
  { value: "cam-3", label: "Vận thăng tải", icon: <Camera /> },
  { value: "cam-4", label: "Giàn giáo Block B", icon: <Camera /> },
];

export default function SegmentedControlPage() {
  // Playground state
  const [activePreset, setActivePreset] = React.useState<"view" | "time" | "shift" | "risk">("view");
  const [selectedValue, setSelectedValue] = React.useState<string>("grid");
  const [size, setSize] = React.useState<SegmentedControlSize>("md");
  const [fullWidth, setFullWidth] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [disableSingleItem, setDisableSingleItem] = React.useState(false);
  const [showIcons, setShowIcons] = React.useState(true);

  const [copied, setCopied] = React.useState(false);

  // Real-world module states
  const [dashboardTime, setDashboardTime] = React.useState("week");
  const [activeCamera, setActiveCamera] = React.useState("cam-1");
  const [activeRiskFilter, setActiveRiskFilter] = React.useState("all");

  const currentOptions: SegmentedControlOption[] = React.useMemo(() => {
    let base: SegmentedControlOption[] = [];
    switch (activePreset) {
      case "view":
        base = PRESET_VIEW_OPTIONS;
        break;
      case "time":
        base = PRESET_TIME_OPTIONS;
        break;
      case "shift":
        base = PRESET_SHIFT_OPTIONS;
        break;
      case "risk":
        base = PRESET_RISK_OPTIONS;
        break;
    }

    return base.map((opt, idx) => ({
      ...opt,
      icon: showIcons ? opt.icon : undefined,
      disabled: disableSingleItem && idx === base.length - 1 ? true : undefined,
    }));
  }, [activePreset, showIcons, disableSingleItem]);

  // Sync selectedValue when preset changes
  const handlePresetChange = (preset: "view" | "time" | "shift" | "risk") => {
    setActivePreset(preset);
    switch (preset) {
      case "view":
        setSelectedValue("grid");
        break;
      case "time":
        setSelectedValue("day");
        break;
      case "shift":
        setSelectedValue("morning");
        break;
      case "risk":
        setSelectedValue("all");
        break;
    }
  };

  const handleValueChange = (val: string) => {
    setSelectedValue(val);
    const label = currentOptions.find((o) => o.value === val)?.label || val;
    toast.success(`Đã chọn phân đoạn: "${label}"`);
  };

  const generatedCode = React.useMemo(() => {
    const lines: string[] = [];
    lines.push(`const options = [`);
    currentOptions.forEach((opt) => {
      lines.push(`  { value: "${opt.value}", label: "${opt.label}"${opt.disabled ? ", disabled: true" : ""} },`);
    });
    lines.push(`];\n`);
    lines.push(`<SegmentedControl`);
    lines.push(`  options={options}`);
    lines.push(`  value={value}`);
    lines.push(`  onValueChange={setValue}`);
    lines.push(`  aria-label="Thanh chọn ${activePreset}"`);
    if (size !== "md") lines.push(`  size="${size}"`);
    if (fullWidth) lines.push(`  fullWidth={true}`);
    if (loading) lines.push(`  loading={true}`);
    if (disabled) lines.push(`  disabled={true}`);
    lines.push(`/>`);

    return lines.join("\n");
  }, [currentOptions, activePreset, size, fullWidth, loading, disabled]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Đã sao chép mã JSX SegmentedControl vào clipboard!");
    setTimeout(() => setCopied(false), 2000);
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
          <span className="text-primary font-bold">Segmented Control</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Segmented Control (Thanh chọn phân đoạn)
            </h1>
            <p className="mt-2 text-base text-muted-foreground leading-relaxed max-w-3xl">
              Thành phần chuyển đổi phân đoạn theo ngôn ngữ thiết kế Neumorphism với bóng viền 3D nổi khối,
              vết cắt phát sáng gạch chân (Ambient Glow Underline), hỗ trợ bàn phím chuẩn W3C Tablist Pattern
              (mũi tên, Home, End) và trạng thái tải dữ liệu đồng bộ.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm">
            <Sparkles className="size-3.5 text-accent" />
            W3C Tablist Pattern
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
              Tùy biến kích cỡ, trạng thái và thử nghiệm thao tác bàn phím trực tiếp.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActivePreset("view");
              setSelectedValue("grid");
              setSize("md");
              setFullWidth(false);
              setLoading(false);
              setDisabled(false);
              setDisableSingleItem(false);
              setShowIcons(true);
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
            {/* 1. Preset Options */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                1. Bộ mẫu phân đoạn (Presets)
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  { id: "view", label: "Chế độ xem" },
                  { id: "time", label: "Khoảng thời gian" },
                  { id: "shift", label: "Ca làm việc" },
                  { id: "risk", label: "Mức cảnh báo" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePresetChange(item.id as any)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      activePreset === item.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "border border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Size */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                2. Kích thước (Size)
              </label>
              <div className="mt-2 flex gap-1 rounded-xl border border-border bg-background p-1">
                {(["sm", "md", "lg"] as SegmentedControlSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all uppercase ${
                      size === s
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s} ({s === "sm" ? "32px" : s === "md" ? "40px" : "48px"})
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Toggles */}
            <div className="flex flex-col gap-3 border-t border-border pt-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={fullWidth}
                  onChange={(e) => setFullWidth(e.target.checked)}
                  className="rounded"
                />
                Giãn rộng 100% (fullWidth)
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={showIcons}
                  onChange={(e) => setShowIcons(e.target.checked)}
                  className="rounded"
                />
                Hiển thị icon kèm nhãn
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={loading}
                  onChange={(e) => setLoading(e.target.checked)}
                  className="rounded"
                />
                Đang tải dữ liệu (loading)
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(e) => setDisabled(e.target.checked)}
                  className="rounded"
                />
                Vô hiệu hóa toàn bộ (disabled)
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={disableSingleItem}
                  onChange={(e) => setDisableSingleItem(e.target.checked)}
                  className="rounded"
                />
                Khóa mục cuối cùng ({currentOptions[currentOptions.length - 1]?.label})
              </label>
            </div>
          </div>

          {/* Canvas & Code Stage (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Live Canvas */}
            <div className="relative flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-border bg-background p-8 transition-colors shadow-sm">
              <div className="absolute top-3 left-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Eye className="size-3.5 text-primary" />
                Live Preview
              </div>

              <div className="absolute top-3 right-4 flex items-center gap-2">
                <Badge variant="primary" size="sm">
                  Đang chọn: {selectedValue}
                </Badge>
              </div>

              <div className={`flex items-center justify-center transition-all duration-300 ${fullWidth ? "w-full px-4" : ""}`}>
                <SegmentedControl
                  options={currentOptions}
                  value={selectedValue}
                  onValueChange={handleValueChange}
                  aria-label="Thanh chọn phân đoạn thử nghiệm"
                  size={size}
                  fullWidth={fullWidth}
                  loading={loading}
                  disabled={disabled}
                />
              </div>

              <div className="mt-8 text-center text-xs text-muted-foreground">
                Thử dùng phím mũi tên <kbd className="rounded border border-border bg-card px-1 py-0.5 font-mono">←</kbd>{" "}
                <kbd className="rounded border border-border bg-card px-1 py-0.5 font-mono">→</kbd> để điều hướng.
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
      {/* 2. SIZES MATRIX */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kích thước linh hoạt (Size Scale)</h2>
          <p className="text-sm text-muted-foreground">
            Ba cấp độ kích cỡ chuẩn hóa đáp ứng mọi vị trí từ card toolbar đến thanh điều hướng phân trang lớn.
          </p>
        </div>

        <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          {/* Size SM */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">size=&quot;sm&quot; (Cao 32px · Chữ 12px)</span>
              <span className="text-xs text-muted-foreground">Thích hợp cho Toolbar, Header thẻ, Mobile</span>
            </div>
            <SegmentedControl
              size="sm"
              options={PRESET_TIME_OPTIONS}
              defaultValue="day"
              aria-label="Chọn thời gian nhỏ"
            />
          </div>

          {/* Size MD */}
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">size=&quot;md&quot; (Mặc định · Cao 40px · Chữ 14px)</span>
              <span className="text-xs text-muted-foreground">Chuẩn cho hầu hết các tác vụ và biểu mẫu</span>
            </div>
            <SegmentedControl
              size="md"
              options={PRESET_TIME_OPTIONS}
              defaultValue="week"
              aria-label="Chọn thời gian vừa"
            />
          </div>

          {/* Size LG */}
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">size=&quot;lg&quot; (Cao 48px · Chữ 14px nổi bật)</span>
              <span className="text-xs text-muted-foreground">Điều hướng cấp cao, màn hình TV Control Room lớn</span>
            </div>
            <SegmentedControl
              size="lg"
              options={PRESET_TIME_OPTIONS}
              defaultValue="month"
              aria-label="Chọn thời gian lớn"
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. STATES: FULL WIDTH, LOADING, DISABLED */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Các trạng thái hoạt động (States)</h2>
          <p className="text-sm text-muted-foreground">
            Hỗ trợ chế độ kéo giãn toàn chiều rộng, trạng thái đồng bộ nạp dữ liệu và vô hiệu hóa.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Full Width */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <span className="font-mono text-xs font-bold text-muted-foreground">fullWidth=&#123;true&#125;</span>
            <p className="text-xs text-muted-foreground">Chia đều chiều rộng giữa các phần tử phân đoạn.</p>
            <div className="mt-2">
              <SegmentedControl
                fullWidth
                options={PRESET_VIEW_OPTIONS}
                defaultValue="grid"
                aria-label="Xem toàn chiều rộng"
              />
            </div>
          </div>

          {/* Loading */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <span className="font-mono text-xs font-bold text-muted-foreground">loading=&#123;true&#125;</span>
            <p className="text-xs text-muted-foreground">Hiển thị spinner xoay tại ô đang được chọn trong quá trình gọi API.</p>
            <div className="mt-2">
              <SegmentedControl
                loading
                options={PRESET_VIEW_OPTIONS}
                defaultValue="analytics"
                aria-label="Trạng thái đang tải"
              />
            </div>
          </div>

          {/* Disabled Option */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <span className="font-mono text-xs font-bold text-muted-foreground">options[i].disabled: true</span>
            <p className="text-xs text-muted-foreground">Vô hiệu hóa một lựa chọn cụ thể (ví dụ: Ca đêm bị khóa tạm thời).</p>
            <div className="mt-2">
              <SegmentedControl
                options={[
                  { value: "morning", label: "Ca sáng (07:00)", icon: <Sun /> },
                  { value: "afternoon", label: "Ca chiều (15:00)", icon: <Sunset /> },
                  { value: "night", label: "Ca đêm (Khóa)", icon: <Moon />, disabled: true },
                ]}
                defaultValue="morning"
                aria-label="Tùy chọn bị khóa"
              />
            </div>
          </div>

          {/* Disabled Entire Component */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <span className="font-mono text-xs font-bold text-muted-foreground">disabled=&#123;true&#125;</span>
            <p className="text-xs text-muted-foreground">Vô hiệu hóa toàn bộ component khi người dùng không có quyền.</p>
            <div className="mt-2">
              <SegmentedControl
                disabled
                options={PRESET_VIEW_OPTIONS}
                defaultValue="grid"
                aria-label="Bị vô hiệu hóa hoàn toàn"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. KEYBOARD ACCESSIBILITY (W3C TABLIST PATTERN) */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hỗ trợ tiếp cận & Điều hướng bàn phím (W3C Pattern)</h2>
          <p className="text-sm text-muted-foreground">
            Được xây dựng chuẩn W3C ARIA Tablist Pattern với vai trò <code className="font-mono text-xs">role=&quot;tablist&quot;</code> và{" "}
            <code className="font-mono text-xs">role=&quot;tab&quot;</code>, cho phép người dùng lướt phím mượt mà không cần dùng chuột.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-background p-3.5 shadow-nm-pressed">
            <span className="font-bold text-xs text-primary flex items-center gap-1.5">
              <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[11px]">ArrowRight</kbd>
              <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[11px]">ArrowDown</kbd>
            </span>
            <p className="text-xs text-muted-foreground mt-1">Chuyển sang mục tiếp theo bên phải/dưới (tự xoay vòng).</p>
          </div>

          <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-background p-3.5 shadow-nm-pressed">
            <span className="font-bold text-xs text-primary flex items-center gap-1.5">
              <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[11px]">ArrowLeft</kbd>
              <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[11px]">ArrowUp</kbd>
            </span>
            <p className="text-xs text-muted-foreground mt-1">Chuyển sang mục trước đó bên trái/trên (tự xoay vòng).</p>
          </div>

          <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-background p-3.5 shadow-nm-pressed">
            <span className="font-bold text-xs text-primary flex items-center gap-1.5">
              <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[11px]">Home</kbd>
            </span>
            <p className="text-xs text-muted-foreground mt-1">Nhảy ngay đến mục đầu tiên khả dụng.</p>
          </div>

          <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-background p-3.5 shadow-nm-pressed">
            <span className="font-bold text-xs text-primary flex items-center gap-1.5">
              <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[11px]">End</kbd>
            </span>
            <p className="text-xs text-muted-foreground mt-1">Nhảy ngay đến mục cuối cùng khả dụng.</p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. REAL-WORLD USE CASES IN SMART PPE */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kịch bản thực tế trong hệ thống Smart PPE</h2>
          <p className="text-sm text-muted-foreground">
            Các trường hợp sử dụng Segmented Control thực tế để điều phối giao diện giám sát an toàn lao động.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Case 1: Time Interval Filter */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">Biểu đồ Tuân thủ PPE</span>
                <Badge variant="success" size="sm">98.4% Đạt</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Lọc chu kỳ đo lường chỉ số an toàn công trường</p>

              <div className="mt-4">
                <SegmentedControl
                  size="sm"
                  fullWidth
                  options={PRESET_TIME_OPTIONS}
                  value={dashboardTime}
                  onValueChange={(val) => {
                    setDashboardTime(val);
                    toast.success(`Đã cập nhật biểu đồ theo chu kỳ: ${val}`);
                  }}
                  aria-label="Lọc chu kỳ an toàn"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
              Khoảng thời gian: <strong className="text-foreground capitalize">{dashboardTime}</strong>
            </div>
          </div>

          {/* Case 2: Camera Feed Switcher */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">Giám sát Camera AI</span>
                <Badge variant="info" size="sm" indicator="dot">30 FPS</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Chuyển luồng thị giác máy tính trực tiếp</p>

              <div className="mt-4">
                <SegmentedControl
                  size="sm"
                  fullWidth
                  options={PRESET_CAMERA_OPTIONS}
                  value={activeCamera}
                  onValueChange={(val) => {
                    setActiveCamera(val);
                    toast.success(`Đã chuyển luồng hiển thị sang: ${val}`);
                  }}
                  aria-label="Chuyển đổi luồng camera"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
              Luồng RTSP: <strong className="text-primary">{activeCamera}</strong> (Đang truyền phát)
            </div>
          </div>

          {/* Case 3: Risk Filter */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">Hàng đợi Cảnh báo</span>
                <Badge variant="warning" size="sm" count={5}>Cảnh báo</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Lọc phân loại mức độ rủi ro vi phạm</p>

              <div className="mt-4">
                <SegmentedControl
                  size="sm"
                  fullWidth
                  options={PRESET_RISK_OPTIONS}
                  value={activeRiskFilter}
                  onValueChange={(val) => {
                    setActiveRiskFilter(val);
                    toast.success(`Lọc danh sách vi phạm: ${val}`);
                  }}
                  aria-label="Lọc mức độ vi phạm"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
              Bộ lọc: <strong className="text-foreground capitalize">{activeRiskFilter}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. PROPS REFERENCE TABLE */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tài liệu API & Bảng thuộc tính (SegmentedControlProps)</h2>
          <p className="text-sm text-muted-foreground">
            Toàn bộ các thuộc tính có sẵn của component <code className="font-mono text-xs">SegmentedControl</code>.
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
                <td className="px-4 py-3 font-mono font-bold text-primary">options</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">SegmentedControlOption[]</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">bắt buộc</td>
                <td className="px-4 py-3 text-foreground">Mảng các phân đoạn bao gồm value, label, icon tùy chọn và cờ disabled.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">value</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">T</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Giá trị phân đoạn được chọn (chế độ Controlled).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">defaultValue</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">T</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Giá trị khởi tạo mặc định (chế độ Uncontrolled).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">onValueChange</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">(value: T) =&gt; void</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Callback khi người dùng bấm chọn hoặc điều hướng phân đoạn mới.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">aria-label</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">string</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">bắt buộc</td>
                <td className="px-4 py-3 text-foreground">Nhãn hỗ trợ đọc màn hình cho cụm thẻ tablist.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">size</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;md&quot;</td>
                <td className="px-4 py-3 text-foreground">Kích thước: sm (32px), md (40px), lg (48px).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">fullWidth</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">boolean</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">false</td>
                <td className="px-4 py-3 text-foreground">Mở rộng 100% chiều rộng của container cha và chia đều các cột.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">loading</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">boolean</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">false</td>
                <td className="px-4 py-3 text-foreground">Hiển thị spinner xoay ở mục đang được chọn.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">disabled</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">boolean</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">false</td>
                <td className="px-4 py-3 text-foreground">Vô hiệu hóa toàn bộ thanh chuyển đổi phân đoạn.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">emptyLabel</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">string</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;Không có lựa chọn&quot;</td>
                <td className="px-4 py-3 text-foreground">Nhãn thông báo hiển thị khi mảng options rỗng.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. CODE IMPORT SNIPPET */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Hướng dẫn nhập vào dự án</h2>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs leading-6 text-foreground">
{`import { SegmentedControl, type SegmentedControlOption } from "@ui/segmented-control";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";

const options: SegmentedControlOption[] = [
  { value: "grid", label: "Lưới", icon: <LayoutGrid /> },
  { value: "list", label: "Danh sách", icon: <List /> },
];

export function ExampleUsage() {
  const [view, setView] = useState("grid");

  return (
    <SegmentedControl
      options={options}
      value={view}
      onValueChange={setView}
      aria-label="Chọn chế độ hiển thị"
      size="md"
    />
  );
}`}
          </pre>
        </div>
      </section>
    </div>
  );
}
