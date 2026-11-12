<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Controls -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-1 space-y-3">
        <div class="text-xs font-medium text-slate-500 mb-1">{{ $t('ui.frontend.flex-box.layoutLabel') }}</div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">flex-direction</label>
          <select v-model="direction" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
            <option v-for="d in directions" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">justify-content</label>
          <select v-model="justify" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
            <option v-for="j in values" :key="j" :value="j">{{ j }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">align-items</label>
          <select v-model="items" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
            <option v-for="j in values" :key="j" :value="j">{{ j }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">flex-wrap</label>
          <select v-model="wrap" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
            <option value="nowrap">nowrap</option>
            <option value="wrap">wrap</option>
            <option value="wrap-reverse">wrap-reverse</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">gap: {{ gap }}px</label>
          <input v-model.number="gap" type="range" min="0" max="32" class="w-full" />
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.frontend.flex-box.childCount', { count }) }}</label>
          <input v-model.number="count" type="range" min="1" max="12" class="w-full" />
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.frontend.flex-box.childFlex') }}</label>
          <div class="flex gap-2">
            <input v-model="itemFlex" :placeholder="$t('ui.frontend.flex-box.childFlexPlaceholder')" class="flex-1 h-9 px-2 text-sm rounded-lg border border-slate-200 font-mono" />
          </div>
        </div>
      </div>

      <!-- Preview + Code -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center gap-2 mb-2">
            <component :is="icons.Eye" class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.frontend.flex-box.previewLabel') }}</span>
          </div>
          <div class="h-60 bg-slate-50 rounded-lg p-4 border border-slate-100" :style="previewStyle">
            <div
              v-for="i in count"
              :key="i"
              class="h-16 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-sm font-bold flex items-center justify-center shadow-sm"
              :style="{ flex: itemFlex || '0 0 auto', minWidth: 48 }"
            >{{ i }}</div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span class="flex items-center gap-1"><component :is="icons.Code" class="w-3.5 h-3.5" />CSS</span>
            <CopyButton :text="css" :label="$t('common.copy')" />
          </div>
          <pre class="p-3 rounded-lg bg-slate-900 text-indigo-300 text-xs font-mono whitespace-pre-wrap">{{ css }}</pre>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
const directions = ['row', 'row-reverse', 'column', 'column-reverse']
const values = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'stretch']

const direction = ref('row')
const justify = ref('center')
const items = ref('center')
const wrap = ref('nowrap')
const gap = ref(12)
const count = ref(4)
const itemFlex = ref('1')

const previewStyle = computed(() => ({
  display: 'flex',
  flexDirection: direction.value,
  justifyContent: justify.value,
  alignItems: items.value,
  flexWrap: wrap.value,
  gap: gap.value + 'px',
}))

const css = computed(() => {
  let c = `.container {\n  display: flex;\n  flex-direction: ${direction.value};\n  justify-content: ${justify.value};\n  align-items: ${items.value};\n  flex-wrap: ${wrap.value};\n  gap: ${gap.value}px;\n}`
  if (itemFlex.value) c += `\n\n.item {\n  flex: ${itemFlex.value};\n}`
  return c
})
</script>
