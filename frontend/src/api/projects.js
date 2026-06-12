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

export function rotateApiKey(projectId) {
  return apiFetch(`/projects/${projectId}/rotate-key`, {
    method: 'POST',
  })
}
