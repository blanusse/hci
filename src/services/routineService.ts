import { apiGet, apiPost, apiDelete } from '@/utils/api'

export async function getRoutines() {
  return await apiGet('/routines')
}

export async function createRoutine(name: string, actions: any[], metadata: object = {}) {
  return await apiPost('/routines', { name, actions, metadata })
}

export async function deleteRoutine(routineId: string) {
  return await apiDelete(`/routines/${routineId}`)
}
