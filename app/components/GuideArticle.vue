<template>
  <article class="max-w-3xl mx-auto px-6 lg:px-8 py-8 lg:py-10">
    <nav class="flex items-center gap-1.5 text-sm text-slate-500 mb-5">
      <NuxtLink :to="homeRoute" class="hover:text-indigo-500 transition">{{ $t('common.home') }}</NuxtLink>
      <component :is="icons.ChevronRight" class="w-3 h-3 text-slate-300" />
      <NuxtLink :to="listRoute" class="hover:text-indigo-500 transition">{{ listLabel }}</NuxtLink>
      <component :is="icons.ChevronRight" class="w-3 h-3 text-slate-300" />
      <span class="text-slate-700 font-medium truncate">{{ meta.title }}</span>
    </nav>

    <header class="mb-8 pb-6 border-b border-slate-100">
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <span v-for="tag in article.tags" :key="tag"
          class="px-2.5 py-0.5 text-[11px] rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium">
          {{ tag }}
        </span>
      </div>
      <h1 class="text-2xl lg:text-3xl font-bold text-slate-800 leading-tight mb-3">{{ meta.title }}</h1>
      <p class="text-slate-500 text-sm leading-relaxed">{{ meta.excerpt }}</p>
      <div class="mt-3 flex items-center gap-3 text-xs text-slate-400">
        <component :is="icons.CalendarDays" class="w-3.5 h-3.5" />
        <time :datetime="article.date">{{ formatDate(article.date) }}</time>
        <span class="flex items-center gap-1">
          <component :is="icons.Clock" class="w-3.5 h-3.5" />
          {{ readTimeLabel }}
        </span>
      </div>
    </header>

    <!-- TOC -->
    <nav v-if="toc.length" class="mb-8 rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
      <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <component :is="icons.List" class="w-3.5 h-3.5" />
        {{ locale.startsWith('zh') ? '目录' : 'Contents' }}
      </div>
      <ol class="space-y-1">
        <li v-for="t in toc" :key="t.id">
          <a :href="'#' + t.id" class="block text-xs text-slate-600 hover:text-indigo-600 transition py-0.5 truncate">{{ t.heading }}</a>
        </li>
      </ol>
    </nav>

    <div class="prose-guide space-y-8">
      <template v-for="(section, i) in meta.body" :key="i">
        <h2 v-if="section.heading" :id="sectionIds[i]"
          class="text-lg font-semibold text-slate-800 flex items-center gap-2 group scroll-mt-24">
          <span class="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full shrink-0" />
          {{ section.heading }}
          <a :href="'#' + sectionIds[i]" class="opacity-0 group-hover:opacity-60 text-slate-400 hover:text-indigo-500 transition ml-1">
            <component :is="icons.Link" class="w-3.5 h-3.5" />
          </a>
        </h2>

        <p v-for="(p, j) in section.paragraphs" :key="'p-' + j" class="text-sm leading-[1.9] text-slate-600">{{ p }}</p>

        <div v-for="(block, j) in section.code" :key="'code-' + j"
          class="rounded-xl overflow-hidden border border-slate-100 bg-slate-900 relative group">
          <div class="flex items-center justify-between px-3 py-1.5 text-[11px] text-slate-400 bg-slate-800/80">
            <span class="font-mono">{{ block.lang }}</span>
            <button type="button" @click="copyCode(block.code)"
              class="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition">
              <component :is="copiedKey === block.code ? icons.Check : icons.Copy" class="w-3 h-3" />
              <span>{{ copiedKey === block.code ? copyDoneLabel : copyLabel }}</span>
            </button>
          </div>
          <pre class="p-4 overflow-auto text-xs font-mono text-slate-200 leading-relaxed"><code>{{ block.code }}</code></pre>
        </div>

        <div v-for="(t, j) in section.tips" :key="'tip-' + j"
          class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 leading-relaxed">{{ t }}</div>

        <div v-for="(c, j) in section.compare" :key="'cmp-' + j" class="grid sm:grid-cols-2 gap-3">
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
          v-for="item in linkedTools" :key="item.route" :to="buildLocalePath(locale, item.route)"
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

    <!-- 相关推荐 -->
    <section v-if="relatedLinks.length > 0" class="mt-10 pt-8 border-t border-slate-100">
      <h3 class="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <component :is="icons.Sparkles" class="w-4 h-4 text-indigo-500" />
        {{ zh ? '延伸阅读' : 'Keep reading' }}
      </h3>
      <div class="grid sm:grid-cols-3 gap-3">
        <NuxtLink
          v-for="ra in relatedLinks" :key="ra.slug" :to="buildLocalePath(locale, `/guide/${ra.slug}`)"
          class="block p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/50 transition group"
        >
          <div class="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition mb-1.5 leading-snug truncate">{{ ra.title }}</div>
          <div class="text-xs text-slate-400 line-clamp-2">{{ ra.desc }}</div>
        </NuxtLink>
      </div>
    </section>

    <!-- 上一篇 / 下一篇 -->
    <nav v-if="prevLink || nextLink" class="mt-10 pt-8 border-t border-slate-100 grid sm:grid-cols-2 gap-3">
      <NuxtLink
        v-if="prevLink"
        :to="buildLocalePath(locale, `/guide/${prevLink.slug}`)"
        class="p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/50 transition group text-right"
      >
        <div class="text-[11px] text-slate-400 flex items-center justify-end gap-1 mb-1">
          {{ zh ? '更新' : 'Newer' }} <component :is="icons.ArrowRight" class="w-3 h-3" />
        </div>
        <div class="text-sm font-medium text-slate-700 group-hover:text-indigo-600 truncate">{{ prevLink.title }}</div>
      </NuxtLink>
      <NuxtLink
        v-if="nextLink"
        :to="buildLocalePath(locale, `/guide/${nextLink.slug}`)"
        class="p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/50 transition group"
      >
        <div class="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
          <component :is="icons.ArrowLeft" class="w-3 h-3" /> {{ zh ? '更旧' : 'Older' }}
        </div>
        <div class="text-sm font-medium text-slate-700 group-hover:text-indigo-600 truncate">{{ nextLink.title }}</div>
      </NuxtLink>
    </nav>
  </article>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { buildLocalePath, buildAbsoluteUrl } from '#shared/locales'
import { getBaseToolById } from '~/data/tools'
import { getGuideMeta, slugifyHeading, getPrevNext, getRelated, type GuideArticle } from '~/data/guide'

const props = defineProps<{ article: GuideArticle }>()
const { locale, t } = useI18n()
const homeRoute = computed(() => buildLocalePath(locale.value, '/'))
const listRoute = computed(() => buildLocalePath(locale.value, '/guide'))
const zh = computed(() => locale.value.startsWith('zh'))
const listLabel = computed(() => (zh.value ? '开发者指南' : 'Developer Guide'))
const relatedLabel = computed(() => (zh.value ? '试试相关工具' : 'Try the related tools'))
const copyLabel = computed(() => (zh.value ? '复制' : 'Copy'))
const copyDoneLabel = computed(() => (zh.value ? '已复制' : 'Copied'))
const langKey = computed<'zh' | 'en'>(() => zh.value ? 'zh' : 'en')

const meta = computed(() => getGuideMeta(props.article, locale.value))

// ============ TOC ============
const toc = computed(() =>
  meta.value.body
    .map((s, i) => ({ heading: s.heading, id: slugifyHeading(s.heading ?? `section-${i}`), i }))
    .filter(t => !!t.heading) as Array<{ heading: string; id: string; i: number }>,
)
const sectionIds = computed(() => {
  const ids: string[] = []
  const seen = new Map<string, number>()
  meta.value.body.forEach((s, i) => {
    const base = slugifyHeading(s.heading ?? `section-${i}`)
    const n = seen.get(base) ?? 0
    ids.push(n > 0 ? `${base}-${n}` : base)
    seen.set(base, n + 1)
  })
  return ids
})

// ============ 代码块复制 ============
const copiedKey = ref<string | null>(null)
async function copyCode(code: string) {
  try {
    await navigator.clipboard.writeText(code)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = code; document.body.appendChild(ta); ta.select()
    document.execCommand('copy'); document.body.removeChild(ta)
  }
  copiedKey.value = code
  setTimeout(() => { if (copiedKey.value === code) copiedKey.value = null }, 2000)
}

// ============ 阅读时长 ============
function estimateReadTime(article: GuideArticle, locale: string): number {
  const lang: 'zh' | 'en' = locale.startsWith('zh') ? 'zh' : 'en'
  let chars = 0
  article[lang].body.forEach(s => {
    ;(s.paragraphs ?? []).forEach(p => { chars += p.length })
    ;(s.code ?? []).forEach(c => { chars += c.code.length })
    ;(s.tips ?? []).forEach(t => { chars += t.length })
  })
  return Math.max(30, chars / (lang === 'zh' ? 5 : 4))
}
const readTimeLabel = computed(() => {
  const sec = estimateReadTime(props.article, locale.value)
  if (sec < 60) return zh.value ? '约 1 分钟' : '~1 min'
  const m = Math.round(sec / 60)
  return zh.value ? `约 ${m} 分钟` : `~${m} min read`
})

// ============ 相关 + prev/next ============
const relatedLinks = computed(() =>
  getRelated(props.article.slug, 3).map(a => {
    const m = a[langKey.value]
    return { slug: a.slug, title: m.title, desc: m.description }
  }),
)
const prevLink = computed(() => {
  const a = getPrevNext(props.article.slug).prev
  if (!a) return null
  return { slug: a.slug, title: a[langKey.value].title }
})
const nextLink = computed(() => {
  const a = getPrevNext(props.article.slug).next
  if (!a) return null
  return { slug: a.slug, title: a[langKey.value].title }
})

function formatDate(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  if (zh.value) return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

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
    author: { '@type': 'Organization', name: zh.value ? '秋云工具' : 'Qiuyun Tools' },
    publisher: { '@type': 'Organization', name: zh.value ? '秋云工具' : 'Qiuyun Tools', url: buildAbsoluteUrl(locale.value, '/') },
    url: buildAbsoluteUrl(locale.value, `/guide/${a.slug}`),
    articleSection: 'Developer Guide',
    keywords: a.tags.join(', '),
  })
})

const breadcrumbJsonLd = computed(() => {
  const items = [
    { name: zh.value ? '首页' : 'Home', url: buildAbsoluteUrl(locale.value, '/') },
    { name: listLabel.value, url: buildAbsoluteUrl(locale.value, '/guide') },
    { name: meta.value.title, url: buildAbsoluteUrl(locale.value, `/guide/${props.article.slug}`) },
  ]
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  })
})

useHead({
  script: [
    { type: 'application/ld+json', innerHTML: articleJsonLd },
    { type: 'application/ld+json', innerHTML: breadcrumbJsonLd },
  ],
})
</script>
