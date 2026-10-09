<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">数字转中文大写</h3>
      <input
        v-model="input"
        placeholder="输入数字（整数或小数，支持负数）..."
        class="w-full h-11 px-3 text-sm rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div class="mt-3 flex items-center gap-3 text-xs text-slate-500">
        <label class="flex items-center gap-1"><input v-model="useYuan" type="checkbox" class="rounded" />金额模式（元/角/分）</label>
        <label class="flex items-center gap-1"><input v-model="simplified" type="checkbox" class="rounded" />使用简体</label>
      </div>
    </section>
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">转换结果</h3>
        <CopyButton :text="result" label="复制" />
      </div>
      <div class="p-4 bg-indigo-50 rounded-lg text-base font-semibold text-indigo-900 break-all min-h-[60px]">
        {{ result || '等待输入...' }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
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
  if (isNaN(num)) return '无效数字'
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
