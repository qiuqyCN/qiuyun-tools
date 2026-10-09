<template>
  <div class="space-y-5">
    <!-- Quick now -->
    <section class="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
      <div class="text-xs opacity-70 mb-1">当前时间戳（可点击复制）</div>
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

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Timestamp → Date -->
      <section class="bg-white rounded-xl border border-slate-200 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">时间戳 → 日期</h3>
        <input
          v-model="tsInput"
          placeholder="输入时间戳（10位或13位）..."
          class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
        <div class="mt-3 p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 min-h-[48px]">
          {{ tsDate || '等待输入...' }}
        </div>
      </section>

      <!-- Date → Timestamp -->
      <section class="bg-white rounded-xl border border-slate-200 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">日期 → 时间戳</h3>
        <input
          v-model="dateInput"
          type="datetime-local"
          class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
        <div class="mt-3 p-3 bg-slate-50 rounded-lg font-mono text-sm min-h-[48px]">
          <div class="text-slate-600">秒级: <span class="text-indigo-600">{{ dateSec }}</span></div>
          <div class="text-slate-600 mt-1">毫秒级: <span class="text-indigo-600">{{ dateMs }}</span></div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// 当前时间
const now = ref(Date.now())
const nowSec = computed(() => Math.floor(now.value / 1000))
const nowMs = computed(() => now.value)
const nowDate = computed(() => formatDate(new Date(now.value)))

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
const tsDate = computed(() => {
  if (!tsInput.value) return ''
  let ts = Number(tsInput.value.trim())
  if (isNaN(ts)) return '无效时间戳'
  // 10位自动补成毫秒
  if (tsInput.value.trim().length === 10) ts *= 1000
  const d = new Date(ts)
  if (isNaN(d.getTime())) return '无效时间戳'
  return formatDate(d)
})

// Date → Timestamp
const dateInput = ref('')
const dateSec = computed(() => {
  if (!dateInput.value) return '-'
  const t = new Date(dateInput.value).getTime()
  return isNaN(t) ? '-' : Math.floor(t / 1000)
})
const dateMs = computed(() => {
  if (!dateInput.value) return '-'
  const t = new Date(dateInput.value).getTime()
  return isNaN(t) ? '-' : t
})

function formatDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function copyNow(digits: 10 | 13) {
  const v = digits === 10 ? nowSec.value : nowMs.value
  navigator.clipboard.writeText(String(v))
}
</script>
