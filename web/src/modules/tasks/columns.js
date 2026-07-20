export const COLUMNS = [
  { id: 'todo', label: 'To do' },
  { id: 'inprogress', label: 'In progress' },
  { id: 'done', label: 'Done' },
]

export const COLUMN_LABELS = Object.fromEntries(COLUMNS.map((c) => [c.id, c.label]))
