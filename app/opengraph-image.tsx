import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Naman Sharma - Design Engineer";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#f5f5f5",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top left decorative elements */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#ff5f56",
              }}
            />
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#ffbd2e",
              }}
            />
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#27c93f",
              }}
            />
          </div>
          <div style={{ fontSize: "24px", color: "#a1a1aa", fontWeight: 500 }}>
            namansharma.com
          </div>
        </div>

        {/* Main Content matching homepage vibe */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Geometric Logo representation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)",
              marginBottom: "32px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: "48px",
                fontWeight: 800,
                letterSpacing: "-2px",
              }}
            >
              N.
            </div>
          </div>

          <div
            style={{
              fontSize: "84px",
              fontWeight: 700,
              color: "#18181b",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            Naman Sharma
          </div>
          <div
            style={{
              fontSize: "42px",
              fontWeight: 500,
              color: "#52525b",
              letterSpacing: "-0.02em",
            }}
          >
            Design Engineer crafting modern web experiences.
          </div>
        </div>

        {/* Bottom UI bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "2px solid #e4e4e7",
            paddingTop: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "24px",
              fontSize: "24px",
              color: "#71717a",
              fontWeight: 500,
            }}
          >
            <div>React</div>
            <div>Next.js</div>
            <div>Tailwind</div>
            <div>Framer Motion</div>
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              fontWeight: 500,
              fontFamily: "monospace",
            }}
          >
            © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
