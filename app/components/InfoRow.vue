<template>
  <div class="flex items-center gap-2 text-sm">
    <span class="text-slate-500 w-24 shrink-0">{{ label }}:</span>
    <span class="text-slate-800 font-medium break-all">{{ value || '-' }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value?: string }>()
</script>
