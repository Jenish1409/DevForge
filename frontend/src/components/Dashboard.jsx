import { useState, useEffect, useCallback } from 'react'
import { fetchProjects, createProject } from '../api/projects'
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

  const activeProject = projects.find((p) => p.id === selectedId) ?? null

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <Sidebar
        projects={projects}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNewProject={() => setModalOpen(true)}
        loading={loading}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader project={activeProject} />
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
