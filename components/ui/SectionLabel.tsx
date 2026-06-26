export function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3 font-sans text-[11px] uppercase tracking-label text-muted">
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-copper text-copper">
        {icon}
      </span>
      {children}
    </div>
  );
}
