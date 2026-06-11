import { apiFetch } from './client'

export function fetchProjects() {
  return apiFetch('/projects')
}

export function createProject({ name, description, requireApiKey }) {
  return apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify({ name, description, requireApiKey }),
  })
}

export function deleteProject(projectId) {
  return apiFetch(`/projects/${projectId}`, {
    method: 'DELETE',
  })
}
