<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Properties → YAML -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">Properties → YAML</h3>
        <button @click="p2y" class="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs hover:bg-indigo-700">转换</button>
      </div>
      <textarea
        v-model="pInput"
        placeholder="app.name=测试&#10;app.version=1.0"
        class="w-full h-44 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div class="mt-3 flex items-center justify-between">
        <span class="text-xs text-slate-400">YAML 输出</span>
        <CopyButton :text="yOutput" label="复制" />
      </div>
      <pre class="mt-2 p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap min-h-[80px] bg-slate-50 text-slate-700">{{ yOutput || '等待转换...' }}</pre>
    </section>

    <!-- YAML → Properties -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">YAML → Properties</h3>
        <button @click="y2p" class="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs hover:bg-indigo-700">转换</button>
      </div>
      <textarea
        v-model="yInput"
        placeholder="app:&#10;  name: 测试&#10;  version: 1.0"
        class="w-full h-44 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div class="mt-3 flex items-center justify-between">
        <span class="text-xs text-slate-400">Properties 输出</span>
        <CopyButton :text="pOutput" label="复制" />
      </div>
      <pre class="mt-2 p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap min-h-[80px] bg-slate-50 text-slate-700">{{ pOutput || '等待转换...' }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as yaml from 'js-yaml'

const pInput = ref('')
const yInput = ref('')
const yOutput = ref('')
const pOutput = ref('')

// Properties → JS object
function parseProperties(text: string): Record<string, any> {
  const obj: Record<string, any> = {}
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.substring(0, idx).trim()
    const value = trimmed.substring(idx + 1).trim()
    // Try auto-type conversion
    let val: any = value
    if (value === 'true') val = true
    else if (value === 'false') val = false
    else if (/^-?\d+$/.test(value)) val = Number(value)
    else if (/^-?\d+\.\d+$/.test(value)) val = Number(value)
    else if (value.startsWith('"') && value.endsWith('"')) val = value.slice(1, -1)
    obj[key] = val
  }
  return obj
}

function objToProperties(obj: any, prefix = ''): string {
  const lines: string[] = []
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (val !== null && typeof val === 'object') {
      lines.push(objToProperties(val, fullKey))
    } else {
      lines.push(`${fullKey}=${String(val)}`)
    }
  }
  return lines.join('\n')
}

function p2y() {
  try {
    const obj = parseProperties(pInput.value)
    yOutput.value = yaml.dump(obj, { lineWidth: 120 })
  } catch (e: any) {
    yOutput.value = '转换失败: ' + e?.message
  }
}

function y2p() {
  try {
    const obj = yaml.load(yInput.value) as any
    pOutput.value = objToProperties(obj)
  } catch (e: any) {
    pOutput.value = '转换失败: ' + e?.message
  }
}
</script>
