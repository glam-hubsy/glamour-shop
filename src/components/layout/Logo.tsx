export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size * 3.4}
      height={size}
      viewBox="0 0 136 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Icon background */}
      <circle cx="20" cy="20" r="18" fill="#1a1a2e" />

      {/* Mauve petals */}
      <ellipse cx="20" cy="10" rx="3.5" ry="6.5" fill="#c084fc" opacity="0.85" />
      <ellipse cx="20" cy="30" rx="3.5" ry="6.5" fill="#c084fc" opacity="0.85" />
      <ellipse cx="10" cy="20" rx="6.5" ry="3.5" fill="#c084fc" opacity="0.85" />
      <ellipse cx="30" cy="20" rx="6.5" ry="3.5" fill="#c084fc" opacity="0.85" />

      {/* Diagonal petals */}
      <ellipse cx="13" cy="13" rx="3.5" ry="6" fill="#a855f7" opacity="0.6" transform="rotate(-45 13 13)" />
      <ellipse cx="27" cy="27" rx="3.5" ry="6" fill="#a855f7" opacity="0.6" transform="rotate(-45 27 27)" />
      <ellipse cx="27" cy="13" rx="3.5" ry="6" fill="#a855f7" opacity="0.6" transform="rotate(45 27 13)" />
      <ellipse cx="13" cy="27" rx="3.5" ry="6" fill="#a855f7" opacity="0.6" transform="rotate(45 13 27)" />

      {/* Center circle */}
      <circle cx="20" cy="20" r="6.5" fill="#7c3aed" />
      <text x="20" y="24" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="white" fontFamily="serif">G</text>

      {/* Text: Glam */}
      <text
        x="45"
        y="25"
        fontSize="17"
        fontWeight="800"
        fill="#0f0f1a"
        fontFamily="Georgia, serif"
        letterSpacing="1"
      >
        Glam
      </text>

      {/* Text: Hub */}
      <text
        x="91"
        y="25"
        fontSize="17"
        fontWeight="400"
        fill="#7c3aed"
        fontFamily="Georgia, serif"
        letterSpacing="1"
      >
        Hub
      </text>

      {/* Underline accent */}
      <line x1="45" y1="29" x2="128" y2="29" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
