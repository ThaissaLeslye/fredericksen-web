import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiClient } from '@/infrastructure/http/apiClient'
import { useAuthStore } from '@/stores/auth/auth'
import type { UserSession } from '@/stores/auth/auth'

interface CallbackResponse {
    token: string
    user: UserSession
}

export function useOAuthCallback() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()

    const isProcessing = ref<boolean>(false)
    const error = ref<string | null>(null)

    async function handleCallback(): Promise<void> {
        const code = route.query.code
        const state = route.query.state

        if (typeof code !== 'string' || !code) {
            error.value = 'Código de autorização do Google não foi encontrado.'
            return
        }

        isProcessing.value = true
        error.value = null

        try {
            const parsedState = typeof state === 'string' ? state : undefined

            const response = await apiClient.get<CallbackResponse>('/mvp1/auth/google/callback', {
                params: { code, state: parsedState }
            })

            const { token, user } = response.data

            authStore.setSession(token, user)

            await router.push({ name: 'home' })
        } catch {
            error.value = 'Não foi possível concluir a autenticação com o Google. Tente novamente.'
        } finally {
            isProcessing.value = false
        }
    }

    return {
        isProcessing,
        error,
        handleCallback
    }
}