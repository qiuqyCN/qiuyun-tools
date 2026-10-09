<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-1 space-y-4">
      <h3 class="text-sm font-semibold text-slate-700">CSS 阴影生成器</h3>
      <div v-for="s in shadows" :key="s.id" class="p-3 rounded-lg border border-slate-100 space-y-2">
        <div class="text-xs font-medium text-slate-600">阴影 {{ s.id }}</div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div class="text-slate-500 mb-0.5">X 偏移</div>
            <input v-model.number="s.x" type="range" :min="-50" :max="50" class="w-full" />
          </div>
          <div>
            <div class="text-slate-500 mb-0.5">Y 偏移</div>
            <input v-model.number="s.y" type="range" :min="-50" :max="50" class="w-full" />
          </div>
          <div>
            <div class="text-slate-500 mb-0.5">模糊</div>
            <input v-model.number="s.blur" type="range" :min="0" :max="100" class="w-full" />
          </div>
          <div>
            <div class="text-slate-500 mb-0.5">扩展</div>
            <input v-model.number="s.spread" type="range" :min="-20" :max="30" class="w-full" />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <input v-model="s.color" type="color" class="w-8 h-8 rounded cursor-pointer" />
          <input v-model.number="s.opacity" type="range" min="0" max="100" class="flex-1" />
          <span class="text-slate-500 w-8">{{ s.opacity }}%</span>
        </div>
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-1 text-xs text-slate-500"><input v-model="s.inset" type="checkbox" class="rounded" />内阴影</label>
          <button v-if="shadows.length > 1" @click="shadows = shadows.filter(x => x.id !== s.id)" class="ml-auto text-xs text-red-400">× 删除</button>
        </div>
      </div>
      <button @click="addShadow" class="w-full h-9 text-xs rounded-lg bg-slate-100 hover:bg-slate-200">+ 添加阴影层</button>
    </section>

    <section class="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-2 flex flex-col">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">预览</h3>
      <div class="flex-1 bg-slate-50 rounded-lg flex items-center justify-center min-h-[200px]">
        <div
          class="w-40 h-40 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500"
          :style="{ boxShadow: cssShadow }"
        />
      </div>
      <div class="mt-4">
        <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>生成的 CSS</span>
          <CopyButton :text="'box-shadow: ' + cssShadow + ';'" label="复制" />
        </div>
        <pre class="p-3 rounded-lg bg-slate-900 text-indigo-300 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{{ 'box-shadow: ' + cssShadow + ';' }}</pre>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const shadows = ref([{ id: 1, x: 0, y: 4, blur: 14, spread: 0, color: '#000000', opacity: 15, inset: false }])
let nextId = 2

function addShadow() {
  shadows.value.push({ id: nextId++, x: 0, y: 8, blur: 24, spread: 0, color: '#000000', opacity: 10, inset: false })
}

function hexWithAlpha(hex: string, alpha: number) {
  const a = alpha / 100
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

const cssShadow = computed(() => {
  return shadows.value.map(s => {
    const parts = [s.x, s.y, s.blur, s.spread, hexWithAlpha(s.color, s.opacity)]
    return (s.inset ? 'inset ' : '') + parts.join('px ') + 'px'
  }).join(', ')
})
</script>
