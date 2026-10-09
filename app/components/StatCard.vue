<template>
  <div class="bg-white rounded-xl border border-slate-200 p-4">
    <div class="text-xs text-slate-400 mb-1">{{ label }}</div>
    <div class="text-2xl font-semibold text-slate-800 tabular-nums">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: number | string }>()
</script>
