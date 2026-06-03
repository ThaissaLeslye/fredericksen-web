import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '../LoginView.vue'

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

describe('LoginView.vue', () => {
    beforeEach(() => {
        mockErrorQuery = null
        vi.stubEnv('VITE_API_URL', 'https://api.fredericksen.local')
    })

    it('should cleanly bind the dynamic google authentication url to the button anchor element', () => {
        const wrapper = mount(LoginView)
        const anchor = wrapper.find('a')

        expect(anchor.exists()).toBe(true)
        expect(anchor.attributes('href')).toBe('https://api.fredericksen.local/mvp1/auth/google')
    })

    it('should completely suppress the error container block when no query error is supplied', () => {
        const wrapper = mount(LoginView)
        const alertBox = wrapper.find('[role="alert"]')

        expect(alertBox.exists()).toBe(false)
    })

    it('should render the precise localized error text inside the assertive container when authorization fails', async () => {
        mockErrorQuery = 'unauthorized'
        const wrapper = mount(LoginView)
        const alertBox = wrapper.find('[role="alert"]')

        expect(alertBox.exists()).toBe(true)
        expect(alertBox.attributes('aria-live')).toBe('assertive')
        expect(alertBox.text()).toContain('Acesso não autorizado ou conta inválida.')
    })
})