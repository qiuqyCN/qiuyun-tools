<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Controls -->
    <section class="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-1 space-y-4">
      <h3 class="text-sm font-semibold text-slate-700">Flex 布局生成器</h3>

      <div>
        <label class="block text-xs text-slate-500 mb-1">flex-direction</label>
        <select v-model="direction" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
          <option v-for="d in directions" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">justify-content</label>
        <select v-model="justify" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
          <option v-for="j in values" :key="j" :value="j">{{ j }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">align-items</label>
        <select v-model="items" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
          <option v-for="j in values" :key="j" :value="j">{{ j }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">flex-wrap</label>
        <select v-model="wrap" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
          <option value="nowrap">nowrap</option>
          <option value="wrap">wrap</option>
          <option value="wrap-reverse">wrap-reverse</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">gap: {{ gap }}px</label>
        <input v-model.number="gap" type="range" min="0" max="32" class="w-full" />
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">子元素数量</label>
        <input v-model.number="count" type="range" min="1" max="12" class="w-full" />
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">子元素 flex 值</label>
        <div class="flex gap-2">
          <input v-model="itemFlex" placeholder="如 1" class="flex-1 h-9 px-2 text-sm rounded-lg border border-slate-200 font-mono" />
        </div>
      </div>
    </section>

    <!-- Preview + Code -->
    <section class="lg:col-span-2 space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">实时预览</h3>
        <div class="h-60 bg-slate-50 rounded-lg p-4 border border-slate-100" :style="previewStyle">
          <div
            v-for="i in count"
            :key="i"
            class="h-16 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-sm font-bold flex items-center justify-center"
            :style="{ flex: itemFlex || '0 0 auto', minWidth: 48 }"
          >{{ i }}</div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>CSS</span>
          <CopyButton :text="css" label="复制" />
        </div>
        <pre class="p-3 rounded-lg bg-slate-900 text-indigo-300 text-xs font-mono whitespace-pre-wrap">{{ css }}</pre>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
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
