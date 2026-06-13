const STEPS = [
  { n: 1, label: 'Your Question' },
  { n: 2, label: 'Research'     },
  { n: 3, label: 'Department'   },
  { n: 4, label: 'RTI Draft'    },
  { n: 5, label: 'Submit'       },
];

export default function StepIndicator({ currentStep }) {
  return (
    <nav className="max-w-5xl mx-auto px-4 py-5">
      <ol className="flex items-center gap-2">
        {STEPS.map(({ n, label }, i) => {
          const done   = n < currentStep;
          const active = n === currentStep;
          const upcoming = n > currentStep;

          return (
            <li key={n} className="flex items-center flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold font-sans transition-colors
                    ${done    ? 'bg-nizam_green-500 text-white'          : ''}
                    ${active  ? 'bg-nizam_green-200 text-nizam_green-800' : ''}
                    ${upcoming? 'bg-gray-100 text-muted'                  : ''}
                  `}
                >
                  {done ? '✓' : n}
                </div>
                <span
                  className={`text-xs font-sans truncate hidden sm:block
                    ${done    ? 'text-nizam_green-700 font-medium' : ''}
                    ${active  ? 'text-foreground font-semibold'    : ''}
                    ${upcoming? 'text-muted'                        : ''}
                  `}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded ${done ? 'bg-nizam_green-400' : 'bg-gray-200'}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
