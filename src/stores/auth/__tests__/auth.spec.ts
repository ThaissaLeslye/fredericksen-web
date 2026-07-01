import { beforeEach, describe, expect, it, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore, type UserSession } from "../auth";
import { apiClient } from "@/infrastructure/http/apiClient";

vi.mock("@/infrastructure/http/apiClient", () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe("useAuthStore", () => {
    const mockUser: UserSession = {
        id: "uuid-123",
        name: "Thaisa Lourenço",
        email: "fulana.tal@gmail.com",
        photoUrl: "https://foto.url",
    };

    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        vi.unstubAllGlobals();
    });

    it("should initialize with default pristine states", () => {
        const store = useAuthStore();
        expect(store.user).toBeNull();
        expect(store.isAuthenticated).toBe(false);
        expect(store.initialized).toBe(false);
    });

    it("should successfully populate state when checkSession hits valid cookie credentials", async () => {
        const store = useAuthStore();
        vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockUser });

        const isAuthorized = await store.checkSession();

        expect(isAuthorized).toBe(true);
        expect(store.user).toEqual(mockUser);
        expect(store.isAuthenticated).toBe(true);
        expect(store.initialized).toBe(true);
    });

    it("should invalidate state and return false when checkSession hits an expired cookie", async () => {
        const store = useAuthStore();
        vi.mocked(apiClient.get).mockRejectedValueOnce(new Error("Unauthorized"));

        const isAuthorized = await store.checkSession();

        expect(isAuthorized).toBe(false);
        expect(store.user).toBeNull();
        expect(store.isAuthenticated).toBe(false);
    });

    it("should request backend revocation and wipe out session context on logout execution", async () => {
        const store = useAuthStore();
        store.setSession(mockUser);
        vi.mocked(apiClient.post).mockResolvedValueOnce({});

        const mockLocation = { href: "" };
        vi.stubGlobal("location", mockLocation);

        await store.logout();

        expect(apiClient.post).toHaveBeenCalledWith("/auth/logout");
        expect(store.user).toBeNull();
        expect(store.isAuthenticated).toBe(false);
        expect(mockLocation.href).toBe("/login");
    });
});
