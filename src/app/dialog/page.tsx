"use client";

import * as React from "react";
import Link from "next/link";
import {
  ConfirmDialog,
  RecessedDialog,
  type ConfirmDialogVariant,
  type DialogSize,
  type DialogDepth,
  type DialogBorder,
} from "@ui/dialog";
import { Button } from "@ui/button";
import { toast } from "@ui/toast";
import {
  ShieldAlert,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Sliders,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ChevronRight,
  Eye,
  Camera,
  Layers,
  ArrowRight,
  Info,
  Radio,
  SlidersHorizontal,
  Flame,
  Volume2,
  ShieldCheck,
  Power,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function DialogShowcasePage() {
  // Studio choice: "confirm" | "recessed"
  const [dialogType, setDialogType] = React.useState<"confirm" | "recessed">("confirm");

  // ConfirmDialog playground state
  const [confirmVariant, setConfirmVariant] = React.useState<ConfirmDialogVariant>("danger");
  const [confirmTitle, setConfirmTitle] = React.useState("Xác nhận hủy liên kết thiết bị?");
  const [confirmDescription, setConfirmDescription] = React.useState(
    "Hành động này sẽ ngắt camera AI khỏi mạng giám sát an toàn trung tâm và tạm dừng phân tích vi phạm PPE.",
  );
  const [confirmItemName, setConfirmItemName] = React.useState("Camera AI #04 - Giàn giáo tầng 4 Khối B");
  const [confirmBtnText, setConfirmBtnText] = React.useState("Xác nhận gỡ thiết bị");
  const [cancelBtnText, setCancelBtnText] = React.useState("Giữ lại");
  const [simulateAsync, setSimulateAsync] = React.useState(true);
  const [closeOnOverlay, setCloseOnOverlay] = React.useState(true);
  const [closeOnEscape, setCloseOnEscape] = React.useState(true);

  // RecessedDialog playground state
  const [recessedSize, setRecessedSize] = React.useState<DialogSize>("md");
  const [recessedDepth, setRecessedDepth] = React.useState<DialogDepth>("medium");
  const [recessedBorder, setRecessedBorder] = React.useState<DialogBorder>("subtle");
  const [recessedTitle, setRecessedTitle] = React.useState("Cấu hình ngưỡng phân tích thị giác AI");
  const [recessedDesc, setRecessedDesc] = React.useState("Điều chỉnh độ nhạy phát hiện vi phạm mũ bảo hộ và dây an toàn.");

  // Open states for studio
  const [isConfirmPlaygroundOpen, setIsConfirmPlaygroundOpen] = React.useState(false);
  const [isRecessedPlaygroundOpen, setIsRecessedPlaygroundOpen] = React.useState(false);

  // Real-world demo dialog states
  const [isDemoDangerOpen, setIsDemoDangerOpen] = React.useState(false);
  const [isDemoWarningOpen, setIsDemoWarningOpen] = React.useState(false);
  const [isDemoDefaultOpen, setIsDemoDefaultOpen] = React.useState(false);
  const [isDemoRecessedCameraOpen, setIsDemoRecessedCameraOpen] = React.useState(false);
  const [isDemoRecessedSirenOpen, setIsDemoRecessedSirenOpen] = React.useState(false);

  // Recessed demo slider
  const [confidence, setConfidence] = React.useState(85);
  const [fps, setFps] = React.useState("30");

  const [copied, setCopied] = React.useState(false);

  const generatedCode = React.useMemo(() => {
    if (dialogType === "confirm") {
      const lines: string[] = [];
      lines.push(`<ConfirmDialog`);
      lines.push(`  open={isOpen}`);
      lines.push(`  onClose={() => setIsOpen(false)}`);
      lines.push(`  onConfirm={async () => {`);
      lines.push(`    // Tác vụ bất đồng bộ xử lý xóa hoặc phê duyệt`);
      lines.push(`    await deleteDeviceApi();`);
      lines.push(`    setIsOpen(false);`);
      lines.push(`  }}`);
      lines.push(`  variant="${confirmVariant}"`);
      lines.push(`  title="${confirmTitle}"`);
      lines.push(`  description="${confirmDescription}"`);
      if (confirmItemName) lines.push(`  itemName="${confirmItemName}"`);
      if (confirmBtnText) lines.push(`  confirmText="${confirmBtnText}"`);
      if (cancelBtnText) lines.push(`  cancelText="${cancelBtnText}"`);
      if (!closeOnOverlay) lines.push(`  closeOnOverlayClick={false}`);
      if (!closeOnEscape) lines.push(`  closeOnEscape={false}`);
      lines.push(`/>`);
      return lines.join("\n");
    } else {
      const lines: string[] = [];
      lines.push(`<RecessedDialog`);
      lines.push(`  open={isOpen}`);
      lines.push(`  onOpenChange={setIsOpen}`);
      lines.push(`  title="${recessedTitle}"`);
      if (recessedDesc) lines.push(`  description="${recessedDesc}"`);
      if (recessedSize !== "md") lines.push(`  size="${recessedSize}"`);
      if (recessedDepth !== "medium") lines.push(`  depth="${recessedDepth}"`);
      if (recessedBorder !== "subtle") lines.push(`  border="${recessedBorder}"`);
      lines.push(`  footer={`);
      lines.push(`    <>`);
      lines.push(`      <Button variant="ghost" onClick={() => setIsOpen(false)}>Hủy</Button>`);
      lines.push(`      <Button variant="primary" onClick={() => setIsOpen(false)}>Áp dụng</Button>`);
      lines.push(`    </>`);
      lines.push(`  }`);
      lines.push(`>`);
      lines.push(`  <div className="space-y-3">`);
      lines.push(`    <p>Nội dung cấu hình phòng điều khiển...</p>`);
      lines.push(`  </div>`);
      lines.push(`</RecessedDialog>`);
      return lines.join("\n");
    }
  }, [
    dialogType,
    confirmVariant,
    confirmTitle,
    confirmDescription,
    confirmItemName,
    confirmBtnText,
    cancelBtnText,
    closeOnOverlay,
    closeOnEscape,
    recessedTitle,
    recessedDesc,
    recessedSize,
    recessedDepth,
    recessedBorder,
  ]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Đã sao chép mã JSX Dialog vào clipboard!");
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
          <span className="text-primary font-bold">Dialog (Hộp thoại quyết định & cảnh báo)</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Dialog</h1>
            <p className="mt-2 text-base text-muted-foreground leading-relaxed max-w-3xl">
              Hệ thống hộp thoại Neumorphism tập trung cao độ cho các quyết định dứt khoát: xác nhận hành động
              không thể hoàn tác (Destructive Confirmations), cảnh báo an toàn khẩn cấp (Emergency Alerts),
              và bảng điều khiển âm tường kiểu phòng vận hành máy móc (Recessed Control Console).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm">
              <Sparkles className="size-3.5 text-accent" />
              ConfirmDialog & Recessed Console
            </span>
            <Link
              href="/modal"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Cần biểu mẫu dài hoặc báo cáo đa cột? Xem Modal
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
              Studio thử nghiệm trực tiếp Dialog
            </h2>
            <p className="text-sm text-muted-foreground">
              Tùy biến trực tiếp giữa hộp thoại Xác nhận Cao cấp (ConfirmDialog) và Hộp thoại Âm tường (RecessedDialog).
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setDialogType("confirm");
              setConfirmVariant("danger");
              setConfirmTitle("Xác nhận hủy liên kết thiết bị?");
              setConfirmDescription(
                "Hành động này sẽ ngắt camera AI khỏi mạng giám sát an toàn trung tâm và tạm dừng phân tích vi phạm PPE.",
              );
              setConfirmItemName("Camera AI #04 - Giàn giáo tầng 4 Khối B");
              setConfirmBtnText("Xác nhận gỡ thiết bị");
              setCancelBtnText("Giữ lại");
              setSimulateAsync(true);
              setCloseOnOverlay(true);
              setCloseOnEscape(true);

              setRecessedSize("md");
              setRecessedDepth("medium");
              setRecessedBorder("subtle");
              setRecessedTitle("Cấu hình ngưỡng phân tích thị giác AI");
              setRecessedDesc("Điều chỉnh độ nhạy phát hiện vi phạm mũ bảo hộ và dây an toàn.");
              toast.success("Đã hoàn tác cấu hình mặc định Dialog");
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
            {/* 1. Dialog Type Switcher */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                1. Dòng Dialog (Component Type)
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDialogType("confirm")}
                  className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    dialogType === "confirm"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "border border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="block font-bold">ConfirmDialog</span>
                  <span className="block text-[10px] opacity-80 mt-0.5">Xác nhận hành động & cảnh báo 3D</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDialogType("recessed")}
                  className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    dialogType === "recessed"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "border border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="block font-bold">RecessedDialog</span>
                  <span className="block text-[10px] opacity-80 mt-0.5">Bảng điều khiển âm tường máy móc</span>
                </button>
              </div>
            </div>

            {/* If ConfirmDialog */}
            {dialogType === "confirm" && (
              <div className="flex flex-col gap-4 border-t border-border pt-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    2. Mức độ cảnh báo (Variant)
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmVariant("danger");
                        setConfirmTitle("Xác nhận xóa camera khỏi mạng lưới?");
                        setConfirmBtnText("Xác nhận xóa vĩnh viễn");
                      }}
                      className={`rounded-xl py-2 text-xs font-bold transition-all ${
                        confirmVariant === "danger"
                          ? "bg-danger text-white shadow-md"
                          : "border border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Danger (Nguy hiểm)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmVariant("warning");
                        setConfirmTitle("Cảnh báo vi phạm an toàn nghiêm trọng");
                        setConfirmBtnText("Đình chỉ thi công ngay");
                      }}
                      className={`rounded-xl py-2 text-xs font-bold transition-all ${
                        confirmVariant === "warning"
                          ? "bg-warning text-white shadow-md"
                          : "border border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Warning (Cảnh báo)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmVariant("default");
                        setConfirmTitle("Xác nhận kích hoạt giám sát ca đêm?");
                        setConfirmBtnText("Kích hoạt ngay");
                      }}
                      className={`rounded-xl py-2 text-xs font-bold transition-all ${
                        confirmVariant === "default"
                          ? "bg-primary text-white shadow-md"
                          : "border border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Default (Tiêu chuẩn)
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Tiêu đề (Title)</label>
                    <input
                      type="text"
                      value={confirmTitle}
                      onChange={(e) => setConfirmTitle(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Mô tả (Description)</label>
                    <input
                      type="text"
                      value={confirmDescription}
                      onChange={(e) => setConfirmDescription(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Tên mục sắp tác động (Item Name Preview)</label>
                    <input
                      type="text"
                      value={confirmItemName}
                      onChange={(e) => setConfirmItemName(e.target.value)}
                      placeholder="Để trống nếu không muốn hiển thị preview card..."
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">Nút Confirm</label>
                      <input
                        type="text"
                        value={confirmBtnText}
                        onChange={(e) => setConfirmBtnText(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">Nút Cancel</label>
                      <input
                        type="text"
                        value={cancelBtnText}
                        onChange={(e) => setCancelBtnText(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-primary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulateAsync}
                      onChange={(e) => setSimulateAsync(e.target.checked)}
                      className="rounded"
                    />
                    Giả lập Async Loading (2s)
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={closeOnOverlay}
                      onChange={(e) => setCloseOnOverlay(e.target.checked)}
                      className="rounded"
                    />
                    Đóng khi bấm nền
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
                </div>
              </div>
            )}

            {/* If RecessedDialog */}
            {dialogType === "recessed" && (
              <div className="flex flex-col gap-4 border-t border-border pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      2. Kích thước (Size)
                    </label>
                    <div className="mt-2 flex gap-1 rounded-xl border border-border bg-background p-1">
                      {(["sm", "md", "lg"] as DialogSize[]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRecessedSize(s)}
                          className={`flex-1 rounded-lg py-1 text-xs font-bold transition-all uppercase ${
                            recessedSize === s
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
                      3. Độ sâu 3D (Depth)
                    </label>
                    <div className="mt-2 flex gap-1 rounded-xl border border-border bg-background p-1">
                      {(["soft", "medium", "deep"] as DialogDepth[]).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setRecessedDepth(d)}
                          className={`flex-1 rounded-lg py-1 text-xs font-bold transition-all capitalize ${
                            recessedDepth === d
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

                <div className="flex flex-col gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Tiêu đề (Title)</label>
                    <input
                      type="text"
                      value={recessedTitle}
                      onChange={(e) => setRecessedTitle(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Mô tả (Description)</label>
                    <input
                      type="text"
                      value={recessedDesc}
                      onChange={(e) => setRecessedDesc(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Launchpad & Code View (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Launch Box */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background p-8 text-center min-h-[280px]">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card shadow-nm-sm mb-4">
                {dialogType === "confirm" ? (
                  confirmVariant === "danger" ? (
                    <Trash2 className="size-7 text-danger" />
                  ) : confirmVariant === "warning" ? (
                    <AlertTriangle className="size-7 text-warning" />
                  ) : (
                    <ShieldAlert className="size-7 text-primary" />
                  )
                ) : (
                  <SlidersHorizontal className="size-7 text-info" />
                )}
              </div>

              <h3 className="text-lg font-bold text-foreground">
                {dialogType === "confirm"
                  ? `Sẵn sàng kích hoạt ConfirmDialog (${confirmVariant.toUpperCase()})`
                  : `Sẵn sàng kích hoạt RecessedDialog (${recessedSize.toUpperCase()})`}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                {dialogType === "confirm"
                  ? "Tích hợp hiệu ứng quỹ đạo quay 360°, đèn LED pulsing, hero icon 3D và async loading."
                  : "Thiết kế vỏ khoét âm tường với bề mặt nổi cơ khí chuyên dùng cho phòng vận hành."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Button
                  variant={dialogType === "confirm" ? (confirmVariant === "danger" ? "danger" : "primary") : "secondary"}
                  size="lg"
                  onClick={() => {
                    if (dialogType === "confirm") {
                      setIsConfirmPlaygroundOpen(true);
                    } else {
                      setIsRecessedPlaygroundOpen(true);
                    }
                  }}
                  className="shadow-nm"
                >
                  <Eye className="size-4 mr-1.5" />
                  Mở thử nghiệm Dialog ngay
                </Button>
              </div>
            </div>

            {/* Generated Code */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  {dialogType === "confirm" ? "ConfirmDialog JSX" : "RecessedDialog JSX"}
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
      {/* 2. MODAL VS DIALOG DECISION MATRIX */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="size-5 text-primary" />
            Ma trận lựa chọn: Khi nào dùng Modal vs Khi nào dùng Dialog?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Việc tách biệt rõ ràng giữa Modal và Dialog giúp nâng cao trải nghiệm người dùng, tránh gây quá tải thị giác
            và đảm bảo các thao tác nguy hiểm luôn được cân nhắc cẩn trọng.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-background text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Tiêu chí phân định</th>
                <th className="px-4 py-3 font-semibold text-primary">Modal (SculptedModal)</th>
                <th className="px-4 py-3 font-semibold text-danger">Dialog (ConfirmDialog & Recessed)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-3 font-bold text-foreground">1. Mục đích chính</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Cung cấp không gian làm việc phụ để <strong className="text-foreground">nhập liệu, xem xét tài liệu</strong>, phân tích báo cáo và hoàn thành biểu mẫu.
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Yêu cầu <strong className="text-foreground">ra quyết định dứt khoát</strong> (Xác nhận/Hủy), cảnh báo nguy cơ an toàn hoặc ra lệnh điều khiển tức thì.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-foreground">2. Độ phức tạp nội dung</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Trung bình đến Rất cao (Nhiều trường input, bảng đa cột, wizards đa bước, đồ thị, tab cuộn).
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Rất tinh gọn (Một câu hỏi then chốt, đoạn giải thích rủi ro ngắn gọn, thẻ xem trước mục sắp xóa).
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-foreground">3. Kích thước & Cuộn trang</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Linh hoạt từ <code className="font-mono text-primary">md (512px)</code> đến <code className="font-mono text-primary">xl (896px)</code> và <code className="font-mono text-primary">full</code>, có thanh cuộn mượt mà.
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Gọn gàng tối đa (<code className="font-mono text-danger">max-w-[440px]</code>), toàn bộ nội dung hiển thị trọn vẹn trong một khung nhìn không cần cuộn.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-foreground">4. Tâm lý & Tác động nhận thức</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Tâm thế tập trung làm việc (Working focus), cho phép người dùng dừng lại suy nghĩ, chỉnh sửa dữ liệu.
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Tâm thế khẩn cấp (Interruptive attention), bắt buộc xác nhận hoặc hủy bỏ trước khi quay lại giao diện chính.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-foreground">5. Thành phần trong hệ thống</td>
                <td className="px-4 py-3 font-mono font-bold text-primary">SculptedModal</td>
                <td className="px-4 py-3 font-mono font-bold text-danger">ConfirmDialog / RecessedDialog</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. REAL-WORLD DEMOS IN SMART PPE */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kịch bản thực tế trong hệ thống Smart PPE</h2>
          <p className="text-sm text-muted-foreground">
            Các trường hợp sử dụng Dialog thực tế tại công trường xây dựng thông minh.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Demo 1: Confirm Danger */}
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-danger/25 bg-danger/[0.02] p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-danger">
                <Trash2 className="size-5" />
                <h4 className="font-bold text-sm">Xóa Trạm Camera AI (Danger)</h4>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Hủy đăng ký thiết bị khỏi hệ thống giám sát. Có thẻ item preview và trạng thái async xóa an toàn.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsDemoDangerOpen(true)}
              className="mt-3 w-full"
            >
              Thử xác nhận xóa thiết bị
            </Button>
          </div>

          {/* Demo 2: Confirm Warning */}
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-warning/25 bg-warning/[0.02] p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="size-5" />
                <h4 className="font-bold text-sm">Đình Chỉ Thi Công Khẩn Cấp</h4>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Phát hiện giàn giáo rung lắc hoặc công nhân không móc dây cứu sinh liên tục, cưỡng chế ngắt nguồn điện.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDemoWarningOpen(true)}
              className="mt-3 w-full border-warning/40 text-warning hover:bg-warning/10"
            >
              Thử phát lệnh đình chỉ
            </Button>
          </div>

          {/* Demo 3: Confirm Default */}
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-primary/25 bg-primary/[0.02] p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="size-5" />
                <h4 className="font-bold text-sm">Kích Hoạt Ca Đêm (Standard)</h4>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Bật toàn bộ hệ thống đèn hồng ngoại và camera quét nhiệt độ trên cao phục vụ đổ bê tông ban đêm.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsDemoDefaultOpen(true)}
              className="mt-3 w-full"
            >
              Thử xác nhận ca đêm
            </Button>
          </div>

          {/* Demo 4: Recessed Camera Settings */}
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-info">
                <Camera className="size-5" />
                <h4 className="font-bold text-sm">Bảng Điều Khiển Camera (Recessed)</h4>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Hộp thoại kiểu bảng gắn âm tường cho phép kỹ sư vận hành tinh chỉnh độ nhạy phát hiện PPE.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDemoRecessedCameraOpen(true)}
              className="mt-3 w-full"
            >
              Chỉnh thông số Camera
            </Button>
          </div>

          {/* Demo 5: Recessed Siren Activation */}
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-danger">
                <Volume2 className="size-5" />
                <h4 className="font-bold text-sm">Kích Hoạt Còi Hú Báo Động</h4>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Bảng điều khiển âm tường cơ khí với công tắc kích hoạt còi báo động khẩn cấp và loa phát thanh.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsDemoRecessedSirenOpen(true)}
              className="mt-3 w-full"
            >
              Bảng còi báo động khẩn
            </Button>
          </div>

          {/* Toast testing quick card */}
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-foreground">
                <Sparkles className="size-5 text-accent" />
                <h4 className="font-bold text-sm">Tích hợp WoodenToast</h4>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Tất cả các hành động từ chối, xóa thành công hoặc hủy bỏ trong Dialog đều phát Toast chỉ báo.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => toast.success("Đã ghi nhận quyết định từ Dialog!")}
              >
                Toast Success
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => toast.error("Hủy bỏ thao tác nguy hiểm!")}
              >
                Toast Danger
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. PROPS REFERENCE TABLE */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tài liệu API & Bảng thuộc tính (ConfirmDialogProps)</h2>
          <p className="text-sm text-muted-foreground">
            Các thuộc tính cấu hình cho <code className="font-mono text-xs">ConfirmDialog</code>.
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
                <td className="px-4 py-3 text-foreground">Trạng thái đóng/mở của hộp thoại xác nhận.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">onClose</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">() =&gt; void</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">bắt buộc</td>
                <td className="px-4 py-3 text-foreground">Callback khi người dùng bấm Hủy hoặc đóng hộp thoại.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">onConfirm</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">() =&gt; void | Promise&lt;void&gt;</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">bắt buộc</td>
                <td className="px-4 py-3 text-foreground">Hàm thực thi khi xác nhận. Tự động hiển thị spinner loading khi trả về Promise.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">variant</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;danger&quot; | &quot;warning&quot; | &quot;default&quot;</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;danger&quot;</td>
                <td className="px-4 py-3 text-foreground">Mức độ cảnh báo: Đỏ (Xóa dữ liệu), Cam/Vàng (Nguy cơ), Xanh (Hành động thường).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">title</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">string</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;Are you absolutely sure?&quot;</td>
                <td className="px-4 py-3 text-foreground">Câu hỏi xác nhận chính.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">description</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">string</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">Đoạn giải thích rủi ro</td>
                <td className="px-4 py-3 text-foreground">Mô tả hậu quả của hành động để người dùng cân nhắc.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">itemName</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">string</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">undefined</td>
                <td className="px-4 py-3 text-foreground">Tên đối tượng sắp bị tác động (hiển thị trong khung preview bảo vệ dữ liệu).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">confirmText</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">string</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;Yes, delete it&quot;</td>
                <td className="px-4 py-3 text-foreground">Chữ trên nút xác nhận.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">cancelText</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">string</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">&quot;Keep it&quot;</td>
                <td className="px-4 py-3 text-foreground">Chữ trên nút hủy bỏ.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">closeOnOverlayClick</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">boolean</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">true</td>
                <td className="px-4 py-3 text-foreground">Cho phép đóng khi click vào nền mờ bên ngoài.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-primary">closeOnEscape</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">boolean</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">true</td>
                <td className="px-4 py-3 text-foreground">Cho phép bấm phím Escape để hủy bỏ an toàn.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. CODE IMPORT SNIPPET */}
      {/* ========================================================= */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Hướng dẫn nhập vào dự án</h2>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs leading-6 text-foreground">
{`import {
  ConfirmDialog,
  RecessedDialog,
  type ConfirmDialogProps,
} from "@ui/dialog";
import { Button } from "@ui/button";

export function DeleteCameraWorkflow() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Xóa Camera AI
      </Button>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        variant="danger"
        title="Xác nhận hủy liên kết thiết bị?"
        description="Camera sẽ ngắt khỏi mạng lưới giám sát bảo hộ lao động."
        itemName="Camera AI #04 - Khối B"
        confirmText="Xác nhận xóa vĩnh viễn"
        cancelText="Giữ lại thiết bị"
        onConfirm={async () => {
          await api.deleteDevice();
          setOpen(false);
        }}
      />
    </>
  );
}`}
          </pre>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ACTIVE DIALOGS RENDERED VIA PORTAL */}
      {/* ========================================================= */}

      {/* 1. PLAYGROUND CONFIRM DIALOG */}
      <ConfirmDialog
        open={isConfirmPlaygroundOpen}
        onClose={() => setIsConfirmPlaygroundOpen(false)}
        variant={confirmVariant}
        title={confirmTitle}
        description={confirmDescription}
        itemName={confirmItemName || undefined}
        confirmText={confirmBtnText}
        cancelText={cancelBtnText}
        closeOnOverlayClick={closeOnOverlay}
        closeOnEscape={closeOnEscape}
        onConfirm={async () => {
          if (simulateAsync) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
          setIsConfirmPlaygroundOpen(false);
          toast.success("Đã hoàn tất hành động trong ConfirmDialog!");
        }}
      />

      {/* 2. PLAYGROUND RECESSED DIALOG */}
      <RecessedDialog
        open={isRecessedPlaygroundOpen}
        onOpenChange={setIsRecessedPlaygroundOpen}
        title={recessedTitle}
        description={recessedDesc}
        size={recessedSize}
        depth={recessedDepth}
        border={recessedBorder}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsRecessedPlaygroundOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsRecessedPlaygroundOpen(false);
                toast.success("Đã lưu tham số điều khiển RecessedDialog!");
              }}
            >
              Áp dụng tham số
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-muted-foreground">
            Bảng điều khiển kiểu khoang máy cơ khí gắn âm tường dành cho phòng vận hành trung tâm.
          </p>
          <div className="rounded-xl border border-border bg-card p-3 shadow-nm-pressed">
            <span className="font-bold text-foreground">Trạng thái kết nối máy chủ phân tích:</span>
            <p className="text-success font-semibold mt-0.5">● Hoạt động ổn định (Độ trễ 18ms)</p>
          </div>
        </div>
      </RecessedDialog>

      {/* 3. DEMO: DANGER CONFIRM (CAMERA DELETE) */}
      <ConfirmDialog
        open={isDemoDangerOpen}
        onClose={() => setIsDemoDangerOpen(false)}
        variant="danger"
        title="Xác nhận xóa camera khỏi mạng lưới?"
        description="Hành động này sẽ ngắt hoàn toàn dữ liệu RTSP và tạm dừng việc phát hiện vi phạm PPE tại giàn giáo tầng 4."
        itemName="Camera AI #04 (IP: 192.168.10.44) - Khu vực Giàn giáo Khối B"
        confirmText="Xác nhận gỡ vĩnh viễn"
        cancelText="Giữ lại thiết bị"
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setIsDemoDangerOpen(false);
          toast.error("Đã ngắt kết nối Camera AI #04 khỏi hệ thống!");
        }}
      />

      {/* 4. DEMO: WARNING CONFIRM (SUSPEND WORK) */}
      <ConfirmDialog
        open={isDemoWarningOpen}
        onClose={() => setIsDemoWarningOpen(false)}
        variant="warning"
        title="Cưỡng chế đình chỉ thi công Zone B?"
        description="Phát hiện liên tiếp 3 công nhân không cài dây an toàn trên cao. Cán bộ giám sát có chắc chắn muốn ngắt cầu dao thi công và lập biên bản?"
        itemName="Zone B - Giàn giáo tầng 4 (12 công nhân đang thao tác)"
        confirmText="Đình chỉ thi công ngay"
        cancelText="Bỏ qua cảnh báo"
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setIsDemoWarningOpen(false);
          toast.success("Đã phát lệnh đình chỉ thi công tới toàn bộ chỉ huy trưởng!");
        }}
      />

      {/* 5. DEMO: DEFAULT CONFIRM (NIGHT SHIFT) */}
      <ConfirmDialog
        open={isDemoDefaultOpen}
        onClose={() => setIsDemoDefaultOpen(false)}
        variant="default"
        title="Kích hoạt chế độ kiểm định ca đêm?"
        description="Hệ thống sẽ chuyển sang mô hình YOLO-PPE IR Thermal, kích hoạt đèn chiếu sáng khẩn cấp và còi nhắc nhở tự động."
        itemName="Ca đổ bê tông móng trụ trục C-D (22:00 - 05:00)"
        confirmText="Kích hoạt ca đêm"
        cancelText="Để sau"
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          setIsDemoDefaultOpen(false);
          toast.success("Đã kích hoạt chế độ giám sát an toàn ca đêm thành công!");
        }}
      />

      {/* 6. DEMO: RECESSED CAMERA CONFIG */}
      <RecessedDialog
        open={isDemoRecessedCameraOpen}
        onOpenChange={setIsDemoRecessedCameraOpen}
        title="Cấu hình luồng phân tích Camera AI #02"
        description="Tối ưu hóa ngưỡng phát hiện trang thiết bị bảo hộ cá nhân (PPE)"
        size="md"
        border="accent"
        accentColor="var(--info)"
        icon={<Camera size={20} className="text-info" />}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDemoRecessedCameraOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsDemoRecessedCameraOpen(false);
                toast.success(`Đã cập nhật ngưỡng AI thành ${confidence}% và tốc độ ${fps} FPS!`);
              }}
            >
              Áp dụng cấu hình
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between items-center">
              <label className="font-semibold text-foreground">Ngưỡng tự tin phát hiện mũ bảo hộ (Confidence)</label>
              <span className="font-mono font-bold text-primary">{confidence}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--primary)]"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground">Tần suất trích xuất khung hình</label>
            <select
              value={fps}
              onChange={(e) => setFps(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-card p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-nm-pressed"
            >
              <option value="15">15 khung hình / giây (Tiết kiệm băng thông)</option>
              <option value="30">30 khung hình / giây (Độ trễ siêu thấp - Khuyên dùng)</option>
              <option value="60">60 khung hình / giây (Phân tích tốc độ cao)</option>
            </select>
          </div>

          <div className="rounded-xl border border-border bg-card p-3 shadow-nm-inset">
            <span className="font-semibold text-foreground">Vùng cấm gắn cờ ưu tiên cao nhất:</span>
            <p className="mt-1 text-muted-foreground leading-relaxed">
              Khu vực hố móng và vận thăng tải được kích hoạt còi báo động tại chỗ khi công nhân bỏ trang bị bảo hộ.
            </p>
          </div>
        </div>
      </RecessedDialog>

      {/* 7. DEMO: RECESSED SIREN ACTIVATION */}
      <RecessedDialog
        open={isDemoRecessedSirenOpen}
        onOpenChange={setIsDemoRecessedSirenOpen}
        title="Kích hoạt còi hú báo động khẩn cấp"
        description="Phát tín hiệu còi hú và thông báo loa tới toàn bộ khu vực công trường"
        size="sm"
        border="accent"
        accentColor="var(--danger)"
        icon={<Volume2 size={20} className="text-danger" />}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsDemoRecessedSirenOpen(false)}>
              Đóng
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setIsDemoRecessedSirenOpen(false);
                toast.error("Đã phát lệnh kích hoạt còi hú báo động công trường!");
              }}
            >
              Kích hoạt còi báo động
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-danger">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="size-4" />
              Quy trình báo động khẩn cấp
            </p>
            <p className="text-[11px] mt-1 text-foreground/80 leading-relaxed">
              Hành động này sẽ kích hoạt hệ thống còi 110dB và gửi thông báo SMS khẩn cấp tới Ban chỉ huy công trường.
            </p>
          </div>
        </div>
      </RecessedDialog>
    </div>
  );
}
