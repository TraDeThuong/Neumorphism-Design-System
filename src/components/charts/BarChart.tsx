"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import type { CSSProperties, ReactNode } from "react";

/* =========================================================
   TYPES
========================================================= */

export type BarChartVariant =
  | "basic"
  | "grouped"
  | "stacked"
  | "stacked-percent"
  | "diverging";

export type BarChartOrientation = "vertical" | "horizontal";

export type BarChartSurface =
  | "raised"
  | "inset"
  | "inset-raised"
  | "inset-track"
  | "inset-bars"
  | "flat";

export type BarChartSize = "sm" | "md" | "lg" | "xl";

export type BarChartRadius = "none" | "sm" | "md" | "lg" | "full";

export type BarChartDatum = {
  label: string;
  value: number;
  color?: string;
  [key: string]: string | number | undefined;
};

export type BarChartSeries = {
  key: string;
  name: string;
  color?: string;
};

export type BarChartProps = {
  data: BarChartDatum[];
  series?: BarChartSeries[];

  variant?: BarChartVariant;
  orientation?: BarChartOrientation;
  surface?: BarChartSurface;

  title?: string;
  description?: string;
  unit?: string;

  width?: number | string;
  height?: number;
  size?: BarChartSize;

  backgroundColor?: string;
  barColor?: string;
  colors?: string[];
  textColor?: string;
  mutedColor?: string;
  gridColor?: string;

  radius?: BarChartRadius | number;
  barRadius?: BarChartRadius | number;
  barGap?: number;
  barThickness?: number;

  showGrid?: boolean;
  showAxis?: boolean;
  showValues?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showZeroLine?: boolean;

  animated?: boolean;
  animationDuration?: number;
  animationDelay?: number;

  showBorder?: boolean;
  raisedShadow?: string;
  insetShadow?: string;

  formatValue?: (value: number) => string;
  onBarClick?: (datum: BarChartDatum, seriesKey?: string) => void;

  className?: string;
  style?: CSSProperties;
  emptyMessage?: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const DEFAULT_COLORS = [
  "#73966A",
  "#D6A756",
  "#7C9FC2",
  "#C98275",
  "#8D83B9",
  "#6DAFA2",
];

const SIZE_CONFIG = {
  sm: { height: 180, padding: 16, fontSize: 10 },
  md: { height: 260, padding: 24, fontSize: 11 },
  lg: { height: 340, padding: 28, fontSize: 12 },
  xl: { height: 440, padding: 32, fontSize: 13 },
} as const;

const RADIUS_CONFIG: Record<BarChartRadius, number> = {
  none: 0,
  sm: 3,
  md: 6,
  lg: 10,
  full: 999,
};

function resolveRadius(
  radius: BarChartRadius | number,
  thickness: number,
) {
  const value =
    typeof radius === "number"
      ? radius
      : RADIUS_CONFIG[radius];

  return Math.min(Math.max(value, 0), thickness / 2);
}

function formatDefaultValue(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function getNiceMax(value: number) {
  if (value <= 0) return 1;

  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;

  const nice =
    normalized <= 1
      ? 1
      : normalized <= 2
        ? 2
        : normalized <= 2.5
          ? 2.5
          : normalized <= 5
            ? 5
            : 10;

  return nice * magnitude;
}

function getNiceMin(value: number) {
  if (value >= 0) return 0;

  const magnitude = 10 ** Math.floor(Math.log10(Math.abs(value)));
  const normalized = Math.abs(value) / magnitude;

  const nice =
    normalized <= 1
      ? 1
      : normalized <= 2
        ? 2
        : normalized <= 2.5
          ? 2.5
          : normalized <= 5
            ? 5
            : 10;

  return -(nice * magnitude);
}

/* =========================================================
   COMPONENT
========================================================= */

export default function BarChart({
  data,
  series,

  variant = "basic",
  orientation = "vertical",
  surface = "raised",

  title,
  description,
  unit = "",

  width = "100%",
  height,
  size = "md",

  backgroundColor = "#E5E9E2",
  barColor = "#73966A",
  colors = DEFAULT_COLORS,
  textColor = "#344334",
  mutedColor = "#7E897D",
  gridColor = "#BFC8BB",

  radius = "lg",
  barRadius = "md",
  barGap = 12,
  barThickness,

  showGrid = true,
  showAxis = true,
  showValues = false,
  showLegend = true,
  showTooltip = true,
  showZeroLine = true,

  animated = true,
  animationDuration = 900,
  animationDelay = 0,

  showBorder = false,
  raisedShadow,
  insetShadow,

  formatValue = formatDefaultValue,
  onBarClick,

  className = "",
  style,
  emptyMessage = "No data available",
}: BarChartProps) {
  const uniqueId = useId().replace(/:/g, "");
  const clipId = `bar-chart-clip-${uniqueId}`;
  const insetFilterId = `bar-chart-inset-${uniqueId}`;
  const raisedFilterId = `bar-chart-raised-${uniqueId}`;

  const [progress, setProgress] = useState(
    animated ? 0 : 1,
  );

  const [activeBar, setActiveBar] = useState<{
    index: number;
    key: string;
    x: number;
    y: number;
    value: number;
  } | null>(null);

  const [hiddenSeries, setHiddenSeries] = useState<
    Set<string>
  >(() => new Set());

  const sizeConfig = SIZE_CONFIG[size];
  const chartHeight = height ?? sizeConfig.height;

  const isHorizontal = orientation === "horizontal";
  const isStacked =
    variant === "stacked" ||
    variant === "stacked-percent";
  const isPercent = variant === "stacked-percent";
  const isDiverging = variant === "diverging";
  const isGrouped = variant === "grouped";

  const actualSeries = useMemo<BarChartSeries[]>(() => {
    if (series?.length) return series;

    if (variant === "basic") {
      return [
        {
          key: "value",
          name: "Value",
          color: barColor,
        },
      ];
    }

    const keys = new Set<string>();

    data.forEach((datum) => {
      Object.keys(datum).forEach((key) => {
        if (key !== "label" && key !== "color") {
          if (typeof datum[key] === "number") {
            keys.add(key);
          }
        }
      });
    });

    return Array.from(keys).map((key, index) => ({
      key,
      name: key,
      color: colors[index % colors.length],
    }));
  }, [series, data, variant, barColor, colors]);

  const visibleSeries = actualSeries.filter(
    (item) => !hiddenSeries.has(item.key),
  );

  const visibleData = data.map((datum) => ({
    ...datum,
    value:
      typeof datum.value === "number"
        ? datum.value
        : 0,
  }));

  const allValues = data.flatMap((datum) =>
    visibleSeries.map((item) => {
      const value = datum[item.key];
      return typeof value === "number" ? value : 0;
    }),
  );

  const hasNegative = allValues.some((value) => value < 0);

  const positiveMax = Math.max(
    0,
    ...allValues.filter((value) => value >= 0),
  );

  const negativeMin = Math.min(
    0,
    ...allValues.filter((value) => value < 0),
  );

  const domainMax = isPercent
    ? 100
    : getNiceMax(
        isStacked
          ? Math.max(
              0,
              ...data.map((datum) =>
                visibleSeries.reduce(
                  (sum, item) =>
                    sum +
                    Math.max(
                      0,
                      typeof datum[item.key] === "number"
                        ? (datum[item.key] as number)
                        : 0,
                    ),
                  0,
                ),
              ),
            )
          : positiveMax,
      );

  const domainMin = isDiverging
    ? getNiceMin(negativeMin)
    : hasNegative
      ? negativeMin
      : 0;

  const surfaceStyle: CSSProperties = {
    backgroundColor,
    borderRadius:
      typeof radius === "number"
        ? radius
        : RADIUS_CONFIG[radius],
    boxShadow:
      surface === "flat"
        ? "none"
        : raisedShadow ??
          "6px 6px 12px #C7CEC4, -6px -6px 12px #FFFFFF",
    border: showBorder
      ? `1px solid ${gridColor}`
      : undefined,
    color: textColor,
    width,
    ...style,
  };

  useEffect(() => {
    if (!animated) {
      setProgress(1);
      return;
    }

    setProgress(0);

    let frame = 0;
    let startTime = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const startAnimation = () => {
      const animateFrame = (timestamp: number) => {
        if (!startTime) startTime = timestamp;

        const elapsed = timestamp - startTime;
        const linear = Math.min(
          elapsed / Math.max(animationDuration, 1),
          1,
        );

        // Ease-out cubic: fast at the beginning, gentle at the end.
        const eased = 1 - Math.pow(1 - linear, 3);

        setProgress(eased);

        if (linear < 1) {
          frame = requestAnimationFrame(animateFrame);
        }
      };

      frame = requestAnimationFrame(animateFrame);
    };

    timeout = setTimeout(
      startAnimation,
      Math.max(0, animationDelay),
    );

    return () => {
      if (timeout) clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [animated, animationDuration, animationDelay]);

  const chartPadding = sizeConfig.padding;

  const leftAxisSpace = isHorizontal && showAxis ? 92 : 12;
  const bottomAxisSpace = !isHorizontal && showAxis ? 38 : 12;
  const topSpace = showValues ? 24 : 12;
  const rightSpace = 16;

  const viewWidth = 720;
  const viewHeight = chartHeight;

  const plotX = leftAxisSpace + chartPadding / 2;
  const plotY = topSpace + chartPadding / 2;

  const plotWidth =
    viewWidth - plotX - rightSpace - chartPadding / 2;

  const plotHeight =
    viewHeight - plotY - bottomAxisSpace - chartPadding / 2;

  const zeroY =
    plotY +
    (domainMax / (domainMax - domainMin || 1)) *
      plotHeight;

  const zeroX =
    plotX +
    ((0 - domainMin) / (domainMax - domainMin || 1)) *
      plotWidth;

  const xScale = (value: number) =>
    plotX +
    ((value - domainMin) / (domainMax - domainMin || 1)) *
      plotWidth;

  const yScale = (value: number) =>
    plotY +
    ((domainMax - value) / (domainMax - domainMin || 1)) *
      plotHeight;

  const effectiveBarGap = Math.max(0, barGap);

  const categoryCount = Math.max(data.length, 1);

  const categoryBand = isHorizontal
    ? plotHeight / categoryCount
    : plotWidth / categoryCount;

  const innerGroupGap = 4;

  const defaultThickness = isHorizontal
    ? Math.min(
        28,
        Math.max(
          4,
          (categoryBand - effectiveBarGap) /
            (isGrouped ? visibleSeries.length : 1),
        ),
      )
    : Math.min(
        36,
        Math.max(
          4,
          (categoryBand - effectiveBarGap) /
            (isGrouped ? visibleSeries.length : 1),
        ),
      );

  const thickness = Math.max(
    2,
    barThickness ?? defaultThickness,
  );

  const resolvedBarRadius = resolveRadius(
    barRadius,
    thickness,
  );

  const getSeriesColor = (
    datum: BarChartDatum,
    item: BarChartSeries,
  ) => datum.color ?? item.color ?? barColor;

  const toggleSeries = useCallback((key: string) => {
    setHiddenSeries((current) => {
      const next = new Set(current);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });

    setActiveBar(null);
  }, []);

  const renderGrid = () => {
    if (!showGrid) return null;

    const divisions = 4;

    return Array.from(
      { length: divisions + 1 },
      (_, index) => {
        if (isHorizontal) {
          const x =
            plotX + (plotWidth / divisions) * index;

          const value =
            domainMin +
            ((domainMax - domainMin) / divisions) * index;

          return (
            <g key={`grid-x-${index}`}>
              <line
                x1={x}
                y1={plotY}
                x2={x}
                y2={plotY + plotHeight}
                stroke={gridColor}
                strokeOpacity={0.45}
                strokeDasharray="3 5"
              />

              {showAxis && (
                <text
                  x={x}
                  y={plotY + plotHeight + 22}
                  textAnchor="middle"
                  fontSize={sizeConfig.fontSize}
                  fill={mutedColor}
                >
                  {formatValue(value)}
                </text>
              )}
            </g>
          );
        }

        const y =
          plotY + (plotHeight / divisions) * index;

        const value =
          domainMax -
          ((domainMax - domainMin) / divisions) * index;

        return (
          <g key={`grid-y-${index}`}>
            <line
              x1={plotX}
              y1={y}
              x2={plotX + plotWidth}
              y2={y}
              stroke={gridColor}
              strokeOpacity={0.45}
              strokeDasharray="3 5"
            />

            {showAxis && (
              <text
                x={plotX - 10}
                y={y + 4}
                textAnchor="end"
                fontSize={sizeConfig.fontSize}
                fill={mutedColor}
              >
                {formatValue(value)}
              </text>
            )}
          </g>
        );
      },
    );
  };

  const renderCategoryLabels = () =>
    data.map((datum, index) => {
      if (isHorizontal) {
        const y =
          plotY +
          categoryBand * index +
          categoryBand / 2;

        return (
          <text
            key={`label-${index}`}
            x={plotX - 12}
            y={y + 4}
            textAnchor="end"
            fontSize={sizeConfig.fontSize}
            fill={mutedColor}
          >
            {datum.label.length > 16
              ? `${datum.label.slice(0, 14)}…`
              : datum.label}
          </text>
        );
      }

      const x =
        plotX +
        categoryBand * index +
        categoryBand / 2;

      return (
        <text
          key={`label-${index}`}
          x={x}
          y={plotY + plotHeight + 24}
          textAnchor="middle"
          fontSize={sizeConfig.fontSize}
          fill={mutedColor}
        >
          {datum.label.length > 12
            ? `${datum.label.slice(0, 10)}…`
            : datum.label}
        </text>
      );
    });

  const renderBars = () => {
    const elements: ReactNode[] = [];

    data.forEach((datum, index) => {
      const categoryStart = isHorizontal
        ? plotY + categoryBand * index
        : plotX + categoryBand * index;

      const categoryCenter =
        categoryStart + categoryBand / 2;

      if (isPercent) {
        const positiveTotal = visibleSeries.reduce(
          (sum, item) =>
            sum +
            Math.max(
              0,
              typeof datum[item.key] === "number"
                ? (datum[item.key] as number)
                : 0,
            ),
          0,
        );

        // Kích thước của thanh rãnh lõm 100% bên ngoài (Outer sunken track)
        const trackX = isHorizontal ? plotX : categoryCenter - thickness / 2;
        const trackY = isHorizontal ? categoryCenter - thickness / 2 : plotY;
        const trackWidth = isHorizontal ? plotWidth : thickness;
        const trackHeight = isHorizontal ? thickness : plotHeight;
        const trackRadius = Math.min(
          resolvedBarRadius + 2,
          Math.min(trackWidth, trackHeight) / 2,
        );

        // Khoảng cách mép nhỏ bên trong (inner margin) tạo chiều sâu 3D
        const innerPad = Math.max(2.5, Math.min(4, thickness * 0.12));
        const innerTrackX = trackX + innerPad;
        const innerTrackY = trackY + innerPad;
        const innerTrackWidth = Math.max(0, trackWidth - innerPad * 2);
        const innerTrackHeight = Math.max(0, trackHeight - innerPad * 2);
        const innerRadius = Math.max(2, trackRadius - innerPad);

        // 1. Render thanh rãnh lõm xuống 100% (Sunken groove)
        elements.push(
          <g key={`percent-track-${index}`}>
            {/* Lớp nền rãnh lõm có filter inset shadow */}
            <rect
              x={trackX}
              y={trackY}
              width={trackWidth}
              height={trackHeight}
              rx={trackRadius}
              fill={backgroundColor}
              filter={`url(#${insetFilterId})`}
            />
            {/* Viền khắc chìm tinh tế */}
            <rect
              x={trackX}
              y={trackY}
              width={trackWidth}
              height={trackHeight}
              rx={trackRadius}
              fill="none"
              stroke={gridColor}
              strokeOpacity={0.4}
              strokeWidth={1}
            />
          </g>,
        );

        // 2. Render các phần giá trị nổi lên bên trong (Floating raised bars)
        let percentAccumulator = 0;
        const segmentGap = 2;

        visibleSeries.forEach((item, seriesIndex) => {
          const raw = datum[item.key];
          const value = typeof raw === "number" ? raw : 0;
          const pct =
            positiveTotal > 0
              ? (Math.max(0, value) / positiveTotal) * 100
              : 0;
          const color = getSeriesColor(datum, item);

          let segX: number;
          let segY: number;
          let segWidth: number;
          let segHeight: number;

          if (isHorizontal) {
            const startX =
              innerTrackX + (percentAccumulator / 100) * innerTrackWidth * progress;
            const fullW = (pct / 100) * innerTrackWidth * progress;
            const gap =
              seriesIndex < visibleSeries.length - 1 && fullW > segmentGap
                ? segmentGap
                : 0;

            segX = startX;
            segY = innerTrackY;
            segWidth = Math.max(0, fullW - gap);
            segHeight = innerTrackHeight;
          } else {
            // Dọc: xếp chồng từ dưới lên trên (0% ở đáy rãnh, 100% ở đỉnh)
            const fullH = (pct / 100) * innerTrackHeight * progress;
            const startY =
              innerTrackY +
              innerTrackHeight -
              ((percentAccumulator + pct) / 100) * innerTrackHeight * progress;
            const gap = seriesIndex > 0 && fullH > segmentGap ? segmentGap : 0;

            segX = innerTrackX;
            segY = startY + gap;
            segWidth = innerTrackWidth;
            segHeight = Math.max(0, fullH - gap);
          }

          percentAccumulator += pct;

          if (segWidth > 0 && segHeight > 0) {
            elements.push(
              <g
                key={`percent-bar-${index}-${item.key}`}
                onMouseEnter={() =>
                  setActiveBar({
                    index,
                    key: item.key,
                    x: segX + segWidth / 2,
                    y: segY - 8,
                    value,
                  })
                }
                onMouseLeave={() => setActiveBar(null)}
                onClick={() => onBarClick?.(datum, item.key)}
                className={onBarClick ? "cursor-pointer" : ""}
              >
                {/* Thanh nổi lên (Raised pill) bên trong lòng rãnh lõm */}
                <rect
                  x={segX}
                  y={segY}
                  width={segWidth}
                  height={segHeight}
                  rx={innerRadius}
                  fill={color}
                  stroke="rgba(255, 255, 255, 0.45)"
                  strokeWidth={0.8}
                  style={{
                    filter: `url(#${raisedFilterId})`,
                    transition: "fill 180ms ease",
                  }}
                />

                {showValues && pct >= 12 && (
                  <text
                    x={segX + segWidth / 2}
                    y={segY + segHeight / 2 + 4}
                    textAnchor="middle"
                    fontSize={Math.max(9, sizeConfig.fontSize - 1)}
                    fontWeight={600}
                    fill="#ffffff"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    {`${Math.round(pct)}%`}
                  </text>
                )}
              </g>,
            );
          }
        });

        return;
      }

      if (isStacked) {
        let positiveAccumulator = 0;
        let negativeAccumulator = 0;

        visibleSeries.forEach((item, seriesIndex) => {
          const raw = datum[item.key];
          const value =
            typeof raw === "number" ? raw : 0;

          const displayValue = value;
          const color = getSeriesColor(datum, item);

          let x: number;
          let y: number;
          let barWidth: number;
          let barHeight: number;

          if (isHorizontal) {
            if (value >= 0) {
              const startValue = positiveAccumulator;
              const endValue = startValue + value;

              x = xScale(startValue);
              barWidth =
                (xScale(endValue) - xScale(startValue)) *
                progress;

              positiveAccumulator = endValue;
            } else {
              const startValue = negativeAccumulator;
              const endValue = startValue + value;

              x = xScale(endValue);
              barWidth =
                (xScale(startValue) - xScale(endValue)) *
                progress;

              negativeAccumulator = endValue;
            }

            y = categoryCenter - thickness / 2;
            barHeight = thickness;
          } else {
            if (value >= 0) {
              const startValue = positiveAccumulator;
              const endValue = startValue + displayValue;

              y = yScale(endValue);
              barHeight =
                (yScale(startValue) - yScale(endValue)) *
                progress;

              positiveAccumulator = endValue;
            } else {
              const startValue = negativeAccumulator;
              const endValue = startValue + value;

              y = yScale(0);
              barHeight =
                (yScale(endValue) - yScale(startValue)) *
                progress;

              negativeAccumulator = endValue;
            }

            x = categoryCenter - thickness / 2;
            barWidth = thickness;
          }

          const tooltipValue = value;

          elements.push(
            <g
              key={`${index}-${item.key}`}
              onMouseEnter={() =>
                setActiveBar({
                  index,
                  key: item.key,
                  x: x + barWidth / 2,
                  y: y - 8,
                  value: tooltipValue,
                })
              }
              onMouseLeave={() => setActiveBar(null)}
              onClick={() => onBarClick?.(datum, item.key)}
              className={onBarClick ? "cursor-pointer" : ""}
            >
              {(surface === "inset-raised" || surface === "inset-track") && (
                <rect
                  x={isHorizontal ? zeroX : x - 2}
                  y={isHorizontal ? y - 3 : zeroY}
                  width={isHorizontal ? plotWidth : barWidth + 4}
                  height={isHorizontal ? barHeight + 6 : plotY + plotHeight - zeroY}
                  rx={resolvedBarRadius}
                  fill={backgroundColor}
                  filter={`url(#${insetFilterId})`}
                />
              )}

              <rect
                x={x}
                y={y}
                width={Math.max(0, barWidth)}
                height={Math.max(0, barHeight)}
                rx={resolvedBarRadius}
                fill={color}
                stroke={
                  surface === "inset" || surface === "inset-bars"
                    ? "rgba(0, 0, 0, 0.25)"
                    : "rgba(255, 255, 255, 0.45)"
                }
                strokeWidth={0.8}
                style={{
                  filter:
                    surface === "inset" || surface === "inset-bars"
                      ? `url(#${insetFilterId})`
                      : surface === "flat"
                        ? "none"
                        : `url(#${raisedFilterId})`,
                  transition: "fill 180ms ease",
                }}
              />

              {showValues && (
                <text
                  x={isHorizontal ? x + barWidth + 6 : x + barWidth / 2}
                  y={isHorizontal ? y + barHeight / 2 + 4 : y - 7}
                  textAnchor={isHorizontal ? "start" : "middle"}
                  fontSize={sizeConfig.fontSize}
                  fill={textColor}
                >
                  {formatValue(value)}
                </text>
              )}
            </g>,
          );
        });

        return;
      }

      visibleSeries.forEach((item, seriesIndex) => {
        const raw = datum[item.key];
        const value =
          typeof raw === "number" ? raw : 0;

        const color = getSeriesColor(datum, item);

        const seriesCount = Math.max(visibleSeries.length, 1);

        const slotSize = isHorizontal
          ? categoryBand / seriesCount
          : categoryBand / seriesCount;

        const groupOffset = isGrouped
          ? (seriesIndex - (seriesCount - 1) / 2) *
              (thickness + innerGroupGap)
          : 0;

        const barSlotCenter = categoryCenter + groupOffset;

        let x: number;
        let y: number;
        let barWidth: number;
        let barHeight: number;

        if (isHorizontal) {
          const startX = xScale(0);
          const endX = xScale(value);

          x = value >= 0 ? startX : endX;
          barWidth =
            Math.abs(endX - startX) * progress;

          y = barSlotCenter - thickness / 2;
          barHeight = thickness;
        } else {
          const startY = yScale(0);
          const endY = yScale(value);

          x = barSlotCenter - thickness / 2;
          y = value >= 0 ? endY : startY;
          barWidth = thickness;
          barHeight =
            Math.abs(startY - endY) * progress;
        }

        const isInsetRaised = surface === "inset-raised" || surface === "inset-track";
        const isInset = surface === "inset" || surface === "inset-bars";

        if (isInsetRaised) {
          // 1. Rãnh 100% lõm xuống (Full Sunken Track)
          const trackX = isHorizontal ? plotX : barSlotCenter - thickness / 2;
          const trackY = isHorizontal ? barSlotCenter - thickness / 2 : plotY;
          const trackWidth = isHorizontal ? plotWidth : thickness;
          const trackHeight = isHorizontal ? thickness : plotHeight;
          const trackRadius = Math.min(
            resolvedBarRadius + 2,
            Math.min(trackWidth, trackHeight) / 2,
          );

          // 2. Khoảng đệm mép nhỏ bên trong (inner margin)
          const innerPad = Math.max(2.5, Math.min(3.5, thickness * 0.12));
          const innerTrackX = trackX + innerPad;
          const innerTrackY = trackY + innerPad;
          const innerTrackW = Math.max(0, trackWidth - innerPad * 2);
          const innerTrackH = Math.max(0, trackHeight - innerPad * 2);
          const innerRadius = Math.max(2, trackRadius - innerPad);

          elements.push(
            <g key={`track-${index}-${item.key}`}>
              {/* Nền rãnh lõm với inset shadow */}
              <rect
                x={trackX}
                y={trackY}
                width={trackWidth}
                height={trackHeight}
                rx={trackRadius}
                fill={backgroundColor}
                filter={`url(#${insetFilterId})`}
              />
              {/* Viền khắc chìm */}
              <rect
                x={trackX}
                y={trackY}
                width={trackWidth}
                height={trackHeight}
                rx={trackRadius}
                fill="none"
                stroke={gridColor}
                strokeOpacity={0.4}
                strokeWidth={1}
              />
            </g>,
          );

          // 3. Thanh giá trị nổi lồi lên bên trong rãnh (Floating raised bar)
          let barX: number;
          let barY: number;
          let barW: number;
          let barH: number;

          const ratio = Math.min(
            1,
            Math.max(0, (value - domainMin) / (domainMax - domainMin || 1)),
          );

          if (isHorizontal) {
            const valW = ratio * innerTrackW * progress;
            barX = innerTrackX;
            barY = innerTrackY;
            barW = Math.max(0, valW);
            barH = innerTrackH;
          } else {
            const valH = ratio * innerTrackH * progress;
            barX = innerTrackX;
            barY = innerTrackY + innerTrackH - valH;
            barW = innerTrackW;
            barH = Math.max(0, valH);
          }

          if (barW > 0 && barH > 0) {
            elements.push(
              <g
                key={`bar-${index}-${item.key}`}
                onMouseEnter={() =>
                  setActiveBar({
                    index,
                    key: item.key,
                    x: barX + barW / 2,
                    y: barY - 8,
                    value,
                  })
                }
                onMouseLeave={() => setActiveBar(null)}
                onClick={() => onBarClick?.(datum, item.key)}
                className={onBarClick ? "cursor-pointer" : ""}
              >
                <rect
                  x={barX}
                  y={barY}
                  width={barW}
                  height={barH}
                  rx={innerRadius}
                  fill={color}
                  stroke="rgba(255, 255, 255, 0.45)"
                  strokeWidth={0.8}
                  style={{
                    filter: `url(#${raisedFilterId})`,
                    transition: "fill 180ms ease",
                  }}
                />

                {showValues && (
                  <text
                    x={isHorizontal ? barX + barW + 8 : barX + barW / 2}
                    y={isHorizontal ? barY + barH / 2 + 4 : barY - 7}
                    textAnchor={isHorizontal ? "start" : "middle"}
                    fontSize={sizeConfig.fontSize}
                    fill={textColor}
                  >
                    {formatValue(value)}
                  </text>
                )}
              </g>,
            );
          }
        } else if (isInset) {
          // Kiểu Lõm xuống (Inset Bar)
          elements.push(
            <g
              key={`${index}-${item.key}`}
              onMouseEnter={() =>
                setActiveBar({
                  index,
                  key: item.key,
                  x: x + barWidth / 2,
                  y: y - 8,
                  value,
                })
              }
              onMouseLeave={() => setActiveBar(null)}
              onClick={() => onBarClick?.(datum, item.key)}
              className={onBarClick ? "cursor-pointer" : ""}
            >
              <rect
                x={x}
                y={y}
                width={Math.max(0, barWidth)}
                height={Math.max(0, barHeight)}
                rx={resolvedBarRadius}
                fill={color}
                filter={`url(#${insetFilterId})`}
                style={{ transition: "fill 180ms ease" }}
              />
              <rect
                x={x}
                y={y}
                width={Math.max(0, barWidth)}
                height={Math.max(0, barHeight)}
                rx={resolvedBarRadius}
                fill="none"
                stroke="rgba(0, 0, 0, 0.25)"
                strokeWidth={1}
              />

              {showValues && (
                <text
                  x={isHorizontal ? x + barWidth + 6 : x + barWidth / 2}
                  y={isHorizontal ? y + barHeight / 2 + 4 : y - 7}
                  textAnchor={isHorizontal ? "start" : "middle"}
                  fontSize={sizeConfig.fontSize}
                  fill={textColor}
                >
                  {formatValue(value)}
                </text>
              )}
            </g>,
          );
        } else {
          // Kiểu Lồi lên (Raised Bar)
          elements.push(
            <g
              key={`${index}-${item.key}`}
              onMouseEnter={() =>
                setActiveBar({
                  index,
                  key: item.key,
                  x: x + barWidth / 2,
                  y: y - 8,
                  value,
                })
              }
              onMouseLeave={() => setActiveBar(null)}
              onClick={() => onBarClick?.(datum, item.key)}
              className={onBarClick ? "cursor-pointer" : ""}
            >
              <rect
                x={x}
                y={y}
                width={Math.max(0, barWidth)}
                height={Math.max(0, barHeight)}
                rx={resolvedBarRadius}
                fill={color}
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth={0.8}
                style={{
                  filter: surface === "flat" ? "none" : `url(#${raisedFilterId})`,
                  transition: "fill 180ms ease",
                }}
              />

              {showValues && (
                <text
                  x={isHorizontal ? x + barWidth + 6 : x + barWidth / 2}
                  y={isHorizontal ? y + barHeight / 2 + 4 : y - 7}
                  textAnchor={isHorizontal ? "start" : "middle"}
                  fontSize={sizeConfig.fontSize}
                  fill={textColor}
                >
                  {formatValue(value)}
                </text>
              )}
            </g>,
          );
        }
      });
    });

    return elements;
  };

  const tooltipDatum =
    activeBar && data[activeBar.index]
      ? data[activeBar.index]
      : null;

  const tooltipSeries = activeBar
    ? actualSeries.find((item) => item.key === activeBar.key)
    : undefined;

  let tooltipText = "";
  if (activeBar) {
    const datum = data[activeBar.index];
    const sName = tooltipSeries?.name ?? "Value";
    const vText = `${formatValue(activeBar.value)}${unit ? ` ${unit}` : ""}`;
    if (isPercent && datum) {
      const posTotal = visibleSeries.reduce(
        (sum, item) =>
          sum +
          Math.max(
            0,
            typeof datum[item.key] === "number"
              ? (datum[item.key] as number)
              : 0,
          ),
        0,
      );
      const pct =
        posTotal > 0 ? (Math.max(0, activeBar.value) / posTotal) * 100 : 0;
      tooltipText = `${sName}: ${vText} (${pct.toFixed(1)}%)`;
    } else {
      tooltipText = `${sName}: ${vText}`;
    }
  }

  return (
    <section
      className={`w-full min-w-0 p-5 transition-colors duration-300 ${className}`}
      style={surfaceStyle}
      aria-label={title ?? "Bar chart"}
    >
      {(title || description) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h3
                className="text-base font-semibold tracking-tight"
                style={{ color: textColor }}
              >
                {title}
              </h3>
            )}

            {description && (
              <p
                className="mt-1 text-sm"
                style={{ color: mutedColor }}
              >
                {description}
              </p>
            )}
          </div>
        </header>
      )}

      {showLegend && actualSeries.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
          {actualSeries.map((item) => {
            const isHidden = hiddenSeries.has(item.key);

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleSeries(item.key)}
                aria-pressed={!isHidden}
                className="inline-flex items-center gap-2 text-xs transition-opacity hover:opacity-75"
                style={{
                  color: mutedColor,
                  opacity: isHidden ? 0.45 : 1,
                }}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      item.color ?? barColor,
                    boxShadow: isHidden
                      ? "none"
                      : "1px 1px 2px rgba(0,0,0,.12)",
                  }}
                />
                {item.name}
              </button>
            );
          })}
        </div>
      )}

      {data.length === 0 || visibleSeries.length === 0 ? (
        <div
          className="flex items-center justify-center rounded-xl px-4 text-sm"
          style={{
            height: chartHeight,
            color: mutedColor,
            backgroundColor,
            boxShadow:
              "inset 3px 3px 7px rgba(120,135,116,.16), inset -3px -3px 7px rgba(255,255,255,.7)",
          }}
        >
          {emptyMessage}
        </div>
      ) : (
        <div className="relative w-full min-w-0">
          <svg
            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            width="100%"
            height={chartHeight}
            role="img"
            aria-label={title ?? "Bar chart visualization"}
            className="block overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id={clipId}>
                <rect
                  x={plotX - 6}
                  y={plotY - 6}
                  width={plotWidth + 12}
                  height={plotHeight + 12}
                />
              </clipPath>

              {/* Filter tạo rãnh lõm xuống (100% Sunken Track) */}
              <filter
                id={insetFilterId}
                x="-10%"
                y="-10%"
                width="120%"
                height="120%"
              >
                <feOffset dx="2.5" dy="2.5" />
                <feGaussianBlur stdDeviation="2" result="offset-blur" />
                <feComposite
                  operator="out"
                  in="SourceGraphic"
                  in2="offset-blur"
                  result="inverse"
                />
                <feFlood
                  floodColor="rgba(0, 0, 0, 0.28)"
                  result="color-dark"
                />
                <feComposite
                  operator="in"
                  in="color-dark"
                  in2="inverse"
                  result="shadow-dark"
                />

                <feOffset
                  in="SourceGraphic"
                  dx="-2"
                  dy="-2"
                  result="offset-light"
                />
                <feGaussianBlur
                  in="offset-light"
                  stdDeviation="2"
                  result="blur-light"
                />
                <feComposite
                  operator="out"
                  in="SourceGraphic"
                  in2="blur-light"
                  result="inverse-light"
                />
                <feFlood
                  floodColor="rgba(255, 255, 255, 0.85)"
                  result="color-light"
                />
                <feComposite
                  operator="in"
                  in="color-light"
                  in2="inverse-light"
                  result="shadow-light"
                />

                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="shadow-dark" />
                  <feMergeNode in="shadow-light" />
                </feMerge>
              </filter>

              {/* Filter tạo thanh giá trị nổi lên (Raised Floating Bar) */}
              <filter
                id={raisedFilterId}
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feDropShadow
                  dx="-1"
                  dy="-1"
                  stdDeviation="1.5"
                  floodColor="rgba(255, 255, 255, 0.8)"
                />
                <feDropShadow
                  dx="2"
                  dy="2.5"
                  stdDeviation="2"
                  floodColor="rgba(0, 0, 0, 0.28)"
                />
              </filter>
            </defs>

            {renderGrid()}

            {showZeroLine && hasNegative && (
              <line
                x1={isHorizontal ? zeroX : plotX}
                y1={isHorizontal ? plotY : zeroY}
                x2={isHorizontal ? zeroX : plotX + plotWidth}
                y2={isHorizontal ? plotY + plotHeight : zeroY}
                stroke={mutedColor}
                strokeWidth={1.5}
                strokeOpacity={0.7}
              />
            )}

            {showAxis && renderCategoryLabels()}

            <g clipPath={`url(#${clipId})`}>
              {renderBars()}
            </g>

            {showTooltip && activeBar && tooltipDatum && (
              <g pointerEvents="none">
                <rect
                  x={Math.max(
                    plotX,
                    Math.min(
                      activeBar.x - 75,
                      plotX + plotWidth - 154,
                    ),
                  )}
                  y={Math.max(plotY, activeBar.y - 38)}
                  width={150}
                  height={30}
                  rx={8}
                  fill={backgroundColor}
                  stroke={gridColor}
                  strokeOpacity={0.4}
                  style={{
                    filter:
                      "drop-shadow(2px 2px 4px rgba(120,135,116,.25)) drop-shadow(-2px -2px 4px rgba(255,255,255,.75))",
                  }}
                />

                <text
                  x={Math.max(
                    plotX + 75,
                    Math.min(
                      activeBar.x,
                      plotX + plotWidth - 79,
                    ),
                  )}
                  y={Math.max(plotY + 19, activeBar.y - 19)}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill={textColor}
                >
                  {tooltipText}
                </text>
              </g>
            )}
          </svg>
        </div>
      )}
    </section>
  );
}