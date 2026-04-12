"use client";

import * as React from "react";

import { Switch } from "@/components/ui/interfaces-switch";

export default function SwitchDemo() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [isDark]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-8 text-foreground transition-colors">
      <div className="flex items-center gap-3 rounded-xl border border-input bg-background px-4 py-3 shadow-xs">
        <Switch
          id="ui-mode"
          checked={isDark}
          onCheckedChange={setIsDark}
        />
        <label
          htmlFor="ui-mode"
          className="cursor-pointer text-sm font-medium"
        >
          UI Mode: {isDark ? "Dark" : "Light"}
        </label>
      </div>
    </div>
  );
}
