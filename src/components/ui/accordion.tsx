
"use client";

import {
  type ReactNode,
  useId,
  useState,
} from "react";
import {
  ChevronDown,
  CircleAlert,
  LoaderCircle,
  Minus,
  Plus,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  badge?: ReactNode;
}

export type AccordionType = "single" | "multiple";

export interface AccordionProps {
  items: AccordionItem[];
  type?: AccordionType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  disabled?: boolean;
  error?: string;
  emptyMessage?: ReactNode;
  className?: string;
  itemClassName?: string;
  contentClassName?: string;
  showItemNumbers?: boolean;
  variant?: "sculpted" | "minimal";
}

function normalizeValue(
  value: string | string[] | undefined,
  type: AccordionType,
): string[] {
  if (Array.isArray(value)) {
    return type === "single" ? value.slice(0, 1) : value;
  }

  return value ? [value] : [];
}

/* =========================================================
   ACCORDION
========================================================= */

export function Accordion({
  items,
  type = "single",
  value,
  defaultValue,
  onValueChange,
  collapsible = true,
  disabled = false,
  error,
  emptyMessage = "Chưa có nội dung để hiển thị.",
  className = "",
  itemClassName = "",
  contentClassName = "",
  showItemNumbers = false,
  variant = "sculpted",
}: AccordionProps) {
  const generatedId = useId();
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<string[]>(() =>
    normalizeValue(defaultValue, type),
  );

  const openItems = normalizeValue(
    isControlled ? value : internalValue,
    type,
  );

  const setOpenItems = (next: string[]) => {
    if (!isControlled) {
      setInternalValue(next);
    }

    onValueChange?.(type === "single" ? next[0] ?? "" : next);
  };

  const toggleItem = (id: string) => {
    if (disabled) return;

    const item = items.find((entry) => entry.id === id);

    if (!item || item.disabled || item.loading) return;

    const isOpen = openItems.includes(id);

    if (isOpen) {
      if (type === "single" && !collapsible) return;
      setOpenItems(openItems.filter((entry) => entry !== id));
      return;
    }

    setOpenItems(
      type === "single" ? [id] : [...openItems, id],
    );
  };

  const isMinimal = variant === "minimal";

  return (
    <section
      aria-label="Accordion"
      className={`w-full min-w-0 ${className}`}
      data-testid="accordion"
    >
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--danger)_28%,transparent)] bg-[color-mix(in_srgb,var(--danger)_7%,transparent)] px-4 py-3 text-sm text-[var(--danger)]"
        >
          <CircleAlert
            size={18}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <span>{error}</span>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[var(--border)] px-5 py-8 text-center text-sm text-[var(--muted-foreground)]">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[var(--muted)] shadow-[var(--nm-inset)]">
            <Plus size={18} aria-hidden="true" />
          </div>
          {emptyMessage}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item, index) => {
            const isOpen = openItems.includes(item.id);
            const isDisabled = disabled || !!item.disabled;
            const isLoading = !!item.loading;

            const triggerId =
              `${generatedId}-trigger-${index}`;
            const panelId =
              `${generatedId}-panel-${index}`;

            return (
              <article
                key={item.id}
                data-state={isOpen ? "open" : "closed"}
                data-disabled={isDisabled || undefined}
                className={[
                  "group relative min-w-0 rounded-[1.55rem]",
                  "transition-[box-shadow,opacity,transform]",
                  "duration-300 ease-out",
                  "motion-reduce:transition-none",
                  isMinimal
                    ? "border-b border-[var(--border)]"
                    : [
                        "border border-[color-mix(in_srgb,var(--border)_65%,transparent)]",
                        "shadow-[var(--nm-raised-sm)]",
                        "before:pointer-events-none before:absolute before:inset-px",
                        "before:rounded-[calc(1.55rem-1px)]",
                        "before:border before:border-[color-mix(in_srgb,var(--shadow-light)_20%,transparent)]",
                        "before:content-['']",
                        "hover:shadow-[var(--nm-raised)]",
                        "hover:-translate-y-px",
                        "active:translate-y-0",
                      ].join(" "),
                  isDisabled ? "opacity-50" : "",
                  itemClassName,
                ].join(" ")}
              >
                {/* Trigger */}
                <h3 className="relative z-[1] m-0">
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    aria-disabled={
                      isDisabled ||
                      isLoading ||
                      (isOpen && type === "single" && !collapsible)
                        ? true
                        : undefined
                    }
                    disabled={isDisabled || isLoading}
                    onClick={() => toggleItem(item.id)}
                    className={[
                      "relative flex w-full min-w-0 items-center gap-3",
                      "rounded-[inherit] px-4 py-4 text-left sm:px-5",
                      "outline-none",
                      "focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                      "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                      "transition-colors duration-200",
                      "motion-reduce:transition-none",
                      "disabled:cursor-not-allowed",
                      isOpen && !isMinimal
                        ? "rounded-b-none"
                        : "",
                    ].join(" ")}
                  >
                    {/* Leading sculpted icon */}
                    <span
                      className={[
                        "relative flex size-10 shrink-0 items-center justify-center",
                        "rounded-[1rem] border transition-all duration-300",
                        "motion-reduce:transition-none",
                        isMinimal
                          ? "border-transparent"
                          : [
                              "border-[color-mix(in_srgb,var(--border)_65%,transparent)]",
                              isOpen
                                ? "bg-[color-mix(in_srgb,var(--primary)_9%,transparent)] text-[var(--primary)] shadow-[var(--nm-inset)]"
                                : "bg-transparent text-[var(--muted-foreground)] shadow-[var(--nm-raised-sm)] group-hover:text-[var(--foreground)]",
                            ].join(" "),
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {item.icon ?? (
                        <span className="text-[10px] font-bold tracking-[0.12em]">
                          {showItemNumbers
                            ? String(index + 1).padStart(2, "0")
                            : (
                                <Minus
                                  size={17}
                                  strokeWidth={1.8}
                                  className={[
                                    "transition-transform duration-300",
                                    "motion-reduce:transition-none",
                                    isOpen ? "rotate-0" : "-rotate-90",
                                  ].join(" ")}
                                />
                              )}
                        </span>
                      )}
                    </span>

                    {/* Title and description */}
                    <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold leading-5 tracking-[-0.015em] text-[var(--foreground)] sm:text-[0.9375rem]">
                        <span className="min-w-0 break-words">
                          {item.title}
                        </span>

                        {item.badge != null && (
                          <span className="inline-flex shrink-0 items-center">
                            {item.badge}
                          </span>
                        )}
                      </span>

                      {item.description != null && (
                        <span className="text-xs leading-5 text-[var(--muted-foreground)] sm:text-[0.8125rem]">
                          {item.description}
                        </span>
                      )}
                    </span>

                    {/* State indicator */}
                    <span
                      className={[
                        "relative flex size-9 shrink-0 items-center justify-center",
                        "rounded-xl transition-all duration-300",
                        "motion-reduce:transition-none",
                        isMinimal
                          ? "text-[var(--muted-foreground)]"
                          : [
                              "border border-[color-mix(in_srgb,var(--border)_55%,transparent)]",
                              isOpen
                                ? "bg-[var(--muted)] text-[var(--primary)] shadow-[var(--nm-inset)]"
                                : "bg-transparent text-[var(--muted-foreground)] shadow-[var(--nm-raised-sm)] group-hover:text-[var(--foreground)]",
                            ].join(" "),
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {isLoading ? (
                        <LoaderCircle
                          size={17}
                          className="animate-spin motion-reduce:animate-none"
                        />
                      ) : (
                        <ChevronDown
                          size={18}
                          strokeWidth={1.8}
                          className={[
                            "transition-transform duration-300 ease-out",
                            "motion-reduce:transition-none",
                            isOpen ? "rotate-180" : "rotate-0",
                          ].join(" ")}
                        />
                      )}
                    </span>
                  </button>
                </h3>

                {/* Animated content region */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                  className={[
                    "grid transition-[grid-template-rows,opacity]",
                    "duration-300 ease-in-out",
                    "motion-reduce:transition-none",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className={[
                        "mx-3 mb-3 rounded-[1.15rem]",
                        "border border-[color-mix(in_srgb,var(--border)_45%,transparent)]",
                        "bg-[color-mix(in_srgb,var(--muted)_24%,transparent)]",
                        "shadow-[var(--nm-inset)]",
                        "transition-[padding,transform] duration-300",
                        "motion-reduce:transition-none",
                        isOpen
                          ? "translate-y-0 p-4 sm:p-5"
                          : "translate-y-1 p-4 sm:p-5",
                        "text-sm leading-7 text-[var(--muted-foreground)]",
                        "[&_a]:font-medium [&_a]:text-[var(--primary)]",
                        "[&_a]:underline-offset-4 hover:[&_a]:underline",
                        "[&_strong]:font-semibold [&_strong]:text-[var(--foreground)]",
                        contentClassName,
                      ].join(" ")}
                    >
                      {item.content}
                    </div>
                  </div>
                </div>

                {/* Subtle open-state accent */}
                {!isMinimal && (
                  <span
                    aria-hidden="true"
                    className={[
                      "pointer-events-none absolute bottom-3 left-0 top-3 w-[2px]",
                      "rounded-r-full bg-[var(--primary)]",
                      "transition-opacity duration-300",
                      "motion-reduce:transition-none",
                      isOpen ? "opacity-70" : "opacity-0",
                    ].join(" ")}
                  />
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   COLLAPSIBLE
   Standalone disclosure for a single section.
========================================================= */

export interface CollapsibleProps {
  title: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

export function Collapsible({
  title,
  children,
  description,
  icon,
  defaultOpen = false,
  open,
  onOpenChange,
  disabled = false,
  className = "",
  contentClassName = "",
}: CollapsibleProps) {
  const generatedId = useId();
  const isControlled = open !== undefined;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open : internalOpen;

  const toggle = () => {
    if (disabled) return;

    const next = !isOpen;

    if (!isControlled) {
      setInternalOpen(next);
    }

    onOpenChange?.(next);
  };

  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      className={[
        "group relative min-w-0 rounded-[1.55rem]",
        "border border-[color-mix(in_srgb,var(--border)_65%,transparent)]",
        "shadow-[var(--nm-raised-sm)]",
        "transition-[box-shadow,transform,opacity] duration-300",
        "motion-reduce:transition-none",
        "hover:shadow-[var(--nm-raised)]",
        disabled ? "opacity-50" : "",
        className,
      ].join(" ")}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${generatedId}-panel`}
        disabled={disabled}
        onClick={toggle}
        className={[
          "flex w-full min-w-0 items-center gap-3 rounded-[inherit]",
          "px-4 py-4 text-left outline-none sm:px-5",
          "focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          "disabled:cursor-not-allowed",
        ].join(" ")}
      >
        {icon && (
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-[var(--primary)] shadow-[var(--nm-raised-sm)]"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="break-words text-sm font-semibold text-[var(--foreground)]">
            {title}
          </span>

          {description && (
            <span className="text-xs leading-5 text-[var(--muted-foreground)]">
              {description}
            </span>
          )}
        </span>

        <span
          className={[
            "flex size-9 shrink-0 items-center justify-center rounded-xl",
            "text-[var(--muted-foreground)] transition-all duration-300",
            "motion-reduce:transition-none",
            isOpen
              ? "bg-[var(--muted)] text-[var(--primary)] shadow-[var(--nm-inset)]"
              : "shadow-[var(--nm-raised-sm)]",
          ].join(" ")}
          aria-hidden="true"
        >
          <ChevronDown
            size={18}
            className={[
              "transition-transform duration-300",
              "motion-reduce:transition-none",
              isOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        </span>
      </button>

      <div
        id={`${generatedId}-panel`}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={[
          "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
          "motion-reduce:transition-none",
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={[
              "mx-3 mb-3 rounded-[1.15rem]",
              "border border-[color-mix(in_srgb,var(--border)_45%,transparent)]",
              "bg-[color-mix(in_srgb,var(--muted)_24%,transparent)]",
              "p-4 text-sm leading-7 text-[var(--muted-foreground)]",
              "shadow-[var(--nm-inset)] sm:p-5",
              contentClassName,
            ].join(" ")}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
