<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const handleSessionExpired = (): void => {
  // RNF02: Limpeza imediata do armazenamento local para evitar vazamento de dados médicos
  localStorage.clear();

  // RFE04: Redireciona forçadamente para a tela de login
  router.push({ name: "login" });
};

onMounted(() => {
  window.addEventListener("auth:expired", handleSessionExpired);
});

onUnmounted(() => {
  window.removeEventListener("auth:expired", handleSessionExpired);
});
</script>

<template>
  <RouterView />
</template>
