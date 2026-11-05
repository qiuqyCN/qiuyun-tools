<template>
  <div class="max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-10">
    <!-- Hero -->
    <header class="mb-10 flex items-center gap-5">
      <img src="/favicon.png" alt="logo" class="w-14 h-14 rounded-2xl shadow-sm object-contain" />
      <div>
        <h1 class="text-3xl font-bold text-slate-800 mb-1">开发者工具箱</h1>
        <p class="text-slate-500">一站式开发者工具箱</p>
      </div>
    </header>

    <!-- Categories -->
    <section v-for="cat in categories" :key="cat.id" class="mb-10">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
          <component :is="icons[cat.icon]" class="w-4 h-4 text-indigo-600" />
        </div>
        <h2 class="text-lg font-semibold text-slate-700">{{ cat.name }}</h2>
        <span class="text-xs text-slate-400">{{ cat.tools.length }} 个工具</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <NuxtLink
          v-for="tool in cat.tools"
          :key="tool.id"
          :to="tool.route"
          class="group p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center transition"
            >
              <component
                :is="icons[tool.icon]"
                class="w-4 h-4 text-slate-500 group-hover:text-indigo-600 transition"
              />
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition">
                {{ tool.name }}
              </div>
              <div class="text-xs text-slate-400 mt-0.5 line-clamp-2">{{ tool.desc }}</div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { categories } from '~/data/tools'
import * as icons from 'lucide-vue-next'

const totalTools = computed(() => categories.reduce((s, c) => s + c.tools.length, 0))
</script>
