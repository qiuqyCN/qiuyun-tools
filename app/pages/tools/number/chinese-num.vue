<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="flex flex-col lg:flex-row gap-4 items-stretch">
      <!-- 输入 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.number.chinese-num.inputLabel') }}</span>
          <button @click="input = example" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
        </div>
        <input
          v-model="input"
          :placeholder="$t('ui.number.chinese-num.placeholder')"
          class="w-full h-11 px-3 text-sm rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
        <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <label class="flex items-center gap-1"><input v-model="useYuan" type="checkbox" class="rounded" />{{ $t('ui.number.chinese-num.currencyMode') }}</label>
          <label class="flex items-center gap-1"><input v-model="simplified" type="checkbox" class="rounded" />{{ $t('ui.number.chinese-num.useSimplified') }}</label>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex lg:flex-col items-center justify-center gap-2 shrink-0">
        <CopyButton :text="result" :label="$t('common.copy')" />
        <button
          @click="input = ''"
          class="h-8 px-3 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >{{ $t('common.clear') }}</button>
      </div>

      <!-- 输出 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.number.chinese-num.resultLabel') }}</span>
        </div>
        <div
          v-if="result"
          class="p-4 bg-indigo-50 rounded-lg text-base font-semibold text-indigo-900 break-all border border-indigo-100 min-h-[60px]"
        >
          {{ result }}
        </div>
        <div
          v-else
          class="w-full min-h-[120px] rounded-lg bg-slate-50 text-slate-400 border border-slate-100 flex flex-col items-center justify-center gap-2 text-xs"
        >
          <component :is="icons.CircleDollarSign" class="w-8 h-8 text-slate-300" />
          <span>{{ $t('ui.number.chinese-num.emptyHint') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const example = `1234567.89`

const input = ref('')
const useYuan = ref(true)
const simplified = ref(false)

const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const digitsBig = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
const units = ['', '十', '百', '千']
const unitsBig = ['', '拾', '佰', '仟']
const bigUnits = ['', '万', '亿', '兆']
const currency = ['元', '角', '分']

function numToCn(numStr: string): string {
  const digitsArr = simplified.value ? digits : digitsBig
  const u = simplified.value ? units : unitsBig

  const num = Number(numStr)
  if (isNaN(num)) return t('ui.number.chinese-num.errInvalid')
  if (num === 0) return simplified.value ? '零' : '零'

  // 负数
  if (num < 0) return (simplified.value ? '负' : '负') + numToCn(String(-num))

  const [intPart, decPart] = numStr.split('.')

  // 整数部分
  let intResult = ''
  if (intPart && intPart !== '0') {
    const groups: string[] = []
    let s = intPart
    while (s.length > 0) {
      groups.unshift(s.slice(-4))
      s = s.slice(0, -4)
    }
    for (let gi = 0; gi < groups.length; gi++) {
      const group = groups[gi]
      let groupStr = ''
      const padding = group.length
      for (let i = 0; i < padding; i++) {
        const d = Number(group[i])
        const unitPos = padding - 1 - i
        if (d !== 0) {
          groupStr += digitsArr[d] + u[unitPos]
        } else if (groupStr && !groupStr.endsWith('零')) {
          groupStr += '零'
        }
      }
      groupStr = groupStr.replace(/零+$/, '')
      const bigU = bigUnits[groups.length - 1 - gi]
      if (groupStr) {
        intResult += groupStr + bigU
      } else if (intResult && !intResult.endsWith('零')) {
        intResult += '零'
      }
    }
    intResult = intResult.replace(/零+$/, '')
  }

  // 小数 / 金额
  if (useYuan.value) {
    let moneyResult = intResult ? intResult + (simplified.value ? '元' : '元') : ''
    if (decPart) {
      const jiao = Number(decPart[0])
      const fen = Number(decPart[1] || '0')
      if (jiao || fen) {
        if (jiao) moneyResult += digitsArr[jiao] + (simplified.value ? '角' : '角')
        else if (fen) moneyResult += '零'
        if (fen) moneyResult += digitsArr[fen] + (simplified.value ? '分' : '分')
      } else {
        moneyResult += '整'
      }
    } else if (intResult) {
      moneyResult += '整'
    }
    return moneyResult || '零元整'
  } else {
    let result = intResult || '零'
    if (decPart) {
      result += '点'
      for (const c of decPart) result += digitsArr[Number(c)]
    }
    return result
  }
}

const result = computed(() => {
  if (!input.value.trim()) return ''
  return numToCn(input.value.trim())
})
</script>
