export default function MonogramBadge({ party, colorFrom, colorTo, size = 32 }) {
  const id = `grad-${party.replace(/[^a-z]/gi, '')}`;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorFrom} />
          <stop offset="100%" stopColor={colorTo} />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill={`url(#${id})`} />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fontFamily="EB Garamond, Georgia, serif"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-primary)"
      >
        {party}
      </text>
    </svg>
  );
}
