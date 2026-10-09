<template>
  <div class="max-w-5xl mx-auto px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
      <NuxtLink to="/" class="hover:text-indigo-500">首页</NuxtLink>
      <component :is="icons.ChevronRight" class="w-3 h-3" />
      <span>{{ categoryName }}</span>
      <component :is="icons.ChevronRight" class="w-3 h-3" />
      <span class="text-slate-600">{{ toolName }}</span>
    </nav>

    <!-- Title -->
    <header class="mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <component :is="icons[icon]" class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="text-xl font-semibold text-slate-800">{{ toolName }}</h1>
          <p class="text-sm text-slate-500">{{ description }}</p>
        </div>
      </div>
    </header>

    <!-- Content -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

defineProps<{
  categoryName: string
  toolName: string
  description?: string
  icon: string
}>()
</script>
