<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">进制转换</h3>
      <span class="text-xs text-slate-400">二进制 / 八进制 / 十进制 / 十六进制互转</span>
    </div>

    <div class="space-y-4">
      <!-- 转换器 -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-slate-500">进制输入</span>
          <button @click="loadExample" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div v-for="base in bases" :key="base.value">
            <label class="block text-xs text-slate-500 mb-1">{{ base.label }}</label>
            <input
              v-model="values[base.value]"
              @focus="focused = base.value"
              @input="onInput(base.value)"
              :placeholder="base.value === 10 ? '0-9' : base.placeholder"
              :pattern="base.pattern"
              class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
        </div>
      </div>

      <!-- 对照表 -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-slate-500">常用进制对照表 (0 - 20)</span>
        </div>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-xs text-slate-400 border-b border-slate-100">
              <th class="text-left py-2">二进制</th>
              <th class="text-left py-2">八进制</th>
              <th class="text-left py-2">十进制</th>
              <th class="text-left py-2">十六进制</th>
            </tr>
          </thead>
          <tbody class="font-mono">
            <tr
              v-for="row in quickTable"
              :key="row.dec"
              class="border-b border-slate-50 hover:bg-slate-50"
            >
              <td class="py-2 text-slate-600">{{ row.bin }}</td>
              <td class="py-2 text-slate-600">{{ row.oct }}</td>
              <td class="py-2 text-indigo-600 font-semibold">{{ row.dec }}</td>
              <td class="py-2 text-slate-600">{{ row.hex }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

function loadExample() {
  values[10] = '255'
  onInput(10)
}

const bases = [
  { value: 2, label: '二进制 (Bin)', pattern: '[01]*', placeholder: '0-1' },
  { value: 8, label: '八进制 (Oct)', pattern: '[0-7]*', placeholder: '0-7' },
  { value: 10, label: '十进制 (Dec)', pattern: '[0-9]*', placeholder: '0-9' },
  { value: 16, label: '十六进制 (Hex)', pattern: '[0-9a-fA-F]*', placeholder: '0-9, A-F' },
]

const values = reactive<Record<number, string>>({ 2: '', 8: '', 10: '', 16: '' })
const focused = ref<number>(10)

function onInput(base: number) {
  focused.value = base
  const raw = values[base].trim()
  if (!raw) {
    for (const b of bases) values[b.value] = ''
    return
  }
  const dec = parseInt(raw, base)
  if (isNaN(dec)) return
  values[2] = dec.toString(2)
  values[8] = dec.toString(8)
  values[10] = dec.toString(10)
  values[16] = dec.toString(16).toUpperCase()
}

const quickTable = computed(() => {
  const rows: { bin: string; oct: string; dec: number; hex: string }[] = []
  for (let i = 0; i <= 20; i++) {
    rows.push({
      bin: i.toString(2).padStart(5, '0'),
      oct: i.toString(8),
      dec: i,
      hex: i.toString(16).toUpperCase(),
    })
  }
  return rows
})
</script>
