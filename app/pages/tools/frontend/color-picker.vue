<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">颜色选择器</h3>
      <span class="text-xs text-slate-400">选色并查看 HEX/RGB/HSL 转换与调色板</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-3">
          <component :is="icons.Pipette" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">颜色选择</span>
        </div>
        <div class="flex items-start gap-4">
          <input v-model="color" type="color" class="w-24 h-24 rounded-lg border border-slate-200 cursor-pointer" />
          <div class="flex-1 space-y-2">
            <div>
              <div class="text-xs text-slate-400 mb-1">HEX</div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-slate-400">#</span>
                <input v-model="hex" class="flex-1 h-9 px-2 rounded-lg border border-slate-200 font-mono" />
              </div>
            </div>
            <InfoRow label="RGB" :value="rgb" />
            <InfoRow label="HSL" :value="hsl" />
          </div>
        </div>
        <div class="mt-5">
          <div class="text-xs font-medium text-slate-500 mb-2">调色板</div>
          <div class="grid grid-cols-9 gap-1.5 text-center">
            <div
              v-for="(c, i) in palette"
              :key="i"
              @click="color = c"
              class="h-10 rounded-lg cursor-pointer hover:scale-105 transition relative group"
              :style="{ backgroundColor: c }"
            >
              <span class="absolute inset-x-0 top-full mt-1 text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 z-10">{{ c }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-3">
          <component :is="icons.Palette" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">语义卡片颜色</span>
        </div>
        <div class="space-y-2.5">
          <div
            v-for="(c, i) in semantic"
            :key="i"
            class="flex items-center gap-3"
          >
            <div class="w-20 h-10 rounded-lg shadow-sm" :style="{ backgroundColor: c.bg }"></div>
            <div class="flex-1">
              <div class="text-sm font-medium" :style="{ color: c.text }">{{ c.name }}</div>
              <div class="text-xs font-mono text-slate-400">{{ c.bg }} · {{ c.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import InfoRow from '~/components/InfoRow.vue'
import chroma from 'chroma-js'

const color = ref('#6366f1')
const hex = computed({ get: () => color.value.toUpperCase(), set: v => { try { chroma(v); color.value = v } catch {} } })
const rgb = computed(() => chroma(color.value).rgb().join(', '))
const hsl = computed(() => chroma(color.value).hsl().map(n => Math.round(n)).join(', '))

const palette = computed(() => chroma.scale(['#ffffff', color.value, '#000000']).mode('lab').colors(9))

const semantic = computed(() => {
  const base = chroma(color.value)
  return [
    { name: '背景', bg: base.luminance(0.97).hex(), text: base.luminance(0.55).hex() },
    { name: '主色', bg: base.hex(), text: base.luminance() > 0.5 ? '#000000' : '#ffffff' },
    { name: '辅助', bg: base.brighten(0.6).hex(), text: base.brighten(0.1).hex() },
    { name: '暗色', bg: base.darken(0.6).hex(), text: base.darken(0.15).hex() },
  ]
})
</script>
