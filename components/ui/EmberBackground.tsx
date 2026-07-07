/**
 * Looping ember/firelight video background with a dark scrim.
 * The poster image is the LCP fallback and the only thing
 * reduced-motion users ever see; the video renders motion-safe only.
 * Parent section must be `relative isolate overflow-hidden`, and
 * foreground content must sit on `relative z-10`.
 */
export function EmberBackground() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/embers-poster.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      {/* translateZ keeps the video on a stable compositing layer (iOS Safari) */}
      <video
        poster="/embers-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 z-0 hidden h-full w-full object-cover [transform:translateZ(0)] motion-safe:block"
      >
        {/* webm first (smaller, Chrome/Firefox); mp4 fallback for Safari */}
        <source src="/embers.webm" type="video/webm" />
        <source src="/embers-h264.mp4" type="video/mp4" />
      </video>
      {/* Dark scrim so copy stays readable as the embers shift */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-b from-ink/85 via-ink/65 to-ink/90"
      />
    </>
  );
}
