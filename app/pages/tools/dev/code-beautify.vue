<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Controls -->
    <section class="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-1 space-y-4">
      <h3 class="text-sm font-semibold text-slate-700">格式化</h3>
      <div>
        <label class="block text-xs text-slate-500 mb-1">语言</label>
        <select v-model="lang" class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 bg-white">
          <option v-for="l in langs" :key="l.value" :value="l.value">{{ l.label }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">缩进</label>
        <select v-model.number="tabWidth" class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 bg-white">
          <option :value="2">2 空格</option>
          <option :value="4">4 空格</option>
          <option :value="8">8 空格</option>
          <option :value="0">Tab</option>
        </select>
      </div>
      <div class="space-y-2 text-xs text-slate-500">
        <label class="flex items-center gap-1.5"><input v-model="singleQuote" type="checkbox" class="rounded" />单引号</label>
        <label class="flex items-center gap-1.5"><input v-model="semi" type="checkbox" class="rounded" />分号</label>
        <label class="flex items-center gap-1.5"><input v-model="trailingComma" type="checkbox" class="rounded" />尾随逗号</label>
      </div>
      <div class="flex gap-2">
        <button @click="format" class="flex-1 h-10 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">格式化</button>
        <button @click="minify" class="flex-1 h-10 text-sm rounded-lg bg-slate-100 hover:bg-slate-200">压缩</button>
      </div>
      <div v-if="errMsg" class="text-xs text-red-500">{{ errMsg }}</div>
    </section>

    <!-- Editor area -->
    <section class="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">源代码</h3>
        <textarea
          v-model="input"
          placeholder="粘贴代码..."
          class="w-full h-[440px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-slate-700">输出</h3>
          <CopyButton :text="output" label="复制" />
        </div>
        <pre class="w-full h-[440px] p-3 rounded-lg bg-slate-50 text-xs font-mono text-slate-700 overflow-auto whitespace-pre">{{ output || '等待格式化...' }}</pre>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as prettier from 'prettier/standalone'
import estree from 'prettier/plugins/estree'
import babel from 'prettier/plugins/babel'
import html from 'prettier/plugins/html'
import postcss from 'prettier/plugins/postcss'
import typescript from 'prettier/plugins/typescript'
import markdown from 'prettier/plugins/markdown'
import yaml from 'prettier/plugins/yaml'

const langs = [
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS / SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'md', label: 'Markdown' },
  { value: 'yaml', label: 'YAML' },
]

const lang = ref('js')
const tabWidth = ref(2)
const singleQuote = ref(true)
const semi = ref(true)
const trailingComma = ref(false)
const input = ref('')
const output = ref('')
const errMsg = ref('')

const pluginMap: Record<string, any[]> = {
  js: [babel, estree],
  ts: [typescript, estree],
  html: [html],
  css: [postcss],
  json: [], // JSON 不走 prettier，用原生处理
  md: [markdown],
  yaml: [yaml],
}

async function runFormat(printWidth = 80) {
  errMsg.value = ''
  try {
    // JSON 原生处理（prettier standalone 无内置 JSON parser）
    if (lang.value === 'json') {
      if (!input.value.trim()) { output.value = ''; return }
      if (printWidth >= 99999) {
        output.value = JSON.stringify(JSON.parse(input.value))
      } else {
        output.value = JSON.stringify(JSON.parse(input.value), null, tabWidth.value || 2)
      }
      return
    }
    const parserMap: Record<string, string> = {
      js: 'babel', ts: 'typescript', html: 'html', css: 'css',
      md: 'markdown', yaml: 'yaml',
    }
    const result = await prettier.format(input.value, {
      parser: parserMap[lang.value],
      plugins: pluginMap[lang.value],
      tabWidth: tabWidth.value || 2,
      useTabs: tabWidth.value === 0,
      singleQuote: singleQuote.value,
      semi: semi.value,
      trailingComma: trailingComma.value ? 'all' : 'none',
      printWidth,
    })
    output.value = result
  } catch (e: any) {
    errMsg.value = e?.message || '格式化失败'
  }
}

function format() { runFormat() }
function minify() { runFormat(99999) }
</script>
