<template>
  <div class="space-y-5">
    <!-- Properties → YAML -->
    <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">Properties → YAML</h3>
        <span class="text-xs text-slate-400">{{ $t('ui.dev.yaml-properties.p2yDesc') }}</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <!-- 输入 -->
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.yaml-properties.propsInputLabel') }}</span>
            <button
              @click="pInput = exampleProps"
              class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline"
            >
              📝 {{ $t('common.example') }}
            </button>
          </div>
          <textarea
            v-model="pInput"
            :placeholder="$t('ui.dev.yaml-properties.placeholderProps')"
            class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <!-- 转换按钮 -->
        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            @click="p2y"
            :disabled="!pInput.trim()"
            class="h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium shadow-sm flex items-center gap-1.5 transition"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            {{ $t('ui.dev.yaml-properties.btnConvert') }}
          </button>
        </div>

        <!-- 输出 -->
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.yaml-properties.yamlOutputLabel') }}</span>
            <CopyButton :text="yOutput" :label="$t('common.copy')" />
          </div>
          <div
            v-if="yOutput"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap min-h-[120px] bg-slate-50 text-slate-700 border border-slate-100"
          >{{ yOutput }}</div>
          <div
            v-else
            class="p-3 rounded-lg min-h-[120px] bg-slate-50 text-slate-400 flex flex-col items-center justify-center text-xs gap-1 border border-slate-100"
          >
            <component :is="icons.FileJson" class="w-6 h-6 text-slate-300" />
            <span>{{ $t('ui.dev.yaml-properties.emptyHint') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- YAML → Properties -->
    <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">YAML → Properties</h3>
        <span class="text-xs text-slate-400">{{ $t('ui.dev.yaml-properties.y2pDesc') }}</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.yaml-properties.yamlInputLabel') }}</span>
            <button
              @click="yInput = exampleYaml"
              class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline"
            >
              📝 {{ $t('common.example') }}
            </button>
          </div>
          <textarea
            v-model="yInput"
            :placeholder="$t('ui.dev.yaml-properties.placeholderYaml')"
            class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            @click="y2p"
            :disabled="!yInput.trim()"
            class="h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium shadow-sm flex items-center gap-1.5 transition"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            {{ $t('ui.dev.yaml-properties.btnConvert') }}
          </button>
        </div>

        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.yaml-properties.propsOutputLabel') }}</span>
            <CopyButton :text="pOutput" :label="$t('common.copy')" />
          </div>
          <div
            v-if="pOutput"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap min-h-[120px] bg-slate-50 text-slate-700 border border-slate-100"
          >{{ pOutput }}</div>
          <div
            v-else
            class="p-3 rounded-lg min-h-[120px] bg-slate-50 text-slate-400 flex flex-col items-center justify-center text-xs gap-1 border border-slate-100"
          >
            <component :is="icons.FileText" class="w-6 h-6 text-slate-300" />
            <span>{{ $t('ui.dev.yaml-properties.emptyHint') }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as yaml from 'js-yaml'
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const pInput = ref('')
const yInput = ref('')
const yOutput = ref('')
const pOutput = ref('')

const exampleProps = `app.name=Qiuyun Tools
app.version=2.0
server.host=localhost
server.port=3000
server.debug=true`

const exampleYaml = `app:
  name: Qiuyun Tools
  version: 2.0
server:
  host: localhost
  port: 3000
  debug: true`

function parseProperties(text: string): Record<string, any> {
  const obj: Record<string, any> = {}
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.substring(0, idx).trim()
    const value = trimmed.substring(idx + 1).trim()
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
    yOutput.value = yaml.dump(obj, { lineWidth: 120 }).trim()
  } catch (e: any) {
    yOutput.value = t('ui.dev.yaml-properties.errConvert', { msg: e?.message })
  }
}

function y2p() {
  try {
    const obj = yaml.load(yInput.value) as any
    pOutput.value = objToProperties(obj)
  } catch (e: any) {
    pOutput.value = t('ui.dev.yaml-properties.errConvert', { msg: e?.message })
  }
}
</script>
