export default function Logo({ size = 40 }: { size?: number }) {
  const scale = size / 40;

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: "left center", display: "inline-block" }}>
      <div style={{ lineHeight: 1 }}>
        {/* Main brand name */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "0px" }}>
          <span
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "32px",
              fontWeight: "700",
              fontStyle: "italic",
              color: "#e91e8c",
              lineHeight: 1,
              letterSpacing: "-0.5px",
            }}
          >
            Glam
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "32px",
              fontWeight: "400",
              fontStyle: "italic",
              color: "#1a1a1a",
              lineHeight: 1,
              letterSpacing: "-0.5px",
            }}
          >
            Hub
          </span>
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "9px",
            color: "#999",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginTop: "3px",
            paddingLeft: "1px",
          }}
        >
          Perfume &amp; Beauty
        </div>
      </div>
    </div>
  );
}
