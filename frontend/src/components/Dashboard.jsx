import { useState, useEffect, useCallback } from 'react'
import { fetchProjects, createProject, deleteProject } from '../api/projects'
import Sidebar from './Sidebar'
import TopHeader from './TopHeader'
import EndpointManager from './EndpointManager'
import NewProjectModal from './NewProjectModal'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const loadProjects = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchProjects()
      setProjects(data)
      setSelectedId((prev) => {
        if (prev && data.some((p) => p.id === prev)) return prev
        return data.length > 0 ? data[0].id : null
      })
    } catch {
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  async function handleCreateProject(payload) {
    const created = await createProject(payload)
    setProjects((prev) => [...prev, created])
    setSelectedId(created.id)
  }

  async function handleDeleteProject() {
    if (!selectedId) return
    await deleteProject(selectedId)
    setProjects((prev) => {
      const remaining = prev.filter((p) => p.id !== selectedId)
      setSelectedId(remaining.length > 0 ? remaining[0].id : null)
      return remaining
    })
  }

  const activeProject = projects.find((p) => p.id === selectedId) ?? null

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-950 transition-colors">
      <Sidebar
        projects={projects}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNewProject={() => setModalOpen(true)}
        loading={loading}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader project={activeProject} onDeleteProject={handleDeleteProject} />
        <EndpointManager projectId={selectedId} />
      </div>

      <NewProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  )
}
