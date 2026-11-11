<template>
  <div class="max-w-5xl mx-auto px-6 lg:px-8 py-10 lg:py-14">
    <nav class="flex items-center gap-1.5 text-sm text-slate-500 mb-5">
      <NuxtLink :to="homeRoute" class="hover:text-indigo-500 transition">{{ $t('common.home') }}</NuxtLink>
      <component :is="icons.ChevronRight" class="w-3 h-3 text-slate-300" />
      <span class="text-slate-700 font-medium">{{ title }}</span>
    </nav>

    <header class="mb-10">
      <h1 class="text-2xl lg:text-3xl font-bold text-slate-800 mb-3 flex items-center gap-2">
        <component :is="icons.GraduationCap" class="w-7 h-7 text-indigo-500" />
        {{ title }}
      </h1>
      <p class="text-slate-500 text-sm leading-relaxed max-w-2xl">{{ subtitle }}</p>
    </header>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <NuxtLink
        v-for="article in articles"
        :key="article.slug"
        :to="buildLocalePath(locale, `/guide/${article.slug}`)"
        class="group block rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
      >
        <div class="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 opacity-80" />
        <div class="p-5">
          <div class="flex flex-wrap items-center gap-1.5 mb-3">
            <span
              v-for="tag in article.tags.slice(0, 3)"
              :key="tag"
              class="px-2 py-0.5 text-[10px] rounded-full bg-indigo-50 text-indigo-600 font-medium"
            >{{ tag }}</span>
          </div>
          <h2 class="text-base font-semibold text-slate-800 mb-2 leading-snug group-hover:text-indigo-600 transition">
            {{ getMeta(article).title }}
          </h2>
          <p class="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
            {{ getMeta(article).description }}
          </p>
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span class="flex items-center gap-1">
              <component :is="icons.CalendarDays" class="w-3 h-3" />
              {{ formatDate(article.date) }}
            </span>
            <span class="flex items-center gap-1 text-indigo-500 opacity-0 group-hover:opacity-100 transition">
              {{ readMore }}
              <component :is="icons.ArrowRight" class="w-3 h-3" />
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <footer class="mt-14 text-center text-xs text-slate-400">
      {{ footerNote }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { buildLocalePath } from '#shared/locales'
import { getGuideMeta, guideArticles, type GuideArticle } from '~/data/guide'

const { locale } = useI18n()

const homeRoute = computed(() => buildLocalePath(locale.value, '/'))

const isZh = computed(() => locale.value.startsWith('zh'))
const title = computed(() => (isZh.value ? '开发者指南' : 'Developer Guide'))
const subtitle = computed(() =>
  isZh.value
    ? '精选开发者专题文章——编码原理、正则调试、时间戳时区、图片压缩……从"为什么"到"怎么用"。'
    : 'Hand-picked developer articles — encoding fundamentals, regex debugging, timestamps, image compression... from "why" to "how".',
)
const readMore = computed(() => (isZh.value ? '阅读全文' : 'Read'))
const footerNote = computed(() =>
  isZh.value ? '文章持续更新中 · 每篇都附带可直接使用的在线工具' : 'New articles coming soon · Each one links to a working online tool',
)

const articles = computed(() => guideArticles)

function getMeta(a: GuideArticle) {
  return getGuideMeta(a, locale.value)
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  if (isZh.value) return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
