"use client";

import { useState } from "react";
import BarChart, {
  type BarChartOrientation,
  type BarChartSurface,
  type BarChartVariant,
} from "@/components/charts/BarChart";
import { Button } from "@ui/button";

// Dữ liệu mẫu thực tế về vi phạm PPE
const basicData = [
  { label: "Mũ bảo hộ", value: 42, color: "#a35139" },
  { label: "Áo phản quang", value: 28, color: "#ffb162" },
  { label: "Dây an toàn", value: 15, color: "#d97706" },
  { label: "Găng tay", value: 35, color: "#16a34a" },
  { label: "Kính bảo hộ", value: 19, color: "#0891b2" },
  { label: "Giày bảo hộ", value: 8, color: "#8d83b9" },
];

const multiSeriesData = [
  { label: "Thứ 2", value: 22, caSang: 14, caDem: 8 },
  { label: "Thứ 3", value: 34, caSang: 22, caDem: 12 },
  { label: "Thứ 4", value: 27, caSang: 18, caDem: 9 },
  { label: "Thứ 5", value: 41, caSang: 26, caDem: 15 },
  { label: "Thứ 6", value: 50, caSang: 31, caDem: 19 },
  { label: "Thứ 7", value: 18, caSang: 12, caDem: 6 },
];

const seriesConfig = [
  { key: "caSang", name: "Ca sáng", color: "#a35139" },
  { key: "caDem", name: "Ca đêm", color: "#ffb162" },
];

const SURFACE_OPTIONS = [
  {
    key: "raised" as const,
    label: "Lồi lên",
    tag: "raised",
    desc: "Cột nổi lên trên mặt phẳng với bóng đổ đa hướng (feDropShadow sáng/tối), tạo cảm giác 3D đùn nổi.",
  },
  {
    key: "inset" as const,
    label: "Lõm xuống",
    tag: "inset",
    desc: "Cột chìm sâu xuống bề mặt bằng SVG Inner Shadow đa tầng (feOffset, feComposite, feFlood), tạo cảm giác rãnh khắc chìm.",
  },
  {
    key: "inset-raised" as const,
    label: "Lõm rồi lồi",
    tag: "inset-raised",
    desc: "Rãnh 100% chìm sâu vào nền (inset groove), bên trong thanh giá trị nổi lồi lên (raised pill) cách mép một khoảng đệm nhỏ.",
  },
];

export default function BarChartPage() {
  const [orientation, setOrientation] = useState<BarChartOrientation>("vertical");
  const [surface, setSurface] = useState<BarChartSurface>("raised");
  const [surfaceOrientation, setSurfaceOrientation] = useState<BarChartOrientation>("vertical");
  const [variant, setVariant] = useState<BarChartVariant>("grouped");
  const [percentOrientation, setPercentOrientation] = useState<BarChartOrientation>("horizontal");

  const currentSurfaceMeta =
    SURFACE_OPTIONS.find((s) => s.key === surface) ?? SURFACE_OPTIONS[0];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 pb-16">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">BarChart</h1>
        <p className="text-muted-foreground">
          Biểu đồ cột phong cách Neumorphism (Soft UI) với các kiểu bề mặt cột đa dạng:
          lồi lên (raised), lõm xuống (inset), hoặc rãnh lõm rồi nổi lên (inset-raised).
          Hỗ trợ hiển thị đơn, nhóm, xếp chồng, đổi chiều ngang/dọc và tooltip mượt mà.
        </p>
      </header>

      {/* 1. Biểu đồ cơ bản & Điều khiển chiều dọc/ngang */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">1. Biểu đồ cơ bản (Basic)</h2>
            <p className="text-xs text-muted-foreground">
              Hiển thị số lượng vi phạm PPE theo danh mục trang bị.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Chiều:</span>
            <Button
              size="sm"
              variant={orientation === "vertical" ? "primary" : "outline"}
              onClick={() => setOrientation("vertical")}
            >
              Dọc (Vertical)
            </Button>
            <Button
              size="sm"
              variant={orientation === "horizontal" ? "primary" : "outline"}
              onClick={() => setOrientation("horizontal")}
            >
              Ngang (Horizontal)
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <BarChart
            data={basicData}
            title="Thống kê vi phạm PPE tuần qua"
            description="Số lượt vi phạm phát hiện bởi hệ thống camera AI"
            unit="lượt"
            orientation={orientation}
            surface="raised"
            height={orientation === "vertical" ? 280 : 320}
            showValues
            backgroundColor="var(--card)"
            textColor="var(--foreground)"
            mutedColor="var(--muted-foreground)"
            gridColor="var(--border)"
            raisedShadow="var(--nm-raised)"
            insetShadow="var(--nm-inset)"
          />
        </div>
      </section>

      {/* 2. Kiểu của cột (Surface: Lồi lên, Lõm xuống, Lõm rồi lồi) */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              2. Kiểu của cột (Column Surface Styles)
            </h2>
            <p className="text-xs text-muted-foreground">
              3 kiểu đổ bóng Neumorphism cho cột: Lồi lên (raised), Lõm xuống (inset), hoặc Lõm xuống rồi lồi lên (inset-raised).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {SURFACE_OPTIONS.map((opt) => (
              <Button
                key={opt.key}
                size="sm"
                variant={surface === opt.key ? "primary" : "outline"}
                onClick={() => setSurface(opt.key)}
              >
                {opt.label} ({opt.tag})
              </Button>
            ))}
            <div className="ml-2 flex items-center gap-1 border-l border-border pl-3">
              <Button
                size="sm"
                variant={surfaceOrientation === "vertical" ? "primary" : "outline"}
                onClick={() => setSurfaceOrientation("vertical")}
              >
                Dọc
              </Button>
              <Button
                size="sm"
                variant={surfaceOrientation === "horizontal" ? "primary" : "outline"}
                onClick={() => setSurfaceOrientation("horizontal")}
              >
                Ngang
              </Button>
            </div>
          </div>
        </div>

        {/* Khung demo tương tác trực tiếp */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
          <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
            <strong className="text-foreground">{currentSurfaceMeta.label} ({currentSurfaceMeta.tag}):</strong>{" "}
            {currentSurfaceMeta.desc}
          </div>

          <BarChart
            data={basicData.slice(0, 4)}
            surface={surface}
            orientation={surfaceOrientation}
            title={`Kiểu cột: ${currentSurfaceMeta.label}`}
            description={`Hiệu ứng surface="${surface}" (${surfaceOrientation === "vertical" ? "Dọc" : "Ngang"})`}
            height={surfaceOrientation === "vertical" ? 280 : 260}
            showValues
            backgroundColor="var(--card)"
            textColor="var(--foreground)"
            mutedColor="var(--muted-foreground)"
            gridColor="var(--border)"
            raisedShadow="var(--nm-raised)"
            insetShadow="var(--nm-inset)"
          />
        </div>

        {/* So sánh trực quan 3 kiểu cột cạnh nhau */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            So sánh trực quan 3 kiểu cột cạnh nhau
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {SURFACE_OPTIONS.map((opt) => (
              <div
                key={opt.key}
                className={`flex flex-col gap-2 rounded-2xl border p-4 transition-all ${
                  surface === opt.key
                    ? "border-primary/50 bg-card shadow-sm"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {opt.label}
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {opt.tag}
                  </span>
                </div>
                <p className="min-h-[38px] text-[11px] leading-relaxed text-muted-foreground">
                  {opt.desc}
                </p>
                <BarChart
                  data={basicData.slice(0, 3)}
                  surface={opt.key}
                  height={220}
                  showValues
                  backgroundColor="var(--card)"
                  textColor="var(--foreground)"
                  mutedColor="var(--muted-foreground)"
                  gridColor="var(--border)"
                  raisedShadow="var(--nm-raised)"
                  insetShadow="var(--nm-inset)"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Đa chuỗi dữ liệu (Grouped & Stacked) */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">3. Đa chuỗi (Grouped & Stacked)</h2>
            <p className="text-xs text-muted-foreground">
              So sánh dữ liệu giữa Ca sáng và Ca đêm trong tuần.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(["grouped", "stacked", "stacked-percent"] as const).map((v) => (
              <Button
                key={v}
                size="sm"
                variant={variant === v ? "primary" : "outline"}
                onClick={() => setVariant(v)}
              >
                {v}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <BarChart
            data={multiSeriesData}
            series={seriesConfig}
            variant={variant}
            title="So sánh vi phạm theo ca làm việc"
            unit="lượt"
            height={300}
            showLegend
            backgroundColor="var(--card)"
            textColor="var(--foreground)"
            mutedColor="var(--muted-foreground)"
            gridColor="var(--border)"
            raisedShadow="var(--nm-raised)"
            insetShadow="var(--nm-inset)"
          />
        </div>
      </section>

      {/* 4. Tỷ lệ phần trăm (Stacked Percent - Rãnh lõm 100% & Thanh nổi) */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              4. Stacked Percent (Rãnh lõm 100% &amp; Thanh nổi)
            </h2>
            <p className="text-xs text-muted-foreground">
              Thanh rãnh dài 100% khắc chìm (lõm xuống), cách mép một đoạn nhỏ và các thanh giá trị bên trong nổi lên (raised).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Chiều:</span>
            <Button
              size="sm"
              variant={percentOrientation === "horizontal" ? "primary" : "outline"}
              onClick={() => setPercentOrientation("horizontal")}
            >
              Ngang (Horizontal)
            </Button>
            <Button
              size="sm"
              variant={percentOrientation === "vertical" ? "primary" : "outline"}
              onClick={() => setPercentOrientation("vertical")}
            >
              Dọc (Vertical)
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <BarChart
            data={multiSeriesData}
            series={seriesConfig}
            variant="stacked-percent"
            orientation={percentOrientation}
            title="Tỷ lệ phân bổ vi phạm theo ca làm việc (100%)"
            description="Thanh rãnh khắc chìm 100% toàn dải, các phân đoạn nổi lên bên trong"
            unit="lượt"
            height={percentOrientation === "horizontal" ? 340 : 300}
            showLegend
            showValues
            barThickness={percentOrientation === "horizontal" ? 30 : 36}
            backgroundColor="var(--card)"
            textColor="var(--foreground)"
            mutedColor="var(--muted-foreground)"
            gridColor="var(--border)"
            raisedShadow="var(--nm-raised)"
            insetShadow="var(--nm-inset)"
          />
        </div>
      </section>

      {/* 5. Cách sử dụng */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Cách dùng</h2>
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-sm leading-6">
{`import BarChart from "@/components/charts/BarChart";

const data = [
  { label: "Mũ bảo hộ", value: 42, color: "#a35139" },
  { label: "Áo phản quang", value: 28, color: "#ffb162" },
  { label: "Dây an toàn", value: 15, color: "#d97706" },
];

<BarChart
  data={data}
  title="Vi phạm PPE"
  orientation="vertical" // hoặc "horizontal"
  surface="raised"       // "raised" (Lồi lên) | "inset" (Lõm xuống) | "inset-raised" (Lõm rồi lồi)
  height={280}
  showValues
/>`}
        </pre>
      </section>

      {/* 6. Bảng thuộc tính (Props) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">6. Thuộc tính (Props)</h2>
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Prop</th>
                <th className="px-4 py-2.5 font-medium">Kiểu dữ liệu</th>
                <th className="px-4 py-2.5 font-medium">Mặc định</th>
                <th className="px-4 py-2.5 font-medium">Mô tả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-2.5 font-mono text-xs">data</td>
                <td className="px-4 py-2.5 font-mono text-xs">BarChartDatum[]</td>
                <td className="px-4 py-2.5 font-mono text-xs">—</td>
                <td className="px-4 py-2.5 text-xs">Mảng dữ liệu hiển thị (bắt buộc)</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-mono text-xs">variant</td>
                <td className="px-4 py-2.5 font-mono text-xs">
                  basic | grouped | stacked | stacked-percent | diverging
                </td>
                <td className="px-4 py-2.5 font-mono text-xs">&quot;basic&quot;</td>
                <td className="px-4 py-2.5 text-xs">Biến thể biểu đồ</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-mono text-xs">orientation</td>
                <td className="px-4 py-2.5 font-mono text-xs">vertical | horizontal</td>
                <td className="px-4 py-2.5 font-mono text-xs">&quot;vertical&quot;</td>
                <td className="px-4 py-2.5 text-xs">Chiều cột đứng hoặc thanh ngang</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-mono text-xs">surface</td>
                <td className="px-4 py-2.5 font-mono text-xs">
                  raised | inset | inset-raised | flat
                </td>
                <td className="px-4 py-2.5 font-mono text-xs">&quot;raised&quot;</td>
                <td className="px-4 py-2.5 text-xs">
                  Kiểu 3D của cột: Lồi lên (raised), Lõm xuống (inset), hoặc Rãnh lõm rồi nổi lên (inset-raised)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-mono text-xs">height</td>
                <td className="px-4 py-2.5 font-mono text-xs">number</td>
                <td className="px-4 py-2.5 font-mono text-xs">260</td>
                <td className="px-4 py-2.5 text-xs">Chiều cao đồ thị (pixel)</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-mono text-xs">showValues</td>
                <td className="px-4 py-2.5 font-mono text-xs">boolean</td>
                <td className="px-4 py-2.5 font-mono text-xs">false</td>
                <td className="px-4 py-2.5 text-xs">Hiển thị giá trị số trên đầu mỗi cột</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-mono text-xs">showLegend</td>
                <td className="px-4 py-2.5 font-mono text-xs">boolean</td>
                <td className="px-4 py-2.5 font-mono text-xs">true</td>
                <td className="px-4 py-2.5 text-xs">Hiển thị chú thích đa chuỗi</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-mono text-xs">showTooltip</td>
                <td className="px-4 py-2.5 font-mono text-xs">boolean</td>
                <td className="px-4 py-2.5 font-mono text-xs">true</td>
                <td className="px-4 py-2.5 text-xs">Hiển thị tooltip hover neumorphic</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
