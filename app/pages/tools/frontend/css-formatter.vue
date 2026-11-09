<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.frontend/css-formatter.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.frontend.css-formatter.pageDesc') }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.Code" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.frontend.css-formatter.inputLabel') }}</span>
        </div>
        <textarea
          v-model="input"
          placeholder=".class{color:red;background:#fff}"
          class="w-full h-[440px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <component :is="icons.Wand2" class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.frontend.css-formatter.outputLabel') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="format"
              class="h-9 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-sm flex items-center gap-1 transition"
            >
              <component :is="icons.Sparkles" class="w-3.5 h-3.5" />
              {{ $t('ui.frontend.css-formatter.btnFormat') }}
            </button>
            <button
              @click="minify"
              class="h-9 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1 transition"
            >
              <component :is="icons.Compress" class="w-3.5 h-3.5" />
              {{ $t('ui.frontend.css-formatter.btnMinify') }}
            </button>
            <CopyButton :text="output" :label="$t('common.copy')" />
          </div>
        </div>
        <pre
          class="w-full h-[440px] p-3 rounded-lg text-xs font-mono overflow-auto whitespace-pre-wrap border"
          :class="errMsg ? 'bg-red-50 text-red-700 border-red-100' : output ? 'bg-slate-50 text-slate-700 border-slate-100' : 'bg-slate-50 text-slate-400 border-slate-100 flex items-center justify-center'"
        >{{ errMsg || output || $t('ui.frontend.css-formatter.emptyHint') }}</pre>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import * as prettier from 'prettier/standalone'
import postcss from 'prettier/plugins/postcss'

const { t } = useI18n()
const input = ref('')
const output = ref('')
const errMsg = ref('')

async function run(pw: number) {
  errMsg.value = ''
  try {
    output.value = await prettier.format(input.value, { parser: 'css', plugins: [postcss], tabWidth: 2, printWidth: pw })
  } catch (e: any) {
    errMsg.value = e?.message || t('ui.frontend.css-formatter.formatFailed')
  }
}

function format() { run(80) }
function minify() { run(99999) }
</script>
