import { apiDelete, apiGet, apiPost } from '@/utils/api'

export async function getUserInfo(){
   return await apiGet('/users/profile')
}

export async function changePassword(oldPsw: string, newPsw: string) {

   return await apiPost('/users/change-password', {oldPassword: oldPsw, newPassword: newPsw})
}

export async function forgotPassword(email: string) {
   return await apiPost('/users/forgot-password', {email})
}

export async function resetPassword(code: string, password: string) {
   return await apiPost('/users/reset-password', {code, password})
}

export async function registerUser(email:string, password:string, name: string, metadata: Object={}) {
   return await apiPost('/users/register', {email, password, name, metadata})
}

export async function sendVerification(email:string) {
   return await apiPost('/users/send-verification', {email})
}

export async function veryAccount(code: string){
   return await apiPost('/users/verify-account', {code})

}

export async function logOutUser() {
   return await apiPost('/users/logout', {})
   
}

export async function logInUser(email:string, password:string) {
   return await apiPost('/users/login', {email, password})
   
}