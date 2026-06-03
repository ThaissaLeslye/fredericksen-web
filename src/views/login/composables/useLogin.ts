import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useLogin() {
    const route = useRoute()

    const googleAuthUrl = computed<string>(() => {
        const baseUrl = (import.meta.env.VITE_API_URL as string) || ''
        return `${baseUrl}/mvp1/auth/google`
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