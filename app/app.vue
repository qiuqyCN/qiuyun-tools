<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// 在 app 顶层设置 html lang,确保不被 @nuxtjs/i18n 等模块覆盖
const { locale } = useI18n()

const allLocales: Record<string, string> = {
  'zh-CN': 'zh-CN',
  en: 'en-US',
}

// 立即求值 + 设置
const _iso = allLocales[locale.value] ?? 'zh-CN'
useHead({
  htmlAttrs: { lang: _iso },
}, { mode: 'server' })
</script>
