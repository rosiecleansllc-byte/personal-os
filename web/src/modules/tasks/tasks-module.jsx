import { useState } from 'react'
import ModuleHeader from '../../components/module-header.jsx'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'board', label: 'Board' },
  { id: 'settings', label: 'Settings' },
]

export default function TasksModule() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="module">
      <ModuleHeader
        title="Tasks"
        subtitle="One board for business and build work, from any device."
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
      />
      <div className="module-body">
        <div className="empty-state">Tasks module coming together — {tab} tab.</div>
      </div>
    </div>
  )
}
