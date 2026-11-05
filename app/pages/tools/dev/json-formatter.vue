<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">JSON 格式化 / 压缩</h3>
      <span class="text-xs text-slate-400">校验、美化或压缩 JSON 字符串</span>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 items-stretch">
      <!-- 输入 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">JSON 输入</span>
          <button @click="input = example" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
        </div>
        <textarea
          v-model="input"
          placeholder='{"name":"Qiuyun Tools","version":2.0}'
          class="w-full h-[400px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="flex lg:flex-col items-center justify-center gap-2 shrink-0">
        <button
          @click="format"
          :disabled="!input.trim()"
          class="h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium shadow-sm flex items-center gap-1.5 transition"
        >
          <component :is="icons.Sparkles" class="w-4 h-4" />
          格式化
        </button>
        <button
          @click="compress"
          :disabled="!input.trim()"
          class="h-10 px-5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 text-sm font-medium flex items-center gap-1.5 transition"
        >
          <component :is="icons.Compress" class="w-4 h-4" />
          压缩
        </button>
        <button
          @click="clear"
          class="h-8 px-3 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          清空
        </button>
      </div>

      <!-- 输出 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-slate-500">输出</span>
            <span v-if="input.trim() && isValid" class="text-[11px] text-green-600 font-medium flex items-center gap-0.5">
              <component :is="icons.Check" class="w-3 h-3" />
              JSON 有效
            </span>
            <span v-else-if="input.trim() && !isValid" class="text-[11px] text-red-500 font-medium flex items-center gap-0.5">
              <component :is="icons.X" class="w-3 h-3" />
              {{ errorMsg }}
            </span>
          </div>
          <CopyButton :text="output" label="复制" />
        </div>
        <div
          v-if="output"
          class="w-full h-[400px] p-3 rounded-lg font-mono text-sm overflow-auto whitespace-pre-wrap"
          :class="output.startsWith('格式化失败') || output.startsWith('压缩失败') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-700 border border-slate-100'"
        >{{ output }}</div>
        <div
          v-else
          class="w-full h-[400px] p-3 rounded-lg bg-slate-50 text-slate-400 border border-slate-100 flex flex-col items-center justify-center gap-2 text-xs"
        >
          <component :is="icons.FileJson" class="w-8 h-8 text-slate-300" />
          <span>在左侧粘贴 JSON，点击格式化或压缩</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const input = ref('')
const output = ref('')
const errorMsg = ref('')

const example = `{"name":"Qiuyun Tools","version":2.0,"features":["JSON格式化","代码美化","正则测试"],"server":{"host":"localhost","port":3000}}`

const isValid = computed(() => {
  if (!input.value.trim()) return true
  try {
    JSON.parse(input.value)
    return true
  } catch (e: any) {
    errorMsg.value = e?.message || '无效 JSON'
    return false
  }
})

function format() {
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj, null, 2)
  } catch (e: any) {
    output.value = '格式化失败: ' + e?.message
  }
}

function compress() {
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj)
  } catch (e: any) {
    output.value = '压缩失败: ' + e?.message
  }
}

function clear() {
  input.value = ''
  output.value = ''
}
</script>
