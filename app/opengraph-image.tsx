import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION } from "@/lib/site";

// Generated at build/request time by Next.js and automatically wired into
// og:image + twitter:image for every route under this layout.
export const alt = "CancelKit — Turn cancellations into saved revenue";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0f172a",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(99, 102, 241, 0.35), transparent 55%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "36px",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            ↩
          </div>
          CancelKit
        </div>
        <div
          style={{
            marginTop: "48px",
            fontSize: "72px",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-2px",
            maxWidth: "980px",
          }}
        >
          Turn cancellations into saved revenue
        </div>
        <div
          style={{
            marginTop: "32px",
            fontSize: "30px",
            color: "#94a3b8",
            maxWidth: "900px",
            lineHeight: 1.4,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    size,
  );
}
