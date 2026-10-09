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
