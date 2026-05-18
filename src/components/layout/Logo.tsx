export default function Logo({ size = 40 }: { size?: number }) {
  const scale = size / 40;

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: "left center", display: "inline-block" }}>
      <div style={{ lineHeight: 1 }}>
        {/* Main brand name */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
          <span
            style={{
              fontFamily: "'Dancing Script', 'Georgia', cursive",
              fontSize: "36px",
              fontWeight: "700",
              color: "#e91e8c",
              lineHeight: 1,
            }}
          >
            Glam
          </span>
          <span
            style={{
              fontFamily: "'Dancing Script', 'Georgia', cursive",
              fontSize: "36px",
              fontWeight: "700",
              color: "#1a1a1a",
              lineHeight: 1,
            }}
          >
            Hub
          </span>
          {/* Flowers */}
          <span style={{ fontSize: "14px", color: "#e91e8c", marginLeft: "3px", lineHeight: 1 }}>
            ✿✿
          </span>
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "10px",
            color: "#888",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginTop: "2px",
            paddingLeft: "2px",
          }}
        >
          Perfume &amp; Beauty Supply
        </div>
      </div>
    </div>
  );
}
