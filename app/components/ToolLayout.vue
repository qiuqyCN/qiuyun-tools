<template>
  <div class="max-w-6xl mx-auto px-6 lg:px-8 py-6 lg:py-8">
    <!-- Breadcrumb + Back -->
    <nav class="flex items-center gap-1.5 text-sm text-slate-500 mb-5">
      <button
        @click="goBack"
        class="flex items-center gap-1 hover:text-indigo-500 transition mr-1 text-slate-400 hover:bg-slate-100 rounded-md px-1.5 py-0.5"
        title="返回"
      >
        <component :is="icons.ArrowLeft" class="w-3.5 h-3.5" />
      </button>
      <NuxtLink to="/" class="hover:text-indigo-500 transition">首页</NuxtLink>
      <component :is="icons.ChevronRight" class="w-3 h-3 text-slate-300" />
      <span>{{ categoryName }}</span>
      <component :is="icons.ChevronRight" class="w-3 h-3 text-slate-300" />
      <span class="text-slate-700 font-medium">{{ toolName }}</span>
    </nav>

    <!-- Title -->
    <header class="mb-6">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-md">
          <component :is="icons[icon]" class="w-6 h-6 text-white" />
        </div>
        <div class="flex-1 min-w-0 pt-0.5">
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-2xl font-bold text-slate-800">{{ toolName }}</h1>
            <slot name="badge" />
          </div>
          <p v-if="description" class="text-sm text-slate-500 mt-1.5">{{ description }}</p>
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

const router = useRouter()
const goBack = () => {
  if (window.history.length > 1 && document.referrer) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
