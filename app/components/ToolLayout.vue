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
import { computed, watch } from 'vue'
import * as icons from 'lucide-vue-next'
import { findTool, getSeoKeywords } from '~/data/tools'

const props = defineProps<{
  categoryName: string
  toolName: string
  description?: string
  icon: string
}>()

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()

const siteUrl = 'https://qiuyun.tools'
const allLocales = [
  { code: 'zh-CN', iso: 'zh-CN', ogLocale: 'zh_CN', jsonLdLang: 'zh-CN' },
  { code: 'en', iso: 'en-US', ogLocale: 'en_US', jsonLdLang: 'en-US' },
]

// ============ 从 route path 解析 categoryId 和 toolId ============
// 路由格式:/tools/{categoryId}/{toolId} 或 /en/tools/{categoryId}/{toolId}
const pathSegments = computed(() => {
  // 去掉开头的 / 和结尾的 query/hash
  const path = route.path.split('?')[0].split('#')[0]
  return path.split('/').filter(Boolean)
})

const parsedIds = computed(() => {
  const segs = pathSegments.value
  // 可能的格式:
  // ['tools', 'dev', 'json-formatter']
  // ['en', 'tools', 'dev', 'json-formatter']
  const toolsIdx = segs.indexOf('tools')
  if (toolsIdx === -1 || segs.length < toolsIdx + 3) return null
  return {
    categoryId: segs[toolsIdx + 1]!,
    toolId: segs[toolsIdx + 2]!,
  }
})

// ============ 工具基础信息(从 baseCategories 查找,用于构建 URL) ============
const toolBaseInfo = computed(() => {
  if (!parsedIds.value) return null
  const { categoryId, toolId } = parsedIds.value
  return findTool(toolId, locale.value)
})

// ============ 多语言 SEO URL 构建 ============
function buildToolUrl(localeCode: string): string {
  if (!parsedIds.value) return siteUrl
  const { categoryId, toolId } = parsedIds.value
  const toolPath = `/tools/${categoryId}/${toolId}`
  if (localeCode === 'zh-CN') return `${siteUrl}${toolPath}`
  return `${siteUrl}/${localeCode}${toolPath}`
}

const currentUrl = computed(() => buildToolUrl(locale.value))

const alternatesMap = computed(() => {
  if (!parsedIds.value) return {} as Record<string, string>
  const result: Record<string, string> = {}
  for (const loc of allLocales) {
    result[loc.code] = buildToolUrl(loc.code)
    if (loc.code === 'zh-CN') result['x-default'] = result[loc.code]
  }
  return result
})

// ============ SEO 内容 ============
const isZhCN = computed(() => locale.value === 'zh-CN')

const seoTitle = computed(() => {
  if (!toolBaseInfo.value) return props.toolName
  const { tool, category } = toolBaseInfo.value
  if (isZhCN.value) {
    return `${tool.name} - ${category.name}`
  }
  return `${tool.name} - ${category.name}`
})

const seoDescription = computed(() => {
  if (!toolBaseInfo.value) return props.description ?? ''
  const { tool, category } = toolBaseInfo.value
  if (isZhCN.value) {
    return `${tool.name} - ${tool.desc}。${category.name}分类下的在线工具,纯前端运行,数据不上传更安全,免费使用无需注册。`
  }
  return `${tool.name} - ${tool.desc}. An online tool in the ${category.name} category. Runs purely in your browser, no data upload, free to use.`
})

const seoKeywords = computed(() => {
  if (!parsedIds.value) return ''
  const { categoryId, toolId } = parsedIds.value
  return getSeoKeywords(categoryId, toolId, locale.value) || props.toolName
})

const ogTitle = computed(() => {
  if (!toolBaseInfo.value) return props.toolName
  const { tool, category } = toolBaseInfo.value
  const siteName = isZhCN.value ? '秋雨工具' : 'Qiuyun Tools'
  return `${tool.name} - ${category.name} | ${siteName}`
})

const ogLocaleCode = computed(() => {
  const found = allLocales.find(l => l.code === locale.value)
  return found?.ogLocale ?? 'zh_CN'
})

const jsonLdLanguage = computed(() => {
  const found = allLocales.find(l => l.code === locale.value)
  return found?.jsonLdLang ?? 'zh-CN'
})

const jsonLdScript = computed(() => {
  if (!toolBaseInfo.value) return ''
  const { tool, category } = toolBaseInfo.value
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.desc,
    url: currentUrl.value,
    inLanguage: jsonLdLanguage.value,
    category: category.name,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: isZhCN.value ? 'CNY' : 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '1000' },
  })
})

// ============ SEO 立即求值 + useSeoMeta/useHead ============
// 在 setup 顶层立即访问 .value,确保 SSR 阶段 computed 被求值
const _title = seoTitle.value
const _description = seoDescription.value
const _keywords = seoKeywords.value
const _ogTitle = ogTitle.value
const _ogDescription = props.description ?? ''
const _ogUrl = currentUrl.value
const _ogLocale = ogLocaleCode.value
const _canonical = currentUrl.value
const _alternates = Object.entries(alternatesMap.value).map(([lang, url]) => ({
  rel: 'alternate' as const,
  hreflang: lang,
  href: url,
}))
const _jsonLd = jsonLdScript.value

useSeoMeta({
  title: _title,
  description: _description,
  ogTitle: _ogTitle,
  ogDescription: _ogDescription,
  ogImage: `${siteUrl}/favicon.png`,
  ogUrl: _ogUrl,
  ogLocale: _ogLocale,
  ogType: 'website',
  twitterTitle: _ogTitle,
  twitterDescription: _ogDescription,
  twitterImage: `${siteUrl}/favicon.png`,
})

useHead({
  meta: [
    ...(_keywords ? [{ name: 'keywords', content: _keywords }] : []),
  ],
  link: [
    { rel: 'canonical', href: _canonical },
    ..._alternates,
  ],
  ...(_jsonLd ? {
    script: [{
      type: 'application/ld+json',
      innerHTML: _jsonLd,
    }],
  } : {}),
})

// 确保语言切换/路由变化时 SEO 更新(客户端)
watch(
  () => [route.fullPath, locale.value],
  () => {
    // 重新触发 SEO — 通过重新立即求值
    useSeoMeta({
      title: seoTitle.value,
      description: seoDescription.value,
      ogTitle: ogTitle.value,
      ogDescription: props.description ?? '',
      ogUrl: currentUrl.value,
      ogLocale: ogLocaleCode.value,
    })
  }
)

// ============ 面包屑返回 ============
const goBack = () => {
  if (window.history.length > 1 && document.referrer) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
