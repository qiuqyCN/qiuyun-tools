<template>
  <div class="py-16 text-center">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
      <component :is="icons.Hammer" class="w-7 h-7 text-slate-400" />
    </div>
    <h3 class="text-lg font-medium text-slate-700 mb-1">{{ tool.name }}</h3>
    <p class="text-sm text-slate-400">正在建设中，敬请期待</p>
    <NuxtLink to="/" class="inline-flex items-center gap-1 mt-6 text-sm text-indigo-600 hover:text-indigo-700">
      <component :is="icons.ArrowLeft" class="w-4 h-4" />
      返回首页
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import type { ToolItem } from '~/data/tools'

defineProps<{ tool: ToolItem }>()
</script>
