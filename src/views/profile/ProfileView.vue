<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProfile } from "./composables/useProfile";
import { useAuthStore } from "@/stores/auth/auth";
import { BLOOD_TYPE_OPTIONS, type BackendBloodType } from "@/types/profile";
import { APP_CONFIG } from "@/config/constants";
import BaseAlert from "@/components/BaseAlert.vue";

const router = useRouter();
const authStore = useAuthStore();

const { error, success, medications, allergies, bloodType, loadProfile, updateProfile } =
  useProfile();

const handleFieldBlur = async () => {
  await updateProfile();
};

const handleBloodTypeChange = async (event: Event) => {
  const target = event.target as HTMLSelectElement;
  bloodType.value = target.value as BackendBloodType;
  await updateProfile();
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
    class="relative w-full min-h-dvh flex flex-col bg-gradient-to-b from-brand-red to-brand-dark px-6 py-8 font-sans text-brand-dark overflow-y-auto select-none"
  >
    <div class="w-full max-w-sm mx-auto mb-2 fixed top-4 inset-x-6 z-50 flex flex-col gap-2">
      <BaseAlert v-if="error" type="error" :message="error" assertive />

      <BaseAlert v-if="success" type="success" message="Alterações sincronizadas com o banco." />
    </div>

    <!-- Profile Image, Name and Email -->
    <header v-if="authStore.user" class="w-full flex flex-col items-center text-center mt-4 mb-6">
      <div class="relative w-28 h-28 mb-3 flex items-center justify-center">
        <!-- Cat's ears -->
        <div
          class="absolute -top-4 inset-x-0 w-full flex justify-between px-2 pointer-events-none z-0"
        >
          <div
            class="w-7 h-7 bg-white [clip-path:polygon(50%_0%,0%_100%,100%_100%)] transform -rotate-26"
          ></div>

          <div
            class="w-7 h-7 bg-white [clip-path:polygon(50%_0%,0%_100%,100%_100%)] transform rotate-26"
          ></div>
        </div>

        <!-- Right Cat's Whiskers -->
        <div class="absolute -right-8 flex flex-col gap-2.5 pointer-events-none z-0 opacity-80">
          <div class="w-8 h-0.5 bg-white transform -rotate-15"></div>
          <div class="w-10 h-0.5 bg-white transform"></div>
          <div class="w-8 h-0.5 bg-white transform rotate-15"></div>
        </div>

        <!-- Profile Image -->
        <img
          :src="authStore.user.photoUrl || 'https://www.gravatar.com/avatar/?d=mp'"
          :alt="`Foto de perfil de ${authStore.user.name}`"
          class="relative w-full h-full rounded-full object-cover border-4 border-white shadow-xl z-10"
        />

        <!-- Left Cat's Whiskers -->
        <div class="absolute -left-7 flex flex-col gap-2.5 pointer-events-none z-0 opacity-80">
          <div class="w-8 h-0.5 bg-white transform rotate-15"></div>
          <div class="w-10 h-0.5 bg-white transform -translate-x-1"></div>
          <div class="w-8 h-0.5 bg-white transform -rotate-15"></div>
        </div>
      </div>

      <h1 class="text-white text-2xl font-bold tracking-tight">{{ authStore.user.name }}</h1>
      <p class="text-white/90 text-sm font-normal underline mt-0.5">{{ authStore.user.email }}</p>
    </header>

    <main class="w-full max-w-sm mx-auto flex-1 flex flex-col gap-4">
      <section class="w-full bg-white rounded-2xl p-4 shadow-xl flex flex-col gap-3">
        <h2 class="text-sm font-bold tracking-wider text-center text-red-900/80 uppercase pb-1">
          Informações Importantes
        </h2>

        <div
          class="bg-brand-card rounded-xl p-3 flex flex-col gap-1 transition-all focus-within:ring-2 focus-within:ring-brand-red/30"
        >
          <label for="medications" class="text-xs font-bold text-brand-red uppercase tracking-wide">
            Medicamentos:
          </label>
          <textarea
            id="medications"
            v-model="medications"
            @blur="handleFieldBlur"
            rows="2"
            class="w-full bg-transparent border-none p-0 text-sm font-medium text-brand-dark/90 focus:outline-none focus:ring-0 resize-none placeholder-brand-red/30"
            placeholder="Nenhum medicamento registrado"
          ></textarea>
        </div>

        <div
          class="bg-brand-card rounded-xl p-3 flex flex-col gap-1 transition-all focus-within:ring-2 focus-within:ring-brand-red/30"
        >
          <label for="allergies" class="text-xs font-bold text-brand-red uppercase tracking-wide">
            Alergias:
          </label>
          <textarea
            id="allergies"
            v-model="allergies"
            @blur="handleFieldBlur"
            rows="2"
            class="w-full bg-transparent border-none p-0 text-sm font-medium text-brand-dark/90 focus:outline-none focus:ring-0 resize-none placeholder-brand-red/30"
            placeholder="Nenhuma alergia registrada"
          ></textarea>
        </div>

        <div
          class="bg-brand-card rounded-xl p-3 flex flex-col gap-1 transition-all focus-within:ring-2 focus-within:ring-brand-red/30"
        >
          <label for="bloodType" class="text-xs font-bold text-brand-red uppercase tracking-wide">
            Tipo Sanguíneo:
          </label>
          <select
            id="bloodType"
            :value="bloodType"
            @change="handleBloodTypeChange"
            class="w-full bg-transparent border-none p-0 text-sm font-medium text-brand-dark/90 focus:outline-none focus:ring-0 cursor-pointer"
          >
            <option value="">Não informado</option>
            <option v-for="option in BLOOD_TYPE_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </section>

      <section class="w-full bg-white rounded-2xl p-4 shadow-xl flex flex-col gap-2">
        <h2 class="text-xs font-bold tracking-wider text-center text-red-900/80 uppercase pb-1">
          Ações
        </h2>

        <button
          @click="handleLogout"
          class="w-full h-11 bg-brand-card hover:bg-red-100/50 text-brand-red font-bold text-sm rounded-xl flex items-center justify-start px-4 gap-2 transition-colors duration-150 active:scale-[0.99]"
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

      <footer class="w-full flex flex-col items-center gap-4 mt-auto pt-4">
        <button
          @click="handleBack"
          class="group flex items-center gap-2 text-white font-semibold text-sm tracking-wide bg-transparent border border-white rounded-md px-4 py-2 hover:bg-white/10 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <svg
            class="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform"
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
        <span class="text-white/40 text-xs font-medium tracking-wider">{{
          APP_CONFIG.VERSION
        }}</span>
      </footer>
    </main>
  </div>
</template>
