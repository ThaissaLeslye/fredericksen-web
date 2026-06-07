import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOAuthCallback } from '../composables/useOAuthCallback'
import { apiClient } from '@/infrastructure/http/apiClient'
import { useAuthStore } from '@/stores/auth/auth'

const mockPush = vi.fn()
let mockQueryParams: Record<string, string> = { code: 'mock-google-code', state: 'mock-state' }

vi.mock('vue-router', () => ({
    useRoute: () => ({
        get query() {
            return mockQueryParams
        }
    }),
    useRouter: () => ({
        push: mockPush
    })
}))

vi.mock('@/infrastructure/http/apiClient', () => ({
    apiClient: {
        get: vi.fn()
    }
}))

describe('useOAuthCallback', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        mockPush.mockClear()
        mockQueryParams = { code: 'mock-google-code', state: 'mock-state' }
    })

    it('should successfully process callback and redirect to home layout', async () => {
        const authStore = useAuthStore()
        const mockPayload = {
            data: {
                token: 'mock-jwt-passaporte',
                user: { id: 'uuid-1', name: 'Thaisa Lourenço', email: 'fulana@gmail.com', photoUrl: '' }
            }
        }

        vi.mocked(apiClient.get).mockResolvedValueOnce(mockPayload)

        const { error, handleCallback } = useOAuthCallback()
        await handleCallback()

        // RF01: Usuário deve acessar o app via login do google e ser redirecionado para a tela Home.
        expect(apiClient.get).toHaveBeenCalledWith('/mvp1/auth/google/callback', {
            params: { code: 'mock-google-code', state: 'mock-state' }
        })
        expect(authStore.token).toBe('mock-jwt-passaporte')
        expect(authStore.user).toEqual(mockPayload.data.user)
        expect(mockPush).toHaveBeenCalledWith({ name: 'home' })
        expect(error.value).toBeNull()
    })

    it('should trigger immediate error state if code input is missing', async () => {
        mockQueryParams = {}

        const { error, handleCallback } = useOAuthCallback()
        await handleCallback() // RFE01: Erro de Autenticação: Exibir mensagem de erro caso o código do Google esteja ausente

        expect(error.value).toBe('Código de autorização do Google não foi encontrado.')
        expect(apiClient.get).not.toHaveBeenCalled()
        expect(mockPush).not.toHaveBeenCalled()
    })

    it('should capture connection or server failures gracefully', async () => {
        vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network Crash'))

        const { error, handleCallback } = useOAuthCallback()
        await handleCallback() // RFE01: Erro de Autenticação: Exibir mensagem de erro caso o login via Google falhe ou o serviço esteja indisponível.

        expect(error.value).toBe('Não foi possível concluir a autenticação com o Google. Tente novamente.')
        expect(mockPush).not.toHaveBeenCalled()
    })
})