"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableToolbar,
  TableFilter,
  TableBulkActions,
  TableContent,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableSelectionHeader,
  TableSelectionRow,
  TableRowActions,
  TableEditableCell,
  type TableVariant,
  type TableFeatureSet,
  type TableColumnFilter,
} from "@ui/table";
import { Button } from "@ui/button";
import { Badge } from "@ui/badge";
import { ConfirmDialog } from "@ui/dialog";
import { SculptedModal } from "@ui/modal";
import { toast } from "@ui/toast";
import {
  Table2,
  Search,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ShieldAlert,
  Trash2,
  Eye,
  CheckCircle2,
  Layers,
  Activity,
  ChevronRight,
  HardHat,
  Camera,
  Radio,
  Sliders,
  Battery,
  AlertOctagon,
  Cpu,
  RefreshCw,
  Columns3,
  Pencil,
  CheckSquare,
  MoveRight,
  Zap,
  Clock,
  ShieldCheck,
  Smartphone,
  SlidersHorizontal,
} from "lucide-react";

// ==========================================
// 1. MOCK DATA & TYPES: SMART PPE SYSTEM
// ==========================================

interface DeviceRecord {
  id: string;
  code: string;
  name: string;
  type: "camera" | "sensor" | "gate" | "drone";
  location: string;
  zone: string;
  status: "active" | "warning" | "offline";
  battery: number;
  confidence: number;
  inspector: string;
  lastSync: string;
}

const INITIAL_DEVICES: DeviceRecord[] = [
  {
    id: "DEV-01",
    code: "CAM-AI-01",
    name: "Camera AI Giám Sát Cổng B1",
    type: "camera",
    location: "Khu vực cổng phụ vào công trường",
    zone: "Phân khu B",
    status: "active",
    battery: 98,
    confidence: 97,
    inspector: "Nguyễn Văn Hùng",
    lastSync: "2 phút trước",
  },
  {
    id: "DEV-02",
    code: "CAM-AI-02",
    name: "Camera Nhận Diện Mũ Tầng 12",
    type: "camera",
    location: "Giàn giáo mặt ngoài Khối C",
    zone: "Phân khu C",
    status: "warning",
    battery: 45,
    confidence: 88,
    inspector: "Trần Đình Khang",
    lastSync: "5 phút trước",
  },
  {
    id: "DEV-03",
    code: "SNS-FALL-09",
    name: "Cảm Biến Dây Cứu Sinh Trục 4",
    type: "sensor",
    location: "Sàn thao tác cốp pha tầng mái",
    zone: "Phân khu A",
    status: "active",
    battery: 82,
    confidence: 99,
    inspector: "Lê Minh Tuấn",
    lastSync: "Vừa xong",
  },
  {
    id: "DEV-04",
    code: "GATE-RFID-02",
    name: "Cổng Điểm Danh & Quét Thẻ PPE",
    type: "gate",
    location: "Lối đi bộ nhân công Cổng Chính",
    zone: "Phân khu A",
    status: "active",
    battery: 100,
    confidence: 95,
    inspector: "Nguyễn Văn Hùng",
    lastSync: "1 phút trước",
  },
  {
    id: "DEV-05",
    code: "CAM-AI-05",
    name: "Camera Nhiệt Khu Hàn Xì",
    type: "camera",
    location: "Xưởng gia công cơ khí ngầm",
    zone: "Phân khu D",
    status: "offline",
    battery: 12,
    confidence: 72,
    inspector: "Phạm Quốc Dũng",
    lastSync: "45 phút trước",
  },
  {
    id: "DEV-06",
    code: "SNS-GAS-01",
    name: "Cảm Biến Khí Độc Hầm Móng",
    type: "sensor",
    location: "Hố đào sâu móng trục 8-12",
    zone: "Phân khu D",
    status: "active",
    battery: 91,
    confidence: 99,
    inspector: "Lê Minh Tuấn",
    lastSync: "Vừa xong",
  },
  {
    id: "DEV-07",
    code: "DRN-PATROL-01",
    name: "Flycam Tự Hành Tuần Tra Biên",
    type: "drone",
    location: "Trạm đỗ không người lái tầng thượng",
    zone: "Toàn dự án",
    status: "active",
    battery: 76,
    confidence: 94,
    inspector: "Trần Đình Khang",
    lastSync: "3 phút trước",
  },
  {
    id: "DEV-08",
    code: "SNS-FALL-14",
    name: "Cảm Biến Cẩu Tháp 02",
    type: "sensor",
    location: "Cabin & Tay cần cẩu tháp 50m",
    zone: "Phân khu C",
    status: "warning",
    battery: 33,
    confidence: 84,
    inspector: "Phạm Quốc Dũng",
    lastSync: "12 phút trước",
  },
];

interface ViolationRecord {
  id: string;
  workerName: string;
  workerId: string;
  department: string;
  violation: string;
  severity: "danger" | "warning" | "info";
  time: string;
  zone: string;
  confidence: number;
}

const VIOLATION_DATA: ViolationRecord[] = [
  {
    id: "VIO-101",
    workerName: "Hoàng Văn Nam",
    workerId: "CN-8841",
    department: "Tổ Giàn Giáo & Cốp Pha",
    violation: "Tháo dây an toàn khi thao tác tầng 8",
    severity: "danger",
    time: "10:24:18",
    zone: "Giàn giáo Khối C",
    confidence: 96.8,
  },
  {
    id: "VIO-102",
    workerName: "Đặng Quốc Bảo",
    workerId: "CN-7203",
    department: "Tổ Cơ Điện M&E",
    violation: "Không cài quai mũ bảo hộ tiêu chuẩn",
    severity: "warning",
    time: "10:18:05",
    zone: "Sảnh kỹ thuật Tầng 2",
    confidence: 92.4,
  },
  {
    id: "VIO-103",
    workerName: "Trịnh Đình Long",
    workerId: "CN-6149",
    department: "Đội Vận Chuyển Vật Tư",
    violation: "Đi vào vùng cẩu tải nguy hiểm",
    severity: "danger",
    time: "09:55:40",
    zone: "Bãi tập kết cọc",
    confidence: 98.2,
  },
  {
    id: "VIO-104",
    workerName: "Bùi Thị Mai",
    workerId: "CN-9012",
    department: "Tổ Vệ Sinh Công Nghiệp",
    violation: "Không mặc áo phản quang đúng quy cách",
    severity: "info",
    time: "09:40:12",
    zone: "Đường nội bộ số 1",
    confidence: 89.1,
  },
  {
    id: "VIO-105",
    workerName: "Vũ Tuấn Kiệt",
    workerId: "CN-4418",
    department: "Tổ Cốt Thép Dầm",
    violation: "Sử dụng găng tay rách mép tiếp xúc cạnh sắc",
    severity: "warning",
    time: "09:15:33",
    zone: "Sàn tầng hầm B2",
    confidence: 86.5,
  },
];

interface InventoryRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  helmetSerial: string;
  shoesSize: number;
  certExpiry: string;
  status: "valid" | "expiring" | "expired";
}

const INVENTORY_DATA: InventoryRecord[] = [
  {
    id: "INV-01",
    name: "Phan Thanh Tùng",
    role: "Kỹ sư giám sát",
    department: "Ban An Toàn",
    helmetSerial: "HL-PRO-8819",
    shoesSize: 42,
    certExpiry: "2027-12-31",
    status: "valid",
  },
  {
    id: "INV-02",
    name: "Nguyễn Hải Đăng",
    role: "Chỉ huy trưởng",
    department: "Ban Quản Lý Dự Án",
    helmetSerial: "HL-VIP-0021",
    shoesSize: 41,
    certExpiry: "2027-08-15",
    status: "valid",
  },
  {
    id: "INV-03",
    name: "Đỗ Gia Huy",
    role: "Thợ hàn điện",
    department: "Cơ khí kết cấu",
    helmetSerial: "HL-WELD-302",
    shoesSize: 43,
    certExpiry: "2026-11-05",
    status: "expiring",
  },
  {
    id: "INV-04",
    name: "Lâm Quốc Trọng",
    role: "Thợ đu dây sơn ngoài",
    department: "Hoàn thiện",
    helmetSerial: "HL-ROPE-110",
    shoesSize: 40,
    certExpiry: "2026-09-30",
    status: "expired",
  },
  {
    id: "INV-05",
    name: "Cao Minh Vương",
    role: "Vận hành cẩu tháp",
    department: "Cơ giới",
    helmetSerial: "HL-CRANE-05",
    shoesSize: 42,
    certExpiry: "2028-01-20",
    status: "valid",
  },
];

export default function TableShowcasePage() {
  // ------------------------------------------
  // STUDIO PLAYGROUND STATE
  // ------------------------------------------
  const [variant, setVariant] = React.useState<TableVariant>("soft");
  const [showSearch, setShowSearch] = React.useState(true);
  const [showColumnVisibility, setShowColumnVisibility] = React.useState(true);
  const [showSelection, setShowSelection] = React.useState(true);
  const [showPagination, setShowPagination] = React.useState(true);
  const [showFilterBar, setShowFilterBar] = React.useState(true);
  const [showInlineEdit, setShowInlineEdit] = React.useState(true);
  const [simulateLoading, setSimulateLoading] = React.useState(false);
  const [simulateEmpty, setSimulateEmpty] = React.useState(false);

  // Editable Studio Data
  const [devices, setDevices] = React.useState<DeviceRecord[]>(INITIAL_DEVICES);

  // Modal vs Dialog states
  // 1. MODAL: Detailed telemetry / profile viewer
  const [modalDevice, setModalDevice] = React.useState<DeviceRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // 2. DIALOG: Dangerous action confirmation (Delete single item)
  const [dialogDevice, setDialogDevice] = React.useState<DeviceRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // 3. DIALOG: Bulk Delete confirmation
  const [isBulkDialogOpen, setIsBulkDialogOpen] = React.useState(false);

  // Code Copy State
  const [copied, setCopied] = React.useState(false);

  // Cell Edit Handler
  const handleCellEdit = React.useCallback(
    ({ row, columnId, value }: { row: DeviceRecord; rowId: string; columnId: string; previousValue: unknown; value: unknown }) => {
      setDevices((prev) =>
        prev.map((item) => {
          if (item.id === row.id) {
            return {
              ...item,
              [columnId]: value,
            };
          }
          return item;
        }),
      );
      toast.success(`Đã cập nhật ${columnId} thành "${String(value)}"`);
    },
    [],
  );

  // Handlers for Modal & Dialog
  const handleOpenDetailModal = (device: DeviceRecord) => {
    setModalDevice(device);
    setIsModalOpen(true);
  };

  const handleOpenDeleteDialog = (device: DeviceRecord) => {
    setDialogDevice(device);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!dialogDevice) return;
    await new Promise((r) => setTimeout(r, 600));
    setDevices((prev) => prev.filter((d) => d.id !== dialogDevice.id));
    toast.success(`Đã gỡ thiết bị ${dialogDevice.name} khỏi trạm giám sát`);
    setIsDialogOpen(false);
    setDialogDevice(null);
  };

  const handleConfirmBulkDelete = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setDevices([]);
    toast.success("Đã xóa toàn bộ bản ghi được chọn");
    setIsBulkDialogOpen(false);
  };

  // Studio Columns Definition
  const studioColumns = React.useMemo<ColumnDef<TableFeatureSet, DeviceRecord, any>[]>(() => {
    const cols: ColumnDef<TableFeatureSet, DeviceRecord, any>[] = [];

    if (showSelection) {
      cols.push({
        id: "select",
        header: () => <TableSelectionHeader />,
        cell: ({ row }) => <TableSelectionRow row={row} />,
        enableSorting: false,
        enableColumnFilter: false,
      });
    }

    cols.push(
      {
        accessorKey: "code",
        header: "Mã thiết bị",
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-background border border-border/40 font-mono text-xs font-bold text-primary shadow-[inset_1px_1px_2px_var(--shadow-dark),inset_-1px_-1px_2px_var(--shadow-light)]">
            {row.original.code}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: showInlineEdit ? "Tên thiết bị ✎" : "Tên thiết bị & Vị trí",
        cell: ({ row }) => {
          const type = row.original.type;
          const TypeIcon =
            type === "camera"
              ? Camera
              : type === "sensor"
              ? Radio
              : type === "gate"
              ? ShieldCheck
              : Cpu;

          return (
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-background border border-border/40 text-primary shadow-[2px_2px_4px_var(--shadow-dark),-2px_-2px_4px_var(--shadow-light)]">
                <TypeIcon size={15} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                {showInlineEdit ? (
                  <TableEditableCell
                    row={row.original}
                    rowId={row.id}
                    columnId="name"
                    value={row.original.name}
                  />
                ) : (
                  <span className="font-bold text-foreground text-xs sm:text-sm truncate">
                    {row.original.name}
                  </span>
                )}
                <span className="text-[11px] text-muted-foreground truncate">
                  {row.original.location}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "zone",
        header: showInlineEdit ? "Phân khu ✎" : "Phân khu",
        cell: ({ row }) =>
          showInlineEdit ? (
            <TableEditableCell
              row={row.original}
              rowId={row.id}
              columnId="zone"
              value={row.original.zone}
            />
          ) : (
            <span className="text-xs sm:text-sm font-medium">{row.original.zone}</span>
          ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const s = row.original.status;
          return (
            <Badge
              variant={
                s === "active" ? "success" : s === "warning" ? "warning" : "danger"
              }
              indicator="dot"
            >
              {s === "active"
                ? "Trực tuyến"
                : s === "warning"
                ? "Cảnh báo pin"
                : "Mất kết nối"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "confidence",
        header: "Độ tin cậy AI",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-16 sm:w-20 overflow-hidden rounded-full bg-background border border-border/40 shadow-[inset_1.5px_1.5px_3px_var(--shadow-dark),inset_-1.5px_-1.5px_3px_var(--shadow-light)]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  row.original.confidence >= 90
                    ? "bg-success"
                    : row.original.confidence >= 80
                    ? "bg-warning"
                    : "bg-danger"
                }`}
                style={{ width: `${row.original.confidence}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-muted-foreground">
              {row.original.confidence}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: "inspector",
        header: showInlineEdit ? "Giám sát viên ✎" : "Giám sát viên",
        cell: ({ row }) =>
          showInlineEdit ? (
            <TableEditableCell
              row={row.original}
              rowId={row.id}
              columnId="inspector"
              value={row.original.inspector}
            />
          ) : (
            <span className="text-xs text-muted-foreground font-medium">{row.original.inspector}</span>
          ),
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => (
          <TableRowActions
            row={row}
            actions={[
              {
                id: "view-modal",
                label: "Hồ sơ chi tiết (Modal)",
                icon: <Eye size={14} />,
                variant: "ghost",
                onClick: (item) => handleOpenDetailModal(item),
              },
              {
                id: "delete-dialog",
                label: "Gỡ thiết bị (Dialog)",
                icon: <Trash2 size={14} />,
                variant: "danger",
                onClick: (item) => handleOpenDeleteDialog(item),
              },
            ]}
          />
        ),
      },
    );

    return cols;
  }, [showSelection, showInlineEdit]);

  // Studio Filters
  const studioFilters: TableColumnFilter[] = React.useMemo(
    () => [
      {
        columnId: "zone",
        label: "Phân khu thi công",
        type: "select",
        options: [
          { label: "Phân khu A", value: "Phân khu A" },
          { label: "Phân khu B", value: "Phân khu B" },
          { label: "Phân khu C", value: "Phân khu C" },
          { label: "Phân khu D", value: "Phân khu D" },
          { label: "Toàn dự án", value: "Toàn dự án" },
        ],
      },
      {
        columnId: "status",
        label: "Trạng thái",
        type: "select",
        options: [
          { label: "Trực tuyến (active)", value: "active" },
          { label: "Cảnh báo (warning)", value: "warning" },
          { label: "Mất kết nối (offline)", value: "offline" },
        ],
      },
    ],
    [],
  );

  // Dynamic Code Generation
  const generatedCode = React.useMemo(() => {
    const lines: string[] = [];
    lines.push(`import {`);
    lines.push(`  Table, TableToolbar, TableFilter, TableBulkActions,`);
    lines.push(`  TableContent, TableHeader, TableBody, TablePagination,`);
    lines.push(`} from "@ui/table";`);
    lines.push(``);
    lines.push(`export function SmartPpeTable() {`);
    lines.push(`  return (`);
    lines.push(`    <Table`);
    lines.push(`      data={data}`);
    lines.push(`      columns={columns}`);
    if (variant !== "soft") lines.push(`      variant="${variant}"`);
    if (showInlineEdit) lines.push(`      onCellEdit={handleCellEdit}`);
    lines.push(`    >`);
    if (showSearch || showColumnVisibility) {
      lines.push(`      <TableToolbar`);
      if (!showSearch) lines.push(`        showSearch={false}`);
      if (!showColumnVisibility) lines.push(`        showColumnVisibility={false}`);
      lines.push(`      />`);
    }
    if (showFilterBar) {
      lines.push(`      <TableFilter filters={filters} className="px-4 pb-2" />`);
    }
    if (showSelection) {
      lines.push(`      <TableBulkActions`);
      lines.push(`        actions={[`);
      lines.push(`          { id: "del", label: "Xóa đã chọn", onClick: openBulkConfirm }`);
      lines.push(`        ]}`);
      lines.push(`        className="mx-4 mb-2"`);
      lines.push(`      />`);
    }
    lines.push(`      <TableContent />`);
    if (showPagination) {
      lines.push(`      <TablePagination pageSizeOptions={[5, 10, 20]} />`);
    }
    lines.push(`    </Table>`);
    lines.push(`  );`);
    lines.push(`}`);
    return lines.join("\n");
  }, [variant, showSearch, showColumnVisibility, showFilterBar, showSelection, showPagination, showInlineEdit]);

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Đã sao chép mã nguồn JSX vào clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAllFilters = () => {
    setDevices(INITIAL_DEVICES);
    setVariant("soft");
    setShowSearch(true);
    setShowColumnVisibility(true);
    setShowSelection(true);
    setShowPagination(true);
    setShowFilterBar(true);
    setShowInlineEdit(true);
    setSimulateLoading(false);
    setSimulateEmpty(false);
    toast.success("Đã khôi phục cài đặt mặc định của Table Studio");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 space-y-12">
      {/* ------------------------------------------ */}
      {/* 1. HERO BANNER NEUMORPHIC */}
      {/* ------------------------------------------ */}
      <header className="relative overflow-hidden rounded-[28px] sm:rounded-3xl border border-white/80 dark:border-white/10 bg-background p-6 sm:p-8 md:p-10 shadow-[12px_12px_28px_var(--shadow-dark),-12px_-12px_28px_var(--shadow-light),inset_1px_1px_2px_rgba(255,255,255,0.9)]">
        {/* Specular highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/20"
        />

        {/* Ambient Corner Light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
        />

        <div className="relative z-10 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Trang chủ
            </Link>
            <ChevronRight size={12} />
            <Link href="/components" className="hover:text-foreground transition-colors">
              Components
            </Link>
            <ChevronRight size={12} />
            <span className="font-bold text-primary">Table (Bảng dữ liệu)</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-background text-primary shadow-[6px_6px_14px_var(--shadow-dark),-6px_-6px_14px_var(--shadow-light),inset_1px_1px_2px_rgba(255,255,255,0.8)]">
                  <Table2 size={30} strokeWidth={2.2} />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    Table Component
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-accent">
                    Neumorphic Data Grid System • TanStack Table v9 Engine
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Hệ thống bảng dữ liệu cơ học xúc giác cao cấp với độ sâu quang học nổi (<strong className="text-foreground">Soft</strong>) và chìm (<strong className="text-foreground">Sculpted</strong>). Tối ưu hóa toàn diện cho di động với cử chỉ vuốt ngang, phân tách rõ ràng vai trò giữa <strong className="text-foreground">Modal</strong> xem hồ sơ và <strong className="text-foreground">Dialog</strong> xác nhận dứt khoát.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  document.getElementById("studio-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="font-bold shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]"
              >
                <Sliders size={15} />
                Thử nghiệm Studio
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  document.getElementById("modal-dialog-separation")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="font-bold shadow-[3px_3px_8px_var(--shadow-dark),-3px_-3px_8px_var(--shadow-light)]"
              >
                <Layers size={15} />
                Modal vs Dialog
              </Button>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/30">
            <Badge variant="primary" indicator="dot">TanStack Table v9</Badge>
            <Badge variant="secondary">Quang học Nổi Soft & Chìm Inset</Badge>
            <Badge variant="success">Tương thích Mobile 100%</Badge>
            <Badge variant="info">Inline Cell Editing</Badge>
            <Badge variant="warning">Bộ lọc Đa Cột & Toàn Cục</Badge>
            <Badge variant="default">Tuân thủ W3C Data Grid</Badge>
          </div>
        </div>
      </header>

      {/* ------------------------------------------ */}
      {/* 2. ARCHITECTURAL HIGHLIGHT: MODAL VS DIALOG */}
      {/* ------------------------------------------ */}
      <section
        id="modal-dialog-separation"
        className="rounded-[28px] border border-white/80 dark:border-white/10 bg-background p-6 sm:p-8 shadow-[10px_10px_24px_var(--shadow-dark),-10px_-10px_24px_var(--shadow-light)] space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-background text-accent shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-foreground">
              Nguyên Tắc Tách Biệt: Modal vs Dialog trên Table
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Phân định minh bạch trải nghiệm người dùng giữa xem hồ sơ chuyên sâu và xác nhận hành động nguy hiểm.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MODAL CONSOLE */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/40 bg-black/[0.015] dark:bg-black/[0.15] p-5 sm:p-6 shadow-[inset_3px_3px_7px_var(--shadow-dark),inset_-3px_-3px_7px_var(--shadow-light)] space-y-5">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-primary text-sm sm:text-base">
                  <Eye size={18} />
                  Modal (SculptedModal)
                </span>
                <Badge variant="primary">Hồ Sơ & Giám Sát</Badge>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Được kích hoạt khi người dùng bấm vào hàng (<strong className="text-foreground">Row Click</strong>) hoặc nút <strong className="text-foreground">"Xem hồ sơ"</strong>. Cung cấp không gian làm việc phụ để xem luồng camera AI, lịch sử vi phạm, thông số cảm biến và chi tiết người kiểm tra.
              </p>

              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={14} className="text-success shrink-0" />
                  Cấu trúc 3 tầng quang học Neumorphic (Kích thước: md, lg, xl).
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={14} className="text-success shrink-0" />
                  Hỗ trợ cuộn độc lập, tabs và đa dạng viewport đồ thị.
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={14} className="text-success shrink-0" />
                  Không mang tính cưỡng chế quyết định (non-destructive).
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center font-bold shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)]"
              onClick={() => handleOpenDetailModal(devices[0])}
            >
              <Eye size={14} />
              Thử nghiệm Modal: Xem Hồ Sơ Camera AI #01
            </Button>
          </div>

          {/* DIALOG CONSOLE */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/40 bg-black/[0.015] dark:bg-black/[0.15] p-5 sm:p-6 shadow-[inset_3px_3px_7px_var(--shadow-dark),inset_-3px_-3px_7px_var(--shadow-light)] space-y-5">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-danger text-sm sm:text-base">
                  <Trash2 size={18} />
                  Dialog (ConfirmDialog)
                </span>
                <Badge variant="danger">Xác Nhận Quyết Định</Badge>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Được kích hoạt khi người dùng bấm nút <strong className="text-foreground">"Gỡ thiết bị"</strong> hoặc <strong className="text-foreground">"Xóa hàng loạt (Bulk Delete)"</strong>. Bắt buộc người dùng tập trung xác nhận hành động có tính phá hủy không thể hoàn tác.
              </p>

              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={14} className="text-danger shrink-0" />
                  Hiệu ứng hạt Orbit xung quanh đĩa nguy hiểm trung tâm.
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={14} className="text-danger shrink-0" />
                  Hiển thị tên đối tượng cụ thể (itemName) chống xóa nhầm.
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={14} className="text-danger shrink-0" />
                  Tích hợp Spinner bất đồng bộ và khóa nút hủy khi đang xử lý.
                </li>
              </ul>
            </div>

            <Button
              variant="danger"
              size="sm"
              className="w-full justify-center font-bold shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)]"
              onClick={() => handleOpenDeleteDialog(devices[0])}
            >
              <Trash2 size={14} />
              Thử nghiệm Dialog: Xác Nhận Gỡ Bỏ Camera AI #01
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------ */}
      {/* 3. INTERACTIVE STUDIO SANDBOX */}
      {/* ------------------------------------------ */}
      <section id="studio-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Sparkles size={22} className="text-accent" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Phòng Thí Nghiệm Trực Quan (Table Studio)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Bật tắt các thành phần quang học, công cụ tìm kiếm, bộ lọc đa cột và kiểm tra phản hồi tương tác trực tiếp.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetAllFilters}
            className="font-bold self-start sm:self-auto shadow-[2px_2px_4px_var(--shadow-dark),-2px_-2px_4px_var(--shadow-light)]"
          >
            <RotateCcw size={14} />
            Đặt lại mặc định
          </Button>
        </div>

        {/* Studio Controls Rack */}
        <div className="rounded-[28px] border border-white/80 dark:border-white/10 bg-background p-5 sm:p-6 shadow-[10px_10px_24px_var(--shadow-dark),-10px_-10px_24px_var(--shadow-light)] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Biến thể bề mặt */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <SlidersHorizontal size={13} className="text-primary" />
                Biến thể bề mặt (Variant)
              </label>
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/[0.03] dark:bg-black/[0.2] shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]">
                <button
                  type="button"
                  onClick={() => setVariant("soft")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                    variant === "soft"
                      ? "bg-background text-primary shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] border border-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Soft (Nổi Mềm)
                </button>
                <button
                  type="button"
                  onClick={() => setVariant("sculpted")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                    variant === "sculpted"
                      ? "bg-background text-primary shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)] border border-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sculpted (Chìm)
                </button>
              </div>
            </div>

            {/* 2. Thanh công cụ Toolbar */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block flex items-center gap-1.5">
                <Search size={13} className="text-primary" />
                Thanh công cụ (Toolbar)
              </span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowSearch(!showSearch)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    showSearch
                      ? "border border-primary/40 bg-primary/10 text-foreground shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]"
                      : "border border-border/40 bg-background text-muted-foreground shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)] hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Search size={13} className={showSearch ? "text-primary" : "text-muted-foreground"} />
                    Tìm kiếm nhanh
                  </span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-md ${showSearch ? "bg-primary text-primary-foreground font-black" : "bg-muted text-muted-foreground"}`}>
                    {showSearch ? "BẬT" : "TẮT"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowColumnVisibility(!showColumnVisibility)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    showColumnVisibility
                      ? "border border-primary/40 bg-primary/10 text-foreground shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]"
                      : "border border-border/40 bg-background text-muted-foreground shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)] hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Columns3 size={13} className={showColumnVisibility ? "text-primary" : "text-muted-foreground"} />
                    Ẩn / hiện cột
                  </span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-md ${showColumnVisibility ? "bg-primary text-primary-foreground font-black" : "bg-muted text-muted-foreground"}`}>
                    {showColumnVisibility ? "BẬT" : "TẮT"}
                  </span>
                </button>
              </div>
            </div>

            {/* 3. Tương tác & Chọn dòng */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block flex items-center gap-1.5">
                <CheckSquare size={13} className="text-primary" />
                Tương tác dữ liệu
              </span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowSelection(!showSelection)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    showSelection
                      ? "border border-primary/40 bg-primary/10 text-foreground shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]"
                      : "border border-border/40 bg-background text-muted-foreground shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)] hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CheckSquare size={13} className={showSelection ? "text-primary" : "text-muted-foreground"} />
                    Chọn dòng (Selection)
                  </span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-md ${showSelection ? "bg-primary text-primary-foreground font-black" : "bg-muted text-muted-foreground"}`}>
                    {showSelection ? "BẬT" : "TẮT"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const next = !showInlineEdit;
                    setShowInlineEdit(next);
                    if (next) {
                      toast.info("Đã BẬT chế độ sửa trực tiếp: Click vào ô bất kỳ ở cột Tên, Phân khu hoặc Giám sát viên để sửa!");
                    } else {
                      toast.info("Đã TẮT chế độ sửa trực tiếp");
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    showInlineEdit
                      ? "border border-primary/40 bg-primary/10 text-foreground shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]"
                      : "border border-border/40 bg-background text-muted-foreground shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)] hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Pencil size={13} className={showInlineEdit ? "text-primary" : "text-muted-foreground"} />
                    Sửa trực tiếp ô (Inline Edit)
                  </span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-md ${showInlineEdit ? "bg-primary text-primary-foreground font-black" : "bg-muted text-muted-foreground"}`}>
                    {showInlineEdit ? "BẬT" : "TẮT"}
                  </span>
                </button>
              </div>
            </div>

            {/* 4. Giả lập trạng thái */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block flex items-center gap-1.5">
                <Cpu size={13} className="text-primary" />
                Giả lập trạng thái
              </span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setSimulateLoading(!simulateLoading)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    simulateLoading
                      ? "border border-primary/40 bg-primary/10 text-foreground shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]"
                      : "border border-border/40 bg-background text-muted-foreground shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)] hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw size={13} className={simulateLoading ? "text-primary animate-spin" : "text-muted-foreground"} />
                    Đang tải (Skeleton)
                  </span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-md ${simulateLoading ? "bg-primary text-primary-foreground font-black" : "bg-muted text-muted-foreground"}`}>
                    {simulateLoading ? "BẬT" : "TẮT"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSimulateEmpty(!simulateEmpty)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    simulateEmpty
                      ? "border border-primary/40 bg-primary/10 text-foreground shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]"
                      : "border border-border/40 bg-background text-muted-foreground shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)] hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <AlertOctagon size={13} className={simulateEmpty ? "text-primary" : "text-muted-foreground"} />
                    Dữ liệu rỗng (Empty)
                  </span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-md ${simulateEmpty ? "bg-primary text-primary-foreground font-black" : "bg-muted text-muted-foreground"}`}>
                    {simulateEmpty ? "BẬT" : "TẮT"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Hướng dẫn sửa ô trực quan */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-primary/[0.04] border border-primary/20 text-xs">
            <div className="flex items-center gap-2.5 text-foreground font-medium">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-[11px] shadow-[1px_1px_2px_var(--shadow-dark)]">
                ✎
              </span>
              <span>
                <strong>Cách sửa ô trực tiếp:</strong> Nhấp chuột trực tiếp vào ô bất kỳ tại các cột <span className="text-primary font-bold">Tên thiết bị ✎</span>, <span className="text-primary font-bold">Phân khu ✎</span> hoặc <span className="text-primary font-bold">Giám sát viên ✎</span>. Nhập nội dung mới rồi nhấn phím <strong>Enter</strong> hoặc bấm nút <strong>Lưu</strong>.
              </span>
            </div>
            {showInlineEdit ? (
              <Badge variant="success" indicator="dot" className="shrink-0 font-bold">
                Sẵn sàng click để sửa
              </Badge>
            ) : (
              <Badge variant="default" className="shrink-0 font-bold">
                Chế độ sửa đang TẮT
              </Badge>
            )}
          </div>
        </div>

        {/* Live Table Render */}
        <div className="space-y-4">
          <Table
            data={simulateEmpty ? [] : devices}
            columns={studioColumns}
            variant={variant}
            loading={simulateLoading}
            emptyMessage="Không tìm thấy thiết bị giám sát an toàn nào phù hợp với bộ lọc."
            onCellEdit={handleCellEdit}
          >
            {/* Toolbar */}
            {(showSearch || showColumnVisibility) && (
              <TableToolbar
                showSearch={showSearch}
                showColumnVisibility={showColumnVisibility}
                searchPlaceholder="Tìm mã, tên thiết bị, phân khu, người kiểm tra..."
                actions={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDevices(INITIAL_DEVICES);
                      toast.success("Đã đồng bộ lại dữ liệu cảm biến mới nhất từ server");
                    }}
                    className="font-bold shadow-[2px_2px_4px_var(--shadow-dark),-2px_-2px_4px_var(--shadow-light)]"
                  >
                    <RefreshCw size={13} />
                    Làm mới
                  </Button>
                }
              />
            )}

            {/* Filter Bar */}
            {showFilterBar && (
              <div className="p-4 sm:p-5 pb-0">
                <TableFilter
                  filters={studioFilters}
                />
              </div>
            )}

            {/* Bulk Actions */}
            {showSelection && (
              <div className="px-4 sm:px-5 pt-3">
                <TableBulkActions
                  actions={[
                    {
                      id: "bulk-delete",
                      label: "Gỡ thiết bị đã chọn",
                      icon: <Trash2 size={14} />,
                      variant: "danger",
                      onClick: () => setIsBulkDialogOpen(true),
                    },
                  ]}
                />
              </div>
            )}

            {/* Table Core Content */}
            <TableContent />

            {/* Pagination */}
            {showPagination && (
              <TablePagination
                pageSizeOptions={[5, 10, 20]}
                showRowCount={true}
                showPageSizeSelector={true}
              />
            )}
          </Table>
        </div>

        {/* Code Generator Card */}
        <div className="rounded-[28px] border border-white/80 dark:border-white/10 bg-background p-6 shadow-[10px_10px_24px_var(--shadow-dark),-10px_-10px_24px_var(--shadow-light)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-primary" />
              <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground">
                Mã JSX Sinh Tự Động (Live Code Generator)
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={copyCode}
              className="font-bold shadow-[2px_2px_4px_var(--shadow-dark),-2px_-2px_4px_var(--shadow-light)]"
            >
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              {copied ? "Đã chép mã" : "Sao chép code"}
            </Button>
          </div>

          <pre className="overflow-x-auto rounded-2xl bg-black/[0.03] dark:bg-black/[0.25] p-4 font-mono text-xs text-foreground/90 shadow-[inset_3px_3px_7px_var(--shadow-dark),inset_-3px_-3px_7px_var(--shadow-light)] border border-border/30 leading-relaxed">
            <code>{generatedCode}</code>
          </pre>
        </div>
      </section>

      {/* ------------------------------------------ */}
      {/* 4. REAL-WORLD DEMOS & SCENARIOS */}
      {/* ------------------------------------------ */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            3 Kịch Bản Ứng Dụng Thực Tế (Smart PPE System)
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Khảo sát các trường hợp bảng dữ liệu điển hình trong công tác an toàn lao động công trường.
          </p>
        </div>

        {/* DEMO 1: VIOLATION AUDIT LOG (SCULPTED INSET) */}
        <div className="space-y-4 rounded-[28px] border border-white/80 dark:border-white/10 bg-background p-5 sm:p-7 shadow-[10px_10px_24px_var(--shadow-dark),-10px_-10px_24px_var(--shadow-light)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2.5">
                <ShieldAlert size={20} className="text-danger" />
                <h3 className="text-lg sm:text-xl font-extrabold text-foreground">
                  1. Nhật Ký Vi Phạm An Toàn Lao Động (Biến thể Sculpted Khắc Chìm)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Tối ưu cho phòng điều hành an toàn trung tâm giám sát cảnh báo tức thời với độ tương phản cao.
              </p>
            </div>
            <Badge variant="danger" indicator="dot">Dữ liệu thời gian thực AI</Badge>
          </div>

          <Table
            data={VIOLATION_DATA}
            columns={[
              {
                accessorKey: "time",
                header: "Thời điểm",
                cell: ({ row }) => (
                  <span className="font-mono text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Clock size={12} className="text-primary" />
                    {row.original.time}
                  </span>
                ),
              },
              {
                accessorKey: "workerName",
                header: "Công nhân & Tổ đội",
                cell: ({ row }) => (
                  <div>
                    <p className="font-bold text-foreground text-xs sm:text-sm">{row.original.workerName}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">{row.original.department} ({row.original.workerId})</p>
                  </div>
                ),
              },
              {
                accessorKey: "violation",
                header: "Hành vi vi phạm PPE",
                cell: ({ row }) => (
                  <span className="font-bold text-foreground text-xs sm:text-sm">
                    {row.original.violation}
                  </span>
                ),
              },
              {
                accessorKey: "severity",
                header: "Mức độ",
                cell: ({ row }) => {
                  const sev = row.original.severity;
                  return (
                    <Badge
                      variant={sev === "danger" ? "danger" : sev === "warning" ? "warning" : "info"}
                    >
                      {sev === "danger" ? "Nghiêm trọng" : sev === "warning" ? "Trung bình" : "Nhắc nhở"}
                    </Badge>
                  );
                },
              },
              {
                accessorKey: "zone",
                header: "Vị trí",
                cell: ({ row }) => (
                  <span className="text-xs text-muted-foreground font-medium">{row.original.zone}</span>
                ),
              },
              {
                accessorKey: "confidence",
                header: "Độ chuẩn xác",
                cell: ({ row }) => (
                  <span className="font-mono text-xs font-bold text-primary">
                    {row.original.confidence}%
                  </span>
                ),
              },
            ]}
            variant="sculpted"
          >
            <TableToolbar searchPlaceholder="Lọc nhật ký vi phạm an toàn..." showColumnVisibility={false} />
            <TableContent />
            <TablePagination showPageSizeSelector={false} />
          </Table>
        </div>

        {/* DEMO 2: WORKER PPE INVENTORY & EXPIRY */}
        <div className="space-y-4 rounded-[28px] border border-white/80 dark:border-white/10 bg-background p-5 sm:p-7 shadow-[10px_10px_24px_var(--shadow-dark),-10px_-10px_24px_var(--shadow-light)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2.5">
                <HardHat size={20} className="text-warning" />
                <h3 className="text-lg sm:text-xl font-extrabold text-foreground">
                  2. Cấp Phát & Kiểm Định Thiết Bị Bảo Hộ (Biến thể Soft Nổi Mềm)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Theo dõi ngày hết hạn kiểm định của mũ, giày, dây an toàn và chứng chỉ hành nghề.
              </p>
            </div>
            <Badge variant="warning">Theo dõi niên hạn</Badge>
          </div>

          <Table
            data={INVENTORY_DATA}
            columns={[
              {
                accessorKey: "name",
                header: "Nhân sự",
                cell: ({ row }) => (
                  <div>
                    <p className="font-bold text-foreground text-xs sm:text-sm">{row.original.name}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">{row.original.role} • {row.original.department}</p>
                  </div>
                ),
              },
              {
                accessorKey: "helmetSerial",
                header: "Số Serial Mũ",
                cell: ({ row }) => (
                  <span className="font-mono text-xs font-extrabold text-primary px-2 py-0.5 rounded-lg bg-background border border-border/40 shadow-[inset_1px_1px_2px_var(--shadow-dark)]">
                    {row.original.helmetSerial}
                  </span>
                ),
              },
              {
                accessorKey: "shoesSize",
                header: "Cỡ Giày",
                cell: ({ row }) => (
                  <span className="text-xs font-mono font-bold">{row.original.shoesSize}</span>
                ),
              },
              {
                accessorKey: "certExpiry",
                header: "Hạn kiểm định",
                cell: ({ row }) => (
                  <span className="font-mono text-xs text-muted-foreground font-medium">
                    {row.original.certExpiry}
                  </span>
                ),
              },
              {
                accessorKey: "status",
                header: "Tình trạng",
                cell: ({ row }) => {
                  const st = row.original.status;
                  return (
                    <Badge
                      variant={st === "valid" ? "success" : st === "expiring" ? "warning" : "danger"}
                      indicator="dot"
                    >
                      {st === "valid" ? "Hợp chuẩn" : st === "expiring" ? "Sắp hết hạn" : "Đã hết hạn"}
                    </Badge>
                  );
                },
              },
            ]}
            variant="soft"
          >
            <TableToolbar searchPlaceholder="Tìm tên kỹ sư, số serial mũ..." showColumnVisibility={false} />
            <TableContent />
          </Table>
        </div>

        {/* DEMO 3: TURNKEY MODE (1 LINE OF CODE) */}
        <div className="space-y-4 rounded-[28px] border border-white/80 dark:border-white/10 bg-background p-5 sm:p-7 shadow-[10px_10px_24px_var(--shadow-dark),-10px_-10px_24px_var(--shadow-light)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2.5">
                <Cpu size={20} className="text-primary" />
                <h3 className="text-lg sm:text-xl font-extrabold text-foreground">
                  3. Chế Độ Tự Động Toàn Phần (Turnkey Mode - 1 Dòng Code)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Không cần viết thêm TableToolbar, TableContent hay TablePagination. Hệ thống tự động cấu hình trọn gói!
              </p>
            </div>
            <Badge variant="primary">Zero-config</Badge>
          </div>

          <div className="rounded-2xl bg-black/[0.03] dark:bg-black/[0.25] p-3 font-mono text-xs text-muted-foreground border border-border/30 shadow-[inset_2px_2px_4px_var(--shadow-dark)]">
            <code>{"<Table data={inventoryData} columns={simpleColumns} />"}</code>
          </div>

          <Table
            data={INVENTORY_DATA.slice(0, 3)}
            columns={[
              { accessorKey: "name", header: "Nhân viên" },
              { accessorKey: "role", header: "Chức vụ" },
              { accessorKey: "helmetSerial", header: "Serial Mũ" },
              { accessorKey: "certExpiry", header: "Hạn kiểm định" },
            ]}
          />
        </div>
      </section>

      {/* ------------------------------------------ */}
      {/* 5. ANATOMY & NEUMORPHIC STYLING SYSTEM */}
      {/* ------------------------------------------ */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Giải Phẫu Bảng Neumorphic (Visual Anatomy)
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kiến trúc quang học tạo nên cảm giác cơ khí xúc giác đặc trưng của thiết kế Neumorphism.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl border border-white/80 dark:border-white/10 bg-background p-5 shadow-[6px_6px_14px_var(--shadow-dark),-6px_-6px_14px_var(--shadow-light)] space-y-2.5">
            <span className="font-mono text-xs font-black text-primary">01. Vành Bevel Nổi Đa Chiều</span>
            <h4 className="font-bold text-foreground text-sm">Vành Bo Tròn & Đổ Bóng Kép</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Khung ngoài bo góc r28 với cặp bóng sáng tối nghịch hướng phân tán ánh sáng bề mặt mượt mà.
            </p>
          </div>

          <div className="rounded-2xl border border-white/80 dark:border-white/10 bg-background p-5 shadow-[6px_6px_14px_var(--shadow-dark),-6px_-6px_14px_var(--shadow-light)] space-y-2.5">
            <span className="font-mono text-xs font-black text-primary">02. Tiêu Đề Rãnh Âm</span>
            <h4 className="font-bold text-foreground text-sm">Header Rãnh Chống Lóa</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Thanh header trũng nhẹ với hiệu ứng inset shadow tạo cảm giác phân tách quang học rõ rệt giữa điều hướng và dữ liệu.
            </p>
          </div>

          <div className="rounded-2xl border border-white/80 dark:border-white/10 bg-background p-5 shadow-[6px_6px_14px_var(--shadow-dark),-6px_-6px_14px_var(--shadow-light)] space-y-2.5">
            <span className="font-mono text-xs font-black text-primary">03. Hộp Kiểm Xúc Giác</span>
            <h4 className="font-bold text-foreground text-sm">Checkbox 3D Hai Trạng Thái</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Chìm sâu khi chưa chọn, nổi dập viền xanh phát sáng khi được kích hoạt với độ nhạy xúc giác cao.
            </p>
          </div>

          <div className="rounded-2xl border border-white/80 dark:border-white/10 bg-background p-5 shadow-[6px_6px_14px_var(--shadow-dark),-6px_-6px_14px_var(--shadow-light)] space-y-2.5">
            <span className="font-mono text-xs font-black text-primary">04. Phím Bấm Cơ Khí</span>
            <h4 className="font-bold text-foreground text-sm">Pagination Phím Bấm Nổi</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Phím bấm trang bo tròn đa hướng với phản hồi lún âm tường khi nhấn nhả (active state).
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------ */}
      {/* 6. PROPS REFERENCE TABLES */}
      {/* ------------------------------------------ */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Bảng Tra Cứu Thuộc Tính (API & Props Reference)
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Tài liệu chi tiết về các tham số của hệ thống Table Component.
          </p>
        </div>

        {/* TABLE COMPONENT PROPS */}
        <Table
          data={[
            { prop: "data", type: "TData[]", def: "Bắt buộc", desc: "Mảng đối tượng dữ liệu nguồn cần hiển thị trên bảng." },
            { prop: "columns", type: "ColumnDef[]", def: "Bắt buộc", desc: "Định nghĩa danh sách các cột theo chuẩn TanStack Table v9." },
            { prop: "variant", type: '"soft" | "sculpted"', def: '"soft"', desc: "Kiểu bề mặt Neumorphic: Soft (nổi mềm mại) hoặc Sculpted (khắc chìm)." },
            { prop: "loading", type: "boolean", def: "false", desc: "Bật trạng thái skeleton loading dạng thanh dập nổi mờ." },
            { prop: "emptyMessage", type: "string", def: '"Không có dữ liệu..."', desc: "Thông điệp hiển thị khi tập dữ liệu rỗng." },
            { prop: "onCellEdit", type: "TableCellEditHandler", def: "undefined", desc: "Callback kích hoạt khi người dùng chỉnh sửa giá trị ô với TableEditableCell." },
            { prop: "onRowClick", type: "(row: Row) => void", def: "undefined", desc: "Sự kiện bấm vào dòng để mở Modal xem hồ sơ chi tiết." },
          ]}
          columns={[
            {
              accessorKey: "prop",
              header: "Thuộc tính",
              cell: ({ row }) => (
                <span className="font-mono font-extrabold text-primary text-xs sm:text-sm">
                  {row.original.prop}
                </span>
              ),
            },
            {
              accessorKey: "type",
              header: "Kiểu dữ liệu",
              cell: ({ row }) => (
                <span className="font-mono text-xs text-muted-foreground">
                  {row.original.type}
                </span>
              ),
            },
            {
              accessorKey: "def",
              header: "Mặc định",
              cell: ({ row }) => (
                <span className="font-mono text-xs font-bold text-foreground">
                  {row.original.def}
                </span>
              ),
            },
            {
              accessorKey: "desc",
              header: "Mô tả chi tiết",
              cell: ({ row }) => (
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {row.original.desc}
                </span>
              ),
            },
          ]}
          variant="soft"
        >
          <TableContent />
        </Table>
      </section>

      {/* ------------------------------------------ */}
      {/* 7. INTERACTIVE MODAL DEMO (SCULPTED MODAL) */}
      {/* ------------------------------------------ */}
      {modalDevice && (
        <SculptedModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={`Hồ Sơ Thiết Bị: ${modalDevice.name}`}
          description={`Mã nhận diện hệ thống: ${modalDevice.code} • Phân khu: ${modalDevice.zone}`}
          size="lg"
          border="accent"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-muted-foreground font-medium">
                Cập nhật lần cuối: {modalDevice.lastSync}
              </span>
              <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)} className="font-bold">
                Đóng hồ sơ
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Telemetry quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border/40 bg-background p-3.5 shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <Activity size={13} className="text-primary" /> Trạng thái
                </span>
                <p className="mt-1 font-bold text-sm capitalize text-foreground">
                  {modalDevice.status === "active" ? "Trực tuyến ổn định" : "Cần kiểm tra"}
                </p>
              </div>

              <div className="rounded-2xl border border-border/40 bg-background p-3.5 shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <Battery size={13} className="text-success" /> Mức năng lượng
                </span>
                <p className="mt-1 font-bold text-sm text-foreground">
                  {modalDevice.battery}% Pin Li-Po
                </p>
              </div>

              <div className="rounded-2xl border border-border/40 bg-background p-3.5 shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <Cpu size={13} className="text-accent" /> Độ tin cậy AI
                </span>
                <p className="mt-1 font-bold text-sm text-foreground">
                  {modalDevice.confidence}% Độ chuẩn
                </p>
              </div>
            </div>

            {/* Simulated Live Viewport */}
            <div className="rounded-2xl border border-border/40 bg-black/[0.03] dark:bg-black/[0.25] p-4 shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)] space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-bold text-foreground">
                  <Camera size={14} className="text-primary" /> Khung hình trích xuất từ camera an toàn
                </span>
                <span className="font-mono text-accent font-bold">1080p @ 30 FPS • AI YOLOv8</span>
              </div>

              <div className="relative h-44 w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center border border-border/30">
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                <div className="text-center space-y-2 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-success/40 text-success text-xs font-mono font-bold">
                    <span className="size-2 rounded-full bg-success animate-ping" />
                    LIVE PPE STREAM DETECTED
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    Phát hiện 12 công nhân • 12/12 Mũ bảo hộ hợp lệ • 0 Vi phạm
                  </p>
                </div>
              </div>
            </div>

            {/* Inspector info */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background border border-border/30 text-xs shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)]">
              <span className="text-muted-foreground font-medium">Kỹ sư an toàn phụ trách:</span>
              <span className="font-bold text-foreground">{modalDevice.inspector}</span>
            </div>
          </div>
        </SculptedModal>
      )}

      {/* ------------------------------------------ */}
      {/* 8. INTERACTIVE DIALOG DEMOS (CONFIRM DIALOG) */}
      {/* ------------------------------------------ */}
      {/* Single Device Delete Dialog */}
      <ConfirmDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setDialogDevice(null);
        }}
        onConfirm={handleConfirmDelete}
        variant="danger"
        title="Xác nhận gỡ bỏ thiết bị an toàn?"
        description="Hành động này sẽ ngắt liên kết thiết bị khỏi trạm giám sát Smart PPE. Mọi dữ liệu phân tích thị giác vi phạm tại phân khu này sẽ tạm dừng cho đến khi thiết bị được cấu hình lại."
        itemName={dialogDevice ? `${dialogDevice.name} (${dialogDevice.code})` : undefined}
        confirmText="Xác nhận gỡ thiết bị"
        cancelText="Giữ lại thiết bị"
      />

      {/* Bulk Delete Dialog */}
      <ConfirmDialog
        open={isBulkDialogOpen}
        onClose={() => setIsBulkDialogOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        variant="danger"
        title="Xác nhận xóa hàng loạt thiết bị?"
        description="Bạn đang yêu cầu gỡ bỏ toàn bộ danh sách thiết bị đang được chọn. Đây là hành động nguy hiểm và không thể hoàn tác."
        confirmText="Xác nhận xóa tất cả"
        cancelText="Hủy bỏ"
      />
    </div>
  );
}
