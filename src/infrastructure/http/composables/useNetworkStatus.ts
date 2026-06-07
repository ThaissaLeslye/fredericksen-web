import { ref, onMounted, onUnmounted } from 'vue'

export function useNetworkStatus() {
    const isOnline = ref<boolean>(navigator.onLine)
    const hasMidFlightError = ref<boolean>(false)

    const updateOnlineStatus = (): void => {
        isOnline.value = navigator.onLine
        if (navigator.onLine) {
            hasMidFlightError.value = false
        }
    }

    const handleMidFlightError = (): void => {
        hasMidFlightError.value = true
    }

    onMounted(() => {
        window.addEventListener('online', updateOnlineStatus)
        window.addEventListener('offline', updateOnlineStatus)
        window.addEventListener('network:midflight-error', handleMidFlightError)
    })

    onUnmounted(() => {
        window.removeEventListener('online', updateOnlineStatus)
        window.removeEventListener('offline', updateOnlineStatus)
        window.removeEventListener('network:midflight-error', handleMidFlightError)
    })

    return {
        isOnline,
        hasMidFlightError
    }
}