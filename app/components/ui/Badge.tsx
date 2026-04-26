import React from "react";

interface BadgeProps {
  label: string;
  variant?: "green" | "outline" | "cream";
  size?: "sm" | "md";
}

export default function Badge({ label, variant = "green", size = "sm" }: BadgeProps) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "var(--radius-full)",
    fontWeight: 500,
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
    fontSize: size === "sm" ? "0.72rem" : "0.8rem",
    padding: size === "sm" ? "3px 10px" : "5px 14px",
  };

  const variants: Record<string, React.CSSProperties> = {
    green: {
      backgroundColor: "var(--green-50)",
      color: "var(--green-600)",
      border: "1px solid var(--green-100)",
    },
    outline: {
      backgroundColor: "transparent",
      color: "var(--text-secondary)",
      border: "1px solid var(--border)",
    },
    cream: {
      backgroundColor: "var(--cream-100)",
      color: "var(--charcoal-400)",
      border: "1px solid var(--cream-200)",
    },
  };

  return <span style={{ ...base, ...variants[variant] }}>{label}</span>;
}
