<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Sidebar -->
    <aside
      class="w-64 shrink-0 border-r border-slate-200 bg-white h-screen sticky top-0 overflow-y-auto flex flex-col"
    >
      <!-- Logo -->
      <div class="h-14 flex items-center gap-2 px-5 border-b border-slate-100">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <component :is="icons.Wrench" class="w-4 h-4 text-white" />
        </div>
        <span class="font-semibold text-slate-800">工具集</span>
      </div>

      <!-- Search -->
      <div class="px-3 py-3">
        <div class="relative">
          <component
            :is="icons.Search"
            class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            v-model="searchQuery"
            placeholder="搜索工具..."
            class="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
      </div>

      <!-- Categories & Tools -->
      <nav class="flex-1 px-2 pb-4 space-y-1">
        <template v-for="cat in filteredCategories" :key="cat.id">
          <button
            @click="toggleCategory(cat.id)"
            class="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <component :is="icons[cat.icon]" class="w-4 h-4 text-slate-500" />
            <span class="flex-1 text-left">{{ cat.name }}</span>
            <component
              :is="openCats.has(cat.id) ? icons.ChevronDown : icons.ChevronRight"
              class="w-4 h-4 text-slate-400"
            />
          </button>
          <Transition name="slide">
            <div v-if="openCats.has(cat.id)" class="ml-4 space-y-0.5">
              <NuxtLink
                v-for="tool in cat.tools"
                :key="tool.id"
                :to="tool.route"
                class="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 rounded-md hover:bg-slate-100 hover:text-indigo-600 transition"
                active-class="bg-indigo-50 text-indigo-600 font-medium"
              >
                <component :is="icons[tool.icon]" class="w-3.5 h-3.5 opacity-70" />
                {{ tool.name }}
              </NuxtLink>
            </div>
          </Transition>
        </template>
      </nav>
    </aside>

    <!-- Main -->
    <main class="flex-1 min-w-0">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { categories } from '~/data/tools'
import * as icons from 'lucide-vue-next'

const openCats = ref(new Set(categories.map(c => c.id)))
const searchQuery = ref('')

function toggleCategory(id: string) {
  const next = new Set(openCats.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  openCats.value = next
}

const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return categories
  return categories
    .map(cat => ({
      ...cat,
      tools: cat.tools.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q),
      ),
    }))
    .filter(c => c.tools.length > 0)
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
