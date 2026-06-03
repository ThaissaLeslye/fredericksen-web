import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLogin } from '../composables/useLogin'

let mockErrorQuery: string | null = null

vi.mock('vue-router', () => ({
    useRoute: () => ({
        query: {
            get error() {
                return mockErrorQuery
            }
        }
    })
}))

describe('useLogin', () => {
    beforeEach(() => {
        mockErrorQuery = null
        vi.stubEnv('VITE_API_URL', 'https://api.fredericksen.local')
    })

    it('should compute the correct google authentication URL targeting the backend node', () => {
        const { googleAuthUrl } = useLogin()
        expect(googleAuthUrl.value).toBe('https://api.fredericksen.local/mvp1/auth/google')
    })

    it('should fallback to relative path structure if environment variables are missing', () => {
        vi.stubEnv('VITE_API_URL', '')
        const { googleAuthUrl } = useLogin()
        expect(googleAuthUrl.value).toBe('/mvp1/auth/google')
    })

    it('should evaluate state as null when error parameter is absent in query stream', () => {
        const { authError } = useLogin()
        expect(authError.value).toBeNull()
    })

    it('should cleanly translate "cancel" query code into a user-friendly cancellation prompt', () => {
        mockErrorQuery = 'cancel'
        const { authError } = useLogin()
        expect(authError.value).toBe('O processo de login foi cancelado pelo usuário.')
    })

    it('should translate "unauthorized" code into security restriction message', () => {
        mockErrorQuery = 'unauthorized'
        const { authError } = useLogin()
        expect(authError.value).toBe('Acesso não autorizado ou conta inválida.')
    })

    it('should fall back to generic medical authentication error message on unmapped server states', () => {
        mockErrorQuery = 'internal_gateway_timeout_error'
        const { authError } = useLogin()
        expect(authError.value).toBe('Falha na autenticação médica. Por favor, tente novamente.')
    })
})