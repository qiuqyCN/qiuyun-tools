<template>
  <GuideList />
</template>

<script setup lang="ts">
import GuideList from '~/components/GuideList.vue'

const { locale } = useI18n()

useSeoMeta({
  title: locale.value.startsWith('zh') ? '开发者指南' : 'Developer Guide',
  description: locale.value.startsWith('zh')
    ? '精选开发者专题文章——编码原理、正则调试、时间戳时区、图片压缩、颜色对比度……每篇都带可直接使用的在线工具。'
    : 'Hand-picked developer articles on encoding fundamentals, regex debugging, timestamps, image compression, color contrast — each links to a working online tool.',
})
</script>
