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

// 基础工具定义(不含多语言文案,文案统一走 i18n 的 $t)
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

// ============ 基础函数(不带翻译,文案由调用方通过 $t 提供) ============

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
