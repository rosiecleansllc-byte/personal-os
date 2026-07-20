import {
  TasksIcon,
  LeadEngineIcon,
  WeeklyPulseIcon,
  ContentStudioIcon,
  AutomationsIcon,
  DeploysIcon,
  MorningBriefIcon,
  CloseIcon,
  LogoMark,
} from './icons.jsx'

const NAV = [
  { id: 'tasks', label: 'Tasks', icon: TasksIcon, ready: true },
  { id: 'lead-engine', label: 'Lead Engine', icon: LeadEngineIcon, ready: false },
  { id: 'weekly-pulse', label: 'Weekly Pulse', icon: WeeklyPulseIcon, ready: false },
  { id: 'content-studio', label: 'Content Studio', icon: ContentStudioIcon, ready: false },
  { id: 'automations', label: 'Automations', icon: AutomationsIcon, ready: false },
  { id: 'deploys', label: 'Deploys', icon: DeploysIcon, ready: false },
  { id: 'morning-brief', label: 'Morning Brief', icon: MorningBriefIcon, ready: false },
]

export default function Sidebar({ active, open, onClose }) {
  return (
    <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>
      <div className="sidebar-head">
        <LogoMark />
        <span className="wordmark">Personal OS</span>
        <button className="icon-btn sidebar-close" onClick={onClose} aria-label="Close navigation">
          <CloseIcon />
        </button>
      </div>

      <div className="nav-section-label">Tools</div>
      <nav className="nav">
        {NAV.map(({ id, label, icon: Icon, ready }) => (
          <button
            key={id}
            className={`nav-item${id === active ? ' nav-item-active' : ''}`}
            disabled={!ready}
            onClick={ready ? onClose : undefined}
            aria-current={id === active ? 'page' : undefined}
          >
            <Icon className="nav-icon" />
            <span>{label}</span>
            {!ready && <span className="soon-badge">Soon</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="avatar" aria-hidden="true">C</div>
        <span className="version">Personal OS · v0.1</span>
      </div>
    </aside>
  )
}
