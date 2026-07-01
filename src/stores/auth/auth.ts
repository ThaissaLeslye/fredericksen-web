import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { apiClient } from "@/infrastructure/http/apiClient";
import { API_ENDPOINTS } from "@/config/endpoints";

export interface UserSession {
    id: string;
    name: string;
    email: string;
    photoUrl: string;
}

export const useAuthStore = defineStore("auth", () => {
    const user = ref<UserSession | null>(null);
    const isProcessing = ref<boolean>(false);
    const initialized = ref<boolean>(false);

    const isAuthenticated = computed<boolean>(() => !!user.value);

    async function checkSession(): Promise<boolean> {
        if (initialized.value) return isAuthenticated.value;

        isProcessing.value = true;
        try {
            const response = await apiClient.get<UserSession>(API_ENDPOINTS.USER.ME);
            user.value = response.data;
            return true;
        } catch {
            user.value = null;
            return false;
        } finally {
            initialized.value = true;
            isProcessing.value = false;
        }
    }

    function setSession(userData: UserSession): void {
        user.value = userData;
        initialized.value = true;
    }

    async function logout(): Promise<void> {
        isProcessing.value = true;

        try {
            await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error("[AuthStore] Falha ao revogar sessão remota:", error);
        } finally {
            user.value = null;
            isProcessing.value = false;
            initialized.value = false;
            window.location.href = "/login";
        }
    }

    return {
        user,
        isProcessing,
        initialized,
        isAuthenticated,
        checkSession,
        setSession,
        logout,
    };
});
