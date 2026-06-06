import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { API_ENDPOINTS } from '@/infrastructure/http/endpoints'

export function useLogin() {
    const route = useRoute()

    const googleAuthUrl = computed<string>(() => {
        const baseUrl = import.meta.env.VITE_API_URL || ''
        return `${baseUrl}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`
    })

    const authError = computed<string | null>(() => {
        const errorParam = route.query.error
        if (!errorParam) return null

        const parsedError = String(errorParam)
        if (parsedError === 'cancel') return 'O processo de login foi cancelado pelo usuário.'
        if (parsedError === 'unauthorized') return 'Acesso não autorizado ou conta inválida.'
        return 'Falha na autenticação médica. Por favor, tente novamente.'
    })

    return {
        googleAuthUrl,
        authError
    }
}