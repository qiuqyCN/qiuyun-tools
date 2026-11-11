<template>
  <article class="max-w-3xl mx-auto px-6 lg:px-8 py-8 lg:py-10">
    <!-- 面包屑 + 返回 -->
    <nav class="flex items-center gap-1.5 text-sm text-slate-500 mb-5">
      <NuxtLink :to="homeRoute" class="hover:text-indigo-500 transition">{{ $t('common.home') }}</NuxtLink>
      <component :is="icons.ChevronRight" class="w-3 h-3 text-slate-300" />
      <NuxtLink :to="listRoute" class="hover:text-indigo-500 transition">{{ listLabel }}</NuxtLink>
      <component :is="icons.ChevronRight" class="w-3 h-3 text-slate-300" />
      <span class="text-slate-700 font-medium truncate">{{ meta.title }}</span>
    </nav>

    <!-- 标题区 -->
    <header class="mb-8 pb-6 border-b border-slate-100">
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <span
          v-for="tag in article.tags"
          :key="tag"
          class="px-2.5 py-0.5 text-[11px] rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium"
        >{{ tag }}</span>
      </div>
      <h1 class="text-2xl lg:text-3xl font-bold text-slate-800 leading-tight mb-3">{{ meta.title }}</h1>
      <p class="text-slate-500 text-sm leading-relaxed">{{ meta.excerpt }}</p>
      <div class="mt-3 flex items-center gap-3 text-xs text-slate-400">
        <component :is="icons.CalendarDays" class="w-3.5 h-3.5" />
        <time :datetime="article.date">{{ formatDate(article.date) }}</time>
      </div>
    </header>

    <!-- 正文 -->
    <div class="prose-guide space-y-8">
      <template v-for="(section, i) in meta.body" :key="i">
        <!-- 小节标题 -->
        <h2 v-if="section.heading" class="text-lg font-semibold text-slate-800 flex items-center gap-2 group">
          <span class="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full shrink-0" />
          {{ section.heading }}
        </h2>

        <!-- 段落 -->
        <p
          v-for="(p, j) in section.paragraphs"
          :key="'p-' + j"
          class="text-sm leading-[1.9] text-slate-600"
        >{{ p }}</p>

        <!-- 代码块 -->
        <div
          v-for="(block, j) in section.code"
          :key="'code-' + j"
          class="rounded-xl overflow-hidden border border-slate-100 bg-slate-900"
        >
          <div class="flex items-center justify-between px-3 py-1.5 text-[11px] text-slate-400 bg-slate-800/80">
            <span class="font-mono">{{ block.lang }}</span>
          </div>
          <pre class="p-4 overflow-auto text-xs font-mono text-slate-200 leading-relaxed"><code>{{ block.code }}</code></pre>
        </div>

        <!-- tips 提示 -->
        <div
          v-for="(t, j) in section.tips"
          :key="'tip-' + j"
          class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 leading-relaxed"
        >{{ t }}</div>

        <!-- 对比表 -->
        <div
          v-for="(c, j) in section.compare"
          :key="'cmp-' + j"
          class="grid sm:grid-cols-2 gap-3"
        >
          <div class="rounded-xl p-4 bg-slate-50 border border-slate-100">
            <div class="text-[11px] font-semibold text-indigo-600 mb-1 uppercase tracking-wider">{{ c.left }}</div>
            <div class="text-sm text-slate-600 leading-relaxed">{{ c.right }}</div>
          </div>
        </div>
      </template>
    </div>

    <!-- 关联工具 -->
    <section v-if="linkedTools.length > 0" class="mt-12 pt-8 border-t border-slate-100">
      <h3 class="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <component :is="icons.Wrench" class="w-4 h-4 text-indigo-500" />
        {{ relatedLabel }}
      </h3>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <NuxtLink
          v-for="item in linkedTools"
          :key="item.route"
          :to="buildLocalePath(locale, item.route)"
          class="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/50 transition group"
        >
          <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm">
            <component :is="icons[item.icon]" class="w-4 h-4 text-white" />
          </div>
          <div class="min-w-0">
            <div class="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition truncate">{{ item.name }}</div>
            <div class="text-xs text-slate-400 truncate">{{ item.desc }}</div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- JSON-LD Article schema：用 useHead 注入，避免 Vue 对 innerHTML 做 HTML 转义 -->
  </article>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { buildLocalePath, buildAbsoluteUrl } from '#shared/locales'
import { getBaseToolById } from '~/data/tools'
import { getGuideMeta, type GuideArticle } from '~/data/guide'

const props = defineProps<{
  article: GuideArticle
}>()

const { locale, t } = useI18n()
const homeRoute = computed(() => buildLocalePath(locale.value, '/'))
const listRoute = computed(() => buildLocalePath(locale.value, '/guide'))

// 模板里要用的 import.meta.server → script setup 里定义变量
const isServer = import.meta.server

const listLabel = computed(() => (locale.value.startsWith('zh') ? '开发者指南' : 'Developer Guide'))
const relatedLabel = computed(() => (locale.value.startsWith('zh') ? '试试相关工具' : 'Try the related tools'))

const meta = computed(() => getGuideMeta(props.article, locale.value))

function formatDate(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const zh = locale.value.startsWith('zh')
  if (zh) return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// ============ 关联工具卡片 ============
const linkedTools = computed(() => {
  if (!props.article.toolKeys?.length) return []
  return props.article.toolKeys
    .map(key => {
      const [catId, toolId] = key.split('/')
      if (!catId || !toolId) return null
      const base = getBaseToolById(toolId)
      if (!base || base.category.id !== catId) return null
      const fullKey = `${catId}/${toolId}`
      return {
        route: base.tool.route,
        icon: base.tool.icon,
        name: t(`tools.${fullKey}.name`),
        desc: t(`tools.${fullKey}.desc`),
      }
    })
    .filter((x): x is NonNullable<typeof x> => !!x)
})

// ============ Article JSON-LD ============
const articleJsonLd = computed(() => {
  const a = props.article
  const m = meta.value
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: m.title,
    description: m.description,
    datePublished: a.date,
    dateModified: a.date,
    author: {
      '@type': 'Organization',
      name: locale.value.startsWith('zh') ? '秋云工具' : 'Qiuyun Tools',
    },
    publisher: {
      '@type': 'Organization',
      name: locale.value.startsWith('zh') ? '秋云工具' : 'Qiuyun Tools',
      url: buildAbsoluteUrl(locale.value, '/'),
    },
    url: buildAbsoluteUrl(locale.value, `/guide/${a.slug}`),
    articleSection: 'Developer Guide',
    keywords: a.tags.join(', '),
  })
})

// ============ 用 useHead 注入 Article JSON-LD ============
// 必须在 script setup 顶层立即求值，SSR 阶段把 <script type="application/ld+json"> 输出到 HTML
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: articleJsonLd,
    },
  ],
})
</script>
