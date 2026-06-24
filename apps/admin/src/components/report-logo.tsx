/**
 * Logo marki KSCSYSTEM do raportów PDF (białe tło, kolory marki).
 * Inline style — raporty są drukowane (print-color-adjust: exact), bez zależności
 * od ciemnego motywu komponentu UI Logo.
 */
export function ReportLogo({ size = 34 }: { size?: number }) {
  const fontPx = Math.round(size * 0.35);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          color: "#fff",
          fontWeight: 800,
          fontSize: fontPx,
          letterSpacing: ".02em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        KSC
      </div>
      <span style={{ fontWeight: 800, fontSize: Math.round(size * 0.5), color: "#111827", letterSpacing: "-.01em" }}>
        KSC<span style={{ color: "#4f46e5" }}>SYSTEM</span>
      </span>
    </div>
  );
}
