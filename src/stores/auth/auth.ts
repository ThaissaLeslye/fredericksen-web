import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { tokenService } from '@/infrastructure/token/tokenService'

export interface UserSession {
    id: string
    name: string
    email: string
    photoUrl: string
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<UserSession | null>(null)
    const token = ref<string | null>(tokenService.getToken())
    const isProcessing = ref<boolean>(false)

    const isAuthenticated = computed<boolean>(() => !!token.value && !!user.value)

    function setSession(accessToken: string, userData: UserSession): void {
        token.value = accessToken
        user.value = userData

        localStorage.setItem('auth_token', accessToken)
    }

    function logout(): void {
        // RF04: Reseta o estado em memória do Pinia imediatamente
        user.value = null
        token.value = null
        isProcessing.value = false

        // RNF02: Limpeza destrutiva de todo o armazenamento local
        localStorage.clear()

        window.location.href = '/login'
    }

    return {
        user,
        token,
        isProcessing,
        isAuthenticated,
        setSession,
        logout
    }
})