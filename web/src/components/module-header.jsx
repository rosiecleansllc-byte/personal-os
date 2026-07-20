export default function ModuleHeader({ title, subtitle, tabs, activeTab, onTabChange, actions }) {
  return (
    <header className="module-header">
      <div className="module-header-row">
        <div>
          <h1 className="module-title">{title}</h1>
          <p className="module-subtitle">{subtitle}</p>
        </div>
        {actions && <div className="module-actions">{actions}</div>}
      </div>
      <div className="tab-bar" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === activeTab}
            className={`tab${tab.id === activeTab ? ' tab-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  )
}
