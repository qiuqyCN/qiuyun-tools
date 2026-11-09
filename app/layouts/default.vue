<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'relative border-r border-slate-200 bg-white h-screen sticky top-0 flex flex-col transition-all duration-300 ease-out',
        collapsed ? 'w-16 shrink-0' : 'w-64 shrink-0',
      ]"
    >
      <!-- Logo + Home -->
      <NuxtLink :to="homeRoute" class="h-16 flex items-center gap-2.5 px-4 border-b border-slate-100 shrink-0 hover:bg-slate-50 transition cursor-pointer group">
        <img src="/favicon.png" alt="logo" class="w-9 h-9 rounded-xl shrink-0 shadow-sm object-contain" />
        <div v-if="!collapsed" class="min-w-0 leading-tight">
          <div class="font-semibold text-slate-800 text-[15px] group-hover:text-indigo-600 transition">{{ $t('site.name') }}</div>
          <div class="text-[11px] text-slate-400 truncate">{{ $t('site.tagline') }}</div>
        </div>
      </NuxtLink>

      <!-- Search -->
      <div v-if="!collapsed" class="px-3 py-3 shrink-0">
        <div class="relative">
          <component
            :is="icons.Search"
            class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            v-model="searchQuery"
            :placeholder="$t('common.searchPlaceholder')"
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
                :to="resolveToolRoute(tool.route)"
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

      <!-- Collapse button: floating circle at bottom -->
      <button
        @click="collapsed = !collapsed"
        class="absolute -right-3 bottom-6 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-300 hover:shadow transition z-10"
        :title="collapsed ? $t('common.expandSidebar') : $t('common.collapseSidebar')"
      >
        <component :is="collapsed ? icons.ChevronRight : icons.ChevronLeft" class="w-3.5 h-3.5" />
      </button>
    </aside>

    <!-- Main -->
    <div class="flex-1 min-w-0 flex flex-col">
      <!-- 语言提示条：仅根路径、客户端挂载后、浏览器语言非中文且未关闭时出现（不参与 SSR） -->
      <ClientOnly>
        <div
          v-if="hint"
          class="border-b border-amber-200 bg-amber-50 px-4 py-2 flex items-center gap-3 text-xs text-amber-800"
        >
          <component :is="icons.Globe" class="w-3.5 h-3.5 shrink-0" />
          <span class="flex-1 min-w-0">{{ hint.text.message }}</span>
          <NuxtLink
            :to="hint.path"
            class="px-2.5 py-1 rounded-md bg-amber-500 text-white font-medium hover:bg-amber-600 transition shrink-0"
          >
            {{ hint.text.action }}
          </NuxtLink>
          <button
            type="button"
            class="p-1 rounded hover:bg-amber-100 shrink-0"
            :aria-label="hint.text.close"
            @click="dismissLangHint"
          >
            <component :is="icons.X" class="w-3.5 h-3.5" />
          </button>
        </div>
      </ClientOnly>

      <!-- Top bar: GitHub + Language -->
      <header class="h-12 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
        <div class="text-xs text-slate-400">
          <slot name="breadcrumb" />
        </div>
        <div class="flex items-center gap-1">
          <!-- GitHub -->
          <a
            href="https://github.com/qiuqyCN/qiuyun-tools"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
            :title="$t('common.githubRepo')"
          >
            <component :is="icons.Github" class="w-4 h-4" />
            <span class="hidden sm:inline">GitHub</span>
          </a>

          <!-- Language Switcher -->
          <LanguageSwitcher />
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-auto">
        <slot />
      </main>

      <footer class="border-t border-slate-200 bg-white/60 backdrop-blur-sm">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-slate-400">
          <span>© {{ new Date().getFullYear() }} {{ $t('site.name') }}</span>
          <span class="flex items-center gap-2">
            <component :is="icons.Shield" class="w-3.5 h-3.5" />
            {{ $t('common.localProcessing') }}
          </span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { buildLocalePath } from '#shared/locales'
import { LANG_HINT_TEXT, detectHintLocale } from '#shared/lang-hint'
import * as icons from 'lucide-vue-next'

// 统一多语言 SEO(必须在最前面,确保 SSR 阶段立即求值)
useSiteSeo()

const { locale } = useI18n()
const route = useRoute()

// ============ 根路径语言提示条（仅客户端） ============
const LANG_HINT_KEY = 'qiuyun:lang-hint-dismissed'
const LANG_HINT_TTL = 30 * 24 * 60 * 60 * 1000 // 30 天
const hint = ref<{ path: string; text: { message: string; action: string; close: string } } | null>(null)

onMounted(() => {
  // 只在根路径提示（根路径永远渲染中文，不会自动跳转）
  if (route.path !== '/') return
  try {
    const dismissedAt = Number(localStorage.getItem(LANG_HINT_KEY) || 0)
    if (dismissedAt && Date.now() - dismissedAt < LANG_HINT_TTL) return
  } catch {}
  const code = detectHintLocale(navigator.language)
  if (!code || !LANG_HINT_TEXT[code]) return
  hint.value = { path: buildLocalePath(code, '/'), text: LANG_HINT_TEXT[code]! }
})

function dismissLangHint() {
  try {
    localStorage.setItem(LANG_HINT_KEY, String(Date.now()))
  } catch {}
  hint.value = null
}

const openCats = ref(new Set<string>())
const searchQuery = ref('')
const collapsed = ref(false)

// 带多语言文案的分类
const { categories } = useToolCatalog()

// 初始化展开所有分类
watch(categories, (cats) => {
  if (openCats.value.size === 0 && cats.length > 0) {
    openCats.value = new Set(cats.map(c => c.id))
  }
}, { immediate: true })

// 首页路由(带语言前缀)
const homeRoute = computed(() => buildLocalePath(locale.value, '/'))

// 工具路由(带语言前缀)
function resolveToolRoute(route: string) {
  return buildLocalePath(locale.value, route)
}

function toggleCategory(id: string) {
  const next = new Set(openCats.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  openCats.value = next
}

const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return categories.value
  return categories.value
    .map(cat => ({
      ...cat,
      tools: cat.tools.filter(
        tool =>
          tool.name.toLowerCase().includes(q) ||
          tool.desc.toLowerCase().includes(q),
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
