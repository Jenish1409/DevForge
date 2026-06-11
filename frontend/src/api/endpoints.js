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

export function updateEndpoint(projectId, endpointId, payload) {
  return apiFetch(`/projects/${projectId}/endpoints/${endpointId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteEndpoint(projectId, endpointId) {
  return apiFetch(`/projects/${projectId}/endpoints/${endpointId}`, {
    method: 'DELETE',
  })
}
