/**
 * 带当前语言文案的工具目录
 * 文案统一走 i18n 的 $t，语言包由 @nuxtjs/i18n 按需加载。
 */
import { computed } from 'vue'
import { baseCategories } from '~/data/tools'
import type { ToolCategory, ToolItem } from '~/data/tools'

export interface LocalizedTool extends ToolItem {
  key: string
  name: string
  desc: string
}

export interface LocalizedCategory extends ToolCategory {
  name: string
  tools: LocalizedTool[]
}

export function useToolCatalog() {
  const { t } = useI18n()

  const totalTools = baseCategories.reduce((sum, category) => sum + category.tools.length, 0)

  const categories = computed<LocalizedCategory[]>(() =>
    baseCategories.map(category => ({
      id: category.id,
      icon: category.icon,
      name: t(`categories.${category.id}.name`),
      tools: category.tools.map((tool) => {
        const key = `${category.id}/${tool.id}`
        return {
          ...tool,
          key,
          name: t(`tools.${key}.name`),
          desc: t(`tools.${key}.desc`),
        }
      }),
    })),
  )

  return { categories, totalTools }
}
