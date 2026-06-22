import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import router from "../index";
import { useAuthStore } from "../../stores/auth/auth";

describe("Router Navigation Guards", () => {
    let authStore: ReturnType<typeof useAuthStore>;

    beforeEach(async () => {
        setActivePinia(createPinia());
        authStore = useAuthStore();

        vi.restoreAllMocks();
    });

    it("should redirect an unauthenticated user to login when accessing a protected route", async () => {
        vi.spyOn(authStore, "checkSession").mockResolvedValue(false);

        await router.push("/profile");

        expect(router.currentRoute.value.name).toBe("login");
    });

    it("should redirect an authenticated user to home when trying to access the login page", async () => {
        vi.spyOn(authStore, "checkSession").mockResolvedValue(true);

        await router.push("/profile");
        await router.push("/login");

        expect(router.currentRoute.value.name).toBe("home");
    });
});
