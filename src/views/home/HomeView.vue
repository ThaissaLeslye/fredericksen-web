<script setup lang="ts">
import { onMounted } from "vue";
import { useUserProfile } from "./composables/useUserProfile";

const { profile, loading, error, fetchProfile } = useUserProfile();

onMounted(async () => {
  await fetchProfile();
});
</script>

<template>
  <div class="w-full min-h-dvh bg-white font-sans">
    <div class="container-mobile">
      <header class="w-full flex items-center justify-between py-3 p-5 bg-white">
        <h1 class="text-brand-red text-2xl font-bold tracking-tight">Fredericksen’s Home</h1>

        <div v-if="profile" class="flex items-center">
          <router-link
            :to="{ name: 'profile' }"
            class="block rounded-full focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:ring-offset-2"
            aria-label="Acessar meu perfil"
          >
            <img
              :src="profile.photoUrl || 'https://www.gravatar.com/avatar/?d=mp'"
              :alt="`Foto de perfil de ${profile.name}`"
              class="w-11 h-11 rounded-full object-cover border-2 border-brand-red shadow-sm hover:opacity-90 transition-opacity"
            />
          </router-link>
        </div>

        <div
          v-else-if="loading"
          class="w-11 h-11 rounded-full bg-gray-200 animate-pulse"
          aria-hidden="true"
        ></div>
      </header>

      <main class="py-8">
        <div
          v-if="error"
          role="alert"
          class="p-4 rounded-xl bg-brand-card border border-brand-red/10 text-brand-dark text-sm"
        >
          {{ error }}
        </div>
      </main>
    </div>
  </div>
</template>
