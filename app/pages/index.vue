<template>
  <div class="max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-10">
    <!-- Hero -->
    <header class="mb-10 flex items-center gap-5">
      <img src="/favicon.png" alt="logo" class="w-14 h-14 rounded-2xl shadow-sm object-contain" />
      <div>
        <h1 class="text-3xl font-bold text-slate-800 mb-1">开发者工具箱</h1>
        <p class="text-slate-500">一站式开发者工具箱</p>
      </div>
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

const totalTools = computed(() => categories.reduce((s, c) => s + c.tools.length, 0))

// ============ SEO ============
const siteUrl = 'https://qiuyun.tools'
const toolKeywords = computed(() => {
  const allTools = categories.flatMap(c => c.tools.map(t => t.name))
  const allCategories = categories.map(c => c.name)
  return allTools.concat(allCategories).join('、')
})

useSeoMeta({
  title: '免费在线开发者工具箱',
  description: `免费在线开发者工具箱,包含${totalTools.value}+实用工具:JSON格式化、加密工具、图片压缩、代码美化、前端CSS生成器、PDF处理、Markdown编辑、日期计算等。所有工具纯前端运行,数据不上传更安全,无需注册即可使用。`,
  keywords: `开发者工具,在线工具,JSON格式化,Base64编码,MD5加密,正则测试,时间戳转换,Cron生成,颜色选择器,二维码生成,图片压缩,PDF合并,Markdown编辑器,BMI计算器,房贷计算器,${toolKeywords.value}`,
  ogTitle: '秋雨工具 - 一站式免费开发者工具箱',
  ogDescription: `60+在线免费工具,覆盖开发、加密、文本、图片、前端、文档、生活等场景,纯前端运行更安全。`,
  ogImage: `${siteUrl}/favicon.png`,
  ogUrl: siteUrl,
  ogType: 'website',
  twitterTitle: '秋雨工具 - 一站式免费开发者工具箱',
  twitterDescription: '60+在线免费工具,覆盖开发、加密、文本、图片、前端、文档、生活等场景,纯前端运行更安全。',
  twitterImage: `${siteUrl}/favicon.png`,
})

useHead({
  link: [
    { rel: 'canonical', href: siteUrl },
  ],
})
</script>
