/**
 * /guide 栏目：开发者指南文章
 *
 * 只维护中文与英文两份，其他语言回退英文，和 legal.ts / tool-content.ts 同模式。
 * 由 GuideList.vue 和 GuideArticle.vue 渲染，路由 /guide 和 /guide/[slug]。
 * 每篇文章内嵌关联工具的链接（增强内部链接 + 引导用户到工具页）。
 */

export type GuideLang = 'zh' | 'en'

export interface GuideSection {
  heading?: string
  /** 段落数组，每段一个 <p> */
  paragraphs?: string[]
  /** 代码块：lang 用于高亮、code 为原始文本 */
  code?: Array<{ lang: string; code: string }>
  /** 提示 callout（黄色，⚠️ 或 💡） */
  tips?: string[]
  /** 对比表（左右两列） */
  compare?: Array<{ left: string; right: string }>
}

export interface GuideArticle {
  slug: string
  date: string // ISO: YYYY-MM-DD
  tags: string[]
  /** 工具关联：正文渲染时会自动在合适位置注入 NuxtLink */
  toolKeys?: string[]
  zh: {
    title: string
    description: string
    /** 导语 / 开头（1-2 段），同时作为 og:description */
    excerpt: string
    body: GuideSection[]
  }
  en: {
    title: string
    description: string
    excerpt: string
    body: GuideSection[]
  }
}

// ============ 首批 7 篇文章 ============
// 选题思路：开发者高频搜索的"怎么选"、"为什么报错"、"最佳实践"——长尾 SEO 意图
export const guideArticles: GuideArticle[] = [
  // -------------------- 1. Base64 vs URL Encode --------------------
  {
    slug: 'base64-vs-url-encode',
    date: '2026-11-11',
    tags: ['编码', '基础', '对比'],
    toolKeys: ['crypto/base64', 'crypto/url-codec'],
    zh: {
      title: 'Base64 vs URL 编码：什么时候用哪个？',
      description: 'Base64 和 URL 编码是两种最常见的数据编码方式，但很多开发者搞混它们的适用场景。本文通过对比 + 代码示例帮你一次搞清楚。',
      excerpt: 'Base64 和 URL 编码看起来相似，实则用途完全不同。一个是让二进制数据在文本通道里存活，一个是让特殊字符在 URL 里合法出现。选错了轻则参数丢失，重则整个接口请求报错。',
      body: [
        {
          heading: '一句话概括',
          paragraphs: [
            'Base64 编码把任意二进制（图片、文件、非 ASCII 文本）转成纯 ASCII 字符，代价是体积膨胀 ~33%。它是编码不是加密——任何人都能解码还原。',
            'URL 编码（百分号编码）是把 URL 里有特殊含义的字符（空格、+、&、=、中文）替换成 %XX 形式。它是转义不是编码，只处理 URL 语境下的不合法字符。',
          ],
        },
        {
          heading: '什么时候用 Base64',
          paragraphs: [
            '1. 把图片嵌入 HTML（Data URL）：`<img src="data:image/png;base64,iVBORw0KGgo...">`',
            '2. 把任意字符串放进 JSON 或 HTTP Header：Base64 输出只包含字母、数字、+、/、=，在几乎所有文本协议里都是安全的。',
            '3. JWT Token 内部的 payload 和 signature 部分就是 Base64url（Base64 的 URL-safe 变体，把 + 换成 -、/ 换成 _、去掉 =）。',
          ],
          tips: ['⚠️ 密码或敏感信息不要用 Base64 存。它没有任何保密性，用 bcrypt / Argon2 做密码哈希才是正经事。'],
        },
        {
          heading: '什么时候用 URL 编码',
          paragraphs: [
            '1. 把参数值拼进查询字符串：`?q=' + '"' + 'Hello World & Friends" 会破坏 URL，必须 URL 编码成 ?q=Hello%20World%20%26%20Friends。',
            '2. 把 JSON 或其他结构化数据作为单个 URL 参数传递。双引号、大括号、冒号都要转义。',
            '3. 中文或其他非 ASCII 字符放进 URL：必须用 UTF-8 + URL 编码两层处理。',
          ],
          code: [
            {
              lang: 'javascript',
              code: `// ❌ 错：直接拼 JSON
fetch('/api/search?q=' + JSON.stringify({ author: '张' }))

// ✅ 对：encodeURIComponent 整个值
fetch('/api/search?q=' + encodeURIComponent(JSON.stringify({ author: '张' })))`,
            },
          ],
        },
        {
          heading: '常见误区',
          compare: [
            { left: 'Base64 可以让数据"不可见"', right: 'Base64 只是编码，任何人一解码就看到原文。要保密用加密算法（AES/RSA）。' },
            { left: 'URL 编码就是转义双引号', right: '除了引号，+、=、&、#、?、中文都要转。用 encodeURIComponent，别自己手写替换。' },
            { left: 'Base64 输出可以直接放进 URL', right: 'Base64 输出包含 + / =，放进 URL query 参数会被服务器当成结构字符。要用 Base64url 变体。' },
          ],
        },
      ],
    },
    en: {
      title: 'Base64 vs URL encoding: when to use which?',
      description: 'Base64 and URL encoding are often confused. A clear comparison with examples to pick the right one every time.',
      excerpt: 'Base64 and URL encoding look similar but serve completely different purposes. One makes binary data survive in text-only channels, the other escapes characters that would otherwise break a URL. Pick the wrong one and you get silent data loss or outright request failures.',
      body: [
        {
          heading: 'The one-line pitch',
          paragraphs: [
            'Base64 converts arbitrary binary (images, files, non-ASCII text) into pure ASCII, at the cost of growing by about 33%. It is encoding, not encryption — anyone can decode it back.',
            'URL encoding (percent-encoding) replaces characters that have special meaning in a URL (spaces, +, &, =, non-ASCII) with %XX sequences. It is escaping, not encoding: it only fixes what is illegal in a URL context.',
          ],
        },
        {
          heading: 'Use Base64 when',
          paragraphs: [
            '1. Embedding an image in HTML as a Data URL: `<img src="data:image/png;base64,iVBORw0KGgo...">`',
            '2. Pushing an arbitrary string into a JSON field or HTTP header — Base64 output only uses [A-Za-z0-9+/=], safe in nearly every text protocol.',
            '3. The payload or signature part of a JWT token uses Base64url (a URL-safe variant that swaps + for -, / for _ and strips the trailing =).',
          ],
          tips: ['⚠️ Never use Base64 to "hide" passwords or secrets. It has zero confidentiality. Use bcrypt or Argon2 for password hashing.'],
        },
        {
          heading: 'Use URL encoding when',
          paragraphs: [
            '1. Building query-string parameter values: `?q=Hello World & Friends` breaks the URL. It must be URL-encoded to `?q=Hello%20World%20%26%20Friends`.',
            '2. Passing JSON or any structured data as a single URL parameter. Double quotes, braces and colons all need escaping.',
            '3. Any non-ASCII character (Chinese, emoji) in a URL must go through UTF-8 followed by URL encoding.',
          ],
          code: [
            {
              lang: 'javascript',
              code: `// ❌ Wrong: concat JSON directly
fetch('/api/search?q=' + JSON.stringify({ author: 'Zhang' }))

// ✅ Right: encodeURIComponent the whole value
fetch('/api/search?q=' + encodeURIComponent(JSON.stringify({ author: 'Zhang' })))`,
            },
          ],
        },
        {
          heading: 'Common pitfalls',
          compare: [
            { left: 'Base64 makes data "invisible"', right: 'Base64 is just encoding. Anyone can decode it. Use real encryption (AES/RSA) if you need secrecy.' },
            { left: 'URL encoding = escaping double quotes', right: 'Plus, equals, ampersand, hash, question mark and non-ASCII all need escaping too. Use encodeURIComponent, not manual replacements.' },
            { left: 'Base64 output goes directly in URLs', right: 'Base64 contains + / =, which servers interpret as structural characters in query strings. Use the Base64url variant.' },
          ],
        },
      ],
    },
  },

  // -------------------- 2. JSON.parse 报错 --------------------
  {
    slug: 'json-parse-errors',
    date: '2026-11-11',
    tags: ['JSON', '调试', 'JavaScript'],
    toolKeys: ['dev/json-formatter'],
    zh: {
      title: 'JSON.parse 常见 10 种报错及修复',
      description: '从"Unexpected token }"到"BOM 字符"，把 JSON.parse 能抛出来的典型错误一网打尽，并给出根因和修复代码。',
      excerpt: 'JSON.parse() 的错误信息经常让人一头雾水。本篇把实际遇到的 10 类报错按"症状 → 根因 → 修复"格式整理，下次不用逐行排查。',
      body: [
        {
          heading: '错误信息怎么读',
          paragraphs: [
            'JSON.parse 的 SyntaxError 会告诉你：在哪个位置（index）、附近的上下文（position）、什么 token 不符合预期。例如 "Unexpected token \',\' in JSON at position 42" —— 第 42 位碰到了意料之外的逗号。',
            '但注意：位置是**从 JSON 字符串的第一个字符开始数的 0-based index**，不是第几行第几列。配合格式化工具（如本站 JSON 格式化器）可以把位置换算成行列，更容易定位。',
          ],
        },
        {
          heading: 'Top 5 高频错误',
          compare: [
            { left: '1. Trailing comma 尾逗号', right: 'JSON 不允许最后一个属性后面有逗号。用 ESLint 的 `jsonc/sort-keys` 规则、Prettier 格式化。' },
            { left: '2. 键名没加双引号', right: '`{name: "Qiuyun"}` 是 JS 对象字面量，不是 JSON。必须 `{"name":"Qiuyun"}`。' },
            { left: '3. 字符串内嵌未转义换行', right: 'JavaScript 的反引号模板字符串可以直接换行，但 JSON 字符串不行。要写成 `\\n`。' },
            { left: '4. 粘贴了 JS 对象而非 JSON', right: '带注释、带函数、带 undefined 的 JS 对象无法被 JSON.parse 解析。先 JSON.stringify 再 parse。' },
            { left: '5. BOM / 隐藏字符', right: '从 Windows 记事本或 Excel 复制的文本可能带 UTF-8 BOM（\\uFEFF），会让 parse 直接报 Unexpected token。用 `.replace(/^\\uFEFF/, "")` 去掉。' },
          ],
        },
        {
          heading: '调试流程推荐',
          paragraphs: [
            '第一步：把字符串复制到本站 JSON 格式化器，点格式化按钮。如果报错，它会告诉你具体位置和原因；如果不报错，说明 JSON 本身合法——那问题就在接收端（比如后端反序列化器有更严格的校验规则）。',
            '第二步：看错误信息的 position 字段，数一下对应的字符，或者把 JSON 格式化后按行列数。',
            '第三步：查是不是"服务端 JSON、客户端反序列化"还是反过来。两边语言版本不一致（比如 Python 2 vs 3 的 Unicode 处理、Go 的 JSON tag omitempty）会导致一边能过一边不能过。',
          ],
          code: [
            {
              lang: 'javascript',
              code: `// 防御性 parse 包装
function safeParse(raw) {
  // 去掉 BOM
  const clean = String(raw ?? '').replace(/^\\uFEFF/, '')
  try {
    return { ok: true, data: JSON.parse(clean) }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}`,
            },
          ],
        },
      ],
    },
    en: {
      title: 'Top 10 JSON.parse errors and how to fix them',
      description: 'From "Unexpected token }" to invisible BOM characters — the ten most common JSON.parse failures, each with cause and fix.',
      excerpt: 'JSON.parse SyntaxErrors are notoriously cryptic. This article catalogs ten real-world failures with the exact symptom → root cause → fix pattern you need to debug them in seconds.',
      body: [
        {
          heading: 'How to read the error message',
          paragraphs: [
            'A JSON.parse SyntaxError gives you three pieces: position (a 0-based index from the first character), surrounding context, and what token it expected. "Unexpected token \',\' in JSON at position 42" means a stray comma at the 43rd character.',
            'Note: position is an index into the raw string, not a line/column number. Run it through a JSON formatter to translate that index to (row, column) — much easier to scan visually.',
          ],
        },
        {
          heading: 'Top 5 by frequency',
          compare: [
            { left: '1. Trailing comma', right: 'JSON forbids a comma after the last property. Use ESLint `jsonc/sort-keys` rules or Prettier to catch it early.' },
            { left: '2. Unquoted keys', right: '`{name: "Qiuyun"}` is a JS object literal, not JSON. It must be `{"name":"Qiuyun"}`.' },
            { left: '3. Raw newline in string', right: 'Template literals allow literal newlines, but JSON strings do not. Use `\\n` escape sequences.' },
            { left: '4. JS object instead of JSON', right: 'Anything with comments, functions, or `undefined` is not valid JSON. JSON.stringify first, then parse.' },
            { left: '5. BOM / invisible char', right: 'Copies from Windows Notepad or Excel may carry a UTF-8 BOM (\\uFEFF). Strip it with `.replace(/^\\uFEFF/, "")`. ' },
          ],
        },
        {
          heading: 'Recommended debug flow',
          paragraphs: [
            'Step 1: Paste the string into the JSON formatter above. If it errors, the tool pinpoints the exact reason. If it does not, the JSON itself is valid — look at the receiving end (the backend deserializer may enforce stricter rules).',
            'Step 2: Take the position number from the error and count characters, or format first and use row/column.',
            'Step 3: Check which side produced the JSON and which side parses it. Mismatched language versions (Python 2 vs 3 Unicode handling, Go JSON omitempty tags) produce parse errors that look random at first.',
          ],
          code: [
            {
              lang: 'javascript',
              code: `// Defensive parse wrapper
function safeParse(raw) {
  const clean = String(raw ?? '').replace(/^\\uFEFF/, '')
  try {
    return { ok: true, data: JSON.parse(clean) }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}`,
            },
          ],
        },
      ],
    },
  },

  // -------------------- 3. Unix Timestamp Guide --------------------
  {
    slug: 'unix-timestamp-guide',
    date: '2026-11-11',
    tags: ['时间', '后端', '基础'],
    toolKeys: ['dev/timestamp'],
    zh: {
      title: 'Unix 时间戳完整指南',
      description: '从定义、时区、单位（秒 vs 毫秒）到 2038 年问题——把关于 Unix 时间戳的疑问一次全解开。',
      excerpt: 'Unix 时间戳看似简单，实则有不少坑：秒级 vs 毫秒级、时区展示 vs 存储、闰年闰秒、跨系统类型溢出。本文从原理到实战帮你彻底搞懂。',
      body: [
        {
          heading: '基本概念',
          paragraphs: [
            'Unix 时间戳（Unix timestamp / epoch time）是从 1970-01-01 00:00:00 UTC 起经过的秒数。UTC 是不带时区的绝对时间点——同一个时间戳在北京、纽约、悉尼都是同一个值，只是格式化成当地日期时不同。',
            '为什么用秒？1970 年选 1 月 1 日只是历史巧合（Unix 创始人 Ken Thompson 随手选的一个"方便"的日期），不是什么技术刚需。',
          ],
        },
        {
          heading: '秒级 vs 毫秒级（10 位 vs 13 位）',
          paragraphs: [
            '这是最常见的混乱来源。JavaScript 的 `Date.now()` 返回毫秒（13 位），Python 的 `time.time()` 返回秒（10 位）。Go 的 `time.Now().Unix()` 返回秒，`.UnixMilli()` 返回毫秒。',
            '本站时间戳转换器会自动识别 10 位/13 位并转成人类可读日期。如果你在自己项目里要做判断：数字长度 10 左右是秒、13 左右是毫秒。',
          ],
          code: [
            {
              lang: 'javascript',
              code: `// 秒级转 Date
new Date(1731312000 * 1000)
// 毫秒级直接转
new Date(1731312000000)
// 判断函数
function toDate(stamp) {
  const ms = String(stamp).length === 10 ? stamp * 1000 : stamp
  return new Date(ms)
}`,
            },
          ],
        },
        {
          heading: '2038 年问题',
          paragraphs: [
            '32 位有符号整数的秒级时间戳最大值是 2,147,483,647，对应 2038-01-19 03:14:07 UTC，超过就溢出成负数——也就是 "Unix Y2K"。',
            '现代 64 位系统早已天然解决（int64 秒级能表示到 292,278,993-04-11），但一些老的嵌入式系统、PHP 5 时代的遗留代码可能还受影响。如果你的后端还在用 32 位整数存时间戳，现在就要升级。',
          ],
          tips: ['💡 如果你是时间戳的"生产方"（后端 API），强烈建议统一用毫秒级（13 位）。JavaScript 原生支持，Python/Go/Rust 都有对应的毫秒 API，避免客户端猜单位。'],
        },
      ],
    },
    en: {
      title: 'The complete Unix timestamp guide',
      description: 'From definition and timezone handling to 2038 overflow — everything you need to know about Unix timestamps, one place.',
      excerpt: 'Unix timestamps look simple but are full of edge cases: seconds vs milliseconds, timezone storage vs display, leap seconds, cross-system overflows. This article clears them up end-to-end.',
      body: [
        {
          heading: 'Definition',
          paragraphs: [
            'A Unix timestamp (epoch time) is the number of seconds that have elapsed since 1970-01-01 00:00:00 UTC. UTC is timezone-agnostic — the same instant has identical numeric values in Beijing, New York, and Sydney; only the formatted date differs by zone.',
            'Why 1970-01-01? Pure historical coincidence: Unix co-creator Ken Thompson picked a "convenient" reference point on a date that happened to be easy to work with. No deeper technical reason.',
          ],
        },
        {
          heading: 'Seconds vs milliseconds (10 digits vs 13)',
          paragraphs: [
            'This is the most common source of confusion. JavaScript `Date.now()` returns milliseconds (13 digits). Python `time.time()` returns seconds (10). Go `time.Now().Unix()` gives seconds, `time.Now().UnixMilli()` gives milliseconds.',
            'Qiuyun\'s timestamp converter auto-detects both lengths and formats them for you. If you need to detect in your own code: count the digits, 10-ish → seconds, 13-ish → milliseconds.',
          ],
          code: [
            {
              lang: 'javascript',
              code: `// Second to Date
new Date(1731312000 * 1000)
// Millisecond to Date
new Date(1731312000000)
// Helper
function toDate(stamp) {
  const ms = String(stamp).length === 10 ? stamp * 1000 : stamp
  return new Date(ms)
}`,
            },
          ],
        },
        {
          heading: 'The year 2038 problem',
          paragraphs: [
            'A 32-bit signed integer maxes out at 2,147,483,647, which corresponds to 2038-01-19 03:14:07 UTC. After that, it overflows to negative — the Unix Y2K bug.',
            'Modern 64-bit systems handle this naturally (int64 can represent dates out to year 292 million). But legacy embedded platforms and older PHP-era code may still be vulnerable. If your backend stores timestamps as 32-bit int, plan an upgrade now.',
          ],
          tips: ['💡 If your API produces timestamps, standardize on milliseconds (13 digits). JavaScript supports them natively; Python/Go/Rust all have millisecond APIs. This eliminates guessing on the consumer side.'],
        },
      ],
    },
  },

  // -------------------- 4. 正则测试 --------------------
  {
    slug: 'regex-online-test',
    date: '2026-11-11',
    tags: ['正则', '调试', 'JavaScript'],
    toolKeys: ['dev/regex-tester'],
    zh: {
      title: '如何正确在线测试正则表达式',
      description: '正则写错一个转义就全盘皆输。推荐一个稳妥的在线测试流程 + 6 个必须记住的标志位和坑。',
      excerpt: '正则表达式难写、更难调试。很多开发者复制粘贴网上的正则却不理解它做了什么。本文给出一套从"写 → 测 → 固化"的完整流程。',
      body: [
        {
          heading: '标准测试流程',
          paragraphs: [
            '1. 先明确匹配目标：是"验证"（整个字符串是否符合）还是"提取"（从一段文本里抓出所有符合的子串）？这决定了你要不要加 ^ 和 $ 锚点。',
            '2. 准备测试用例：至少 3 条应该匹配的正面用例 + 3 条不应该匹配的负面用例。邮箱正则尤其要准备带引号、带引号内 @、带双点号的反例。',
            '3. 本站正则测试器支持实时匹配，每个匹配高亮显示。输入 → 看高亮对不对 → 再拷回代码。',
            '4. 代码里加测试（Jest / Vitest）：不要只依赖手动验证，把正反用例固化成单元测试，后续改动不会踩坑。',
          ],
        },
        {
          heading: '6 个必须记住的标志位',
          compare: [
            { left: 'g (global)', right: '返回所有匹配，不只第一个。用 .match() 时带 g 得到数组、不带 g 得到第一个匹配详情。' },
            { left: 'i (ignoreCase)', right: '忽略大小写。邮箱、域名匹配必带。' },
            { left: 'm (multiline)', right: '让 ^ 和 $ 匹配每行的开头/结尾，不是整个字符串的。要匹配多行里的最后一行加此标志。' },
            { left: 's (dotAll)', right: '让 . 也匹配换行符 \\n。不带 s 时 . 默认不匹配换行。' },
            { left: 'u (unicode)', right: '正确处理 emoji 和 CJK 字符。\\w 默认只匹配 [A-Za-z0-9_]，加 u 后才能匹配中文字。' },
            { left: 'y (sticky)', right: '从 lastIndex 开始匹配，失败就停。写解析器时有用，但很少用到。' },
          ],
        },
        {
          heading: '最容易踩的三个坑',
          tips: [
            '⚠️ 嵌套量词的 ReDoS：(a+)+、(a|a)* 这类写法在特定输入上可能指数级消耗 CPU。生产正则尽量避免嵌套量词。',
            '⚠️ JavaScript 不支持 (?P<name>) 命名捕获组写法（Python/PCRE 风格），要用 (?<name>...) 形式。',
            '⚠️ .test() 带 g 标志时会记住 lastIndex，连续调用可能第一次返回 true、第二次 false。用 .match() 或每次创建新 RegExp 实例避免。',
          ],
        },
      ],
    },
    en: {
      title: 'How to correctly test regular expressions online',
      description: 'A tiny mistake in a regex and the whole thing is broken. A reliable workflow plus the six flags you must memorize.',
      excerpt: 'Regexes are hard to write and harder to debug. Many developers copy one from Stack Overflow without understanding what it actually does. This article gives you a full write → test → freeze workflow.',
      body: [
        {
          heading: 'Standard test workflow',
          paragraphs: [
            '1. Decide the goal first: validation (does the whole string match?) or extraction (find all matches inside a larger text)? This tells you whether to add ^ and $ anchors.',
            '2. Prepare test cases: at least 3 positive cases that should match, and 3 negative cases that should not. For email regexes especially, use quotes-in-quoted-string, double @, and double dots as negatives.',
            '3. Qiuyun\'s regex tester highlights every match in real time. Type → see what is highlighted → copy to your code.',
            '4. Freeze tests in Jest / Vitest: do not rely on manual verification. Lock both positive and negative cases as unit tests so future refactors do not silently break them.',
          ],
        },
        {
          heading: 'Six flags you must know',
          compare: [
            { left: 'g (global)', right: 'Return every match, not just the first. `.match()` with g gives an array; without g gives details on the first match only.' },
            { left: 'i (ignoreCase)', right: 'Case-insensitive. Use this for email and domain matching.' },
            { left: 'm (multiline)', right: 'Makes ^ and $ anchor to each line, not the whole string. Use this when the target is multi-line and you want the last line specifically.' },
            { left: 's (dotAll)', right: 'Makes `.` match newline `\\n` too. Without s, `.` skips newlines by default.' },
            { left: 'u (unicode)', right: 'Correctly handles emoji and CJK characters. Without it, `\\w` only matches [A-Za-z0-9_]; with u it matches Han characters.' },
            { left: 'y (sticky)', right: 'Match only starting from lastIndex, stop on failure. Useful for parsers but rarely needed.' },
          ],
        },
        {
          heading: 'The three most common pitfalls',
          tips: [
            '⚠️ ReDoS from nested quantifiers: patterns like (a+)+ or (a|a)* can take exponential time on crafted input. Avoid nested quantifiers in production regex.',
            '⚠️ JavaScript does not support Python-style `(?P<name>)` named groups. Use `(?<name>...)` instead.',
            '⚠️ `.test()` with the `g` flag remembers `lastIndex`. Called twice in a row, it may return true then false. Use `.match()` or create a new RegExp each time.',
          ],
        },
      ],
    },
  },

  // -------------------- 5. 图片压缩 --------------------
  {
    slug: 'image-compress-web',
    date: '2026-11-11',
    tags: ['图片', '性能', '前端'],
    toolKeys: ['image/image-compress'],
    zh: {
      title: '网页图片压缩全指南',
      description: '图片是网页性能最大杀手。从原理、浏览器支持、到本站压缩器如何渐进式优化，一篇讲透。',
      excerpt: 'Google PageSpeed Insights 里的"Serve images in next-gen formats"和"Properly size images"警告，背后是一套比改后缀名复杂得多的压缩体系。',
      body: [
        {
          heading: '为什么图片压缩值得花时间',
          paragraphs: [
            'Chrome 加载一张图片的开销：DNS + TCP + TLS + HTTP 请求 + 传输 + 解码 + 光栅化 + 绘制。其中传输体积直接决定了时间——一张 4MB 的 JPG 在 4G 网络上要多等 2-3 秒。',
            'Google PageSpeed Insights 的 Core Web Vitals 里，LCP（Largest Contentful Paint）几乎总是被最大的那张图片拉慢。把首屏最大图降到 200KB 以下，LCP 大概率可以降到 2.5 秒以内。',
          ],
        },
        {
          heading: 'PNG vs JPG vs WebP vs AVIF 怎么选',
          compare: [
            { left: 'PNG', right: '无损，适合图标、Logo、带透明通道的图形。不适合照片——同内容比 JPG 大 5-10 倍。' },
            { left: 'JPG (quality 0.7-0.8)', right: '有损，适合照片、渐变多的图。质量 0.8 是视觉和体积的经典平衡点。' },
            { left: 'WebP', right: '同时支持无损和有损，体积比 JPG 再小 25-35%。Chrome/Safari/Firefox 2023+ 全部支持。' },
            { left: 'AVIF', right: '新一代有损格式，比 WebP 再小 20-30%。编码速度慢，适合静态资源用构建期生成。' },
          ],
        },
        {
          heading: '本站压缩器的渐进式策略',
          paragraphs: [
            '本站图片压缩器完全在浏览器内运行——不上传任何像素到服务器。它的工作流是：canvas.toBlob 以 q=0.8 开始，检测输出体积；如果还不够小就降低到 0.7，以此类推，直到满足你设置的目标或到达最低质量阈值。',
            '渐进式的好处：你可以先压一次、看效果，再调参数。默认参数对 90% 的场景够用，复杂的细节保留（比如带大量细密纹理的摄影作品）建议把质量调到 0.9-1.0。',
          ],
          tips: ['💡 压缩前先看原始尺寸。一张 4000×3000 的图片放到网页里显示成 800px 宽，压缩完还是浪费带宽。先改尺寸再压缩，双重优化。'],
        },
      ],
    },
    en: {
      title: 'The complete guide to compressing images for the web',
      description: 'Images are the single biggest cause of slow pages. Principles, browser support, and how Qiuyun\'s progressive compressor works — explained.',
      excerpt: 'Google PageSpeed Insights warnings like "Serve images in next-gen formats" and "Properly size images" are symptoms of a much larger compression ecosystem that turns out to be more nuanced than just changing a file extension.',
      body: [
        {
          heading: 'Why image compression is worth the time',
          paragraphs: [
            'Loading a single image in Chrome costs: DNS + TCP + TLS + HTTP request + transfer + decode + rasterize + paint. Transfer size directly drives how long the total wait takes — a 4 MB JPG adds 2–3 seconds over 4G.',
            'In Core Web Vitals, LCP (Largest Contentful Paint) is almost always dragged down by the largest image above the fold. Drop that to 200 KB and your LCP likely lands under 2.5 s.',
          ],
        },
        {
          heading: 'PNG vs JPG vs WebP vs AVIF',
          compare: [
            { left: 'PNG', right: 'Lossless, perfect for icons, logos, and anything with transparency. Never use for photos — same content is 5-10× larger than JPG.' },
            { left: 'JPG (quality 0.7–0.8)', right: 'Lossy, ideal for photos and gradient-heavy images. q=0.8 is the classic trade-off between visual fidelity and size.' },
            { left: 'WebP', right: 'Supports both lossy and lossless, typically 25–35% smaller than equivalent JPG. Chrome, Safari and Firefox (2023+) all support it.' },
            { left: 'AVIF', right: 'Next-gen lossy format, another 20–30% smaller than WebP. Slow to encode — best generated at build time for static assets.' },
          ],
        },
        {
          heading: 'How Qiuyun\'s progressive compressor works',
          paragraphs: [
            'Qiuyun runs entirely in your browser — no pixel is ever uploaded to a server. The pipeline: canvas.toBlob starts at q=0.8, measures the output, and if it is still too large, steps down to 0.7 and so on, until your target is met or a minimum-quality floor is reached.',
            'The progressive strategy lets you compress once, inspect the result, and tune parameters. Defaults work for 90% of cases; for detail-rich photography, push quality to 0.9–1.0 to preserve textures.',
          ],
          tips: ['💡 Before compressing, check the original pixel dimensions. A 4000×3000 image displayed at 800 px wide wastes bandwidth even after compression. Resize first, then compress — double win.'],
        },
      ],
    },
  },

  // -------------------- 6. WCAG 颜色对比度 --------------------
  {
    slug: 'wcag-color-contrast',
    date: '2026-11-11',
    tags: ['WCAG', '无障碍', '前端'],
    toolKeys: ['frontend/color-picker'],
    zh: {
      title: 'WCAG 颜色对比度 AA/AAA 速查',
      description: '你网站的文字颜色对色弱或弱视用户友好吗？本站颜色选择器实时告诉你是否达标，本文解释规则背后的原理。',
      excerpt: 'WCAG 是 Web Content Accessibility Guidelines，规定了网页对不同能力用户的最低可访问性要求。对比度是其中最容易量化、最容易被忽视的一项。',
      body: [
        {
          heading: 'AA 和 AAA 是什么',
          paragraphs: [
            'WCAG 把对比度要求分两档。AA 是大部分产品的合规底线（很多国家的无障碍法规要求至少 AA），AAA 是更高目标。',
            '计算方式是前景色与背景色的"相对亮度"之比。纯黑 #000000 在纯白 #FFFFFF 上是 21:1，是对比度上限。对比度算法基于感知亮度，不是 RGB 值差。',
          ],
          compare: [
            { left: 'AA 级', right: '正文（≤18px）≥ 4.5:1；大号（≥24px 或加粗 ≥18px）≥ 3:1。大多数企业站、SaaS 产品的合规底线。' },
            { left: 'AAA 级', right: '正文 ≥ 7:1；大号 ≥ 4.5:1。适用于老年人和弱视用户比例较高的场景（政府网站、医疗应用）。' },
          ],
        },
        {
          heading: '常见不合规场景',
          tips: [
            '⚠️ 浅灰文字配白底：#666666 on #FFFFFF 对比度只有 3.68:1，连 AA 都过不了。改成 #555555（4.58:1）就刚好达标。',
            '⚠️ 彩色文字做正文：#6366f1（Tailwind indigo-500）在白底上是 4.65:1，勉强 AA；但 #818cf8（indigo-400）只有 3.08:1，完全不适合当正文。',
            '⚠️ 按钮文字：按钮背景色也要考虑对比度。深绿按钮上的白色文字（#16a34a + #FFFFFF = 3.93:1）在大号按钮上能过 AA，但正文大小按钮就不行了。',
          ],
        },
        {
          heading: '快速自测方法',
          paragraphs: [
            '打开本站颜色选择器，分别输入前景色和背景色，页面上会实时显示 WCAG AA / AAA 是否达标、精确对比度值是多少。把达不到的颜色当场替换掉，比事后返工成本低得多。',
            'Chrome DevTools 内置了对比度检查器：Elements → 选中元素 → Computed → Color。达不到的颜色旁边会有一个小感叹号。',
          ],
        },
      ],
    },
    en: {
      title: 'WCAG AA / AAA color contrast quick reference',
      description: 'Is your text accessible to users with low vision or color blindness? Qiuyun\'s color picker tells you live whether you pass, and this article explains why.',
      excerpt: 'WCAG, the Web Content Accessibility Guidelines, defines minimum accessibility requirements for users with a range of abilities. Contrast is one of the easiest to measure — and the easiest to overlook.',
      body: [
        {
          heading: 'What AA and AAA mean',
          paragraphs: [
            'WCAG defines two contrast tiers. AA is the compliance floor for most products (many countries mandate at least AA), while AAA is the higher aspiration.',
            'Contrast is calculated as a ratio between the relative luminances of foreground and background. Pure black on pure white gives 21:1, the theoretical maximum. The algorithm is perceptual, not arithmetic on RGB values.',
          ],
          compare: [
            { left: 'AA', right: 'Body text (≤18px) ≥ 4.5:1; Large text (≥24px or bold ≥18px) ≥ 3:1. Baseline compliance for corporate sites and SaaS.' },
            { left: 'AAA', right: 'Body text ≥ 7:1; Large text ≥ 4.5:1. Target for sites serving older or vision-impaired users (government, healthcare).' },
          ],
        },
        {
          heading: 'Common non-compliant patterns',
          tips: [
            '⚠️ Light gray on white: #666666 on #FFFFFF is only 3.68:1, below AA. Darken to #555555 (4.58:1) to barely pass.',
            '⚠️ Colored body text: #6366f1 (Tailwind indigo-500) on white is 4.65:1, just barely AA. #818cf8 (indigo-400) drops to 3.08:1 — unusable for body text.',
            '⚠️ Button text: do not forget to contrast the button background too. White text on #16a34a (dark green) is 3.93:1 — fine for a large button, not for body-sized buttons.',
          ],
        },
        {
          heading: 'How to self-check quickly',
          paragraphs: [
            'Open Qiuyun\'s color picker, enter foreground and background, and the page shows you in real time whether AA and AAA pass, plus the exact contrast ratio. Fix it there — way cheaper than reworking later.',
            'Chrome DevTools ships a built-in contrast checker: Elements → select the element → Computed → Color. Failing colors get a small exclamation mark.',
          ],
        },
      ],
    },
  },

  // -------------------- 7. MD5 vs SHA --------------------
  {
    slug: 'md5-vs-sha',
    date: '2026-11-11',
    tags: ['哈希', '安全', '加密'],
    toolKeys: ['crypto/md5'],
    zh: {
      title: 'MD5、SHA-1、SHA-256 怎么选？',
      description: '从密码哈希到文件签名，不同场景对哈希算法的要求天差地别。一个简单的选型指南。',
      excerpt: 'MD5 是不可逆的、SHA-1 快但不安全、SHA-256 是当前主流、SHA-3 是 NIST 标准但少有人用。本文帮你快速对号入座。',
      body: [
        {
          heading: '哈希 vs 加密 vs 编码',
          paragraphs: [
            '这三个概念经常被混淆。哈希（hash）是单向——不可逆，相同输入永远产生相同输出。加密（encrypt）是双向——密文可以解密回原文。编码（encode）是格式转换——没有安全目的。',
            'MD5、SHA 系列都是哈希算法。AES、RSA 是加密算法。Base64、URL 编码是编码方式。安全场景选哈希/加密，纯传输场景选编码。',
          ],
        },
        {
          heading: '常见哈希算法选型',
          compare: [
            { left: 'MD5 (128-bit)', right: '快、输出短。**不再用于安全签名**（2008 年已公开碰撞构造）。适合：文件完整性校验、去重、简单的"快速指纹"。' },
            { left: 'SHA-1 (160-bit)', right: '比 MD5 慢、更安全但 2020 年被 Google 公开 SHA-1 碰撞攻击，证书签名已全面淘汰。新项目直接跳过。' },
            { left: 'SHA-256 (256-bit)', right: '当前主力标准。快、碰撞难度极高、NIST 推荐、HTTPS/TLS/证书默认使用。新项目首选。' },
            { left: 'SHA-3 (224-512-bit)', right: 'NIST 新一代标准，算法结构和 SHA-2 完全不同（Keccak 结构），抗量子更友好。但生态较少用，除非有明确合规要求否则用 SHA-256。' },
            { left: 'BLAKE2 / BLAKE3', right: '开源现代哈希，比 SHA-256 快得多，安全强度相当。Go 1.19+ 内置 BLAKE3。对性能敏感的后端项目值得考虑。' },
          ],
        },
        {
          heading: '密码存专用：慢哈希',
          paragraphs: [
            '密码**绝不能**用 MD5 / SHA-1 / SHA-256 这类"快哈希"存。为什么？因为快意味着攻击者每秒能算数十亿次，配合彩虹表，短密码秒破。',
            '密码应该用"慢哈希"：bcrypt（自动带盐 + 可调成本因子）、Argon2（Argon2id 是 OWASP 2023 推荐）、PBKDF2（NIST 密码存储标准）。这些算法设计成"故意慢"，而且迭代次数可以调——硬件变强了你把迭代次数调高就行。',
          ],
          tips: ['⚠️ 规则：哈希算法用途分两类，要"快速、短指纹" → MD5/SHA-256；要"存密码" → bcrypt/Argon2。绝不用同一类算法做两件事。'],
        },
      ],
    },
    en: {
      title: 'How to choose between MD5, SHA-1, SHA-256, SHA-3',
      description: 'Password hashing vs file signing vs simple fingerprinting — each use case demands a different algorithm. A simple decision guide.',
      excerpt: 'MD5 is broken for security signatures, SHA-1 is deprecated, SHA-256 is today\'s workhorse, SHA-3 is NIST\'s standard but underused. Here is how to pick.',
      body: [
        {
          heading: 'Hash vs encryption vs encoding',
          paragraphs: [
            'Three terms that get mixed up all the time. Hash is one-way — irreversible, same input always produces the same output. Encryption is two-way — ciphertext can be decrypted back to plaintext. Encoding is format conversion — no security purpose at all.',
            'MD5, SHA-family are hash algorithms. AES, RSA are encryption algorithms. Base64, URL encoding are encoding schemes. For security, pick a hash or encryption algorithm. For transport, pick an encoding.',
          ],
        },
        {
          heading: 'Pick guide by algorithm',
          compare: [
            { left: 'MD5 (128-bit)', right: 'Fast, short output. **No longer for security signatures** (collisions publicly constructible since 2008). Good for: file-integrity checks, deduplication, quick fingerprints.' },
            { left: 'SHA-1 (160-bit)', right: 'Slower than MD5, more secure, but Google published a real-world SHA-1 collision in 2020. Certificate signing is fully deprecated. Skip for new projects.' },
            { left: 'SHA-256 (256-bit)', right: 'Today\'s workhorse. Fast, collision resistance effectively unbreakable, NIST-recommended, default in HTTPS/TLS/certificates. First choice for new projects.' },
            { left: 'SHA-3 (224–512-bit)', right: 'NIST\'s next standard, built on a different structure (Keccak) resistant to quantum attacks. Ecosystem is still small — use it only if you have an explicit compliance requirement.' },
            { left: 'BLAKE2 / BLAKE3', right: 'Modern open-source hashes, dramatically faster than SHA-256 with equivalent security. Go 1.19+ ships BLAKE3. Worth considering for performance-sensitive backends.' },
          ],
        },
        {
          heading: 'For password storage — use a slow hash',
          paragraphs: [
            'Passwords must never be stored with a fast hash like MD5 / SHA-1 / SHA-256. Why? Fast means an attacker can compute billions of hashes per second and crack short passwords instantly with rainbow tables.',
            'Use a **slow hash** designed specifically for passwords: bcrypt (auto-salted, tunable cost factor), Argon2 (Argon2id is OWASP 2023 recommended), PBKDF2 (NIST standard for password storage). These algorithms are intentionally slow, and you can tune iteration counts upward as hardware gets stronger.',
          ],
          tips: ['⚠️ Rule of thumb: "fast, short fingerprint" → MD5/SHA-256; "store a password" → bcrypt/Argon2. Never use the same algorithm for both.'],
        },
      ],
    },
  },

  // -------------------- 8. CORS 报错排查 --------------------
  {
    slug: 'cors-error-guide',
    date: '2026-11-11',
    tags: ['HTTP', '跨域', '排错'],
    toolKeys: ['dev/http-request'],
    zh: {
      title: 'CORS 跨域报错完全指南：从预检到响应头',
      description: '浏览器报 CORS 错误时，问题几乎总在服务端而不是前端代码。本文按报错类型逐条给出根因和修复方式。',
      excerpt: 'CORS 不是服务器在拒绝你，而是浏览器在保护用户。理解这一点，再看到红色的跨域报错就知道该改哪一行配置了。',
      body: [
        {
          heading: '先厘清责任方',
          paragraphs: [
            'CORS（跨源资源共享）是浏览器的安全机制：页面发起的跨域请求，只有在服务端明确返回允许的头时，浏览器才把响应交给 JavaScript。请求其实已经到达服务器、服务器也已经响应了，只是浏览器拒绝把结果交给你的代码。',
            '这就是为什么用 curl 或 Postman 请求同一个地址一切正常，而在页面上却报错——它们不受同源策略约束。所以排查方向永远是服务端配置，不是前端 fetch 写法。',
          ],
        },
        {
          heading: '预检请求是什么',
          paragraphs: [
            '当请求满足以下任一条件时，浏览器会先发一个 OPTIONS 请求，称为预检：使用了 GET/POST/HEAD 以外的方法、Content-Type 是 application/json 这类非简单类型、或者带了自定义请求头（例如 Authorization）。',
            '预检请求携带 Access-Control-Request-Method 和 Access-Control-Request-Headers，询问服务器「我能不能发这个请求」。服务器必须响应 2xx，并在响应头里允许对应的方法和头，浏览器才会发真实请求。',
            '很多故障就发生在这一步：Nginx 或网关没有把 OPTIONS 转发给应用，直接返回 405 或 404，于是浏览器报「preflight response is not successful」。',
          ],
          code: [
            {
              lang: 'nginx',
              code: `location /api/ {
    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin  $http_origin always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;
        add_header Access-Control-Max-Age 86400 always;
        return 204;
    }
}`,
            },
          ],
        },
        {
          heading: '五类报错逐条对照',
          compare: [
            { left: 'No Access-Control-Allow-Origin header', right: '服务端没有返回该头，或返回的域名与页面来源不完全一致（http/https、端口、子域名都算不同源）。开发环境可以用 $http_origin 回显，但生产环境应使用白名单校验。' },
            { left: 'Credentials 相关报错', right: '前端设置了 credentials: include 时，服务端不能返回 Access-Control-Allow-Origin: *，必须回显具体域名，同时返回 Access-Control-Allow-Credentials: true。' },
            { left: 'Request header field X is not allowed', right: '请求头没有出现在 Access-Control-Allow-Headers 里。新增 Authorization 或自定义业务头之后，这一项要同步更新。' },
            { left: 'Method PUT is not allowed', right: 'Access-Control-Allow-Methods 没包含该方法。默认只允许 GET 和 POST，REST 接口必须显式列出。' },
            { left: 'Header contains multiple values', right: 'Nginx 和应用各加了一次同样的头，浏览器看到重复值直接判定失败。只在一层配置 CORS，另一层用 add_header 的 always 参数或关闭继承。' },
          ],
        },
        {
          heading: '什么时候不该依赖 CORS',
          paragraphs: [
            '如果目标接口完全不受你控制（第三方 API 不返回 CORS 头），前端无论怎么改都没用。此时的正解是在自己的服务端做一层代理转发，让浏览器请求同源的地址，由服务端去调第三方。',
            '把接口开放为 Access-Control-Allow-Origin: * 也不是好习惯：它等于允许任何网站带着用户的浏览器身份去调用你的接口。涉及登录态的接口必须用白名单加凭证校验。',
          ],
          tips: ['💡 调试技巧：在浏览器开发者工具 Network 面板里勾选 Preserve log，刷新后先看 OPTIONS 请求的状态码和响应头。预检失败时真实请求根本不会发出，看到「没有请求」并不是请求被吞了。'],
        },
      ],
    },
    en: {
      title: 'CORS errors explained: from preflight to response headers',
      description: 'When the browser reports a CORS error, the bug is almost always server-side. A checklist of each error type with root cause and fix.',
      excerpt: 'CORS is not the server rejecting you — it is the browser protecting the user. Once that clicks, a red cross-origin error tells you exactly which config line to change.',
      body: [
        {
          heading: 'Who is actually blocking',
          paragraphs: [
            'CORS is a browser mechanism. A cross-origin request from a page only reaches your JavaScript if the server explicitly returns the right headers. The request did reach the server and the server did respond — the browser simply refuses to hand the response to your code.',
            'That is why the same URL works in curl or Postman but fails on a page: those clients are not bound by the same-origin policy. Always look at server configuration first, not at how you wrote fetch.',
          ],
        },
        {
          heading: 'What a preflight is',
          paragraphs: [
            'The browser sends an OPTIONS preflight when a request uses a method other than GET, POST, or HEAD, when Content-Type is something like application/json, or when custom headers such as Authorization are present.',
            'The preflight carries Access-Control-Request-Method and Access-Control-Request-Headers, asking the server whether the real request is permitted. The server must answer 2xx and allow the method and headers, or the browser never sends the real request.',
            'Many failures happen right here: a proxy or gateway does not forward OPTIONS to the app and returns 405 or 404, so the browser reports that the preflight was unsuccessful.',
          ],
          code: [
            {
              lang: 'nginx',
              code: `location /api/ {
    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin  $http_origin always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;
        add_header Access-Control-Max-Age 86400 always;
        return 204;
    }
}`,
            },
          ],
        },
        {
          heading: 'Five errors, five fixes',
          compare: [
            { left: 'No Access-Control-Allow-Origin header', right: 'The header is missing, or its origin does not exactly match the page origin — scheme, port, and subdomain all count. Echoing $http_origin works in development; production should validate against a whitelist.' },
            { left: 'Credentials errors', right: 'With credentials: include the server cannot return Access-Control-Allow-Origin: *, it must echo the specific origin and also send Access-Control-Allow-Credentials: true.' },
            { left: 'Request header field X is not allowed', right: 'The header is missing from Access-Control-Allow-Headers. Adding Authorization or a custom business header means updating this list.' },
            { left: 'Method PUT is not allowed', right: 'Access-Control-Allow-Methods does not include it. Only GET and POST are implied, so REST endpoints must list every verb explicitly.' },
            { left: 'Header contains multiple values', right: 'Both Nginx and the app added the same header, and the browser rejects the duplicate. Configure CORS in exactly one layer.' },
          ],
        },
        {
          heading: 'When CORS is the wrong answer',
          paragraphs: [
            'If you do not control the target API and it returns no CORS headers, no frontend change will help. The correct fix is a small server-side proxy: the browser calls your own origin, and your server calls the third party.',
            'Blanket Access-Control-Allow-Origin: * is also a bad habit — it lets any site call your API with the user browser identity attached. Endpoints that depend on a session need an origin whitelist plus credential checks.',
          ],
          tips: ['💡 Debugging tip: enable Preserve log in the Network panel and reload. Look at the OPTIONS request status and headers first. If the preflight fails, the real request is never sent — an empty request list does not mean the request vanished.'],
        },
      ],
    },
  },

  // -------------------- 9. 等额本息 vs 等额本金 --------------------
  {
    slug: 'mortgage-equal-payment-vs-equal-principal',
    date: '2026-11-11',
    tags: ['房贷', '理财', '计算'],
    toolKeys: ['life/mortgage'],
    zh: {
      title: '等额本息 vs 等额本金：差多少钱，怎么选',
      description: '用一组真实数字拆解两种还款方式的月供曲线和总利息差异，并给出选择判断标准。',
      excerpt: '同样是 100 万 30 年，两种方式的总利息能差出十几万，但月供压力完全不同。只看利息总额做决定，往往会选错。',
      body: [
        {
          heading: '两种方式到底差在哪',
          paragraphs: [
            '等额本息：每月还款额固定。银行先算出一个月供值，让 360 期连本带息正好还清。由于剩余本金在减少，早期月供里利息占比高、本金占比低，后期反过来。',
            '等额本金：每月偿还的本金固定（贷款总额 ÷ 期数），利息按剩余本金计算，所以月供逐月递减。首月压力最大，之后越来越轻松。',
            '等额本息的月供公式是 P × i × (1+i)^n ÷ ((1+i)^n − 1)，其中 P 是本金、i 是月利率、n 是期数。等额本金首月是 P/n + P×i，每月递减 P/n×i。',
          ],
        },
        {
          heading: '一组数字看清差异',
          paragraphs: [
            '假设贷款 100 万、30 年、年利率 4.2%（月利率 0.35%），粗略结果如下：',
          ],
          compare: [
            { left: '等额本息', right: '月供约 4890 元，30 年不变；总还款约 176 万，其中利息约 76 万。' },
            { left: '等额本金', right: '首月约 6278 元，末月约 2788 元，每月递减约 9.7 元；总还款约 163 万，其中利息约 63 万。' },
            { left: '差额', right: '等额本金总利息少约 13 万，代价是前几年每月多还约 1400 元，且前期现金流压力持续存在。' },
          ],
        },
        {
          heading: '怎么选，看三个问题',
          paragraphs: [
            '第一，月供占收入比。如果等额本金的首月月供超过家庭月收入的 50%，生活会很紧，任何意外都会变成风险。等额本息月供低，容错空间大。',
            '第二，你有没有更高收益的用途。等额本息省下来的月供如果只是躺在活期里，那确实不如还本金；但如果用于收益率高于贷款利率的稳健投资，或者用于应急储备，差额利息就买到了流动性。',
            '第三，你打算提前还款吗。打算几年内提前还款的话，前期多还本金的方式优势更明显；但如果前几年本就现金流紧张，强行选等额本金反而容易中途违约。',
          ],
          tips: ['⚠️ 利率不是固定的。LPR 调整后月供会变，上面的数字只是按当前利率做的静态估算。签约前用银行的计算器复核一遍，并确认重定价日和加点数值。'],
        },
        {
          heading: '提前还款的两个选项',
          paragraphs: [
            '缩短年限：月供基本不变，还款期变短，省下的利息最多。适合收入稳定、想尽快卸掉负债的人。',
            '减少月供：年限不变，每月压力变小。适合收入可能下降、或者需要腾出现金流的家庭。',
            '还要留意合同里的违约金条款和预约排队要求——不少银行规定还款满一年才能申请，且每年有次数上限。',
          ],
        },
      ],
    },
    en: {
      title: 'Equal payment vs equal principal: the real cost difference',
      description: 'A worked example showing how the two repayment methods differ in monthly payment and total interest, plus how to choose.',
      excerpt: 'On the same 1,000,000 loan over 30 years the total interest can differ by well over 100,000 — but the monthly pressure is completely different. Choosing by interest alone is usually the wrong call.',
      body: [
        {
          heading: 'The mechanical difference',
          paragraphs: [
            'Equal payment keeps the monthly amount fixed. The bank solves for a payment that clears principal plus interest over all periods. Because the remaining balance declines, early payments are mostly interest and later ones mostly principal.',
            'Equal principal repays a fixed amount of principal each month (loan ÷ periods) and charges interest on the remaining balance, so the payment declines every month. The first month is the heaviest and it eases from there.',
            'The equal-payment formula is P × i × (1+i)^n ÷ ((1+i)^n − 1), where P is principal, i the monthly rate, and n the number of periods. Equal principal starts at P/n + P×i and falls by P/n×i each month.',
          ],
        },
        {
          heading: 'A concrete comparison',
          paragraphs: [
            'Take a 1,000,000 loan over 30 years at 4.2% annual interest (0.35% monthly). Roughly:',
          ],
          compare: [
            { left: 'Equal payment', right: 'About 4,890 per month for the full 30 years; total repayment around 1.76 million, of which roughly 760,000 is interest.' },
            { left: 'Equal principal', right: 'About 6,278 in month one, 2,788 in the last month, declining by roughly 9.7 each month; total repayment around 1.63 million, interest about 630,000.' },
            { left: 'The gap', right: 'Equal principal saves roughly 130,000 in interest, at the cost of about 1,400 more per month in the early years.' },
          ],
        },
        {
          heading: 'Three questions that decide it',
          paragraphs: [
            'First, what share of income does the payment take? If the equal-principal first payment exceeds half of household income, life gets tight and any surprise becomes a risk. Equal payment leaves more room for error.',
            'Second, do you have a better use for the money? If the saved payment would sit idle, paying principal is better. If it funds an investment yielding more than the loan rate, or an emergency reserve, the extra interest buys liquidity.',
            'Third, will you prepay? If you plan to pay down early, front-loading principal helps more. But if cash flow is already tight, forcing equal principal invites default.',
          ],
          tips: ['⚠️ Rates are not fixed. Floating-rate adjustments move the payment, and these figures are a static estimate at the current rate. Verify with the bank calculator and confirm the repricing date and spread.'],
        },
        {
          heading: 'Two ways to prepay',
          paragraphs: [
            'Shorten the term: the payment stays roughly the same, the loan ends sooner, and the interest saved is largest. Good for stable income and a desire to be debt-free sooner.',
            'Reduce the payment: the term is unchanged and monthly pressure drops. Better when income may fall or cash flow needs freeing up.',
            'Also check prepayment penalties and booking requirements — many banks require a year of payments first and cap the number of prepayments per year.',
          ],
        },
      ],
    },
  },

  // -------------------- 10. 税前工资到手多少 --------------------
  {
    slug: 'salary-take-home-china',
    date: '2026-11-11',
    tags: ['个税', '社保', '计算'],
    toolKeys: ['life/salary'],
    zh: {
      title: '税前 2 万到手多少：五险一金与个税拆解',
      description: '按真实计算顺序拆解工资条上的每一笔扣除，含五险一金比例、累计预扣法和年终奖计税差异。',
      excerpt: '谈薪时说的是税前，到账时少了一大截。差额不是被公司扣了，而是社保、公积金和个税。这笔账其实可以算得很清楚。',
      body: [
        {
          heading: '扣除顺序决定结果',
          paragraphs: [
            '工资条的逻辑是：应发工资 − 五险一金个人部分 − 个税 = 实发工资。个税不是在应发工资上直接算的，而是在扣除五险一金和起征点（5000 元）之后的余额上算的。顺序错了，算出来的税一定不对。',
            '专项附加扣除（子女教育、继续教育、大病医疗、住房贷款利息、住房租金、赡养老人、3 岁以下婴幼儿照护）进一步减少应纳税所得额。很多人漏填这一项，等于每月多交几百元税。',
          ],
        },
        {
          heading: '五险一金个人部分的比例',
          compare: [
            { left: '养老保险', right: '个人缴 8%，进入个人账户，退休后按月领取。这是五险里个人负担最重的一项。' },
            { left: '医疗保险', right: '个人缴 2% 左右（各地略有差异），另加大病医疗的固定金额，进个人账户可用于门诊买药。' },
            { left: '失业保险', right: '个人缴 0.5% 左右，金额很小，主要用于失业期间的补助。' },
            { left: '公积金', right: '个人缴 5% 至 12%，单位同比例缴纳。这笔钱全额进入个人账户，可用于买房、租房、还贷，实质仍是你的资产。' },
            { left: '工伤与生育', right: '个人不缴，全部由单位承担。看到工资条上这两项为 0 是正常的。' },
          ],
        },
        {
          heading: '为什么个税每月不一样',
          paragraphs: [
            '2019 年之后实行累计预扣法：每月按「年初到本月的累计收入 − 累计扣除」查年度税率表，算出累计应缴税额，再减去前几个月已经缴的，差额就是本月个税。',
            '结果是年初几个月税少、年中之后逐渐变多，年底最高。这不是公司算错，而是累计计税的正常表现。全年总额固定，只是分布不均匀。',
            '月薪 2 万、公积金按 12%、社保基数按 2 万、无专项附加扣除的粗算：五险一金个人部分约 4500 元，全年应纳税所得额约 12.6 万，落在 10% 档，全年个税约 1 万元，月均约 840 元，到手约 1.47 万元。',
          ],
          tips: ['💡 公积金比例是可以谈的。同样税前 2 万，公积金 5% 和 12% 的到手现金差约 1400 元/月，但账户余额差 2800 元/月（含单位部分）。短期要现金就选低比例，长期要买房就选高比例。'],
        },
        {
          heading: '年终奖怎么计税更省',
          paragraphs: [
            '年终奖有两种计税方式：单独计税（除以 12 后按月度税率表找税率，再乘回全额）和并入当年综合所得。政策上两种可选，选哪种取决于金额。',
            '工资不高、专项附加扣除没用完的人，并入综合所得往往更省；工资较高的人，单独计税通常更划算。存在几个「临界点」——奖金刚过多一元就可能跳档，多交上千元税，公司财务一般会提醒。',
            '注意年终奖单独计税政策有期限，且每年只能使用一次。具体执行以当年税务规定为准，本文只讲原理。',
          ],
        },
      ],
    },
    en: {
      title: 'Gross 20,000, net how much: social insurance and income tax broken down',
      description: 'The real deduction order behind a payslip, including contribution rates, cumulative withholding, and annual bonus taxation.',
      excerpt: 'Salary negotiations quote gross, but the bank transfer is smaller. The gap is not the employer withholding arbitrarily — it is social insurance, housing fund, and income tax, and it can be computed exactly.',
      body: [
        {
          heading: 'Order of deductions',
          paragraphs: [
            'A payslip reads: gross salary − employee social insurance and housing fund − income tax = take-home pay. Tax is not charged on gross; it is charged on what remains after contributions and the 5,000 threshold. Get the order wrong and the tax will be wrong.',
            'Special additional deductions — children education, continuing education, major medical expenses, mortgage interest, rent, elder care, and infant care — further reduce taxable income. Many people forget to claim them and overpay tax every month.',
          ],
        },
        {
          heading: 'Employee contribution rates',
          compare: [
            { left: 'Pension', right: '8% employee, credited to a personal account and paid out monthly in retirement. The heaviest item for the employee.' },
            { left: 'Medical', right: 'Around 2% employee plus a fixed critical-illness amount, varying by city. The personal account can pay for outpatient visits and medicine.' },
            { left: 'Unemployment', right: 'Around 0.5% employee. A small amount that funds benefits during unemployment.' },
            { left: 'Housing fund', right: '5% to 12% employee, matched at the same rate by the employer. The whole amount goes into your personal account for buying, renting, or servicing a mortgage — it is still your asset.' },
            { left: 'Work injury and maternity', right: 'Paid entirely by the employer. Seeing zero in these two lines on a payslip is normal.' },
          ],
        },
        {
          heading: 'Why the tax changes month to month',
          paragraphs: [
            'Since 2019 withholding is cumulative: each month computes tax on year-to-date income minus year-to-date deductions using the annual bracket table, then subtracts what was already withheld. The difference is this month tax.',
            'The result is low tax early in the year, rising through the year and peaking in December. That is not a payroll error — it is how cumulative withholding works. The annual total is fixed; only the distribution shifts.',
            'Rough numbers for a 20,000 gross salary with a 12% housing fund, a 20,000 contribution base, and no special deductions: contributions about 4,500, annual taxable income about 126,000, landing in the 10% bracket, total tax around 10,000 per year or 840 per month, leaving roughly 14,700 in hand.',
          ],
          tips: ['💡 The housing fund rate is negotiable. On the same gross salary, 5% versus 12% differs by about 1,400 in monthly cash but 2,800 in account balance once the employer match is counted. Choose low for short-term cash, high for a future home purchase.'],
        },
        {
          heading: 'Taxing the annual bonus',
          paragraphs: [
            'A bonus can be taxed separately (divide by 12 to find the rate, then apply it to the full amount) or combined with the year comprehensive income. Both are permitted, and which is cheaper depends on the amount.',
            'For lower salaries where special deductions go unused, combining is often cheaper; for higher salaries, separate taxation usually wins. There are cliff edges where one extra unit of bonus crosses a bracket and costs over a thousand in tax, which payroll teams usually flag.',
            'Separate bonus taxation has an expiry date and can only be used once per year. Follow the current year regulations — this article explains the mechanics only.',
          ],
        },
      ],
    },
  },

  // -------------------- 11. Cron 速查 --------------------
  {
    slug: 'cron-expression-cheatsheet',
    date: '2026-11-11',
    tags: ['Cron', '运维', '速查'],
    toolKeys: ['dev/cron'],
    zh: {
      title: 'Cron 表达式速查表与 5 个高频陷阱',
      description: '常用 Cron 表达式一页备查，附日与周的 OR 语义、周日 0/7、时区等最容易踩的坑。',
      excerpt: 'Cron 只有五个字段，但写错一个字符就能让任务在错误的时间跑。这份速查表覆盖常用写法，并解释那几个没人告诉你的语义细节。',
      body: [
        {
          heading: '五个字段的含义',
          paragraphs: [
            '顺序固定为：分钟 小时 日 月 周。取值范围分别是 0-59、0-23、1-31、1-12、0-7。注意月和日都从 1 开始，但分钟和小时从 0 开始，周日既可以写 0 也可以写 7。',
            '六个字段的版本（Quartz 等）在最前面多了秒，取值 0-59。导入别人写的表达式前先数一下字段个数，五字段和六字段不能混用。',
          ],
        },
        {
          heading: '常用表达式备查',
          compare: [
            { left: '* * * * *', right: '每分钟执行一次。只在调试时用，生产环境这样写很快就会出问题。' },
            { left: '*/5 * * * *', right: '每 5 分钟一次（0、5、10…55 分）。' },
            { left: '0 * * * *', right: '每小时整点执行。' },
            { left: '0 0 * * *', right: '每天 00:00 执行，最常见的日终任务。' },
            { left: '30 2 * * *', right: '每天凌晨 02:30，避开日终高峰的常用选择。' },
            { left: '0 9 * * 1-5', right: '工作日每天 09:00。注意周日是 0，周一到周五是 1-5。' },
            { left: '0 0 1 * *', right: '每月 1 号 00:00，月度报表的典型写法。' },
            { left: '0 0 1 1 *', right: '每年 1 月 1 日 00:00，年度任务。' },
          ],
        },
        {
          heading: '五个高频陷阱',
          paragraphs: [
            '一，日与周同时限制时的 OR 语义。写成 0 0 13 * 5 时，很多实现是「每月 13 号 或 每周五」都执行，而不是两者同时满足。想要「既是 13 号又是周五」通常无法用单个表达式表达。',
            '二，周日到底是 0 还是 7。两种写法在不同实现里都可能被接受，但有的只认 0、有的只认 7。跨平台迁移时最稳妥的写法是明确使用 0 或 SUN 这样的名称。',
            '三，时区。Cron 按服务器时区执行，容器默认常常是 UTC。你以为的「每天早上 8 点」可能实际是北京时间 16 点。部署时要么改容器时区，要么在应用层显式指定。',
            '四，*/n 的起点。*/5 表示从该字段的最小值开始每 5 个单位，在分钟字段等价于 0/5，但在小时字段（最小值为 0）和日期字段（最小值为 1）上的行为容易算错。',
            '五，任务执行时间超过间隔。每分钟跑一次、单次却要两分钟，任务会重叠堆积。需要在应用层加锁或改用调度框架的「禁止并发」选项。',
          ],
          tips: ['💡 写完一定要核对下次执行时间。把表达式贴进工具里，看它推演出的未来几次触发时刻，比在脑子里推算可靠得多——尤其是涉及月末、闰年和跨时区的时候。'],
        },
        {
          heading: '特殊符号清单',
          compare: [
            { left: '*', right: '任意值，表示该字段所有可能取值。' },
            { left: ',', right: '枚举多个值，例如 1,15,30 表示这三者都触发。' },
            { left: '-', right: '区间，例如 9-17 表示 9 到 17 之间都触发。' },
            { left: '/', right: '步长，例如 */10 表示每 10 个单位，5-30/10 表示 5、15、25。' },
            { left: 'L / W / #', right: 'Quartz 扩展：L 表示最后一天，W 表示最近的工作日，# 表示第几个星期几。标准 crontab 不支持。' },
          ],
        },
      ],
    },
    en: {
      title: 'Cron expression cheat sheet and 5 traps',
      description: 'The expressions you actually use, plus the day-of-week OR semantics, Sunday 0 versus 7, and timezone pitfalls nobody mentions.',
      excerpt: 'Cron has five fields, and one wrong character can run a job at the wrong hour. This cheat sheet covers the common patterns and the semantics that trip everyone up.',
      body: [
        {
          heading: 'The five fields',
          paragraphs: [
            'The order is fixed: minute, hour, day-of-month, month, day-of-week. Ranges are 0-59, 0-23, 1-31, 1-12, and 0-7. Month and day start at 1 while minute and hour start at 0, and Sunday can be written as 0 or 7.',
            'Six-field variants such as Quartz prepend a seconds field from 0-59. Count the fields before reusing someone else expression — five and six field forms are not interchangeable.',
          ],
        },
        {
          heading: 'Expressions worth memorizing',
          compare: [
            { left: '* * * * *', right: 'Every minute. Use only while debugging; in production this goes wrong fast.' },
            { left: '*/5 * * * *', right: 'Every 5 minutes (0, 5, 10 … 55).' },
            { left: '0 * * * *', right: 'Top of every hour.' },
            { left: '0 0 * * *', right: 'Daily at 00:00, the classic end-of-day job.' },
            { left: '30 2 * * *', right: 'Daily at 02:30, a common way to dodge the midnight peak.' },
            { left: '0 9 * * 1-5', right: 'Weekdays at 09:00. Sunday is 0, so Monday to Friday is 1-5.' },
            { left: '0 0 1 * *', right: 'First of the month at 00:00 — the usual monthly report slot.' },
            { left: '0 0 1 1 *', right: 'January 1 at 00:00, annual jobs.' },
          ],
        },
        {
          heading: 'Five traps',
          paragraphs: [
            'One: day-of-month and day-of-week are ORed. With 0 0 13 * 5 most implementations run on the 13th OR on Friday, not both. "The 13th when it is a Friday" cannot be expressed in a single expression.',
            'Two: is Sunday 0 or 7? Both are often accepted, but some implementations take only one. Safest is to use 0 or the name SUN explicitly when porting between systems.',
            'Three: timezone. Cron runs in the server timezone, and containers default to UTC surprisingly often. Your 8 a.m. job may actually fire at 4 p.m. Beijing time. Set the container timezone or specify it in the application.',
            'Four: the starting point of */n. It steps from the minimum of that field, so */5 equals 0/5 in the minute field, but the hour and day fields (minimum 0 and 1) behave differently and are easy to miscalculate.',
            'Five: jobs that run longer than the interval. Every minute with a two-minute job stacks up overlapping runs. Add a lock or use the scheduler no-concurrency option.',
          ],
          tips: ['💡 Always verify the next run times. Paste the expression into a tool and read the projected trigger list — far more reliable than mental arithmetic, especially around month ends, leap years, and timezones.'],
        },
        {
          heading: 'Special characters',
          compare: [
            { left: '*', right: 'Any value — every possible value in that field.' },
            { left: ',', right: 'A list, so 1,15,30 fires on those three values.' },
            { left: '-', right: 'A range: 9-17 covers every hour from 9 through 17.' },
            { left: '/', right: 'A step: */10 is every 10 units, and 5-30/10 means 5, 15, 25.' },
            { left: 'L / W / #', right: 'Quartz extensions: L for last day, W for nearest weekday, # for the nth weekday. Standard crontab does not support them.' },
          ],
        },
      ],
    },
  },

  // -------------------- 12. WebSocket 连不上排查 --------------------
  {
    slug: 'websocket-connection-troubleshooting',
    date: '2026-11-11',
    tags: ['WebSocket', '网络', '排错'],
    toolKeys: ['dev/websocket'],
    zh: {
      title: 'WebSocket 连不上？握手、代理与心跳逐项排查',
      description: '从 101 握手到反向代理配置，按顺序定位 WebSocket 连接失败和连上就断的六类原因。',
      excerpt: 'WebSocket 的麻烦在于它是长连接，失败时往往只有一行错误。但只要知道握手过程中每一步可能出什么错，排查就会变成照着清单勾选。',
      body: [
        {
          heading: '先确认失败发生在哪一步',
          paragraphs: [
            '建立连接的本质是一次 HTTP 升级请求：客户端发送带 Upgrade: websocket 的 GET，服务端如果同意，返回 101 Switching Protocols，之后连接切换为双向帧通道。',
            '所以失败只可能发生在三个位置：请求根本没到服务端（DNS、防火墙、端口）、到了但被中间层拒绝（代理、网关、负载均衡）、到了应用但应用拒绝（路径、鉴权、Origin）。先打开浏览器开发者工具的 Network 面板，看这条连接请求的状态码，能立刻排除掉三分之一的可能性。',
          ],
        },
        {
          heading: '六类常见原因',
          compare: [
            { left: '路径写错（404）', right: 'WebSocket 的路径必须精确匹配服务端注册的地址。常见错误是多写或漏写末尾斜杠、把 /ws 写成 /websocket。状态码会是 404，而不是握手失败。' },
            { left: '代理未开启 Upgrade（400 或断开）', right: 'Nginx、CDN、云负载均衡默认按普通 HTTP 处理，必须显式透传 Upgrade 和 Connection 头。没配时表现为握手直接失败或返回 400。' },
            { left: '证书无效（wss 失败）', right: 'wss 要求有效证书，自签名或过期证书会被浏览器直接拒绝。本地开发可以用受信任的本地证书工具，而不是关闭校验。' },
            { left: '混合内容被拦截', right: 'https 页面不允许连接 ws://，浏览器控制台会明确提示 mixed content。生产环境一律使用 wss。' },
            { left: 'Origin 校验不通过', right: '很多服务端会校验握手请求的 Origin，允许列表里没有你的域名就返回 403。跨环境调试时这个问题尤其常见。' },
            { left: '鉴权信息没带上', right: '浏览器原生的 WebSocket API 不能自定义请求头，Token 只能放在 URL 查询参数或首个消息里。把 Token 放 header 里的方案在这种场景下必然失败。' },
          ],
        },
        {
          heading: 'Nginx 的最小可用配置',
          paragraphs: [
            '反向代理场景下，最关键的是 Upgrade 和 Connection 两个头。少了它们，Nginx 会把连接当作普通 HTTP 请求处理，握手永远无法完成。',
            '另外要把读超时调大，否则空闲连接会被代理按默认 60 秒切断，表现为「连上后一分钟就断」。很多人误以为是业务代码的问题，其实是代理的 idle timeout。',
          ],
          code: [
            {
              lang: 'nginx',
              code: `location /ws/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host       $host;
    proxy_set_header X-Real-IP  $remote_addr;
    proxy_read_timeout  3600s;
    proxy_send_timeout  3600s;
}`,
            },
          ],
        },
        {
          heading: '连上之后立刻断开或收不到消息',
          paragraphs: [
            '心跳缺失：多数网关和运营商会在 60 到 300 秒没有数据时断开空闲连接。协议层有 ping/pong 帧，应用层也常约定定时发心跳消息。两者至少要有一个。',
            '消息格式不匹配：服务端期待二进制帧而客户端发了文本帧，或者双方对 JSON 字段名理解不一致，表现为「连上了但没有任何反应」。先用测试工具发一条最简单的内容，确认链路通再排查业务逻辑。',
            '并发上限：服务端或网关对单 IP 的连接数有上限，重复建连不关闭会耗尽配额。调试时记得主动断开旧连接。',
          ],
          tips: ['💡 用独立客户端先测通链路，再回到自己的页面里排查。如果客户端能连上而页面不能，问题基本就在 Origin、混合内容或鉴权参数上，范围立刻缩小。'],
        },
      ],
    },
    en: {
      title: 'WebSocket will not connect: handshake, proxy, and heartbeat checks',
      description: 'A step-by-step checklist for the six reasons WebSocket connections fail or drop right after connecting.',
      excerpt: 'The trouble with WebSocket is that it is a long-lived connection and failures surface as a single error line. Once you know what can go wrong at each handshake step, debugging becomes a checklist.',
      body: [
        {
          heading: 'Locate the failing step',
          paragraphs: [
            'Connecting is really an HTTP upgrade: the client sends a GET with Upgrade: websocket, and if the server agrees it replies 101 Switching Protocols, after which the connection becomes a bidirectional frame channel.',
            'So failure can only happen in three places: the request never arrives (DNS, firewall, port), it arrives but a middle layer rejects it (proxy, gateway, load balancer), or it reaches the app and the app rejects it (path, auth, Origin). Open the Network panel and read the status code — that immediately rules out a third of the possibilities.',
          ],
        },
        {
          heading: 'Six common causes',
          compare: [
            { left: 'Wrong path (404)', right: 'The path must exactly match what the server registered. Extra or missing trailing slashes, or /ws versus /websocket, produce a 404 rather than a handshake error.' },
            { left: 'Proxy without Upgrade (400 or drop)', right: 'Nginx, CDNs, and cloud load balancers treat the request as plain HTTP by default. Upgrade and Connection must be forwarded explicitly, or the handshake fails outright.' },
            { left: 'Invalid certificate (wss fails)', right: 'wss requires a valid certificate; self-signed or expired ones are rejected outright. Use a locally trusted certificate tool instead of disabling verification.' },
            { left: 'Mixed content blocked', right: 'An https page cannot open ws://, and the console says so. Production should always use wss.' },
            { left: 'Origin rejected', right: 'Many servers validate the Origin header and return 403 when your domain is not allowlisted. This bites hardest when debugging across environments.' },
            { left: 'Auth not transmitted', right: 'The native WebSocket API cannot set custom headers, so tokens must travel in the query string or the first message. Any scheme putting the token in a header is guaranteed to fail here.' },
          ],
        },
        {
          heading: 'A minimal Nginx config',
          paragraphs: [
            'Behind a reverse proxy, the two headers that matter are Upgrade and Connection. Without them Nginx handles the request as ordinary HTTP and the handshake never completes.',
            'Also raise the read timeout, or idle connections get cut at the default 60 seconds and look like "connects, then dies after a minute". People often blame application code when it is really the proxy idle timeout.',
          ],
          code: [
            {
              lang: 'nginx',
              code: `location /ws/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host       $host;
    proxy_set_header X-Real-IP  $remote_addr;
    proxy_read_timeout  3600s;
    proxy_send_timeout  3600s;
}`,
            },
          ],
        },
        {
          heading: 'Connects then drops, or silent',
          paragraphs: [
            'Missing heartbeats: most gateways and carriers drop idle connections after 60 to 300 seconds. Protocol-level ping/pong frames exist, and applications often add their own heartbeat message. Use at least one.',
            'Message format mismatch: the server expects binary frames while the client sends text, or the two disagree on JSON field names — showing up as "connected but nothing happens". Send the simplest possible message first to confirm the pipe works.',
            'Connection cap: servers and gateways limit connections per IP, and repeatedly opening without closing exhausts the quota. Disconnect old sockets while debugging.',
          ],
          tips: ['💡 Prove the link with a standalone client before debugging your page. If the client connects and the page does not, the problem is almost certainly Origin, mixed content, or auth parameters — a much smaller search space.'],
        },
      ],
    },
  },

  // -------------------- 13. BMI 准不准 --------------------
  {
    slug: 'bmi-limitations',
    date: '2026-11-11',
    tags: ['健康', 'BMI', '常识'],
    toolKeys: ['life/bmi'],
    zh: {
      title: 'BMI 准不准？它测不出肌肉和脂肪的区别',
      description: 'BMI 的适用边界、中国与 WHO 标准的差异，以及腰围、体脂率这些更靠谱的替代指标。',
      excerpt: 'BMI 是一个 19 世纪的公式，用两个数字概括复杂的人体。它在人群统计上很有价值，但用来判断某一个人的健康，结论经常是错的。',
      body: [
        {
          heading: 'BMI 到底是什么',
          paragraphs: [
            'BMI = 体重（公斤）÷ 身高（米）的平方。它诞生于 19 世纪，最初是为了描述人群的体重分布，而不是诊断个人健康。',
            '它的优点是极简：只需要身高体重两个数，就能做大规模统计和快速筛查。缺点是同样极简——它假设脂肪分布均匀、不区分肌肉与脂肪、不考虑年龄和性别。',
          ],
        },
        {
          heading: '三类典型的误判',
          paragraphs: [
            '健身人群：肌肉密度高于脂肪，规律力量训练的人 BMI 常常落在「超重」甚至「肥胖」区间，但体脂率完全正常。按 BMI 判定他们需要减重，是明显错误的结论。',
            '隐形肥胖：体重正常甚至偏瘦，但肌肉量低、内脏脂肪高。这类人群的代谢风险并不低，BMI 却给出「正常」的绿灯，比前者更危险，因为不会引起警觉。',
            '老年人：随年龄增长肌肉自然流失、身高略微缩短，同样的体重会算出更高的 BMI，但真正需要关注的是肌少症而不是减重。',
          ],
        },
        {
          heading: '中国标准与国际标准的差异',
          compare: [
            { left: '中国成人标准', right: '低于 18.5 偏瘦，18.5 至 23.9 正常，24 至 27.9 超重，28 及以上肥胖。上限明显更严格。' },
            { left: 'WHO 国际标准', right: '低于 18.5 偏瘦，18.5 至 24.9 正常，25 至 29.9 超重，30 及以上肥胖。' },
            { left: '为什么不同', right: '亚洲人群在相同 BMI 下往往有更高的内脏脂肪比例和代谢疾病风险，因此中国、日本等地区把超重线提前到 24 附近，用更低的阈值换取更早的干预。' },
          ],
        },
        {
          heading: '比 BMI 更有参照价值的指标',
          paragraphs: [
            '腰围：反映腹部脂肪，与代谢风险的相关性远高于 BMI。中国男性 90 厘米、女性 85 厘米以上属于腹型肥胖，这是体检报告里更该盯的数字。',
            '腰高比：腰围除以身高，超过 0.5 就提示风险，计算简单且不需要记住性别阈值，是个被低估的指标。',
            '体脂率：直接测量脂肪占比，体脂秤的精度有限，但趋势仍有参考价值。配合力量训练看体脂率变化，比盯着体重更有意义。',
            '腰围与体脂率都不方便自查时，BMI 仍是一个快速初筛工具——只要你知道它只是初筛。',
          ],
          tips: ['⚠️ 本文是常识性说明，不构成医疗建议。体重、腰围、血压、血糖、血脂应当一起看，任何一项异常都值得找医生而不是依赖在线计算器。'],
        },
      ],
    },
    en: {
      title: 'Is BMI accurate? It cannot tell muscle from fat',
      description: 'Where BMI applies, how Chinese and WHO thresholds differ, and the alternatives — waist circumference, waist-to-height, body fat — that say more.',
      excerpt: 'BMI is a 19th-century formula that compresses a complicated body into two numbers. It is valuable for populations and frequently wrong for individuals.',
      body: [
        {
          heading: 'What BMI actually is',
          paragraphs: [
            'BMI = weight in kilograms divided by height in metres squared. It dates from the 19th century and was designed to describe population weight distribution, not to diagnose an individual.',
            'Its strength is simplicity: height and weight alone support large-scale statistics and quick screening. Its weakness is the same simplicity — it assumes even fat distribution, ignores muscle-versus-fat composition, and disregards age and sex.',
          ],
        },
        {
          heading: 'Three classic misjudgements',
          paragraphs: [
            'Strength trainees: muscle is denser than fat, so people who lift regularly often land in the overweight or obese BMI range with perfectly normal body fat. Telling them to lose weight is plainly wrong.',
            'Skinny fat: normal or low weight, but little muscle and high visceral fat. Metabolic risk is elevated while BMI shows a reassuring normal — more dangerous than the previous case, because nothing raises a flag.',
            'Older adults: muscle mass declines and height shrinks slightly with age, so the same weight yields a higher BMI. What actually matters is sarcopenia, not weight loss.',
          ],
        },
        {
          heading: 'Chinese versus WHO thresholds',
          compare: [
            { left: 'Chinese adult standard', right: 'Below 18.5 underweight, 18.5 to 23.9 normal, 24 to 27.9 overweight, 28 and above obese. Notably stricter at the top.' },
            { left: 'WHO international', right: 'Below 18.5 underweight, 18.5 to 24.9 normal, 25 to 29.9 overweight, 30 and above obese.' },
            { left: 'Why they differ', right: 'Asian populations tend to carry a higher proportion of visceral fat and metabolic risk at the same BMI, so China, Japan, and others move the overweight line down to around 24 to trigger earlier intervention.' },
          ],
        },
        {
          heading: 'Measures that say more',
          paragraphs: [
            'Waist circumference reflects abdominal fat and correlates with metabolic risk far better than BMI. Above 90 cm for Chinese men and 85 cm for women indicates central obesity — the number worth watching on a health report.',
            'Waist-to-height ratio: waist divided by height, with anything above 0.5 signalling risk. Simple to compute and free of sex-specific cut-offs, it is an underrated metric.',
            'Body fat percentage measures fat directly. Smart scales are imprecise but their trend is useful; tracking it alongside strength training means more than staring at weight.',
            'When neither waist nor body fat is easy to measure, BMI still works as a quick first filter — as long as you remember it is only that.',
          ],
          tips: ['⚠️ This is general information, not medical advice. Weight, waist, blood pressure, blood glucose, and lipids should be read together; any abnormal value deserves a doctor rather than an online calculator.'],
        },
      ],
    },
  },

  // -------------------- 14. 图片格式怎么选 --------------------
  {
    slug: 'image-format-webp-avif',
    date: '2026-11-11',
    tags: ['图片', '性能', '前端'],
    toolKeys: ['image/image-convert', 'image/image-compress'],
    zh: {
      title: 'PNG、JPG、WebP、AVIF：网页图片格式怎么选',
      description: '四种格式的能力边界、体积差异和浏览器兼容策略，附一张按场景对号入座的选择表。',
      excerpt: '选错图片格式，一张首屏大图就能让加载时间翻倍。格式本身没有好坏，只有适不适合当前场景。',
      body: [
        {
          heading: '四种格式的能力差异',
          compare: [
            { left: 'JPG / JPEG', right: '有损压缩，不支持透明。照片表现好，压缩率高，二十年来始终是兼容性最好的选择。文字和锐利边缘会出现方块噪点。' },
            { left: 'PNG', right: '无损压缩，支持透明通道。适合截图、图标、带文字的图像。照片用 PNG 体积会大得离谱。' },
            { left: 'WebP', right: '同时支持有损、无损、透明和动画，现代浏览器全面支持。同等画质下通常比 JPEG 小 25% 到 35%。' },
            { left: 'AVIF', right: '基于 AV1 的新格式，压缩率比 WebP 再高 20% 到 30%，支持 HDR 和透明。但编码慢，且部分老设备仍不支持。' },
            { left: 'SVG', right: '矢量格式，与分辨率无关。图标、Logo、简单插图的首选，体积通常只有 PNG 的几分之一。' },
          ],
        },
        {
          heading: '按场景对号入座',
          paragraphs: [
            '图标与 Logo：用 SVG，任何尺寸都清晰，可以用 CSS 改颜色。只有多色复杂插图才退回 PNG 或 WebP。',
            '产品图与摄影：用 WebP，同时提供 JPG 回退。如果站点用户主要在移动端且能接受稍长的构建时间，可以再加 AVIF。',
            '截图与带文字的图：用无损 WebP 或 PNG。有损压缩会让小字边缘发糊，这是最常见的图片质量问题。',
            '需要透明背景：PNG 或 WebP。转成 JPG 会把透明区域变成白色或黑色，这一步不可逆。',
            '动图：优先用视频（MP4/WebM）代替 GIF，体积能小一个数量级；实在需要图片格式就用 WebP 或 AVIF 动画。',
          ],
        },
        {
          heading: '兼容性与回退写法',
          paragraphs: [
            '现代浏览器对 WebP 的支持已经很完整，AVIF 在近几年的浏览器中也都可用。但如果流量里有相当比例的老设备，就需要回退链。',
            '用 picture 元素让浏览器自己挑：按 AVIF、WebP、JPG 的顺序列出 source，浏览器会选择第一个支持的格式。用 img 标签写死一个地址就没有这个能力。',
          ],
          code: [
            {
              lang: 'html',
              code: `<picture>
  <source srcset="/hero.avif" type="image/avif" />
  <source srcset="/hero.webp" type="image/webp" />
  <img src="/hero.jpg" alt="产品主图" width="1200" height="630" loading="lazy" />
</picture>`,
            },
          ],
        },
        {
          heading: '压缩参数怎么定',
          paragraphs: [
            'WebP 有损质量 75 到 85 通常是与原图肉眼难辨的范围，继续降低会开始在大面积渐变上出现色带。JPG 建议 80 到 90，低于 75 文字边缘就会明显发糊。',
            '导出尺寸按显示宽度的 2 倍即可适配高分屏，导出 4000 像素宽的图再让浏览器缩到 800 显示，只是白白浪费带宽。',
            '压缩后用眼睛看一遍原图与压缩图的对比，比盯着文件大小数字更有意义。人眼对大面积的平滑渐变和细密纹理最敏感。',
          ],
          tips: ['💡 优化顺序：先改尺寸，再选格式，最后调质量。尺寸通常是体积的最大来源，把 4000 像素的图缩到 1600 往往比任何压缩参数都有效。'],
        },
      ],
    },
    en: {
      title: 'PNG, JPG, WebP, AVIF: choosing image formats for the web',
      description: 'Capabilities, size differences, and fallback strategy for the four formats, with a scene-by-scene selection table.',
      excerpt: 'Picking the wrong format can double load time on a single hero image. No format is inherently better — only better for a specific job.',
      body: [
        {
          heading: 'What each format can do',
          compare: [
            { left: 'JPG / JPEG', right: 'Lossy, no transparency. Excellent for photographs with high compression, and the most compatible choice for two decades. Text and sharp edges develop blocky artifacts.' },
            { left: 'PNG', right: 'Lossless with an alpha channel. Ideal for screenshots, icons, and text-heavy images. Using PNG for photographs produces absurd file sizes.' },
            { left: 'WebP', right: 'Lossy, lossless, transparency, and animation in one format, supported by every modern browser. Typically 25–35% smaller than JPEG at comparable quality.' },
            { left: 'AVIF', right: 'Built on AV1, another 20–30% smaller than WebP, with HDR and transparency. Encoding is slow and some older devices still cannot decode it.' },
            { left: 'SVG', right: 'Vector, resolution-independent. The first choice for icons, logos, and simple illustrations — often a fraction of the PNG size.' },
          ],
        },
        {
          heading: 'Match the format to the job',
          paragraphs: [
            'Icons and logos: SVG, crisp at any size and recolourable with CSS. Only fall back to PNG or WebP for complex multi-colour illustrations.',
            'Product and photography: WebP with a JPG fallback. Add AVIF when traffic is mostly mobile and build time allows.',
            'Screenshots and text: lossless WebP or PNG. Lossy compression blurs small text and is the most common image-quality complaint.',
            'Transparency required: PNG or WebP. Converting to JPG fills transparent areas with white or black, irreversibly.',
            'Animated content: prefer video (MP4 or WebM) over GIF — an order of magnitude smaller. If an image format is required, use animated WebP or AVIF.',
          ],
        },
        {
          heading: 'Compatibility and fallbacks',
          paragraphs: [
            'Modern browser support for WebP is effectively complete, and AVIF works in recent versions of everything. If a meaningful share of traffic is on old devices, you still need a fallback chain.',
            'Let the browser choose with picture: list source elements in AVIF, WebP, JPG order and it picks the first format it supports. A bare img with a single src cannot do this.',
          ],
          code: [
            {
              lang: 'html',
              code: `<picture>
  <source srcset="/hero.avif" type="image/avif" />
  <source srcset="/hero.webp" type="image/webp" />
  <img src="/hero.jpg" alt="Product hero" width="1200" height="630" loading="lazy" />
</picture>`,
            },
          ],
        },
        {
          heading: 'Choosing quality settings',
          paragraphs: [
            'Lossy WebP between 75 and 85 is usually visually indistinguishable; below that, banding starts showing in large gradients. JPG sits at 80 to 90 — under 75 text edges visibly smear.',
            'Export at twice the display width for high-DPI screens. Shipping a 4000-pixel image that the browser scales to 800 just wastes bandwidth.',
            'Compare the original and compressed version by eye rather than fixating on file size. Human vision is most sensitive to smooth gradients and fine texture.',
          ],
          tips: ['💡 Order of operations: resize, then pick the format, then tune quality. Dimensions dominate file size — shrinking 4000 pixels to 1600 beats any compression setting.'],
        },
      ],
    },
  },

  // -------------------- 15. MB vs MiB --------------------
  {
    slug: 'mb-vs-mib',
    date: '2026-11-11',
    tags: ['单位', '存储', '常识'],
    toolKeys: ['life/unit-convert'],
    zh: {
      title: 'MB 与 MiB：为什么 500GB 硬盘只有 465GB',
      description: '十进制与二进制前缀的区别，硬盘容量、内存、宽带速率的正确读法，附常用换算对照。',
      excerpt: '买来 500GB 的硬盘只显示 465GB，装的 500M 宽带下载最快只有 62MB/s。这两件事其实是同一个原因。',
      body: [
        {
          heading: '两个前缀系统的历史',
          paragraphs: [
            'KB、MB、GB 在国际单位制里是 1000 的幂：1 KB = 1000 字节，1 MB = 1000000 字节。而计算机天然按 1024 的幂工作，早期从业者把这套叫法直接套在了 1024 上，于是同一个缩写有了两种含义。',
            '为了消除歧义，IEC 在 1998 年提出了 KiB、MiB、GiB 表示二进制前缀：1 KiB = 1024 字节，1 MiB = 1048576 字节。但硬盘厂商、操作系统、网络运营商并没有统一采用，混乱延续至今。',
          ],
        },
        {
          heading: '硬盘容量去哪了',
          paragraphs: [
            '厂商按十进制标注容量：500 GB 就是 500,000,000,000 字节。操作系统按二进制显示：除以 1024 三次，得到 465.66 GiB。',
            '两个数字描述的是同一块硬盘，只是单位不同。差额比例约为 2.4%（1 TB）、7%（1 PB 级别会更明显）。所以「容量缩水」不是厂商偷工减料，而是单位口径不一致。',
            '另外，文件系统本身会占用一部分空间用于索引和元数据，格式化后的可用容量还会再少几个百分点。',
          ],
          compare: [
            { left: '厂商标注', right: '500 GB（十进制），即 500,000,000,000 字节。' },
            { left: '系统显示', right: '约 465.7 GiB（二进制），实际长期被简写成 GB。' },
            { left: '1 TiB 对应', right: '1,099,511,627,776 字节，换算后约等于厂商标注的 1.1 TB。' },
          ],
        },
        {
          heading: '宽带速率的八倍差',
          paragraphs: [
            '运营商说的「500M 宽带」，单位是 Mbps（兆比特每秒），不是 MB/s（兆字节每秒）。1 字节 = 8 比特，所以理论峰值是 500 ÷ 8 = 62.5 MB/s。',
            '实际下载速度还要扣除协议开销，通常能跑到理论值的 80% 到 90%，也就是 50 到 56 MB/s。如果测速软件显示 55 MB/s，这条宽带就是正常的。',
            '反过来看，浏览器下载面板显示的 MB/s 需要乘 8 才是 Mbps。这也是为什么很多人误以为「宽带缩水了一半」。',
          ],
          tips: ['💡 记住两个数字就够了：1024 用于字节容量换算，8 用于比特与字节换算。这两个常数能解释绝大多数「容量不对、网速不够」的疑惑。'],
        },
        {
          heading: '什么时候该在意这个差别',
          paragraphs: [
            '看云服务账单时：对象存储、CDN 流量通常按 GB（十进制）计费，而监控面板可能显示 GiB，估算成本时要统一口径。',
            '做容量规划时：数据库、日志、备份的空间预算最好统一用 GiB，避免和厂商文档的 GB 混算。',
            '日常使用不必纠结：无论是 465 还是 500，你能存的东西都一样。真正影响体验的是读写速度、缓存策略和备份习惯。',
          ],
        },
      ],
    },
    en: {
      title: 'MB vs MiB: why a 500GB drive shows 465GB',
      description: 'Decimal versus binary prefixes, how to read drive capacity, memory, and broadband speeds, with a conversion table.',
      excerpt: 'A 500GB drive reports 465GB free, and a 500M connection downloads at a maximum of 62MB/s. Those two facts share one cause.',
      body: [
        {
          heading: 'Two prefix systems',
          paragraphs: [
            'In the SI system, KB, MB, and GB are powers of 1000: 1 KB is 1000 bytes and 1 MB is 1,000,000 bytes. Computers naturally work in powers of 1024, and early practitioners reused the same abbreviations for those values, so each one acquired two meanings.',
            'To remove the ambiguity, the IEC introduced KiB, MiB, and GiB in 1998 for binary prefixes: 1 KiB is 1024 bytes and 1 MiB is 1,048,576 bytes. Drive vendors, operating systems, and carriers never adopted it consistently, so the confusion persists.',
          ],
        },
        {
          heading: 'Where the capacity went',
          paragraphs: [
            'Vendors label in decimal: 500 GB means 500,000,000,000 bytes. The operating system reports in binary: divide by 1024 three times and you get 465.66 GiB.',
            'Both numbers describe the same drive in different units. The gap is roughly 2.4% at 1 TB and grows at larger scales. Nothing is missing — only the unit convention differs.',
            'On top of that, the filesystem reserves space for indexes and metadata, so formatted usable capacity is a few percent lower still.',
          ],
          compare: [
            { left: 'Vendor label', right: '500 GB decimal, which is 500,000,000,000 bytes.' },
            { left: 'System display', right: 'About 465.7 GiB binary, usually still abbreviated as GB.' },
            { left: '1 TiB equals', right: '1,099,511,627,776 bytes, which vendors would label as about 1.1 TB.' },
          ],
        },
        {
          heading: 'The eightfold broadband gap',
          paragraphs: [
            'A "500M" broadband plan is in Mbps (megabits per second), not MB/s (megabytes per second). One byte is eight bits, so the theoretical peak is 500 ÷ 8 = 62.5 MB/s.',
            'Real downloads lose some to protocol overhead and typically reach 80–90% of that, so 50–56 MB/s is healthy. A speed test showing 55 MB/s means the line is fine.',
            'Conversely, multiply the MB/s in a browser download panel by 8 to get Mbps. That is why so many people believe their connection was halved.',
          ],
          tips: ['💡 Two constants explain almost every "wrong capacity, slow network" question: 1024 for byte capacity conversion, and 8 for bits versus bytes.'],
        },
        {
          heading: 'When the distinction matters',
          paragraphs: [
            'Cloud bills: object storage and CDN traffic are usually billed in decimal GB while monitoring dashboards may show GiB, so normalise before estimating cost.',
            'Capacity planning: keep database, log, and backup budgets in GiB to avoid mixing with vendor documents that use GB.',
            'Everyday use: 465 or 500, you can store the same things. Read and write speed, caching policy, and backup habits affect your experience far more.',
          ],
        },
      ],
    },
  },

  // -------------------- 16. 在线工具清单（枢纽页） --------------------
  {
    slug: 'online-tools-list-2026',
    date: '2026-11-11',
    tags: ['清单', '导航', '工具'],
    toolKeys: [
      'dev/json-formatter',
      'dev/cron',
      'crypto/base64',
      'crypto/jwt',
      'text/diff',
      'number/chinese-num',
      'frontend/flex-box',
      'image/image-compress',
      'document/pdf-merge',
      'document/markdown-editor',
      'life/unit-convert',
      'life/mortgage',
    ],
    zh: {
      title: '2026 开发者常用在线工具清单：按场景整理',
      description: '把 52 个纯前端工具按开发、编码、文本、设计、图片、文档、生活七类整理，说明每类解决什么问题和该怎么选。',
      excerpt: '工具站的价值不在于工具多，而在于你要用的那一个能立刻找到。这份清单按你实际的工作场景组织，而不是按字母顺序堆发放。',
      body: [
        {
          heading: '这份清单怎么组织',
          paragraphs: [
            '收录的工具全部在浏览器本地运行：不需要注册、不上传文件、断网也能用。对经常处理配置文件、密钥、合同扫描件的人来说，「数据不出本机」往往比多一个功能更重要。',
            '下面按七类场景排列。每一类先说明什么时候会用到，再列出该类的核心工具，方便你按场景而不是按名称查找。',
          ],
        },
        {
          heading: '开发与调试',
          paragraphs: [
            '日常最高频的一类：格式化 JSON、验证正则、解析时间戳、算 Cron 下次执行时间、调试 HTTP 和 WebSocket 连接。这些操作单次只花几十秒，但要装软件或写命令就变得不划算。',
            '选型建议：临时看一个响应结构用 JSON 格式化；要验证跨域配置用 HTTP 请求工具；要确认定时任务什么时候跑用 Cron 解析。',
          ],
          compare: [
            { left: 'JSON 格式化 / 校验', right: '带语法报错定位，支持折叠查看大结构。' },
            { left: 'YAML ↔ JSON ↔ Properties', right: '配置文件互转，K8s 清单和 Spring Boot 配置迁移时最省事。' },
            { left: 'Cron 解析', right: '把表达式翻译成人话，并推演未来几次执行时间。' },
            { left: 'HTTP / WebSocket 调试', right: '浏览器直连，用于快速确认接口通不通、连接为什么断开。' },
            { left: 'UA 解析 / 设备信息', right: '排查「只有某个浏览器出问题」这类兼容性故障。' },
          ],
        },
        {
          heading: '编码与加密',
          paragraphs: [
            'Base64、URL 编码、哈希、HMAC、JWT、RSA 属于同一族问题：数据需要在不同协议之间安全地搬运，或者需要证明来源。它们的共同点是「看起来简单，实际容易用错」。',
            '尤其注意：Base64 是编码不是加密；JWT 的 payload 谁都能解开；HMAC 的密钥泄露等于签名能力泄露。工具能算对，但用错场景的后果工具救不了。',
          ],
          compare: [
            { left: 'Base64 / URL 编码', right: '二进制转文本、URL 参数转义，两者的适用场景完全不同。' },
            { left: 'MD5 / SHA / HMAC', right: '校验和与消息认证，接口签名验签的日常。' },
            { left: 'JWT 解析与验签', right: '查看声明、换算过期时间、验证签名是否有效。' },
            { left: 'RSA 密钥与加解密', right: '生成密钥对、公钥加密、私钥签名，理解非对称机制。' },
          ],
        },
        {
          heading: '文本处理，以及设计与图片',
          paragraphs: [
            '文本类解决的是「脏数据清理」：从日志里捞出的域名去重、两版配置对比、中文转拼音做排序键。这些都是手工做几十分钟、用工具几秒钟的事情。',
            '设计类面向不想为一个小效果去装设计软件的人：调 Flexbox 对齐、拼渐变、调阴影、生成 Favicon 全尺寸。图片类则是压缩、转格式、加水印、抠 Base64。',
          ],
          compare: [
            { left: '文本去重 / 对比 / 拼音', right: '清理名单、找出两版差异、生成排序与检索用的拼音。' },
            { left: 'Flexbox / 渐变 / 阴影', right: '实时预览加一键复制 CSS，省掉反复刷新页面的循环。' },
            { left: '配色方案 / Favicon', right: '从品牌色推导整套色板，一次产出全部尺寸的图标。' },
            { left: '图片压缩 / 转格式 / 水印', right: '上线前优化体积，或给敏感图片加防伪标识。' },
            { left: '图片转 Base64 / 二维码解析', right: '内联小图，或者识别截图里的二维码内容。' },
          ],
        },
        {
          heading: '文档与生活计算',
          paragraphs: [
            '文档类覆盖 Markdown 编辑与转换、PDF 合并与拆分。这类文件通常包含合同、简历、发票，恰恰是最不适合上传到陌生服务器的内容，本地处理的价值最高。',
            '生活计算类看起来与开发无关，实际使用频率很高：单位换算、日期差、房贷月供、税前税后工资、BMI、年龄。它们的共同要求是算得对，而不是功能多。',
          ],
          compare: [
            { left: 'Markdown 编辑 / 转换', right: '左右分栏实时预览，可导出源码或 HTML。' },
            { left: 'PDF 合并 / 拆分', right: '按页码精确提取，浏览器内完成，文件不上传。' },
            { left: '单位换算 / 日期计算', right: '长度重量体积温度、日期差与推算，含 MB 与 MiB 这类歧义单位。' },
            { left: '房贷 / 工资 / BMI / 年龄', right: '等额本息对比、五险一金与个税拆解、健康指标与年龄口径。' },
          ],
        },
        {
          heading: '怎么判断该用哪个',
          paragraphs: [
            '如果一次操作只花你不到一分钟，就不要再打开命令行或装软件——用在线工具更快。如果需要重复执行、要接入流水线，那就该写成脚本，工具只用来验证结果对不对。',
            '如果数据敏感（密钥、身份证、合同、未脱敏的用户数据），优先选择明确声明本地处理、且能断网使用的工具。判断方法很简单：断开网络再试一次，能用就是本地处理。',
          ],
          tips: ['💡 想深入了解每类工具背后的原理，可以配合阅读本站的专题文章：CORS 排查、JWT 与 HMAC 的区别、图片格式选型、Markdown 语法细节等。'],
        },
      ],
    },
    en: {
      title: 'Online developer tools 2026: a scenario-based directory',
      description: 'Fifty-two browser-only tools organised into seven categories, with notes on when each one helps and how to choose.',
      excerpt: 'The value of a tool site is not how many tools it has, but whether the one you need is findable in seconds. This directory is organised by the work you actually do.',
      body: [
        {
          heading: 'How this list is organised',
          paragraphs: [
            'Every tool listed runs locally in the browser: no account, no uploads, and usable with the network disconnected. For people who handle config files, keys, and scanned contracts, "data never leaves this machine" often matters more than one extra feature.',
            'The categories below follow real scenarios. Each one explains when you need it, then lists the core tools so you can search by task rather than by name.',
          ],
        },
        {
          heading: 'Development and debugging',
          paragraphs: [
            'The most frequent category: format JSON, validate a regex, decode a timestamp, work out when a cron job runs, debug an HTTP or WebSocket connection. Each takes seconds, and installing software or writing a command costs more than the task.',
            'How to choose: JSON formatter for inspecting a response, HTTP client for verifying CORS config, cron parser for confirming when a scheduled job actually fires.',
          ],
          compare: [
            { left: 'JSON formatter and validator', right: 'Error positions plus collapsible navigation for large structures.' },
            { left: 'YAML, JSON, and Properties', right: 'Config conversion — the fastest route when migrating Kubernetes manifests or Spring Boot files.' },
            { left: 'Cron parser', right: 'Translates the expression into plain language and projects the next run times.' },
            { left: 'HTTP and WebSocket debugging', right: 'Direct browser connections for checking whether an endpoint answers or why a socket drops.' },
            { left: 'User-Agent and device info', right: 'For the "only breaks in one browser" class of bug.' },
          ],
        },
        {
          heading: 'Encoding and cryptography',
          paragraphs: [
            'Base64, URL encoding, hashes, HMAC, JWT, and RSA all belong to one family: moving data safely between protocols, or proving where it came from. They share a trap — they look trivial and are easy to misuse.',
            'Notably: Base64 is encoding, not encryption; a JWT payload is readable by anyone; leaking an HMAC key leaks signing capability. The tool computes correctly, but it cannot save you from using it in the wrong place.',
          ],
          compare: [
            { left: 'Base64 and URL encoding', right: 'Binary-to-text versus URL escaping — entirely different problems that get confused constantly.' },
            { left: 'MD5, SHA, HMAC', right: 'Checksums and message authentication; the daily work of API signing.' },
            { left: 'JWT decode and verify', right: 'Inspect claims, convert expiry times, validate the signature.' },
            { left: 'RSA keys and crypto', right: 'Generate key pairs, encrypt with the public key, sign with the private one.' },
          ],
        },
        {
          heading: 'Text, design, and images',
          paragraphs: [
            'Text tools clean up dirty data: dedupe domains scraped from logs, diff two config versions, convert Chinese to pinyin for sort keys. Minutes by hand, seconds with a tool.',
            'Design tools are for people who do not want to install a design app for one small effect: flexbox alignment, gradient assembly, shadow tuning, full-size favicons. Image tools compress, convert, watermark, and inline as Base64.',
          ],
          compare: [
            { left: 'Dedupe, diff, pinyin', right: 'Clean lists, find differences, generate sort and search keys.' },
            { left: 'Flexbox, gradient, shadow', right: 'Live preview with copyable CSS, replacing the edit-refresh loop.' },
            { left: 'Colour schemes and favicons', right: 'Derive a full palette from a brand colour, or emit every icon size at once.' },
            { left: 'Compress, convert, watermark', right: 'Trim bytes before launch, or mark sensitive images.' },
            { left: 'Image to Base64, QR decode', right: 'Inline small images or read a QR code out of a screenshot.' },
          ],
        },
        {
          heading: 'Documents and everyday maths',
          paragraphs: [
            'Document tools cover Markdown editing and conversion plus PDF merge and split. These files are usually contracts, resumes, and invoices — exactly the content that should never be uploaded to a stranger server.',
            'Everyday calculators look unrelated to development but get used constantly: units, date arithmetic, mortgage payments, take-home pay, BMI, age. What matters is correctness, not feature count.',
          ],
          compare: [
            { left: 'Markdown editor and converter', right: 'Split-pane live preview, exporting source or HTML.' },
            { left: 'PDF merge and split', right: 'Precise page extraction in the browser, with no upload.' },
            { left: 'Units and date arithmetic', right: 'Length, weight, volume, temperature, date gaps — including ambiguous units like MB versus MiB.' },
            { left: 'Mortgage, salary, BMI, age', right: 'Repayment comparison, contribution and tax breakdown, health and age conventions.' },
          ],
        },
        {
          heading: 'Choosing between them',
          paragraphs: [
            'If the operation takes under a minute, stop opening terminals or installing apps — the browser is faster. If it repeats or belongs in a pipeline, write a script and use the tool only to verify the result.',
            'For sensitive data — keys, ID cards, contracts, unmasked user records — prefer tools that state local processing and keep working offline. The test is simple: disconnect the network and try again. If it still works, processing is local.',
          ],
          tips: ['💡 For the reasoning behind each category, the site also has deep-dive articles on CORS debugging, JWT versus HMAC, image format selection, and Markdown syntax details.'],
        },
      ],
    },
  },

  // -------------------- 17. 在线工具的数据安全 --------------------
  {
    slug: 'online-tool-data-security',
    date: '2026-11-11',
    tags: ['隐私', '安全', '原理'],
    toolKeys: ['image/image-compress', 'document/pdf-merge', 'image/image-base64'],
    zh: {
      title: '在线工具的数据安全：哪些文件会被上传',
      description: '三种在线工具处理机制的差别、如何用一分钟自查是否上传，以及纯前端方案背后的浏览器 API。',
      excerpt: '「免费在线工具」经常要你把文件传上去。有些确实只是在你的浏览器里算，有些则完整上传到了服务器。这两者的风险差了一个数量级，而且可以自己验证。',
      body: [
        {
          heading: '三种处理机制',
          paragraphs: [
            '第一种：上传到服务器处理。文件经网络传到远端，处理完再传回结果。你的身份证、合同、密钥都完整落在别人的硬盘上，留存多久、有没有人看、会不会被备份，完全不可控。',
            '第二种：浏览器本地处理。文件通过文件选择器读入页面内存，由 JavaScript（或 WebAssembly）在本地完成计算，全程没有网络请求。关闭页面，数据就从内存里消失了。',
            '第三种：纯计算。输入的是文本、数字或参数，不涉及文件，但同样可能被上传——比如在线格式化工具把整段代码提交到后端。判断标准依然是看有没有网络请求。',
          ],
        },
        {
          heading: '一分钟自查是否上传',
          paragraphs: [
            '最直接的方法：打开浏览器开发者工具的 Network 面板，勾选只显示 Fetch/XHR，然后执行一次操作。如果出现了请求，并且请求体大小接近你的文件大小，那就是上传了。',
            '更简单的办法：断开网络（关掉 Wi-Fi 或拔掉网线），再操作一次。本地处理的工具照常工作，需要服务器的工具会立刻失败。这个方法不需要懂技术。',
            '还有一个间接信号：处理大文件时页面会明显变慢甚至卡顿——这正是因为计算发生在你的电脑上。如果几 MB 的图片瞬间处理完，反而值得怀疑是不是走了服务器。',
          ],
          tips: ['💡 断网测试是最可靠的自查方式。它无法被伪造，也不需要理解任何技术细节——能不能用，就是答案。'],
        },
        {
          heading: '哪些内容最该谨慎',
          compare: [
            { left: '身份证、护照、驾照', right: '包含完整身份信息与证件号，一旦泄露可用于注册、贷款等场景。加水印、转格式这类操作应完全本地完成。' },
            { left: '合同与商业文件', right: '条款、金额、客户名单都是商业机密。合并、拆分、压缩 PDF 时尤其要注意。' },
            { left: '密钥与凭据', right: '私钥、API Key、Token。计算 HMAC 或解析 JWT 时，密钥输入框的内容不应离开本机。' },
            { left: '未脱敏的用户数据', right: '手机号、邮箱、订单记录。去重、格式化、对比这类操作经常涉及整批数据。' },
            { left: '代码与配置', right: '内部接口地址、表结构、业务逻辑。在线格式化工具提交整段代码是有风险的。' },
          ],
        },
        {
          heading: '纯前端是怎么做到的',
          paragraphs: [
            '文件读取靠 FileReader 和 Blob API：浏览器把用户选中的文件读成 ArrayBuffer 或 Data URL，全程不经过网络。',
            '图片处理靠 Canvas：把图片绘制到离屏画布，缩放、加水印、导出为指定格式，都是纯本地运算。这也是为什么处理几千万像素的图会卡——真的在算。',
            '加密与哈希靠 Web Crypto API：crypto.subtle 提供 SHA、HMAC、AES、RSA 等原生实现，由浏览器底层库完成，性能接近原生。',
            '复杂的格式解析（PDF、二维码识别、正则引擎）通常靠 WebAssembly：把 C/C++ 库编译成 wasm 在浏览器里跑，速度接近本地程序。',
          ],
        },
        {
          heading: '本地处理也不是万能的',
          paragraphs: [
            '本地处理解决的是「数据不会被传到第三方服务器」，但它不能防住你本机的风险：浏览器插件可以读取页面内容，公共电脑可能留有痕迹，恶意脚本能通过 XSS 窃取输入。',
            '所以合理的使用姿势是：敏感数据在可信设备上处理，处理完刷新页面，不在公共电脑上操作证件类文件，并保持浏览器与插件更新。',
            '另外，本地处理不等于开源可信。判断一个工具是否可靠，除了看它声明什么，更要看它实际发出了什么请求——这两者一致，才值得信任。',
          ],
        },
      ],
    },
    en: {
      title: 'Data safety in online tools: which files get uploaded',
      description: 'Three processing models, a one-minute self-check for uploads, and the browser APIs behind local processing.',
      excerpt: 'A "free online tool" often asks you to upload a file. Some genuinely compute inside your browser; others send everything to a server. The risk differs by an order of magnitude — and you can verify it yourself.',
      body: [
        {
          heading: 'Three processing models',
          paragraphs: [
            'First: server-side processing. The file travels over the network, gets processed remotely, and a result comes back. Your ID card, contract, or key sits on someone else storage, with retention, access, and backups entirely out of your control.',
            'Second: local processing. The file is read into page memory through a file picker and computed by JavaScript or WebAssembly, with no network request at all. Close the page and it is gone from memory.',
            'Third: pure computation. The input is text, numbers, or parameters rather than a file, but it can still be uploaded — an online formatter may post your entire codebase to a backend. The test is still the same: are there network requests?',
          ],
        },
        {
          heading: 'A one-minute upload check',
          paragraphs: [
            'Open DevTools, switch to the Network panel, filter to Fetch/XHR, and perform the operation once. If a request appears whose body size roughly matches your file, it was uploaded.',
            'Even simpler: disconnect the network and try again. A local tool keeps working; a server-dependent one fails immediately. No technical knowledge required.',
            'An indirect signal: large files make the page slow or freeze, because the computation is happening on your machine. If a multi-megabyte image processes instantly, it is worth wondering whether a server did it.',
          ],
          tips: ['💡 The offline test is the most reliable check. It cannot be faked and needs no technical understanding — if it still works, the processing is local.'],
        },
        {
          heading: 'What deserves the most caution',
          compare: [
            { left: 'ID cards, passports, licences', right: 'Full identity data and document numbers, which enable registrations and loans if leaked. Watermarking and format conversion belong on-device.' },
            { left: 'Contracts and business files', right: 'Terms, amounts, and client lists are commercial secrets. Especially relevant when merging, splitting, or compressing PDFs.' },
            { left: 'Keys and credentials', right: 'Private keys, API keys, tokens. When computing an HMAC or decoding a JWT, the secret field must never leave the machine.' },
            { left: 'Unmasked user data', right: 'Phone numbers, emails, order records. Deduplication, formatting, and diffing often involve entire datasets.' },
            { left: 'Code and configuration', right: 'Internal endpoints, schemas, business logic. Posting whole files to an online formatter carries real risk.' },
          ],
        },
        {
          heading: 'How local processing works',
          paragraphs: [
            'File reading uses FileReader and the Blob API: the browser turns the selected file into an ArrayBuffer or Data URL without any network hop.',
            'Image work uses Canvas: draw onto an offscreen canvas, then scale, watermark, and export to the target format — all local. That is also why a 50-megapixel image freezes the tab: it is genuinely computing.',
            'Cryptography uses the Web Crypto API: crypto.subtle provides native SHA, HMAC, AES, and RSA implementations with near-native performance.',
            'Heavy format parsing — PDF, QR decoding, regex engines — usually runs through WebAssembly: C or C++ libraries compiled to wasm so they run at close to native speed.',
          ],
        },
        {
          heading: 'Local processing is not a silver bullet',
          paragraphs: [
            'Local processing prevents data from reaching a third-party server, but it does not protect against risks on your own machine: extensions can read page content, shared computers leave traces, and injected scripts can exfiltrate inputs through XSS.',
            'Sensible habits: handle sensitive data on a trusted device, refresh the page afterwards, avoid ID documents on public computers, and keep the browser and extensions updated.',
            'Nor does local processing imply open-source trust. Judge a tool by what it actually sends over the wire, not only by what it claims — when the two agree, it has earned trust.',
          ],
        },
      ],
    },
  },

  // -------------------- 18. Markdown 速查 --------------------
  {
    slug: 'markdown-cheatsheet',
    date: '2026-11-11',
    tags: ['Markdown', '文档', '速查'],
    toolKeys: ['document/markdown-editor', 'document/markdown-convert'],
    zh: {
      title: 'Markdown 语法速查表：从标题到表格',
      description: '一页掌握 Markdown 常用语法：标题、强调、列表、链接、图片、表格、代码块、任务列表，附 6 个最容易写错的细节。',
      excerpt: 'Markdown 用一套极简符号就能写出结构清晰的文档，但总有几个细节容易记混——列表前的空行、表格的分隔行、围栏长度、加号与减号的混用。这篇把高频语法和易错点放在一页，随时可查。',
      body: [
        {
          heading: '为什么还在用 Markdown',
          paragraphs: [
            'Markdown 的价值不是"排版好看"，而是纯文本可读、可 diff、可版本管理。同一份文件在 GitHub、飞书、Notion、语雀、静态博客里都能正确渲染，学会一次到处能用。',
            '更重要的是它没有锁定格式：导出 HTML、PDF、Word 都可以由渲染器完成，源文件永远是几 KB 的纯文本，十年后依然能打开。',
          ],
        },
        {
          heading: '基础语法',
          code: [
            {
              lang: 'markdown',
              code: `# 一级标题
## 二级标题
### 三级标题

普通段落，**加粗**、*斜体*、~~删除线~~、\`行内代码\`。

- 无序列表
- 第二项
  - 缩进两个空格表示嵌套

1. 有序列表
2. 第二项`,
            },
          ],
          paragraphs: [
            '标题建议只用一到三级，层级过深说明文档结构该拆了。加粗用于强调关键词，斜体用于术语首次出现，两者叠加写作时尽量克制。',
          ],
        },
        {
          heading: '链接、图片、引用与表格',
          code: [
            {
              lang: 'markdown',
              code: `[链接文字](https://tools.qiuyun.dev)
![图片描述](/cover.png)

> 一级引用
> > 二级引用

---

| 姓名 | 年龄 | 城市 |
| :--- | :---: | ---: |
| 张三 | 28 | 北京 |

- [x] 已完成
- [ ] 未完成`,
            },
          ],
          paragraphs: [
            '表格第二行的冒号决定对齐方式：左边加冒号左对齐，两边都加居中对齐，右边加冒号右对齐。不写冒号默认左对齐。',
            '任务列表只识别 `- [x]` 和 `- [ ]` 两种写法，方括号内必须是一个空格或 x，多个空格会导致渲染失败。',
          ],
        },
        {
          heading: '代码块与围栏规则',
          paragraphs: [
            '用三个反引号包裹代码，并在开头那行标注语言标识（js、python、bash、json），大多数渲染器会据此做语法高亮。',
            '如果代码内容本身包含连续三个反引号（比如你在写 Markdown 教程），外层围栏要用四个反引号，长度只需比内部最长的一段多即可。',
          ],
          tips: [
            '💡 代码块前后各留一个空行，否则部分渲染器会把围栏当成段落文本输出。',
            '💡 行内代码的反引号数量要匹配内容：内容里有一个反引号时，用两个反引号包裹。',
          ],
        },
        {
          heading: '最容易写错的 6 个细节',
          compare: [
            { left: '列表前不空行', right: '正文紧接下一行写 - 项，很多解析器会当成同一段落。列表前后各留一个空行最稳。' },
            { left: '表格分隔行漏写', right: '表格必须有第二行 | --- | --- | 分隔行，缺了整张表就是普通文本。' },
            { left: '段内换行不生效', right: 'Markdown 里单个换行等于空格，要强制换行需在行尾加两个空格或直接留空行分段。' },
            { left: '链接地址含空格', right: 'URL 里有空格或括号会提前截断链接，先用 %20 编码再放进去。' },
            { left: '用下划线做强调', right: '中文语境下 _斜体_ 常因紧贴中文而失效，统一用 * 号更可靠。' },
            { left: 'HTML 与 Markdown 混写', right: '块级 HTML 标签内部不会再解析 Markdown 语法，混用时容易丢失排版。' },
          ],
        },
        {
          heading: '写完怎么验证和转换',
          paragraphs: [
            'Markdown 的"看起来没问题"和"渲染正确"经常是两回事，尤其表格与嵌套列表。写完建议立刻在带实时预览的编辑器里过一遍，确认每段结构符合预期。',
            '需要交付给别人时，再转成 HTML 或 PDF——转换器对语法严格程度不同，先预览再导出能省掉大半返工。',
          ],
        },
      ],
    },
    en: {
      title: 'Markdown cheat sheet: from headings to tables',
      description: 'Every Markdown syntax you actually need on one page — headings, emphasis, lists, links, images, tables, code blocks, task lists — plus six details people get wrong.',
      excerpt: 'Markdown writes clean documents with a handful of symbols, yet a few details never stick: the blank line before a list, the table separator row, fence length, underscore emphasis. This page collects the syntax and the pitfalls in one place.',
      body: [
        {
          heading: 'Why Markdown is still everywhere',
          paragraphs: [
            'The value of Markdown is not pretty typography — it is that plain text is readable, diffable, and version-controllable. The same file renders correctly on GitHub, Feishu, Notion, and any static blog generator, so you learn it once and use it everywhere.',
            'It also avoids lock-in: HTML, PDF, and Word exports are the renderer\'s job, while the source stays a few kilobytes of text that will still open a decade from now.',
          ],
        },
        {
          heading: 'Basic syntax',
          code: [
            {
              lang: 'markdown',
              code: `# Heading 1
## Heading 2
### Heading 3

A normal paragraph with **bold**, *italic*, ~~strikethrough~~ and \`inline code\`.

- First bullet
- Second bullet
  - Nested two spaces in

1. First item
2. Second item`,
            },
          ],
          paragraphs: [
            'Stick to levels one through three. If you need a fourth level, the document probably wants splitting. Use bold for key terms and italics for first-use jargon, and do not stack them.',
          ],
        },
        {
          heading: 'Links, images, quotes, tables',
          code: [
            {
              lang: 'markdown',
              code: `[Link text](https://tools.qiuyun.dev)
![Alt text](/cover.png)

> Level one quote
> > Level two quote

---

| Name | Age | City |
| :--- | :---: | ---: |
| Zhang | 28 | Beijing |

- [x] Done
- [ ] Not done`,
            },
          ],
          paragraphs: [
            'Colons in the separator row control alignment: a leading colon left-aligns, colons on both sides center, a trailing colon right-aligns. No colon means left alignment.',
            'Task lists accept only `- [x]` and `- [ ]` — a single space or an x inside the brackets. Two spaces break rendering.',
          ],
        },
        {
          heading: 'Code blocks and fences',
          paragraphs: [
            'Wrap code in three backticks and put a language tag on the opening line (js, python, bash, json). Most renderers use it for syntax highlighting.',
            'If the content itself contains three consecutive backticks — for example when writing a Markdown tutorial — use four backticks for the outer fence. It only needs to be longer than the longest run inside.',
          ],
          tips: [
            '💡 Leave a blank line before and after a code block, otherwise some renderers print the fence as paragraph text.',
            '💡 Match the backtick count for inline code: if the content has one backtick, wrap it in two.',
          ],
        },
        {
          heading: 'Six details people get wrong',
          compare: [
            { left: 'No blank line before a list', right: 'Writing a bullet directly under a paragraph often merges them. Keep a blank line on both sides of any list.' },
            { left: 'Missing table separator', right: 'The second row | --- | --- | is mandatory. Without it the table renders as plain text.' },
            { left: 'Single newline does nothing', right: 'A single line break is treated as a space. Add two trailing spaces or use a blank line to start a new paragraph.' },
            { left: 'Spaces inside link URLs', right: 'Spaces or parentheses truncate the link. Percent-encode them as %20 first.' },
            { left: 'Underscore emphasis', right: 'With CJK text directly adjacent, _italic_ often fails. Use asterisks consistently instead.' },
            { left: 'Mixing HTML and Markdown', right: 'Markdown syntax inside a block-level HTML element is not parsed, so layout silently disappears.' },
          ],
        },
        {
          heading: 'Validate, then convert',
          paragraphs: [
            'That something looks fine in source and that it renders correctly are two different things — tables and nested lists are the usual culprits. Run it through an editor with live preview before calling it done.',
            'When you need to hand the document to someone else, convert to HTML or PDF. Converters differ in strictness, so preview first and export second.',
          ],
        },
      ],
    },
  },

  // -------------------- 19. 正则表达式大全 --------------------
  {
    slug: 'regex-patterns-cookbook',
    date: '2026-11-11',
    tags: ['正则', 'JavaScript', '速查'],
    toolKeys: ['dev/regex-tester'],
    zh: {
      title: '常用正则表达式大全：邮箱、手机号、URL、日期',
      description: '把日常开发最常用的正则集中在一页：邮箱、手机号、身份证、URL、IP、日期时间、密码强度，附可直接复制的 JavaScript 写法。',
      excerpt: '从网上抄来的正则经常一用就错，多半是缺少锚点、缺少标志位，或者用了目标语言不支持的语法。这里按"用途 → 模式 → 说明 → 反例"整理，并标清每个模式的适用边界。',
      body: [
        {
          heading: '先记住三条使用原则',
          paragraphs: [
            '验证必须带锚点。只写 [a-z]+ 时，"!!!abc!!!" 也会返回匹配成功。校验整个字符串时前后都要加 ^ 和 $。',
            '提取记得加 g。想抓出文本里所有符合的子串，要用 g 标志配合 matchAll，否则只会拿到第一个。',
            '边界比精确更重要。RFC 5322 规定的完整邮箱正则长达数百字符且无法维护，业务上用一个能拦住明显错误的宽松版本，最终靠发送验证邮件确认。',
          ],
        },
        {
          heading: '表单验证类',
          code: [
            {
              lang: 'javascript',
              code: `// 邮箱：宽松版，可维护性优先
const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/

// 中国大陆手机号：11 位，1 开头，第二位 3-9
const CN_MOBILE = /^1[3-9]\\d{9}$/

// 中国大陆身份证：18 位，末位可为 X
const CN_ID = /^\\d{17}[\\dXx]$/

// 强密码：至少 8 位，含大小写、数字、特殊字符
const STRONG_PWD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$/`,
            },
          ],
          paragraphs: [
            '强密码用的是"前瞻断言"技巧：(?=.*[a-z]) 表示"后面某处要出现小写字母"，四个断言都不消费字符，最后 .{8,} 才真正匹配整串。',
          ],
          tips: [
            '⚠️ 不要把手机号、身份证的校验写成"必须严格符合某年某地规则"，规则会变，而且正则无法验证真实性。校验格式，真实性交给后端或实名接口。',
          ],
        },
        {
          heading: 'URL 与网络类',
          code: [
            {
              lang: 'javascript',
              code: `// http / https URL（不追求完整 RFC 3986）
const URL_RE = /^https?:\\/\\/[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:/~+#-]*)?$/

// IPv4
const IPV4 = /^((25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)$/

// 域名（不含协议和路径）
const DOMAIN = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*$/`,
            },
          ],
          paragraphs: [
            'URL 这类结构复杂的字符串，能用 new URL() 解析就不要写正则。正则适合快速筛查，正式解析交给标准库——它还会帮你处理端口、认证信息、百分号编码。',
          ],
        },
        {
          heading: '日期与时间',
          code: [
            {
              lang: 'javascript',
              code: `// YYYY-MM-DD，只校验格式
const DATE = /^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/

// HH:mm 或 HH:mm:ss
const TIME = /^([01]\\d|2[0-3]):[0-5]\\d(:[0-5]\\d)?$/

// ISO 8601，带时区
const ISO8601 = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$/`,
            },
          ],
          tips: [
            '⚠️ 格式合法不等于日期存在：2026-02-30 能通过上面的 DATE 正则。要判断真实性，解析成 Date 后再读回年月日比对。',
          ],
        },
        {
          heading: '提取与替换类',
          code: [
            {
              lang: 'javascript',
              code: `// 提取文本里的所有链接
const urls = [...text.matchAll(/https?:\\/\\/[^\\s"'<>]+/g)]

// 数字加千分位
const money = '1234567.89'.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')

// 去掉 HTML 标签（仅用于普通文本，不能用于净化不可信内容）
const plain = html.replace(/<[^>]*>/g, '')`,
            },
          ],
          paragraphs: [
            '千分位那行利用 \\B（非单词边界）配合 (?=(\\d{3})+(?!\\d)) 前瞻，只在"后面恰好是 3 的倍数个数字"的位置插入逗号，因此不会在小数点后误插。',
          ],
        },
        {
          heading: '常见错误对照',
          compare: [
            { left: '缺少 ^ $ 锚点', right: '验证场景下会让含垃圾字符的输入也通过，是最高频的线上事故来源。' },
            { left: '\\d 写成 \\D', right: '大小写含义完全相反：\\d 是数字，\\D 是非数字。这类笔误在长正则里极难肉眼发现。' },
            { left: '点号没转义', right: '匹配真实的小数点或域名点必须写 \\.，裸 . 会匹配任意字符。' },
            { left: '用 .* 跨行匹配', right: '默认 . 不匹配换行，跨行要用 [\\s\\S]* 或加 s 标志。' },
            { left: '嵌套量词造成 ReDoS', right: '(a+)+ 这类写法在恶意输入下可能指数级耗时，生产环境避免。' },
            { left: 'test 与 g 标志复用', right: '带 g 的 RegExp 会记住 lastIndex，连续调用结果会交替，每次新建实例或用 match 替代。' },
          ],
        },
      ],
    },
    en: {
      title: 'Regex cookbook: email, phone, URL, date and more',
      description: 'The regexes you reach for every week, collected on one page with copy-paste JavaScript and a clear note on where each one stops being reliable.',
      excerpt: 'Regexes copied from the internet break for predictable reasons: missing anchors, missing flags, or syntax your language does not support. This cookbook lists pattern, purpose, and counterexample for each.',
      body: [
        {
          heading: 'Three rules before you copy anything',
          paragraphs: [
            'Validation needs anchors. Written as [a-z]+, the pattern happily matches "!!!abc!!!". Wrap it in ^ and $ when you validate a whole string.',
            'Extraction needs g. To pull every match out of a text, use the g flag with matchAll — otherwise you only get the first one.',
            'Boundaries beat precision. The full RFC 5322 email pattern is hundreds of characters long and unmaintainable. Ship a lenient pattern that blocks obvious mistakes and confirm with a verification email.',
          ],
        },
        {
          heading: 'Form validation',
          code: [
            {
              lang: 'javascript',
              code: `// Email: lenient, maintainable
const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/

// Mainland China mobile: 11 digits starting with 1, second digit 3-9
const CN_MOBILE = /^1[3-9]\\d{9}$/

// Mainland China ID: 18 chars, last may be X
const CN_ID = /^\\d{17}[\\dXx]$/

// Strong password: 8+ chars with lower, upper, digit, symbol
const STRONG_PWD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$/`,
            },
          ],
          paragraphs: [
            'The password pattern uses lookaheads: (?=.*[a-z]) means "a lowercase letter appears somewhere ahead". None of the four lookaheads consumes input, so .{8,} still has to match the whole string.',
          ],
          tips: [
            '⚠️ Do not encode yearly-changing ID rules into a regex. A regex validates shape, never truth. Leave authenticity to the backend or a real verification service.',
          ],
        },
        {
          heading: 'URLs and networking',
          code: [
            {
              lang: 'javascript',
              code: `// http / https URL (not full RFC 3986)
const URL_RE = /^https?:\\/\\/[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:/~+#-]*)?$/

// IPv4
const IPV4 = /^((25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)$/

// Domain only, no scheme or path
const DOMAIN = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*$/`,
            },
          ],
          paragraphs: [
            'For anything as structured as a URL, prefer new URL() over regex when the language offers it. Regex is for quick screening; the standard library handles ports, credentials, and percent-encoding correctly.',
          ],
        },
        {
          heading: 'Dates and times',
          code: [
            {
              lang: 'javascript',
              code: `// YYYY-MM-DD, shape only
const DATE = /^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/

// HH:mm or HH:mm:ss
const TIME = /^([01]\\d|2[0-3]):[0-5]\\d(:[0-5]\\d)?$/

// ISO 8601 with timezone
const ISO8601 = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$/`,
            },
          ],
          tips: [
            '⚠️ A valid shape is not a real date: 2026-02-30 passes the DATE pattern above. To catch that, parse it into a Date and compare the fields back.',
          ],
        },
        {
          heading: 'Extraction and replacement',
          code: [
            {
              lang: 'javascript',
              code: `// Extract all links from a text
const urls = [...text.matchAll(/https?:\\/\\/[^\\s"'<>]+/g)]

// Thousands separators
const money = '1234567.89'.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')

// Strip HTML tags (plain text only, never for sanitizing untrusted input)
const plain = html.replace(/<[^>]*>/g, '')`,
            },
          ],
          paragraphs: [
            'The thousands line uses \\B (not a word boundary) with a lookahead that only fires where exactly a multiple of three digits follows, so it never inserts a comma after the decimal point.',
          ],
        },
        {
          heading: 'Common mistakes',
          compare: [
            { left: 'Missing ^ and $', right: 'The single most common production bug: garbage-padded input passes validation.' },
            { left: '\\d typed as \\D', right: 'Case flips the meaning entirely — \\d is a digit, \\D is a non-digit. Almost invisible inside a long pattern.' },
            { left: 'Unescaped dot', right: 'A literal dot in a domain or decimal needs \\.; a bare . matches any character.' },
            { left: '.* across lines', right: '. does not match newlines by default. Use [\\s\\S]* or the s flag.' },
            { left: 'Nested quantifiers', right: '(a+)+ can take exponential time on crafted input. Avoid it in production patterns.' },
            { left: 'Reusing a g-flag regex', right: 'A global RegExp keeps lastIndex, so consecutive test calls alternate true/false. Create a new instance or use match.' },
          ],
        },
      ],
    },
  },

  // -------------------- 20. %20 与 + --------------------
  {
    slug: 'url-encode-plus-vs-percent20',
    date: '2026-11-11',
    tags: ['URL', '编码', '调试'],
    toolKeys: ['crypto/url-codec', 'crypto/base64'],
    zh: {
      title: 'URL 里的空格为什么有两种写法：%20 与 + 的区别',
      description: '同一个空格，有时编码成 %20，有时编码成 +。两套规则来源不同、解码行为不同，混用会导致参数丢失或值被改写。',
      excerpt: '前端用 encodeURIComponent 得到 %20，后端某些框架读出来却变成加号；用户输入一个 + 号，服务端却解析成空格。这类问题的根源是两套并行的编码规则：RFC 3986 的百分号编码，和 HTML 表单的 application/x-www-form-urlencoded。',
      body: [
        {
          heading: '两套规则，两个出处',
          paragraphs: [
            '%20 来自 RFC 3986 的百分号编码：空格在 URL 里不允许出现，必须按 UTF-8 编码成字节 0x20，再写成十六进制 %20。',
            '+ 来自 HTML 表单的历史约定：application/x-www-form-urlencoded 规定空格用 + 表示，以便缩短表单提交长度。后来 URLSearchParams 与不少后端框架沿用了这套规则。',
            '关键区别是作用范围：表单编码只约定在查询字符串（? 之后）和请求体里生效，路径部分永远不该用 + 表示空格。',
          ],
        },
        {
          heading: '什么时候会踩坑',
          compare: [
            { left: '手工拼接查询参数', right: '用 "?q=" + encodeURIComponent(v) 得到 %20，再用 URLSearchParams 读出来又变回空格，看似无害，但混合使用两种方式时结果不一致。' },
            { left: '用户输入字符串本身带 +', right: '查询字符串里的 + 会被部分解码器还原成空格，"C++ 教程"变成"C  教程"。必须先把 + 编码成 %2B。' },
            { left: '路径段里用 +', right: '路径 /a+b 中的 + 是字面加号，不会变成空格；但同一个字符串放进查询参数就会变。' },
            { left: '双重编码', right: '已经编码过的值再编码一次，%20 会变成 %2520，后端解码一次仍是 %20，前端看到的就是字面百分号。' },
            { left: 'Base64 放查询参数', right: '标准 Base64 含 + 和 =，+ 会被解析成空格。必须改用 Base64url（+ 换 -、/ 换 _、去掉 =）。' },
            { left: '只解一次就想还原', right: '多层嵌套编码（比如 URL 里装 URL）需要解对应层级，盲目循环解码会把正常字符也解开。' },
          ],
        },
        {
          heading: '解码行为实测',
          code: [
            {
              lang: 'javascript',
              code: `encodeURIComponent('a b')            // "a%20b"
new URLSearchParams({ q: 'a b' }).toString()  // "q=a+b"

decodeURIComponent('a+b')             // "a+b"   加号不会还原成空格
new URLSearchParams('q=a+b').get('q') // "a b"   加号在这里会被还原成空格

// 想让查询参数里的加号保持字面值，必须先编码
new URLSearchParams({ q: 'C++' }).toString() // "q=C%2B%2B"`,
            },
          ],
          paragraphs: [
            '注意最后一行：URLSearchParams 会把 + 编码成 %2B，而这正说明它自己知道 + 有特殊含义。手写字符串拼接就享受不到这层保护。',
          ],
        },
        {
          heading: '实践结论',
          paragraphs: [
            '不要手拼查询字符串。前端统一用 URLSearchParams 或 axios、fetch 的 params 选项，让库负责编码；后端用框架自带的查询参数解析器，不要自己 split("&") 再手写 decode。',
            '需要把二进制或结构化数据塞进 URL 时，选 Base64url 而不是标准 Base64。JWT 就是这么做的，标准里明确规定使用 url-safe 变体。',
            '如果必须自己处理，记住这条顺序：先对参数值做百分号编码，再拼接；解码时先按查询字符串规则解析，再对值做百分号解码，顺序反了就会多重解码。',
          ],
          tips: [
            '💡 排查线上问题时，先打印"原始 URL → 服务端收到的原始 query string → 解析后的参数值"三段，差异出现在哪一段就能定位是哪层解码错了。',
          ],
        },
        {
          heading: '快速自查',
          paragraphs: [
            '把出问题的参数值单独拿出来，分别用三种方式编码对比输出：encodeURIComponent、URLSearchParams、手工替换空格为 +。三者结果不一致，就是问题的根源。',
            '本站 URL 编码工具同时提供 encodeURI 与 encodeURIComponent 两种模式，可以即时看到每个特殊字符被转成什么，不必反复刷新页面验证。',
          ],
        },
      ],
    },
    en: {
      title: 'Why a space in a URL is sometimes %20 and sometimes +',
      description: 'The same space encodes two ways depending on which rule set you use. Mixing them silently loses parameters or rewrites values.',
      excerpt: 'encodeURIComponent gives you %20, but some backends read it back as a plus. A user types a plus sign and the server decodes it as a space. The root cause is two parallel encoding rules: RFC 3986 percent-encoding and the HTML form encoding application/x-www-form-urlencoded.',
      body: [
        {
          heading: 'Two rules, two origins',
          paragraphs: [
            '%20 comes from RFC 3986 percent-encoding: a space is illegal in a URL, so it must be encoded as the UTF-8 byte 0x20 and written as %20.',
            '+ comes from the historical HTML form encoding application/x-www-form-urlencoded, which represents a space as + to keep form submissions short. URLSearchParams and many backend frameworks inherited that convention.',
            'The scope is the crucial part: form encoding only applies to the query string (after the ?) and to request bodies. A path segment should never use + for a space.',
          ],
        },
        {
          heading: 'Where it bites',
          compare: [
            { left: 'Hand-built query strings', right: '"?q=" + encodeURIComponent(v) yields %20 while URLSearchParams yields +. Mixing the two builders gives inconsistent results for the same value.' },
            { left: 'User input containing +', right: 'In a query string, + may decode to a space, turning "C++" into "C  ". Encode the + as %2B first.' },
            { left: 'Plus in a path segment', right: '/a+b keeps the literal plus. The identical string in a query parameter becomes a space.' },
            { left: 'Double encoding', right: 'Encoding an already-encoded value turns %20 into %2520, and one decode still leaves %20 visible.' },
            { left: 'Base64 in a query string', right: 'Standard Base64 contains + and =, and + decodes to a space. Use Base64url (+ to -, / to _, strip =) instead.' },
            { left: 'Decoding once is not always enough', right: 'Nested encoding — a URL inside a URL — needs the matching number of decodes. Blindly looping corrupts normal characters.' },
          ],
        },
        {
          heading: 'Observed behaviour',
          code: [
            {
              lang: 'javascript',
              code: `encodeURIComponent('a b')            // "a%20b"
new URLSearchParams({ q: 'a b' }).toString()  // "q=a+b"

decodeURIComponent('a+b')             // "a+b"   plus stays a plus
new URLSearchParams('q=a+b').get('q') // "a b"   plus becomes a space

// To keep a literal plus, it must be encoded first
new URLSearchParams({ q: 'C++' }).toString() // "q=C%2B%2B"`,
            },
          ],
          paragraphs: [
            'Note the last line: URLSearchParams encodes + as %2B, which proves it knows + is special. Manual string concatenation never gets that protection.',
          ],
        },
        {
          heading: 'What to do instead',
          paragraphs: [
            'Never concatenate query strings by hand. Use URLSearchParams, or the params option of axios/fetch, and let the library encode. On the server, use the framework parser instead of split("&") plus a hand-rolled decode.',
            'When binary or structured data must travel in a URL, choose Base64url over standard Base64. JWT does exactly this and the spec mandates the url-safe variant.',
            'If you must do it manually, keep this order: percent-encode each value, then join. On the way back, parse the query string first, then percent-decode each value. Reversing that order causes double decoding.',
          ],
          tips: [
            '💡 When debugging in production, print three things: the raw URL, the raw query string the server received, and the parsed parameter values. Whichever step differs tells you which decoder went wrong.',
          ],
        },
        {
          heading: 'Quick self-check',
          paragraphs: [
            'Take the offending value alone and encode it three ways — encodeURIComponent, URLSearchParams, and a manual space-to-plus replacement. If the three disagree, you have found the root cause.',
            'Qiuyun\'s URL encoder offers both encodeURI and encodeURIComponent modes and shows exactly what each special character becomes, so you do not have to reload a page to verify.',
          ],
        },
      ],
    },
  },

  // -------------------- 21. 周岁虚岁 --------------------
  {
    slug: 'age-zhousui-xusui',
    date: '2026-11-11',
    tags: ['生活', '日期', '计算'],
    toolKeys: ['life/age', 'life/date-calc'],
    zh: {
      title: '周岁、虚岁、实岁到底怎么算？',
      description: '同一个年龄有三种口径：周岁按公历生日算，虚岁按农历年算，实岁还可能指精确到天。本文把三种算法和常见分歧一次讲清楚。',
      excerpt: '同一句"我今年 30 岁"，在法律文件、医院病历和老家亲戚口中可能指三个不同的数字。周岁、虚岁、实岁的差别不只是加减一岁，而是计算基准完全不同。',
      body: [
        {
          heading: '三种口径，三个基准',
          compare: [
            { left: '周岁（国际通用）', right: '出生满一年记 1 岁，按公历生日逐年累加。法律、证件、医疗、入学统一使用这个口径。' },
            { left: '虚岁（传统口径）', right: '出生即记 1 岁，之后每过一个农历新年加 1 岁，与生日无关，因此一年可能"长两岁"。' },
            { left: '实岁 / 毛岁（口语）', right: '口语里的"实岁"通常就是周岁，"毛岁"在部分地区指虚岁。含义随地域变化，正式场合不要使用。' },
          ],
        },
        {
          heading: '周岁怎么算',
          paragraphs: [
            '规则很简单：今年的年份减去出生年份；如果今年的生日还没到，再减 1。判断"生日是否已过"必须比较月、日，只比年份是最常见的错误。',
          ],
          code: [
            {
              lang: 'javascript',
              code: `function ageInYears(birth, now = new Date()) {
  let age = now.getFullYear() - birth.getFullYear()
  const hadBirthday =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate())
  return hadBirthday ? age : age - 1
}`,
            },
          ],
          tips: [
            '⚠️ 2 月 29 日出生的人，在平年通常按 2 月 28 日或 3 月 1 日过生日。中国的司法与行政实践中，以 2 月最后一天（即 2 月 28 日）作为生日届满日，涉及法律年龄时按此处理。',
          ],
        },
        {
          heading: '虚岁怎么算',
          paragraphs: [
            '通用公式是：虚岁 = 当前农历年 − 出生农历年 + 1。因为出生即算 1 岁，所以永远比"农历年纪"多 1。',
            '腊月出生的人最容易遇到"两天长两岁"：除夕前出生虚岁 1 岁，过了春节立刻变成 2 岁。这不是算错，而是虚岁本来就以年为界而非以生日为界。',
            '部分地区以立春而非正月初一作为年份分界，还有"落地一岁、过年一岁"等不同说法。因此虚岁没有全国统一标准，跨地区交流时最好直接说周岁。',
          ],
        },
        {
          heading: '最容易算错的五个地方',
          compare: [
            { left: '只做年份相减', right: '2026 年 1 月对上 1996 年 12 月的生日，年份差是 30，但生日还没到，周岁应为 29。' },
            { left: '生日当天是否算长一岁', right: '生日当天即满新的一岁，判断条件要用 >= 而不是 >。差一个等号，生日当天就会少算一岁。' },
            { left: '把虚岁当周岁用', right: '办证件、报名入学、签合同一律用周岁。虚岁只适合日常寒暄。' },
            { left: '忽略时区与跨日', right: '出生时间若按 UTC 存，在东八区凌晨出生的人日期可能差一天。计算年龄前先统一到同一时区。' },
            { left: '农历公历混用', right: '身份证上是公历，老家说法常是农历。混着算会凭空多出或少了近一个月，涉及日期必须标明历法。' },
          ],
        },
        {
          heading: '哪些场景必须精确到天',
          paragraphs: [
            '入学年龄以当地规定的截止日为准（多数地区要求 8 月 31 日前满 6 周岁），差一天就要多等一年。退休、保险生效日、签证材料、体检报告同样按周岁精确计算。',
            '如果只是想知道"我活了多少天"，那是另一个问题：需要按实际天数差计算，并考虑闰年与夏令时。本站的日期计算工具可以直接给出两个日期之间的天数、周数和月数。',
          ],
          tips: [
            '💡 拿身份证上的出生日期输入年龄计算工具，选择计算日期为今天，得到的就是周岁，可以直接用于填表。',
          ],
        },
      ],
    },
    en: {
      title: 'Zhou sui, xu sui and shi sui: how Chinese age systems work',
      description: 'Three age conventions coexist in Chinese: full years from your birthday, the lunar-year count that adds a year at Spring Festival, and colloquial variants. Here is how each is computed.',
      excerpt: 'The sentence "I am 30 this year" can mean three different numbers depending on whether it comes from a legal document, a hospital form, or a relative. The difference is not plus or minus one — the counting basis is entirely different.',
      body: [
        {
          heading: 'Three conventions, three bases',
          compare: [
            { left: 'Zhou sui (full years)', right: 'One year old after the first full year, incremented on the Gregorian birthday. Used by law, ID documents, healthcare, and school enrollment.' },
            { left: 'Xu sui (nominal age)', right: 'Counted as 1 at birth, then plus one at every Lunar New Year regardless of birthday — which is why someone can "age two years" in one calendar year.' },
            { left: 'Shi sui / mao sui (colloquial)', right: 'In speech, shi sui usually means full years while mao sui means nominal age in some regions. Meaning varies locally; avoid these in formal contexts.' },
          ],
        },
        {
          heading: 'Computing full years',
          paragraphs: [
            'Subtract the birth year from the current year, then subtract one more if this year\'s birthday has not arrived yet. The comparison must include month and day — comparing years alone is the most common bug.',
          ],
          code: [
            {
              lang: 'javascript',
              code: `function ageInYears(birth, now = new Date()) {
  let age = now.getFullYear() - birth.getFullYear()
  const hadBirthday =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate())
  return hadBirthday ? age : age - 1
}`,
            },
          ],
          tips: [
            '⚠️ For people born on February 29, the birthday is normally observed on February 28 or March 1 in non-leap years. Chinese legal and administrative practice treats the last day of February as the birthday, so use February 28 when a legal age is at stake.',
          ],
        },
        {
          heading: 'Computing nominal age',
          paragraphs: [
            'The common formula is: current lunar year minus birth lunar year plus one. Since birth already counts as one, the result is always one more than the lunar year difference.',
            'People born in the twelfth lunar month hit the famous "two years in two days" case: nominal age 1 before New Year\'s Eve, 2 immediately after. That is not an error — nominal age is bounded by years, not birthdays.',
            'Some regions use Lichun (the start of spring) rather than the first day of the first lunar month as the boundary, and other local variants exist. Nominal age has no single national standard, so state full years when precision matters.',
          ],
        },
        {
          heading: 'Five places people get it wrong',
          compare: [
            { left: 'Subtracting years only', right: 'January 2026 against a December 1996 birthday gives a 30-year difference, but the birthday has not arrived — the correct answer is 29.' },
            { left: 'The birthday itself', right: 'You turn a year older on the day itself, so the comparison needs >= rather than >. One character changes the result on that exact day.' },
            { left: 'Using nominal age officially', right: 'IDs, enrollment, and contracts all use full years. Nominal age is for casual conversation only.' },
            { left: 'Ignoring timezones', right: 'If birth timestamps are stored in UTC, someone born just after midnight UTC+8 can land on a different calendar day. Normalize the timezone before computing.' },
            { left: 'Mixing lunar and Gregorian', right: 'An ID card carries a Gregorian date while family tradition often quotes the lunar one. Mixing them shifts the result by nearly a month.' },
          ],
        },
        {
          heading: 'When precision to the day matters',
          paragraphs: [
            'School enrollment cuts off at a locally mandated date — commonly 6 years old by August 31 — and missing by one day costs a full year. Retirement dates, insurance effective dates, visa paperwork, and medical reports are also computed in exact full years.',
            'If what you actually want is "how many days have I been alive", that is a different question: you need the raw date difference, accounting for leap years. Qiuyun\'s date calculator returns days, weeks, and months between any two dates.',
          ],
          tips: [
            '💡 Enter the birth date from your ID card and set the target date to today to get your full-year age, ready for any form.',
          ],
        },
      ],
    },
  },

  // -------------------- 22. 中文大写金额 --------------------
  {
    slug: 'chinese-capital-numbers',
    date: '2026-11-11',
    tags: ['数字', '财务', '规范'],
    toolKeys: ['number/chinese-num'],
    zh: {
      title: '中文大写金额怎么写？财务票据规范一次讲清',
      description: '支票、发票、报销单上的大写金额有严格书写规范：壹拾不能写拾、连续零只写一个、元后加整。附常见错误对照和转换方法。',
      excerpt: '小写金额可以被添笔改写，大写金额不行——这就是票据必须写大写的全部原因。但"壹拾"和"拾"、"零"该写几个、"整"什么时候写，规则比想象中细。',
      body: [
        {
          heading: '为什么票据必须写大写金额',
          paragraphs: [
            '阿拉伯数字"1"加一竖可以变成"7"，"3"改一笔能变成"8"，小写金额存在被涂改的风险。中文大写数字笔画复杂、难以增删，因此在支票、汇票、发票、收据、报销单上，金额必须同时写小写和大写。',
            '两者不一致时，中国票据法与实践以大写金额为准。所以大写写错不是"格式问题"，而是直接决定这张票据能不能用。',
          ],
        },
        {
          heading: '基本字符对照',
          compare: [
            { left: '数字 0-9', right: '零、壹、贰、叁、肆、伍、陆、柒、捌、玖' },
            { left: '数位', right: '拾、佰、仟、万、拾万、佰万、仟万、亿' },
            { left: '货币单位', right: '元（圆）、角、分' },
            { left: '结尾', right: '整（或"正"），仅在没有角分时使用' },
          ],
        },
        {
          heading: '五条核心规则',
          paragraphs: [
            '1. 到"元"为止的，元后写"整"或"正"。例如 123.00 写作"壹佰贰拾叁元整"，不能写成"壹佰贰拾叁元零角零分"。',
            '2. 有角无分的，角后可以不写"整"。例如 123.40 写作"壹佰贰拾叁元肆角"，也可写"肆角整"，但不能再补"零分"。',
            '3. 有角有分的，按位写全。例如 123.45 写作"壹佰贰拾叁元肆角伍分"。',
            '4. 中间连续的零只写一个"零"。例如 1005 写作"壹仟零伍元整"，不是"壹仟零零伍"。',
            '5. 十位是 1 时必须写"壹拾"。票据上写"拾元整"不规范，必须写成"壹拾元整"，同理"壹拾贰元"。',
          ],
        },
        {
          heading: '跨节零位最容易错',
          paragraphs: [
            '中文数字按"万""亿"分节，每节四位。当某一节的末尾是零、而下一节还有非零数字时，必须补一个"零"来标记空位，否则会被读成相邻位。',
            '例如 100000001 应写作"壹亿零壹元整"——亿位与个位之间隔着 7 个零，但只补一个"零"。而 100010000 写作"壹亿零壹万元整"。',
            '实用判断法：把这个数按四位分组念出来。凡是"某节有数字，但比它更低的相邻节整节为零"的位置，就写一个"零"。',
          ],
          tips: [
            '💡 拿不准时不要硬推规则，直接用转换工具生成再人工核对一遍。规则只有五条，但组合出来的边界情况比想象中多。',
          ],
        },
        {
          heading: '最常见的六个错误',
          compare: [
            { left: '拾元整', right: '应为「壹拾元整」。票据上单独一个"拾"会被认为可被添加数字。' },
            { left: '壹佰元零角零分', right: '应为「壹佰元整」。没有角分时只写"整"，不要补零角零分。' },
            { left: '壹仟零零伍元', right: '应为「壹仟零伍元整」。连续零只写一个。' },
            { left: '壹万伍仟元', right: '规范写法为「壹万伍仟元整」，结尾的"整"不能省。' },
            { left: '用"二"代替"贰"', right: '票据必须用大写"贰"，"二"属于小写，属于无效书写。' },
            { left: '大写与小写不一致', right: '以大写为准，但银行通常直接退票。填写后务必逐位核对一次。' },
          ],
        },
        {
          heading: '实际填写流程',
          paragraphs: [
            '先在草稿上算清金额，确认分位（不要四舍五入到角），再转换大写，最后和小写并排核对一遍。支票上的大写金额要紧接"人民币"字样书写，中间不留空格，防止插入字符。',
            '如果是批量报销或财务报表，建议用工具批量转换后抽查几笔，比逐笔手写更不容易出错。',
          ],
        },
      ],
    },
    en: {
      title: 'How to write Chinese capital amounts on financial documents',
      description: 'Cheques and invoices in China require an uppercase Chinese amount. Here are the five rules, the character table, and the six mistakes that get documents rejected.',
      excerpt: 'Arabic numerals can be altered with a single stroke — 1 becomes 7, 3 becomes 8. Chinese capital numerals cannot. That is the entire reason cheques carry both forms, and why the rules for writing them are so specific.',
      body: [
        {
          heading: 'Why the capital form exists',
          paragraphs: [
            'An Arabic digit is trivially altered: add a stroke to 1 and it reads 7, adjust 3 and it reads 8. Capital Chinese numerals have dense strokes that cannot be edited without leaving obvious traces, so cheques, drafts, invoices, receipts, and expense claims must carry both the numeric and the capital amount.',
            'When the two disagree, Chinese banking practice and the negotiable instruments law treat the capital amount as authoritative. A miswritten capital amount does not make the document untidy — it makes it invalid.',
          ],
        },
        {
          heading: 'Character reference',
          compare: [
            { left: 'Digits 0-9', right: '零 壹 贰 叁 肆 伍 陆 柒 捌 玖' },
            { left: 'Place units', right: '拾 佰 仟 万 拾万 佰万 仟万 亿' },
            { left: 'Currency units', right: '元 (or 圆), 角, 分' },
            { left: 'Terminator', right: '整 (or 正), used only when there are no jiao or fen' },
          ],
        },
        {
          heading: 'The five core rules',
          paragraphs: [
            '1. Amounts ending at yuan take 整 (or 正) after 元. 123.00 is 壹佰贰拾叁元整 — never 壹佰贰拾叁元零角零分.',
            '2. With jiao but no fen, the 整 may be omitted. 123.40 is 壹佰贰拾叁元肆角, or 肆角整, but never 零分.',
            '3. With both jiao and fen, write both. 123.45 is 壹佰贰拾叁元肆角伍分.',
            '4. A run of consecutive zeros collapses to a single 零. 1005 is 壹仟零伍元整, not 壹仟零零伍.',
            '5. A leading ten must be written 壹拾. On a cheque, 拾元整 is invalid; write 壹拾元整, and likewise 壹拾贰元.',
          ],
        },
        {
          heading: 'Zeros across section boundaries',
          paragraphs: [
            'Chinese numerals group by four digits under 万 and 亿. When a section ends in zeros and a lower section still has a non-zero digit, a single 零 must mark the gap — otherwise the digits read as adjacent.',
            'For example 100000001 is 壹亿零壹元整: seven zeros sit between the 亿 position and the units, yet only one 零 is written. 100010000 becomes 壹亿零壹万元整.',
            'A practical check: read the number aloud in four-digit groups. Wherever a section has digits but the immediately lower section is entirely zero, insert one 零.',
          ],
          tips: [
            '💡 When in doubt, do not hand-derive the rules — generate the amount with a converter and proofread it. There are only five rules, but the edge cases multiply quickly.',
          ],
        },
        {
          heading: 'Six mistakes that get documents rejected',
          compare: [
            { left: '拾元整', right: 'Must be 壹拾元整. A bare 拾 can be prefixed with another digit.' },
            { left: '壹佰元零角零分', right: 'Must be 壹佰元整. With no jiao or fen, write only 整.' },
            { left: '壹仟零零伍元', right: 'Must be 壹仟零伍元整. Consecutive zeros collapse to one.' },
            { left: '壹万伍仟元', right: 'The standard form is 壹万伍仟元整 — the trailing 整 is mandatory.' },
            { left: 'Using 二 instead of 贰', right: 'Cheques require the capital 贰. 二 is the lowercase form and invalid here.' },
            { left: 'Capital and numeric disagree', right: 'The capital form prevails legally, but banks usually reject the document outright. Proofread both forms digit by digit.' },
          ],
        },
        {
          heading: 'A safe filling procedure',
          paragraphs: [
            'Compute the amount on scratch paper first, confirm the fen digit (never round to jiao), convert to capital form, then compare the two forms side by side. On a cheque, write the capital amount immediately after 人民币 with no gaps, so nothing can be inserted.',
            'For batch expense reports or financial statements, convert in bulk and spot-check a few entries. It is far less error-prone than writing each one by hand.',
          ],
        },
      ],
    },
  },

  // -------------------- 23. JWT 结构与验签 --------------------
  {
    slug: 'jwt-decode-verify',
    date: '2026-11-11',
    tags: ['JWT', '鉴权', '调试'],
    toolKeys: ['crypto/jwt', 'crypto/hmac'],
    zh: {
      title: 'JWT 三段结构与「Signature verification failed」排查',
      description: 'JWT 的 header、payload、signature 各是什么，为什么能解码却不能验证，以及签名校验失败的 8 个真实原因。',
      excerpt: 'JWT 报错时最危险的做法是把 payload 解出来看看，然后以为"token 是对的"。解码不需要密钥，验证才需要——这两件事混在一起，是绝大多数鉴权故障的起点。',
      body: [
        {
          heading: '三段结构：两个点号切三块',
          paragraphs: [
            '一个 JWT 长这样：header.payload.signature。三段都用 Base64url 编码（把标准 Base64 的 + 换成 -、/ 换成 _、去掉尾部 =），所以能安全放进 URL 和 Header。',
            'header 声明算法（alg）和类型（typ），通常是 {"alg":"HS256","typ":"JWT"}。payload 放声明（claims），如 sub、exp、iat、role。signature 是对"header.payload"这段原文用密钥计算结果。',
            '注意 signature 签的是编码后的前两段字符串本身，不是解码后的 JSON 对象。所以哪怕重新序列化 JSON 时属性顺序变了，签名也会失效。',
          ],
          code: [
            {
              lang: 'javascript',
              code: `const [h, p, s] = token.split('.')

// Base64url 还原成标准 Base64 才能用 atob
const b64 = s2 => s2.replace(/-/g, '+').replace(/_/g, '/')

const header = JSON.parse(atob(b64(h)))
const payload = JSON.parse(atob(b64(p)))
// 解码 payload 不需要任何密钥 —— 所以它不能存放敏感信息`,
            },
          ],
        },
        {
          heading: '能解码不等于能验证',
          paragraphs: [
            '这是 JWT 最容易误解的地方：任何人都能读出 payload 的内容，包括用户 ID、角色、邮箱。所以 JWT 里绝不能放密码、身份证号或任何敏感信息。',
            '签名的作用不是隐藏内容，而是证明内容没被改过。验证方用服务端保存的密钥重算签名并比对，一致才认。',
          ],
          tips: [
            '⚠️ 不要因为"解出来看着对"就提交问题给后端。payload 正确但签名错误，是攻击者最容易伪造出来的状态。',
          ],
        },
        {
          heading: '签名校验失败的 8 个原因',
          compare: [
            { left: '1. 密钥不一致', right: '签发与验证用了不同的 secret。多环境部署时最常见：测试环境签的 token 拿到生产验证。' },
            { left: '2. 密钥编码方式不同', right: '一方把 secret 当 UTF-8 字符串，另一方当 Base64 解码后的字节。先统一成字节再算 HMAC。' },
            { left: '3. 算法不匹配', right: 'header 写 HS256，验证方按 RS256 校验。alg 必须由验证方白名单决定，不能信任 header 里的值。' },
            { left: '4. token 被截断或换行', right: '复制粘贴时中间断行，或 HTTP Header 里带了引号、Bearer 前缀。签名段少一个字符必然失败。' },
            { left: '5. 时钟偏移导致过期', right: 'exp 已过。容器时间未同步时，签发方和验证方差几分钟就会误判。加 30-60 秒 leeway。' },
            { left: '6. 重新序列化后验签', right: '把 payload 解成对象、改字段、再 stringify 拼回去验签，属性顺序或空格变了，签名必然不匹配。' },
            { left: '7. 把公钥当私钥用', right: 'RS256 用私钥签、公钥验。反过来或传错文件，报 invalid signature。' },
            { left: '8. 密钥里有隐藏字符', right: '从文档复制密钥时带了尾随空格或 CRLF，肉眼完全看不出来。用长度和哈希核对。' },
          ],
        },
        {
          heading: '在线工具能做什么、不能做什么',
          paragraphs: [
            '解码三段、查看过期时间、格式化 claims，这些都可以完全在浏览器里做，不需要联网也不需要密钥。',
            '签名验证必须由你主动提供密钥。工具拿不到你的服务端密钥，所以默认只能展示签名段内容，不会替你判断真伪——任何声称"自动验证"的在线服务都要慎重，那意味着你要把密钥交出去。',
          ],
          tips: [
            '💡 排查顺序建议：先确认 exp 没过期 → 再确认 alg 是否符合预期 → 最后才怀疑密钥。前两项五分钟就能排除，密钥问题往往要半小时。',
          ],
        },
      ],
    },
    en: {
      title: 'JWT structure and debugging "Signature verification failed"',
      description: 'What the header, payload, and signature actually contain, why decoding is not verification, and the eight real causes of a failing signature check.',
      excerpt: 'The most dangerous habit when a JWT fails is to decode the payload, see plausible values, and conclude the token is fine. Decoding needs no key; verification does. Conflating the two is where most auth incidents begin.',
      body: [
        {
          heading: 'Three parts, split by two dots',
          paragraphs: [
            'A JWT looks like header.payload.signature. All three segments are Base64url encoded — standard Base64 with + replaced by -, / by _, and trailing = stripped — so the result can travel safely in URLs and headers.',
            'The header declares the algorithm and type, typically {"alg":"HS256","typ":"JWT"}. The payload carries claims such as sub, exp, iat, and role. The signature is computed over the encoded "header.payload" string using a key.',
            'Crucially, the signature covers the encoded segments as text, not the decoded JSON objects. Re-serializing the payload with different key order or spacing invalidates the signature.',
          ],
          code: [
            {
              lang: 'javascript',
              code: `const [h, p, s] = token.split('.')

// Base64url must be converted back before atob
const b64 = s2 => s2.replace(/-/g, '+').replace(/_/g, '/')

const header = JSON.parse(atob(b64(h)))
const payload = JSON.parse(atob(b64(p)))
// Decoding the payload needs no key — which is why it must never hold secrets`,
            },
          ],
        },
        {
          heading: 'Decoding is not verification',
          paragraphs: [
            'This is the most common misconception: anyone can read the payload, including user IDs, roles, and email addresses. Never put passwords, ID numbers, or other sensitive data in a JWT.',
            'The signature does not hide content — it proves the content was not altered. The verifier recomputes it with a server-side key and compares; only a match counts.',
          ],
          tips: [
            '⚠️ Do not report "the token looks correct" just because the payload decodes. A valid-looking payload with a broken signature is exactly the state an attacker can forge.',
          ],
        },
        {
          heading: 'Eight reasons a signature check fails',
          compare: [
            { left: '1. Different keys', right: 'Signing and verifying used different secrets — most often a token minted in staging and checked in production.' },
            { left: '2. Different key encoding', right: 'One side treats the secret as UTF-8 text, the other as Base64-decoded bytes. Agree on bytes before computing the HMAC.' },
            { left: '3. Algorithm mismatch', right: 'The header says HS256 while the verifier uses RS256. The verifier must enforce an algorithm allowlist, never trust header alg.' },
            { left: '4. Truncated or wrapped token', right: 'A line break from copy-paste, or stray quotes and a Bearer prefix inside the header. One missing character breaks the signature.' },
            { left: '5. Clock skew', right: 'exp has passed. Containers without NTP sync can disagree by minutes. Allow 30-60 seconds of leeway.' },
            { left: '6. Verifying after re-serialization', right: 'Decoding the payload, editing a field, and stringifying it back changes ordering or whitespace, so the signature cannot match.' },
            { left: '7. Public and private key swapped', right: 'RS256 signs with the private key and verifies with the public one. Reversing them or loading the wrong file reports invalid signature.' },
            { left: '8. Invisible characters in the key', right: 'A trailing space or CRLF pasted from documentation is invisible. Compare key length and hash instead of eyeballing it.' },
          ],
        },
        {
          heading: 'What an online tool can and cannot do',
          paragraphs: [
            'Decoding the three segments, reading expiry, and pretty-printing claims can all happen entirely in the browser, with no network and no key.',
            'Signature verification requires you to supply the key. A tool cannot reach your server secret, so by default it only displays the signature — it cannot judge authenticity. Treat any service claiming automatic verification with suspicion: it means handing over your key.',
          ],
          tips: [
            '💡 Debug in this order: confirm exp has not passed, confirm alg matches expectations, and only then suspect the key. The first two take five minutes; key problems take half an hour.',
          ],
        },
      ],
    },
  },

  // -------------------- 24. RSA 密钥格式 --------------------
  {
    slug: 'rsa-key-formats',
    date: '2026-11-11',
    tags: ['RSA', '证书', '调试'],
    toolKeys: ['crypto/rsa'],
    zh: {
      title: 'RSA 密钥格式对照：PEM、DER、PKCS#1、PKCS#8 到底怎么选',
      description: '-----BEGIN 后面那一行决定了密钥格式。搞清楚 PKCS#1 与 PKCS#8、PEM 与 DER、公钥与私钥的对应关系，配置证书不再靠猜。',
      excerpt: '同一个 RSA 私钥可以有四种以上的字节表示。你从控制台复制出来的和代码里期望的格式不一致时，报错通常是"invalid key"或者一段看不懂的 ASN.1 解析异常。',
      body: [
        {
          heading: '先分清两个维度',
          paragraphs: [
            '维度一：编码方式。PEM 是 Base64 文本，带 -----BEGIN ...----- 头和尾；DER 是原始二进制。二者内容可以互转，PEM 只是把 DER 做了 Base64 并加了标注。',
            '维度二：数据结构标准。PKCS#1 专门描述 RSA 密钥（RSAPrivateKey / RSAPublicKey）；PKCS#8 描述"任意算法"的私钥（PrivateKeyInfo）；公钥则常用 X.509 SubjectPublicKeyInfo。',
            '所以完整的格式名其实是两个维度组合出来的，比如"PEM 编码的 PKCS#8 私钥"。',
          ],
        },
        {
          heading: '看首尾标记就知道是什么',
          compare: [
            { left: 'BEGIN RSA PRIVATE KEY', right: 'PEM + PKCS#1 私钥。OpenSSL 的经典格式，很多老系统只认这个。' },
            { left: 'BEGIN PRIVATE KEY', right: 'PEM + PKCS#8 私钥（未加密）。Java、Go、Node 新版本默认输出这个。' },
            { left: 'BEGIN ENCRYPTED PRIVATE KEY', right: 'PEM + PKCS#8 加密私钥，需要口令才能解开。' },
            { left: 'BEGIN PUBLIC KEY', right: 'PEM + X.509 公钥（SubjectPublicKeyInfo）。' },
            { left: 'BEGIN RSA PUBLIC KEY', right: 'PEM + PKCS#1 公钥。注意和上面只差一个 RSA 字样，但结构完全不同。' },
            { left: 'BEGIN CERTIFICATE', right: '不是密钥，是 X.509 证书。公钥需要从证书里提取。' },
          ],
          tips: [
            '⚠️ "BEGIN RSA PUBLIC KEY" 与 "BEGIN PUBLIC KEY" 混用是最常见的踩坑点：前者是 PKCS#1，后者是 X.509。把 PKCS#1 公钥喂给只认 X.509 的库，会报 ASN.1 解析失败。',
          ],
        },
        {
          heading: '格式转换命令',
          code: [
            {
              lang: 'bash',
              code: `# PKCS#1 私钥 -> PKCS#8 私钥
openssl pkcs8 -topk8 -nocrypt -in rsa.key -out pkcs8.key

# PKCS#8 私钥 -> PKCS#1 私钥
openssl rsa -in pkcs8.key -traditional -out rsa.key

# 从私钥导出公钥（X.509 格式）
openssl rsa -in rsa.key -pubout -out public.pem

# 从私钥导出公钥（PKCS#1 格式，注意 -RSAPublicKey_out）
openssl rsa -in rsa.key -RSAPublicKey_out -out public_pkcs1.pem

# PEM <-> DER
openssl rsa -in rsa.key -outform DER -out rsa.der
openssl rsa -inform DER -in rsa.der -out rsa.pem

# 查看密钥内容（确认位数与模数）
openssl rsa -in rsa.key -text -noout`,
            },
          ],
          paragraphs: [
            '旧版 OpenSSL 的 rsa 命令默认输出 PKCS#1，OpenSSL 3 起改成了 PKCS#8，并保留了 -traditional 开关回到旧行为。这就是"同一台机器上生成的密钥换了系统就用不了"的原因。',
          ],
        },
        {
          heading: '开发语言与默认格式',
          compare: [
            { left: 'Java (KeyPairGenerator)', right: '默认导出 PKCS#8（私钥）与 X.509（公钥）。读 PKCS#1 私钥需要借助 BouncyCastle。' },
            { left: 'Node.js / crypto', right: 'createPrivateKey 同时支持 PEM 与 DER，但要明确传 type: pkcs1 还是 pkcs8。' },
            { left: 'Go (crypto/x509)', right: '解析用 ParsePKCS1PrivateKey 或 ParsePKCS8PrivateKey，函数名不同，传错格式直接 panic。' },
            { left: 'Python (cryptography)', right: 'load_pem_private_key 能自动识别两种结构，是最宽容的实现。' },
            { left: 'Spring / Tomcat', right: 'keystore 用 JKS 或 PKCS#12，需要先从 PEM 转成 PKCS#12 再导入。' },
          ],
        },
        {
          heading: '标准化检查流程',
          paragraphs: [
            '第一步，看首尾标记，确定是 PKCS#1 还是 PKCS#8、公钥还是私钥。第二步，确认编码是 PEM 还是 DER——文本能看到横线就是 PEM。第三步，确认位数：2048 位是当前下限，3072 位更稳妥，1024 位已不安全。',
            '第四步，用代码实际加载一次，不要只看文件大小。加载成功后再比较导出的模数（modulus）和指数（exponent）是否与对方一致，这能排除"密钥配对错了"这类隐蔽问题。',
          ],
          tips: [
            '💡 不要把密钥直接贴进在线工具。如果确实需要比对内容，只贴公钥或密钥的模数片段。本站 RSA 工具用于生成密钥对与演示加解密，不会上传你的私钥。',
          ],
        },
      ],
    },
    en: {
      title: 'RSA key formats explained: PEM, DER, PKCS#1, PKCS#8',
      description: 'The line after -----BEGIN decides everything. Learn how PKCS#1 and PKCS#8, PEM and DER, public and private keys relate, so certificate setup stops being guesswork.',
      excerpt: 'A single RSA private key has at least four common byte representations. When what you copied from a console does not match what your code expects, the error is usually "invalid key" or an unreadable ASN.1 parse failure.',
      body: [
        {
          heading: 'Two independent dimensions',
          paragraphs: [
            'Dimension one is encoding. PEM is Base64 text wrapped in -----BEGIN ...----- markers; DER is raw binary. They convert into each other — PEM is simply DER, Base64 encoded, with labels.',
            'Dimension two is structure. PKCS#1 describes RSA keys specifically (RSAPrivateKey / RSAPublicKey). PKCS#8 describes a private key for any algorithm (PrivateKeyInfo). Public keys commonly use X.509 SubjectPublicKeyInfo.',
            'A complete format name is therefore a combination, such as "PEM-encoded PKCS#8 private key".',
          ],
        },
        {
          heading: 'Read the header line',
          compare: [
            { left: 'BEGIN RSA PRIVATE KEY', right: 'PEM + PKCS#1 private key. The classic OpenSSL format many legacy systems require.' },
            { left: 'BEGIN PRIVATE KEY', right: 'PEM + PKCS#8 private key, unencrypted. The default output in modern Java, Go, and Node.' },
            { left: 'BEGIN ENCRYPTED PRIVATE KEY', right: 'PEM + encrypted PKCS#8, requiring a passphrase.' },
            { left: 'BEGIN PUBLIC KEY', right: 'PEM + X.509 public key (SubjectPublicKeyInfo).' },
            { left: 'BEGIN RSA PUBLIC KEY', right: 'PEM + PKCS#1 public key. Nearly identical label, completely different structure.' },
            { left: 'BEGIN CERTIFICATE', right: 'Not a key at all — an X.509 certificate. The public key must be extracted from it.' },
          ],
          tips: [
            '⚠️ Confusing "BEGIN RSA PUBLIC KEY" with "BEGIN PUBLIC KEY" is the single most common failure: the first is PKCS#1, the second X.509. Feed PKCS#1 to a library expecting X.509 and you get an ASN.1 parse error.',
          ],
        },
        {
          heading: 'Conversion commands',
          code: [
            {
              lang: 'bash',
              code: `# PKCS#1 private -> PKCS#8 private
openssl pkcs8 -topk8 -nocrypt -in rsa.key -out pkcs8.key

# PKCS#8 private -> PKCS#1 private
openssl rsa -in pkcs8.key -traditional -out rsa.key

# Public key as X.509
openssl rsa -in rsa.key -pubout -out public.pem

# Public key as PKCS#1 (note -RSAPublicKey_out)
openssl rsa -in rsa.key -RSAPublicKey_out -out public_pkcs1.pem

# PEM <-> DER
openssl rsa -in rsa.key -outform DER -out rsa.der
openssl rsa -inform DER -in rsa.der -out rsa.pem

# Inspect key size and modulus
openssl rsa -in rsa.key -text -noout`,
            },
          ],
          paragraphs: [
            'Older OpenSSL emitted PKCS#1 by default, while OpenSSL 3 emits PKCS#8 and keeps -traditional for the old behaviour. That is why a key generated on one machine suddenly fails on another.',
          ],
        },
        {
          heading: 'Defaults by language',
          compare: [
            { left: 'Java (KeyPairGenerator)', right: 'Exports PKCS#8 private keys and X.509 public keys. Reading PKCS#1 requires BouncyCastle.' },
            { left: 'Node.js crypto', right: 'createPrivateKey accepts both PEM and DER, but you must state type: pkcs1 or pkcs8.' },
            { left: 'Go (crypto/x509)', right: 'ParsePKCS1PrivateKey and ParsePKCS8PrivateKey are separate functions; the wrong one panics.' },
            { left: 'Python (cryptography)', right: 'load_pem_private_key auto-detects both structures — the most forgiving implementation.' },
            { left: 'Spring / Tomcat', right: 'Keystores use JKS or PKCS#12, so convert PEM to PKCS#12 before importing.' },
          ],
        },
        {
          heading: 'A standard check procedure',
          paragraphs: [
            'First, read the header labels to identify PKCS#1 versus PKCS#8 and public versus private. Second, confirm the encoding — visible dashes mean PEM. Third, confirm key size: 2048 bits is the current floor, 3072 is safer, and 1024 is no longer acceptable.',
            'Fourth, actually load the key in code rather than trusting the file size. Once it loads, compare the exported modulus and exponent against the peer. That catches the subtle case of mismatched key pairs.',
          ],
          tips: [
            '💡 Never paste a private key into an online tool. If you must compare contents, share only the public key or a fragment of the modulus. Qiuyun\'s RSA tool generates key pairs and demonstrates encryption locally, without uploading your key.',
          ],
        },
      ],
    },
  },

  // -------------------- 25. 二维码容错级别 --------------------
  {
    slug: 'qrcode-error-correction',
    date: '2026-11-11',
    tags: ['二维码', '设计', '实践'],
    toolKeys: ['image/qrcode-generate', 'image/qrcode-parse'],
    zh: {
      title: '二维码容错级别怎么选？L、M、Q、H 的实际差别',
      description: 'L 约 7%、M 约 15%、Q 约 25%、H 约 30%，但这四个数字该对应什么场景？还有最小可扫尺寸、颜色对比和常见扫不出的原因。',
      excerpt: '二维码的容错级别不是"越高越好"。级别越高，能容纳的数据越少、码点越密，在同样物理尺寸下反而更难扫。选级别本质上是在"抗污损"和"易识别"之间做权衡。',
      body: [
        {
          heading: '四个级别到底差什么',
          paragraphs: [
            'Reed-Solomon 纠错让二维码即使被遮挡一部分仍能还原。L 能恢复约 7% 的码字，M 约 15%，Q 约 25%，H 约 30%。',
            '但纠错码本身要占空间。同样一段内容，用 H 级别生成的二维码模块数量比 L 多得多，也就更密。密到一定程度，印刷精度或屏幕像素不够，就扫不出来。',
          ],
          compare: [
            { left: 'L（7%）', right: '追求最小尺寸或最大数据量。适合电子屏幕、近距离扫描、内容很长的场景。' },
            { left: 'M（15%）', right: '默认推荐值。印刷物料、普通海报、名片都能用，兼顾容量与容错。' },
            { left: 'Q（25%）', right: '码面上要放 logo，或印刷环境一般、可能磨损时使用。' },
            { left: 'H（30%）', right: '重度遮挡、工业环境、需要嵌较大 logo 时使用。代价是码点最大。' },
          ],
        },
        {
          heading: '最小可扫尺寸怎么定',
          paragraphs: [
            '经验公式：印刷品的二维码边长至少 2 厘米，且每 1 米扫描距离对应至少 1 厘米边长。也就是说 3 米外扫描，码至少要 3 厘米见方。',
            '更准确的算法是按"模块数"算：一个模块（最小黑白方块）的印刷边长不应小于 0.4 毫米。所以尺寸下限 = 模块数 × 0.4mm。二维码版本越高、容错级别越高，模块数越多，所需物理尺寸就越大。',
            '四周的留白（quiet zone）至少保留 4 个模块宽度。这个区域被裁掉或被背景图案侵占，是"看起来没问题但扫不出来"最常见的原因。',
          ],
          tips: [
            '💡 生成后务必用两种设备实测：一台 iPhone、一台安卓中低端机。不同解码库对低对比度和密度的容忍度差异很大。',
          ],
        },
        {
          heading: '颜色与对比度',
          paragraphs: [
            '二维码识别依赖亮度差，不是颜色差。深色前景 + 浅色背景才有效，反过来（浅码深底）部分解码器直接失败。',
            '对比度建议不低于 4.5:1，和正文可读性标准一致。深蓝配白、黑色配米白都是安全选择。红色前景是常见错误——红色在多数摄像头传感器的亮度通道里偏暗，扫描成功率明显下降。',
            '如果需要品牌色，把颜色用在前景，背景保持纯白或接近白，不要给背景加渐变或纹理。',
          ],
          compare: [
            { left: '黑码白底', right: '最稳，任何设备都能扫。印刷品首选。' },
            { left: '深蓝码白底', right: '安全，适合品牌化设计，对比度足够。' },
            { left: '白码深底', right: '部分解码器失败，除非场景明确支持反色，否则不要用。' },
            { left: '红码白底', right: '亮度通道偏暗，中低端安卓机识别率明显下降。' },
            { left: '低对比度灰码', right: '屏幕亮度不足或印刷偏色时直接失效。' },
          ],
        },
        {
          heading: '扫不出来的 6 个原因',
          compare: [
            { left: '留白被裁掉', right: 'quiet zone 不足 4 个模块。生成时不要裁边，排版时不要贴边。' },
            { left: '码点太密', right: '内容太长又用了高容错级别。缩短内容（比如用短链）或降到 M。' },
            { left: '尺寸太小', right: '按"模块数 × 0.4mm"重算所需物理尺寸。' },
            { left: '印在曲面上', right: '杯子、包装袋的弧度会拉伸码点。曲面场景要留更大冗余，用 Q 或 H。' },
            { left: '屏幕亮度低', right: '电子屏显示时调高亮度，并避免在强反光环境下扫描。' },
            { left: '内容编码不标准', right: '同一段中文用 UTF-8 与 GBK 编码生成的码，解码结果不同。统一用 UTF-8。' },
          ],
        },
        {
          heading: '生成之后的验收流程',
          paragraphs: [
            '先扫一遍确认内容正确，再用截图工具把二维码缩小到实际印刷尺寸再扫一次——在屏幕上放大看很清楚，缩到 2 厘米可能就失效了。',
            '如果二维码里放的是链接，务必用短链或直接减少参数。URL 每多 10 个字符，模块数就会上一个台阶，密度问题往往就是这么来的。',
          ],
        },
      ],
    },
    en: {
      title: 'QR code error correction levels: what L, M, Q and H really mean',
      description: 'L recovers about 7%, M 15%, Q 25%, H 30% — but which do you need? Plus minimum scannable size, contrast rules, and six reasons a code will not scan.',
      excerpt: 'A higher error correction level is not automatically better. More correction means fewer data bits and denser modules, which at the same physical size makes a code harder to scan. Choosing a level is a trade-off between damage tolerance and legibility.',
      body: [
        {
          heading: 'What the four levels actually change',
          paragraphs: [
            'Reed-Solomon correction lets a QR code survive partial damage. Level L recovers roughly 7% of codewords, M about 15%, Q about 25%, and H about 30%.',
            'But the correction data takes space. For identical content, an H-level code has far more modules than an L-level one, so it is denser. Past a point, print resolution or screen pixels are no longer sufficient and scanning fails.',
          ],
          compare: [
            { left: 'L (7%)', right: 'For the smallest size or maximum data. Good on screens, at close range, with long content.' },
            { left: 'M (15%)', right: 'The sensible default. Works for print, posters, and business cards, balancing capacity and tolerance.' },
            { left: 'Q (25%)', right: 'Use when a logo sits in the middle, or when print quality and wear are uncertain.' },
            { left: 'H (30%)', right: 'Heavy occlusion, industrial settings, or a large embedded logo. Costs you the densest modules.' },
          ],
        },
        {
          heading: 'Minimum scannable size',
          paragraphs: [
            'Rule of thumb: printed codes should be at least 2 cm per side, and roughly 1 cm of side length per metre of scanning distance. Scanning from 3 metres needs a code at least 3 cm across.',
            'A more precise method works in modules: the smallest black square should print no smaller than 0.4 mm. So minimum size equals module count times 0.4 mm. Higher versions and higher correction levels mean more modules and therefore a larger physical code.',
            'Keep the quiet zone at least four modules wide. Cropping it, or letting background artwork intrude, is the most common cause of a code that looks fine but will not scan.',
          ],
          tips: [
            '💡 Always test on two devices: an iPhone and a mid-range Android phone. Decoder libraries differ significantly in tolerance for low contrast and high density.',
          ],
        },
        {
          heading: 'Colour and contrast',
          paragraphs: [
            'QR decoding depends on luminance difference, not colour difference. Dark foreground on light background works; the inverse fails on many decoders.',
            'Aim for contrast of at least 4.5:1, the same threshold used for body text legibility. Dark blue on white and black on off-white are safe. Red foregrounds are a classic mistake — red is dark in the luminance channel most sensors use, and scan rates drop noticeably.',
            'If you need brand colour, apply it to the foreground and keep the background white or near-white. Never add gradients or textures behind the code.',
          ],
          compare: [
            { left: 'Black on white', right: 'The most reliable choice. Any device will read it. Best for print.' },
            { left: 'Dark blue on white', right: 'Safe and brandable, with ample contrast.' },
            { left: 'Light code on dark', right: 'Fails on many decoders. Avoid unless the medium explicitly supports inversion.' },
            { left: 'Red on white', right: 'Dark in the luminance channel, so mid-range Android devices struggle.' },
            { left: 'Low-contrast grey', right: 'Fails outright when screen brightness is low or print colour drifts.' },
          ],
        },
        {
          heading: 'Six reasons a code will not scan',
          compare: [
            { left: 'Quiet zone cropped', right: 'Fewer than four modules of margin. Do not trim the generated image, and do not place it flush against other elements.' },
            { left: 'Modules too dense', right: 'Long content plus a high correction level. Shorten the content, for example with a short link, or drop to M.' },
            { left: 'Physically too small', right: 'Recalculate using module count times 0.4 mm.' },
            { left: 'Printed on a curve', right: 'Curved surfaces on cups and packaging stretch modules. Allow extra margin and use Q or H.' },
            { left: 'Low screen brightness', right: 'Raise brightness when displaying on a screen, and avoid scanning under strong glare.' },
            { left: 'Non-standard text encoding', right: 'The same Chinese text encoded as UTF-8 or GBK produces different decoded results. Standardise on UTF-8.' },
          ],
        },
        {
          heading: 'Acceptance checklist',
          paragraphs: [
            'Scan once to confirm the content, then shrink a screenshot to the real print size and scan again. A code that is crisp when enlarged on screen can fail at 2 cm.',
            'If the code holds a URL, shorten it or strip parameters. Every ten extra characters pushes the module count up a level, and density problems almost always start there.',
          ],
        },
      ],
    },
  },

  // -------------------- 26. Favicon 尺寸 --------------------
  {
    slug: 'favicon-sizes-2026',
    date: '2026-11-11',
    tags: ['前端', '图标', '清单'],
    toolKeys: ['frontend/favicon'],
    zh: {
      title: 'Favicon 要生成哪些尺寸？2026 完整清单',
      description: 'favicon.ico、SVG 图标、apple-touch-icon、PWA manifest 的 192 与 512——每个尺寸各自服务谁，哪些可以省，HTML 怎么写。',
      excerpt: '十年前一个 16×16 的 favicon.ico 就够了。现在浏览器标签页、iOS 桌面图标、安卓主屏、Windows 磁贴、深色模式各要一套，漏一个就会在某个端上出现白底方块。',
      body: [
        {
          heading: '为什么现在要好几个文件',
          paragraphs: [
            '不同平台各自定义了自己的图标规范，且互不兼容。桌面浏览器读 link rel="icon"，iOS 只认 apple-touch-icon，Android 通过 Web App Manifest 取图标，Windows 早期还要 browserconfig.xml。',
            '没有一个尺寸能同时满足所有场景：16×16 适合标签页，180×180 适合 iOS 主屏，512×512 用于 PWA 安装和部分应用商店收录。',
          ],
        },
        {
          heading: '最小可用清单',
          compare: [
            { left: 'favicon.ico（内含 16/32/48）', right: '兼容老浏览器和直接访问 /favicon.ico 的请求。建议保留，成本极低。' },
            { left: 'icon.svg', right: '现代浏览器首选，矢量无级缩放，还能用 media 查询适配深色模式。' },
            { left: 'apple-touch-icon.png 180×180', right: 'iOS 添加到主屏用。必须不透明，圆角由系统裁切。' },
            { left: 'manifest 192×192 + 512×512', right: 'Android 与 PWA 安装必需。512 也用于应用商店与部分聚合页面。' },
            { left: 'maskable 图标', right: 'Android 自适应图标需要。不带 maskable 时，系统会自己裁切导致边缘被切掉。' },
          ],
        },
        {
          heading: 'HTML 怎么写',
          code: [
            {
              lang: 'html',
              code: `<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`,
            },
          ],
          paragraphs: [
            '顺序有讲究：SVG 放在 ico 之后，支持 SVG 的浏览器会用后者覆盖前者，不支持的则回退到 ico。',
            '不需要再写 shortcut icon，现代浏览器已把 rel="icon" 作为标准写法。',
          ],
        },
        {
          heading: '制作时的四个注意点',
          paragraphs: [
            '透明背景只适合 ico 与 svg。apple-touch-icon 和 maskable 图标必须是实底，否则 iOS 会填成黑色，Android 会填成白色。',
            'maskable 图标要有安全区：内容放在中心 80% 的圆形范围内，四周留边，因为系统可能按圆形、方形或水滴形裁切。',
            '小尺寸要单独设计。把 512×512 的复杂 logo 直接缩到 16×16 会糊成一团，16 与 32 尺寸建议只保留最核心的轮廓。',
            '文件名带哈希或用查询参数会导致缓存失效问题；不带哈希时又要主动控制 Cache-Control，否则换了图标用户半年看不到。',
          ],
          tips: [
            '💡 深色模式适配可以在 SVG 里写 prefers-color-scheme 媒体查询，把深色背景下的图标换成浅色版本，避免"深色图标消失在深色标签栏"。',
          ],
        },
        {
          heading: '常见故障对照',
          compare: [
            { left: '标签页显示默认地球图标', right: 'HTML 里 link 的路径写错，或文件被 robots/服务器规则拦截。直接访问图标 URL 验证。' },
            { left: 'iOS 主屏图标是白底方块', right: 'apple-touch-icon 带了透明通道，或尺寸不是正方形。' },
            { left: 'Android 图标被裁掉一角', right: '缺少 maskable 版本，系统按默认安全区裁切了普通图标。' },
            { left: '换了图标不生效', right: 'favicon 缓存极顽固。换文件名或加版本参数，别指望强制刷新。' },
            { left: '深色模式下看不清', right: '图标是深色描边无背景。提供深色变体或加深色底。' },
          ],
        },
      ],
    },
    en: {
      title: 'Which favicon sizes do you actually need in 2026?',
      description: 'favicon.ico, an SVG icon, apple-touch-icon, and the manifest 192 and 512 — who each one serves, which you can skip, and the exact HTML.',
      excerpt: 'A single 16x16 favicon.ico was enough a decade ago. Today browser tabs, iOS home screens, Android launchers, Windows tiles, and dark mode each want their own file. Miss one and some platform shows a blank square.',
      body: [
        {
          heading: 'Why one file is no longer enough',
          paragraphs: [
            'Each platform defines its own icon convention and they do not interoperate. Desktop browsers read link rel="icon", iOS only honours apple-touch-icon, Android pulls icons from the Web App Manifest, and older Windows setups wanted browserconfig.xml.',
            'No single size covers everything: 16x16 suits tabs, 180x180 suits the iOS home screen, and 512x512 is used for PWA installation and some app directories.',
          ],
        },
        {
          heading: 'The minimum viable set',
          compare: [
            { left: 'favicon.ico (16/32/48 inside)', right: 'Covers legacy browsers and direct requests to /favicon.ico. Keep it — the cost is negligible.' },
            { left: 'icon.svg', right: 'The modern first choice: vector, infinitely scalable, and able to adapt to dark mode via media queries.' },
            { left: 'apple-touch-icon.png 180x180', right: 'Used when adding to an iOS home screen. Must be opaque; iOS applies the rounded corners.' },
            { left: 'manifest 192x192 + 512x512', right: 'Required for Android and PWA install. The 512 is also used by app directories.' },
            { left: 'maskable icon', right: 'Needed for Android adaptive icons. Without it, the system crops a normal icon and clips its edges.' },
          ],
        },
        {
          heading: 'The HTML',
          code: [
            {
              lang: 'html',
              code: `<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`,
            },
          ],
          paragraphs: [
            'Order matters: put the SVG after the ico so SVG-capable browsers override it, while the rest fall back to the ico.',
            'There is no need for shortcut icon any more — rel="icon" is the standard form.',
          ],
        },
        {
          heading: 'Four production notes',
          paragraphs: [
            'Transparency only belongs in ico and svg. apple-touch-icon and maskable icons must have a solid background, or iOS fills it black and Android fills it white.',
            'Maskable icons need a safe zone: keep artwork inside the central 80% circle, because the system may crop to a circle, a squircle, or a teardrop.',
            'Design the small sizes separately. Shrinking a detailed 512x512 logo to 16x16 produces mush — at 16 and 32 keep only the essential silhouette.',
            'Hashed filenames avoid stale caches; without a hash you must set Cache-Control deliberately, otherwise users can see the old icon for months.',
          ],
          tips: [
            '💡 In an SVG you can add a prefers-color-scheme media query to swap in a light variant, so a dark icon does not vanish into a dark tab bar.',
          ],
        },
        {
          heading: 'Troubleshooting',
          compare: [
            { left: 'Default globe in the tab', right: 'The link path is wrong, or the file is blocked by robots or server rules. Open the icon URL directly to check.' },
            { left: 'White square on iOS', right: 'apple-touch-icon has an alpha channel, or is not square.' },
            { left: 'Clipped corner on Android', right: 'No maskable variant, so the system cropped a normal icon using its default safe zone.' },
            { left: 'New icon not showing', right: 'Favicon caching is notoriously sticky. Rename the file or add a version query — do not rely on a hard refresh.' },
            { left: 'Invisible in dark mode', right: 'A dark outline with no background. Ship a dark variant or add a dark plate.' },
          ],
        },
      ],
    },
  },

  // -------------------- 27. Flexbox 布局配方 --------------------
  {
    slug: 'flexbox-layout-recipes',
    date: '2026-11-11',
    tags: ['CSS', '布局', '前端'],
    toolKeys: ['frontend/flex-box'],
    zh: {
      title: 'Flexbox 布局配方：居中、等高、两栏自适应、导航栏',
      description: '六个可以直接抄的 Flexbox 配方，加上 flex:1 与 width 的冲突、min-width:0 文本溢出、gap 与 margin 的选择这些真实踩坑点。',
      excerpt: 'Flexbox 只有十来个属性，但真正决定布局的常常是那两三个。与其背属性表，不如记住六个高频配方的写法，遇到新需求再拼装。',
      body: [
        {
          heading: '先分清主轴和交叉轴',
          paragraphs: [
            'display: flex 之后，主轴方向由 flex-direction 决定（默认 row，横向）。justify-content 控制主轴上的排列，align-items 控制交叉轴上的对齐。这两个属性搞混，是 90% 的"为什么不居中"问题。',
            '当 flex-direction: column 时，主轴变成纵向，justify-content 就管垂直方向了。记住这一点，就不用死记"横向用哪个、纵向用哪个"。',
          ],
        },
        {
          heading: '配方一：水平垂直居中',
          code: [
            {
              lang: 'css',
              code: `.center {
  display: flex;
  justify-content: center; /* 主轴居中 */
  align-items: center;     /* 交叉轴居中 */
  min-height: 100vh;
}`,
            },
          ],
          paragraphs: [
            '这是目前最短的居中写法，比绝对定位加 transform 更稳，不需要知道子元素尺寸。注意父元素必须有高度，否则 align-items 无处可居中。',
          ],
        },
        {
          heading: '配方二：两栏自适应（侧栏固定 + 主区撑满）',
          code: [
            {
              lang: 'css',
              code: `.layout {
  display: flex;
  gap: 24px;
}

.sidebar {
  flex: 0 0 240px; /* 不放大、不缩小、基准 240px */
}

.main {
  flex: 1 1 0;
  min-width: 0;    /* 关键：允许内容收缩，避免长单词撑破布局 */
}`,
            },
          ],
          paragraphs: [
            'min-width: 0 这一行经常被漏掉。Flex 子项默认 min-width: auto，遇到长 URL、长英文单词或 nowrap 文本时，会拒绝收缩并把整个布局顶宽，出现横向滚动条。',
            'flex: 1 是 flex: 1 1 0% 的简写，基准宽度为 0，所以主区会严格按剩余空间分配；如果想以内容宽度为起点，用 flex: 1 1 auto。',
          ],
        },
        {
          heading: '配方三：等高列与卡片底部对齐',
          paragraphs: [
            'Flex 容器里的子项默认 stretch 拉伸到容器高度，所以等高列是免费得到的——只要不加 align-items: flex-start。',
            '卡片内部常见需求是"标题高度不一，但按钮都贴底"。做法是卡片本身 display: flex、flex-direction: column，然后让中间内容 flex: 1，按钮自然被推到底部。',
          ],
          code: [
            {
              lang: 'css',
              code: `.card {
  display: flex;
  flex-direction: column;
}

.card__body {
  flex: 1; /* 吸收多余高度，把 footer 推到底 */
}`,
            },
          ],
        },
        {
          heading: '配方四：导航栏两端对齐',
          code: [
            {
              lang: 'css',
              code: `.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.navbar__links {
  display: flex;
  gap: 12px;
  margin-left: auto; /* 备选方案：把这一组推到右边 */
}`,
            },
          ],
          paragraphs: [
            '只有两组元素时用 space-between 最直观；三组以上（logo、菜单、操作区）时，把需要右对齐的那组加 margin-left: auto 更可控。',
          ],
        },
        {
          heading: '常见坑对照',
          compare: [
            { left: 'flex: 1 之后宽度不生效', right: 'flex-basis 为 0 会覆盖 width。要保留宽度基准就写 flex: 1 1 auto。' },
            { left: '长文本撑破容器', right: '子项缺 min-width: 0（纵向布局则是 min-height: 0）。' },
            { left: 'space-between 最后一行只一个元素', right: '换行布局用 gap 替代 margin，或改 grid。flex 的 space-between 会让末行元素贴两端。' },
            { left: '用 margin 做间距', right: '统一用 gap，避免首尾元素多出边距需要 :first-child / :last-child 清除。' },
            { left: '子项设了 width 却被压缩', right: '默认 flex-shrink: 1。要禁止压缩就写 flex-shrink: 0。' },
            { left: '百分比高度失效', right: '父级没有确定高度时，百分比无法计算。链路上每一层都要有高度。' },
          ],
        },
        {
          heading: '什么时候该换 Grid',
          paragraphs: [
            '一维排列（一行或一列）用 Flexbox；二维网格、需要按行列同时对齐、或需要"卡片自动填充换行且列宽一致"时，grid + auto-fill 会少写很多代码。',
            '两者不是替代关系：常见的页面结构是 Grid 搭外层骨架，Flexbox 处理每个区块内部的排列。',
          ],
        },
      ],
    },
    en: {
      title: 'Flexbox recipes: centring, equal height, two columns, navbar',
      description: 'Six copy-paste Flexbox layouts, plus the real gotchas: flex:1 versus width, min-width:0 text overflow, and gap versus margin.',
      excerpt: 'Flexbox has a dozen properties, but a layout usually hinges on two or three. Instead of memorising the property table, learn six recurring recipes and compose from there.',
      body: [
        {
          heading: 'Main axis versus cross axis',
          paragraphs: [
            'After display: flex, flex-direction decides the main axis (row by default, horizontal). justify-content arranges items along that axis; align-items aligns them on the cross axis. Mixing these two up causes most "why is it not centred" moments.',
            'Switch to flex-direction: column and the main axis becomes vertical, so justify-content now handles vertical placement. Understand that and you never have to memorise which property is "horizontal".',
          ],
        },
        {
          heading: 'Recipe 1: perfect centring',
          code: [
            {
              lang: 'css',
              code: `.center {
  display: flex;
  justify-content: center; /* main axis */
  align-items: center;     /* cross axis */
  min-height: 100vh;
}`,
            },
          ],
          paragraphs: [
            'This is the shortest centring there is and it beats absolute positioning plus transform, because it does not need to know the child size. The parent must have a height, though, or align-items has nothing to centre within.',
          ],
        },
        {
          heading: 'Recipe 2: fixed sidebar plus fluid main',
          code: [
            {
              lang: 'css',
              code: `.layout {
  display: flex;
  gap: 24px;
}

.sidebar {
  flex: 0 0 240px; /* no grow, no shrink, 240px basis */
}

.main {
  flex: 1 1 0;
  min-width: 0;    /* critical: lets content shrink instead of blowing out the layout */
}`,
            },
          ],
          paragraphs: [
            'min-width: 0 is the line people forget. Flex items default to min-width: auto, so a long URL, a long English word, or nowrap text refuses to shrink and pushes the whole layout wider, producing a horizontal scrollbar.',
            'flex: 1 is shorthand for flex: 1 1 0%, meaning a zero basis, so the main column divides the leftover space strictly. Use flex: 1 1 auto if you want content width as the starting point.',
          ],
        },
        {
          heading: 'Recipe 3: equal-height columns and pinned card footers',
          paragraphs: [
            'Flex children stretch to the container height by default, so equal-height columns come free — as long as you do not add align-items: flex-start.',
            'Inside a card the common need is buttons that sit at the bottom even when titles wrap differently. Make the card a column flex container and let the body take flex: 1, which pushes the footer down.',
          ],
          code: [
            {
              lang: 'css',
              code: `.card {
  display: flex;
  flex-direction: column;
}

.card__body {
  flex: 1; /* absorbs extra height, pushing the footer down */
}`,
            },
          ],
        },
        {
          heading: 'Recipe 4: navbar with ends aligned',
          code: [
            {
              lang: 'css',
              code: `.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.navbar__links {
  display: flex;
  gap: 12px;
  margin-left: auto; /* alternative: push this group to the right */
}`,
            },
          ],
          paragraphs: [
            'With exactly two groups, space-between is the clearest. With three or more — logo, menu, actions — add margin-left: auto to the group that should right-align; it stays predictable.',
          ],
        },
        {
          heading: 'Gotchas',
          compare: [
            { left: 'width ignored after flex: 1', right: 'A zero flex-basis overrides width. Use flex: 1 1 auto to keep width as the basis.' },
            { left: 'Long text blows out the container', right: 'The child is missing min-width: 0 (or min-height: 0 in a column layout).' },
            { left: 'space-between with a lone last row', right: 'In wrapped layouts use gap instead of margin, or switch to grid. Flex space-between pins the last row apart.' },
            { left: 'Using margin for spacing', right: 'Use gap consistently, so the first and last items do not need :first-child and :last-child clean-up.' },
            { left: 'Child with width gets squashed', right: 'flex-shrink defaults to 1. Set flex-shrink: 0 to forbid shrinking.' },
            { left: 'Percentage heights collapse', right: 'A percentage cannot resolve against an auto-height parent. Every level in the chain needs a height.' },
          ],
        },
        {
          heading: 'When to switch to Grid',
          paragraphs: [
            'Use Flexbox for one-dimensional arrangement. Reach for grid when you need two-dimensional alignment, or auto-filling cards with equal column widths — grid plus auto-fill saves a lot of code there.',
            'The two are complementary: a typical page uses Grid for the outer skeleton and Flexbox inside each region.',
          ],
        },
      ],
    },
  },

  // -------------------- 28. 中文字数统计 --------------------
  {
    slug: 'word-count-chinese',
    date: '2026-11-11',
    tags: ['文本', '写作', '统计'],
    toolKeys: ['text/word-count'],
    zh: {
      title: '中文字数怎么算？标点、空格、论文字数的统计口径',
      description: '字符数、字数、词数三者差别在哪，标点算不算，论文与公众号的字数要求为什么对不上，以及怎么快速核对。',
      excerpt: '"这篇多少字"这个问题没有唯一答案：Word 给一个数，公众号后台给另一个，学校查重系统又是第三个。差别不在工具，而在统计口径。',
      body: [
        {
          heading: '三种口径，三个数字',
          compare: [
            { left: '字符数（含空格）', right: '每个汉字、字母、数字、标点、空格都算 1。最"大"的数字，常用于数据库字段长度限制。' },
            { left: '字符数（不含空格）', right: '去掉空格与换行。Word 的"字符数（不计空格）"就是这一项。' },
            { left: '字数', right: '中文按字、英文按词。Word 的"字数"会把一个英文单词算 1，一个汉字也算 1。' },
            { left: '词数', right: '英文写作的 words 概念，中文没有天然对应，通常按分词结果统计。' },
          ],
        },
        {
          heading: '为什么 Word 和公众号的数字不一样',
          paragraphs: [
            '公众号后台统计的是"字符数"，并且常把标点计入。Word 的"字数"对中英文混排的折算方式又不同：连续的英文单词算一个，中文逐字计数。',
            '所以同一篇文章，Word 显示 2000 字，公众号后台可能显示 2400 字——不是谁算错了，是分母不同。投稿或交作业前，一定要先问清对方用的是哪个口径。',
          ],
          tips: [
            '💡 论文投稿通常要求"字符数（不计空格）"或"字数"，且参考文献、摘要是否计入各刊规定不同。以投稿系统的实时计数为准。',
          ],
        },
        {
          heading: '标点算不算',
          paragraphs: [
            '中文写作里标点通常计入字符数，但不计入"纯字数"。公众号、稿费结算多按含标点的字符数；翻译报价常按源文字符数；学校作文要求一般按含标点的格子数。',
            '英文写作里标点一般不计入 words，但计入 characters。这一点在中英对照的表格里最容易看错。',
          ],
        },
        {
          heading: '中英混排怎么算',
          paragraphs: [
            '常见规则是"中文逐字 + 英文逐词"。例如"使用 React 构建界面"算 4 个中文 + 1 个英文词 = 5 字。但有的系统把 React 按 5 个字符算，结果差 4。',
            '数字也有歧义：2026 算 1 个词还是 4 个字符？金额 1,234.56 里的逗号和小数点算不算？批量统计前先在工具里试一段样例，确认口径再上线。',
          ],
        },
        {
          heading: '代码与技术文档',
          paragraphs: [
            '代码块的字数几乎没有参考价值——一个变量名可能被算成 1 个词，也可能按字符逐个计。技术文档的字数要求通常指正文散文部分，代码与表格单独排除。',
            '如果要做"阅读时长"，中文按每分钟 300-500 字估算，英文按每分钟 200-250 词。技术内容要再下调三成，因为阅读速度明显更慢。',
          ],
        },
        {
          heading: '怎么核对',
          paragraphs: [
            '先用工具同时看四个数字：总字符数、不计空格字符数、中文字数、英文词数。四个数字都拿到，再对照要求挑对应的那一个，就不会出现"我明明数够了"的争议。',
            '长文建议分段统计再相加，比一次性粘贴更不容易因为特殊字符导致偏差，也便于定位到具体段落做删改。',
          ],
          compare: [
            { left: '公众号 / 稿费', right: '通常看含标点的字符数。' },
            { left: '论文 / 作业', right: '看"字数"或"字符数（不计空格）"，参考文献是否计入需查投稿须知。' },
            { left: '翻译报价', right: '按源文含空格字符数或按词数，取决于合同。' },
            { left: '数据库字段', right: '看字符数上限，注意 UTF-8 下中文占 3 字节，varchar 长度与实际字数不同。' },
          ],
        },
      ],
    },
    en: {
      title: 'How Chinese word counts work: characters, words, punctuation',
      description: 'Character count, word count, and token-like counts disagree by design. What each includes, why Word and a publishing platform differ, and how to verify.',
      excerpt: 'There is no single answer to "how long is this piece". Word reports one number, a publishing dashboard another, and a plagiarism checker a third. The tools are not wrong — the counting rules differ.',
      body: [
        {
          heading: 'Three counts, three numbers',
          compare: [
            { left: 'Characters with spaces', right: 'Every Han character, letter, digit, punctuation mark, and space counts as one. The largest number; commonly used for field length limits.' },
            { left: 'Characters without spaces', right: 'Spaces and line breaks removed. This is what Word labels "characters (no spaces)".' },
            { left: 'Word count', right: 'Chinese counted per character, English per word. Word treats one English word as 1 and one Han character as 1.' },
            { left: 'Words', right: 'The English notion of words. Chinese has no natural equivalent and requires segmentation.' },
          ],
        },
        {
          heading: 'Why Word and a publishing platform disagree',
          paragraphs: [
            'A publishing dashboard usually counts characters, punctuation included. Word folds mixed Chinese and English differently: a run of English letters counts as one word while Chinese counts per character.',
            'So the same article can read 2000 in Word and 2400 in a dashboard. Neither is broken — the denominator differs. Before submitting, confirm which rule the recipient uses.',
          ],
          tips: [
            '💡 Journal submissions usually specify "characters without spaces" or "word count", and each journal decides separately whether references and abstracts count. Trust the live counter in the submission system.',
          ],
        },
        {
          heading: 'Does punctuation count',
          paragraphs: [
            'In Chinese, punctuation is normally included in character counts but excluded from a pure character tally. Payments per character and most article budgets use characters including punctuation; translation quotes often use source characters.',
            'In English, punctuation is excluded from words but included in characters. Mixed bilingual tables are where this gets misread most often.',
          ],
        },
        {
          heading: 'Mixed Chinese and English',
          paragraphs: [
            'The usual rule is "count Han characters individually plus English words". "使用 React 构建界面" is four Han characters plus one English word, so five. Some systems instead count React as five characters, a difference of four.',
            'Numbers are equally ambiguous: is 2026 one word or four characters? Do the comma and period in 1,234.56 count? Test a sample in the tool before you standardise a batch.',
          ],
        },
        {
          heading: 'Code and technical documentation',
          paragraphs: [
            'Word counts for code blocks carry almost no meaning — a variable name might count as one word or as many characters. Technical word limits usually target prose, with code and tables excluded.',
            'For reading time, estimate 300-500 Chinese characters per minute, or 200-250 English words per minute. Cut that by roughly a third for technical content, which reads noticeably slower.',
          ],
        },
        {
          heading: 'How to verify',
          paragraphs: [
            'Check four numbers at once: total characters, characters without spaces, Chinese characters, and English words. With all four in hand, pick the one the requirement names and the "I clearly hit the limit" argument disappears.',
            'For long documents, count section by section and sum. It is less sensitive to odd characters than one large paste, and it tells you which section to trim.',
          ],
          compare: [
            { left: 'Publishing and per-character pay', right: 'Usually characters including punctuation.' },
            { left: 'Papers and assignments', right: 'Word count or characters without spaces; check the submission guide for references.' },
            { left: 'Translation quotes', right: 'Source characters with spaces, or words — depends on the contract.' },
            { left: 'Database columns', right: 'Character limits apply, but UTF-8 uses three bytes per Han character, so varchar length is not the same as character count.' },
          ],
        },
      ],
    },
  },

  // -------------------- 29. YAML vs JSON --------------------
  {
    slug: 'yaml-vs-json',
    date: '2026-11-11',
    tags: ['YAML', 'JSON', '配置'],
    toolKeys: ['dev/yaml-json', 'dev/yaml-properties'],
    zh: {
      title: 'YAML 与 JSON 的区别，以及互转时最容易丢的东西',
      description: 'YAML 更适合人写，JSON 更适合机器传。互转时会丢注释、展开锚点、把日期变成字符串、把 yes 变成 true。附对照表和规避方法。',
      excerpt: '把 YAML 转成 JSON 再转回来，文件往往看起来"差不多但不一样"：注释没了、锚点被展开、缩进风格变了，某些值甚至悄悄改了类型。这不是工具的问题，是两种格式表达能力不对等。',
      body: [
        {
          heading: '设计目标不同',
          paragraphs: [
            'JSON 是为数据交换设计的：语法极少、解析器容易实现、无歧义。代价是冗长——每个键都要加引号，不能有注释，不能有尾逗号。',
            'YAML 是为人类书写设计的：靠缩进表达层级，支持注释、锚点、多文档。代价是隐式类型推断，写错一个空格含义就全变。',
          ],
        },
        {
          heading: '语法对照',
          compare: [
            { left: '层级表达', right: 'JSON 用 { } 和 [ ]；YAML 用缩进（空格，不能用 Tab）。' },
            { left: '字符串引号', right: 'JSON 必须双引号；YAML 通常可省略，但含特殊字符时必须加引号。' },
            { left: '注释', right: 'JSON 标准不支持（JSONC 才有）；YAML 用 # 到行尾。' },
            { left: '多文档', right: 'JSON 一个文件一个值；YAML 用 --- 分隔多个文档。' },
            { left: '引用复用', right: 'JSON 只能重复写；YAML 用 &anchor 定义、*alias 引用、<< 合并。' },
          ],
        },
        {
          heading: '互转时的六个坑',
          compare: [
            { left: '注释全部丢失', right: 'JSON 没有注释概念，转过去就没了。往返转换无法恢复，配置文件要保留一份 YAML 原件。' },
            { left: '锚点与合并被展开', right: '&defaults 和 << 会变成重复的完整对象，文件变长且失去复用关系。' },
            { left: '日期被当成字符串', right: 'YAML 里 2026-11-11 是日期类型，转 JSON 变成 "2026-11-11" 字符串，再转回 YAML 可能加引号。' },
            { left: 'yes / no / on / off 变布尔值', right: 'YAML 1.1 把这些当 true / false。版本号 1.10 也可能被解析成数字 1.1。' },
            { left: '前导零与科学计数', right: '0123 可能被解析成八进制或字符串；1e3 在 YAML 里是字符串、在 JSON 里是数字 1000。' },
            { left: '键顺序不保证', right: 'JSON 对象无序，某些实现会重排键。依赖顺序的场景（如优先级列表）要用数组。' },
          ],
          tips: [
            '⚠️ YAML 里 "NO" 作为国家代码 Norway 是老梗：它会被解析成布尔 false。凡是可能被推断成布尔的字符串，一律加引号。',
          ],
        },
        {
          heading: '缩进是最大的雷',
          paragraphs: [
            'YAML 只允许空格缩进，混入 Tab 会直接解析失败，而编辑器里 Tab 和空格看起来可能一模一样。建议开启编辑器的"显示空白字符"。',
            '同一层级必须缩进相同数量空格。列表项下的嵌套层级比列表符号多两格即可，不必对齐到文字。缩进多少不重要，"一致"才重要。',
          ],
          code: [
            {
              lang: 'yaml',
              code: `service:
  name: api
  ports:
    - 8080
    - 8081
  env: &defaults
    LOG_LEVEL: info
  replicas: 2

worker:
  env:
    <<: *defaults
    QUEUE: jobs`,
            },
          ],
        },
        {
          heading: '同一个配置的两种写法',
          code: [
            {
              lang: 'json',
              code: `{
  "service": {
    "name": "api",
    "ports": [8080, 8081],
    "env": { "LOG_LEVEL": "info" },
    "replicas": 2
  }
}`,
            },
          ],
          paragraphs: [
            '注意 YAML 版本的 &defaults 与 <<: *defaults 在 JSON 里无法表达，只能把整个 env 对象重复一遍。这就是"转过去再转回来文件变长"的直接原因。',
          ],
        },
        {
          heading: '什么时候用哪个',
          compare: [
            { left: 'K8s / CI / Docker Compose', right: 'YAML。这些生态的规范就是 YAML，换成 JSON 虽然能用但不符合惯例。' },
            { left: 'API 请求与响应', right: 'JSON。解析器无处不在，且不会因为一个空格出错。' },
            { left: '需要注释的配置文件', right: 'YAML、TOML 或 JSONC。纯 JSON 只能靠文档说明。' },
            { left: '程序生成的数据', right: 'JSON。机器生成不需要可读性，而且能避免隐式类型推断。' },
            { left: 'Java 项目的 application 配置', right: 'properties 更简单，但嵌套结构会变得非常长；YAML 更清晰。互转时注意数组与嵌套键的映射规则。' },
          ],
        },
      ],
    },
    en: {
      title: 'YAML versus JSON, and what gets lost in conversion',
      description: 'YAML is for humans, JSON for machines. Converting loses comments, expands anchors, turns dates into strings, and silently retypes yes as true.',
      excerpt: 'Convert YAML to JSON and back and the file looks almost the same but is not: comments gone, anchors expanded, indentation restyled, and a few values quietly changed type. That is not a tool bug — the two formats simply do not have equal expressive power.',
      body: [
        {
          heading: 'Different design goals',
          paragraphs: [
            'JSON was designed for data interchange: a tiny grammar, trivial parsers, no ambiguity. The cost is verbosity — every key quoted, no comments, no trailing commas.',
            'YAML was designed for humans to write: indentation expresses nesting, with comments, anchors, and multi-document files. The cost is implicit typing, where one wrong space changes the meaning.',
          ],
        },
        {
          heading: 'Syntax comparison',
          compare: [
            { left: 'Nesting', right: 'JSON uses { } and [ ]; YAML uses indentation (spaces, never tabs).' },
            { left: 'String quotes', right: 'JSON requires double quotes; YAML often omits them, but special characters force quoting.' },
            { left: 'Comments', right: 'Not in the JSON standard (only JSONC); YAML uses # to end of line.' },
            { left: 'Multiple documents', right: 'One JSON file holds one value; YAML separates documents with ---.' },
            { left: 'Reuse', right: 'JSON repeats itself; YAML offers &anchor, *alias, and << merge keys.' },
          ],
        },
        {
          heading: 'Six traps in conversion',
          compare: [
            { left: 'All comments vanish', right: 'JSON has no comment concept, so they are gone for good. Keep the YAML original; a round trip cannot restore them.' },
            { left: 'Anchors expand', right: '&defaults and << become duplicated full objects — longer files that lose the reuse relationship.' },
            { left: 'Dates become strings', right: 'In YAML 2026-11-11 is a date; in JSON it becomes "2026-11-11", and converting back may add quotes.' },
            { left: 'yes / no / on / off become booleans', right: 'YAML 1.1 treats them as true and false. A version like 1.10 can even be read as the number 1.1.' },
            { left: 'Leading zeros and exponents', right: '0123 may parse as octal or a string; 1e3 is a string in YAML but the number 1000 in JSON.' },
            { left: 'Key order is not guaranteed', right: 'JSON objects are unordered and some implementations reorder keys. Use arrays where order carries meaning.' },
          ],
          tips: [
            '⚠️ The classic YAML joke: "NO" as the Norway country code parses as boolean false. Quote any string that could be inferred as a boolean.',
          ],
        },
        {
          heading: 'Indentation is the biggest hazard',
          paragraphs: [
            'YAML permits spaces only. A single tab breaks parsing, and in many editors tabs and spaces look identical. Turn on visible whitespace.',
            'Siblings must use the same number of spaces. Nested content under a list item only needs to be indented past the dash. The absolute width does not matter — consistency does.',
          ],
          code: [
            {
              lang: 'yaml',
              code: `service:
  name: api
  ports:
    - 8080
    - 8081
  env: &defaults
    LOG_LEVEL: info
  replicas: 2

worker:
  env:
    <<: *defaults
    QUEUE: jobs`,
            },
          ],
        },
        {
          heading: 'The same config, two ways',
          code: [
            {
              lang: 'json',
              code: `{
  "service": {
    "name": "api",
    "ports": [8080, 8081],
    "env": { "LOG_LEVEL": "info" },
    "replicas": 2
  }
}`,
            },
          ],
          paragraphs: [
            'Notice that &defaults and <<: *defaults have no JSON equivalent — the env object must be written out in full. That is exactly why a round trip produces a longer file.',
          ],
        },
        {
          heading: 'Which to use',
          compare: [
            { left: 'Kubernetes, CI, Docker Compose', right: 'YAML. These ecosystems standardised on it; JSON works but fights convention.' },
            { left: 'API requests and responses', right: 'JSON. Parsers are everywhere and a stray space cannot break it.' },
            { left: 'Config that needs comments', right: 'YAML, TOML, or JSONC. Plain JSON leaves documentation to separate files.' },
            { left: 'Machine-generated data', right: 'JSON. Generated output needs no readability and avoids implicit typing.' },
            { left: 'Java application config', right: 'Properties is simpler but gets extremely long with nesting; YAML reads better. Watch the array and nested-key mapping rules when converting.' },
          ],
        },
      ],
    },
  },
]

// ============ 查询函数 ============

export function getGuideArticle(slug: string, locale: string): GuideArticle | null {
  return guideArticles.find(a => a.slug === slug) || null
}

export function getGuideBody(article: GuideArticle, locale: string): GuideSection[] {
  const lang: GuideLang = locale.startsWith('zh') ? 'zh' : 'en'
  return article[lang].body
}

export function getGuideMeta(article: GuideArticle, locale: string) {
  const lang: GuideLang = locale.startsWith('zh') ? 'zh' : 'en'
  return article[lang]
}
