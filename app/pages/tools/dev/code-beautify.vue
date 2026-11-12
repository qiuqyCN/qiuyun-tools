<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="flex flex-col lg:flex-row gap-4 items-stretch">
      <!-- 控制面板 -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 flex lg:flex-col gap-3 lg:gap-3 flex-wrap shrink-0 lg:w-56">
        <div class="w-full">
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.dev.code-beautify.langLabel') }}</label>
          <select v-model="lang" class="w-full h-9 px-2 text-sm rounded-lg border border-slate-200 bg-white">
            <option v-for="l in langs" :key="l.value" :value="l.value">{{ l.label }}</option>
          </select>
        </div>
        <div class="w-full">
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.dev.code-beautify.indentLabel') }}</label>
          <select v-model.number="tabWidth" class="w-full h-9 px-2 text-sm rounded-lg border border-slate-200 bg-white">
            <option :value="2">{{ $t('ui.dev.code-beautify.indent2') }}</option>
            <option :value="4">{{ $t('ui.dev.code-beautify.indent4') }}</option>
            <option :value="8">{{ $t('ui.dev.code-beautify.indent8') }}</option>
            <option :value="0">{{ $t('ui.dev.code-beautify.indentTab') }}</option>
          </select>
        </div>
        <div class="w-full space-y-1.5 text-xs text-slate-500">
          <label class="flex items-center gap-1.5"><input v-model="singleQuote" type="checkbox" class="rounded" />{{ $t('ui.dev.code-beautify.singleQuote') }}</label>
          <label class="flex items-center gap-1.5"><input v-model="semi" type="checkbox" class="rounded" />{{ $t('ui.dev.code-beautify.semi') }}</label>
          <label class="flex items-center gap-1.5"><input v-model="trailingComma" type="checkbox" class="rounded" />{{ $t('ui.dev.code-beautify.trailingComma') }}</label>
        </div>
        <button @click="input = example" class="w-full text-xs text-indigo-500 hover:text-indigo-600 hover:underline text-center">📝 {{ $t('common.example') }}</button>
      </div>

      <!-- 输入 -->
      <div class="flex-1 min-w-0 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.code-beautify.inputLabel') }}</span>
        </div>
        <textarea
          v-model="input"
          :placeholder="$t('ui.dev.code-beautify.placeholder')"
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
          <component :is="icons.Wand2" class="w-4 h-4" />
          {{ $t('ui.dev.code-beautify.btnFormat') }}
        </button>
        <button
          @click="minify"
          :disabled="!input.trim()"
          class="h-10 px-5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 text-sm font-medium flex items-center gap-1.5 transition"
        >
          <component :is="icons.Minimize2" class="w-4 h-4" />
          {{ $t('ui.dev.code-beautify.btnMinify') }}
        </button>
        <button
          @click="input = ''; output = ''; errMsg = ''"
          class="h-8 px-3 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >{{ $t('common.clear') }}</button>
        <div v-if="errMsg" class="text-[11px] text-red-500 max-w-[120px] text-center">{{ errMsg }}</div>
      </div>

      <!-- 输出 -->
      <div class="flex-1 min-w-0 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.code-beautify.outputLabel') }}</span>
          <CopyButton :text="output" :label="$t('common.copy')" />
        </div>
        <pre
          v-if="output"
          class="w-full h-[400px] p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre bg-slate-50 text-slate-700 border border-slate-100"
        >{{ output }}</pre>
        <div
          v-else
          class="w-full h-[400px] p-3 rounded-lg bg-slate-50 text-slate-400 border border-slate-100 flex flex-col items-center justify-center gap-2 text-xs"
        >
          <component :is="icons.Code2" class="w-8 h-8 text-slate-300" />
          <span>{{ $t('ui.dev.code-beautify.emptyHint') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import * as prettier from 'prettier/standalone'
import estree from 'prettier/plugins/estree'
import babel from 'prettier/plugins/babel'
import html from 'prettier/plugins/html'
import postcss from 'prettier/plugins/postcss'
import typescript from 'prettier/plugins/typescript'
import markdown from 'prettier/plugins/markdown'
import yaml from 'prettier/plugins/yaml'

const { t } = useI18n()

const example = `function hello(name){console.log("hello",name);const obj={a:1,b:2,c:[1,2,3]};return obj;}`

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
    errMsg.value = e?.message || t('ui.dev.code-beautify.errFormatFailed')
  }
}

function format() { runFormat() }
function minify() { runFormat(99999) }
</script>
