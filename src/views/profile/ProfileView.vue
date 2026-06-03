<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProfile } from "./composables/useProfile";
import { useAuthStore } from "@/stores/auth/auth";

const router = useRouter();
const authStore = useAuthStore();
const {
  loading,
  error,
  success,
  medicaments,
  allergies,
  bloodType,
  loadProfile,
  updateProfile,
  setMedicaments,
  setAllergies,
} = useProfile();

// Sincroniza a entrada de texto dividida por vírgulas de volta para o shallowRef
const handleMedicamentsInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  const list = target.value.split(",").map((item) => item.trim());
  setMedicaments(list);
};

const handleAllergiesInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  const list = target.value.split(",").map((item) => item.trim());
  setAllergies(list);
};

const handleLogout = (): void => {
  authStore.logout();
};

const handleBack = (): void => {
  router.push({ name: "home" });
};

onMounted(async () => {
  await loadProfile();
});
</script>

<template>
  <div
    class="relative w-full min-h-dvh flex flex-col bg-gradient-to-b from-brand-red to-brand-dark px-5 py-6 font-sans text-brand-dark overflow-y-auto"
  >
    <header v-if="authStore.user" class="w-full flex flex-col items-center text-center mt-4 mb-6">
      <div class="relative w-28 h-28 mb-3 flex items-center justify-center">
        <div class="absolute -top-3 w-full flex justify-between px-2 pointer-events-none z-0">
          <div class="w-7 h-7 bg-white transform rotate-45 rounded-sm"></div>
          <div class="w-7 h-7 bg-white transform rotate-45 rounded-sm"></div>
        </div>
        <img
          :src="authStore.user.photoUrl || 'https://www.gravatar.com/avatar/?d=mp'"
          :alt="`Foto de perfil de ${authStore.user.name}`"
          class="relative w-full h-full rounded-full object-cover border-4 border-white/80 shadow-xl z-10"
        />
      </div>
      <h1 class="text-white text-2xl font-bold tracking-tight">{{ authStore.user.name }}</h1>
      <p class="text-white/80 text-sm font-medium underline mt-0.5">{{ authStore.user.email }}</p>
    </header>

    <div aria-live="assertive" class="w-full max-w-md mx-auto mb-4">
      <div
        v-if="error"
        role="alert"
        class="bg-white border-l-4 border-red-500 text-red-700 p-3 rounded-r-xl text-sm font-medium shadow-md"
      >
        {{ error }}
      </div>
      <div
        v-if="success"
        role="alert"
        class="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-sm font-medium shadow-md border border-emerald-200"
      >
        Perfil médico atualizado com sucesso.
      </div>
    </div>

    <main class="w-full max-w-md mx-auto flex-1 flex flex-col gap-5">
      <section class="w-full bg-white rounded-2xl p-4 shadow-xl flex flex-col gap-4">
        <h2
          class="text-xs font-bold tracking-wider text-center text-red-800/60 uppercase border-b border-gray-100 pb-2"
        >
          Informações Importantes
        </h2>

        <div class="flex flex-col gap-1">
          <label for="medicaments" class="text-xs font-bold text-red-800/80 uppercase"
            >Medicamentos:</label
          >
          <textarea
            id="medicaments"
            :value="medicaments.join(', ')"
            @input="handleMedicamentsInput"
            rows="2"
            class="w-full bg-brand-card border border-brand-red/10 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-red/40 resize-none"
            placeholder="Ex: Med1, Med2"
          ></textarea>
        </div>

        <div class="flex flex-col gap-1">
          <label for="allergies" class="text-xs font-bold text-red-800/80 uppercase"
            >Alergias:</label
          >
          <textarea
            id="allergies"
            :value="allergies.join(', ')"
            @input="handleAllergiesInput"
            rows="2"
            class="w-full bg-brand-card border border-brand-red/10 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-red/40 resize-none"
            placeholder="Ex: N/A ou Dorflex"
          ></textarea>
        </div>

        <div class="flex flex-col gap-1">
          <label for="bloodType" class="text-xs font-bold text-red-800/80 uppercase"
            >Tipo Sanguíneo:</label
          >
          <input
            id="bloodType"
            v-model="bloodType"
            type="text"
            class="w-full bg-brand-card border border-brand-red/10 rounded-xl h-10 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-red/40"
            placeholder="Ex: O+"
          />
        </div>
      </section>

      <section class="w-full bg-white rounded-2xl p-4 shadow-xl flex flex-col gap-3">
        <h2
          class="text-xs font-bold tracking-wider text-center text-red-800/60 uppercase border-b border-gray-100 pb-2"
        >
          Ações
        </h2>

        <button
          @click="updateProfile"
          :disabled="loading"
          class="w-full h-10 bg-brand-red hover:bg-red-700 text-white font-bold text-sm rounded-xl flex items-center justify-center transition-colors shadow-md disabled:opacity-50"
        >
          {{ loading ? "Salvando..." : "Salvar Alterações" }}
        </button>

        <button
          @click="handleLogout"
          class="w-full h-10 bg-brand-card hover:bg-red-50 text-red-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors border border-brand-red/10"
        >
          <span>SAIR</span>
          <svg
            class="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </section>

      <footer class="w-full flex flex-col items-center gap-4 mt-auto pt-6">
        <button
          @click="handleBack"
          class="flex items-center gap-2 text-white font-bold text-sm tracking-wide bg-black/10 hover:bg-black/20 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white/40 transition-colors"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>VOLTAR</span>
        </button>
        <span class="text-white/40 text-xs font-semibold tracking-widest">v1.3.0</span>
      </footer>
    </main>
  </div>
</template>
