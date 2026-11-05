// 中文(简体)语言包
export default {
  // ============ 站点信息 ============
  site: {
    name: '秋雨工具',
    fullName: '秋雨工具 - 一站式开发者工具箱',
    tagline: '一站式开发者工具箱',
    description:
      '免费在线开发者工具箱,包含JSON格式化、加密工具、图片处理、代码格式化、前端工具、文档转换等60+实用工具,所有工具纯前端运行,数据不上传更安全。',
  },

  // ============ UI 通用 ============
  common: {
    loading: '加载中...',
    back: '返回',
    backHome: '返回首页',
    toolNotFound: '工具不存在',
    category: '分类',
    totalTools: '个工具',
  },

  // ============ 分类 ============
  categories: {
    dev: { name: '开发工具' },
    crypto: { name: '加密工具' },
    text: { name: '文本工具' },
    number: { name: '数字工具' },
    frontend: { name: '前端工具' },
    image: { name: '图片工具' },
    document: { name: '文档转换' },
    life: { name: '生活工具' },
  },

  // ============ 工具名称与描述 ============
  tools: {
    // 开发工具
    'dev/json-formatter': { name: 'JSON 格式化', desc: 'JSON 美化、压缩、校验' },
    'dev/yaml-json': { name: 'YAML / JSON 互转', desc: 'YAML 与 JSON 双向转换' },
    'dev/yaml-properties': { name: 'YAML / Properties 互转', desc: 'Java Properties 与 YAML 转换' },
    'dev/json-java': { name: 'JSON / Java 互转', desc: 'JSON 生成 Java POJO' },
    'dev/code-beautify': { name: '代码美化', desc: '多种语言代码格式化' },
    'dev/regex-tester': { name: '正则测试', desc: '正则表达式实时匹配测试' },
    'dev/timestamp': { name: '时间戳转换', desc: 'Unix 时间戳与日期互转' },
    'dev/cron': { name: 'Cron 生成与解析', desc: 'Cron 表达式可视化编辑与解析' },
    'dev/http-request': { name: 'HTTP 请求测试', desc: 'REST API 调试(受 CORS 限制)' },
    'dev/websocket': { name: 'WebSocket 测试', desc: 'WebSocket 连接调试' },
    'dev/ua-parser': { name: 'User-Agent 解析', desc: '解析 UA 获取浏览器/设备信息' },
    'dev/device-info': { name: '设备信息检测', desc: '浏览器/屏幕/WebGL 信息' },

    // 加密工具
    'crypto/base64': { name: 'Base64 编解码', desc: '文本/文件 Base64 转换' },
    'crypto/url-codec': { name: 'URL 编解码', desc: 'URL encode / decode' },
    'crypto/md5': { name: 'MD5 加密', desc: '文本 MD5 摘要' },
    'crypto/hmac': { name: 'HMAC 生成器', desc: 'WebCrypto HMAC 签名' },
    'crypto/jwt': { name: 'JWT 解析器', desc: 'JWT Token Payload 解析' },
    'crypto/rsa': { name: 'RSA 密钥生成器', desc: 'WebCrypto 生成 RSA 密钥对' },

    // 文本工具
    'text/word-count': { name: '字数统计', desc: '字符/词/行数统计' },
    'text/dedup-lines': { name: '重复行删除', desc: '去除文本中的重复行' },
    'text/diff': { name: '文本对比', desc: '两段文本差异高亮对比' },
    'text/pinyin': { name: '汉字转拼音', desc: '中文字符转拼音' },

    // 数字工具
    'number/random': { name: '随机数生成', desc: '指定范围/整数/小数' },
    'number/base-convert': { name: '进制转换', desc: '二进制/八进制/十进制/十六进制' },
    'number/chinese-num': { name: '数字转中文大写', desc: '金额/数字中文大写' },
    'number/sci-calc': { name: '科学计算器', desc: '表达式求值计算器' },

    // 前端工具
    'frontend/flex-box': { name: 'Flex 布局生成器', desc: '可视化 Flex 布局编辑器' },
    'frontend/css-formatter': { name: 'CSS 格式化', desc: 'CSS / SCSS / Less 美化压缩' },
    'frontend/color-picker': { name: '颜色选择器', desc: 'HEX / RGB / HSL 颜色互转' },
    'frontend/box-shadow': { name: 'CSS 阴影生成器', desc: 'box-shadow 可视化调参' },
    'frontend/gradient': { name: '渐变生成器', desc: '线性/径向渐变编辑器' },
    'frontend/css-animation': { name: 'CSS 动画生成器', desc: 'Keyframes 可视化编辑' },
    'frontend/favicon': { name: 'Favicon 生成器', desc: '文字/图标转 Favicon' },
    'frontend/color-scheme': { name: '配色方案生成', desc: '互补色/三色/四色方案' },

    // 图片工具
    'image/image-compress': { name: '图片压缩', desc: '无损/有损压缩图片体积' },
    'image/image-watermark': { name: '图片水印', desc: '文字/图片水印叠加' },
    'image/image-convert': { name: '图片格式转换', desc: 'PNG / JPG / WebP / GIF 互转' },
    'image/image-base64': { name: '图片转 Base64', desc: '图片文件与 Base64 互转' },
    'image/svg-editor': { name: 'SVG 编辑器', desc: '简单 SVG 可视化编辑' },
    'image/qrcode-generate': { name: '二维码生成', desc: '文本/网址转二维码' },
    'image/qrcode-parse': { name: '二维码解析', desc: '图片识别二维码内容' },

    // 文档转换
    'document/markdown-editor': { name: 'Markdown 编辑器', desc: '分栏编辑 + 实时预览' },
    'document/markdown-convert': { name: 'Markdown 格式转换', desc: 'MD → HTML / 纯文本' },
    'document/pdf-merge': { name: 'PDF 合并', desc: '多 PDF 文件合并(纯前端)' },
    'document/pdf-split': { name: 'PDF 拆分', desc: '按范围/每 N 页/提取页面' },

    // 生活工具
    'life/date-calc': { name: '日期计算器', desc: '两日期差值/日期加减' },
    'life/countdown': { name: '倒计时工具', desc: '自定义目标时间倒计时' },
    'life/bmi': { name: 'BMI 计算器', desc: '身体质量指数计算' },
    'life/age': { name: '年龄计算器', desc: '出生日期到今天的年龄' },
    'life/unit-convert': { name: '综合单位换算', desc: '长度/重量/面积/体积' },
    'life/mortgage': { name: '房贷计算器', desc: '等额本息/等额本金' },
    'life/salary': { name: '薪资计算器', desc: '五险一金 + 个税' },
  },

  // ============ SEO 关键词 ============
  seoKeywords: {
    'dev/json-formatter': 'JSON格式化,JSON美化,JSON压缩,JSON校验,在线JSON编辑器',
    'dev/yaml-json': 'YAML转JSON,JSON转YAML,YAML JSON互转,在线格式转换',
    'dev/yaml-properties': 'YAML转Properties,Properties转YAML,Java配置文件转换',
    'dev/json-java': 'JSON转Java,JSON生成POJO,JSON转实体类,JavaBean生成',
    'dev/code-beautify': '代码美化,代码格式化,Javascript格式化,HTML格式化,CSS格式化',
    'dev/regex-tester': '正则测试,正则表达式,正则匹配,在线正则验证,RegEx Tester',
    'dev/timestamp': '时间戳转换,Unix时间戳,时间戳转日期,日期转时间戳',
    'dev/cron': 'Cron表达式,Cron生成器,Cron解析,定时任务表达式,Cron Generator',
    'dev/http-request': 'HTTP请求测试,API调试工具,POST请求测试,在线API测试',
    'dev/websocket': 'WebSocket测试,WebSocket调试,WS连接测试,在线WebSocket客户端',
    'dev/ua-parser': 'User-Agent解析,UA解析,浏览器识别,设备检测',
    'dev/device-info': '设备信息,浏览器信息,屏幕分辨率检测,WebGL检测',
    'crypto/base64': 'Base64编码,Base64解码,文本转Base64,图片转Base64',
    'crypto/url-codec': 'URL编码,URL解码,URL encode,URL decode,在线编码转换',
    'crypto/md5': 'MD5加密,MD5哈希,在线MD5,MD5 Generator',
    'crypto/hmac': 'HMAC生成,HMAC签名,WebCrypto签名,在线HMAC工具',
    'crypto/jwt': 'JWT解析,JWT Token,JWT Payload,在线JWT解码器',
    'crypto/rsa': 'RSA密钥生成,RSA密钥对,WebCrypto RSA,在线RSA工具',
    'text/word-count': '字数统计,字符统计,词数统计,行数统计,在线字数统计',
    'text/dedup-lines': '去重,重复行删除,文本去重,去除重复行',
    'text/diff': '文本对比,文本差异,Diff工具,在线文件对比',
    'text/pinyin': '汉字转拼音,中文拼音,拼音转换,汉字拼音化',
    'number/random': '随机数生成,随机整数,随机小数,在线随机数',
    'number/base-convert': '进制转换,二进制转十进制,十六进制转换,在线进制计算器',
    'number/chinese-num': '数字转中文,中文大写金额,人民币大写,数字金额转换',
    'number/sci-calc': '科学计算器,表达式计算,在线计算器,数学表达式求值',
    'frontend/flex-box': 'Flex布局,Flexbox生成器,CSS Flex布局,可视化Flex编辑器',
    'frontend/css-formatter': 'CSS格式化,CSS美化,SCSS格式化,Less格式化,CSS压缩',
    'frontend/color-picker': '颜色选择器,颜色转换,HEX转RGB,RGB转HSL,在线颜色工具',
    'frontend/box-shadow': 'CSS阴影生成,box-shadow,阴影效果,在线CSS阴影工具',
    'frontend/gradient': '渐变生成器,渐变背景,linear-gradient,radial-gradient,在线渐变',
    'frontend/css-animation': 'CSS动画生成,Keyframes动画,动画编辑器,在线CSS动画',
    'frontend/favicon': 'Favicon生成,图标生成,Favicon在线制作,网站图标',
    'frontend/color-scheme': '配色方案,互补色,三色方案,四色方案,在线配色工具',
    'image/image-compress': '图片压缩,图片压缩工具,JPG压缩,PNG压缩,无损压缩',
    'image/image-watermark': '图片水印,文字水印,图片水印工具,在线加水印',
    'image/image-convert': '图片格式转换,PNG转JPG,WebP转换,GIF转换,在线图片转换',
    'image/image-base64': '图片转Base64,Base64转图片,图片编码转换',
    'image/svg-editor': 'SVG编辑器,SVG在线编辑,SVG可视化,矢量图编辑',
    'image/qrcode-generate': '二维码生成,在线二维码,QR Code生成器,二维码制作',
    'image/qrcode-parse': '二维码解析,QR Code识别,二维码读取,在线扫码',
    'document/markdown-editor': 'Markdown编辑器,MD编辑器,在线Markdown,Markdown预览',
    'document/markdown-convert': 'Markdown转HTML,MD转HTML,Markdown转换,在线MD转换',
    'document/pdf-merge': 'PDF合并,在线PDF合并,合并PDF文件,PDF工具',
    'document/pdf-split': 'PDF拆分,PDF分割,拆分PDF文件,在线PDF拆分工具',
    'life/date-calc': '日期计算,日期差值,日期加减,在线日期计算器',
    'life/countdown': '倒计时,在线倒计时,事件倒计时,倒计时工具',
    'life/bmi': 'BMI计算器,身体质量指数,BMI计算,健康指数',
    'life/age': '年龄计算,周岁计算,在线年龄计算器,出生日期计算',
    'life/unit-convert': '单位换算,长度单位,重量单位,面积换算,在线单位转换',
    'life/mortgage': '房贷计算器,等额本息,等额本金,在线房贷计算',
    'life/salary': '薪资计算器,五险一金,个税计算,在线工资计算器',
  },
}
