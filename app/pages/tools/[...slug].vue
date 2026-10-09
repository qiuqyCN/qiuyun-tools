<template>
  <ToolLayout
    v-if="toolInfo"
    :category-name="toolInfo.category.name"
    :tool-name="toolInfo.tool.name"
    :description="toolInfo.tool.desc"
    :icon="toolInfo.tool.icon"
  >
    <div v-if="loading" class="py-12 text-center text-slate-400">加载中...</div>
    <div v-else-if="comp" class="tool-content">
      <component :is="comp" />
    </div>
    <Placeholder v-else :tool="toolInfo.tool" />
  </ToolLayout>
  <NuxtLink v-else to="/" class="block p-8 text-center text-indigo-600">
    工具不存在，返回首页
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { findTool, loadToolComponent } from '~/data/tools'

const route = useRoute()

// slug 形如 ['dev', 'json-formatter']
const slug = computed(() => route.params.slug as string[] | undefined)

const toolInfo = computed(() => {
  if (!slug.value || slug.value.length < 2) return null
  const [, toolId] = slug.value
  return findTool(toolId)
})

const loading = ref(false)
const comp = ref<any>(null)

async function load() {
  comp.value = null
  if (!toolInfo.value) return
  loading.value = true
  try {
    const c = await loadToolComponent(toolInfo.value.category.id, toolInfo.value.tool.id)
    comp.value = c
  } catch {
    comp.value = null
  } finally {
    loading.value = false
  }
}

watch(() => route.fullPath, load, { immediate: true })
</script>

<style scoped>
.tool-content {
  animation: fadeIn 0.25s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
