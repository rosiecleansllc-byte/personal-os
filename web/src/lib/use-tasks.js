import { useCallback, useEffect, useState } from 'react'
import { api } from './api.js'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.listTasks()
      setTasks(data.tasks)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createTask = useCallback(async (input) => {
    const data = await api.createTask(input)
    setTasks((prev) => [data.task, ...prev])
    return data.task
  }, [])

  const updateTask = useCallback(async (id, patch) => {
    const previous = tasks
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    try {
      const data = await api.updateTask(id, patch)
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)))
      return data.task
    } catch (err) {
      setTasks(previous)
      throw err
    }
  }, [tasks])

  const removeTask = useCallback(async (id) => {
    const previous = tasks
    setTasks((prev) => prev.filter((t) => t.id !== id))
    try {
      await api.deleteTask(id)
    } catch (err) {
      setTasks(previous)
      throw err
    }
  }, [tasks])

  return { tasks, loading, error, refresh, createTask, updateTask, removeTask }
}
