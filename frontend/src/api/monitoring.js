import { apiFetch } from './client'

export function fetchMonitoredApis() {
  return apiFetch('/monitoring')
}

export function fetchMonitoringSummary() {
  return apiFetch('/monitoring/summary')
}

export function fetchApiDetails(id) {
  return apiFetch(`/monitoring/${id}`)
}

export function fetchApiHistory(id) {
  return apiFetch(`/monitoring/${id}/history`)
}

export function fetchApiIncidents(id) {
  return apiFetch(`/monitoring/${id}/incidents`)
}

export function createMonitoredApi(payload) {
  return apiFetch('/monitoring', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateMonitoredApi(id, payload) {
  return apiFetch(`/monitoring/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteMonitoredApi(id) {
  return apiFetch(`/monitoring/${id}`, { method: 'DELETE' })
}

export function toggleMonitoredApi(id) {
  return apiFetch(`/monitoring/${id}/toggle`, { method: 'PATCH' })
}