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
    const error = ref<string | null>(null)

    async function handleCallback(): Promise<void> {
        const code = route.query.code as string | undefined
        const state = route.query.state as string | undefined

        if (!code) {
            // RFE01: Erro de Autenticação: Exibir mensagem de erro caso o código do Google esteja ausente
            error.value = 'Código de autorização do Google não foi encontrado.'
            return
        }

        authStore.isProcessing = true
        error.value = null

        try {
            // Consome o endpoint /mvp1/auth/google/callback
            const response = await apiClient.get<CallbackResponse>('/mvp1/auth/google/callback', {
                params: { code, state }
            })

            const { token, user } = response.data

            authStore.setSession(token, user)

            // RF01: Usuário deve acessar o app via login do google e ser redirecionado para a tela Home.
            await router.push({ name: 'home' })
        } catch {
            // RFE01: Erro de Autenticação: Exibir mensagem de erro caso o login via Google falhe ou o serviço esteja indisponível.
            error.value = 'Não foi possível concluir a autenticação com o Google. Tente novamente.'
        } finally {
            authStore.isProcessing = false
        }
    }

    return {
        error,
        handleCallback
    }
}