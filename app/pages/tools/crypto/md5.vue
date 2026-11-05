<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">MD5 加密</h3>
      <span class="text-xs text-slate-400">对文本生成 32/16 位 MD5 哈希</span>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 items-stretch">
      <!-- 输入 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">明文输入</span>
          <button @click="input = example" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
        </div>
        <textarea
          v-model="input"
          placeholder="输入要加密的文本..."
          class="w-full h-[260px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="flex lg:flex-col items-center justify-center gap-2 shrink-0">
        <CopyButton :text="result" label="复制结果" />
        <button
          @click="input = ''"
          class="h-8 px-3 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >清空</button>
      </div>

      <!-- 输出 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">加密结果</span>
        </div>
        <template v-if="result">
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
              <div class="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all">{{ result.substring(8, 24) }}</div>
            </div>
          </div>
        </template>
        <div
          v-else
          class="w-full flex-1 min-h-[200px] flex flex-col items-center justify-center gap-2 text-xs text-slate-400"
        >
          <component :is="icons.Hash" class="w-8 h-8 text-slate-300" />
          <span>在左侧输入文本，结果将实时生成</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import SparkMD5 from 'spark-md5'

const input = ref('')

const example = `Hello, Qiuyun Tools!\n这是一段用于测试 MD5 加密的示例文本。`

const result = computed(() => {
  if (!input.value) return ''
  return SparkMD5.hash(input.value)
})
</script>
