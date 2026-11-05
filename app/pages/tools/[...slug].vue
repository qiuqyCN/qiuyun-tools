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

// ============ 动态 SEO ============
const siteUrl = 'https://qiuyun.tools'
const fullPath = computed(() => `${siteUrl}${route.fullPath}`)

// 关键词映射表 - 为每个工具定义更丰富的SEO关键词
const toolKeywordsMap: Record<string, string> = {
  'json-formatter': 'JSON格式化,JSON美化,JSON压缩,JSON校验,在线JSON编辑器',
  'yaml-json': 'YAML转JSON,JSON转YAML,YAML JSON互转,在线格式转换',
  'yaml-properties': 'YAML转Properties,Properties转YAML,Java配置文件转换',
  'json-java': 'JSON转Java,JSON生成POJO,JSON转实体类,JavaBean生成',
  'code-beautify': '代码美化,代码格式化,Javascript格式化,HTML格式化,CSS格式化',
  'regex-tester': '正则测试,正则表达式,正则匹配,在线正则验证,RegEx Tester',
  'timestamp': '时间戳转换,Unix时间戳,时间戳转日期,日期转时间戳',
  'cron': 'Cron表达式,Cron生成器,Cron解析,定时任务表达式,Cron Generator',
  'http-request': 'HTTP请求测试,API调试工具,POST请求测试,在线API测试',
  'websocket': 'WebSocket测试,WebSocket调试,WS连接测试,在线WebSocket客户端',
  'ua-parser': 'User-Agent解析,UA解析,浏览器识别,设备检测',
  'device-info': '设备信息,浏览器信息,屏幕分辨率检测,WebGL检测',
  'base64': 'Base64编码,Base64解码,文本转Base64,图片转Base64',
  'url-codec': 'URL编码,URL解码,URL encode,URL decode,在线编码转换',
  'md5': 'MD5加密,MD5哈希,在线MD5,MD5 Generator',
  'hmac': 'HMAC生成,HMAC签名,WebCrypto签名,在线HMAC工具',
  'jwt': 'JWT解析,JWT Token,JWT Payload,在线JWT解码器',
  'rsa': 'RSA密钥生成,RSA密钥对,WebCrypto RSA,在线RSA工具',
  'word-count': '字数统计,字符统计,词数统计,行数统计,在线字数统计',
  'dedup-lines': '去重,重复行删除,文本去重,去除重复行',
  'diff': '文本对比,文本差异,Diff工具,在线文件对比',
  'pinyin': '汉字转拼音,中文拼音,拼音转换,汉字拼音化',
  'random': '随机数生成,随机整数,随机小数,在线随机数',
  'base-convert': '进制转换,二进制转十进制,十六进制转换,在线进制计算器',
  'chinese-num': '数字转中文,中文大写金额,人民币大写,数字金额转换',
  'sci-calc': '科学计算器,表达式计算,在线计算器,数学表达式求值',
  'flex-box': 'Flex布局,Flexbox生成器,CSS Flex布局,可视化Flex编辑器',
  'css-formatter': 'CSS格式化,CSS美化,SCSS格式化,Less格式化,CSS压缩',
  'color-picker': '颜色选择器,颜色转换,HEX转RGB,RGB转HSL,在线颜色工具',
  'box-shadow': 'CSS阴影生成,box-shadow,阴影效果,在线CSS阴影工具',
  'gradient': '渐变生成器,渐变背景,linear-gradient,radial-gradient,在线渐变',
  'css-animation': 'CSS动画生成,Keyframes动画,动画编辑器,在线CSS动画',
  'favicon': 'Favicon生成,图标生成,Favicon在线制作,网站图标',
  'color-scheme': '配色方案,互补色,三色方案,四色方案,在线配色工具',
  'image-compress': '图片压缩,图片压缩工具,JPG压缩,PNG压缩,无损压缩',
  'image-watermark': '图片水印,文字水印,图片水印工具,在线加水印',
  'image-convert': '图片格式转换,PNG转JPG,WebP转换,GIF转换,在线图片转换',
  'image-base64': '图片转Base64,Base64转图片,图片编码转换',
  'svg-editor': 'SVG编辑器,SVG在线编辑,SVG可视化,矢量图编辑',
  'qrcode-generate': '二维码生成,在线二维码,QR Code生成器,二维码制作',
  'qrcode-parse': '二维码解析,QR Code识别,二维码读取,在线扫码',
  'markdown-editor': 'Markdown编辑器,MD编辑器,在线Markdown,Markdown预览',
  'markdown-convert': 'Markdown转HTML,MD转HTML,Markdown转换,在线MD转换',
  'pdf-merge': 'PDF合并,在线PDF合并,合并PDF文件,PDF工具',
  'pdf-split': 'PDF拆分,PDF分割,拆分PDF文件,在线PDF拆分工具',
  'date-calc': '日期计算,日期差值,日期加减,在线日期计算器',
  'countdown': '倒计时,在线倒计时,事件倒计时,倒计时工具',
  'bmi': 'BMI计算器,身体质量指数,BMI计算,健康指数',
  'age': '年龄计算,周岁计算,在线年龄计算器,出生日期计算',
  'unit-convert': '单位换算,长度单位,重量单位,面积换算,在线单位转换',
  'mortgage': '房贷计算器,等额本息,等额本金,在线房贷计算',
  'salary': '薪资计算器,五险一金,个税计算,在线工资计算器',
}

watch(toolInfo, (info) => {
  if (!info) return
  
  const { tool, category } = info
  const keywords = toolKeywordsMap[tool.id] || `${tool.name},${category.name},在线${tool.name}`
  const desc = `${tool.name} - ${tool.desc}。${category.name}分类下的在线工具,纯前端运行,数据不上传更安全,免费使用无需注册。`
  const toolPageUrl = `${siteUrl}${tool.route}`
  
  useSeoMeta({
    title: tool.name,
    description: desc,
    keywords: keywords,
    ogTitle: `${tool.name} - ${category.name} | 秋雨工具`,
    ogDescription: tool.desc,
    ogImage: `${siteUrl}/favicon.png`,
    ogUrl: toolPageUrl,
    ogType: 'website',
    twitterTitle: `${tool.name} - ${category.name}`,
    twitterDescription: tool.desc,
    twitterImage: `${siteUrl}/favicon.png`,
  })
  
  useHead({
    link: [
      { rel: 'canonical', href: toolPageUrl },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: tool.name,
          description: tool.desc,
          url: toolPageUrl,
          category: category.name,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'CNY',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1000',
          },
        }),
      },
    ],
  })
}, { immediate: true })
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
