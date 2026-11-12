<template>
  <div class="space-y-5">
    <!-- Quick now -->
    <section class="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
      <div class="text-xs opacity-70 mb-1">{{ $t('ui.dev.timestamp.nowLabel') }}</div>
      <div class="flex items-center gap-4">
        <button @click="copyNow(10)" class="font-mono text-3xl font-bold hover:opacity-80 transition">
          {{ nowSec }}
        </button>
        <button @click="copyNow(13)" class="font-mono text-2xl opacity-90 hover:opacity-80 transition">
          {{ nowMs }}
        </button>
      </div>
      <div class="text-xs opacity-70 mt-2">{{ nowDate }}</div>
    </section>

    <!-- Timestamp → Date -->
    <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">{{ $t('ui.dev.timestamp.tsToDateTitle') }}</h3>
        <span class="text-xs text-slate-400">{{ $t('ui.dev.timestamp.tsToDateDesc') }}</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.timestamp.tsInputLabel') }}</span>
            <div class="flex items-center gap-3">
              <button @click="tsInput = exampleTs" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
              <button @click="tsInput = ''" class="text-xs text-slate-400 hover:text-slate-600">{{ $t('common.clear') }}</button>
            </div>
          </div>
          <input
            v-model="tsInput"
            :placeholder="$t('ui.dev.timestamp.tsPlaceholder')"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            disabled
            class="h-10 px-5 rounded-xl bg-indigo-500 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            {{ $t('ui.dev.timestamp.btnConvertLive') }}
          </button>
        </div>

        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.timestamp.dateOutputLabel') }}</span>
            <CopyButton :text="tsDate" :label="$t('common.copy')" />
          </div>
          <div
            v-if="tsDate && !tsInvalid"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap min-h-[120px] bg-slate-50 text-slate-700 border border-slate-100 flex items-center"
          >{{ tsDate }}</div>
          <div
            v-else-if="tsInvalid"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap min-h-[120px] bg-red-50 text-red-600 border border-red-100 flex items-center"
          >{{ tsDate }}</div>
          <div
            v-else
            class="p-3 rounded-lg min-h-[120px] bg-slate-50 text-slate-400 flex flex-col items-center justify-center text-xs gap-1 border border-slate-100"
          >
            <component :is="icons.Calendar" class="w-6 h-6 text-slate-300" />
            <span>{{ $t('ui.dev.timestamp.emptyHintTs') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Date → Timestamp -->
    <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">{{ $t('ui.dev.timestamp.dateToTsTitle') }}</h3>
        <span class="text-xs text-slate-400">{{ $t('ui.dev.timestamp.dateToTsDesc') }}</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.timestamp.dateInputLabel') }}</span>
            <div class="flex items-center gap-3">
              <button @click="fillNow" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">{{ $t('ui.dev.timestamp.btnNow') }}</button>
              <button @click="dateInput = ''" class="text-xs text-slate-400 hover:text-slate-600">{{ $t('common.clear') }}</button>
            </div>
          </div>
          <input
            v-model="dateInput"
            type="datetime-local"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            disabled
            class="h-10 px-5 rounded-xl bg-indigo-500 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            {{ $t('ui.dev.timestamp.btnConvertLive') }}
          </button>
        </div>

        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.timestamp.tsOutputLabel') }}</span>
            <div class="flex items-center gap-2">
              <CopyButton :text="String(dateSec)" :label="$t('ui.dev.timestamp.secLabel')" />
              <CopyButton :text="String(dateMs)" :label="$t('ui.dev.timestamp.msShort')" />
            </div>
          </div>
          <div
            v-if="dateInput"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap min-h-[120px] bg-slate-50 text-slate-700 border border-slate-100"
          >
            <div class="text-slate-600">{{ $t('ui.dev.timestamp.secLabel') }}: <span class="text-indigo-600">{{ dateSec }}</span></div>
            <div class="text-slate-600 mt-1">{{ $t('ui.dev.timestamp.msLabel') }}: <span class="text-indigo-600">{{ dateMs }}</span></div>
          </div>
          <div
            v-else
            class="p-3 rounded-lg min-h-[120px] bg-slate-50 text-slate-400 flex flex-col items-center justify-center text-xs gap-1 border border-slate-100"
          >
            <component :is="icons.CalendarClock" class="w-6 h-6 text-slate-300" />
            <span>{{ $t('ui.dev.timestamp.emptyHintDate') }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

// 当前时间（初始值固定为 0，避免 SSR/CSR hydration mismatch；onMounted 里会立即设为真实时间）
const now = ref(0)
const nowSec = computed(() => Math.floor(now.value / 1000))
const nowMs = computed(() => now.value)
const nowDate = computed(() => (now.value ? formatDate(new Date(now.value)) : ''))

// 每秒更新
let timer: number | null = null
onMounted(() => {
  now.value = Date.now()
  timer = window.setInterval(() => (now.value = Date.now()), 1000)
})
onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

// Timestamp → Date
const tsInput = ref('')
// 固定值，避免 SSR/CSR mismatch；按钮点击后按当前时间生成
const exampleTs = '1700000000'

const tsInvalid = computed(() => {
  const raw = tsInput.value.trim()
  if (!raw) return false
  let ts = Number(raw)
  if (isNaN(ts)) return true
  // 10位自动补成毫秒
  if (raw.length === 10) ts *= 1000
  return isNaN(new Date(ts).getTime())
})

const tsDate = computed(() => {
  if (!tsInput.value) return ''
  if (tsInvalid.value) return t('ui.dev.timestamp.invalidTimestamp')
  let ts = Number(tsInput.value.trim())
  // 10位自动补成毫秒
  if (tsInput.value.trim().length === 10) ts *= 1000
  return formatDate(new Date(ts))
})

// Date → Timestamp
const dateInput = ref('')
const dateSec = computed(() => {
  if (!dateInput.value) return '-'
  const ms = new Date(dateInput.value).getTime()
  return isNaN(ms) ? '-' : Math.floor(ms / 1000)
})
const dateMs = computed(() => {
  if (!dateInput.value) return '-'
  const ms = new Date(dateInput.value).getTime()
  return isNaN(ms) ? '-' : ms
})

function formatDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function copyNow(digits: 10 | 13) {
  const v = digits === 10 ? nowSec.value : nowMs.value
  navigator.clipboard.writeText(String(v))
}

function fillNow() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  dateInput.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
</script>
