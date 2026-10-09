<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">MD5 加密</h3>
        <div class="flex items-center gap-2">
          <CopyButton :text="result" label="复制" />
        </div>
      </div>
      <textarea
        v-model="input"
        placeholder="输入要加密的文本..."
        class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
    </section>
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">加密结果</h3>
      <div class="space-y-3">
        <div>
          <div class="text-xs text-slate-400 mb-1">32 位小写</div>
          <div class="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all">{{ result }}</div>
        </div>
        <div>
          <div class="text-xs text-slate-400 mb-1">32 位大写</div>
          <div class="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all">{{ result.toUpperCase() }}</div>
        </div>
        <div>
          <div class="text-xs text-slate-400 mb-1">16 位小写</div>
          <div class="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all">{{ result ? result.substring(8, 24) : '' }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import SparkMD5 from 'spark-md5'

const input = ref('')
const result = computed(() => {
  if (!input.value) return ''
  return SparkMD5.hash(input.value)
})
</script>
