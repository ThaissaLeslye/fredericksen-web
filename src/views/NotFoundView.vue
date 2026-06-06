<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const handleGoBack = (): void => {
  router.push({ name: "home" });
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-dvh bg-gradient-to-b from-brand-red to-brand-dark text-white px-6 text-center select-none"
  >
    <h1 class="text-6xl font-extrabold tracking-tight mb-2">404</h1>
    <p class="text-lg font-medium mb-8 max-w-xs opacity-90">
      Ops! Essa página não existe no lar do Fredericksen.
    </p>

    <button
      @click="handleGoBack"
      class="group flex items-center gap-2 text-brand-red font-bold text-sm tracking-wide bg-white rounded-full px-6 py-3 shadow-lg hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-white/30"
    >
      <span>VOLTAR PARA O INÍCIO</span>
    </button>
  </div>
</template>
