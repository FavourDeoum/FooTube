export default function LoadingSpinner({ size = 28 }: { size?: number }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: `3px solid var(--green-100)`,
        borderTopColor: "var(--green-500)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}
