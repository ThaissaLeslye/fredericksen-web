<script setup lang="ts">
import { useNetworkStatus } from "@/infrastructure/http/composables/useNetworkStatus";

const { isOnline, hasMidFlightError } = useNetworkStatus();
</script>

<template>
  <div
    v-if="!isOnline || hasMidFlightError"
    role="alert"
    aria-live="assertive"
    class="fixed bottom-4 inset-x-6 z-50 max-w-sm mx-auto bg-amber-500 text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-2xl flex items-center justify-between gap-3 animate-fade-in border border-amber-600"
  >
    <div class="flex items-center gap-2">
      <svg
        class="w-4 h-4 shrink-0 animate-pulse"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>
        {{
          !isOnline
            ? "Você está offline. Verifique sua conexão."
            : "Erro de sincronização. Tentando reconectar..."
        }}
      </span>
    </div>
  </div>
</template>
