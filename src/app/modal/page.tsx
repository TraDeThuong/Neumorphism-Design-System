"use client";

import * as React from "react";
import Link from "next/link";
import {
  SculptedModal,
  type ModalSize,
  type ModalDepth,
  type ModalBorder,
  type ModalEffect,
} from "@ui/modal";
import { Button } from "@ui/button";
import { toast } from "@ui/toast";
import {
  Layers,
  Sliders,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Camera,
  ChevronRight,
  Eye,
  Info,
  Settings,
  ShieldAlert,
  HardHat,
  SlidersHorizontal,
  Bell,
  CheckCircle2,
  ExternalLink,
  ClipboardList,
  UserCheck,
  FileText,
  Radio,
  ArrowRight,
  Sparkle,
} from "lucide-react";

const SIZE_OPTIONS: ModalSize[] = ["sm", "md", "lg", "xl", "full"];
const DEPTH_OPTIONS: ModalDepth[] = ["soft", "medium", "deep"];
const BORDER_OPTIONS: ModalBorder[] = ["none", "subtle", "accent", "glow"];
const EFFECT_OPTIONS: ModalEffect[] = ["raised", "inset", "flat"];

const ACCENT_PRESETS = [
  { label: "Mặc định (Primary Blue)", value: "" },
  { label: "Nguy hiểm (Danger Red)", value: "var(--danger)" },
  { label: "An toàn (Success Green)", value: "var(--success)" },
  { label: "Cảnh báo (Warning Amber)", value: "var(--warning)" },
  { label: "Thông tin (Info Sky)", value: "var(--info)" },
];

export default function ModalShowcasePage() {
  // Playground state
  const [size, setSize] = React.useState<ModalSize>("md");
  const [depth, setDepth] = React.useState<ModalDepth>("medium");
  const [border, setBorder] = React.useState<ModalBorder>("subtle");
  const [accentColor, setAccentColor] = React.useState<string>("");
  const [contentEffect, setContentEffect] = React.useState<ModalEffect>("inset");
  const [iconEffect, setIconEffect] = React.useState<ModalEffect>("raised");
  const [footerEffect, setFooterEffect] = React.useState<ModalEffect>("inset");

  const [title, setTitle] = React.useState("Biên bản kiểm tra trang bị bảo hộ");
  const [description, setDescription] = React.useState(
    "Xác nhận dữ liệu kiểm định thiết bị an toàn cá nhân (PPE) trước khi cấp quyền ra vào công trường.",
  );
  const [hasIcon, setHasIcon] = React.useState(true);
  const [hasFooter, setHasFooter] = React.useState(true);
  const [hasDescription, setHasDescription] = React.useState(true);
  const [closeOnBackdrop, setCloseOnBackdrop] = React.useState(true);
  const [closeOnEscape, setCloseOnEscape] = React.useState(true);
  const [showCloseButton, setShowCloseButton] = React.useState(true);
  const [preventClose, setPreventClose] = React.useState(false);

  // Playground modal open state
  const [isPlaygroundOpen, setIsPlaygroundOpen] = React.useState(false);

  // Demo modals state
  const [isIncidentDetailOpen, setIsIncidentDetailOpen] = React.useState(false);
  const [isDeviceAssignOpen, setIsDeviceAssignOpen] = React.useState(false);
  const [isInspectionDashboardOpen, setIsInspectionDashboardOpen] = React.useState(false);
  const [isPreShiftWizardOpen, setIsPreShiftWizardOpen] = React.useState(false);
  const [wizardStep, setWizardStep] = React.useState<1 | 2 | 3>(1);

  // Form demo state
  const [assignWorker, setAssignWorker] = React.useState("Nguyễn Văn An (NV-0842)");
  const [assignGear, setAssignGear] = React.useState("Mũ bảo hộ thông minh kèm cảm biến va đập");
  const [assignRfid, setAssignRfid] = React.useState("RFID-PPE-8821-X4");

  const [copied, setCopied] = React.useState(false);

  const generatedCode = React.useMemo(() => {
    const lines: string[] = [];
    lines.push(`<SculptedModal`);
    lines.push(`  open={isOpen}`);
    lines.push(`  onOpenChange={setIsOpen}`);
    lines.push(`  title="${title}"`);
    if (hasDescription && description) lines.push(`  description="${description}"`);
    if (size !== "md") lines.push(`  size="${size}"`);
    if (depth !== "medium") lines.push(`  depth="${depth}"`);
    if (border !== "subtle") lines.push(`  border="${border}"`);
    if (accentColor) lines.push(`  accentColor="${accentColor}"`);
    if (hasIcon) lines.push(`  icon={<ShieldCheck size={20} strokeWidth={2} />}`);
    if (contentEffect !== "inset") lines.push(`  contentEffect="${contentEffect}"`);
    if (iconEffect !== "raised") lines.push(`  iconEffect="${iconEffect}"`);
    if (footerEffect !== "inset") lines.push(`  footerEffect="${footerEffect}"`);
    if (!closeOnBackdrop) lines.push(`  closeOnBackdrop={false}`);
    if (!closeOnEscape) lines.push(`  closeOnEscape={false}`);
    if (!showCloseButton) lines.push(`  showCloseButton={false}`);
    if (preventClose) lines.push(`  preventClose={true}`);

    if (hasFooter) {
      lines.push(`  footer={`);
      lines.push(`    <>`);
      lines.push(`      <Button variant="ghost" onClick={() => setIsOpen(false)}>Hủy</Button>`);
      lines.push(`      <Button variant="primary" onClick={() => setIsOpen(false)}>Lưu hồ sơ</Button>`);
      lines.push(`    </>`);
      lines.push(`  }`);
    }

    lines.push(`>`);
    lines.push(`  <div className="space-y-3">`);
    lines.push(`    <p>Nội dung biểu mẫu hoặc chi tiết hồ sơ Neumorphic...</p>`);
    lines.push(`  </div>`);
    lines.push(`</SculptedModal>`);

    return lines.join("\n");
  }, [
    title,
    hasDescription,
    description,
    size,
    depth,
    border,
    accentColor,
    hasIcon,
    contentEffect,
    iconEffect,
    footerEffect,
    closeOnBackdrop,
    closeOnEscape,
    showCloseButton,
    preventClose,
    hasFooter,
  ]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Đã sao chép mã JSX Modal vào clipboard!");
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
          <span className="text-primary font-bold">Modal (Hộp thoại nội dung)</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Modal</h1>
            <p className="mt-2 text-base text-muted-foreground leading-relaxed max-w-3xl">
              Cửa sổ phụ phong cách Neumorphism với cấu trúc 3 tầng quang học đồng tâm (Outer Rim → Transition Groove
              → Inner Shell). Thiết kế chuyên biệt cho các tác vụ biểu mẫu phức tạp, bảng kiểm định đa cột,
              hồ sơ sự cố chi tiết và quy trình phân tích dữ liệu chuyên sâu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm">
              <Sparkles className="size-3.5 text-accent" />
              Sculpted 3-Tier Neumorphic Modal
            </span>
            <Link
              href="/dialog"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Cần hộp thoại xác nhận / cảnh báo? Xem Dialog
              <ArrowRight className="size-3" />
            </Link>
          </div>
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
              Studio thử nghiệm trực tiếp Modal
            </h2>
            <p className="text-sm text-muted-foreground">
              Tùy biến các tham số quang học 3D, kiểm tra hành vi cuộn và tương tác, sao chép mã nguồn tích hợp ngay lập tức.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSize("md");
              setDepth("medium");
              setBorder("subtle");
              setAccentColor("");
              setContentEffect("inset");
              setIconEffect("raised");
              setFooterEffect("inset");
              setTitle("Biên bản kiểm tra trang bị bảo hộ");
              setDescription(
                "Xác nhận dữ liệu kiểm định thiết bị an toàn cá nhân (PPE) trước khi cấp quyền ra vào công trường.",
              );
              setHasIcon(true);
              setHasFooter(true);
              setHasDescription(true);
              setCloseOnBackdrop(true);
              setCloseOnEscape(true);
              setShowCloseButton(true);
              setPreventClose(false);
              toast.success("Đã hoàn tác cấu hình mặc định Modal");
            }}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <RotateCcw className="size-3.5" />
            Đặt lại
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Controls (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm overflow-y-auto max-h-[720px]">
            {/* 1. Size & Depth */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  1. Kích thước (Size)
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
                  2. Độ sâu 3D (Depth)
                </label>
                <div className="mt-2 flex gap-1 rounded-xl border border-border bg-background p-1">
                  {DEPTH_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDepth(d)}
                      className={`flex-1 rounded-lg py-1 text-xs font-bold transition-all capitalize ${
                        depth === d
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Border & Accent */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  3. Viền ngoài (Border)
                </label>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {BORDER_OPTIONS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBorder(b)}
                      className={`rounded-lg py-1 text-xs font-medium transition-all capitalize ${
                        border === b
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  4. Màu điểm nhấn (Accent)
                </label>
                <select
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {ACCENT_PRESETS.map((p) => (
                    <option key={p.label} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Surface Effects */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                5. Hiệu ứng bề mặt các phân vùng (Surface Effects)
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground">Nội dung (Content):</span>
                  <select
                    value={contentEffect}
                    onChange={(e) => setContentEffect(e.target.value as ModalEffect)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {EFFECT_OPTIONS.map((eff) => (
                      <option key={eff} value={eff}>
                        {eff}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground">Khối Icon:</span>
                  <select
                    value={iconEffect}
                    onChange={(e) => setIconEffect(e.target.value as ModalEffect)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {EFFECT_OPTIONS.map((eff) => (
                      <option key={eff} value={eff}>
                        {eff}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground">Thanh Footer:</span>
                  <select
                    value={footerEffect}
                    onChange={(e) => setFooterEffect(e.target.value as ModalEffect)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {EFFECT_OPTIONS.map((eff) => (
                      <option key={eff} value={eff}>
                        {eff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Text controls */}
            <div className="flex flex-col gap-2.5 border-t border-border pt-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Tiêu đề Modal (Title)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Mô tả phụ đề (Description)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* 5. Toggles */}
            <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasIcon}
                  onChange={(e) => setHasIcon(e.target.checked)}
                  className="rounded"
                />
                Icon nổi 3D
              </label>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFooter}
                  onChange={(e) => setHasFooter(e.target.checked)}
                  className="rounded"
                />
                Thanh Footer thao tác
              </label>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={closeOnBackdrop}
                  onChange={(e) => setCloseOnBackdrop(e.target.checked)}
                  className="rounded"
                />
                Đóng khi bấm nền mờ
              </label>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={closeOnEscape}
                  onChange={(e) => setCloseOnEscape(e.target.checked)}
                  className="rounded"
                />
                Phím Escape đóng
              </label>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCloseButton}
                  onChange={(e) => setShowCloseButton(e.target.checked)}
                  className="rounded"
                />
                Nút X góc trên
              </label>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-danger cursor-pointer">
                <input
                  type="checkbox"
                  checked={preventClose}
                  onChange={(e) => setPreventClose(e.target.checked)}
                  className="rounded"
                />
                Khóa đóng (preventClose)
              </label>
            </div>
          </div>

          {/* Launchpad & Code View (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Launch Box */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background p-8 text-center min-h-[280px]">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card shadow-nm-sm mb-4">
                <Layers className="size-7 text-primary" />
              </div>

              <h3 className="text-lg font-bold text-foreground">Sẵn sàng kích hoạt SculptedModal</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                Kích thước: <strong className="text-foreground uppercase">{size}</strong> · Độ sâu:{" "}
                <strong className="text-foreground capitalize">{depth}</strong> · Viền:{" "}
                <strong className="text-foreground capitalize">{border}</strong> · Lõi:{" "}
                <strong className="text-foreground capitalize">{contentEffect}</strong>
              </p>

              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsPlaygroundOpen(true)}
                  className="shadow-nm"
                >
                  <Eye className="size-4 mr-1.5" />
                  Mở thử nghiệm Modal ngay
                </Button>
              </div>
            </div>

            {/* Generated Code */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  SculptedModal JSX Generator
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
      {/* 2. THREE-TIER NEUMORPHIC ARCHITECTURE */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Cấu trúc 3 tầng quang học đồng tâm của SculptedModal
          </h2>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Khác với các cửa sổ thông thường chỉ có một lớp phẳng, SculptedModal sử dụng 3 bề mặt Neumorphic đồng tâm
            để tạo chiều sâu thị giác tự nhiên, giúp người dùng không bị mỏi mắt khi nhập liệu biểu mẫu dài.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Tier 1 */}
          <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-foreground">Outer Rim (Vành nổi ngoài)</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Vành đúc nổi 3D với hệ bóng kép hai chiều (Shadow Light & Shadow Dark). Nâng toàn bộ khung hộp thoại
              lên cao hơn mặt phẳng nền làm mờ (Backdrop Blur), tạo ranh giới quang học vững chãi.
            </p>
          </div>

          {/* Tier 2 */}
          <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-accent/20 text-accent font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-foreground">Transition Groove (Rãnh chuyển tiếp)</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Rãnh chìm trung gian giảm dần cường độ tương phản. Hoạt động như một đường chỉ tiêu giảm rung quang học
              trong công nghệ cơ khí chính xác, định hình khối trước khi đi vào khu vực nội dung.
            </p>
          </div>

          {/* Tier 3 */}
          <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-success/15 text-success font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-foreground">Inner Inset Shell (Lõi khắc sâu)</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bề mặt khắc âm vào thân hộp thoại (Inset Shadow). Tạo cảm giác một mặt bàn làm việc chuyên biệt,
              tập trung tuyệt đối điểm nhìn của người thao tác vào form nhập liệu và báo cáo dữ liệu.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. REAL-WORLD DEMOS IN SMART PPE */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kịch bản thực tế trong hệ thống Smart PPE</h2>
          <p className="text-sm text-muted-foreground">
            Các mẫu Modal nghiệp vụ hoàn chỉnh được thiết kế riêng cho công trường xây dựng thông minh.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Demo 1: Incident Report */}
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-5">
            <div>
              <div className="flex items-center gap-2 text-danger">
                <ShieldAlert className="size-5" />
                <h4 className="font-bold text-sm">Hồ sơ Vi phạm PPE</h4>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Kích thước lớn (lg), hiển thị chi tiết hình ảnh trích xuất camera AI, mã công nhân và nhật ký vi phạm.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsIncidentDetailOpen(true)}
              className="mt-3 w-full"
            >
              Xem hồ sơ vi phạm
            </Button>
          </div>

          {/* Demo 2: Device Assignment Form */}
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-5">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <HardHat className="size-5" />
                <h4 className="font-bold text-sm">Gán Thiết bị Bảo hộ</h4>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Kích thước vừa (md), chứa biểu mẫu nhập liệu gán mũ thông minh, dây đai an toàn và thẻ RFID.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsDeviceAssignOpen(true)}
              className="mt-3 w-full"
            >
              Mở Form cấp phát
            </Button>
          </div>

          {/* Demo 3: Safety Inspection Dashboard */}
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-5">
            <div>
              <div className="flex items-center gap-2 text-success">
                <ClipboardList className="size-5" />
                <h4 className="font-bold text-sm">Ma trận Tuân thủ An toàn</h4>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Kích thước siêu rộng (xl), chứa bảng ma trận kiểm định 6 hạng mục an toàn lao động toàn dự án.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsInspectionDashboardOpen(true)}
              className="mt-3 w-full"
            >
              Xem ma trận an toàn
            </Button>
          </div>

          {/* Demo 4: Pre-Shift Wizard */}
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-5">
            <div>
              <div className="flex items-center gap-2 text-accent">
                <UserCheck className="size-5" />
                <h4 className="font-bold text-sm">Quy trình Điểm danh Đầu ca</h4>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Quy trình 3 bước (Wizard) kiểm tra thân nhiệt, xác nhận trang bị và cấp thẻ ra vào ca làm việc mới.
              </p>
            </div>
            <Button
              variant="sculpted"
              size="sm"
              onClick={() => {
                setWizardStep(1);
                setIsPreShiftWizardOpen(true);
              }}
              className="mt-3 w-full"
            >
              Bắt đầu kiểm tra ca
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. MODAL & TOAST INTEGRATION */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            Tích hợp Modal & WoodenToast (toast.tsx)
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Mọi hành động hoàn tất biểu mẫu hoặc cảnh báo từ bên trong Modal đều được liên kết trực tiếp với
            hệ thống thông báo <strong className="text-foreground">WoodenToast</strong> (viền gỗ nổi 3D, icon trạng thái sinh động).
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Success Toast */}
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-background p-4 shadow-nm-pressed">
              <div>
                <span className="font-bold text-xs text-success flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  Toast Thành công (Success)
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Kích hoạt khi người dùng hoàn thành và lưu biểu mẫu trong Modal.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => toast.success("Đã lưu hồ sơ an toàn lao động vào cơ sở dữ liệu!")}
                className="w-full mt-2"
              >
                Bắn Toast Thành công
              </Button>
            </div>

            {/* 2. Error Toast */}
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-background p-4 shadow-nm-pressed">
              <div>
                <span className="font-bold text-xs text-danger flex items-center gap-1.5">
                  <AlertTriangle className="size-4" />
                  Toast Báo lỗi (Error)
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Kích hoạt khi thông tin trong biểu mẫu Modal chưa hợp lệ.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => toast.error("Dữ liệu biểu mẫu không hợp lệ: Thiếu mã thẻ RFID!")}
                className="w-full mt-2"
              >
                Bắn Toast Báo lỗi
              </Button>
            </div>

            {/* 3. Loading Toast */}
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-background p-4 shadow-nm-pressed">
              <div>
                <span className="font-bold text-xs text-warning flex items-center gap-1.5">
                  <RotateCcw className="size-4" />
                  Toast Đang tải (Loading)
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Kích hoạt khi Modal đang đồng bộ dữ liệu đám mây.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const id = toast.loading("Đang nén và mã hóa hồ sơ kiểm định PPE...");
                  setTimeout(() => {
                    toast.dismiss(id);
                    toast.success("Mã hóa và lưu trữ hoàn tất!");
                  }, 2000);
                }}
                className="w-full mt-2"
              >
                Bắn Toast Đang tải (2s)
              </Button>
            </div>

            {/* 4. Blank / Info Toast */}
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-background p-4 shadow-nm-pressed">
              <div>
                <span className="font-bold text-xs text-info flex items-center gap-1.5">
                  <Info className="size-4" />
                  Toast Hướng dẫn (Blank)
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Kích hoạt chỉ dẫn thao tác cho người dùng.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast("Nhấn phím Tab để di chuyển qua lại giữa các trường nhập liệu.")}
                className="w-full mt-2"
              >
                Bắn Toast Hướng dẫn
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. PROPS REFERENCE TABLE */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tài liệu API & Bảng thuộc tính (ModalProps)</h2>
          <p className="text-sm text-muted-foreground">
            Các thuộc tính cấu hình chuẩn của component <code className="font-mono text-xs">SculptedModal</code>.
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
                <td className="px-4 py-3 font-mono font-bold text-primary">open</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">boolean</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">bắt buộc</td>
                <td className="px-4 py-3 text-foreground">Trạng thái đóng/mở của Modal.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">onOpenChange</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">(open: boolean) =&gt; void</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">bắt buộc</td>
                <td className="px-4 py-3 text-foreground">Callback đồng bộ trạng thái đóng/mở khi người dùng tương tác.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">title</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">string</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">bắt buộc</td>
                <td className="px-4 py-3 text-foreground">Tiêu đề chính trên thanh Header của Modal.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">description</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">string</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Đoạn phụ đề giải thích ngữ cảnh bên dưới tiêu đề.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">size</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot; | &quot;xl&quot; | &quot;full&quot;</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;md&quot;</td>
                <td className="px-4 py-3 text-foreground">Chiều rộng tối đa (sm: 384px, md: 512px, lg: 672px, xl: 896px, full: 100%).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">depth</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;soft&quot; | &quot;medium&quot; | &quot;deep&quot;</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;medium&quot;</td>
                <td className="px-4 py-3 text-foreground">Cường độ bóng Neumorphic sáng tối 3D.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">border</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;none&quot; | &quot;subtle&quot; | &quot;accent&quot; | &quot;glow&quot;</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;subtle&quot;</td>
                <td className="px-4 py-3 text-foreground">Kiểu viền ngoài: không viền, viền mờ, viền đồng bộ màu điểm nhấn hoặc phát sáng neon.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">contentEffect</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;raised&quot; | &quot;inset&quot; | &quot;flat&quot;</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;inset&quot;</td>
                <td className="px-4 py-3 text-foreground">Hiệu ứng bề mặt của khối nội dung bên trong Modal.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">icon</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">ReactNode</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Biểu tượng nổi ở góc trái tiêu đề.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">footer</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">ReactNode</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Thanh điều hướng hoặc các nút bấm hành động ở chân Modal.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">closeOnBackdrop</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">boolean</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">true</td>
                <td className="px-4 py-3 text-foreground">Cho phép đóng khi click vào vùng nền mờ bên ngoài.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">closeOnEscape</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">boolean</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">true</td>
                <td className="px-4 py-3 text-foreground">Cho phép đóng khi nhấn phím Escape trên bàn phím.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">preventClose</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">boolean</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">false</td>
                <td className="px-4 py-3 text-foreground">Khóa đóng bắt buộc người dùng hoàn tất thao tác.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. CODE IMPORT SNIPPET */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Hướng dẫn nhập vào dự án</h2>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs leading-6 text-foreground">
{`import {
  SculptedModal,
  type ModalProps,
} from "@ui/modal";
import { Button } from "@ui/button";

export function WorkerInspectionModal() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Xem Biên Bản Kiểm Định</Button>

      <SculptedModal
        open={open}
        onOpenChange={setOpen}
        title="Biên bản kiểm tra an toàn"
        description="Kiểm tra tuân thủ thiết bị bảo hộ trước giờ thi công"
        size="md"
        depth="medium"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Hủy</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>Lưu hồ sơ</Button>
          </>
        }
      >
        <div className="space-y-3">
          <p>Nội dung biên bản và biểu mẫu...</p>
        </div>
      </SculptedModal>
    </>
  );
}`}
          </pre>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ACTIVE MODALS RENDERED VIA PORTAL */}
      {/* ========================================================= */}

      {/* 1. PLAYGROUND MODAL */}
      <SculptedModal
        open={isPlaygroundOpen}
        onOpenChange={setIsPlaygroundOpen}
        title={title}
        description={hasDescription ? description : undefined}
        size={size}
        depth={depth}
        border={border}
        accentColor={accentColor || undefined}
        contentEffect={contentEffect}
        iconEffect={iconEffect}
        footerEffect={footerEffect}
        icon={hasIcon ? <ShieldCheck size={20} strokeWidth={2} /> : undefined}
        closeOnBackdrop={closeOnBackdrop}
        closeOnEscape={closeOnEscape}
        showCloseButton={showCloseButton}
        preventClose={preventClose}
        footer={
          hasFooter ? (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsPlaygroundOpen(false);
                  toast("Đã đóng Modal");
                }}
              >
                Hủy bỏ
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsPlaygroundOpen(false);
                  toast.success("Đã ghi nhận dữ liệu an toàn thành công!");
                }}
              >
                Xác nhận lưu
              </Button>
            </>
          ) : undefined
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card/60 p-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Thông số cấu hình hiện tại</h4>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>Kích thước: <strong className="text-foreground uppercase">{size}</strong></div>
              <div>Độ sâu 3D: <strong className="text-foreground capitalize">{depth}</strong></div>
              <div>Kiểu viền: <strong className="text-foreground capitalize">{border}</strong></div>
              <div>Lõi nội dung: <strong className="text-foreground capitalize">{contentEffect}</strong></div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Modal Neumorphism sử dụng cơ chế <code className="font-mono text-primary">createPortal</code> gắn trực tiếp
            vào <code className="font-mono text-primary">document.body</code>. Tự động kích hoạt khóa cuộn trang nền,
            bẫy tiêu điểm bàn phím (Focus Trap) và lắng nghe phím Escape.
          </p>

          <div className="rounded-xl border border-border bg-card p-3.5 shadow-nm-pressed space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Bell className="size-3.5" />
              Thử nghiệm bắn WoodenToast từ trong Modal:
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Button
                variant="primary"
                size="sm"
                onClick={() => toast.success("Đã lưu hồ sơ từ Modal!")}
              >
                Toast Success
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => toast.error("Vi phạm phát hiện từ Modal!")}
              >
                Toast Error
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast.loading("Đang đồng bộ dữ liệu...")}
              >
                Toast Loading
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast("Chỉ dẫn thao tác từ Modal.")}
              >
                Toast Info
              </Button>
            </div>
          </div>
        </div>
      </SculptedModal>

      {/* 2. DEMO 1: INCIDENT DETAIL MODAL (LG) */}
      <SculptedModal
        open={isIncidentDetailOpen}
        onOpenChange={setIsIncidentDetailOpen}
        title="Chi tiết cảnh báo vi phạm bảo hộ lao động"
        description="Ghi nhận tự động bởi Camera AI số #04 lúc 14:32:05 tại Công trường Landmark D08"
        size="lg"
        border="accent"
        accentColor="var(--danger)"
        icon={<ShieldAlert size={20} className="text-danger" />}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsIncidentDetailOpen(false)}>
              Đóng hồ sơ
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setIsIncidentDetailOpen(false);
                toast.success("Đã gửi thông báo nhắc nhở khẩn tới kỹ sư giám sát ca!");
              }}
            >
              Phát cảnh báo khẩn cấp
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-3 shadow-nm-pressed">
              <span className="text-[11px] font-semibold text-muted-foreground">Khu vực phát hiện:</span>
              <p className="text-sm font-bold text-foreground mt-0.5">Giàn giáo tầng 4 - Khối B</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 shadow-nm-pressed">
              <span className="text-[11px] font-semibold text-muted-foreground">Lỗi nhận diện:</span>
              <p className="text-sm font-bold text-danger mt-0.5">Không đeo dây đai an toàn toàn thân</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Mã định danh công nhân:</span>
              <span className="font-mono font-bold text-foreground">NV-2026-0842 (Nguyễn Văn An)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Độ chính xác mô hình AI:</span>
              <span className="font-bold text-success">98.6% (YOLO-PPEv8 Industrial)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Thời gian vi phạm liên tục:</span>
              <span className="font-bold text-warning">45 giây (Vượt ngưỡng 10s cảnh báo)</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card/70 p-3.5 text-xs text-muted-foreground">
            <span className="font-bold text-foreground">Biện pháp xử lý đề xuất:</span> Tạm dừng thi công khu vực
            khối B trong 15 phút, yêu cầu cán bộ an toàn kiểm tra khóa móc neo cáp cứu sinh.
          </div>
        </div>
      </SculptedModal>

      {/* 3. DEMO 2: DEVICE ASSIGNMENT FORM MODAL (MD) */}
      <SculptedModal
        open={isDeviceAssignOpen}
        onOpenChange={setIsDeviceAssignOpen}
        title="Cấp phát & Gán thiết bị bảo hộ thông minh"
        description="Đăng ký mã định danh RFID và đồng bộ hồ sơ kiểm định an toàn thiết bị"
        size="md"
        border="subtle"
        icon={<HardHat size={20} className="text-primary" />}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeviceAssignOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsDeviceAssignOpen(false);
                toast.success(`Đã gán thiết bị cho ${assignWorker}!`);
              }}
            >
              Lưu & Kích hoạt RFID
            </Button>
          </>
        }
      >
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-foreground">Công nhân tiếp nhận:</label>
            <input
              type="text"
              value={assignWorker}
              onChange={(e) => setAssignWorker(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-card p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-nm-inset"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground">Chủng loại thiết bị:</label>
            <select
              value={assignGear}
              onChange={(e) => setAssignGear(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-card p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option>Mũ bảo hộ thông minh kèm cảm biến va đập</option>
              <option>Dây đai an toàn 5 điểm kèm móc giảm chấn</option>
              <option>Áo phản quang gắn chip định vị UWB</option>
              <option>Kính bảo hộ chống văng bắn chuẩn ANSI Z87.1</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-foreground">Mã chip RFID:</label>
              <input
                type="text"
                value={assignRfid}
                onChange={(e) => setAssignRfid(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-card p-2 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary shadow-nm-inset"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Hạn kiểm định:</label>
              <input
                type="text"
                defaultValue="26/10/2027"
                className="mt-1 w-full rounded-xl border border-border bg-card p-2 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary shadow-nm-inset"
              />
            </div>
          </div>
        </div>
      </SculptedModal>

      {/* 4. DEMO 3: INSPECTION DASHBOARD MODAL (XL) */}
      <SculptedModal
        open={isInspectionDashboardOpen}
        onOpenChange={setIsInspectionDashboardOpen}
        title="Bảng ma trận kiểm soát tuân thủ an toàn toàn dự án"
        description="Tổng hợp dữ liệu theo thời gian thực từ 12 camera AI phân tích thị giác máy tính"
        size="xl"
        border="glow"
        accentColor="var(--success)"
        icon={<ClipboardList size={20} className="text-success" />}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsInspectionDashboardOpen(false)}>
              Đóng bảng
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsInspectionDashboardOpen(false);
                toast.success("Đã xuất báo cáo kiểm định PDF!");
              }}
            >
              Xuất báo cáo PDF
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border bg-card p-3 shadow-nm-pressed text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Tổng nhân sự tại chỗ</span>
              <p className="text-lg font-extrabold text-foreground mt-1">142 người</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 shadow-nm-pressed text-center">
              <span className="text-[10px] uppercase font-bold text-success">Tuân thủ đầy đủ</span>
              <p className="text-lg font-extrabold text-success mt-1">138 (97.2%)</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 shadow-nm-pressed text-center">
              <span className="text-[10px] uppercase font-bold text-danger">Vi phạm phát hiện</span>
              <p className="text-lg font-extrabold text-danger mt-1">4 trường hợp</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 shadow-nm-pressed text-center">
              <span className="text-[10px] uppercase font-bold text-info">Camera hoạt động</span>
              <p className="text-lg font-extrabold text-info mt-1">12 / 12 trạm</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-background">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-card text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-semibold">Tổ đội thi công</th>
                  <th className="px-3 py-2 font-semibold">Vị trí</th>
                  <th className="px-3 py-2 font-semibold">Mũ bảo hộ</th>
                  <th className="px-3 py-2 font-semibold">Dây an toàn</th>
                  <th className="px-3 py-2 font-semibold">Áo phản quang</th>
                  <th className="px-3 py-2 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-3 py-2 font-bold text-foreground">Đội Cốt thép số 1</td>
                  <td className="px-3 py-2 text-muted-foreground">Hố móng Zone A</td>
                  <td className="px-3 py-2 text-success">✓ 100%</td>
                  <td className="px-3 py-2 text-success">✓ Đạt</td>
                  <td className="px-3 py-2 text-success">✓ 100%</td>
                  <td className="px-3 py-2 text-success font-bold">Chuẩn</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-foreground">Đội Giàn giáo Khối B</td>
                  <td className="px-3 py-2 text-muted-foreground">Tầng 4 Block B</td>
                  <td className="px-3 py-2 text-success">✓ 100%</td>
                  <td className="px-3 py-2 text-danger font-bold">⚠ 1 lỗi dây đai</td>
                  <td className="px-3 py-2 text-success">✓ 100%</td>
                  <td className="px-3 py-2 text-danger font-bold">Cảnh báo</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-foreground">Đội Điện công trình</td>
                  <td className="px-3 py-2 text-muted-foreground">Tầng hầm B1</td>
                  <td className="px-3 py-2 text-success">✓ 100%</td>
                  <td className="px-3 py-2 text-muted-foreground">—</td>
                  <td className="px-3 py-2 text-success">✓ 100%</td>
                  <td className="px-3 py-2 text-success font-bold">Chuẩn</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </SculptedModal>

      {/* 5. DEMO 4: PRE-SHIFT WIZARD MODAL (MD) */}
      <SculptedModal
        open={isPreShiftWizardOpen}
        onOpenChange={setIsPreShiftWizardOpen}
        title={`Điểm danh & Kiểm tra an toàn trước ca (${wizardStep}/3)`}
        description={
          wizardStep === 1
            ? "Bước 1: Quét thân nhiệt & xác nhận thẻ nhận diện"
            : wizardStep === 2
              ? "Bước 2: Kiểm tra trang thiết bị bảo hộ bắt buộc"
              : "Bước 3: Cam kết an toàn & Cấp quyền vào công trường"
        }
        size="md"
        border="accent"
        icon={<UserCheck size={20} className="text-primary" />}
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              variant="ghost"
              disabled={wizardStep === 1}
              onClick={() => setWizardStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev))}
            >
              Quay lại
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsPreShiftWizardOpen(false)}>
                Hủy
              </Button>
              {wizardStep < 3 ? (
                <Button
                  variant="primary"
                  onClick={() => setWizardStep((prev) => ((prev + 1) as 1 | 2 | 3))}
                >
                  Tiếp theo
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsPreShiftWizardOpen(false);
                    toast.success("Đã hoàn tất điểm danh và cấp quyền qua cổng!");
                  }}
                >
                  Hoàn tất & Cấp thẻ
                </Button>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          {wizardStep === 1 && (
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-3 shadow-nm-pressed flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground">Thân nhiệt đo tự động:</span>
                  <p className="text-base font-bold text-success mt-0.5">36.5 °C (Bình thường)</p>
                </div>
                <CheckCircle2 className="size-6 text-success" />
              </div>
              <div className="rounded-xl border border-border bg-card p-3 shadow-nm-pressed">
                <span className="text-[11px] font-semibold text-muted-foreground">Trạng thái thẻ NFC:</span>
                <p className="text-sm font-bold text-foreground mt-0.5">NV-0842 - Hợp lệ</p>
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-2.5">
              <p className="font-semibold text-foreground">Xác nhận các trang bị mang theo:</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Mũ bảo hộ có quai cài đúng quy cách</span>
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Giày mũi thép chống đâm xuyên</span>
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Áo phản quang đạt độ sáng tiêu chuẩn</span>
                </label>
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-3">
              <div className="rounded-xl border border-success/30 bg-success/10 p-4 text-center">
                <CheckCircle2 className="size-10 text-success mx-auto mb-2" />
                <h4 className="font-bold text-sm text-foreground">Đủ điều kiện an toàn lao động!</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Công nhân đã hoàn thành đầy đủ các bước kiểm định trước ca thi công.
                </p>
              </div>
            </div>
          )}
        </div>
      </SculptedModal>
    </div>
  );
}
