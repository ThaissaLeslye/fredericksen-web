<script setup lang="ts">
import { useLogin } from "./auth/composables/useLogin";

const { googleAuthUrl, authError } = useLogin();
</script>

<template>
  <div
    class="container-mobile min-height-screen flex flex-col pt-6 md:pt-12 bg-linear-to-b from-brand-red to-brand-dark overflow-hidden relative font-sans"
  >
    <div class="absolute top-0 left-0 w-full z-0 select-none pointer-events-none">
      <img
        src="@/assets/images/fundoLogin.svg"
        alt="Fundo decorativo"
        width="393"
        height="599"
        class="w-full h-auto object-cover"
      />
    </div>

    <div class="fredericksen relative z-10 flex flex-col items-center w-full">
      <img
        src="@/assets/images/fredericksenLogin.png"
        alt="Gato Fredericksen"
        class="w-full h-auto md:object-contain drop-shadow-md animate-fade-in"
      />
    </div>

    <div class="relative z-10 flex flex-col items-center text-center px-4 pb-16 w-full gap-8">
      <h1 class="text-white text-2xl font-bold tracking-tight leading-snug max-w-70">
        Bem-vindo ao lar do Fredericksen:
      </h1>

      <div
        v-if="authError"
        role="alert"
        aria-live="polite"
        class="w-full bg-brand-card border border-brand-red/30 text-brand-dark text-sm font-medium px-4 py-3 rounded-xl shadow-sm animate-fade-in"
      >
        {{ authError }}
      </div>

      <a
        :href="googleAuthUrl"
        class="w-full h-12.5 max-w-[320px] bg-white text-gray-700 font-semibold text-base py-3.5 px-6 rounded-full flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50"
      >
        <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>

        <span>Acesse utilizando o Google</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
/* Atalho auxiliar para altura total adaptável em navegadores móveis (ajuste para barra de navegação dinâmica) */
.min-height-screen {
  min-height: 100vh;
  min-height: 100dvh;
}
.fredericksen {
  margin-top: 6vh;
}
</style>
