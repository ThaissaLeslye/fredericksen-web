import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useNetworkStatus } from '../composables/useNetworkStatus'

describe('useNetworkStatus Composable', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    const TestComponent = defineComponent({
        setup() {
            const { isOnline, hasMidFlightError } = useNetworkStatus()
            return { isOnline, hasMidFlightError }
        },
        template: '<div />'
    })

    it('should initialize with the current browser connectivity state', () => {
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
        const wrapper = mount(TestComponent)

        expect(wrapper.vm.isOnline).toBe(true)
        expect(wrapper.vm.hasMidFlightError).toBe(false)
    })

    it('should reactively update isOnline when browser goes offline', async () => {
        const onlineSpy = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
        const wrapper = mount(TestComponent)

        onlineSpy.mockReturnValue(false)
        window.dispatchEvent(new Event('offline'))

        expect(wrapper.vm.isOnline).toBe(false)
    })

    it('should set hasMidFlightError to true when custom event is captured', () => {
        const wrapper = mount(TestComponent)

        window.dispatchEvent(new CustomEvent('network:midflight-error'))

        expect(wrapper.vm.hasMidFlightError).toBe(true)
    })

    it('should remove all event listeners upon unmount to prevent memory leaks', () => {
        const removeListenerSpy = vi.spyOn(window, 'removeEventListener')
        const wrapper = mount(TestComponent)

        wrapper.unmount()

        expect(removeListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
        expect(removeListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))
        expect(removeListenerSpy).toHaveBeenCalledWith('network:midflight-error', expect.any(Function))
    })
})