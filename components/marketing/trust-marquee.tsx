const TRUSTED = [
  "Trusted by 4.2 billion lungs",
  "SOC-2 oxygen compliant",
  "Carbon-positive exhaling",
  "99.99% atmospheric uptime",
  "Featured in Air Quarterly",
  "Backed by Sequoia Atmosphere",
  "ISO 27001 for inhaling",
];

export function TrustMarquee() {
  const row = [...TRUSTED, ...TRUSTED];
  return (
    <section className="border-y border-border bg-surface/40 py-6">
      <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted">
        The respiration layer for the modern human
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
          {row.map((t, i) => (
            <span key={i} className="text-sm font-medium text-muted">
              {t}
              <span className="ml-10 text-teal-400">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
