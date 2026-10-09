<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- YAML → JSON -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">YAML 输入</h3>
        <div class="flex items-center gap-2 text-xs">
          <button @click="yamlToJson" class="px-2.5 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">→ JSON</button>
          <button @click="clear1" class="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200">清空</button>
        </div>
      </div>
      <textarea
        v-model="yamlInput"
        placeholder="输入 YAML..."
        class="w-full h-[220px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div class="mt-3 flex items-center justify-between">
        <span class="text-xs text-slate-400">JSON 输出</span>
        <CopyButton :text="jsonOutput" label="复制" />
      </div>
      <pre
        class="mt-2 p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap min-h-[80px]"
        :class="yamlError ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-700'"
      >{{ yamlError || jsonOutput || '等待转换...' }}</pre>
    </section>

    <!-- JSON → YAML -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">JSON 输入</h3>
        <div class="flex items-center gap-2 text-xs">
          <button @click="jsonToYaml" class="px-2.5 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">→ YAML</button>
          <button @click="clear2" class="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200">清空</button>
        </div>
      </div>
      <textarea
        v-model="jsonInput"
        placeholder="输入 JSON..."
        class="w-full h-[220px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div class="mt-3 flex items-center justify-between">
        <span class="text-xs text-slate-400">YAML 输出</span>
        <CopyButton :text="yamlOutput" label="复制" />
      </div>
      <pre
        class="mt-2 p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap min-h-[80px]"
        :class="jsonError ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-700'"
      >{{ jsonError || yamlOutput || '等待转换...' }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as yaml from 'js-yaml'

const yamlInput = ref('')
const jsonInput = ref('')
const jsonOutput = ref('')
const yamlOutput = ref('')
const yamlError = ref('')
const jsonError = ref('')

function yamlToJson() {
  yamlError.value = ''
  try {
    const obj = yaml.load(yamlInput.value)
    jsonOutput.value = JSON.stringify(obj, null, 2)
  } catch (e: any) {
    yamlError.value = 'YAML 解析失败: ' + e?.reason
  }
}

function jsonToYaml() {
  jsonError.value = ''
  try {
    const obj = JSON.parse(jsonInput.value)
    yamlOutput.value = yaml.dump(obj, { lineWidth: 120, noRefs: true })
  } catch (e: any) {
    jsonError.value = 'JSON 解析失败: ' + e?.message
  }
}

function clear1() { yamlInput.value = ''; jsonOutput.value = ''; yamlError.value = '' }
function clear2() { jsonInput.value = ''; yamlOutput.value = ''; jsonError.value = '' }
</script>
