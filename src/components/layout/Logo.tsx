export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size * 3.2}
      height={size}
      viewBox="0 0 128 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Icon — stylized G with petal */}
      <circle cx="20" cy="20" r="18" fill="#fff0f3" />

      {/* Petals */}
      <ellipse cx="20" cy="10" rx="4" ry="7" fill="#fda4af" opacity="0.7" />
      <ellipse cx="20" cy="30" rx="4" ry="7" fill="#fda4af" opacity="0.7" />
      <ellipse cx="10" cy="20" rx="7" ry="4" fill="#fda4af" opacity="0.7" />
      <ellipse cx="30" cy="20" rx="7" ry="4" fill="#fda4af" opacity="0.7" />

      {/* Diagonal petals */}
      <ellipse cx="13" cy="13" rx="4" ry="7" fill="#fb7185" opacity="0.5" transform="rotate(-45 13 13)" />
      <ellipse cx="27" cy="27" rx="4" ry="7" fill="#fb7185" opacity="0.5" transform="rotate(-45 27 27)" />
      <ellipse cx="27" cy="13" rx="4" ry="7" fill="#fb7185" opacity="0.5" transform="rotate(45 27 13)" />
      <ellipse cx="13" cy="27" rx="4" ry="7" fill="#fb7185" opacity="0.5" transform="rotate(45 13 27)" />

      {/* Center circle */}
      <circle cx="20" cy="20" r="7" fill="#f43f5e" />
      <text x="20" y="24.5" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="serif">G</text>

      {/* Text: Glam */}
      <text
        x="44"
        y="23"
        fontSize="16"
        fontWeight="700"
        fill="#f43f5e"
        fontFamily="Georgia, serif"
        letterSpacing="0.5"
      >
        Glam
      </text>

      {/* Text: Hub */}
      <text
        x="86"
        y="23"
        fontSize="16"
        fontWeight="400"
        fill="#9f1239"
        fontFamily="Georgia, serif"
        letterSpacing="0.5"
      >
        Hub
      </text>

      {/* Underline accent */}
      <line x1="44" y1="27" x2="122" y2="27" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
