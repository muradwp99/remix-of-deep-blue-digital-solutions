/**
 * Auxtech brand mark — the angular "A" from the wordmark.
 * Renders in `currentColor` so it inherits text color (white on dark chrome).
 * To swap in the exact production asset, replace the <path> data here and
 * `public/favicon.svg` — everything else picks it up.
 */
export function AuxtechMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer A silhouette with a folded left leg, matching the wordmark */}
      <path
        d="M24 4 L44 44 H34.5 L24 22.5 L13.5 44 H4 Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="miter"
        fill="none"
      />
      {/* Inner fold notch */}
      <path
        d="M24 30 L30.5 44 H17.5 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}
