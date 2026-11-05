// 图标名映射，用于动态渲染
export interface ToolItem {
  id: string
  name: string
  desc: string
  icon: string
  route: string // /tools/<category>/<id>
}

export interface ToolCategory {
  id: string
  name: string
  icon: string
  tools: ToolItem[]
}

export const categories: ToolCategory[] = [
  {
    id: 'dev',
    name: '开发工具',
    icon: 'Code',
    tools: [
      { id: 'json-formatter', name: 'JSON 格式化', desc: 'JSON 美化、压缩、校验', icon: 'FileCode', route: '/tools/dev/json-formatter' },
      { id: 'yaml-json', name: 'YAML / JSON 互转', desc: 'YAML 与 JSON 双向转换', icon: 'ArrowLeftRight', route: '/tools/dev/yaml-json' },
      { id: 'yaml-properties', name: 'YAML / Properties 互转', desc: 'Java Properties 与 YAML 转换', icon: 'FileText', route: '/tools/dev/yaml-properties' },
      { id: 'json-java', name: 'JSON / Java 互转', desc: 'JSON 生成 Java POJO', icon: 'Coffee', route: '/tools/dev/json-java' },
      { id: 'code-beautify', name: '代码美化', desc: '多种语言代码格式化', icon: 'WandSparkles', route: '/tools/dev/code-beautify' },
      { id: 'regex-tester', name: '正则测试', desc: '正则表达式实时匹配测试', icon: 'Search', route: '/tools/dev/regex-tester' },
      { id: 'timestamp', name: '时间戳转换', desc: 'Unix 时间戳与日期互转', icon: 'Clock', route: '/tools/dev/timestamp' },
      { id: 'cron', name: 'Cron 生成与解析', desc: 'Cron 表达式可视化编辑与解析', icon: 'Calendar', route: '/tools/dev/cron' },
      { id: 'http-request', name: 'HTTP 请求测试', desc: 'REST API 调试（受 CORS 限制）', icon: 'Globe', route: '/tools/dev/http-request' },
      { id: 'websocket', name: 'WebSocket 测试', desc: 'WebSocket 连接调试', icon: 'Wifi', route: '/tools/dev/websocket' },
      { id: 'ua-parser', name: 'User-Agent 解析', desc: '解析 UA 获取浏览器 / 设备信息', icon: 'Monitor', route: '/tools/dev/ua-parser' },
      { id: 'device-info', name: '设备信息检测', desc: '浏览器 / 屏幕 / WebGL 信息', icon: 'Cpu', route: '/tools/dev/device-info' },
    ],
  },
  {
    id: 'crypto',
    name: '加密工具',
    icon: 'Lock',
    tools: [
      { id: 'base64', name: 'Base64 编解码', desc: '文本 / 文件 Base64 转换', icon: 'Binary', route: '/tools/crypto/base64' },
      { id: 'url-codec', name: 'URL 编解码', desc: 'URL encode / decode', icon: 'Link', route: '/tools/crypto/url-codec' },
      { id: 'md5', name: 'MD5 加密', desc: '文本 MD5 摘要', icon: 'Hash', route: '/tools/crypto/md5' },
      { id: 'hmac', name: 'HMAC 生成器', desc: 'WebCrypto HMAC 签名', icon: 'FingerprintPattern', route: '/tools/crypto/hmac' },
      { id: 'jwt', name: 'JWT 解析器', desc: 'JWT Token Payload 解析', icon: 'Key', route: '/tools/crypto/jwt' },
      { id: 'rsa', name: 'RSA 密钥生成器', desc: 'WebCrypto 生成 RSA 密钥对', icon: 'Shield', route: '/tools/crypto/rsa' },
    ],
  },
  {
    id: 'text',
    name: '文本工具',
    icon: 'FilePenLine',
    tools: [
      { id: 'word-count', name: '字数统计', desc: '字符 / 词 / 行数统计', icon: 'ChartBar', route: '/tools/text/word-count' },
      { id: 'dedup-lines', name: '重复行删除', desc: '去除文本中的重复行', icon: 'List', route: '/tools/text/dedup-lines' },
      { id: 'diff', name: '文本对比', desc: '两段文本差异高亮对比', icon: 'GitCompare', route: '/tools/text/diff' },
      { id: 'pinyin', name: '汉字转拼音', desc: '中文字符转拼音', icon: 'Languages', route: '/tools/text/pinyin' },
    ],
  },
  {
    id: 'number',
    name: '数字工具',
    icon: 'Calculator',
    tools: [
      { id: 'random', name: '随机数生成', desc: '指定范围 / 整数 / 小数', icon: 'Dice5', route: '/tools/number/random' },
      { id: 'base-convert', name: '进制转换', desc: '二进制 / 八进制 / 十进制 / 十六进制', icon: 'RotateCcw', route: '/tools/number/base-convert' },
      { id: 'chinese-num', name: '数字转中文大写', desc: '金额 / 数字中文大写', icon: 'Banknote', route: '/tools/number/chinese-num' },
      { id: 'sci-calc', name: '科学计算器', desc: '表达式求值计算器', icon: 'Calculator', route: '/tools/number/sci-calc' },
    ],
  },
  {
    id: 'frontend',
    name: '前端工具',
    icon: 'Palette',
    tools: [
      { id: 'flex-box', name: 'Flex 布局生成器', desc: '可视化 Flex 布局编辑器', icon: 'LayoutDashboard', route: '/tools/frontend/flex-box' },
      { id: 'css-formatter', name: 'CSS 格式化', desc: 'CSS / SCSS / Less 美化压缩', icon: 'Paintbrush', route: '/tools/frontend/css-formatter' },
      { id: 'color-picker', name: '颜色选择器', desc: 'HEX / RGB / HSL 颜色互转', icon: 'Droplets', route: '/tools/frontend/color-picker' },
      { id: 'box-shadow', name: 'CSS 阴影生成器', desc: 'box-shadow 可视化调参', icon: 'Square', route: '/tools/frontend/box-shadow' },
      { id: 'gradient', name: '渐变生成器', desc: '线性 / 径向渐变编辑器', icon: 'Blend', route: '/tools/frontend/gradient' },
      { id: 'css-animation', name: 'CSS 动画生成器', desc: 'Keyframes 可视化编辑', icon: 'Sparkles', route: '/tools/frontend/css-animation' },
      { id: 'favicon', name: 'Favicon 生成器', desc: '文字 / 图标转 Favicon', icon: 'Star', route: '/tools/frontend/favicon' },
      { id: 'color-scheme', name: '配色方案生成', desc: '互补色 / 三色 / 四色方案', icon: 'Palette', route: '/tools/frontend/color-scheme' },
    ],
  },
  {
    id: 'image',
    name: '图片工具',
    icon: 'Image',
    tools: [
      { id: 'image-compress', name: '图片压缩', desc: '无损 / 有损压缩图片体积', icon: 'Minimize2', route: '/tools/image/image-compress' },
      { id: 'image-watermark', name: '图片水印', desc: '文字 / 图片水印叠加', icon: 'Type', route: '/tools/image/image-watermark' },
      { id: 'image-convert', name: '图片格式转换', desc: 'PNG / JPG / WebP / GIF 互转', icon: 'RefreshCw', route: '/tools/image/image-convert' },
      { id: 'image-base64', name: '图片转 Base64', desc: '图片文件与 Base64 互转', icon: 'Database', route: '/tools/image/image-base64' },
      { id: 'svg-editor', name: 'SVG 编辑器', desc: '简单 SVG 可视化编辑', icon: 'Figma', route: '/tools/image/svg-editor' },
      { id: 'qrcode-generate', name: '二维码生成', desc: '文本 / 网址转二维码', icon: 'QrCode', route: '/tools/image/qrcode-generate' },
      { id: 'qrcode-parse', name: '二维码解析', desc: '图片识别二维码内容', icon: 'Scan', route: '/tools/image/qrcode-parse' },
    ],
  },
  {
    id: 'document',
    name: '文档转换',
    icon: 'FileText',
    tools: [
      { id: 'markdown-editor', name: 'Markdown 编辑器', desc: '分栏编辑 + 实时预览', icon: 'FilePenLine', route: '/tools/document/markdown-editor' },
      { id: 'markdown-convert', name: 'Markdown 格式转换', desc: 'MD → HTML / 纯文本', icon: 'FileCode', route: '/tools/document/markdown-convert' },
      { id: 'pdf-merge', name: 'PDF 合并', desc: '多 PDF 文件合并（纯前端）', icon: 'Combine', route: '/tools/document/pdf-merge' },
      { id: 'pdf-split', name: 'PDF 拆分', desc: '按范围 / 每 N 页 / 提取页面', icon: 'Scissors', route: '/tools/document/pdf-split' },
    ],
  },
  {
    id: 'life',
    name: '生活工具',
    icon: 'House',
    tools: [
      { id: 'date-calc', name: '日期计算器', desc: '两日期差值 / 日期加减', icon: 'CalendarDays', route: '/tools/life/date-calc' },
      { id: 'countdown', name: '倒计时工具', desc: '自定义目标时间倒计时', icon: 'Timer', route: '/tools/life/countdown' },
      { id: 'bmi', name: 'BMI 计算器', desc: '身体质量指数计算', icon: 'Activity', route: '/tools/life/bmi' },
      { id: 'age', name: '年龄计算器', desc: '出生日期到今天的年龄', icon: 'Cake', route: '/tools/life/age' },
      { id: 'unit-convert', name: '综合单位换算', desc: '长度 / 重量 / 面积 / 体积', icon: 'Ruler', route: '/tools/life/unit-convert' },
      { id: 'mortgage', name: '房贷计算器', desc: '等额本息 / 等额本金', icon: 'Banknote', route: '/tools/life/mortgage' },
      { id: 'salary', name: '薪资计算器', desc: '五险一金 + 个税', icon: 'Wallet', route: '/tools/life/salary' },
    ],
  },
]

// 扁平化查找
export function findTool(id: string): { tool: ToolItem; category: ToolCategory } | null {
  for (const cat of categories) {
    const tool = cat.tools.find(t => t.id === id)
    if (tool) return { tool, category: cat }
  }
  return null
}

export function findCategory(id: string): ToolCategory | null {
  return categories.find(c => c.id === id) ?? null
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
