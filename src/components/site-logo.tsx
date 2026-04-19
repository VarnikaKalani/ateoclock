type BrandWordmarkProps = {
  size?: number;
  tone?: "default" | "light";
  className?: string;
};

export function BrandWordmark({ size = 21, tone = "default", className }: BrandWordmarkProps) {
  const ateColor = tone === "light" ? "#F1E8C7" : "#74823F";
  const clockColor = tone === "light" ? "rgba(241,232,199,.72)" : "#6B3E1E";

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        color: ateColor,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "-0.5px",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: ateColor }}>ate</span>
      <span style={{ color: clockColor }}> o&apos;clock</span>
    </span>
  );
}
