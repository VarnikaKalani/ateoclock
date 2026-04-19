"use client";

import { useId } from "react";

import { AnimatedDock, type DockItemData } from "@/components/ui/animated-dock";
import { cn } from "@/lib/utils";

export interface SocialConnectProps {
  title?: string;
  description?: string;
  items: DockItemData[];
  className?: string;
}

export function SocialConnect({
  title = "Contact Us",
  description,
  items,
  className,
}: SocialConnectProps) {
  const headingId = useId();

  return (
    <section
      className={cn(
        "flex flex-col items-center gap-5 border-t border-[#74823F]/20 pt-8 text-center",
        className,
      )}
      aria-labelledby={headingId}
    >
      <div className="w-full">
        <h2
          id={headingId}
          className="m-0 text-lg font-extrabold leading-tight tracking-normal text-[#6B3E1E]"
        >
          {title}
        </h2>
        {description ? (
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 tracking-normal text-[#5A3E1C]/80">
            {description}
          </p>
        ) : null}
      </div>
      <AnimatedDock className="mx-auto max-w-3xl" items={items} />
    </section>
  );
}
