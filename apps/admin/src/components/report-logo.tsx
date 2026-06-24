/**
 * Logo KSCSYSTEM do raportów PDF. Plik: apps/admin/public/logo.png
 * Serwowany pod basePath → /admin/logo.png. Plain <img> (strona druku,
 * next/image niepotrzebny i komplikowałby print).
 */
export function ReportLogo({ height = 60 }: { height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/admin/logo.png"
      alt="KSCSYSTEM"
      style={{ height, width: "auto", display: "block" }}
    />
  );
}
