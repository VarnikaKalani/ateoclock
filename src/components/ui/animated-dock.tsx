"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { cn } from "@/lib/utils";

export interface DockItemData {
  link: string;
  Icon: React.ReactNode;
  label?: string;
  ariaLabel?: string;
  target?: React.HTMLAttributeAnchorTarget;
}

export interface AnimatedDockProps {
  className?: string;
  items: DockItemData[];
}

export function AnimatedDock({ className, items }: AnimatedDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(event) => mouseX.set(event.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex w-full flex-wrap items-stretch justify-center gap-5 rounded-lg border border-[#74823F]/20 bg-white/45 px-4 py-3 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      {items.map((item) => (
        <DockItem key={`${item.label ?? item.ariaLabel}-${item.link}`} item={item} mouseX={mouseX} />
      ))}
    </motion.div>
  );
}

interface DockItemProps {
  item: DockItemData;
  mouseX: MotionValue<number>;
}

function DockItem({ item, mouseX }: DockItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return value - bounds.x - bounds.width / 2;
  });

  const iconWidthSync = useTransform(distance, [-150, 0, 150], [44, 58, 44]);
  const iconWidth = useSpring(iconWidthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 14,
  });

  const iconScaleSync = useTransform(iconWidth, [44, 58], [1, 1.12]);
  const iconScale = useSpring(iconScaleSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 14,
  });

  const isExternal = item.target === "_blank";

  return (
    <motion.div ref={ref} className="min-w-[150px] flex-1 sm:flex-none">
      <Link
        href={item.link}
        target={item.target}
        rel={isExternal ? "noopener noreferrer" : undefined}
        aria-label={item.ariaLabel ?? item.label ?? item.link}
        className="group flex h-full min-h-14 items-center gap-3 rounded-lg border border-[#74823F]/15 bg-[#F1E8C7]/75 px-3 py-2 text-[#74823F] no-underline transition-colors hover:border-[#74823F]/35 hover:bg-white/70 hover:text-[#6B3E1E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#74823F]"
      >
        <motion.span
          style={{ width: iconWidth, scale: iconScale }}
          className="flex aspect-square h-11 shrink-0 items-center justify-center rounded-lg bg-[#74823F] text-[#F1E8C7] shadow-sm transition-colors group-hover:bg-[#6B3E1E]"
          aria-hidden="true"
        >
          {item.Icon}
        </motion.span>
        {item.label ? (
          <span className="text-sm font-extrabold tracking-normal">{item.label}</span>
        ) : null}
      </Link>
    </motion.div>
  );
}
