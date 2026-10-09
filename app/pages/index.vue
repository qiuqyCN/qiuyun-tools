<template>
  <div class="max-w-5xl mx-auto px-8 py-10">
    <!-- Hero -->
    <header class="mb-10">
      <h1 class="text-3xl font-bold text-slate-800 mb-2">开发者工具集</h1>
      <p class="text-slate-500">51 个纯前端开发工具，无需后端、数据不离开浏览器</p>
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
</script>
