<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Regex Input -->
    <section class="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-1">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">正则表达式</h3>
      <div class="flex items-center gap-1">
        <span class="text-xl text-slate-400 font-mono">/</span>
        <input
          v-model="pattern"
          placeholder="输入正则..."
          class="flex-1 h-11 px-3 text-sm font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
        <span class="text-xl text-slate-400 font-mono">/</span>
        <input
          v-model="flags"
          placeholder="gim"
          class="w-16 h-11 px-2 text-sm font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>
      <div v-if="regexError" class="mt-2 text-xs text-red-500">{{ regexError }}</div>
      <div class="mt-4 space-y-2 text-xs text-slate-500">
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

      <!-- Quick presets -->
      <div class="mt-5 pt-4 border-t border-slate-100">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-medium text-slate-600">常用正则速查</div>
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
    </section>

    <!-- Test Text + Results -->
    <section class="lg:col-span-2 space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">测试文本</h3>
        <textarea
          v-model="testText"
          placeholder="输入要匹配的文本..."
          class="w-full h-44 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">匹配结果（{{ matches.length }} 个）</h3>
        <div v-if="matches.length" class="flex flex-wrap gap-1.5">
          <span
            v-for="(m, i) in matches"
            :key="i"
            class="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-mono text-xs border border-indigo-200"
            :title="'位置: ' + m.index + (m.groups?.length ? ', 分组: ' + m.groups : '')"
          >{{ m.value }}</span>
        </div>
        <div v-else class="py-8 text-center text-slate-400">
          {{ regexError || '没有匹配' }}
        </div>
      </div>

      <!-- Group details -->
      <div v-if="matches.some(m => m.groups?.length)" class="bg-white rounded-xl border border-slate-200 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">分组详情</h3>
        <table class="w-full text-xs font-mono">
          <thead>
            <tr class="text-slate-400 border-b border-slate-100">
              <th class="text-left py-2">序号</th>
              <th class="text-left py-2">完整匹配</th>
              <th class="text-left py-2">分组</th>
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
    </section>
  </div>
</template>

<script setup lang="ts">
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

const presets: Preset[] = [
  { name: '邮箱', pattern: '[\\w.-]+@[\\w.-]+\\.\\w+', flags: 'g', text: '联系方式:\nhello@example.com\nadmin@company.org\nwrong-email' },
  { name: '手机号', pattern: '1[3-9]\\d{9}', flags: 'g', text: '电话:\n13812345678\n15900001111\n12345678901' },
  { name: 'URL', pattern: 'https?:\\/\\/[\\w.-]+(?:\\/[\\w./-]*)?', flags: 'gi', text: '链接:\nhttps://example.com\nhttp://api.dev/v1/users\nnot-a-url' },
  { name: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g', text: '服务器:\n192.168.1.1\n10.0.0.255\n999.1.1.1' },
  { name: '身份证', pattern: '[1-9]\\d{5}(?:19|20)\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]', flags: 'g', text: '身份证:\n110101199003074512\n310101198512156789' },
  { name: '中文字符', pattern: '[\\u4e00-\\u9fa5]+', flags: 'g', text: 'Hello 你好世界 foo 测试 bar 中文' },
  { name: '日期 YYYY-MM-DD', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', flags: 'g', text: '日期:\n2024-01-15\n2023-12-31\n2024-13-40' },
  { name: '时间 HH:MM:SS', pattern: '(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?', flags: 'g', text: '时间:\n09:30\n14:25:59\n25:60' },
  { name: 'HTML 标签', pattern: '<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>(.*?)<\\/\\1>', flags: 'gs', text: '<div class="box">内容</div>\n<p>段落</p>\n<br/>' },
  { name: '十六进制颜色', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: 'gi', text: '颜色:\n#fff\n#1a2B3C\n#invalid' },
  { name: '数字（含小数）', pattern: '-?\\d+(?:\\.\\d+)?', flags: 'g', text: '数值:\n42\n-3.14\n100\n0.5' },
  { name: '用户名', pattern: '[a-zA-Z][a-zA-Z0-9_]{2,15}', flags: 'g', text: '用户:\nadmin\nuser_01\na\ntoo-long-name-12345' },
]

function applyPreset(p: Preset) {
  pattern.value = p.pattern
  flags.value = p.flags
  testText.value = p.text
}

const flagOptions = [
  { value: 'g', desc: '全局匹配' },
  { value: 'i', desc: '忽略大小写' },
  { value: 'm', desc: '多行模式' },
  { value: 's', desc: '. 匹配换行' },
]

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
    regexError.value = '正则语法错误: ' + e?.message
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
