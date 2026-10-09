<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">CSS 格式化 / 压缩</h3>
      <textarea
        v-model="input"
        placeholder=".class{color:red;background:#fff}"
        class="w-full h-[440px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
    </section>
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="flex gap-2">
          <button @click="format" class="h-8 px-3 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700">格式化</button>
          <button @click="minify" class="h-8 px-3 text-xs rounded-md bg-slate-100 hover:bg-slate-200">压缩</button>
        </div>
        <CopyButton :text="output" label="复制" />
      </div>
      <pre
        class="w-full h-[440px] p-3 rounded-lg text-xs font-mono overflow-auto whitespace-pre-wrap"
        :class="errMsg ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-700'"
      >{{ errMsg || output || '等待输入...' }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as prettier from 'prettier/standalone'
import postcss from 'prettier/plugins/postcss'

const input = ref('')
const output = ref('')
const errMsg = ref('')

async function run(pw: number) {
  errMsg.value = ''
  try {
    output.value = await prettier.format(input.value, { parser: 'css', plugins: [postcss], tabWidth: 2, printWidth: pw })
  } catch (e: any) {
    errMsg.value = e?.message || '格式化失败'
  }
}

function format() { run(80) }
function minify() { run(99999) }
</script>
