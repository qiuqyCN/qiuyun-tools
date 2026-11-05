<template>
  <div class="space-y-5">
    <!-- Encode -->
    <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">编码（文本 → Base64）</h3>
        <span class="text-xs text-slate-400">UTF-8 兼容的文本编码</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">输入文本</span>
            <div class="flex items-center gap-3">
              <button @click="inputText = exampleText" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
              <button @click="clear1" class="text-xs text-slate-400 hover:text-slate-600">清空</button>
            </div>
          </div>
          <textarea
            v-model="inputText"
            placeholder="输入要编码的文本..."
            class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            disabled
            class="h-10 px-5 rounded-xl bg-indigo-500 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            实时转换
          </button>
        </div>

        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">Base64 输出</span>
            <CopyButton :text="encoded" label="复制" />
          </div>
          <div
            v-if="encoded"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap break-all min-h-[120px] bg-slate-50 text-slate-700 border border-slate-100"
          >{{ encoded }}</div>
          <div
            v-else
            class="p-3 rounded-lg min-h-[120px] bg-slate-50 text-slate-400 flex flex-col items-center justify-center text-xs gap-1 border border-slate-100"
          >
            <component :is="icons.FileJson" class="w-6 h-6 text-slate-300" />
            <span>在左侧粘贴内容，点击转换</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Decode -->
    <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">解码（Base64 → 文本）</h3>
        <span class="text-xs text-slate-400">还原 Base64 为原始文本</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">Base64 输入</span>
            <div class="flex items-center gap-3">
              <button @click="inputBase64 = exampleBase64" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
              <button @click="clear2" class="text-xs text-slate-400 hover:text-slate-600">清空</button>
            </div>
          </div>
          <textarea
            v-model="inputBase64"
            placeholder="输入 Base64 字符串..."
            class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            disabled
            class="h-10 px-5 rounded-xl bg-indigo-500 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            实时转换
          </button>
        </div>

        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">文本输出</span>
            <CopyButton :text="decoded" label="复制" />
          </div>
          <div
            v-if="decodeError"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap break-all min-h-[120px] bg-red-50 text-red-600 border border-red-100"
          >{{ decodeError }}</div>
          <div
            v-else-if="decoded"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap break-all min-h-[120px] bg-slate-50 text-slate-700 border border-slate-100"
          >{{ decoded }}</div>
          <div
            v-else
            class="p-3 rounded-lg min-h-[120px] bg-slate-50 text-slate-400 flex flex-col items-center justify-center text-xs gap-1 border border-slate-100"
          >
            <component :is="icons.FileText" class="w-6 h-6 text-slate-300" />
            <span>在左侧粘贴内容，点击转换</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const inputText = ref('')
const inputBase64 = ref('')
const decodeError = ref('')

const exampleText = `Hello World
这是一段示例文本
支持 UTF-8 中文编码`

const exampleBase64 = `SGVsbG8gV29ybGQK6K6+5Y2V5LiA5Lqb5L+b5paH5pysCue7j+e7nyBVVEYtOCDkuIDpqozkuIDlrZfoqKHnp4bvvIzkuK3lrZfmlbDmga/nirbvvIzvvIzkuK3lrZfku6Pmj5HvvIzvvIzkupPlsI/mj5HvvIzvvIzlrozkuIDmj5HvvIzvvIznsaHmoLblsI/mj5HvvIz`

// UTF-8 兼容的 Base64 编码
const encoded = computed(() => {
  if (!inputText.value) return ''
  try {
    return btoa(unescape(encodeURIComponent(inputText.value)))
  } catch {
    return ''
  }
})

// UTF-8 兼容的 Base64 解码
const decoded = computed(() => {
  if (!inputBase64.value) return ''
  decodeError.value = ''
  try {
    return decodeURIComponent(escape(atob(inputBase64.value.trim())))
  } catch {
    decodeError.value = '无效的 Base64 字符串'
    return ''
  }
})

function clear1() { inputText.value = '' }
function clear2() { inputBase64.value = ''; decodeError.value = '' }
</script>
