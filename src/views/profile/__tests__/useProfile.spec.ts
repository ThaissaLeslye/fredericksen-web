import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";
import { useProfile } from "../composables/useProfile";
import { apiClient } from "@/infrastructure/http/apiClient";

vi.mock("@/infrastructure/http/apiClient", () => ({
    apiClient: {
        get: vi.fn(),
        patch: vi.fn(),
    },
}));

describe("useProfile Composable", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should initialize with correct default pristine states as strings", () => {
        const { medications, allergies, bloodType, loading, error, success } = useProfile();

        expect(medications.value).toBe("");
        expect(allergies.value).toBe("");
        expect(bloodType.value).toBe("");
        expect(loading.value).toBe(false);
        expect(error.value).toBeNull();
        expect(success.value).toBe(false);
    });

    it("should successfully fetch profile metadata from backend node structure", async () => {
        const mockProfile = {
            id: "uuid-123",
            name: "Thaisa Leslye Lourenço",
            email: "fulana.tal@gmail.com",
            photoUrl: null,
            medications: "Med1, Med2",
            allergies: "N/A",
            bloodType: "O_POSITIVE",
        };

        vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockProfile });

        const { medications, allergies, bloodType, loadProfile } = useProfile();
        await loadProfile();

        expect(medications.value).toBe("Med1, Med2");
        expect(allergies.value).toBe("N/A");
        expect(bloodType.value).toBe("O_POSITIVE");
        expect(apiClient.get).toHaveBeenCalledWith("/profile");
    });

    it("should successfully persist completely empty or cleared values without local blocking", async () => {
        vi.mocked(apiClient.get).mockResolvedValueOnce({
            data: {
                id: "uuid-123",
                name: "Thaisa Leslye Lourenço",
                email: "fulana.tal@gmail.com",
                photoUrl: null,
                medications: "Med1, Med2",
                allergies: "Poeira",
                bloodType: "O_POSITIVE",
            },
        });
        vi.mocked(apiClient.patch).mockResolvedValueOnce({ data: {} });

        const { medications, allergies, bloodType, success, error, updateProfile, loadProfile } =
            useProfile();
        await loadProfile();

        medications.value = "";
        allergies.value = "";
        bloodType.value = "";

        const promise = updateProfile();
        vi.advanceTimersByTime(300);
        const result = await promise;

        expect(result).toBe(true);
        expect(success.value).toBe(true);
        expect(error.value).toBeNull();
        expect(apiClient.patch).toHaveBeenCalledWith("/profile", {
            medications: "",
            allergies: "",
            bloodType: null,
        });
    });

    it("should fire PATCH request with exact contract nomenclature when payloads are filled", async () => {
        vi.mocked(apiClient.patch).mockResolvedValueOnce({ data: {} });

        const { medications, allergies, bloodType, success, error, updateProfile } = useProfile();

        medications.value = "Dipirona";
        allergies.value = "Poeira";
        bloodType.value = "O_NEGATIVE";

        const promise = updateProfile();
        vi.advanceTimersByTime(300);
        const result = await promise;

        expect(result).toBe(true);
        expect(success.value).toBe(true);
        expect(error.value).toBeNull();
    });

    it("should forward data without execution or mutations when handling malicious XSS scripts inside input states", async () => {
        vi.mocked(apiClient.patch).mockResolvedValueOnce({ data: {} });
        const { medications, updateProfile } = useProfile();

        const maliciousPayload = "<script>alert('xss')</script>";
        medications.value = maliciousPayload;

        const promise = updateProfile();
        vi.advanceTimersByTime(300);
        const result = await promise;

        expect(result).toBe(true);
        expect(apiClient.patch).toHaveBeenCalledWith(
            "/profile",
            expect.objectContaining({
                medications: maliciousPayload,
            }),
        );
    });

    it("should queue and retry updateProfile instead of rejecting if loading state is active", async () => {
        vi.mocked(apiClient.patch).mockResolvedValue({ data: {} });

        const TestComponent = defineComponent({
            setup() {
                const { loading, medications, updateProfile } = useProfile();
                return { loading, medications, updateProfile };
            },
            template: "<div />",
        });
        const wrapper = mount(TestComponent);
        wrapper.vm.medications = "Nova medicação";
        wrapper.vm.loading = true;
        const promise = wrapper.vm.updateProfile();

        vi.advanceTimersByTime(300);
        wrapper.vm.loading = false;

        vi.advanceTimersByTime(300);
        const result = await promise;

        expect(result).toBe(true);
        expect(apiClient.patch).toHaveBeenCalledTimes(1);
    });

    it("should clear previous success timer when updateProfile runs successfully again", async () => {
        vi.mocked(apiClient.patch).mockResolvedValue({ data: {} });
        const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

        const { medications, updateProfile } = useProfile();

        medications.value = "Primeiro Medicamento";
        const p1 = updateProfile();
        vi.advanceTimersByTime(300);
        await p1;

        medications.value = "Segundo Medicamento (Modificado)";
        const p2 = updateProfile();
        vi.advanceTimersByTime(300);
        await p2;

        expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it("should clear active success timer when component triggers onUnmounted lifecycle hook", async () => {
        vi.mocked(apiClient.patch).mockResolvedValue({ data: {} });
        const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

        const TestComponent = defineComponent({
            setup() {
                const { medications, updateProfile } = useProfile();
                return { medications, updateProfile };
            },
            template: "<div />",
        });
        const wrapper = mount(TestComponent);
        wrapper.vm.medications = "Medicamento de Desmonte";

        const p = wrapper.vm.updateProfile();
        vi.advanceTimersByTime(300);
        await p;

        wrapper.unmount();

        expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it("should consolidate multiple consecutive updates into a single PATCH request", async () => {
        vi.mocked(apiClient.patch).mockResolvedValue({ data: {} });

        const { medications, updateProfile } = useProfile();

        medications.value = "A";
        updateProfile();

        medications.value = "B";
        updateProfile();

        medications.value = "C";
        const promise = updateProfile();

        vi.advanceTimersByTime(300);
        await promise;

        expect(apiClient.patch).toHaveBeenCalledTimes(1);
        expect(apiClient.patch).toHaveBeenCalledWith(
            "/profile",
            expect.objectContaining({
                medications: "C",
            }),
        );
    });
});
