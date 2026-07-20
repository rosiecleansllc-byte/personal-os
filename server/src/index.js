import express from 'express'
import cors from 'cors'
import { migrate } from './db.js'
import { authRouter } from './routes/auth.js'
import { tasksRouter } from './routes/tasks.js'

const app = express()
app.set('trust proxy', 1)
app.use(cors())
app.use(express.json({ limit: '256kb' }))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'personal-os-api' })
})

app.use(authRouter)
app.use(tasksRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' })
})

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err)
  console.error(err)
  res.status(500).json({ error: 'Something went wrong on the server.' })
})

const port = process.env.PORT || 3000

migrate()
  .then(() => {
    app.listen(port, () => {
      console.log(`personal-os-api listening on port ${port}`)
    })
  })
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
