// 图标名映射,用于动态渲染
export interface ToolItem {
  id: string
  icon: string
  route: string // /tools/<category>/<id>
}

export interface ToolCategory {
  id: string
  icon: string
  tools: ToolItem[]
}

// 直接 import locale 文件,SSR 和客户端都能正确获取(不依赖 useI18n.tm 的生命周期)
import zhCNLocales from '../locales/zh-CN'
import enLocales from '../locales/en'

const localeMessages: Record<string, any> = {
  'zh-CN': zhCNLocales,
  en: enLocales,
}

/**
 * 获取当前 locale 的 messages 对象
 * @param locale 当前语言代码,默认 zh-CN
 */
export function getLocaleMessages(locale: string = 'zh-CN'): any {
  return localeMessages[locale] ?? localeMessages['zh-CN']
}

/**
 * 获取工具/分类的翻译文案
 */
export function getToolText(
  categoryId: string,
  toolId: string,
  locale: string = 'zh-CN'
): { name: string; desc: string } {
  const msgs = getLocaleMessages(locale)
  const toolKey = `${categoryId}/${toolId}`
  return msgs.tools?.[toolKey] ?? { name: toolId, desc: '' }
}

export function getCategoryName(categoryId: string, locale: string = 'zh-CN'): string {
  const msgs = getLocaleMessages(locale)
  return msgs.categories?.[categoryId]?.name ?? categoryId
}

export function getSeoKeywordsDirect(
  categoryId: string,
  toolId: string,
  locale: string = 'zh-CN'
): string {
  const msgs = getLocaleMessages(locale)
  const toolKey = `${categoryId}/${toolId}`
  return msgs.seoKeywords?.[toolKey] ?? ''
}

// 基础工具定义(不含多语言文案,文案从 locales 获取)
export const baseCategories: ToolCategory[] = [
  {
    id: 'dev',
    icon: 'Code',
    tools: [
      { id: 'json-formatter', icon: 'FileCode', route: '/tools/dev/json-formatter' },
      { id: 'yaml-json', icon: 'ArrowLeftRight', route: '/tools/dev/yaml-json' },
      { id: 'yaml-properties', icon: 'FileText', route: '/tools/dev/yaml-properties' },
      { id: 'json-java', icon: 'Coffee', route: '/tools/dev/json-java' },
      { id: 'code-beautify', icon: 'WandSparkles', route: '/tools/dev/code-beautify' },
      { id: 'regex-tester', icon: 'Search', route: '/tools/dev/regex-tester' },
      { id: 'timestamp', icon: 'Clock', route: '/tools/dev/timestamp' },
      { id: 'cron', icon: 'Calendar', route: '/tools/dev/cron' },
      { id: 'http-request', icon: 'Globe', route: '/tools/dev/http-request' },
      { id: 'websocket', icon: 'Wifi', route: '/tools/dev/websocket' },
      { id: 'ua-parser', icon: 'Monitor', route: '/tools/dev/ua-parser' },
      { id: 'device-info', icon: 'Cpu', route: '/tools/dev/device-info' },
    ],
  },
  {
    id: 'crypto',
    icon: 'Lock',
    tools: [
      { id: 'base64', icon: 'Binary', route: '/tools/crypto/base64' },
      { id: 'url-codec', icon: 'Link', route: '/tools/crypto/url-codec' },
      { id: 'md5', icon: 'Hash', route: '/tools/crypto/md5' },
      { id: 'hmac', icon: 'FingerprintPattern', route: '/tools/crypto/hmac' },
      { id: 'jwt', icon: 'Key', route: '/tools/crypto/jwt' },
      { id: 'rsa', icon: 'Shield', route: '/tools/crypto/rsa' },
    ],
  },
  {
    id: 'text',
    icon: 'FilePenLine',
    tools: [
      { id: 'word-count', icon: 'ChartBar', route: '/tools/text/word-count' },
      { id: 'dedup-lines', icon: 'List', route: '/tools/text/dedup-lines' },
      { id: 'diff', icon: 'GitCompare', route: '/tools/text/diff' },
      { id: 'pinyin', icon: 'Languages', route: '/tools/text/pinyin' },
    ],
  },
  {
    id: 'number',
    icon: 'Calculator',
    tools: [
      { id: 'random', icon: 'Dice5', route: '/tools/number/random' },
      { id: 'base-convert', icon: 'RotateCcw', route: '/tools/number/base-convert' },
      { id: 'chinese-num', icon: 'Banknote', route: '/tools/number/chinese-num' },
      { id: 'sci-calc', icon: 'Calculator', route: '/tools/number/sci-calc' },
    ],
  },
  {
    id: 'frontend',
    icon: 'Palette',
    tools: [
      { id: 'flex-box', icon: 'LayoutDashboard', route: '/tools/frontend/flex-box' },
      { id: 'css-formatter', icon: 'Paintbrush', route: '/tools/frontend/css-formatter' },
      { id: 'color-picker', icon: 'Droplets', route: '/tools/frontend/color-picker' },
      { id: 'box-shadow', icon: 'Square', route: '/tools/frontend/box-shadow' },
      { id: 'gradient', icon: 'Blend', route: '/tools/frontend/gradient' },
      { id: 'css-animation', icon: 'Sparkles', route: '/tools/frontend/css-animation' },
      { id: 'favicon', icon: 'Star', route: '/tools/frontend/favicon' },
      { id: 'color-scheme', icon: 'Palette', route: '/tools/frontend/color-scheme' },
    ],
  },
  {
    id: 'image',
    icon: 'Image',
    tools: [
      { id: 'image-compress', icon: 'Minimize2', route: '/tools/image/image-compress' },
      { id: 'image-watermark', icon: 'Type', route: '/tools/image/image-watermark' },
      { id: 'image-convert', icon: 'RefreshCw', route: '/tools/image/image-convert' },
      { id: 'image-base64', icon: 'Database', route: '/tools/image/image-base64' },
      { id: 'svg-editor', icon: 'Figma', route: '/tools/image/svg-editor' },
      { id: 'qrcode-generate', icon: 'QrCode', route: '/tools/image/qrcode-generate' },
      { id: 'qrcode-parse', icon: 'Scan', route: '/tools/image/qrcode-parse' },
    ],
  },
  {
    id: 'document',
    icon: 'FileText',
    tools: [
      { id: 'markdown-editor', icon: 'FilePenLine', route: '/tools/document/markdown-editor' },
      { id: 'markdown-convert', icon: 'FileCode', route: '/tools/document/markdown-convert' },
      { id: 'pdf-merge', icon: 'Combine', route: '/tools/document/pdf-merge' },
      { id: 'pdf-split', icon: 'Scissors', route: '/tools/document/pdf-split' },
    ],
  },
  {
    id: 'life',
    icon: 'House',
    tools: [
      { id: 'date-calc', icon: 'CalendarDays', route: '/tools/life/date-calc' },
      { id: 'countdown', icon: 'Timer', route: '/tools/life/countdown' },
      { id: 'bmi', icon: 'Activity', route: '/tools/life/bmi' },
      { id: 'age', icon: 'Cake', route: '/tools/life/age' },
      { id: 'unit-convert', icon: 'Ruler', route: '/tools/life/unit-convert' },
      { id: 'mortgage', icon: 'Banknote', route: '/tools/life/mortgage' },
      { id: 'salary', icon: 'Wallet', route: '/tools/life/salary' },
    ],
  },
]

// ============ 兼容性导出 ============
export interface ToolItemWithText extends ToolItem {
  name: string
  desc: string
}

export interface ToolCategoryWithText extends ToolCategory {
  name: string
  tools: ToolItemWithText[]
}

/**
 * 获取带多语言文案的分类列表(直接读 locale 文件,SSR/客户端都工作)
 * @param locale 当前语言代码,'zh-CN' | 'en'
 */
export function getCategories(locale: string = 'zh-CN'): ToolCategoryWithText[] {
  const msgs = getLocaleMessages(locale)
  return baseCategories.map(cat => ({
    ...cat,
    name: msgs.categories?.[cat.id]?.name ?? cat.id,
    tools: cat.tools.map(tool => {
      const toolKey = `${cat.id}/${tool.id}`
      const toolText = msgs.tools?.[toolKey]
      return {
        ...tool,
        name: toolText?.name ?? tool.id,
        desc: toolText?.desc ?? '',
      }
    }),
  }))
}

/**
 * 扁平化查找工具(带多语言文案)
 */
export function findTool(
  toolId: string,
  locale: string = 'zh-CN'
): { tool: ToolItemWithText; category: ToolCategoryWithText } | null {
  const msgs = getLocaleMessages(locale)
  for (const cat of baseCategories) {
    const tool = cat.tools.find(t => t.id === toolId)
    if (tool) {
      const toolKey = `${cat.id}/${tool.id}`
      const toolText = msgs.tools?.[toolKey]
      return {
        tool: {
          ...tool,
          name: toolText?.name ?? tool.id,
          desc: toolText?.desc ?? '',
        },
        category: {
          ...cat,
          name: msgs.categories?.[cat.id]?.name ?? cat.id,
        },
      }
    }
  }
  return null
}

/**
 * 查找分类(带多语言文案)
 */
export function findCategory(
  categoryId: string,
  locale: string = 'zh-CN'
): ToolCategoryWithText | null {
  const cat = baseCategories.find(c => c.id === categoryId)
  if (!cat) return null
  const msgs = getLocaleMessages(locale)
  return {
    ...cat,
    name: msgs.categories?.[cat.id]?.name ?? cat.id,
  }
}

/**
 * 获取 SEO 关键词
 */
export function getSeoKeywords(
  categoryId: string,
  toolId: string,
  locale: string = 'zh-CN'
): string {
  return getSeoKeywordsDirect(categoryId, toolId, locale)
}

// ============ 基础函数(不带翻译,供 SSR/非组件使用) ============

export function getBaseToolById(toolId: string): { tool: ToolItem; category: ToolCategory } | null {
  for (const cat of baseCategories) {
    const tool = cat.tools.find(t => t.id === toolId)
    if (tool) return { tool, category: cat }
  }
  return null
}

// 动态加载工具组件
export async function loadToolComponent(categoryId: string, toolId: string) {
  try {
    const mod = await import(`~/pages/tools/${categoryId}/${toolId}.vue`)
    return mod.default
  } catch {
    return null
  }
}
