import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ProfileView from '../ProfileView.vue'
import { useProfile } from '../composables/useProfile'
import { useAuthStore } from '@/stores/auth/auth'

// Mocks isolados para evitar efeitos colaterais de rede ou de estado global
vi.mock('../composables/useProfile', () => ({
    useProfile: vi.fn()
}))

vi.mock('@/stores/auth/auth', () => ({
    useAuthStore: vi.fn()
}))

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockPush
    })
}))

describe('ProfileView.vue', () => {
    const mockMedications = ref('Quetiapina')
    const mockAllergies = ref('Lactose')
    const mockBloodType = ref('O_POSITIVE')
    const mockLoading = ref(false)
    const mockError = ref<string | null>(null)
    const mockSuccess = ref(false)
    const mockLoadProfile = vi.fn()
    const mockUpdateProfile = vi.fn()
    const mockLogout = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()

        vi.mocked(useProfile).mockReturnValue({
            medications: mockMedications as any,
            allergies: mockAllergies as any,
            bloodType: mockBloodType as any,
            loading: mockLoading,
            error: mockError,
            success: mockSuccess,
            loadProfile: mockLoadProfile,
            updateProfile: mockUpdateProfile
        })

        vi.mocked(useAuthStore).mockReturnValue({
            user: {
                id: 'google-id-123',
                name: 'Thaisa Leslye Lourenço',
                email: 'fulana.tal@gmail.com',
                photoUrl: 'https://foto.url'
            },
            token: 'mock-token',
            isProcessing: false,
            isAuthenticated: true,
            setSession: vi.fn(),
            logout: mockLogout
        } as any)
    })

    it('should render user profile metadata from google session correctly', () => {
        const wrapper = mount(ProfileView)

        expect(wrapper.text()).toContain('Thaisa Leslye Lourenço')
        expect(wrapper.text()).toContain('fulana.tal@gmail.com')
        const img = wrapper.find('img')
        expect(img.attributes('src')).toBe('https://foto.url')
    })

    it('should trigger updateProfile automatically when a text field loses focus', async () => {
        const wrapper = mount(ProfileView)
        const textarea = wrapper.find('#medications')

        await textarea.trigger('blur')

        expect(mockUpdateProfile).toHaveBeenCalledTimes(1)
    })

    it('should trigger updateProfile instantly when blood type selection changes', async () => {
        const wrapper = mount(ProfileView)
        const select = wrapper.find('#bloodType')

        await select.trigger('change')

        expect(mockUpdateProfile).toHaveBeenCalledTimes(1)
    })

    it('should display error alerts when payload or server synchronization fails', async () => {
        mockError.value = 'Falha ao atualizar o perfil médico. Tente novamente.'
        const wrapper = mount(ProfileView)

        const alertBox = wrapper.find('[role="alert"]')
        expect(alertBox.exists()).toBe(true)
        expect(alertBox.text()).toContain('Falha ao atualizar o perfil médico. Tente novamente.')
    })

    it('should execute destructuring logout chain when exit button is clicked', async () => {
        const wrapper = mount(ProfileView)
        const logoutBtn = wrapper.findAll('button').find(b => b.text().includes('SAIR'))

        await logoutBtn?.trigger('click')

        expect(mockLogout).toHaveBeenCalledTimes(1)
    })
})