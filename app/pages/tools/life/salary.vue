<template>
  <div class="max-w-2xl mx-auto space-y-5">
    <section class="bg-white rounded-xl border border-slate-200 p-5 grid grid-cols-2 gap-4">
      <div>
        <label class="block text-xs text-slate-500 mb-1">税前月薪 (元)</label>
        <input v-model.number="salary" type="number" class="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono" />
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">城市</label>
        <select v-model="city" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm">
          <option v-for="c in cities" :key="c.name" :value="c.name">{{ c.name }} (基数 {{ c.base }})</option>
        </select>
      </div>
      <div class="col-span-2">
        <label class="block text-xs text-slate-500 mb-1">公积金基数 (默认同月薪)</label>
        <input v-model.number="fundBase" type="number" class="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono" />
      </div>
    </section>

    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-4">明细</h3>
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-slate-400 border-b border-slate-100">
            <th class="text-left py-2">项目</th>
            <th class="text-right py-2">个人</th>
            <th class="text-right py-2">公司</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="i" class="border-b border-slate-50">
            <td class="py-2 text-slate-600">{{ r.name }} ({{ r.personalPct }}% / {{ r.companyPct }}%)</td>
            <td class="py-2 text-right font-mono text-slate-700">{{ r.personal.toFixed(2) }}</td>
            <td class="py-2 text-right font-mono text-slate-700">{{ r.company.toFixed(2) }}</td>
          </tr>
        </tbody>
        <tfoot class="font-semibold">
          <tr class="border-t border-slate-200">
            <td class="py-3">合计</td>
            <td class="py-3 text-right text-red-500">{{ totalPersonal.toFixed(2) }}</td>
            <td class="py-3 text-right text-indigo-600">{{ totalCompany.toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="py-3">个税</td>
            <td class="py-3 text-right text-orange-500">{{ tax.toFixed(2) }}</td>
            <td></td>
          </tr>
          <tr>
            <td class="py-3 text-indigo-600">实发工资</td>
            <td class="py-3 text-right text-indigo-600 text-lg">{{ netSalary.toFixed(2) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
const cities = [
  { name: '北京', base: 30000 }, { name: '上海', base: 34000 },
  { name: '广州', base: 36072 }, { name: '深圳', base: 34860 },
  { name: '杭州', base: 36600 }, { name: '默认', base: 20000 },
]

const salary = ref(15000)
const city = ref('默认')
const fundBase = computed({ get: () => salary.value, set: (v) => salary.value = v })

// 社保公积金比例（个人 / 公司）
const rates = [
  { name: '养老保险', personalPct: 8, companyPct: 16 },
  { name: '医疗保险', personalPct: 2, companyPct: 9.5 },
  { name: '失业保险', personalPct: 0.5, companyPct: 0.5 },
  { name: '公积金', personalPct: 12, companyPct: 12 },
]

const rows = computed(() => {
  const base = Math.min(salary.value, cities.find(c => c.name === city.value)?.base || 20000)
  return rates.map(r => ({
    ...r,
    personal: (base * r.personalPct) / 100,
    company: (base * r.companyPct) / 100,
  }))
})

const totalPersonal = computed(() => rows.value.reduce((s, r) => s + r.personal, 0))
const totalCompany = computed(() => rows.value.reduce((s, r) => s + r.company, 0))

// 个税计算（简化版）
const taxable = computed(() => Math.max(0, salary.value - totalPersonal.value - 5000))
const tax = computed(() => {
  const t = taxable.value
  if (t <= 0) return 0
  const brackets = [
    { limit: 3000, rate: 0.03, quick: 0 },
    { limit: 12000, rate: 0.10, quick: 210 },
    { limit: 25000, rate: 0.20, quick: 1410 },
    { limit: 35000, rate: 0.25, quick: 2660 },
    { limit: 55000, rate: 0.30, quick: 4410 },
    { limit: 80000, rate: 0.35, quick: 7160 },
    { limit: Infinity, rate: 0.45, quick: 15160 },
  ]
  const b = brackets.find(b => t <= b.limit)!
  return t * b.rate - b.quick
})

const netSalary = computed(() => salary.value - totalPersonal.value - tax.value)
</script>
