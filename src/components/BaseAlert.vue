<script setup lang="ts">
export type AlertType = "error" | "success" | "warning";

interface Props {
  type: AlertType;
  message: string;
  assertive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  assertive: false,
});
</script>

<template>
  <div
    :role="props.type === 'error' ? 'alert' : 'status'"
    :aria-live="props.assertive || props.type === 'error' ? 'assertive' : 'polite'"
    class="w-full rounded-xl p-4 shadow-md transition-all duration-200 border animate-fade-in flex items-start gap-3 select-none"
    :class="{
      'bg-red-50 border-red-200 text-red-900': props.type === 'error',
      'bg-emerald-50 border-emerald-200 text-emerald-900': props.type === 'success',
      'bg-amber-50 border-amber-200 text-amber-900': props.type === 'warning',
    }"
  >
    <svg
      class="w-5 h-5 shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        v-if="props.type === 'error'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        v-else-if="props.type === 'success'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        v-else
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>

    <div class="text-sm font-medium leading-relaxed break-words">
      {{ props.message }}
    </div>
  </div>
</template>
