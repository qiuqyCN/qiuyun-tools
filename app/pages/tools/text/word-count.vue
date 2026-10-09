<template>
  <div class="space-y-5">
    <!-- Input -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <textarea
        v-model="text"
        placeholder="在此粘贴或输入文本..."
        class="w-full h-60 p-4 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
    </section>

    <!-- Stats Grid -->
    <section class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      <StatCard label="总字符" :value="stats.total" />
      <StatCard label="字符（不含空格）" :value="stats.noSpace" />
      <StatCard label="中文字符" :value="stats.chinese" />
      <StatCard label="英文单词" :value="stats.words" />
      <StatCard label="行数" :value="stats.lines" />
      <StatCard label="段落数" :value="stats.paragraphs" />
    </section>
  </div>
</template>

<script setup lang="ts">
import StatCard from '~/components/StatCard.vue'

const text = ref('')

const stats = computed(() => {
  const t = text.value
  return {
    total: t.length,
    noSpace: t.replace(/\s/g, '').length,
    chinese: (t.match(/[\u4e00-\u9fa5]/g) || []).length,
    words: t.trim() ? (t.trim().match(/[a-zA-Z0-9]+/g) || []).length : 0,
    lines: t ? t.split('\n').length : 0,
    paragraphs: t.trim() ? t.split(/\n\s*\n/).filter(p => p.trim()).length : 0,
  }
})
</script>
