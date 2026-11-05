<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">薪资计算器</h3>
      <span class="text-xs text-slate-400">五险一金 · 专项附加扣除 · 个税 · 实发工资明细</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- 输入区 -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-slate-500">薪资参数</span>
          <button @click="loadExample" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
        </div>
        <div class="space-y-3">
          <div>
            <label class="block text-xs text-slate-500 mb-1">税前月薪 (元)</label>
            <input v-model.number="salary" type="number" class="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">城市</label>
            <select v-model="city" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm">
              <option v-for="c in cities" :key="c.name" :value="c.name">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">社保公积金基数 (默认同月薪)</label>
            <input v-model.number="base" type="number" class="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
            <div class="text-[11px] text-slate-400 mt-0.5">当前城市基数上限：{{ currentCity.base }} 元（超出按上限计算）</div>
          </div>
          <div class="pt-2 border-t border-slate-100">
            <div class="text-xs font-medium text-slate-500 mb-2">专项附加扣除 / 月（元）</div>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="d in deductions" :key="d.key">
                <label class="block text-[11px] text-slate-500 mb-0.5">{{ d.label }}</label>
                <input v-model.number="d.value" type="number" class="w-full h-8 px-2 rounded-md border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            </div>
          </div>
          <div class="pt-2 border-t border-slate-100">
            <div class="text-xs font-medium text-slate-500 mb-2">年终奖（可选）</div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] text-slate-500 mb-0.5">金额 (元)</label>
                <input v-model.number="bonus" type="number" class="w-full h-8 px-2 rounded-md border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label class="block text-[11px] text-slate-500 mb-0.5">计税方式</label>
                <select v-model="bonusMode" class="w-full h-8 px-2 rounded-md border border-slate-200 bg-white text-xs">
                  <option value="single">单独计税</option>
                  <option value="combined">并入综合</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 结果区 -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
          <div>
            <div class="text-xs text-slate-500">本月实发工资</div>
            <div class="text-2xl font-bold text-indigo-600 font-mono">{{ netSalary.toFixed(2) }} 元</div>
          </div>
          <div class="text-right">
            <div class="text-xs text-slate-500">本月个税</div>
            <div class="text-lg font-semibold text-orange-500 font-mono">{{ tax.toFixed(2) }}</div>
          </div>
        </div>

        <table class="w-full text-sm">
          <thead>
            <tr class="text-xs text-slate-400 border-b border-slate-100">
              <th class="text-left py-1.5">项目</th>
              <th class="text-right py-1.5">个人</th>
              <th class="text-right py-1.5">公司</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in rows" :key="i" class="border-b border-slate-50">
              <td class="py-1.5 text-slate-600 text-sm">{{ r.name }}</td>
              <td class="py-1.5 text-right font-mono text-slate-700 text-sm">{{ r.personal.toFixed(2) }}</td>
              <td class="py-1.5 text-right font-mono text-slate-700 text-sm">{{ r.company.toFixed(2) }}</td>
            </tr>
          </tbody>
          <tfoot class="font-semibold">
            <tr class="border-t border-slate-200">
              <td class="py-2 text-xs">社保公积金合计</td>
              <td class="py-2 text-right text-red-500">{{ totalPersonal.toFixed(2) }}</td>
              <td class="py-2 text-right text-indigo-600">{{ totalCompany.toFixed(2) }}</td>
            </tr>
            <tr>
              <td class="py-2 text-xs">专项附加扣除</td>
              <td class="py-2 text-right text-green-600">−{{ totalDeduction.toFixed(2) }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="py-2 text-xs">应纳税所得额</td>
              <td class="py-2 text-right font-mono text-slate-500">{{ taxable.toFixed(2) }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="py-2 text-xs">个人所得税</td>
              <td class="py-2 text-right text-orange-500">{{ tax.toFixed(2) }}</td>
              <td></td>
            </tr>
            <tr class="bg-indigo-50/50">
              <td class="py-2.5 text-indigo-700 text-sm font-bold">实发工资</td>
              <td class="py-2.5 text-right text-indigo-600 font-bold text-lg">{{ netSalary.toFixed(2) }}</td>
              <td></td>
            </tr>
            <tr v-if="bonus > 0">
              <td class="py-2 text-xs">年终奖个税</td>
              <td class="py-2 text-right text-orange-500">{{ bonusTax.toFixed(2) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <div class="mt-3 p-2 bg-slate-50 rounded-lg text-[11px] text-slate-400 leading-relaxed">
          {{ currentCity.name }}参考比例：养老 {{ currentCity.pension }}% / 医疗 {{ currentCity.medical }}% / 失业 {{ currentCity.unemploy }}% / 公积金 {{ currentCity.fund }}%（个人）。实际以当地政策为准，仅供参考。
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const cities = [
  { name: '北京', base: 36130, pension: 16, medical: 10, unemploy: 0.5, fund: 12 },
  { name: '上海', base: 36549, pension: 16, medical: 9.5, unemploy: 0.5, fund: 7 },
  { name: '广州', base: 36103, pension: 14, medical: 5.5, unemploy: 0.32, fund: 12 },
  { name: '深圳', base: 38892, pension: 14, medical: 5.2, unemploy: 0.42, fund: 12 },
  { name: '杭州', base: 36600, pension: 14, medical: 9.9, unemploy: 0.5, fund: 12 },
  { name: '成都', base: 28405, pension: 16, medical: 7.7, unemploy: 0.6, fund: 12 },
  { name: '默认', base: 30000, pension: 16, medical: 9.5, unemploy: 0.5, fund: 12 },
]

const salary = ref(15000)
const city = ref('北京')
const base = ref(15000)
const bonus = ref(0)
const bonusMode = ref<'single' | 'combined'>('single')

const deductions = reactive([
  { key: 'child', label: '子女教育', value: 0 },
  { key: 'housing', label: '住房贷款/租金', value: 0 },
  { key: 'elder', label: '赡养老人', value: 0 },
  { key: 'continue', label: '继续教育', value: 0 },
  { key: 'illness', label: '大病医疗', value: 0 },
  { key: 'care', label: '婴幼儿照护', value: 0 },
])

const currentCity = computed(() => cities.find(c => c.name === city.value) || cities[cities.length - 1])

// 实际基数：取 月薪 和 城市上限 的较小值
const actualBase = computed(() => Math.min(base.value || 0, currentCity.value.base))

const rates = computed(() => [
  { name: '养老保险', personalPct: 8, companyPct: currentCity.value.pension },
  { name: '医疗保险', personalPct: 2, companyPct: currentCity.value.medical },
  { name: '失业保险', personalPct: 0.5, companyPct: currentCity.value.unemploy },
  { name: '公积金', personalPct: currentCity.value.fund, companyPct: currentCity.value.fund },
])

const rows = computed(() => rates.value.map(r => ({
  ...r,
  personal: (actualBase.value * r.personalPct) / 100,
  company: (actualBase.value * r.companyPct) / 100,
})))

const totalPersonal = computed(() => rows.value.reduce((s, r) => s + r.personal, 0))
const totalCompany = computed(() => rows.value.reduce((s, r) => s + r.company, 0))
const totalDeduction = computed(() => deductions.reduce((s, d) => s + (d.value || 0), 0))

const taxable = computed(() => Math.max(0, salary.value - totalPersonal.value - totalDeduction.value - 5000))

function calcTax(t: number): number {
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
  return Math.max(0, t * b.rate - b.quick)
}

const tax = computed(() => calcTax(taxable.value))
const netSalary = computed(() => salary.value - totalPersonal.value - tax.value)

// 年终奖个税
const bonusTax = computed(() => {
  if (bonus.value <= 0) return 0
  if (bonusMode.value === 'combined') {
    // 并入综合：把年终奖加到 taxable 里算税，再减去正常税
    return calcTax(taxable.value + bonus.value) - tax.value
  }
  // 单独计税：bonus / 12 找税率
  const monthly = bonus.value / 12
  const brackets = [
    { limit: 3000, rate: 0.03, quick: 0 },
    { limit: 12000, rate: 0.10, quick: 210 },
    { limit: 25000, rate: 0.20, quick: 1410 },
    { limit: 35000, rate: 0.25, quick: 2660 },
    { limit: 55000, rate: 0.30, quick: 4410 },
    { limit: 80000, rate: 0.35, quick: 7160 },
    { limit: Infinity, rate: 0.45, quick: 15160 },
  ]
  const b = brackets.find(b => monthly <= b.limit)!
  return Math.max(0, bonus.value * b.rate - b.quick)
})

function loadExample() {
  salary.value = 20000
  city.value = '北京'
  base.value = 20000
  bonus.value = 30000
  deductions.forEach(d => { d.value = 0 })
  deductions[0].value = 1000  // 子女教育
  deductions[1].value = 1000  // 房贷
  deductions[2].value = 2000  // 赡养老人
}
</script>
