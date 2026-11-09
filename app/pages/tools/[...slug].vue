<template>
  <ToolLayout
    v-if="toolInfo"
    :category-name="toolInfo.category.name"
    :tool-name="toolInfo.tool.name"
    :description="toolInfo.tool.desc"
    :icon="toolInfo.tool.icon"
  >
    <div v-if="loading" class="py-12 text-center text-slate-400">{{ $t('common.loading') }}</div>
    <div v-else-if="comp" class="tool-content">
      <component :is="comp" />
    </div>
    <Placeholder v-else :tool="toolInfo.tool" />
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { getBaseToolById, loadToolComponent } from '~/data/tools'
import { stripLocalePrefix } from '#shared/locales'

const route = useRoute()
const { t } = useI18n()

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
    tool: { ...base.tool, key, name: t(`tools.${key}.name`), desc: t(`tools.${key}.desc`) },
    category: { ...base.category, name: t(`categories.${base.category.id}.name`) },
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
