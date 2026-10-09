<template>
  <div class="max-w-6xl mx-auto px-6 lg:px-8 py-6 lg:py-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-1.5 text-xs text-slate-400 mb-5">
      <NuxtLink to="/" class="hover:text-indigo-500">首页</NuxtLink>
      <component :is="icons.ChevronRight" class="w-3 h-3" />
      <span>{{ categoryName }}</span>
      <component :is="icons.ChevronRight" class="w-3 h-3" />
      <span class="text-slate-600">{{ toolName }}</span>
    </nav>

    <!-- Title -->
    <header class="mb-6">
      <div class="flex items-start gap-3">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm">
          <component :is="icons[icon]" class="w-5 h-5 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-xl font-semibold text-slate-800">{{ toolName }}</h1>
            <slot name="badge" />
          </div>
          <p v-if="description" class="text-sm text-slate-500 mt-1">{{ description }}</p>
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
