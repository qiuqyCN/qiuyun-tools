<template>
  <div class="space-y-5">
    <!-- Encode -->
    <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">URL 编码</h3>
        <span class="text-xs text-slate-400">对 URL 特殊字符进行百分号编码</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">原始文本</span>
            <div class="flex items-center gap-3">
              <button @click="raw = exampleRaw" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
              <button @click="clear1" class="text-xs text-slate-400 hover:text-slate-600">清空</button>
            </div>
          </div>
          <textarea
            v-model="raw"
            placeholder="输入原始文本..."
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
            <span class="text-xs font-medium text-slate-500">编码输出</span>
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
        <h3 class="text-sm font-semibold text-slate-700">URL 解码</h3>
        <span class="text-xs text-slate-400">还原百分号编码为原始文本</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">编码 URL 输入</span>
            <div class="flex items-center gap-3">
              <button @click="encodedInput = exampleEncoded" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
              <button @click="clear2" class="text-xs text-slate-400 hover:text-slate-600">清空</button>
            </div>
          </div>
          <textarea
            v-model="encodedInput"
            placeholder="输入编码后的 URL..."
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
            <span class="text-xs font-medium text-slate-500">解码输出</span>
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

const raw = ref('')
const encodedInput = ref('')
const decodeError = ref('')

const exampleRaw = `https://example.com/search?q=你好 世界&tag=vue+nuxt`

const exampleEncoded = `https%3A%2F%2Fexample.com%2Fsearch%3Fq%3D%E4%BD%A0%E5%A5%BD%20%E4%B8%96%E7%95%8C%26tag%3Dvue%2Bnuxt`

const encoded = computed(() => raw.value ? encodeURIComponent(raw.value) : '')

const decoded = computed(() => {
  if (!encodedInput.value) return ''
  decodeError.value = ''
  try {
    return decodeURIComponent(encodedInput.value.trim())
  } catch {
    decodeError.value = '无效的 URL 编码字符串'
    return ''
  }
})

function clear1() { raw.value = '' }
function clear2() { encodedInput.value = ''; decodeError.value = '' }
</script>
