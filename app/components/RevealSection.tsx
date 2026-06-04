"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

/**
 * Wraps children with a scroll-triggered reveal animation.
 *
 * - direction="up|left|right|scale|fade" — single-element reveal
 * - stagger={true} — cascades children in with 110ms offsets
 * - style — passed directly to the wrapper div (useful as a grid container)
 */
export function RevealSection({
  children,
  className = "",
  style,
  direction = "up",
  delay = 0,
  stagger = false,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  direction?: "up" | "left" | "right" | "scale" | "fade";
  delay?: number;
  stagger?: boolean;
}) {
  const ref = useScrollReveal<HTMLDivElement>({
    threshold: 0.06,
    rootMargin: "0px 0px -20px 0px",
    delay: stagger ? 60 : 100,
  });

  const revealClass = stagger ? "stagger-children" : `reveal-${direction}`;

  return (
    <div
      ref={ref}
      className={`${revealClass} ${className}`}
      style={{
        ...style,
        ...(delay ? { transitionDelay: `${delay}ms` } : {}),
      }}
    >
      {children}
    </div>
  );
}
