<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">CSS 动画生成器</h3>
      <span class="text-xs text-slate-400">选择常见动画类型，调整参数并实时预览</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-1 space-y-3">
        <div class="text-xs font-medium text-slate-500 mb-1">动画配置</div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">动画类型</label>
          <select v-model="preset" @change="applyPreset" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
            <option value="fade">淡入淡出</option>
            <option value="slide">滑动</option>
            <option value="bounce">弹跳</option>
            <option value="pulse">脉冲</option>
            <option value="rotate">旋转</option>
            <option value="shake">抖动</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label class="block text-slate-400 mb-0.5">时长 (s)</label>
            <input v-model.number="duration" type="number" step="0.1" class="w-full h-8 px-2 rounded border border-slate-200 font-mono" />
          </div>
          <div>
            <label class="block text-slate-400 mb-0.5">延迟 (s)</label>
            <input v-model.number="delay" type="number" step="0.1" class="w-full h-8 px-2 rounded border border-slate-200 font-mono" />
          </div>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">缓动函数</label>
          <select v-model="timing" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
            <option v-for="t in timings" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">迭代次数</label>
          <input v-model="count" class="w-full h-8 px-2 rounded border border-slate-200 font-mono text-sm" />
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">方向</label>
          <select v-model="direction" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
            <option value="normal">normal</option>
            <option value="reverse">reverse</option>
            <option value="alternate">alternate</option>
            <option value="alternate-reverse">alternate-reverse</option>
          </select>
        </div>
        <label class="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
          <input v-model="running" type="checkbox" class="rounded" />
          运行动画
        </label>
      </div>

      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-2 flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.Eye" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">预览</span>
        </div>
        <div class="flex-1 bg-slate-50 rounded-lg flex items-center justify-center min-h-[200px] border border-slate-100">
          <div
            class="w-24 h-24 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500"
            :style="boxStyle"
          />
        </div>
        <div class="mt-4">
          <div class="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span class="flex items-center gap-1"><component :is="icons.Code" class="w-3.5 h-3.5" />生成的 CSS</span>
            <CopyButton :text="fullCss" label="复制" />
          </div>
          <pre class="p-3 rounded-lg bg-slate-900 text-indigo-300 text-xs font-mono whitespace-pre-wrap overflow-auto max-h-48">{{ fullCss }}</pre>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
const presets: Record<string, string> = {
  fade: '@keyframes fade {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}',
  slide: '@keyframes slide {\n  from { transform: translateX(-100px); opacity: 0; }\n  to { transform: translateX(0); opacity: 1; }\n}',
  bounce: '@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-30px); }\n}',
  pulse: '@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.1); }\n}',
  rotate: '@keyframes rotate {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}',
  shake: '@keyframes shake {\n  0%, 100% { transform: translateX(0); }\n  25% { transform: translateX(-8px); }\n  75% { transform: translateX(8px); }\n}',
}

const preset = ref('fade')
const keyframes = ref(presets.fade)
const name = ref('fade')
const duration = ref(1)
const delay = ref(0)
const timings = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier(0.68, -0.55, 0.265, 1.55)']
const timing = ref('ease')
const count = ref('infinite')
const direction = ref('normal')
const running = ref(true)

function applyPreset() {
  keyframes.value = presets[preset.value]
  name.value = preset.value
}

const boxStyle = computed(() => ({
  animation: running.value
    ? `${name.value} ${duration.value}s ${timing.value} ${delay.value}s ${count.value} ${direction.value}`
    : 'none',
}))

const fullCss = computed(() => {
  return `${keyframes.value}\n\n.element {\n  animation: ${name.value} ${duration.value}s ${timing.value} ${delay.value}s ${count.value} ${direction.value};\n}`
})
</script>
