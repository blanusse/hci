import { apiGet, apiPost, apiDelete, apiPut, apiPatch } from '@/utils/api'

export async function getRoutines() {
  return await apiGet('/routines')
}

export async function createRoutine(name: string, actions: any[], metadata: object = {}) {
  return await apiPost('/routines', { name, actions, metadata })
}

export async function updateRoutine(routineId: string, name: string, actions: any[], metadata: object) {
  return await apiPut(`/routines/${routineId}`, { name, actions, metadata })
}

export async function executeRoutine(routineId: string) {
  return await apiPatch(`/routines/${routineId}/execute`)
}

export async function deleteRoutine(routineId: string) {
  return await apiDelete(`/routines/${routineId}`)
}
