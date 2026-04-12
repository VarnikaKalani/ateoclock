"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface PillTab {
  value: string;
  label: React.ReactNode;
  panel?: React.ReactNode;
}

interface PillMorphTabsProps {
  items?: PillTab[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export default function PillMorphTabs({
  items = [],
  defaultValue,
  onValueChange,
  className,
}: PillMorphTabsProps) {
  const first = items[0]?.value ?? "tab-0";
  const [value, setValue] = React.useState<string>(defaultValue ?? first);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null);
  const [isExpanding, setIsExpanding] = React.useState(false);

  const measure = React.useCallback(() => {
    const list = listRef.current;
    const activeEl = triggerRefs.current[value];
    if (!list || !activeEl) { setIndicator(null); return; }
    const listRect = list.getBoundingClientRect();
    const tRect = activeEl.getBoundingClientRect();
    setIndicator({ left: tRect.left - listRect.left + list.scrollLeft, width: tRect.width });
  }, [value]);

  React.useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    Object.values(triggerRefs.current).forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [measure]);

  React.useEffect(() => {
    setIsExpanding(true);
    const id = window.setTimeout(() => setIsExpanding(false), 300);
    return () => window.clearTimeout(id);
  }, [value]);

  React.useEffect(() => { if (onValueChange) onValueChange(value); }, [value, onValueChange]);

  return (
    <div className={cn("w-full", className)}>
      <Tabs value={value} onValueChange={(v) => setValue(v)}>
        <div ref={listRef} className="relative inline-flex items-center">
          {indicator && (
            <motion.div
              layout
              initial={false}
              animate={{
                left: indicator.left,
                width: indicator.width,
                scaleY: isExpanding ? 1.06 : 1,
                borderRadius: isExpanding ? 24 : 999,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="absolute pointer-events-none top-0 bottom-0 rounded-full"
              style={{
                background: "rgba(242,134,149,0.08)",
                left: indicator.left,
                width: indicator.width,
              }}
            />
          )}
          <TabsList className="relative flex gap-2 bg-transparent p-0 h-auto">
            {items.map((it) => {
              const isActive = it.value === value;
              return (
                <TabsTrigger
                  key={it.value}
                  value={it.value}
                  ref={(el: HTMLButtonElement | null) => { triggerRefs.current[it.value] = el }}
                  className={cn(
                    "relative z-10 rounded-full text-sm font-medium transition-colors bg-transparent shadow-none border-none",
                    isActive ? "text-[#F28695] opacity-100" : "text-[#F28695] opacity-50 hover:opacity-75"
                  )}
                  style={{ fontFamily: "inherit", padding: "8px 20px" }}
                >
                  {it.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
        <div>
          {items.map((it) => (
            <TabsContent key={it.value} value={it.value} className="mt-0">
              {it.panel ?? null}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
