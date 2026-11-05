<template>
  <div class="space-y-5">
    <!-- YAML → JSON -->
    <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">YAML → JSON</h3>
        <span class="text-xs text-slate-400">YAML 格式转标准 JSON</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">YAML 输入</span>
            <div class="flex items-center gap-3">
              <button @click="yamlInput = exampleYaml" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
              <button @click="clear1" class="text-xs text-slate-400 hover:text-slate-600">清空</button>
            </div>
          </div>
          <textarea
            v-model="yamlInput"
            placeholder="输入 YAML..."
            class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            @click="yamlToJson"
            :disabled="!yamlInput.trim()"
            class="h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium shadow-sm flex items-center gap-1.5 transition"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            转换
          </button>
        </div>

        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">JSON 输出</span>
            <CopyButton :text="jsonOutput" label="复制" />
          </div>
          <div
            v-if="yamlError"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap min-h-[120px] bg-red-50 text-red-600 border border-red-100"
          >{{ yamlError }}</div>
          <div
            v-else-if="jsonOutput"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap min-h-[120px] bg-slate-50 text-slate-700 border border-slate-100"
          >{{ jsonOutput }}</div>
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

    <!-- JSON → YAML -->
    <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">JSON → YAML</h3>
        <span class="text-xs text-slate-400">标准 JSON 转 YAML 格式</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">JSON 输入</span>
            <div class="flex items-center gap-3">
              <button @click="jsonInput = exampleJson" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
              <button @click="clear2" class="text-xs text-slate-400 hover:text-slate-600">清空</button>
            </div>
          </div>
          <textarea
            v-model="jsonInput"
            placeholder="输入 JSON..."
            class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            @click="jsonToYaml"
            :disabled="!jsonInput.trim()"
            class="h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium shadow-sm flex items-center gap-1.5 transition"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            转换
          </button>
        </div>

        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">YAML 输出</span>
            <CopyButton :text="yamlOutput" label="复制" />
          </div>
          <div
            v-if="jsonError"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap min-h-[120px] bg-red-50 text-red-600 border border-red-100"
          >{{ jsonError }}</div>
          <div
            v-else-if="yamlOutput"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap min-h-[120px] bg-slate-50 text-slate-700 border border-slate-100"
          >{{ yamlOutput }}</div>
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
import * as yaml from 'js-yaml'
import * as icons from 'lucide-vue-next'

const yamlInput = ref('')
const jsonInput = ref('')
const jsonOutput = ref('')
const yamlOutput = ref('')
const yamlError = ref('')
const jsonError = ref('')

const exampleYaml = `app:
  name: Qiuyun Tools
  version: 2.0
server:
  host: localhost
  port: 3000`

const exampleJson = `{
  "app": {
    "name": "Qiuyun Tools",
    "version": "2.0"
  },
  "server": {
    "host": "localhost",
    "port": 3000
  }
}`

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
    yamlOutput.value = yaml.dump(obj, { lineWidth: 120, noRefs: true }).trim()
  } catch (e: any) {
    jsonError.value = 'JSON 解析失败: ' + e?.message
  }
}

function clear1() { yamlInput.value = ''; jsonOutput.value = ''; yamlError.value = '' }
function clear2() { jsonInput.value = ''; yamlOutput.value = ''; jsonError.value = '' }
</script>
