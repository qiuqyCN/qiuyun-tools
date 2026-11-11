<template>
  <GuideArticle v-if="article" :article="article" />
  <div v-else class="max-w-xl mx-auto px-6 py-20 text-center">
    <div class="text-slate-400 text-sm mb-4">{{ $t('common.notFound') }}</div>
    <NuxtLink :to="buildLocalePath(locale, '/guide')" class="text-indigo-500 hover:text-indigo-600 text-sm">
      返回指南首页
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import GuideArticle from '~/components/GuideArticle.vue'
import { buildAbsoluteUrl, buildHreflangMap, stripLocalePrefix } from '#shared/locales'
import { getGuideArticle, getGuideMeta } from '~/data/guide'

const route = useRoute()
const { locale } = useI18n()

const slug = computed(() => {
  const clean = stripLocalePrefix(route.path).path
  const m = clean.match(/^\/guide\/([^/]+)$/)
  return m ? m[1]! : null
})

const article = computed(() => (slug.value ? getGuideArticle(slug.value, locale.value) : null))

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Guide article not found', fatal: true })
}

// ============ 文章级 SEO ============
const meta = getGuideMeta(article.value, locale.value)

useSeoMeta({
  title: meta.title,
  description: meta.description,
  ogTitle: meta.title,
  ogDescription: meta.description,
})

const canonicalHref = computed(() => buildAbsoluteUrl(locale.value, `/guide/${slug.value}`))
const alternatesMap = computed(() => buildHreflangMap(`/guide/${slug.value}`))
useHead({
  link: [
    { rel: 'canonical', href: canonicalHref.value },
    ...Object.entries(alternatesMap.value).map(([lang, url]) => ({
      rel: 'alternate' as const,
      hreflang: lang,
      href: url,
    })),
  ],
})
</script>
