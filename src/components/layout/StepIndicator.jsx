import IconSpeechBubble from '../icons/IconSpeechBubble.jsx';
import IconMagnifyingGlass from '../icons/IconMagnifyingGlass.jsx';
import IconCompass from '../icons/IconCompass.jsx';
import IconFountainPen from '../icons/IconFountainPen.jsx';
import IconDownloadArrow from '../icons/IconDownloadArrow.jsx';

const STEPS = [
  { n: 1, label: 'Your Question', Icon: IconSpeechBubble  },
  { n: 2, label: 'Research',      Icon: IconMagnifyingGlass },
  { n: 3, label: 'Department',    Icon: IconCompass       },
  { n: 4, label: 'RTI Draft',     Icon: IconFountainPen   },
  { n: 5, label: 'Submit',        Icon: IconDownloadArrow },
];

// Octagon clip path using CSS clip-path polygon
function OctagonBadge({ done, active, children }) {
  let border, bg, text;
  if (done) {
    border = 'var(--color-primary)';
    bg     = 'transparent';
    text   = 'var(--color-primary)';
  } else if (active) {
    border = 'var(--color-primary)';
    bg     = 'var(--color-primary)';
    text   = 'var(--color-background)';
  } else {
    border = 'rgba(201,162,39,0.3)';
    bg     = 'transparent';
    text   = 'rgba(201,162,39,0.4)';
  }

  return (
    <div
      className="flex-shrink-0 w-9 h-9 flex items-center justify-center relative"
      style={{ color: text }}
    >
      <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full">
        <polygon
          points="11,2 25,2 34,11 34,25 25,34 11,34 2,25 2,11"
          fill={bg}
          stroke={border}
          strokeWidth="1.5"
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default function StepIndicator({ currentStep }) {
  return (
    <nav className="max-w-5xl mx-auto px-4 py-5">
      <ol className="flex items-center gap-2">
        {STEPS.map(({ n, label, Icon }, i) => {
          const done    = n < currentStep;
          const active  = n === currentStep;
          const upcoming = n > currentStep;

          return (
            <li key={n} className="flex items-center flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <OctagonBadge done={done} active={active} upcoming={upcoming}>
                  {done ? (
                    <span className="text-[9px] font-bold text-[var(--color-primary)]">✓</span>
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </OctagonBadge>
                <span
                  className={`text-xs font-sans truncate hidden sm:block
                    ${done    ? 'text-[var(--color-primary)] font-medium'    : ''}
                    ${active  ? 'text-[var(--color-foreground)] font-semibold' : ''}
                    ${upcoming? 'text-[var(--color-muted)]'                   : ''}
                  `}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-2 rounded"
                  style={{ background: done ? 'var(--color-primary)' : 'rgba(201,162,39,0.2)' }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
