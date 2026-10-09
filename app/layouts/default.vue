<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'border-r border-slate-200 bg-white h-screen sticky top-0 flex flex-col transition-all duration-300 ease-out',
        collapsed ? 'w-16 shrink-0' : 'w-64 shrink-0',
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center gap-2.5 px-4 border-b border-slate-100 shrink-0">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm">
          <component :is="icons.Wrench" class="w-4.5 h-4.5 text-white" />
        </div>
        <div v-if="!collapsed" class="min-w-0 leading-tight">
          <div class="font-semibold text-slate-800 text-[15px]">工具集</div>
          <div class="text-[11px] text-slate-400 truncate">纯前端开发者工具箱</div>
        </div>
      </div>

      <!-- Search -->
      <div v-if="!collapsed" class="px-3 py-3 shrink-0">
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
      <nav class="flex-1 px-2 pb-3 overflow-y-auto space-y-0.5">
        <template v-for="cat in filteredCategories" :key="cat.id">
          <button
            @click="toggleCategory(cat.id)"
            :title="collapsed ? cat.name : undefined"
            class="w-full flex items-center gap-2 px-2.5 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition"
            :class="collapsed ? 'justify-center' : ''"
          >
            <component :is="icons[cat.icon]" class="w-4 h-4 text-slate-500 shrink-0" />
            <span v-if="!collapsed" class="flex-1 text-left">{{ cat.name }}</span>
            <component
              v-if="!collapsed"
              :is="openCats.has(cat.id) ? icons.ChevronDown : icons.ChevronRight"
              class="w-4 h-4 text-slate-400"
            />
          </button>
          <Transition name="slide">
            <div v-if="!collapsed && openCats.has(cat.id)" class="ml-3 space-y-0.5 border-l border-slate-100 pl-2.5">
              <NuxtLink
                v-for="tool in cat.tools"
                :key="tool.id"
                :to="tool.route"
                class="group relative flex items-center gap-2 px-2.5 py-1.5 text-sm text-slate-600 rounded-md hover:bg-slate-100 hover:text-indigo-600 transition"
                active-class="bg-indigo-50 text-indigo-600 font-medium before:content-[''] before:absolute before:-left-2.5 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4 before:bg-indigo-500 before:rounded-full"
              >
                <component :is="icons[tool.icon]" class="w-3.5 h-3.5 opacity-70 shrink-0" />
                {{ tool.name }}
              </NuxtLink>
            </div>
          </Transition>
        </template>
      </nav>

      <!-- Collapse toggle -->
      <div class="border-t border-slate-100 px-2 py-2 shrink-0">
        <button
          @click="collapsed = !collapsed"
          class="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-400 hover:text-indigo-500 hover:bg-slate-50 rounded-md transition"
        >
          <component :is="collapsed ? icons.ChevronRight : icons.ChevronLeft" class="w-4 h-4" />
          <span v-if="!collapsed">收起侧边栏</span>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 min-w-0 flex flex-col">
      <main class="flex-1">
        <slot />
      </main>
      <footer class="border-t border-slate-200 bg-white/60 backdrop-blur-sm">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-slate-400">
          <span>© {{ new Date().getFullYear() }} 工具集 · 纯前端实现 · 数据不离开浏览器</span>
          <span class="flex items-center gap-2">
            <component :is="icons.Shield" class="w-3.5 h-3.5" />
            本地安全处理
          </span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { categories } from '~/data/tools'
import * as icons from 'lucide-vue-next'

const openCats = ref(new Set(categories.map(c => c.id)))
const searchQuery = ref('')
const collapsed = ref(false)

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
