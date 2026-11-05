<template>
  <ToolLayout
    v-if="toolInfo"
    :category-name="toolInfo.category.name"
    :tool-name="toolInfo.tool.name"
    :description="toolInfo.tool.desc"
    :icon="toolInfo.tool.icon"
  >
    <div v-if="loading" class="py-12 text-center text-slate-400">{{ $t('common.loading') }}</div>
    <div v-else-if="comp" class="tool-content">
      <component :is="comp" />
    </div>
    <Placeholder v-else :tool="toolInfo.tool" />
  </ToolLayout>
  <NuxtLink v-else to="/" class="block p-8 text-center text-indigo-600">
    {{ $t('common.toolNotFound') }} - {{ $t('common.backHome') }}
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { findTool, loadToolComponent, getSeoKeywords } from '~/data/tools'

const route = useRoute()
const { locale, locales } = useI18n()

// slug 处理:URL 可能是 /tools/dev/json-formatter 或 /en/tools/dev/json-formatter
// prefix_except_default 策略下,默认语言无前缀
const slug = computed(() => route.params.slug as string[] | undefined)

// 从 slug 中提取 categoryId 和 toolId
const parsedIds = computed(() => {
  if (!slug.value || slug.value.length < 2) return null
  const codes = (locales.value as { code: string }[]).map(l => l.code)
  const first = slug.value[0]!
  if (codes.includes(first)) {
    return { categoryId: slug.value[1]!, toolId: slug.value[2]! }
  }
  return { categoryId: slug.value[0]!, toolId: slug.value[1]! }
})

// 使用 t 函数(不是 t.value)
const toolInfo = computed(() => {
  if (!parsedIds.value) return null
  const { toolId } = parsedIds.value
  return findTool(toolId, locale.value)
})

const loading = ref(false)
const comp = ref<any>(null)

async function load() {
  comp.value = null
  if (!toolInfo.value) return
  loading.value = true
  try {
    const c = await loadToolComponent(toolInfo.value.category.id, toolInfo.value.tool.id)
    comp.value = c
  } catch {
    comp.value = null
  } finally {
    loading.value = false
  }
}

watch(() => route.fullPath, load, { immediate: true })

// ============ 多语言动态 SEO(全部用 computed,在顶层传给 useSeoMeta/useHead) ============
const siteUrl = 'https://qiuyun.tools'
const isZhCN = computed(() => locale.value === 'zh-CN')

const toolBasePath = computed(() => toolInfo.value?.tool.route ?? '/')

const currentToolUrl = computed(() => {
  if (locale.value === 'zh-CN') return `${siteUrl}${toolBasePath.value}`
  return `${siteUrl}/${locale.value}${toolBasePath.value}`
})

function getToolUrlForLocale(target: string) {
  if (target === 'zh-CN') return `${siteUrl}${toolBasePath.value}`
  return `${siteUrl}/${target}${toolBasePath.value}`
}

const alternatesMap = computed(() => {
  if (!toolInfo.value) return {} as Record<string, string>
  const result: Record<string, string> = {}
  // 硬编码 locale 列表,SSR 阶段就能拿到值(不依赖 useI18n locales ref)
  const allLocales = [{ code: 'zh-CN' }, { code: 'en' }]
  for (const loc of allLocales) {
    result[loc.code] = getToolUrlForLocale(loc.code)
    if (loc.code === 'zh-CN') result['x-default'] = result[loc.code]
  }
  return result
})

const seoTitle = computed(() => toolInfo.value?.tool.name ?? '')
const seoKeywords = computed(() => {
  if (!toolInfo.value || !parsedIds.value) return ''
  const categoryId = parsedIds.value.categoryId
  const toolId = toolInfo.value.tool.id
  return getSeoKeywords(categoryId, toolId, locale.value) || toolInfo.value.tool.name
})
const seoDescription = computed(() => {
  if (!toolInfo.value) return ''
  const { tool, category } = toolInfo.value
  if (isZhCN.value) {
    return `${tool.name} - ${tool.desc}。${category.name}分类下的在线工具,纯前端运行,数据不上传更安全,免费使用无需注册。`
  }
  return `${tool.name} - ${tool.desc}. An online tool in the ${category.name} category. Runs purely in your browser, no data upload, free to use.`
})
const ogTitle = computed(() => {
  if (!toolInfo.value) return ''
  const { tool, category } = toolInfo.value
  return isZhCN.value
    ? `${tool.name} - ${category.name} | 秋雨工具`
    : `${tool.name} - ${category.name} | Qiuyun Tools`
})
const ogDescription = computed(() => toolInfo.value?.tool.desc ?? '')
const ogLocale = computed(() => (isZhCN.value ? 'zh_CN' : 'en_US'))
const jsonLdLanguage = computed(() => (isZhCN.value ? 'zh-CN' : 'en-US'))
const jsonLdCurrency = computed(() => (isZhCN.value ? 'CNY' : 'USD'))

const jsonLdScript = computed(() => {
  if (!toolInfo.value) return ''
  const { tool, category } = toolInfo.value
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.desc,
    url: currentToolUrl.value,
    inLanguage: jsonLdLanguage.value,
    category: category.name,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: jsonLdCurrency.value },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '1000' },
  })
})

const alternateLinks = computed(() =>
  Object.entries(alternatesMap.value).map(([lang, url]) => ({
    rel: 'alternate',
    hreflang: lang,
    href: url,
  }))
)

// 把所有 link 合并成一个 computed,传给 useHead 让它自动响应式更新
const allHeadLinks = computed(() => {
  const links: any[] = []
  if (currentToolUrl.value) {
    links.push({ rel: 'canonical', href: currentToolUrl.value })
  }
  for (const [lang, url] of Object.entries(alternatesMap.value)) {
    links.push({ rel: 'alternate', hreflang: lang, href: url })
  }
  return links
})

const allHeadMeta = computed(() => {
  const metas: any[] = []
  if (seoKeywords.value) {
    metas.push({ name: 'keywords', content: seoKeywords.value })
  }
  return metas
})

// ============ SEO 立即求值(确保 SSR 阶段正确生成) ============
// computed 是 lazy 的,useSeoMeta/useHead 不一定会触发它们。
// 在 setup 顶层立即访问 .value 确保求值,然后传普通对象。
const _title = seoTitle.value
const _description = seoDescription.value
const _keywords = seoKeywords.value
const _ogTitle = ogTitle.value
const _ogDescription = ogDescription.value
const _ogUrl = currentToolUrl.value
const _ogLocale = ogLocale.value
const _canonical = currentToolUrl.value
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
    // 百度/搜狗还会看 keywords
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
</script>

<style scoped>
.tool-content {
  animation: fadeIn 0.25s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
