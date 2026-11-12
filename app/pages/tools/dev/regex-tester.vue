<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="flex flex-col lg:flex-row gap-4 items-stretch">
      <!-- 左侧：正则输入 + 速查 -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 flex flex-col gap-4 lg:w-72 shrink-0">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.regex-tester.patternLabel') }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="shrink-0 text-xl text-slate-400 font-mono">/</span>
            <input
              v-model="pattern"
              :placeholder="$t('ui.dev.regex-tester.patternPlaceholder')"
              class="flex-1 min-w-0 h-11 px-3 text-sm font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
            <span class="shrink-0 text-xl text-slate-400 font-mono">/</span>
            <input
              v-model="flags"
              placeholder="gim"
              class="w-16 shrink-0 h-11 px-2 text-sm font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
          <div v-if="regexError" class="mt-2 text-xs text-red-500">{{ regexError }}</div>
          <div class="mt-3 space-y-1.5 text-xs text-slate-500">
            <label v-for="f in flagOptions" :key="f.value" class="flex items-center gap-2">
              <input
                :checked="flags.includes(f.value)"
                @change="toggleFlag(f.value)"
                type="checkbox"
                class="rounded"
              />
              <span class="font-mono font-semibold">{{ f.value }}</span>
              <span>{{ f.desc }}</span>
            </label>
          </div>
        </div>

        <!-- Quick presets -->
        <div class="pt-3 border-t border-slate-100">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs font-medium text-slate-600">{{ $t('ui.dev.regex-tester.presetsTitle') }}</div>
            <button @click="applyPreset(presets[0])" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
          </div>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="p in presets"
              :key="p.name"
              @click="applyPreset(p)"
              class="text-[11px] px-2 py-1.5 rounded-md bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-left transition truncate"
              :title="p.pattern"
            >{{ p.name }}</button>
          </div>
        </div>
      </div>

      <!-- 右侧：测试文本 + 结果 -->
      <div class="flex-1 flex flex-col gap-4">
        <div class="bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.regex-tester.testTextLabel') }}</span>
          </div>
          <textarea
            v-model="testText"
            :placeholder="$t('ui.dev.regex-tester.testTextPlaceholder')"
            class="w-full h-44 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.regex-tester.matchResults', { count: matches.length }) }}</span>
          </div>
          <div v-if="matches.length" class="flex flex-wrap gap-1.5">
            <span
              v-for="(m, i) in matches"
              :key="i"
              class="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-mono text-xs border border-indigo-200"
              :title="$t('ui.dev.regex-tester.matchTitle', { index: m.index }) + (m.groups?.length ? $t('ui.dev.regex-tester.matchGroups', { groups: m.groups }) : '')"
            >{{ m.value }}</span>
          </div>
          <div v-else class="py-6 text-center text-slate-400 text-xs">
            {{ regexError || $t('ui.dev.regex-tester.noMatch') }}
          </div>
        </div>

        <!-- Group details -->
        <div v-if="matches.some(m => m.groups?.length)" class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.regex-tester.groupDetails') }}</span>
          </div>
          <table class="w-full text-xs font-mono">
            <thead>
              <tr class="text-slate-400 border-b border-slate-100">
                <th class="text-left py-2">{{ $t('ui.dev.regex-tester.colIndex') }}</th>
                <th class="text-left py-2">{{ $t('ui.dev.regex-tester.colFullMatch') }}</th>
                <th class="text-left py-2">{{ $t('ui.dev.regex-tester.colGroups') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(m, i) in matches.filter(x => x.groups?.length)" :key="i" class="border-b border-slate-50">
                <td class="py-2 text-slate-500">{{ i + 1 }}</td>
                <td class="py-2 text-indigo-600">{{ m.value }}</td>
                <td class="py-2 text-slate-700">{{ m.groups }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const pattern = ref('')
const flags = ref('g')
const testText = ref('Hello World 123\nhello@example.com\nphone: 138-0000-0000')
const regexError = ref('')

interface Preset {
  name: string
  pattern: string
  flags: string
  text: string
}

const presets = computed<Preset[]>(() => [
  { name: t('ui.dev.regex-tester.presetEmail'), pattern: '[\\w.-]+@[\\w.-]+\\.\\w+', flags: 'g', text: t('ui.dev.regex-tester.sampleEmail') },
  { name: t('ui.dev.regex-tester.presetPhone'), pattern: '1[3-9]\\d{9}', flags: 'g', text: t('ui.dev.regex-tester.samplePhone') },
  { name: t('ui.dev.regex-tester.presetUrl'), pattern: 'https?:\\/\\/[\\w.-]+(?:\\/[\\w./-]*)?', flags: 'gi', text: t('ui.dev.regex-tester.sampleUrl') },
  { name: t('ui.dev.regex-tester.presetIpv4'), pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g', text: t('ui.dev.regex-tester.sampleIpv4') },
  { name: t('ui.dev.regex-tester.presetIdCard'), pattern: '[1-9]\\d{5}(?:19|20)\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]', flags: 'g', text: t('ui.dev.regex-tester.sampleIdCard') },
  { name: t('ui.dev.regex-tester.presetChinese'), pattern: '[\\u4e00-\\u9fa5]+', flags: 'g', text: t('ui.dev.regex-tester.sampleChinese') },
  { name: t('ui.dev.regex-tester.presetDate'), pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', flags: 'g', text: t('ui.dev.regex-tester.sampleDate') },
  { name: t('ui.dev.regex-tester.presetTime'), pattern: '(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?', flags: 'g', text: t('ui.dev.regex-tester.sampleTime') },
  { name: t('ui.dev.regex-tester.presetHtml'), pattern: '<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>(.*?)<\\/\\1>', flags: 'gs', text: t('ui.dev.regex-tester.sampleHtml') },
  { name: t('ui.dev.regex-tester.presetHexColor'), pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: 'gi', text: t('ui.dev.regex-tester.sampleHexColor') },
  { name: t('ui.dev.regex-tester.presetNumber'), pattern: '-?\\d+(?:\\.\\d+)?', flags: 'g', text: t('ui.dev.regex-tester.sampleNumber') },
  { name: t('ui.dev.regex-tester.presetUsername'), pattern: '[a-zA-Z][a-zA-Z0-9_]{2,15}', flags: 'g', text: t('ui.dev.regex-tester.sampleUsername') },
])

function applyPreset(p: Preset) {
  pattern.value = p.pattern
  flags.value = p.flags
  testText.value = p.text
}

const flagOptions = computed(() => [
  { value: 'g', desc: t('ui.dev.regex-tester.flagGlobal') },
  { value: 'i', desc: t('ui.dev.regex-tester.flagIgnoreCase') },
  { value: 'm', desc: t('ui.dev.regex-tester.flagMultiline') },
  { value: 's', desc: t('ui.dev.regex-tester.flagDotAll') },
])

function toggleFlag(f: string) {
  if (flags.value.includes(f)) {
    flags.value = flags.value.replace(f, '')
  } else {
    flags.value += f
  }
}

const matches = computed(() => {
  regexError.value = ''
  if (!pattern.value.trim()) return []
  let regex: RegExp
  try {
    regex = new RegExp(pattern.value, flags.value)
  } catch (e: any) {
    regexError.value = t('ui.dev.regex-tester.errSyntax', { message: e?.message })
    return []
  }
  const results: { value: string; index: number; groups: string }[] = []
  if (flags.value.includes('g')) {
    let m: RegExpExecArray | null
    let safety = 0
    while ((m = regex.exec(testText.value)) !== null && safety < 1000) {
      results.push({ value: m[0], index: m.index, groups: m.slice(1).join(', ') })
      if (m[0].length === 0) regex.lastIndex++ // avoid infinite loop
      safety++
    }
  } else {
    const m = regex.exec(testText.value)
    if (m) results.push({ value: m[0], index: m.index, groups: m.slice(1).join(', ') })
  }
  return results
})
</script>
