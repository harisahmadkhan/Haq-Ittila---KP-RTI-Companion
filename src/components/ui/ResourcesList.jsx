import IconLink from '../icons/IconLink.jsx';

export default function ResourcesList({ sources = [], isDemo = false }) {
  if (!sources.length) return null;

  return (
    <div className="border border-[var(--color-border)] rounded-xl p-5 mb-6">
      <h3 className="font-sans font-semibold text-[var(--color-foreground)] text-sm uppercase tracking-wide mb-3">
        Sources & References
      </h3>
      <ul className="space-y-2">
        {sources.map((s, i) => (
          <li key={i} className="flex items-start gap-2">
            {!isDemo && s.url ? (
              <>
                <IconLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[var(--color-primary)]" />
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs text-[var(--color-primary)] hover:underline leading-snug"
                >
                  {s.title || s.url}
                </a>
              </>
            ) : (
              <div className="flex items-start gap-2 w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted)] flex-shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <span className="font-sans text-xs text-[var(--color-muted)] leading-snug">{s.title}</span>
                  {s.publisher && (
                    <span className="font-sans text-xs text-[var(--color-muted)]/60 ml-1">— {s.publisher}</span>
                  )}
                </div>
                {isDemo && (
                  <span className="text-xs font-sans px-1.5 py-0.5 rounded bg-[var(--color-unknown-accent)] text-[var(--color-muted)] flex-shrink-0">
                    illustrative
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
