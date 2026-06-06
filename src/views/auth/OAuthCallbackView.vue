<script setup lang="ts">
import { onMounted } from "vue";
import { useOAuthCallback } from "./composables/useOAuthCallback";

const { isProcessing, error, handleCallback } = useOAuthCallback();

onMounted(async () => {
  await handleCallback();
});
</script>

<template>
  <div class="callback-container" aria-live="polite">
    <div v-if="isProcessing" class="loading-state">
      <div class="spinner" aria-hidden="true"></div>
      <p>Autenticando sessão com o Google, aguarde...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <router-link to="/login" class="back-button"> Voltar para a página de Login </router-link>
    </div>
  </div>
</template>

<style scoped>
.callback-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-message {
  color: #dc2626;
  font-weight: 600;
}

.back-button {
  margin-top: 0.5rem;
  color: #2c3e50;
  text-decoration: underline;
  cursor: pointer;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #2c3e50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
