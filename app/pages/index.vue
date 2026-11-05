<template>
  <div class="max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-10">
    <!-- Hero -->
    <header class="mb-10 flex items-center gap-5">
      <img src="/favicon.png" alt="logo" class="w-14 h-14 rounded-2xl shadow-sm object-contain" />
      <div>
        <h1 class="text-3xl font-bold text-slate-800 mb-1">{{ $t('site.name') }}</h1>
        <p class="text-slate-500">{{ $t('site.tagline') }}</p>
      </div>
    </header>

    <!-- Categories -->
    <section v-for="cat in categories" :key="cat.id" class="mb-10">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
          <component :is="icons[cat.icon]" class="w-4 h-4 text-indigo-600" />
        </div>
        <h2 class="text-lg font-semibold text-slate-700">{{ cat.name }}</h2>
        <span class="text-xs text-slate-400">{{ cat.tools.length }} {{ $t('common.totalTools') }}</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <NuxtLink
          v-for="tool in cat.tools"
          :key="tool.id"
          :to="resolveToolRoute(tool.route)"
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
import { getCategories, baseCategories } from '~/data/tools'
import * as icons from 'lucide-vue-next'

const { t, locale, locales } = useI18n()
const route = useRoute()

// 带多语言文案的分类
const categories = computed(() => getCategories(locale.value))

// 总工具数(不变)
const totalTools = computed(() => baseCategories.reduce((s, c) => s + c.tools.length, 0))

// 带语言前缀的路由
function resolveToolRoute(route: string) {
  if (locale.value === 'zh-CN') return route
  return `/${locale.value}${route}`
}

// ============ 多语言 SEO ============
const siteUrl = 'https://qiuyun.tools'
const isZhCN = computed(() => locale.value === 'zh-CN')

const toolKeywords = computed(() => {
  const list = categories.value.flatMap(c => c.tools.map(tool => tool.name))
  return list.join(isZhCN.value ? '、' : ', ')
})

const seoTitle = computed(() => {
  return isZhCN.value
    ? '免费在线开发者工具箱'
    : 'Free Online Developer Toolbox'
})

const seoDescription = computed(() => {
  if (isZhCN.value) {
    return `免费在线开发者工具箱,包含${totalTools.value}+实用工具:JSON格式化、加密工具、图片压缩、代码美化、前端CSS生成器、PDF处理、Markdown编辑、日期计算等。所有工具纯前端运行,数据不上传更安全,无需注册即可使用。`
  }
  return `Free online developer toolbox with ${totalTools.value}+ tools: JSON formatter, crypto utilities, image compression, code beautifier, frontend CSS generators, PDF tools, Markdown editor, date calculators and more. All tools run purely in your browser, no data upload required.`
})

const seoKeywords = computed(() => {
  if (isZhCN.value) {
    return `开发者工具,在线工具,JSON格式化,Base64编码,MD5加密,正则测试,时间戳转换,Cron生成,颜色选择器,二维码生成,图片压缩,PDF合并,Markdown编辑器,BMI计算器,房贷计算器,${toolKeywords.value}`
  }
  return `developer tools,online tools,JSON formatter,Base64,MD5,regex tester,timestamp converter,Cron generator,color picker,QR code generator,image compressor,PDF merger,Markdown editor,BMI calculator,mortgage calculator,${toolKeywords.value}`
})

const currentUrl = computed(() => {
  // 根据 locale 生成完整 URL
  const path = isZhCN.value ? '/' : `/${locale.value}`
  return `${siteUrl}${path}`
})

// 自动生成 hreflang alternates (SEO 模块会处理 htmlAttrs.lang)
const alternates = computed(() => {
  const result: Record<string, string> = {}
  for (const loc of locales.value) {
    const code = loc.code as string
    const locPath = code === 'zh-CN' ? '/' : `/${code}`
    result[code] = `${siteUrl}${locPath}`
    // x-default 指向默认语言
    if (code === 'zh-CN') {
      result['x-default'] = `${siteUrl}/`
    }
  }
  return result
})

useSeoMeta({
  title: seoTitle.value,
  description: seoDescription.value,
  keywords: seoKeywords.value,
  ogTitle: isZhCN.value ? '秋雨工具 - 一站式免费开发者工具箱' : 'Qiuyun Tools - Free All-in-One Developer Toolbox',
  ogDescription: isZhCN.value
    ? `${totalTools.value}+在线免费工具,覆盖开发、加密、文本、图片、前端、文档、生活等场景,纯前端运行更安全。`
    : `${totalTools.value}+ free online tools for dev, crypto, text, image, frontend, docs, and life. All run locally in your browser.`,
  ogImage: `${siteUrl}/favicon.png`,
  ogUrl: currentUrl.value,
  ogLocale: isZhCN.value ? 'zh_CN' : 'en_US',
  ogType: 'website',
  twitterTitle: isZhCN.value ? '秋雨工具' : 'Qiuyun Tools',
  twitterDescription: seoDescription.value,
  twitterImage: `${siteUrl}/favicon.png`,
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl.value },
    // hreflang alternates - 告诉 Google 每个语言版本的 URL
    ...Object.entries(alternates.value).map(([lang, url]) => ({
      rel: 'alternate',
      hreflang: lang,
      href: url,
    })),
  ],
})
</script>
