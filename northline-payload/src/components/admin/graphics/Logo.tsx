/**
 * Admin login + brand logo — Northline wordmark.
 */
export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span
        style={{
          display: "grid",
          placeItems: "center",
          height: 44,
          width: 44,
          borderRadius: 12,
          background: "linear-gradient(135deg, #E8C15A, #B9D14B)",
          color: "#0f1420",
          fontWeight: 800,
          fontSize: 24,
          lineHeight: 1,
        }}
      >
        N
      </span>
      <span
        style={{
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "var(--theme-elevation-1000, #fff)",
        }}
      >
        Northline
      </span>
    </div>
  );
}
