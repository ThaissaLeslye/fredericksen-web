import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { ref } from 'vue'
import HomeView from '../HomeView.vue'
import { useUserProfile } from '../composables/useUserProfile'
import type { UserSession } from '@/stores/auth/auth'

vi.mock('@/views/home/composables/useUserProfile', () => ({
    useUserProfile: vi.fn()
}))

describe('HomeView.vue', () => {
    const mockProfile = ref<UserSession | null>(null)
    const mockLoading = ref<boolean>(false)
    const mockError = ref<string | null>(null)
    const mockFetchProfile = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        mockProfile.value = null
        mockLoading.value = false
        mockError.value = null

        vi.mocked(useUserProfile).mockReturnValue({
            profile: mockProfile,
            loading: mockLoading,
            error: mockError,
            fetchProfile: mockFetchProfile
        })
    })

    it('should trigger the profile fetch method instantly when mounted', () => {
        mount(HomeView)
        expect(mockFetchProfile).toHaveBeenCalledTimes(1)
    })

    it('should unhide the shimmer pulse skeleton while loading is truthy', () => {
        mockLoading.value = true
        const wrapper = mount(HomeView)
        const skeleton = wrapper.find('[aria-hidden="true"]')

        expect(skeleton.exists()).toBe(true)
        expect(skeleton.classes()).toContain('animate-pulse')
    })

    it('should mount the router-link wrapping the user avatar correctly when profile data arrives', () => {
        mockProfile.value = {
            id: 'uuid-123',
            name: 'Thaisa Lourenço',
            email: 'fulana@gmail.com',
            photoUrl: 'https://foto.url'
        }

        const wrapper = mount(HomeView, {
            global: {
                stubs: {
                    RouterLink: RouterLinkStub
                }
            }
        })

        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)
        expect(img.attributes('src')).toBe('https://foto.url')
        expect(img.attributes('alt')).toBe('Foto de perfil de Thaisa Lourenço')
    })

    it('should render the alert dialog with the exact contract message under network failures', () => {
        mockError.value = 'Não foi possível carregar os dados do perfil.'
        const wrapper = mount(HomeView)
        const alertBox = wrapper.find('[role="alert"]')

        expect(alertBox.exists()).toBe(true)
        expect(alertBox.text()).toContain('Não foi possível carregar os dados do perfil.')
    })
})