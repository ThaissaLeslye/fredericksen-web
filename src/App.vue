<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth/auth";
import NetworkBanner from "@/components/NetworkBanner.vue";

const authStore = useAuthStore();

const handleSessionExpired = (): void => {
  authStore.logout();
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
  <NetworkBanner />
</template>
