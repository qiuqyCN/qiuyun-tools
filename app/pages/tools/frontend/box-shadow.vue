<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">CSS 阴影生成器</h3>
      <span class="text-xs text-slate-400">可视化调试 box-shadow，支持多层叠加</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-1 space-y-3">
        <div class="text-xs font-medium text-slate-500 mb-1">阴影配置</div>
        <div v-for="s in shadows" :key="s.id" class="p-3 rounded-lg border border-slate-100 space-y-2 bg-slate-50/50">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <component :is="icons.Layers" class="w-3 h-3" />
              阴影层 {{ s.id }}
            </span>
            <button v-if="shadows.length > 1" @click="shadows = shadows.filter(x => x.id !== s.id)" class="text-xs text-red-400 hover:text-red-500">
              <component :is="icons.X" class="w-3 h-3" />
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div class="text-slate-500 mb-0.5">X: {{ s.x }}</div>
              <input v-model.number="s.x" type="range" :min="-50" :max="50" class="w-full" />
            </div>
            <div>
              <div class="text-slate-500 mb-0.5">Y: {{ s.y }}</div>
              <input v-model.number="s.y" type="range" :min="-50" :max="50" class="w-full" />
            </div>
            <div>
              <div class="text-slate-500 mb-0.5">模糊: {{ s.blur }}</div>
              <input v-model.number="s.blur" type="range" :min="0" :max="100" class="w-full" />
            </div>
            <div>
              <div class="text-slate-500 mb-0.5">扩展: {{ s.spread }}</div>
              <input v-model.number="s.spread" type="range" :min="-20" :max="30" class="w-full" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input v-model="s.color" type="color" class="w-8 h-8 rounded cursor-pointer" />
            <input v-model.number="s.opacity" type="range" min="0" max="100" class="flex-1" />
            <span class="text-slate-500 w-8">{{ s.opacity }}%</span>
          </div>
          <label class="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
            <input v-model="s.inset" type="checkbox" class="rounded" />内阴影 (inset)
          </label>
        </div>
        <button
          @click="addShadow"
          class="w-full h-10 px-5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium flex items-center justify-center gap-1.5 transition"
        >
          <component :is="icons.Plus" class="w-4 h-4" />
          添加阴影层
        </button>
      </div>

      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-2 flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.Eye" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">预览</span>
        </div>
        <div class="flex-1 bg-slate-50 rounded-lg flex items-center justify-center min-h-[200px] border border-slate-100">
          <div
            class="w-40 h-40 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500"
            :style="{ boxShadow: cssShadow }"
          />
        </div>
        <div class="mt-4">
          <div class="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span class="flex items-center gap-1"><component :is="icons.Code" class="w-3.5 h-3.5" />生成的 CSS</span>
            <CopyButton :text="'box-shadow: ' + cssShadow + ';'" label="复制" />
          </div>
          <pre class="p-3 rounded-lg bg-slate-900 text-indigo-300 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{{ 'box-shadow: ' + cssShadow + ';' }}</pre>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
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
