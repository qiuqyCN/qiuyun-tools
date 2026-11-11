<template>
  <ToolLayout
    v-if="toolInfo"
    :category-name="toolInfo.category.name"
    :tool-name="toolInfo.tool.name"
    :description="toolInfo.tool.desc"
    :icon="toolInfo.tool.icon"
  >
    <!-- 工具面板：comp 为 null 时 SSR 不输出，客户端水合后动态加载并替换 -->
    <div v-if="comp" class="tool-content">
      <component :is="comp" />
    </div>
    <!-- 加载中和 Placeholder 只在客户端出现，避免 SSR 输出占位 HTML -->
    <ClientOnly>
      <div v-if="loading" class="py-12 text-center text-slate-400">{{ $t('common.loading') }}</div>
      <Placeholder v-else-if="toolInfo" :tool="toolInfo.tool" />
    </ClientOnly>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { getBaseToolById, loadToolComponent } from '~/data/tools'
import { stripLocalePrefix } from '#shared/locales'

const route = useRoute()

const innerPath = computed(() => stripLocalePrefix(route.path).path)

// 只处理 /tools/{category}/{tool}
const parsedIds = computed(() => {
  const match = innerPath.value.match(/^\/tools\/([^/]+)\/([^/]+)$/)
  if (!match) return null
  return { categoryId: match[1]!, toolId: match[2]! }
})

const toolInfo = computed(() => {
  if (!parsedIds.value) return null
  const base = getBaseToolById(parsedIds.value.toolId)
  if (!base || base.category.id !== parsedIds.value.categoryId) return null
  const key = `${base.category.id}/${base.tool.id}`
  return {
    tool: { ...base.tool, key, name: useI18n().t(`tools.${key}.name`), desc: useI18n().t(`tools.${key}.desc`) },
    category: { ...base.category, name: useI18n().t(`categories.${base.category.id}.name`) },
  }
})

const loading = ref(false)
const comp = ref<any>(null)

async function load() {
  comp.value = null
  if (!toolInfo.value) {
    throw createError({ statusCode: 404, statusMessage: 'Tool not found', fatal: true })
  }
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
