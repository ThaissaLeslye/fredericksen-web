import { ref, onUnmounted } from 'vue'
import axios from 'axios'
import { apiClient } from '@/infrastructure/http/apiClient'
import type { UserSession } from '@/stores/auth/auth'
import { API_ENDPOINTS } from '@/config/endpoints'

export function useUserProfile() {
    const profile = ref<UserSession | null>(null)
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)

    let activeController: AbortController | null = null

    async function fetchProfile(): Promise<void> {
        if (activeController) {
            activeController.abort()
        }

        activeController = new AbortController()
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get<UserSession>(API_ENDPOINTS.USER.ME, {
                signal: activeController.signal
            })
            profile.value = response.data
        } catch (err: unknown) {
            if (axios.isCancel(err)) {
                return
            }
            profile.value = null
            error.value = 'Não foi possível carregar os dados do perfil.'
        } finally {
            if (activeController && !activeController.signal.aborted) {
                loading.value = false
            }
        }
    }

    onUnmounted(() => {
        if (activeController) {
            activeController.abort()
        }
    })

    return {
        profile,
        loading,
        error,
        fetchProfile
    }
}