import { ref } from 'vue'
import { apiClient } from '@/infrastructure/http/apiClient'
import type { UserSession } from '@/stores/auth/auth'
import { API_ENDPOINTS } from '@/infrastructure/http/endpoints'

export function useUserProfile() {
    const profile = ref<UserSession | null>(null)
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)

    async function fetchProfile(): Promise<void> {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get<UserSession>(API_ENDPOINTS.USER.ME)
            profile.value = response.data
        } catch {
            profile.value = null
            error.value = 'Não foi possível carregar os dados do perfil.'
        } finally {
            loading.value = false
        }
    }

    return {
        profile,
        loading,
        error,
        fetchProfile
    }
}