import { apiDelete, apiGet, apiPost } from '@/utils/api'

export async function getUserInfo(){
   return await apiGet('/users/profile')
}