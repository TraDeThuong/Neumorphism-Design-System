"use client";

import { useEffect, useRef, useState, useId } from "react";
import { Check, Clock, Moon, Sun, SunMoon } from "lucide-react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";
const DAY_START_HOUR = 6;
const NIGHT_START_HOUR = 18;

function isDayTimeNow(date: Date = new Date()): boolean {
  const hour = date.getHours();
  return hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR;
}

function resolveRealtimeTheme(t: Theme, date: Date = new Date()): "light" | "dark" {
  if (t === "system") {
    return isDayTimeNow(date) ? "light" : "dark";
  }
  return t;
}

export function ThemeToggle({
  className = "",
  id = "theme-toggle-btn",
}: {
  className?: string;
  id?: string;
}) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [isDayTime, setIsDayTime] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    let initial: Theme = "system";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") {
        initial = stored as Theme;
      }
    } catch {
      initial = "system";
    }

    const now = new Date();
    const day = isDayTimeNow(now);
    const resolved = resolveRealtimeTheme(initial, now);

    setThemeState(initial);
    setIsDayTime(day);
    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);

    const checkRealtime = () => {
      const currentDate = new Date();
      const currentDay = isDayTimeNow(currentDate);
      setIsDayTime(currentDay);

      let currentTheme: Theme = "system";
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark" || stored === "system") {
          currentTheme = stored as Theme;
        }
      } catch {
        currentTheme = "system";
      }

      if (currentTheme === "system") {
        const nextResolved = currentDay ? "light" : "dark";
        setResolvedTheme(nextResolved);
        document.documentElement.setAttribute("data-theme", nextResolved);
      }
    };

    const intervalId = window.setInterval(checkRealtime, 15_000);
    const handleVis = () => {
      if (document.visibilityState === "visible") checkRealtime();
    };
    document.addEventListener("visibilitychange", handleVis);
    window.addEventListener("focus", handleVis);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVis);
      window.removeEventListener("focus", handleVis);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    const resolved = resolveRealtimeTheme(next);
    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  };

  const options: Array<{
    value: Theme;
    label: string;
    description: string;
    icon: typeof Sun;
    iconColor: string;
    optionId: string;
  }> = [
    {
      value: "light",
      label: "Sáng",
      description: "Cố định giao diện sáng ban ngày",
      icon: Sun,
      iconColor: "text-amber-500",
      optionId: "theme-option-light",
    },
    {
      value: "dark",
      label: "Tối",
      description: "Cố định giao diện tối ban đêm",
      icon: Moon,
      iconColor: "text-indigo-400",
      optionId: "theme-option-dark",
    },
    {
      value: "system",
      label: "Hệ thống (Tự động)",
      description: "06:00 – 18:00 Sáng • 18:00 – 06:00 Tối",
      icon: SunMoon,
      iconColor: "text-primary",
      optionId: "theme-option-system",
    },
  ];

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        id={id}
        type="button"
        aria-label="Chuyển đổi giao diện sáng / tối / hệ thống"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? listboxId : undefined}
        title={
          theme === "system"
            ? `Hệ thống tự động (Hiện tại: ${isDayTime ? "Ban ngày → Sáng" : "Ban đêm → Tối"})`
            : theme === "dark"
              ? "Giao diện: Tối"
              : "Giao diện: Sáng"
        }
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl
          border border-[color-mix(in_srgb,var(--shadow-light)_30%,transparent)]
          bg-background text-foreground
          shadow-[2px_2px_5px_color-mix(in_srgb,var(--shadow-dark)_20%,transparent),-2px_-2px_5px_color-mix(in_srgb,var(--shadow-light)_70%,transparent)]
          transition-all duration-200
          hover:text-primary active:shadow-nm-pressed active:translate-y-px
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
        "
      >
        {theme === "system" ? (
          <SunMoon className="h-4.5 w-4.5 text-primary transition-transform duration-300 group-hover:scale-110" />
        ) : resolvedTheme === "dark" ? (
          <Moon className="h-4.5 w-4.5 text-indigo-400 transition-transform duration-300 group-hover:-rotate-12" />
        ) : (
          <Sun className="h-4.5 w-4.5 text-amber-500 transition-transform duration-300 group-hover:rotate-45" />
        )}

        {theme === "system" && (
          <span
            aria-hidden="true"
            className="absolute top-1.5 right-1.5 flex h-2 w-2"
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="menu"
          aria-label="Chế độ giao diện"
          className="
            absolute right-0 top-[calc(100%+10px)] z-50 w-72 origin-top-right
            overflow-hidden rounded-2xl border
            border-[color-mix(in_srgb,var(--shadow-light)_40%,transparent)]
            bg-background p-2
            shadow-[8px_10px_24px_color-mix(in_srgb,var(--shadow-dark)_22%,transparent),-4px_-4px_12px_color-mix(in_srgb,var(--shadow-light)_55%,transparent)]
            animate-in fade-in slide-in-from-top-2 duration-200
          "
        >
          <div className="px-2.5 pb-2 pt-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Giao diện hiển thị
              </p>
              {theme === "system" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--shadow-dark)_8%,transparent)] bg-card/60 p-2 text-xs shadow-[inset_1px_1px_3px_color-mix(in_srgb,var(--shadow-dark)_15%,transparent),inset_-1px_-1px_3px_color-mix(in_srgb,var(--shadow-light)_65%,transparent)]">
              <Clock className="h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-foreground">
                  Thời gian thực Ngày & Đêm
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {isDayTime
                    ? "06:00 – 18:00: Ban ngày (Giao diện Sáng)"
                    : "18:00 – 06:00: Ban đêm (Giao diện Tối)"}
                </p>
              </div>
            </div>
          </div>

          <div className="mx-1.5 my-1 h-px bg-[color-mix(in_srgb,var(--shadow-dark)_10%,transparent)]" />

          <div className="flex flex-col gap-1">
            {options.map((opt) => {
              const isSelected = theme === opt.value;
              const Icon = opt.icon;

              return (
                <button
                  key={opt.value}
                  id={opt.optionId}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setTheme(opt.value);
                    setIsOpen(false);
                  }}
                  className={`
                    group relative flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                    ${
                      isSelected
                        ? "bg-primary/10 text-primary shadow-[inset_2px_2px_4px_color-mix(in_srgb,var(--shadow-dark)_12%,transparent),inset_-2px_-2px_4px_color-mix(in_srgb,var(--shadow-light)_70%,transparent)]"
                        : "text-foreground hover:bg-muted/40 hover:shadow-[2px_2px_4px_color-mix(in_srgb,var(--shadow-dark)_10%,transparent)]"
                    }
                  `}
                >
                  <div
                    className={`
                      flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--shadow-light)_30%,transparent)] bg-background
                      ${
                        isSelected
                          ? "shadow-[inset_1px_1px_3px_color-mix(in_srgb,var(--shadow-dark)_20%,transparent)]"
                          : "shadow-[2px_2px_4px_color-mix(in_srgb,var(--shadow-dark)_16%,transparent),-2px_-2px_4px_color-mix(in_srgb,var(--shadow-light)_70%,transparent)]"
                      }
                    `}
                  >
                    <Icon className={`h-4 w-4 ${opt.iconColor}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold leading-tight">
                        {opt.label}
                      </p>
                      {opt.value === "system" && (
                        <span className="rounded bg-primary/15 px-1 py-0.2 text-[9px] font-black tracking-wider text-primary uppercase">
                          Auto
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
                      {opt.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[1px_1px_3px_rgba(0,0,0,0.2)]">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
