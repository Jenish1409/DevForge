import { apiFetch } from './client'

export function fetchEndpoints(projectId) {
  return apiFetch(`/projects/${projectId}/endpoints`)
}

export function createEndpoint(projectId, payload) {
  return apiFetch(`/projects/${projectId}/endpoints`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
