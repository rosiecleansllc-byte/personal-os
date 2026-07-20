const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function TasksIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="m8.5 12 2.5 2.5 5-5" />
    </svg>
  )
}

export function LeadEngineIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  )
}

export function WeeklyPulseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12h4l2.5-7 4 14 2.5-7h5" />
    </svg>
  )
}

export function ContentStudioIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

export function AutomationsIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M17 2.5 21 6.5l-4 4" />
      <path d="M3 11V9a2.5 2.5 0 0 1 2.5-2.5H21" />
      <path d="m7 21.5-4-4 4-4" />
      <path d="M21 13v2a2.5 2.5 0 0 1-2.5 2.5H3" />
    </svg>
  )
}

export function DeploysIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22 22 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}

export function MorningBriefIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

export function MenuIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function PlusIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function LogoMark(props) {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <text
        x="16"
        y="21.5"
        fontFamily="inherit"
        fontSize="13"
        fontWeight="700"
        fill="#fff"
        textAnchor="middle"
      >
        OS
      </text>
    </svg>
  )
}
