/**
 * 工具页正文内容（介绍段落 + FAQ）
 *
 * 只维护中文与英文两份，其他语言回退英文，避免 14 份文案同步成本。
 * 由 ToolContentSection.vue 在工具面板下方渲染，并自动注入 FAQ JSON-LD。
 * 未配置内容的工具不会输出任何额外 HTML（SEO 层面不产生负面影响）。
 */

export type ToolContentLang = 'zh' | 'en'

export interface ToolFAQ {
  q: string
  a: string
}

export interface ToolContentDoc {
  intro: string[]
  faq: ToolFAQ[]
}

// ============ 10 个主力工具 ============
// key 与 tools.ts 里的 `categories/<cat>/tools/<id>` 一致
export const toolContents: Record<string, Record<ToolContentLang, ToolContentDoc>> = {
  // ---- dev/json-formatter ----
  'dev/json-formatter': {
    zh: {
      intro: [
        'JSON 格式化器是开发者日常最常用的工具之一。一行压缩的 JSON 字符串可以瞬间展开、对齐、加上缩进，让嵌套结构一目了然。它同时提供校验——粘贴一段文本进来，立刻能知道括号配对是否正确、字符串是否闭合、逗号是否多余。',
        '本站的 JSON 格式化器完全在浏览器内运行，所有解析、缩进和压缩操作都不会把你的数据发送到任何服务器。对于包含敏感信息（接口响应、Token、内部数据结构）的 JSON，这一点尤为重要。',
        '除了格式化，它还支持一键压缩——把带换行和缩进的美化版 JSON 还原成单行紧凑格式，方便作为接口请求体或存入数据库时节省空间。',
      ],
      faq: [
        { q: '格式化和压缩有什么区别？', a: '格式化是给 JSON 加缩进和换行，便于人眼阅读；压缩是去掉所有空白字符，体积最小、适合机器传输。两者互为逆操作，你可以在同一页面随意切换。' },
        { q: '为什么我的 JSON 格式化时报错？', a: '常见原因：最后一个属性后面多了逗号、键名没加双引号、字符串里有未转义的换行符、或者粘贴进来的根本不是 JSON（比如用了 JavaScript 对象字面量）。错误信息会告诉你具体是哪一行哪一列出问题。' },
        { q: '这个工具会保存我粘贴的 JSON 吗？', a: '不会。本站是纯前端工具站，浏览器把 JSON 解析和渲染完之后，关闭页面或刷新就从内存里释放了。不做任何服务端持久化。' },
        { q: '支持多少大小的 JSON？', a: '取决于你的浏览器内存。通常几 MB 的 JSON 可以瞬间处理，几十 MB 也没问题，但几百 MB 以上建议拆分后再格式化。' },
      ],
    },
    en: {
      intro: [
        'A JSON formatter is one of the most-used developer tools out there. Paste in a single-line, minified JSON string and it instantly expands it with proper indentation so nested structures are easy to read. It also validates as you go — you know immediately if braces are balanced, strings are closed, or there is a stray comma.',
        'This formatter runs entirely in your browser. Every parse, indent, and compression happens locally, so your JSON never leaves your device. That matters when the payload contains sensitive data such as API responses, tokens, or internal data structures.',
        'Alongside formatting, the tool offers one-click compression that strips all whitespace — useful when you need the smallest possible body for an HTTP request or when storing JSON in a database.',
      ],
      faq: [
        { q: 'What is the difference between format and compress?', a: 'Format adds indentation and line breaks so humans can read it. Compress strips every whitespace character to produce the smallest valid JSON, best for machine-to-machine transfer. You can switch back and forth on the same page.' },
        { q: 'Why does my JSON fail to format?', a: 'Typical causes: a trailing comma after the last property, an unquoted key, an unescaped newline inside a string, or pasting something that is not valid JSON at all (e.g. a JavaScript object literal). The error message points to the exact line and column.' },
        { q: 'Does this tool store the JSON I paste?', a: 'No. Qiuyun Tools is a purely front-end tool site. Once your browser finishes parsing and rendering the JSON, the data is freed from memory when you close or refresh the page. Nothing is persisted on a server.' },
        { q: 'How large can my JSON be?', a: 'Limited by your browser memory. A few megabytes formats instantly, tens of megabytes work fine, but anything over a hundred megabytes should probably be split first.' },
      ],
    },
  },

  // ---- crypto/base64 ----
  'crypto/base64': {
    zh: {
      intro: [
        'Base64 是一种把任意二进制数据转成 ASCII 字符串的编码方式，在邮件附件、Data URL、JWT Token、图片内嵌等场景无处不在。它的代价是体积会膨胀约 33%——每 3 字节变成 4 个可打印字符。',
        '本站的 Base64 编解码器同时支持中文（UTF-8）输入和输出，自动处理编码转换，不会出现乱码。编码和解码是两个独立面板，支持实时转换，边输入边看到结果。',
        '需要注意：Base64 只是编码不是加密。它不提供任何机密性，不能替代密码或 HTTPS。',
      ],
      faq: [
        { q: 'Base64 和加密有什么区别？', a: 'Base64 是编码，目的是让二进制数据在只允许 ASCII 的通道里传输（比如 HTTP 请求头、邮件正文）。任何人都能解码。如果需要保密，要用 AES、RSA 等真正的加密算法。' },
        { q: '为什么编码中文会乱码？', a: '很多在线 Base64 工具内部用 Latin-1 编码，遇到多字节字符（中文、日文）就会乱码。本站统一使用 UTF-8 转换，中文和 emoji 都能正确编解码。' },
        { q: '编码后体积为什么变大？', a: 'Base64 每 24 位（3 字节）转成 32 位（4 个 ASCII 字符），所以体积固定膨胀 4/3 ≈ 33%。尾部不足 3 字节时会用 "=" 填充，最多补两个。' },
        { q: '怎么把一张图片转成 Data URL？', a: '图片二进制 → Base64 编码 → 前面加上 "data:image/png;base64,"（PNG 为例）。本站的"图片转 Base64"工具一键完成，不需要手动拼接前缀。' },
      ],
    },
    en: {
      intro: [
        'Base64 is a way to convert arbitrary binary data into an ASCII string. It shows up in email attachments, Data URLs, JWT tokens, inline images, and many other places. The trade-off is size: the output grows by roughly 33% — every 3 bytes becomes 4 printable characters.',
        'Qiuyun\'s Base64 tool handles UTF-8 text in both directions, so Chinese, Japanese, and emoji work without mojibake. Encoding and decoding live in two separate panels that convert in real time as you type.',
        'One important note: Base64 is encoding, not encryption. It provides no confidentiality and is never a substitute for a password or HTTPS.',
      ],
      faq: [
        { q: 'How is Base64 different from encryption?', a: 'Base64 is encoding — its sole purpose is to make binary data survive ASCII-only channels such as HTTP headers or email bodies. Anyone can decode it. If you need secrecy, use a real encryption algorithm like AES or RSA instead.' },
        { q: 'Why does Chinese text get garbled after encoding?', a: 'Many online Base64 tools use Latin-1 internally, which breaks on multi-byte characters. This tool always converts through UTF-8, so CJK text and emoji encode and decode correctly.' },
        { q: 'Why does the output get bigger?', a: 'Base64 maps every 24 bits (3 bytes) to 32 bits (4 ASCII characters), so size grows by exactly 4/3 ≈ 33%. When the input is not a multiple of 3 bytes the remaining bytes are padded with "=", up to two characters.' },
        { q: 'How do I turn an image into a Data URL?', a: 'Image bytes → Base64 encode → prepend "data:image/png;base64," (for PNG). Qiuyun has a dedicated Image-to-Base64 tool that does the whole thing in one click — no manual prefix needed.' },
      ],
    },
  },

  // ---- crypto/url-codec ----
  'crypto/url-codec': {
    zh: {
      intro: [
        'URL 编码（也叫百分号编码）把 URL 中不允许出现或有特殊含义的字符替换成 %XX 形式。空格变成 %20，中文变成 %E4%B8%AD%E6%96%87，+ 号、=、& 等在查询字符串里有意义的字符也必须转义。',
        '这是写前端接口、构造 GET 参数、解析 OAuth 回调时最常遇到的需求。本站支持 encodeURI / encodeURIComponent 两种模式——前者保留协议和路径，后者转义更彻底，适合拼接查询参数。',
        '和 Base64 一样，URL 编码只是转义，不是加密。任何人都能解码还原原文。',
      ],
      faq: [
        { q: 'encodeURI 和 encodeURIComponent 有什么不同？', a: 'encodeURI 只转义 URL 里真正不允许的字符，保留 : / ? = & 等结构字符，适合整条 URL。encodeURIComponent 会把这些结构字符也转义，适合只编码一个参数值。' },
        { q: '空格为什么有时是 + 有时是 %20？', a: '+ 是 HTML 表单 application/x-www-form-urlencoded 的历史约定；标准 URL 编码统一用 %20。本站用 %20 输出，保持和浏览器原生行为一致。' },
        { q: 'JSON 字符串能直接放进 URL 参数吗？', a: '不能。双引号、大括号、冒号都会破坏 URL 结构。必须先对整个 JSON 字符串做 encodeURIComponent，后端再 urldecode + JSON.parse。' },
        { q: '这个工具会保存我编码的内容吗？', a: '不会。编码和解码都是纯前端运算，数据不会离开浏览器。刷新页面后从内存清除。' },
      ],
    },
    en: {
      intro: [
        'URL encoding (percent-encoding) replaces characters that are disallowed or have special meaning in a URL with %XX sequences. A space becomes %20, Chinese text becomes %E4%B8%AD%E6%96%87, and characters like +, =, & — which have meaning inside query strings — must also be escaped.',
        'This comes up constantly when building front-end APIs, constructing GET parameters, or parsing OAuth callbacks. Qiuyun offers both encodeURI and encodeURIComponent modes — the first keeps the scheme and path intact, the second escapes everything and is what you want when building query-string values.',
        'Like Base64, URL encoding is escaping, not encryption. Anyone can decode it back to the original text.',
      ],
      faq: [
        { q: 'What is the difference between encodeURI and encodeURIComponent?', a: 'encodeURI only escapes characters that are genuinely disallowed in a URL, leaving structural characters like : / ? = & alone — good for a full URL. encodeURIComponent escapes those structural characters too, which is exactly what you need for a single parameter value.' },
        { q: 'Why is space sometimes + and sometimes %20?', a: 'The + comes from the historical HTML form encoding application/x-www-form-urlencoded. Standard URL encoding uses %20. Qiuyun always emits %20, matching native browser behavior.' },
        { q: 'Can I put a JSON string directly in a URL parameter?', a: 'No. Double quotes, braces, and colons break the URL structure. Always run the entire JSON string through encodeURIComponent, then urldecode and JSON.parse on the server side.' },
        { q: 'Does this tool store what I type?', a: 'No. Encoding and decoding run entirely in the browser. Nothing leaves your device and everything is cleared from memory when you refresh.' },
      ],
    },
  },

  // ---- dev/timestamp ----
  'dev/timestamp': {
    zh: {
      intro: [
        'Unix 时间戳是从 1970-01-01 00:00:00 UTC 起经过的秒数（或毫秒数）。几乎所有后端日志、数据库、消息队列都用它表示时间，跨语言比较时间方便、序列化 JSON 也轻量。',
        '本站的时间戳转换器同时支持秒级（10 位）和毫秒级（13 位），自动判断格式并转成人类可读日期。支持 UTC 和本地时区双向切换，前端和后端联调时区问题时特别有用。',
        '闰年、闰秒、夏令时切换都考虑到了，输出结果经过 moment.js 兼容验证。',
      ],
      faq: [
        { q: '10 位和 13 位时间戳的区别？', a: '10 位是秒，13 位是毫秒（10 位 × 1000）。JavaScript 的 Date.now() 返回毫秒，Python time.time() 返回秒。本站自动识别，不需要你手动除以或乘以 1000。' },
        { q: '时区切换会影响时间戳本身吗？', a: '不会。时间戳永远是 UTC 的秒数，和时区无关。切换时区只影响"显示成什么日期时间"，不影响时间戳数值。' },
        { q: '2038 年之后怎么办？', a: '32 位有符号整数的时间戳（秒级）在 2038-01-19 会溢出，也就是 Unix Y2K 问题。64 位系统早已修复，本站也支持 64 位时间戳。PHP 5 等老环境才会受影响。' },
        { q: '为什么我看到的时间和同事机器上不一样？', a: '大概率是时区设置不同。先确认你们看的是"时间戳数值"还是"格式化后的日期"——数值相同就是对的，格式化只是展示层差异。' },
      ],
    },
    en: {
      intro: [
        'A Unix timestamp is the number of seconds (or milliseconds) that have elapsed since 1970-01-01 00:00:00 UTC. Almost every backend log, database, and message queue uses it to represent time — it is language-agnostic and serializes beautifully into JSON.',
        'Qiuyun\'s timestamp converter auto-detects 10-digit (seconds) vs 13-digit (milliseconds) input and turns either into a human-readable date. UTC and your local timezone are both supported for round-trip conversion, which is invaluable when you are debugging time-zone mismatches between front-end and back-end.',
        'Leap years, leap seconds, and daylight-saving transitions are all accounted for. Output has been cross-verified against moment.js.',
      ],
      faq: [
        { q: 'What is the difference between a 10-digit and a 13-digit timestamp?', a: '10 digits = seconds, 13 digits = milliseconds (10-digit × 1000). JavaScript Date.now() returns milliseconds; Python time.time() returns seconds. Qiuyun detects the length automatically — no manual divide/multiply needed.' },
        { q: 'Does switching time zones change the timestamp itself?', a: 'No. The timestamp is always seconds since UTC and is time-zone independent. Switching zones only changes how the same instant is displayed, never the numeric value.' },
        { q: 'What happens after 2038?', a: 'A 32-bit signed integer (second precision) overflows on 2038-01-19 — the Unix Y2K problem. All modern 64-bit systems are immune, and Qiuyun handles 64-bit timestamps correctly. Only legacy runtimes like PHP 5 are affected.' },
        { q: 'Why does the time look different on my colleague\'s machine?', a: 'Almost certainly a difference in local time zone. First check whether you are comparing the raw timestamp number or the formatted date — if the numbers match you are both looking at the same instant.' },
      ],
    },
  },

  // ---- crypto/md5 ----
  'crypto/md5': {
    zh: {
      intro: [
        'MD5 是一种 128 位的哈希算法，输出固定 32 个十六进制字符的字符串。它是不可逆的——你不能从 MD5 值反推出原文，但相同输入永远得到相同输出。',
        'MD5 适合做文件完整性校验（下载后比对 MD5 确认没损坏、没被篡改）、去重（相同内容的文件 MD5 相同）、以及密码哈希的历史遗留场景。需要保密的密码场景建议用 bcrypt 或 Argon2 等慢哈希。',
        '本站的 MD5 计算器支持任意长度的文本，UTF-8 输入正确处理，秒级返回结果。',
      ],
      faq: [
        { q: 'MD5 和加密有什么区别？', a: 'MD5 是哈希（单向），加密是双向（密文可以解密回原文）。MD5 不能用来"加密密码"——只要泄露了 MD5 值和字典，彩虹表就能快速反查。密码应该用 bcrypt / Argon2 / PBKDF2 这类慢哈希。' },
        { q: 'MD5 输出里 32 个字符是什么意思？', a: 'MD5 产生 128 位（16 字节）的哈希值，用十六进制表示就是 16 × 2 = 32 个字符。每个字符是 0-9 或 a-f。' },
        { q: '碰撞是什么意思？', a: '碰撞是两个不同的输入产生相同的 MD5 值。2008 年已被证明可以构造碰撞，所以 MD5 不再适合做安全签名（证书、文件签名），但做简单的完整性校验仍然足够。' },
        { q: '和 SHA-1、SHA-256 怎么选？', a: '简单完整性校验 → MD5（快、短）。证书签名、HTTPS、Git commit → SHA-256 或 SHA-3。本站后续会补齐 SHA 系列工具。' },
      ],
    },
    en: {
      intro: [
        'MD5 is a 128-bit hash algorithm that always produces the same fixed-length output: 32 hexadecimal characters. It is one-way — you cannot derive the original text from an MD5 value — but the same input always produces the same output.',
        'MD5 is great for file-integrity verification (compare the downloaded file\'s MD5 against the publisher\'s value to confirm it is unmodified), deduplication (identical files have identical MD5s), and legacy password hashing. For password storage today, use a slow hash like bcrypt or Argon2 instead.',
        'Qiuyun\'s MD5 calculator handles text of any length with correct UTF-8 support and returns instantly.',
      ],
      faq: [
        { q: 'How is MD5 different from encryption?', a: 'MD5 is a hash (one-way); encryption is two-way (the ciphertext can be decrypted back to plaintext). MD5 is never a safe way to "encrypt a password" — leak the MD5 and an attacker with a rainbow table can reverse it quickly. Use bcrypt / Argon2 / PBKDF2 for passwords.' },
        { q: 'Why 32 characters in the MD5 output?', a: 'MD5 produces a 128-bit (16-byte) digest. Written in hex, each byte becomes 2 characters, giving 16 × 2 = 32 characters from the alphabet 0-9 and a-f.' },
        { q: 'What is a collision?', a: 'A collision is two different inputs that produce the same MD5 value. Since 2008 it has been shown how to construct collisions, so MD5 is no longer suitable for security-sensitive signatures (certificates, signed binaries). It is still fine for simple integrity checks.' },
        { q: 'MD5 vs SHA-1 vs SHA-256 — which one should I pick?', a: 'Simple integrity check → MD5 (fast, short output). Anything security-sensitive (certificates, HTTPS, commits) → SHA-256 or SHA-3. We plan to add SHA-family tools to Qiuyun soon.' },
      ],
    },
  },

  // ---- dev/regex-tester ----
  'dev/regex-tester': {
    zh: {
      intro: [
        '正则表达式（Regular Expression）是一种用来匹配文本模式的迷你语言——邮箱、手机号、日期、URL、版本号、HTML 标签都可以用正则描述。写起来难、调试起来更难，这就是正则测试器存在的意义。',
        '本站的正则测试器支持实时匹配，输入正则之后立刻在测试文本里高亮显示所有匹配项。支持 JavaScript 正则的全部语法，包括 g / i / m / s / u / y 标志位切换。',
        '对于复杂正则，推荐先把测试文本拆成多个 case（匹配 / 不匹配都要有），在本站验证通过之后再拷回代码，避免生产环境才发现边界 bug。',
      ],
      faq: [
        { q: '什么是 g / i / m 标志位？', a: 'g = global，匹配所有结果而不是只返回第一个；i = case insensitive，忽略大小写；m = multiline，^ 和 $ 按每行而不是整个字符串定位；s = dotAll，让 . 也匹配换行；u = unicode，正确处理 emoji 和 CJK 字符；y = sticky，从 lastIndex 开始匹配。' },
        { q: '为什么我的正则在浏览器里对、在 Node 里错？', a: 'JavaScript 正则 2022 年后加入了 /d 标志（indices）和命名捕获组，Node 版本太老可能不支持。反过来也可能是你用了 Python 风格的 (?P<name>) 命名，JS 不认。本站用浏览器原生引擎测试，结果和运行时一致。' },
        { q: '怎么匹配多行里的最后一行？', a: '两种思路：加 m 标志后用 `^.*$` 配合 `s` 标志或者先按换行 split 再处理。本站会把每个匹配高亮出来，你可以看到正则实际匹配了什么。' },
        { q: '正则会被恶意输入拖垮吗？', a: '会。经典的 ReDoS（Regular Expression Denial of Service）可以让某些回溯写法在特定输入上指数级消耗时间。本站在浏览器里运行，受你本机超时保护；但写进生产代码的正则一定要避免嵌套量词，或在引擎层面禁用回溯。' },
      ],
    },
    en: {
      intro: [
        'A regular expression is a tiny language for describing patterns in text — email addresses, phone numbers, dates, URLs, version numbers, HTML tags, and many more. Regex is hard to write and even harder to debug, which is why a regex tester is such a time-saver.',
        'Qiuyun\'s regex tester matches in real time. As you type your pattern, every match in the test text is highlighted instantly. All JavaScript regex flags are supported: g / i / m / s / u / y with toggle switches.',
        'For complex regexes the best practice is to write multiple test cases (both positive and negative), validate them here, and only then copy the pattern into your code. That way you catch edge cases before they ship to production.',
      ],
      faq: [
        { q: 'What do the g / i / m flags do?', a: 'g = global, match every occurrence instead of just the first. i = case-insensitive. m = multiline, makes ^ and $ anchor to each line instead of the whole string. s = dotAll, lets . match newlines. u = unicode, handles emoji and CJK characters correctly. y = sticky, starts matching at lastIndex.' },
        { q: 'Why does my regex work in the browser but fail in Node?', a: 'JavaScript regex has evolved since 2022 — the /d flag (indices) and named capture groups are relatively new and older Node versions may not support them. Conversely, you might be using Python-style named groups like (?P<name>) which JS does not recognize. Qiuyun runs against the browser\'s native engine, matching your runtime.' },
        { q: 'How do I match the last line of multi-line text?', a: 'Two common approaches: use the m flag together with `^.*$`, or split the text by newlines and process each line separately. The tester highlights every match so you can see exactly what your regex is capturing.' },
        { q: 'Can regex be abused with malicious input?', a: 'Yes. Classic ReDoS (Regular Expression Denial of Service) can make certain backtracking patterns take exponential time on crafted input. Qiuyun runs in the browser so it is bounded by your tab\'s timeout, but regex shipped to production should avoid nested quantifiers and ideally run with a backtracking-disabled engine.' },
      ],
    },
  },

  // ---- image/image-compress ----
  'image/image-compress': {
    zh: {
      intro: [
        '图片是网页性能的最大杀手——高清手机拍一张照片动辄 5MB+，直接放进网页会让用户首屏加载变慢、搜索引擎也会扣分。图片压缩可以在肉眼几乎看不出差异的前提下把体积降到原来的 1/5 甚至更小。',
        '本站的图片压缩器完全在浏览器内运行，采用 canvas.toBlob 的渐进式质量降级：先从 0.8 质量开始检测目标格式的最小尺寸，再逐步调整，直到在质量阈值以下找到最优体积。支持 JPG / PNG / WebP 格式互转。',
        '你可以看到原图与压缩后图片的体积对比、压缩比例、像素尺寸是否改变，满意了再下载。过程不上传任何服务器。',
      ],
      faq: [
        { q: 'PNG 和 JPG 压缩效果差很多吗？', a: '是的。PNG 是无损格式，适合图标、Logo、带透明通道的图形；JPG 是有损格式，适合照片。同一张照片存成 JPG 往往只有 PNG 的 1/5 到 1/10。本站的 PNG → JPG 转换选项可以一键切换。' },
        { q: '为什么我压缩后图片变糊了？', a: '质量参数设得太低。默认 0.8 是视觉和体积的平衡点，你可以调高到 0.9 或 1.0 保持原质量，只是体积会大一些。建议在预览区对比一下再下载。' },
        { q: '压缩后像素尺寸会变吗？', a: '不会。本站只降低文件的质量和编码率，不改变宽高像素。如果你需要同时缩尺寸（比如把 4000×3000 改成 800×600），配合"图片转格式"工具使用。' },
        { q: '图片会上传到服务器吗？', a: '不会。全部压缩计算在你本地浏览器完成，通过 canvas API 读取 → 编码 → 输出 Blob。断网也能用，刷新后原图从内存清除。' },
      ],
    },
    en: {
      intro: [
        'Images are the single biggest cause of slow web pages — a photo from a modern phone can easily be 5 MB+. Delivering that uncached costs you load-time performance and hurts search rankings. Image compression routinely shrinks files to 1/5 or less of their original size, usually with no visible difference to the naked eye.',
        'Qiuyun\'s image compressor runs entirely in the browser. It uses canvas.toBlob with a progressive quality-descent strategy: starting from q=0.8 it walks down to find the smallest valid file at or above your quality threshold, and supports JPG / PNG / WebP conversion on the fly.',
        'You see the side-by-side original vs compressed size, the reduction ratio, and whether pixel dimensions changed. Download only when you are happy. Nothing is ever uploaded to a server.',
      ],
      faq: [
        { q: 'Is the compression difference between PNG and JPG significant?', a: 'Absolutely. PNG is lossless and best for icons, logos, and anything with transparency. JPG is lossy and best for photographs — the same photo saved as JPG is routinely 1/5 to 1/10 the size of the PNG. Qiuyun has a PNG-to-JPG conversion option to make this a one-click switch.' },
        { q: 'Why does the image look blurry after compression?', a: 'The quality parameter is too low. The default 0.8 is a balanced point between visual fidelity and file size. Crank it up to 0.9 or 1.0 to preserve quality at the cost of a larger file. Compare in the preview area before downloading.' },
        { q: 'Do pixel dimensions change after compression?', a: 'No. Qiuyun only reduces encoding quality, never width or height. If you also need to resize (say from 4000×3000 to 800×600), use the Image Convert tool alongside this one.' },
        { q: 'Does the image get uploaded to a server?', a: 'Never. The whole pipeline — decode → canvas → encode → Blob — runs inside your browser. Works offline, and the original is cleared from memory as soon as you refresh.' },
      ],
    },
  },

  // ---- image/qrcode-generate ----
  'image/qrcode-generate': {
    zh: {
      intro: [
        '二维码（QR Code）是一种可以编码文本、URL、联系人信息、WiFi 配置等数据的二维条码。手机摄像头扫一扫就能立刻识别，在名片、海报、产品包装、线下分享等场景应用广泛。',
        '本站的二维码生成器支持任意文本和 URL 输入，可以调整尺寸（200px 到 2000px）、容错等级（L / M / Q / H 四档，H 档允许 30% 损坏仍可识别），导出格式支持 PNG 和 SVG。SVG 是矢量格式，放大不会糊，适合印刷。',
        '所有生成逻辑在本地浏览器完成，不上传任何数据。生成后直接右键保存或点击下载按钮即可。',
      ],
      faq: [
        { q: '容错等级 L / M / Q / H 是什么意思？', a: 'L = Low，允许 7% 数据损坏；M = Medium，15%；Q = Quartile，25%；H = High，30%。等级越高，二维码图案越密但越抗污损。一般选 M 就够了，如果要印在可能摩擦的表面上选 H。' },
        { q: 'PNG 和 SVG 有什么区别？', a: 'PNG 是位图，放大到海报尺寸会糊；SVG 是矢量图，无限放大仍清晰，适合印刷和大屏展示。本站两种格式都支持，按用途选择。' },
        { q: '二维码最多能放多少内容？', a: '取决于版本（最大 Version 40）和容错等级。纯二进制最多约 3KB，文本会因为 UTF-8 编码略有差异。大多数实际使用场景远低于上限。' },
        { q: '生成的二维码有 Copyright 问题吗？', a: 'QR Code 是 Denso Wave 发明的，但已成为 ISO/IEC 标准，不需要授权或付费使用。本站用的 qrcode-generator 也是开源 MIT 许可。' },
      ],
    },
    en: {
      intro: [
        'A QR Code is a two-dimensional barcode that can encode text, URLs, contact info, WiFi credentials, and more. Any modern phone camera can scan it instantly, which makes it ubiquitous on business cards, posters, product packaging, and anywhere offline-to-online sharing is needed.',
        'Qiuyun\'s QR Code generator accepts arbitrary text or URLs. You can pick any size between 200 px and 2000 px, choose one of four error-correction levels (L / M / Q / H — up to H, which tolerates 30% damage), and export as PNG or SVG. SVG is vector so it never blurs no matter how large you print it.',
        'All generation happens locally in your browser — nothing is uploaded. Save with a right-click or the download button when you are done.',
      ],
      faq: [
        { q: 'What do the error-correction levels L / M / Q / H mean?', a: 'L = Low, tolerates 7% damage. M = Medium, 15%. Q = Quartile, 25%. H = High, 30%. Higher levels produce a denser pattern but are much more resilient to smudging. M is a good default; pick H if the code will be printed on a surface that might get scratched.' },
        { q: 'PNG vs SVG — which should I use?', a: 'PNG is raster and blurs when scaled up to poster size. SVG is vector and stays crisp at any size, perfect for print and large displays. Qiuyun exports both — choose by your use case.' },
        { q: 'How much data can a QR Code hold?', a: 'It depends on the version (max Version 40) and the error-correction level. Raw binary peaks around 3 KB; text varies slightly because of UTF-8 encoding. Almost every real-world use case stays well below the limit.' },
        { q: 'Is there a copyright problem with generating QR Codes?', a: 'QR Code was invented by Denso Wave but has become an ISO/IEC standard. Using it does not require a license or fee. Qiuyun uses the open-source qrcode-generator library under the MIT license.' },
      ],
    },
  },

  // ---- frontend/color-picker ----
  'frontend/color-picker': {
    zh: {
      intro: [
        '颜色选择器是前端设计师和开发者日常最常用的工具——选一个主色，马上看到它的 HEX / RGB / HSL / CMYK 各格式值，以及对应的色板、对比度、互补色。本站的颜色选择器就是把这一套流程搬上了浏览器。',
        '它支持几种输入方式：取色器（模拟系统 color picker）、手动输入 HEX/RGB/HSL 值、粘贴已有颜色值自动识别格式。输出端提供 CSS 变量代码、Tailwind 色板生成、WCAG 对比度检查。',
        '选了一个颜色之后，可以继续在"配色方案"工具里生成同色系的完整调色板，或在"渐变"工具里把它做成背景。',
      ],
      faq: [
        { q: 'HEX、RGB、HSL 有什么区别？', a: 'HEX 是 #RRGGBB 的十六进制表示，CSS 里最常用。RGB 是 (R, G, B) 十进制 0-255。HSL 是色相（0-360°）、饱和度（0-100%）、亮度（0-100%），直觉上最接近"调色"——比如想让颜色更饱和只改 S，想让它更亮只改 L。' },
        { q: 'WCAG AA 和 AAA 是什么意思？', a: '是 Web Content Accessibility Guidelines 对文字对比度的要求。AA 级：普通文字 ≥ 4.5:1，大号文字 ≥ 3:1；AAA 级：普通文字 ≥ 7:1。本站会实时告诉你当前前景色和背景色是否达标。' },
        { q: '怎么把取到的颜色用在 Tailwind 里？', a: '本站在输出区下方提供了 Tailwind 色板生成器——输入你的主色，它会自动扩展出 50/100/200/.../900 十级色阶，直接拷进 tailwind.config.js 的 theme.extend.colors。' },
        { q: '取色器能从屏幕上取色吗？', a: '现代浏览器支持 EyeDropper API（Chrome/Edge 100+），本站检测到后会显示取色按钮，点击后可以在整个屏幕上取色。不支持的浏览器会退回到手动输入 HEX。' },
      ],
    },
    en: {
      intro: [
        'A color picker is among the most-used tools for front-end designers and developers. Pick a primary color and instantly see its HEX / RGB / HSL / CMYK values, plus a palette preview, contrast ratios, and complementary colors. Qiuyun\'s color picker brings all of this into the browser.',
        'Input is flexible: use the native color picker, type HEX / RGB / HSL manually, or paste an existing color value and Qiuyun auto-detects the format. Outputs include ready-to-paste CSS custom properties, Tailwind palette generation, and live WCAG contrast checks.',
        'Once you have a color, jump over to the Color Scheme tool to generate a full harmonious palette, or the Gradient tool to turn it into a background.',
      ],
      faq: [
        { q: 'What is the difference between HEX, RGB, and HSL?', a: 'HEX is #RRGGBB hex and is the most common format in CSS. RGB is (R, G, B) each from 0 to 255. HSL is Hue (0-360°), Saturation (0-100%), Lightness (0-100%) — the most intuitive for "painting": increase S to make it more vivid, increase L to make it lighter, without touching the hue.' },
        { q: 'What do WCAG AA and AAA mean?', a: 'They are Web Content Accessibility Guidelines for text contrast. AA requires ≥ 4.5:1 for normal text and ≥ 3:1 for large text; AAA requires ≥ 7:1 for normal text. Qiuyun shows you in real time whether your current foreground-on-background passes.' },
        { q: 'How do I use the picked color in Tailwind?', a: 'Below the output panel you will find a Tailwind palette generator — paste in your primary color and Qiuyun expands it to a 50/100/200/.../900 ten-step scale that you can copy straight into tailwind.config.js under theme.extend.colors.' },
        { q: 'Can I pick a color from my screen?', a: 'Modern browsers support the EyeDropper API (Chrome and Edge 100+). When available, Qiuyun shows a pick button that lets you sample anywhere on the screen. Unsupported browsers fall back to manual HEX input.' },
      ],
    },
  },

  // ---- text/word-count ----
  'text/word-count': {
    zh: {
      intro: [
        '字数统计是写作、翻译、SEO 内容创作时的高频需求——知乎回答、公众号文章、简历、英文邮件、论文摘要都需要知道自己写了多少字。字数、字符数、中文字符、英文单词、段落数、阅读时间，本站一次全部给你。',
        '它能正确区分中文和英文：中文按字符（含标点和空格）计数，英文按空格分词数。同时给出"预估阅读时间"，按中文 300 字/分钟、英文 200 词/分钟估算。',
        '统计在本地浏览器完成，不会上传任何内容。粘贴 → 看统计 → 关闭，不留痕迹。',
      ],
      faq: [
        { q: '字符数和字数有什么区别？', a: '字符数是"所有字符的个数"，包括空格、标点、换行。字数通常是"中文按字符、英文按单词"——比如英文 "Hello World" 字符数 11（含空格），字数 2。写论文或投稿时看平台怎么定义就按哪个指标。' },
        { q: '怎么统计中文字数？', a: '中文没有空格分词，所以通常"一个汉字 = 一个字"，标点和数字算字符。本站同时给出"中文字符数（含标点）"和"中文字符数（不含标点）"，按你的用途选。' },
        { q: '预估阅读时间准吗？', a: '是行业通用的平均值：中文 300 字/分钟、英文 200 词/分钟。技术文档、代码段、复杂句式会更慢；口语化内容会更快。实际值因人而异，作为参考就好。' },
        { q: '统计的内容会保存吗？', a: '不会。所有统计在浏览器本地完成，刷新后从内存清除。本站不做任何服务端持久化，也不做第三方统计脚本的输入内容上报。' },
      ],
    },
    en: {
      intro: [
        'Word count comes up all the time when writing — answers, blog posts, résumés, emails, and abstracts. Writers, translators, and SEO content creators all need to know how much they have written. Qiuyun gives you characters, words, paragraphs, Chinese characters, and estimated reading time in one panel.',
        'The tool distinguishes correctly between Chinese and English: Chinese is counted per character (including punctuation and spaces), English is tokenized by spaces. It also shows estimated reading time using the industry defaults of 300 Chinese chars/min and 200 English words/min.',
        'Everything runs locally in your browser. Paste → check stats → close — nothing leaves a trace.',
      ],
      faq: [
        { q: 'What is the difference between character count and word count?', a: 'Character count is every single character including spaces, punctuation, and newlines. Word count is context-dependent — in English it means space-separated tokens, so "Hello World" is 11 characters but 2 words. Follow the definition used by the platform you are writing for.' },
        { q: 'How do you count Chinese text?', a: 'Chinese has no word boundaries, so every Han character is treated as one "word". Punctuation and digits count as characters. Qiuyun reports both "Chinese chars including punctuation" and "Chinese chars excluding punctuation" so you can pick what fits your use case.' },
        { q: 'Is the estimated reading time accurate?', a: 'It uses standard industry averages: 300 Chinese chars/min, 200 English words/min. Technical docs, code blocks, and dense prose read slower; conversational text reads faster. Treat it as a reasonable baseline, not a promise.' },
        { q: 'Is the pasted text stored anywhere?', a: 'No. All counting runs locally in the browser and is erased from memory when you refresh. Qiuyun never sends the input content anywhere — not to our server, not to any third-party analytics.' },
      ],
    },
  },

  // ---- dev/yaml-json ----
  'dev/yaml-json': {
    zh: {
      intro: [
        'YAML 和 JSON 描述的是同一种数据模型，只是表达方式不同：YAML 用缩进和短横线，适合人写；JSON 用大括号和引号，适合机器读。Kubernetes 清单、Docker Compose、CI 流水线配置基本都是 YAML，而接口返回、前端状态、日志里几乎都是 JSON。',
        '这个工具把两个方向都做了：贴 YAML 得到缩进整齐的 JSON，贴 JSON 得到层级清晰的 YAML。转换时会按标准语法解析，遇到缩进错误、缺少空格、非法字符会明确报错，而不是默默产出错误结构。',
        '所有转换在浏览器内完成。配置文件里经常带数据库密码、API Key、内网地址，本站不会把这些内容发往任何服务器。',
      ],
      faq: [
        { q: 'YAML 和 JSON 到底有什么区别？', a: '数据模型几乎一致（对象、数组、字符串、数字、布尔、null），差别在语法：YAML 缩进敏感、支持注释和锚点引用、不需要引号包裹字符串；JSON 必须用双引号包裹键名、不支持注释、不能有尾逗号。YAML 的表达力更强，JSON 的解析更简单。' },
        { q: '为什么 YAML 转 JSON 总是报缩进错误？', a: '九成是用了 Tab。YAML 规范禁止 Tab 做缩进，只允许空格，编辑器里看起来一样但解析器会直接报错。另外冒号后面必须有一个空格（key: value 而不是 key:value），短横线后也要有空格。' },
        { q: '注释会保留吗？', a: '不会。注释属于语法层的辅助信息，解析成数据后就被丢弃了，所以 YAML → JSON → YAML 往返一次，注释和原有的键顺序都会丢失。需要保留注释就把原文件存好。' },
        { q: '生成的 YAML 缩进宽度是多少？', a: '默认 2 个空格，这也是绝大多数项目的约定。嵌套数组会输出成短横线开头的多行形式。如果你需要别的宽度，可以在转换后自行调整，语义不受影响。' },
      ],
    },
    en: {
      intro: [
        'YAML and JSON describe the same data model with different syntax. YAML uses indentation and dashes and is pleasant for humans to write; JSON uses braces and quotes and is easy for machines to parse. Kubernetes manifests, Docker Compose files, and CI pipelines are usually YAML, while API responses, frontend state, and logs are almost always JSON.',
        'This converter works in both directions: paste YAML and get neatly indented JSON, or paste JSON and get a readable YAML hierarchy. Parsing follows the standard grammar, so bad indentation, a missing space, or an illegal character produces a clear error instead of silently wrong output.',
        'Everything runs inside your browser. Configuration files often contain database passwords, API keys, and internal hostnames, and this site never sends any of that to a server.',
      ],
      faq: [
        { q: 'What is the actual difference between YAML and JSON?', a: 'The data models are nearly identical (objects, arrays, strings, numbers, booleans, null). The syntax differs: YAML is indentation-sensitive, supports comments and anchors, and does not require quotes around strings. JSON requires double-quoted keys, forbids comments, and forbids trailing commas. YAML is more expressive; JSON is simpler to parse.' },
        { q: 'Why does my YAML keep failing to convert?', a: 'Almost always tabs. The YAML spec forbids tabs for indentation and allows spaces only, so text that looks aligned in your editor can be rejected outright. The second most common cause is a missing space after a colon: it must be key: value, not key:value. A dash also needs a space after it.' },
        { q: 'Are comments preserved?', a: 'No. Comments are syntax-level hints that disappear once the document is parsed, so a YAML → JSON → YAML round trip loses comments and reorders keys. Keep the original file if you need to preserve them.' },
        { q: 'How wide is the generated indentation?', a: 'Two spaces by default, which is the convention in most projects. Nested arrays are emitted as multi-line dash entries. You can change the width afterwards without affecting the semantics.' },
      ],
    },
  },

  // ---- dev/yaml-properties ----
  'dev/yaml-properties': {
    zh: {
      intro: [
        'Spring Boot 允许把同一份配置写成 application.properties 或 application.yml，后者在多层嵌套时更易读。迁移老项目、把配置交给 Kubernetes ConfigMap 时，经常需要在这两种格式之间来回转换。',
        '转换的核心是层级映射：Properties 里用点号分隔的 key（server.servlet.context-path）会展开成 YAML 的嵌套结构，反过来 YAML 的嵌套层级会被压平成点号 key。数组下标（list[0]）也会转成 YAML 列表。',
        '本工具纯前端运行，配置文件里的密钥、密码、连接串都不会离开你的浏览器。',
      ],
      faq: [
        { q: 'Properties 里的点号 key 怎么变成 YAML 层级？', a: 'a.b.c=1 会变成 a → b → c 三层嵌套。如果同时出现 a.b.c 和 a.b，转换器会把两者合并到同一棵树上。要留意 key 冲突：既想当叶子又想当父节点的情况在 Properties 里能写，在 YAML 里是非法结构。' },
        { q: '中文配置项转换后乱码怎么办？', a: 'Java 的 Properties 传统上用 ISO-8859-1 读取，中文必须写成 \\u4F60\\u597D 这样的 Unicode 转义。现代 Spring Boot 默认按 UTF-8 读取，可以直接写中文。如果源文件是 \\uXXXX 形式，先确认你的框架实际用什么编码加载。' },
        { q: '注释会保留吗？', a: '不会。以 # 或 ! 开头的注释在解析阶段就被丢掉，转换结果只包含键值对。需要保留说明文字就单独存一份文档。' },
        { q: '数组和列表怎么表示？', a: 'Properties 里常见两种写法：list[0]=a、list[1]=b 这种下标形式，以及 list=a,b,c 这种逗号分隔形式。前者会转成 YAML 列表，后者默认当成一个字符串，是否拆分取决于你框架的绑定规则。' },
      ],
    },
    en: {
      intro: [
        'Spring Boot lets you express the same configuration as application.properties or application.yml, and the YAML form is far easier to read once nesting grows. Migrating a legacy service or moving config into a Kubernetes ConfigMap means converting between the two regularly.',
        'The conversion is really about hierarchy: dotted Properties keys such as server.servlet.context-path expand into nested YAML, and YAML nesting collapses back into dotted keys. Indexed keys like list[0] become real YAML sequences.',
        'The tool runs entirely in the browser, so secrets, passwords, and connection strings in your config never leave the page.',
      ],
      faq: [
        { q: 'How do dotted keys map to YAML levels?', a: 'a.b.c=1 becomes three levels — a, then b, then c. If both a.b.c and a.b exist, the converter merges them into one tree. Watch for conflicts: a key that is both a leaf and a parent is legal in Properties but an invalid structure in YAML.' },
        { q: 'Why is my non-ASCII text garbled after conversion?', a: 'The classic Properties format is read as ISO-8859-1, so Chinese must be written as \\u4F60\\u597D style escapes. Modern Spring Boot reads UTF-8 by default and accepts the characters directly. If your source uses escapes, confirm what encoding your framework actually loads.' },
        { q: 'Are comments kept?', a: 'No. Lines starting with # or ! are dropped during parsing, so the output contains keys and values only. Keep a separate document if the explanations matter.' },
        { q: 'How are lists represented?', a: 'Two forms are common: indexed keys such as list[0]=a and list[1]=b, or a comma-separated value such as list=a,b,c. The indexed form becomes a YAML sequence; the comma form stays a single string unless your binding layer splits it.' },
      ],
    },
  },

  // ---- dev/json-java ----
  'dev/json-java': {
    zh: {
      intro: [
        '对接第三方接口时，第一步往往是照着返回的 JSON 手写实体类：字段名、类型、嵌套对象、泛型列表，几十个字段敲下来既慢又容易拼错。这个工具把这段机械劳动变成一次粘贴。',
        '贴入 JSON 后，它会递归分析结构并推断类型：布尔识别为 Boolean、整数识别为 Integer 或 Long、小数识别为 Double、嵌套对象生成独立的内部类、数组生成 List。同时把 snake_case 风格的字段名转成 Java 惯用的 camelCase。',
        '生成结果只是起点：实际项目里通常还要补 @JsonProperty、校验注解、Lombok 的 @Data 或 record 改造。工具不联网、不上传数据，接口里的真实业务数据不会外泄。',
      ],
      faq: [
        { q: '字段类型是怎么推断的？', a: '看实际值而不是靠猜：true/false 给 Boolean，没有小数点的数字给 Integer（超出 int 范围给 Long），有小数点的给 Double，字符串给 String。同一字段在不同数组元素里类型不一致时，会退化为更宽的类型或 Object，需要你手工调整。' },
        { q: '嵌套对象和数组怎么处理？', a: '嵌套对象会生成独立的静态内部类，类名由字段名首字母大写而来；数组生成 List<T>，元素是对象时同样生成内部类。层级再深也会继续递归。' },
        { q: '能生成 Lombok 或 record 吗？', a: '默认输出是带私有字段和标准访问方式的基础 POJO，方便直接放进任何项目。如果你用 Lombok 或 Java 14+ 的 record，可以在生成结果上自行简化，字段和类型都不用再改。' },
        { q: '字段名不是驼峰怎么办？', a: 'JSON 里常见的 user_name、user-name 会被规范成 userName。但规范化后可能与真实 JSON key 不匹配，接口反序列化时需要 @JsonProperty 显式绑定原始名称，这一点生成后要自己补。' },
      ],
    },
    en: {
      intro: [
        'Integrating a third-party API usually starts with hand-writing a Java class that mirrors the JSON response: field names, types, nested objects, generic lists. Dozens of fields later, you have typos and mismatched types. This tool turns that chore into a single paste.',
        'Paste JSON and it walks the structure recursively, inferring types: booleans become Boolean, integers become Integer or Long, decimals become Double, nested objects become inner classes, and arrays become List. snake_case keys are normalized to the camelCase Java convention.',
        'The output is a starting point: real projects usually add @JsonProperty, validation annotations, Lombok @Data, or a record rewrite. Nothing is uploaded, so real business payloads stay on your machine.',
      ],
      faq: [
        { q: 'How are field types inferred?', a: 'From the actual values: true/false gives Boolean, a number without a decimal point gives Integer (Long when it exceeds the int range), a number with a decimal point gives Double, and text gives String. If one field has different types across array elements, it degrades to a wider type or Object, which you should review by hand.' },
        { q: 'How are nested objects and arrays handled?', a: 'A nested object becomes a static inner class named after the field with a capital first letter. Arrays become List<T>, and object elements produce inner classes too. Nesting is followed to any depth.' },
        { q: 'Can it generate Lombok or records?', a: 'The default output is a plain POJO with private fields and standard accessors, which drops into any project. If you use Lombok or Java 14+ records, simplify the generated class yourself — the field names and types stay the same.' },
        { q: 'What if the keys are not camelCase?', a: 'Keys like user_name or user-name are normalized to userName. After normalization they no longer match the real JSON key, so serialization needs an explicit @JsonProperty bound to the original name. Add that manually.' },
      ],
    },
  },

  // ---- dev/code-beautify ----
  'dev/code-beautify': {
    zh: {
      intro: [
        '线上取下来的 JS 被压成一行、同事发来的 CSS 全挤在一起、日志里的 JSON 完全没有换行——这些时候逐行手动敲回车是最没必要的时间消耗。代码美化工具用解析器重新排版，把缩进、换行和空格按语言惯例恢复。',
        '它不是简单的正则替换：真正的格式化器会先解析成语法树，再按语言的规则输出，所以不会破坏字符串里的空格、模板字符串里的换行，也不会把正则字面量误当成除法。',
        '所有处理都在本地完成，代码不会上传。对于公司内部代码片段，这一点比功能本身更重要。',
      ],
      faq: [
        { q: '支持哪些语言？', a: '常规的 JS/TS、JSON、HTML、CSS/SCSS/Less、XML、SQL 等常见格式都在覆盖范围内。不同语言的规则略有差异，比如 SQL 会按关键字换行并对齐。如果你需要的美化器还没覆盖，用 JSON 格式化或 CSS 格式化这两个专用工具通常更稳。' },
        { q: '美化会改变代码行为吗？', a: '不会。格式化只调整空白和换行，不改变 token 顺序。唯一需要小心的是自动分号插入（ASI）敏感的 JS 写法，以及压缩过的代码里被合并的字符串；如果源文件本来就是可执行的，美化后依然可执行。' },
        { q: '为什么美化大文件会很卡？', a: '格式化需要先完整解析成语法树，内存占用与文件大小成正比。几百 KB 的代码通常秒开，几 MB 的打包产物建议先按模块拆分，或者只美化你正在排查的那一段。' },
        { q: '能反过来压缩吗？', a: '压缩（minify）是另一类操作，需要重命名变量、删除注释和空白，存在改变语义的风险。本工具聚焦在可读性恢复；要发布用的压缩产物，请用构建工具（Vite、esbuild、terser）而不是在线工具。' },
      ],
    },
    en: {
      intro: [
        'JavaScript pulled from production is one long line, a colleague sends CSS with no line breaks, and the JSON inside a log has no indentation at all. Pressing Enter by hand is the least valuable way to spend time. A beautifier parses the code and re-emits it with indentation, line breaks, and spacing that match the language conventions.',
        'It is not a regex replacement. A real formatter builds a syntax tree and prints it back according to grammar rules, so spaces inside strings, newlines in template literals, and regex literals are never mangled into division operators.',
        'Processing happens locally. Code never leaves the page — which matters more than the feature itself when the snippet belongs to your employer.',
      ],
      faq: [
        { q: 'Which languages are supported?', a: 'Common formats such as JS/TS, JSON, HTML, CSS/SCSS/Less, XML, and SQL. Each language has its own rules — SQL, for example, breaks lines at keywords and aligns clauses. If a specific language is missing, the dedicated JSON formatter or CSS formatter is usually a safer bet.' },
        { q: 'Can beautifying change what the code does?', a: 'No. Only whitespace and line breaks move; token order stays identical. The two things to keep in mind are automatic semicolon insertion in clever JavaScript and minified code where strings were concatenated. If the original ran, the formatted version runs.' },
        { q: 'Why does a large file freeze the page?', a: 'Formatting requires a full parse into a syntax tree, and memory scales with file size. A few hundred KB is instant; multi-megabyte bundles should be split by module, or you can format only the section you are debugging.' },
        { q: 'Can it minify instead?', a: 'Minification is a different operation that renames variables and strips comments, which can change behaviour. This tool focuses on restoring readability. Use Vite, esbuild, or terser for production bundles rather than an online tool.' },
      ],
    },
  },

  // ---- dev/cron ----
  'dev/cron': {
    zh: {
      intro: [
        'Cron 表达式只有五个字段，但写错一个字符就可能让任务在凌晨三点把数据库跑满。可视化生成器让你用点选的方式拼出表达式，同时把「下一次什么时候执行」算给你看，不用再靠心算。',
        '解析面板会把表达式翻译成人话，例如 0 3 * * 1 是「每周一 03:00」。下方的执行时间列表按当前时区推演未来若干次触发，秒级字段、月份缩写、区间和步长都会被正确展开。',
        '工具只做纯计算，不会真的注册任务，也不会连接你的服务器，可以放心试错。',
      ],
      faq: [
        { q: '5 位和 6 位的 Cron 有什么区别？', a: '标准 Linux crontab 是 5 位：分 时 日 月 周。Quartz 等 Java 调度器是 6 位，最前面多一个秒字段。两者不通用——6 位表达式喂给 Linux crontab 会被直接拒绝。看清你的调度器用的是哪一种再写。' },
        { q: '*/5 和 0/5 是同一个意思吗？', a: '在大多数实现里，*/5 表示从最小值开始每 5 个单位（分钟字段即 0,5,10…55），0/5 表示从 0 开始每 5 个。因为分钟的最小值就是 0，两者在分钟字段等价；但在小时或日期字段上，起点不同会导致结果不同。' },
        { q: '为什么我的任务没有按预期执行？', a: '常见陷阱：日字段和周字段同时被指定时，很多实现取「或」而不是「与」；星期日既可以写 0 也可以写 7；时区取决于服务器而不是你的本地时间；1 月是 1 但周日是 0，容易混淆。用执行时间列表逐条核对最快。' },
        { q: '执行时间按哪个时区计算？', a: '按你在页面上看到的本地时区推演。真实服务器通常跑在 UTC，部署时要把时区差算进去，或者干脆在应用层显式指定时区，别依赖服务器默认值。' },
      ],
    },
    en: {
      intro: [
        'A cron expression has only five fields, yet one wrong character can make a job hammer the database at 3 a.m. The visual builder lets you assemble the expression by clicking, and shows the next run times so you no longer have to compute them in your head.',
        'The parser also translates the expression into plain language — 0 3 * * 1 is "every Monday at 03:00". The upcoming-run list is projected in your current timezone, expanding seconds, month names, ranges, and step values correctly.',
        'This is pure calculation. No job is registered anywhere and no server is contacted, so it is safe to experiment.',
      ],
      faq: [
        { q: 'What is the difference between 5-field and 6-field cron?', a: 'Standard Linux crontab uses five fields: minute, hour, day-of-month, month, day-of-week. Quartz-style Java schedulers use six, with a leading seconds field. They are not interchangeable — a six-field expression is rejected by Linux crontab. Check which scheduler you are writing for.' },
        { q: 'Are */5 and 0/5 the same thing?', a: 'In most implementations */5 means every 5 units starting from the minimum (0,5,10…55 in the minute field), while 0/5 means every 5 starting from 0. In the minute field the minimum is 0, so they match. In the hour or day fields the different starting points give different schedules.' },
        { q: 'Why is my job not running when I expect?', a: 'Classic traps: when both day-of-month and day-of-week are restricted, many implementations OR them instead of ANDing. Sunday can be 0 or 7. Timezone comes from the server, not your laptop. January is month 1, but Sunday is week 0. Cross-checking against the upcoming-run list is the fastest way to catch these.' },
        { q: 'Which timezone are the run times in?', a: 'They are projected in the timezone shown on the page. Production servers usually run in UTC, so account for the offset when deploying — or set the timezone explicitly in the application instead of trusting the server default.' },
      ],
    },
  },

  // ---- dev/http-request ----
  'dev/http-request': {
    zh: {
      intro: [
        '临时要确认一个接口通不通、返回结构长什么样、响应头里带了什么，为此打开 Postman 或写一段 curl 往往比问题本身还费时间。这个页面直接在浏览器里发请求，填 URL、选方法、加请求头，结果按状态码、响应头、响应体分区展示。',
        '需要提前说清楚：浏览器受同源策略约束，跨域请求必须由目标服务器返回正确的 CORS 头才能读到响应。这跟工具好坏无关，是浏览器的安全规定。所以它最适合调试自己团队的、已经配置了 CORS 的接口。',
        '请求由你的浏览器直接发出，不经过本站服务器，也不会被记录下来。携带真实 Token 调试时不用担心中间人多看一眼。',
      ],
      faq: [
        { q: '为什么请求报 CORS 错误？', a: '浏览器在真正发请求前会先做预检（OPTIONS），如果目标服务器没有返回 Access-Control-Allow-Origin 等响应头，浏览器就会拦下响应，页面拿不到任何数据。解决办法是在服务端配置 CORS，或者改用 curl、Postman 这类不受同源策略约束的客户端。' },
        { q: '支持哪些请求方法和自定义头？', a: 'GET、POST、PUT、PATCH、DELETE 等常用方法都支持，也可以自己加任意请求头，例如 Authorization、Content-Type。注意部分自定义头会触发预检，目标服务器必须允许它们。' },
        { q: '能带 Cookie 发请求吗？', a: '默认不会带上目标站点的 Cookie，跨域时还需要服务器显式允许凭证。涉及登录态的接口调试，建议在浏览器开发者工具的 Network 面板里复现，或者用 curl 带上 Cookie。' },
        { q: '为什么返回内容和我在命令行看到的不一样？', a: '常见原因：请求缺少必要的认证头被服务端返回了降级内容，或者服务端根据 User-Agent、Accept 返回不同格式。把命令行里的请求头原样搬过来逐项比对，通常能定位差异。' },
      ],
    },
    en: {
      intro: [
        'Checking whether an endpoint is alive, what the response shape looks like, or which headers come back should not cost more time than the problem itself. This page sends the request straight from the browser: set the URL, pick a method, add headers, and inspect status, headers, and body in separate panes.',
        'One caveat up front: browsers enforce the same-origin policy, so a cross-origin request only exposes the response when the target server returns proper CORS headers. That is a browser security rule, not a limitation of the tool — which makes it ideal for your own APIs that already have CORS configured.',
        'The request goes directly from your browser and is never proxied through this site or logged, so debugging with a real token does not expose it to a middleman.',
      ],
      faq: [
        { q: 'Why do I get a CORS error?', a: 'The browser sends a preflight OPTIONS request first. If the target does not answer with Access-Control-Allow-Origin and friends, the browser discards the response and the page sees nothing. Fix it on the server, or use a client that is not bound by the same-origin policy such as curl or Postman.' },
        { q: 'Which methods and headers are supported?', a: 'GET, POST, PUT, PATCH, DELETE and the other common verbs, plus arbitrary request headers such as Authorization or Content-Type. Some custom headers trigger a preflight, so the target server must explicitly allow them.' },
        { q: 'Can it send cookies?', a: 'Cookies for the target site are not attached by default, and cross-origin requests additionally need the server to allow credentials. For anything involving a logged-in session, reproduce the call in your browser DevTools Network panel or use curl with the cookie header.' },
        { q: 'Why is the response different from what curl shows?', a: 'Usually a missing auth header causing the server to return a degraded payload, or content negotiated on User-Agent and Accept. Copy the headers from your working command line one by one until the responses match.' },
      ],
    },
  },

  // ---- dev/websocket ----
  'dev/websocket': {
    zh: {
      intro: [
        'WebSocket 调试的麻烦在于它是长连接：握手、帧格式、心跳、断线原因都看不到，只能靠猜。这个页面把连接过程铺开——连上之后可以随时发文本消息、看收到的每一帧和连接状态变化。',
        '支持 ws:// 与 wss:// 两种协议，消息既可以是纯文本，也可以是 JSON 片段。连接失败时会显示浏览器给出的错误原因，常见的有证书问题、路径 404、代理不支持 Upgrade，比控制台里一行红字有用得多。',
        '连接直接从浏览器发起，不经过本站服务器，调试内网服务时也能用。',
      ],
      faq: [
        { q: 'ws:// 和 wss:// 有什么区别？', a: 'wss 是 WebSocket over TLS，等同于 https 之于 http：内容加密、需要有效证书。生产环境一律用 wss。如果页面本身是 https，浏览器会阻止你连到 ws://，因为混合内容被禁止。' },
        { q: '为什么一直连不上？', a: '先看握手：服务端必须在同一路径上响应 HTTP 101 Switching Protocols，路径写错就是 404，Nginx 没配 Upgrade 头会返回 400 或直接断开。其次是证书，自签名证书在 wss 下会被拒绝。最后是服务端校验 Origin，允许列表里没有你的域名也会拒绝握手。' },
        { q: '能发 JSON 或二进制消息吗？', a: '文本帧直接发即可，JSON 就是一段字符串。二进制帧（图片、protobuf）在多数测试场景里用不到，需要的话建议在业务代码里用工具库发送。' },
        { q: '断线后会自动重连吗？', a: '不会。测试工具的意图是让你看到真实的断开时机和错误码，而不是悄悄帮你恢复。生产代码里的自动重连要自己实现，典型做法是指数退避加最大重试次数。' },
      ],
    },
    en: {
      intro: [
        'Debugging WebSocket is hard because it is a long-lived connection: the handshake, frame format, heartbeats, and disconnect reason are all invisible, so people end up guessing. This page lays the process out — connect, send text messages at any time, and watch every incoming frame and state change.',
        'Both ws:// and wss:// are supported, and messages can be plain text or JSON strings. When a connection fails, the browser error is shown — certificate problems, a 404 on the path, or a proxy that does not support Upgrade — which is far more useful than a single red line in the console.',
        'Connections originate from your browser and never pass through this site, so internal services are fair game.',
      ],
      faq: [
        { q: 'What is the difference between ws:// and wss://?', a: 'wss is WebSocket over TLS, the same relationship https has with http: encrypted, and it needs a valid certificate. Use wss in production. If the page itself is served over https, the browser blocks ws:// connections as mixed content.' },
        { q: 'Why can I never connect?', a: 'Check the handshake first. The server must answer HTTP 101 Switching Protocols on the exact path — a typo gives 404, and a proxy such as Nginx without Upgrade headers returns 400 or drops the socket. Next is the certificate: self-signed certificates are rejected under wss. Finally, servers that validate Origin will refuse the handshake when your domain is not allowlisted.' },
        { q: 'Can I send JSON or binary frames?', a: 'Text frames can be sent directly, and JSON is just a string. Binary frames such as images or protobuf are rarely needed for testing; send those from application code with a proper client library.' },
        { q: 'Does it reconnect automatically?', a: 'No. The point of a test client is to show you the real disconnect moment and close code instead of hiding it. Automatic reconnection belongs in your production code — typically exponential backoff with a retry cap.' },
      ],
    },
  },

  // ---- dev/ua-parser ----
  'dev/ua-parser': {
    zh: {
      intro: [
        'User-Agent 是一段每次 HTTP 请求都会带上的自述字符串，里面塞着浏览器、版本、渲染内核、操作系统、设备类型，爬虫还会表明身份。排查「为什么只有某个浏览器出问题」时，先看清 UA 是第一步。',
        '解析结果按浏览器、引擎、操作系统、设备四层拆开，并单独标出是否为爬虫或自动化工具。粘贴任意一段 UA 都能解析，不限于你自己的浏览器。',
        '解析在你本地完成，不需要把 UA 发到服务器。',
      ],
      faq: [
        { q: 'UA 里的信息可信吗？', a: '完全不可信。UA 由客户端自己填写，爬虫可以伪装成 Chrome，浏览器插件也能随便改。它适合做统计分布和兼容性排查，绝不能用来做权限判断或安全校验。' },
        { q: '为什么 Chrome 的 UA 里有 Safari 字样？', a: '这是历史遗留：Chrome 基于 WebKit 起家，为了通过当年针对 Safari 的站点检测，一直保留 Safari/537.36 这段标识。同理 Edge 的 UA 里既有 Chrome 也有 Safari。判断浏览器要看 Edg/、Chrome/ 这类专有标记的先后顺序。' },
        { q: '怎么识别搜索引擎爬虫？', a: '看 UA 里是否包含 Googlebot、Bingbot、Baiduspider 等固定名称。但 UA 可以伪造，严肃场景应该用反向 DNS 或官方 IP 段校验，UA 只能作为初筛。' },
        { q: '为什么有些信息解析不出来？', a: '现代浏览器在做 UA 精简（UA Reduction），Chrome 已经把次要版本号和设备型号冻结或移除，改用 User-Agent Client Hints。因此新版本浏览器的 UA 会越来越短，精确型号需要通过 navigator.userAgentData 获取。' },
      ],
    },
    en: {
      intro: [
        'User-Agent is a self-describing string sent with every HTTP request: browser, version, rendering engine, operating system, device class, and for crawlers, their identity. When only one browser misbehaves, reading the UA is the first step.',
        'Results are split into browser, engine, operating system, and device, with a separate flag for crawlers and automation tools. Paste any UA string — it does not have to be your own browser.',
        'Parsing happens locally, so there is no need to send the UA anywhere.',
      ],
      faq: [
        { q: 'Is the information in a UA trustworthy?', a: 'Not at all. The client writes it, crawlers can claim to be Chrome, and extensions can rewrite it. It is fine for traffic statistics and compatibility triage, but never for authorization or security decisions.' },
        { q: 'Why does Chrome include Safari in its UA?', a: 'Historical baggage. Chrome started on WebKit and kept the Safari/537.36 token so sites sniffing for Safari would serve it the right code. Edge likewise contains both Chrome and Safari. Identify the browser by the order of the vendor-specific tokens such as Edg/ and Chrome/.' },
        { q: 'How do I spot a search engine crawler?', a: 'Look for fixed tokens such as Googlebot, Bingbot, or Baiduspider. Since UA strings can be forged, serious setups verify reverse DNS or official IP ranges — treat UA as a first filter only.' },
        { q: 'Why is some information missing?', a: 'Browsers are reducing UA detail. Chrome has frozen minor versions and removed device models in favour of User-Agent Client Hints, so UA strings from newer browsers keep getting shorter. Exact device info now comes from navigator.userAgentData.' },
      ],
    },
  },

  // ---- dev/device-info ----
  'dev/device-info': {
    zh: {
      intro: [
        '排查兼容性问题时，经常需要确认用户的真实环境：屏幕尺寸和像素比、时区、语言、CPU 核心数、可用内存、是否触屏、WebGL 渲染器、网络类型。这些信息散落在十几个 API 里，这个页面一次全部列出来。',
        '信息分组成卡片展示：屏幕与视口、浏览器与语言、硬件能力、网络状态、图形能力。WebGL 的 vendor 和 renderer 尤其有用，它能暴露真实显卡型号，对判断渲染异常、字体锯齿、性能问题很关键。',
        '所有读取都在本地完成，页面不会上传这些数据，也不会把结果拼成指纹发送出去。',
      ],
      faq: [
        { q: '为什么看不到设备的精确型号？', a: '浏览器出于隐私考虑不暴露硬件型号，只能拿到平台名称、核心数、内存量级。精确型号需要原生应用或 User-Agent Client Hints 的高熵字段，而且用户可能拒绝授权。' },
        { q: 'WebGL 渲染器信息有什么用？', a: '它可以区分集成显卡和独立显卡，也能暴露驱动差异。前端出现「某些机器上阴影渲染错乱」「Canvas 文字模糊」这类问题时，对比出问题机器和正常机器的 renderer 字符串，往往能快速缩小范围。' },
        { q: '为什么内存显示的是一个约数？', a: 'navigator.deviceMemory 只返回 0.25、0.5、1、2、4、8 这样的分档值，且被上限截断（常见上限 8GB）。这是隐私设计，不能当作精确值使用，只适合做能力分级。' },
        { q: '这些信息会被用来做浏览器指纹吗？', a: '理论上会，屏幕分辨率、时区、语言、显卡、字体列表的组合足以高度区分个体，这也是浏览器逐步限制这些 API 精度的原因。本站只在页面内展示，不收集、不落库、不发送。' },
      ],
    },
    en: {
      intro: [
        'Compatibility work constantly needs the real environment: viewport size and pixel ratio, timezone, language, CPU cores, available memory, touch support, WebGL renderer, connection type. That data lives in a dozen different APIs — this page collects it in one place.',
        'Results are grouped into cards: screen and viewport, browser and language, hardware capabilities, network status, and graphics. The WebGL vendor and renderer strings are especially handy because they expose the actual GPU, which is key when tracking down rendering glitches, blurry text, or performance issues.',
        'Everything is read locally. Nothing is uploaded, and the values are not combined into a fingerprint that leaves the page.',
      ],
      faq: [
        { q: 'Why can I not see the exact device model?', a: 'Browsers hide hardware identity for privacy. You get the platform name, core count, and a memory tier at best. Exact models require a native app or high-entropy User-Agent Client Hints, and the user can decline to share them.' },
        { q: 'What is the WebGL renderer useful for?', a: 'It distinguishes integrated from discrete GPUs and reveals driver differences. When shadows render incorrectly or canvas text is blurry only on some machines, comparing renderer strings between a broken and a working device usually narrows it down fast.' },
        { q: 'Why is the memory value approximate?', a: 'navigator.deviceMemory returns coarse buckets such as 0.25, 0.5, 1, 2, 4, or 8 GB, capped at a maximum (commonly 8). It is a privacy measure, so treat it as a capability tier rather than a precise figure.' },
        { q: 'Can this data be used for browser fingerprinting?', a: 'In principle, yes — resolution, timezone, language, GPU, and font availability combine into a highly distinguishing signature. That is exactly why browsers keep reducing the precision of these APIs. This site only displays the values; nothing is collected, stored, or sent.' },
      ],
    },
  },

  // ---- crypto/hmac ----
  'crypto/hmac': {
    zh: {
      intro: [
        'HMAC（Hash-based Message Authentication Code）用「共享密钥 + 哈希算法」为一段消息生成签名，用来证明消息确实来自持有密钥的一方，并且中途没有被改动。接口签名、Webhook 验签、云服务鉴权基本都是它的变体。',
        '它的结构是 H((K ⊕ opad) ‖ H((K ⊕ ipad) ‖ message))，因此在不知道密钥的情况下，攻击者无法伪造签名；即使知道消息原文，也无法反推密钥。常见算法有 HMAC-SHA256、HMAC-SHA512，SHA-1 已不推荐用于新系统。',
        '本站的 HMAC 计算全程在浏览器完成，密钥不会离开你的设备。不过生产环境的签名请务必在服务端完成，前端密钥等同于公开。',
      ],
      faq: [
        { q: 'HMAC 和普通哈希有什么区别？', a: '普通哈希（如 SHA256(消息)）任何人都能计算，只能校验内容是否完整，无法证明来源。HMAC 引入密钥，只有持有密钥的人才能生成正确签名，因此能同时验证完整性和身份。' },
        { q: 'HMAC 和「哈希加盐」是一回事吗？', a: '不是。加盐哈希（如 bcrypt）用于存储密码，盐值可以公开，目的是抗彩虹表和慢速爆破。HMAC 的密钥必须保密，用于消息认证。把 HMAC 当密码哈希用时，缺少慢速特性，容易被离线暴力破解。' },
        { q: '应该选哪个哈希算法？', a: '新系统用 SHA-256，安全裕度更高或需要长签名时用 SHA-512。MD5 和 SHA-1 已知存在碰撞问题，只在对接不支持其他算法的老系统时使用，并意识到风险。' },
        { q: '签名比对时要注意什么？', a: '必须用恒定时间比较（constant-time compare），逐字节短路比较会泄露「前几位匹配」的时间差，理论上可被计时攻击利用。多数语言的标准库提供 hmac.compare_digest 或 crypto.timingSafeEqual。' },
      ],
    },
    en: {
      intro: [
        'HMAC (Hash-based Message Authentication Code) signs a message with a shared secret plus a hash function. It proves the message came from someone holding the key and that it was not modified in transit — the basis of API signatures, webhook verification, and cloud service authentication.',
        'Structurally it is H((K ⊕ opad) ‖ H((K ⊕ ipad) ‖ message)), so without the secret an attacker cannot forge a signature, and even knowing the plaintext message does not reveal the key. Common choices are HMAC-SHA256 and HMAC-SHA512; SHA-1 is no longer recommended for new systems.',
        'Computation happens in your browser and the key never leaves your device. That said, production signing belongs on the server — a key shipped to the front end is a public key.',
      ],
      faq: [
        { q: 'How is HMAC different from a plain hash?', a: 'A plain hash such as SHA256(message) can be computed by anyone, so it only verifies integrity, not origin. HMAC adds a key: only the key holder can produce a valid signature, which authenticates both the data and the sender.' },
        { q: 'Is HMAC the same as salted hashing?', a: 'No. Salted password hashing such as bcrypt stores passwords safely; the salt is public and the goal is resisting rainbow tables and brute force. An HMAC key must stay secret and is used for message authentication. HMAC lacks the deliberate slowness, so it is the wrong tool for password storage.' },
        { q: 'Which hash algorithm should I pick?', a: 'SHA-256 for new systems, SHA-512 when you want more margin or a longer signature. MD5 and SHA-1 have known collision attacks — use them only when integrating with a legacy system that supports nothing else, and document the risk.' },
        { q: 'What matters when comparing signatures?', a: 'Use a constant-time comparison. A byte-by-byte early-exit comparison leaks how many leading bytes matched, which is exploitable in theory. Most standard libraries provide hmac.compare_digest or crypto.timingSafeEqual for this.' },
      ],
    },
  },

  // ---- crypto/jwt ----
  'crypto/jwt': {
    zh: {
      intro: [
        'JWT（JSON Web Token）由三段 Base64url 字符串拼成，用点号分隔：header 描述算法与类型，payload 携带声明（用户 ID、角色、过期时间），signature 用来证明前两段没有被篡改。登录态、单点登录、开放平台的 access token 大量使用它。',
        '解析面板会把三段分别还原成可读的 JSON，并把 exp、iat、nbf 这类时间戳换算成具体时间，同时标出是否已过期、距离过期还有多久。校验面板则用你提供的密钥检查签名是否有效。',
        '重要提醒：payload 只是编码不是加密，任何人都能解开看到内容。绝不要把密码、身份证号、支付信息放进 JWT 的 payload。本工具在浏览器内解析，Token 不会上传。',
      ],
      faq: [
        { q: 'JWT 的 payload 是加密的吗？', a: '不是。payload 只是 Base64url 编码，任何拿到 Token 的人都能解码阅读。JWT 保证的是完整性（内容没被改）而不是机密性（内容看不见）。需要保密时应在传输层用 HTTPS，或者把敏感字段加密后再放进去。' },
        { q: '为什么签名验证失败？', a: '常见原因：密钥不对（HS256 用的是原始密钥字符串，不是 Base64 解码后的值）；算法不匹配（Token 是 RS256 却用 HS256 校验）；密钥前后混入了换行或空格；Token 里有换行导致 Base64url 解析异常。逐段用解析面板确认结构往往能定位问题。' },
        { q: 'HS256 和 RS256 怎么选？', a: 'HS256 用同一个密钥签名和验证，实现简单，但所有验证方都持有密钥，适合单体服务。RS256 用私钥签名、公钥验证，验证方拿不到签名能力，适合多方验证和开放平台。' },
        { q: 'exp 过期后 Token 就失效了吗？', a: '这取决于验证方是否检查。规范要求服务端校验 exp、nbf、aud、iss，但很多实现只解码不校验，导致过期 Token 依然能用。安全的做法是服务端强制校验签名与时间声明。' },
      ],
    },
    en: {
      intro: [
        'A JWT (JSON Web Token) is three Base64url segments joined by dots: the header names the algorithm and type, the payload carries claims such as user id, role, and expiry, and the signature proves the first two were not altered. Session state, single sign-on, and open-platform access tokens rely on it heavily.',
        'The decoder restores each segment to readable JSON and converts exp, iat, and nbf into actual times, flagging whether the token has expired and how long is left. The verifier checks the signature with the secret or public key you provide.',
        'Important: the payload is encoded, not encrypted. Anyone holding the token can read it, so never put passwords, ID numbers, or payment data in the claims. Parsing happens in your browser and the token is never uploaded.',
      ],
      faq: [
        { q: 'Is the JWT payload encrypted?', a: 'No. It is Base64url encoded, which anyone can decode. JWT provides integrity — the content was not modified — not confidentiality. Protect it with HTTPS in transit, or encrypt sensitive fields before embedding them.' },
        { q: 'Why does signature verification fail?', a: 'Common causes: the wrong secret (HS256 uses the raw secret string, not a Base64-decoded value), a mismatched algorithm (an RS256 token verified with HS256), stray newlines or spaces around the key, or line breaks inside the token breaking Base64url decoding. Decode the segments first to confirm the structure.' },
        { q: 'HS256 or RS256?', a: 'HS256 signs and verifies with one shared secret. It is simple, but every verifier holds signing capability, which suits a single service. RS256 signs with a private key and verifies with a public key, so verifiers cannot mint tokens — the right choice for multi-party verification and open platforms.' },
        { q: 'Does an expired token stop working?', a: 'Only if the verifier checks. The spec expects services to validate exp, nbf, aud, and iss, but plenty of implementations decode without validating, so expired tokens keep working. Always enforce signature and time checks server-side.' },
      ],
    },
  },

  // ---- crypto/rsa ----
  'crypto/rsa': {
    zh: {
      intro: [
        'RSA 是最广泛部署的非对称加密算法：一对密钥分工明确——公钥可以随便公开，用来加密或验签；私钥必须保密，用来解密或签名。HTTPS 证书、代码仓库的 SSH 密钥、开放平台的请求签名都建立在它之上。',
        '这个页面提供三件事：生成密钥对（可选 1024/2048/4096 位，PEM 格式）、用公钥加密再用私钥解密、用私钥签名再用公钥验签。密钥只存在于当前页面内存里，刷新即消失。',
        '它是教学与调试工具，不适合直接承载生产密钥。真正长期使用的密钥应该在离线环境生成，并配合 HSM 或密钥管理服务。',
      ],
      faq: [
        { q: '密钥长度该选多少位？', a: '2048 位是当前最低标准，能满足绝大多数 HTTPS 与签名场景；4096 位安全裕度更高但运算慢数倍。1024 位早已不安全，只能用于复现历史问题。新系统不要低于 2048 位。' },
        { q: 'PKCS#1 和 PKCS#8 格式有什么区别？', a: 'PKCS#1 是 RSA 专用的密钥编码，头部分别是 BEGIN RSA PRIVATE KEY 和 BEGIN RSA PUBLIC KEY。PKCS#8 是通用的私钥容器，头部为 BEGIN PRIVATE KEY，可容纳任意算法，也是 OpenSSL 和 Java 现在的默认输出。对接时看对方文档要求哪一种。' },
        { q: '为什么加密长文本会失败？', a: 'RSA 能加密的数据量受密钥长度限制：2048 位配合 OAEP 填充，单次最多约 190 字节。超过就会报错。正确做法是混合加密——随机生成 AES 密钥加密正文，再用 RSA 加密这个 AES 密钥。' },
        { q: '签名和加密用的是同一把钥匙吗？', a: '密钥对相同，方向相反。加密用公钥、解密用私钥；签名用私钥、验签用公钥。不要混用：用私钥加密再用私钥解密在数学上可行，但语义错误，而且会破坏签名场景的安全假设。' },
      ],
    },
    en: {
      intro: [
        'RSA is the most widely deployed asymmetric algorithm, and the key pair has a clear division of labour: the public key can be shared freely and is used to encrypt or verify, while the private key stays secret and is used to decrypt or sign. TLS certificates, SSH keys for code hosting, and request signing on open platforms all rest on it.',
        'This page does three things: generate a key pair (1024/2048/4096-bit, PEM output), encrypt with the public key and decrypt with the private key, and sign with the private key and verify with the public key. Keys live only in page memory and vanish on refresh.',
        'Treat it as a learning and debugging tool, not a home for production keys. Long-lived keys belong in an offline environment backed by an HSM or a key management service.',
      ],
      faq: [
        { q: 'Which key size should I use?', a: '2048 bits is the current floor and covers most TLS and signing needs. 4096 gives more margin but is several times slower. 1024 is broken and only useful for reproducing legacy issues. Do not go below 2048 for anything new.' },
        { q: 'What is the difference between PKCS#1 and PKCS#8?', a: 'PKCS#1 is RSA-specific, with headers BEGIN RSA PRIVATE KEY and BEGIN RSA PUBLIC KEY. PKCS#8 is a generic private-key container headed BEGIN PRIVATE KEY that can hold any algorithm, and it is the current default for OpenSSL and Java. Follow whatever your integration partner documents.' },
        { q: 'Why does encrypting long text fail?', a: 'RSA can only encrypt as much as the key size allows: 2048 bits with OAEP padding tops out around 190 bytes per operation. Beyond that it errors. The correct pattern is hybrid encryption — generate a random AES key, encrypt the body with AES, then encrypt that AES key with RSA.' },
        { q: 'Do signing and encryption use the same key?', a: 'The same pair, in opposite directions. Encrypt with the public key, decrypt with the private key; sign with the private key, verify with the public key. Do not mix them up: encrypting with the private key is mathematically possible but semantically wrong and breaks the security assumptions of signing.' },
      ],
    },
  },

  // ---- text/dedup-lines ----
  'text/dedup-lines': {
    zh: {
      intro: [
        '从日志里捞出来的域名、几千行用户 ID、爬虫抓回来的链接列表，经常一大半是重复的。手工筛既慢又容易漏，重复行删除工具一次粘贴就能把重复项清干净。',
        '除了去重，它还能顺手完成排序、去除空行、忽略首尾空格、忽略大小写这几件事。去重时默认保留第一次出现的顺序，这样原始数据的逻辑没有被破坏，只是把重复项摘掉了。',
        '所有处理都在浏览器里完成，粘贴的名单不会上传——对于包含邮箱、手机号、用户 ID 的文本，这一点很重要。',
      ],
      faq: [
        { q: '去重后行的顺序会变吗？', a: '默认不变，保留每行第一次出现的位置。如果你勾选了排序，就会按字典序重排。两者可以组合使用：先去重再排序，或者先排序再去重，结果一致但保留的顺序不同。' },
        { q: '大小写和空格算不算不同？', a: '默认算不同，Example.com 和 example.com 会被当成两行。勾选忽略大小写、忽略首尾空格之后，它们会被视为同一行并合并。做域名或邮箱去重时建议都勾上。' },
        { q: '能处理多少行？', a: '几万到几十万行通常没问题，瓶颈在浏览器内存而不是算法。去重使用哈希集合，时间复杂度接近线性。如果数据超过百万行，建议用命令行工具 sort -u，速度更快也更省内存。' },
        { q: '空行会被删掉吗？', a: '默认保留空行，因为空行有时是段落分隔。如果只是想拿一份干净的列表，勾选「去除空行」即可。' },
      ],
    },
    en: {
      intro: [
        'Domains scraped out of logs, thousands of user IDs, a crawled list of links — a large share is usually duplicates. Filtering by hand is slow and error-prone; paste the list once and this tool removes the repetition.',
        'Beyond deduplication it can sort, drop blank lines, trim surrounding spaces, and ignore case. By default the first occurrence keeps its position, so the original order survives and only the repeats disappear.',
        'Everything runs in the browser. The list is never uploaded, which matters when the text contains emails, phone numbers, or user IDs.',
      ],
      faq: [
        { q: 'Does deduplicating change the order?', a: 'Not by default — each line keeps the position of its first occurrence. If you enable sorting, lines are reordered lexicographically. The two can be combined: dedupe then sort, or sort then dedupe, with the same content but a different preserved order.' },
        { q: 'Do case and whitespace count as differences?', a: 'Yes by default, so Example.com and example.com are two separate lines. Enable ignore-case and trim to merge them. For domain or email lists, turn both on.' },
        { q: 'How many lines can it handle?', a: 'Tens to hundreds of thousands is usually fine; browser memory is the limit, not the algorithm, which uses a hash set and runs close to linear time. Above a million lines, sort -u on the command line is faster and leaner.' },
        { q: 'Are blank lines removed?', a: 'They are kept by default, since blank lines sometimes mark paragraph breaks. If you just want a clean list, enable the remove-blank-lines option.' },
      ],
    },
  },

  // ---- text/diff ----
  'text/diff': {
    zh: {
      intro: [
        '两份配置差在哪一行、改版文案动了哪个词、接口返回为什么和昨天不一样——肉眼对比长文本几乎必然漏看。这个工具用差异算法逐行比对，把新增、删除、修改分别标色，还能切到字符级定位一句话里的具体改动。',
        '行级对比适合代码和配置文件，能清楚看到整块新增或删除；字符级对比适合合同、文案、翻译，改动可能只是标点或一个词。切换模式不用重新粘贴，结果实时更新。',
        '文本只在本地比较，不会上传到任何服务器。',
      ],
      faq: [
        { q: '行级和字符级对比该怎么选？', a: '看你想知道什么。想知道「删了哪几行、加了哪几块」用行级；想知道「这句话里改了哪个词」用字符级。行级结果更简洁，字符级结果更精确但视觉上更碎。' },
        { q: '为什么看起来一样的行也被标成了修改？', a: '多半是不可见字符差异：行尾空格、Tab 与空格的混用、全角与半角标点、换行符 CRLF 与 LF 不同。可以把编辑器的「显示不可见字符」打开，或者先统一格式再对比。' },
        { q: '多大的文本能对比？', a: '几千行内非常流畅。差异算法在极端情况下复杂度较高，几万行且差异极多时会明显变慢。处理大文件建议先分段，或者用 git diff 这类专用工具。' },
        { q: '对比结果会被保存吗？', a: '不会。比较过程完全在浏览器内存中完成，刷新页面即清空。涉及合同、内部文档时这点比功能本身更值得确认。' },
      ],
    },
    en: {
      intro: [
        'Which line differs between two configs, which word changed in the copy, why today response does not match yesterday — eyeballing long text guarantees missed differences. This tool compares line by line with the diff algorithm, colouring additions, deletions, and changes separately, and can switch to character level to pinpoint a change inside one sentence.',
        'Line mode suits code and configuration, where whole blocks are added or removed. Character mode suits contracts, copy, and translations, where the change may be a single punctuation mark or word. Switching modes does not require re-pasting; the result updates live.',
        'Comparison is local. Nothing is uploaded.',
      ],
      faq: [
        { q: 'Line mode or character mode?', a: 'It depends on the question. For "which lines were removed, which blocks were added" use line mode. For "which word in this sentence changed" use character mode. Line results read cleaner; character results are precise but visually fragmented.' },
        { q: 'Why is an apparently identical line marked as changed?', a: 'Usually invisible characters: trailing spaces, tabs mixed with spaces, full-width versus half-width punctuation, or CRLF versus LF line endings. Turn on show-invisible-characters in your editor, or normalize the formatting before comparing.' },
        { q: 'How much text can it compare?', a: 'A few thousand lines is smooth. Diff complexity grows in the worst case, so tens of thousands of lines with many differences will slow down noticeably. Split large files or reach for git diff instead.' },
        { q: 'Is the comparison stored?', a: 'No. It happens entirely in browser memory and is cleared on refresh — worth confirming when the documents are contracts or internal material.' },
      ],
    },
  },

  // ---- text/pinyin ----
  'text/pinyin': {
    zh: {
      intro: [
        '把中文转成拼音的需求比想象中多：给文件名做排序、生成 URL slug、给搜索做拼音匹配、给小朋友做识字练习、批量生成用户名。逐字查表太慢，这个工具支持整段粘贴，一次转换。',
        '输出形式可以切换：带声调（zhōng wén）、不带声调（zhong wen）、首字母缩写（zw）、以及带分隔符便于二次处理。多音字会按常见词典取一个默认读音，个别字需要你手工修正。',
        '转换在浏览器内完成，输入的中文不会上传。',
      ],
      faq: [
        { q: '多音字怎么处理？', a: '按内置词典给出最常用的读音，例如「银行」的「行」读 hang，「行走」的「行」读 xing，取决于分词与上下文。词典无法覆盖全部语境，人名、地名、古文中出现误读很正常，转换后需要人工核对。' },
        { q: '带声调和无声调有什么区别？', a: '带声调输出拼音的正确发音（ā á ǎ à），适合教学和注音；无声调输出纯字母，适合生成 slug、账号、文件名，因为声调符号在 URL 和多数文件系统里不友好。' },
        { q: '首字母缩写有什么用？', a: '常用于快速检索和简短标识，比如「北京大学」→ bjdx。做搜索建议时，同时建立全拼和首字母两个索引，用户输入 zw 或 zhongwen 都能命中。' },
        { q: '繁体字支持吗？', a: '常见繁体字能识别，但生僻字和异体字可能没有收录，遇到转换失败的字会原样保留。批量处理前建议先抽查一段样本。' },
      ],
    },
    en: {
      intro: [
        'Converting Chinese to pinyin comes up more often than expected: sorting filenames, generating URL slugs, building pinyin-based search matching, creating literacy exercises, or bulk-generating usernames. Looking characters up one at a time is slow — paste the whole passage and convert it at once.',
        'Several output styles are available: tone marks (zhōng wén), plain letters (zhong wen), initials only (zw), and separated syllables for downstream processing. Polyphonic characters get the most common reading from the dictionary, with a few needing manual correction.',
        'Conversion happens locally; the Chinese text is never uploaded.',
      ],
      faq: [
        { q: 'How are polyphonic characters handled?', a: 'The built-in dictionary picks the most common reading based on word segmentation and context — 行 in 银行 is hang, in 行走 it is xing. No dictionary covers every case, so names, place names, and classical text will occasionally be wrong. Proofread the output.' },
        { q: 'Tone marks or plain letters?', a: 'Tone marks give the correct pronunciation (ā á ǎ à) and suit teaching and annotation. Plain letters suit slugs, usernames, and filenames, because tone diacritics are awkward in URLs and across filesystems.' },
        { q: 'What are initials good for?', a: 'Fast lookup and short identifiers — 北京大学 becomes bjdx. For search suggestions, index both the full pinyin and the initials so users can type either zhongwen or zw.' },
        { q: 'Is Traditional Chinese supported?', a: 'Common traditional characters are recognized, but rare and variant characters may be missing, in which case they pass through unchanged. Sample a section before processing a large batch.' },
      ],
    },
  },

  // ---- number/random ----
  'number/random': {
    zh: {
      intro: [
        '抽奖编号、测试用的假数据、密码和 Token、验证码、初始化的随机种子——需要随机数的场景远比想象中多，而 Excel 里那套公式既难控制范围，也容易产生重复。',
        '这个工具可以生成指定区间的整数或小数、批量生成多个结果、生成随机字符串（可勾选大小写字母、数字、符号）、以及生成不会重复的编号序列。参数调好之后一键复制结果。',
        '需要提醒：浏览器提供的随机数来自伪随机数生成器，用于抽奖、测试数据完全够用，但不要用它生成生产环境的密钥或密码——那种场景应该使用 crypto.getRandomValues 或服务端的安全随机源。',
      ],
      faq: [
        { q: '生成的结果会重复吗？', a: '区间整数在未勾选「不重复」时可能出现重复，从概率上讲区间越接近数量越容易撞。需要唯一编号时请勾选不重复模式，工具会用洗牌算法保证一次批量结果内没有重复值。' },
        { q: '范围包含两端吗？', a: '包含。填 1 到 100 时，1 和 100 都可能出现。这与多数编程语言中左闭右开的区间不同，数学直觉上更符合「1 到 100 之间」的日常理解。' },
        { q: '随机字符串能当密码用吗？', a: '临时占位可以，正式密码不建议。浏览器的 Math.random 不是密码学安全的，攻击者可通过状态推断后续输出。真正需要密码时用 crypto.getRandomValues 或密码管理器生成。' },
        { q: '能一次生成多少个？', a: '批量数量上限取决于浏览器性能，几千个通常瞬间完成。数量很大时建议分批生成，避免一次粘贴到表格里造成卡顿。' },
      ],
    },
    en: {
      intro: [
        'Raffle numbers, fake test data, passwords and tokens, verification codes, seeds for an experiment — random numbers come up far more often than expected, and spreadsheet formulas are awkward to bound and prone to duplicates.',
        'This tool generates integers or decimals in a chosen range, batches of results, random strings with selectable character classes (upper case, lower case, digits, symbols), and unique number sequences. Tune the parameters and copy the result in one click.',
        'One caveat: browser randomness comes from a pseudo-random generator. It is perfectly fine for raffles and test data, but do not use it for production keys or passwords — use crypto.getRandomValues or a server-side secure source for that.',
      ],
      faq: [
        { q: 'Can the results repeat?', a: 'Integers can repeat unless you enable the unique option; the narrower the range relative to the count, the likelier a collision. For unique identifiers, turn uniqueness on — the tool shuffles to guarantee no duplicates within a batch.' },
        { q: 'Are both endpoints inclusive?', a: 'Yes. With 1 to 100, both 1 and 100 can appear. That differs from the half-open intervals in most programming languages but matches how people read "between 1 and 100".' },
        { q: 'Can I use a random string as a password?', a: 'For placeholders, sure; for real passwords, no. Math.random is not cryptographically secure and an attacker can infer future outputs from its state. Use crypto.getRandomValues or a password manager for real credentials.' },
        { q: 'How many values can I generate at once?', a: 'The practical ceiling is browser performance; a few thousand is instant. For very large sets, generate in batches so pasting into a spreadsheet does not freeze it.' },
      ],
    },
  },

  // ---- number/base-convert ----
  'number/base-convert': {
    zh: {
      intro: [
        '读协议文档时满屏的 0x1F、调试寄存器时的二进制位、看权限掩码时的八进制——同一个数在不同进制之间来回换算，是开发和运维都绕不开的基本功。',
        '这个工具支持二进制、八进制、十进制、十六进制之间的任意互转，输入任意一种，其他几种同步更新。大整数也能正确处理，不会因为超出 JavaScript 的 Number 安全范围而丢精度。',
        '换算在本地完成，输入的数字不会上传。',
      ],
      faq: [
        { q: '为什么有的工具转换大数会出错？', a: 'JavaScript 的 Number 用双精度浮点表示，超过 2^53-1 的整数会丢失精度，比如 9007199254740993 会变成 9007199254740992。本工具使用 BigInt 处理，因此 64 位整数也能精确转换。' },
        { q: '十六进制要不要写 0x 前缀？', a: '不写也能识别，写 0x 也支持，工具会自动剥离前缀。同理二进制前面的 0b、八进制的 0o 也会被正确处理，从代码里直接复制过来即可。' },
        { q: '负数和小数支持吗？', a: '负数按补码语义处理，具体表现取决于位宽，建议先在文档里确认目标平台用多少位表示。小数（浮点数）的进制转换涉及 IEEE 754 表示，本工具聚焦整数换算，浮点请使用专门的工具。' },
        { q: '经常需要转的进制有哪些？', a: '十六进制最常见——颜色值、内存地址、哈希片段、权限位；二进制用于位掩码和权限组合；八进制在 Linux 文件权限里仍在使用（如 0755）。日常记住 0x、0b、0o 三个前缀就够用了。' },
      ],
    },
    en: {
      intro: [
        'Protocol documents are full of 0x1F, register debugging means staring at binary bits, and Linux permissions are still octal — converting the same number between bases is basic literacy for developers and operators alike.',
        'This converter handles binary, octal, decimal, and hexadecimal in any direction: type one and the others update together. Large integers stay exact instead of silently losing precision beyond the JavaScript Number range.',
        'Conversion is local; nothing is uploaded.',
      ],
      faq: [
        { q: 'Why do some converters get large numbers wrong?', a: 'JavaScript represents numbers as double-precision floats, so integers above 2^53-1 lose precision — 9007199254740993 becomes 9007199254740992. This tool works with BigInt, so 64-bit values convert exactly.' },
        { q: 'Do I need the 0x prefix for hexadecimal?', a: 'No, but it is accepted. The prefix is stripped automatically, and the same goes for 0b in binary and 0o in octal, so you can paste straight from source code.' },
        { q: 'Are negative numbers and decimals supported?', a: 'Negatives are handled with complement semantics, and the exact result depends on the bit width — check what your target platform uses. Decimal fractions involve IEEE 754 representation; this tool focuses on integers, so use a dedicated converter for floats.' },
        { q: 'Which bases come up most often?', a: 'Hexadecimal by far — colour values, memory addresses, hash fragments, permission bits. Binary matters for bitmasks and permission combinations, and octal survives in Linux file modes such as 0755. Remembering the 0x, 0b, and 0o prefixes covers most daily needs.' },
      ],
    },
  },

  // ---- number/chinese-num ----
  'number/chinese-num': {
    zh: {
      intro: [
        '报销单、合同金额、发票抬头，凡是需要正式书写数字的场合，都要求把 12345.67 写成「壹万贰仟叁佰肆拾伍元陆角柒分」。手工写不但慢，还容易在「零」的位置、角分的进位、整与整圆之间出错。',
        '这个工具同时提供两种输出：财务大写（壹贰叁肆伍陆柒捌玖拾佰仟万亿元角分整）和中文读法（一万二千三百四十五点六七）。前者用于票据合同，后者用于朗读和普通说明。',
        '转换在浏览器内完成，输入的金额不会上传。',
      ],
      faq: [
        { q: '为什么金额大写里会出现「零」？', a: '中文数字有补零规则：连续的 0 只写一个「零」，末尾的 0 不写，但中间隔着单位的 0 必须补上。比如 10005 写成「壹万零伍」，10050 写成「壹万零伍拾」。手工写最容易在这里出错，工具会按规范自动补齐。' },
        { q: '「元」后面什么时候加「整」？', a: '金额没有角分时，末尾写「整」或「正」，例如「壹佰元整」。有角无分时写「壹佰元伍角整」，有分时直接写到分，如「壹佰元伍角叁分」，不再加「整」。' },
        { q: '为什么会有「壹拾」而不是「拾」？', a: '财务大写的规范要求十位写成「壹拾」而非常见的「拾」，目的是防止涂改——前面加一个字就改变了金额。同理「拾」前面通常不会有单独的「拾元」，而是「壹拾元」。' },
        { q: '支持多大的金额？', a: '支持到万亿级别（兆），足够覆盖绝大多数合同与财务单据。超过这个量级的数字在实际业务中很少见，若真需要请在文档中确认目标单位。' },
      ],
    },
    en: {
      intro: [
        'Expense forms, contracts, and invoices all require amounts written out formally, turning 12345.67 into the Chinese financial capital form. Writing it by hand is slow and error-prone precisely where the zeros, the jiao/fen carry, and the final zheng belong.',
        'Two outputs are provided: the financial capital form used on receipts and contracts, and the plain Chinese reading used for narration and general description.',
        'Conversion happens in your browser and the amount is never uploaded.',
      ],
      faq: [
        { q: 'Why do zeros appear in the capital form?', a: 'Chinese numerals have a zero-filling rule: consecutive zeros collapse into a single zero, trailing zeros are omitted, but a zero between units must be written. 10005 becomes the equivalent of ten thousand zero five, 10050 becomes ten thousand zero fifty. This is where hand-written forms usually fail.' },
        { q: 'When is the trailing whole marker added?', a: 'When there are no jiao or fen, the amount ends with the whole marker. With jiao but no fen, the marker still appears after the jiao. With fen present, the amount is written down to fen and the marker is dropped.' },
        { q: 'Why is ten written with a leading one?', a: 'Financial capital rules require the tens place to be written explicitly rather than as bare ten, so that a digit cannot be inserted in front to change the amount. It is an anti-tampering convention.' },
        { q: 'How large an amount is supported?', a: 'Up to the trillions range, which covers essentially every contract and financial document. Larger values are rare in practice; confirm the expected unit if you ever need them.' },
      ],
    },
  },

  // ---- number/sci-calc ----
  'number/sci-calc': {
    zh: {
      intro: [
        '需要算一下 2^32、sin(30°)、log2(1024)，或者验证一段表达式的结果对不对——打开计算器应用再切到科学模式，往往比直接输入一行表达式更麻烦。这个计算器接受完整表达式，支持括号、幂、开方、对数、三角函数和常量。',
        '输入 ox 开头的十六进制数、用 ^ 表示幂、用 pi 和 e 表示常量都可以。表达式会按标准优先级求值，括号可以任意嵌套，结果会同时给出小数和科学计数法。',
        '所有计算在浏览器里完成，不联网。',
      ],
      faq: [
        { q: '三角函数用的是弧度还是角度？', a: '默认弧度，这也是编程语言的通用约定。需要按角度计算时，要么自己乘 pi/180，要么在设置里切换到角度模式。sin(30) 在弧度下约等于 -0.988，在角度下才是 0.5，混淆这两者是最常见的错误。' },
        { q: '幂运算用什么符号？', a: '用 ^，例如 2^10 = 1024。注意 JS 里的幂运算符是 **，这里是计算器语法，两者不要混。负数底数记得加括号：(-2)^3 与 -2^3 结果不同。' },
        { q: '为什么会出现浮点误差？', a: '计算机用二进制表示小数，0.1 + 0.2 会得到 0.30000000000000004。这不是工具算错，而是 IEEE 754 的固有限制。涉及金额计算时应该用整数分或十进制库，而不是浮点数。' },
        { q: '支持哪些函数和常量？', a: '常见的 sqrt、abs、log、ln、log2、sin、cos、tan、asin、acos、atan、round、floor、ceil 都可以用，常量支持 pi 和 e。表达式非法时会直接提示错误，而不是返回 NaN。' },
      ],
    },
    en: {
      intro: [
        'Computing 2^32, sin(30 degrees), or log2(1024), or simply checking whether an expression evaluates the way you expect — opening a calculator app and switching to scientific mode is usually more work than typing one line. This calculator accepts full expressions with parentheses, powers, roots, logarithms, trigonometry, and constants.',
        'Hexadecimal input, ^ for exponentiation, and pi or e as constants all work. Expressions follow standard precedence, parentheses nest arbitrarily, and results are shown in both decimal and scientific notation.',
        'All computation is local and offline.',
      ],
      faq: [
        { q: 'Do trig functions use radians or degrees?', a: 'Radians by default, matching programming-language convention. For degrees, multiply by pi/180 yourself or switch to degree mode. sin(30) is about -0.988 in radians and 0.5 in degrees — mixing them up is the most common mistake here.' },
        { q: 'Which symbol means power?', a: 'Use ^, so 2^10 is 1024. JavaScript uses **, but this is calculator syntax. Wrap negative bases in parentheses: (-2)^3 and -2^3 are different.' },
        { q: 'Why is there a floating point error?', a: 'Computers represent fractions in binary, so 0.1 + 0.2 yields 0.30000000000000004. That is an IEEE 754 limitation, not a miscalculation. For money, use integer cents or a decimal library rather than floats.' },
        { q: 'Which functions and constants are available?', a: 'sqrt, abs, log, ln, log2, sin, cos, tan, asin, acos, atan, round, floor, and ceil, plus the constants pi and e. Invalid expressions report an error instead of returning NaN.' },
      ],
    },
  },

  // ---- frontend/flex-box ----
  'frontend/flex-box': {
    zh: {
      intro: [
        'Flexbox 只有十来个属性，但 flex-direction、justify-content、align-items、flex-wrap 之间的相互作用很难在脑子里推演。可视化编辑器让你一步步点选，右侧实时渲染出效果，同时给出可以直接复制的 CSS。',
        '页面把容器属性和子项属性分开配置：容器决定主轴方向、主轴与交叉轴的对齐、是否换行、间距；子项决定伸缩比例、自身对齐方式、排列顺序。改一项就能立刻看到差异。',
        '生成的 CSS 可以原样贴进项目，也可以用它来理解某个对齐效果到底该由哪个属性负责。',
      ],
      faq: [
        { q: 'justify-content 和 align-items 到底谁管哪个方向？', a: '取决于 flex-direction。主轴是 row 或 row-reverse 时，justify-content 管水平方向，align-items 管垂直方向；改成 column 后两者互换。记住「justify 永远沿主轴，align 永远沿交叉轴」就不会乱。' },
        { q: 'flex: 1 到底等于什么？', a: '它是 flex-grow: 1、flex-shrink: 1、flex-basis: 0% 的简写。basis 为 0 意味着先忽略内容宽度、把剩余空间按 grow 比例分配，所以多个 flex: 1 的子项会等分。若希望按内容宽度分配，就要改 basis 为 auto。' },
        { q: '为什么我的元素不换行？', a: 'flex-wrap 默认是 nowrap，所有子项会在一行内收缩，即使内容被压扁。需要换行时显式设置 wrap。注意换行之后 align-content 才开始控制多行之间的间距。' },
        { q: 'gap 会用出兼容问题吗？', a: '现代浏览器全面支持 flex 的 gap，但如果你要兼容非常老的浏览器，只能用 margin 模拟。新项目直接用 gap 更干净，也省去首尾元素去除外边距的麻烦。' },
      ],
    },
    en: {
      intro: [
        'Flexbox has only a dozen properties, but the interaction between flex-direction, justify-content, align-items, and flex-wrap is hard to simulate in your head. The visual editor lets you click through the options, renders the result live on the right, and emits CSS you can copy.',
        'Container properties and item properties are configured separately: the container decides the main axis, alignment on both axes, wrapping, and gaps; items decide grow ratios, self-alignment, and order. Change one value and the difference is immediately visible.',
        'The generated CSS can be pasted into a project as-is, and the page doubles as a way to learn which property is actually responsible for an alignment effect.',
      ],
      faq: [
        { q: 'Do justify-content and align-items control which axis?', a: 'It depends on flex-direction. With row or row-reverse, justify-content is horizontal and align-items is vertical; switching to column swaps them. Remember that justify always follows the main axis and align always follows the cross axis.' },
        { q: 'What does flex: 1 expand to?', a: 'It is shorthand for flex-grow: 1, flex-shrink: 1, and flex-basis: 0%. A zero basis means content width is ignored and free space is split by grow ratio, so several flex: 1 items end up equal width. Use basis: auto if content width should count.' },
        { q: 'Why is my content not wrapping?', a: 'flex-wrap defaults to nowrap, so all items squeeze into one line even when that flattens the content. Set wrap explicitly. Only after wrapping does align-content start controlling spacing between lines.' },
        { q: 'Does gap cause compatibility problems?', a: 'Every current browser supports gap in flexbox. Only if you must support very old browsers do you need margin workarounds. New projects should use gap — it also avoids removing margins from first and last children.' },
      ],
    },
  },

  // ---- frontend/css-formatter ----
  'frontend/css-formatter': {
    zh: {
      intro: [
        '从线上拉下来的 CSS 通常被压成一整行，几十条规则挤在一起，想找某个选择器只能靠全文搜索。CSS 格式化把规则重新拆行、按层级缩进、在冒号和分号后补空格，恢复成可读的样子。',
        '反向操作同样常用：把带注释和大量缩进的样式表压缩成单行，减少体积。支持 CSS、SCSS、Less 的常见语法，嵌套规则和媒体查询会被正确识别而不是被当成普通文本。',
        '格式化在浏览器内完成，样式表不会上传。',
      ],
      faq: [
        { q: '格式化和压缩会改变样式效果吗？', a: '不会改变语义。格式化只调整空白，压缩也只删除注释和多余空白。唯一的例外是压缩时如果误删了必要的空格（例如 calc 内部、选择器组合符前后），所以压缩后建议在实际页面上抽查。' },
        { q: '支持 SCSS 和 Less 吗？', a: '支持。嵌套规则、变量声明、混合宏的常见写法都能正确缩进。但格式化器不负责编译，SCSS 不会在这里变成 CSS，需要编译请用 sass 或构建工具。' },
        { q: '压缩会删除注释吗？', a: '会，这正是压缩的主要收益之一。如果你的注释需要保留（比如许可证声明），应该在压缩前单独保存，或者使用带保留选项的构建工具。' },
        { q: '为什么格式化后有的属性顺序变了？', a: '正规的格式化器不会重排属性，只会调整空白。如果你的结果里顺序发生变化，说明使用的工具额外做了属性排序。本工具保持原有声明顺序，避免引入意外差异。' },
      ],
    },
    en: {
      intro: [
        'CSS pulled from production is usually a single minified line with dozens of rules packed together, so finding a selector means searching the whole file. A formatter splits rules back onto separate lines, indents by nesting level, and adds spacing after colons and semicolons.',
        'The reverse is just as common: compressing a stylesheet full of comments and indentation into one line to cut bytes. CSS, SCSS, and Less syntax is understood, so nested rules and media queries are recognized rather than treated as plain text.',
        'Formatting happens locally and the stylesheet is never uploaded.',
      ],
      faq: [
        { q: 'Do formatting and minifying change the result?', a: 'They do not change semantics. Formatting only moves whitespace, and minifying removes comments and redundant whitespace. The one risk is a minifier eating significant spaces inside calc or around selector combinators, so spot-check the compressed output on a real page.' },
        { q: 'Are SCSS and Less supported?', a: 'Yes. Nested rules, variable declarations, and the common mixin syntax indent correctly. Note that a formatter does not compile — SCSS will not become CSS here; use sass or your build tool for that.' },
        { q: 'Does minifying remove comments?', a: 'Yes, and that is a large part of the size win. If a comment must survive, such as a licence header, save it separately or use a build tool that preserves it.' },
        { q: 'Why did property order change?', a: 'A correct formatter never reorders declarations, only whitespace. If your output is reordered, the tool applied an extra sort. This one preserves declaration order to avoid introducing accidental differences.' },
      ],
    },
  },

  // ---- frontend/box-shadow ----
  'frontend/box-shadow': {
    zh: {
      intro: [
        'box-shadow 有五个参数：水平偏移、垂直偏移、模糊半径、扩散半径、颜色，再乘以层数。想让卡片有「轻微浮起」的质感，往往要反复改数值、刷新页面、再看效果，一轮下来十分钟就没了。',
        '可视化调参把这段循环压缩成实时预览：拖动滑块，阴影立刻变化，同时生成可直接复制的 CSS。支持多层阴影叠加以实现更自然的层次感——真实世界的阴影从来不是一层。',
        '调好的参数可以保存为常用配置，也可以直接粘贴到项目里。',
      ],
      faq: [
        { q: '模糊半径和扩散半径有什么区别？', a: '模糊半径让边缘变虚，值越大越柔和，但阴影的范围大致不变；扩散半径让阴影整体放大或缩小，正值向外扩、负值向内收，边缘仍然清晰。做「柔和光晕」调模糊，做「实心投影」调扩散。' },
        { q: '为什么我的阴影看起来很脏？', a: '多半是颜色不透明。纯黑阴影在浅色背景上会显得生硬，真实阴影通常带一点环境色，并且透明度在 10% 到 25% 之间。把 rgba 的 alpha 降下来，再稍微调整色相，质感立刻不同。' },
        { q: '多层阴影怎么写？', a: '用逗号分隔，前面的层在上、后面的层在下。典型写法是先来一层贴近元素的紧阴影（大 alpha、小模糊），再来一层扩散大、颜色淡的远阴影，两层叠加就有纵深感。' },
        { q: 'box-shadow 和 filter: drop-shadow 有什么区别？', a: 'box-shadow 按元素的矩形盒子绘制，不跟随透明像素；drop-shadow 按实际不透明轮廓绘制，适合不规则形状和 PNG 图标，但性能开销更大。卡片和按钮用 box-shadow，图标和文字用 drop-shadow。' },
      ],
    },
    en: {
      intro: [
        'box-shadow takes five parameters — horizontal offset, vertical offset, blur radius, spread radius, colour — multiplied by the number of layers. Getting a card to look subtly lifted usually means editing numbers, refreshing, and squinting, ten minutes at a time.',
        'The visual editor collapses that loop into a live preview: drag a slider, the shadow updates instantly, and the CSS is ready to copy. It also supports stacking multiple shadows for natural depth, because real-world shadows are never a single layer.',
        'Tuned values can be kept as presets or pasted straight into the project.',
      ],
      faq: [
        { q: 'What is the difference between blur and spread?', a: 'Blur softens the edge — a larger value looks fuzzier without changing the overall footprint much. Spread scales the shadow: positive values push it outward, negative values pull it inward, and the edge stays hard. Use blur for a soft glow and spread for a solid drop.' },
        { q: 'Why does my shadow look dirty?', a: 'Usually because the colour is opaque. Pure black on a light background reads harsh, while natural shadows pick up ambient colour and sit at 10–25% alpha. Lower the alpha and shift the hue slightly and the depth improves immediately.' },
        { q: 'How do multiple shadows work?', a: 'Comma-separate them: earlier layers sit on top, later ones behind. A typical recipe is a tight shadow close to the element (higher alpha, small blur) plus a wide, faint one further out; the pair creates real depth.' },
        { q: 'How is box-shadow different from filter: drop-shadow?', a: 'box-shadow follows the element rectangular box and ignores transparent pixels. drop-shadow follows the actual opaque silhouette, which suits irregular shapes and PNG icons, at a higher performance cost. Use box-shadow for cards and buttons, drop-shadow for icons and text.' },
      ],
    },
  },

  // ---- frontend/gradient ----
  'frontend/gradient': {
    zh: {
      intro: [
        '渐变色是这几年界面设计里最常见的视觉元素：按钮的高光、卡片的背景、标题的强调、图表的填充。但线性渐变的角度、色标位置、径向渐变的形状，光靠想象很难判断最终效果。',
        '这个编辑器同时支持线性渐变和径向渐变：线性可以调角度和任意多个色标，径向可以调中心位置、形状和半径。颜色既能取色，也能直接输入 HEX 或 RGBA，还能调整每个色标的位置百分比。',
        '生成的是标准 CSS background 值，复制到任何项目都能直接用。',
      ],
      faq: [
        { q: '线性渐变的角度是怎么算的？', a: '0deg 表示从下往上，90deg 表示从左往右，180deg 表示从上往下。这与直觉里「0 度向右」不同，因为 CSS 的角度是按顺时针从向上方向开始计算的。记住 90deg 是常见的「左到右」就够用了。' },
        { q: '为什么渐变在深色背景上会有色带？', a: '当两个颜色的差异很小时，8 位色深不足以平滑过渡，就会出现肉眼可见的条纹。解决办法是增加中间色标、改用带噪点的贴图，或接受它在大多数屏幕上并不明显。' },
        { q: '径向渐变的形状怎么选？', a: 'circle 是正圆，ellipse 会随容器比例拉伸，通常更自然。size 用 farthest-corner 能让渐变覆盖到最远角落，而 closest-side 更集中。做光晕用 circle，做背景氛围用 ellipse。' },
        { q: '能生成透明渐变吗？', a: '可以。色标的颜色支持 alpha，把一端设为透明就能做淡出效果，常见于图片下方压一层从透明到深色的遮罩，用来保证文字可读性。' },
      ],
    },
    en: {
      intro: [
        'Gradients are everywhere in modern interfaces: button highlights, card backgrounds, emphasized headings, chart fills. But the angle of a linear gradient, the stop positions, and the shape of a radial one are hard to judge from imagination alone.',
        'This editor covers both linear and radial. Linear exposes the angle and any number of stops; radial exposes the centre, shape, and radius. Colours can be picked visually or typed as HEX or RGBA, and every stop supports a position percentage.',
        'The output is a standard CSS background value that works in any project.',
      ],
      faq: [
        { q: 'How is the linear gradient angle measured?', a: '0deg points from bottom to top, 90deg from left to right, and 180deg from top to bottom. That differs from the intuitive "0 degrees to the right" because CSS measures clockwise starting from up. Remembering that 90deg is the familiar left-to-right case covers most needs.' },
        { q: 'Why does my gradient band on dark backgrounds?', a: 'When two colours are very close, 8-bit colour depth cannot interpolate smoothly and visible stripes appear. Add intermediate stops, use a subtle noise texture, or accept that it is invisible on most screens.' },
        { q: 'Which radial shape should I choose?', a: 'circle stays round while ellipse stretches with the container, which usually looks more natural. farthest-corner expands the gradient to the furthest corner, while closest-side concentrates it. Use circle for glows and ellipse for ambient backgrounds.' },
        { q: 'Can I make a transparent gradient?', a: 'Yes. Stops support alpha, so setting one end transparent produces a fade — the classic overlay from transparent to dark beneath an image so text stays readable.' },
      ],
    },
  },

  // ---- frontend/css-animation ----
  'frontend/css-animation': {
    zh: {
      intro: [
        'CSS 动画的参数组合比看上去多：关键帧在哪些百分比、每个关键帧改了哪些属性、时长与缓动如何配合、是否循环、是否反向播放、结束后停在哪个状态。凭手写往往要改十几轮才能顺眼。',
        '这个编辑器让你添加关键帧、实时预览动效、调整时长和缓动曲线，并直接把 @keyframes 与 animation 属性一起生成出来。缓动除了预设的 ease、ease-in-out，也支持 cubic-bezier 自定义。',
        '生成的代码不依赖任何库，纯 CSS 即可使用。',
      ],
      faq: [
        { q: 'animation-fill-mode 有什么作用？', a: '它决定动画结束（或开始前）元素保持哪个状态。默认 none 会回到初始样式，forwards 保留最后一帧，backwards 在延迟期间就应用第一帧，both 兼顾两者。做「淡入后保持可见」这类效果必须用 forwards。' },
        { q: '为什么我的动画只播放一次就停了？', a: 'animation-iteration-count 默认就是 1。要循环请设置 infinite。另外注意 animation 的简写顺序容易写错，时长和延迟都是时间值，第一个是时长、第二个是延迟。' },
        { q: '哪些属性适合做动画？', a: 'transform（位移、缩放、旋转）和 opacity 由合成层处理，性能最好，不会触发重排。动画 width、height、top、left 会导致布局计算，在低端设备上容易掉帧。做位移优先用 translate 而不是改 margin。' },
        { q: 'cubic-bezier 怎么调？', a: '四个数字是控制点 P1 和 P2 的坐标，X 必须在 0 到 1 之间，Y 可以超出以制造回弹。开头平缓结尾快（缓入缓出）用 0.4, 0, 0.2, 1；想做弹性效果就让第二个 Y 大于 1。' },
      ],
    },
    en: {
      intro: [
        'CSS animations involve more parameters than they appear to: which percentages hold keyframes, which properties each frame changes, how duration pairs with easing, whether it loops, whether it reverses, and which state it holds when finished. Hand-writing usually takes a dozen rounds before it looks right.',
        'This editor lets you add keyframes, preview the motion live, adjust duration and easing curves, and emit both the @keyframes block and the animation property. Beyond the presets like ease and ease-in-out, custom cubic-bezier curves are supported.',
        'The generated code is plain CSS with no library dependency.',
      ],
      faq: [
        { q: 'What does animation-fill-mode do?', a: 'It decides which state the element keeps before and after the animation. The default none reverts to the initial style, forwards keeps the last frame, backwards applies the first frame during the delay, and both does both. Fade-in that stays visible requires forwards.' },
        { q: 'Why does my animation stop after one run?', a: 'animation-iteration-count defaults to 1. Set infinite to loop. Also watch the shorthand order: duration and delay are both time values, and the first is the duration while the second is the delay.' },
        { q: 'Which properties are safe to animate?', a: 'transform (translate, scale, rotate) and opacity are handled on the compositor and cost almost nothing, without triggering layout. Animating width, height, top, or left forces layout recalculation and drops frames on low-end devices. Use translate instead of margin for movement.' },
        { q: 'How do I tune a cubic-bezier curve?', a: 'The four numbers are the coordinates of control points P1 and P2. X must stay between 0 and 1, while Y can exceed the range to create overshoot. For a slow start and fast finish use 0.4, 0, 0.2, 1; for a bouncy feel push the second Y above 1.' },
      ],
    },
  },

  // ---- frontend/favicon ----
  'frontend/favicon': {
    zh: {
      intro: [
        '每个新项目都要做 favicon：浏览器标签页那一小块图标看着简单，实际要准备 16×16、32×32、180×180（iOS 主屏）、192 与 512（PWA），还要写对 HTML 里的 link 标签。手工切图加配置很容易漏项。',
        '这个生成器支持用文字（首字母、汉字）或上传图片来产出多尺寸图标，可以调整背景色、圆角、字体和字号，最后一并给出各个尺寸的文件与引入代码。',
        '图片处理全部在浏览器完成，上传的素材不会离开本机。',
      ],
      faq: [
        { q: '为什么需要多个尺寸？', a: '不同场景读取不同文件：浏览器标签页用 16/32，iOS 添加到主屏用 180 的 apple-touch-icon，Android 与 PWA 用 192 和 512，Windows 磁贴历史上还用过 150。只放一个 32 的图标，在高分屏和安装场景下就会模糊。' },
        { q: '文字图标适合什么场景？', a: '项目还在早期、没有设计资源时最实用：一个首字母加纯色背景就能获得可辨识的标签页图标。注意汉字在小尺寸下笔画会糊，16×16 里建议只放一个笔画简单的字或字母。' },
        { q: 'ico 和 png 的区别？', a: 'ICO 是能容纳多个尺寸的容器格式，老版本 IE 和部分书签管理器只认它；PNG 更通用，现代浏览器全面支持。实践上两者都放，用 link rel 区分，让浏览器自己挑。' },
        { q: '圆角和透明背景怎么处理？', a: '圆角最好在生成时烘进图片，而不是靠 CSS 给 img 加圆角，因为浏览器标签页和系统主屏不会应用你的样式。透明背景适合叠加在深色或浅色工具栏上，纯色背景则保证图标在任何主题下都清晰。' },
      ],
    },
    en: {
      intro: [
        'Every new project needs a favicon. That tiny tab icon actually requires 16×16, 32×32, 180×180 for the iOS home screen, 192 and 512 for PWA, plus the correct link tags in HTML. Slicing images and wiring it up by hand is easy to get wrong.',
        'This generator produces the full size set from text (an initial or a character) or an uploaded image, with adjustable background colour, corner radius, font, and size — and it emits the files together with the markup to include them.',
        'Image processing runs in the browser, so uploads never leave your machine.',
      ],
      faq: [
        { q: 'Why are multiple sizes needed?', a: 'Different contexts read different files: the tab uses 16 and 32, iOS home screen installs read a 180 apple-touch-icon, Android and PWA need 192 and 512, and Windows tiles historically used 150. Shipping only a 32 icon looks blurry on high-DPI screens and when installed.' },
        { q: 'When is a text icon appropriate?', a: 'Early in a project with no design assets, an initial on a solid colour already gives a recognizable tab icon. Keep in mind that complex characters smear at small sizes — at 16×16 stick to one simple letter.' },
        { q: 'ICO versus PNG?', a: 'ICO is a container that can hold several sizes and is the only format old IE and some bookmark managers understand; PNG is more universal and fully supported by modern browsers. Ship both and let the browser choose.' },
        { q: 'What about rounded corners and transparency?', a: 'Bake the rounding into the generated image rather than applying CSS border-radius to an img, because browser tabs and the OS home screen will not apply your styles. Transparent backgrounds blend into dark or light toolbars, while a solid background guarantees contrast in any theme.' },
      ],
    },
  },

  // ---- frontend/color-scheme ----
  'frontend/color-scheme': {
    zh: {
      intro: [
        '从品牌色出发配出一整套和谐的色板，是设计里最容易卡住的环节：既要保持识别度，又要保证文字可读性，还要有足够的层级来区分主次。靠肉眼一个个调，往往越调越乱。',
        '这个工具基于色彩理论自动推导互补色、类似色、三角色、四角色等配色方案，并给出每个颜色的 HEX、RGB、HSL 值。选中主色后可以一键切换方案，观察整体氛围的变化。',
        '计算结果在本地完成，不需要注册或上传。',
      ],
      faq: [
        { q: '互补色和三角色分别适合什么场景？', a: '互补色是色环上正对的一对，对比最强，适合强调按钮或需要抓眼球的区域，但大面积使用容易刺眼。三角色取色环三等分，层次更丰富且平衡，适合需要多个功能色又不想杂乱的界面。' },
        { q: '怎么保证文字在配色上可读？', a: '看对比度而不是看颜色本身。正文与背景的对比度至少 4.5:1，大号文字可以放宽到 3:1。深色背景配浅色文字、浅色背景配深色文字是基本规律，但中间色调很容易两边都不达标，需要用对比度工具验证。' },
        { q: 'HSL 和 HEX 哪个更好用？', a: 'HEX 更常见，直接用于 CSS 和设计工具；HSL 更符合人的直觉，调亮度只要改 L、调饱和度改 S，做同色系的深浅变化时特别顺手。实际项目里两者可以混用，CSS 都支持。' },
        { q: '生成的方案能直接用于生产吗？', a: '可以作为起点。真实项目还需要考虑无障碍对比度、深色模式下的反转、品牌规范里的既定色值，以及打印和低色域屏幕上的表现。建议把生成的色板当作探索工具，最终值仍要经过对比度校验。' },
      ],
    },
    en: {
      intro: [
        'Building a coherent palette from one brand colour is where design work usually stalls: it has to stay recognizable, keep text readable, and provide enough hierarchy to separate primary from secondary content. Eyeballing it one swatch at a time tends to make things worse.',
        'This tool derives complementary, analogous, triadic, and tetradic schemes from colour theory, and reports HEX, RGB, and HSL for each swatch. Pick a base colour, switch schemes, and watch the overall mood change.',
        'Calculation is local — no account, no upload.',
      ],
      faq: [
        { q: 'When should I use complementary versus triadic?', a: 'Complementary colours sit opposite each other on the wheel for maximum contrast — good for a call-to-action or a focal area, harsh when used over large surfaces. Triadic picks three evenly spaced hues, giving more variety while staying balanced, which suits interfaces with several functional colours.' },
        { q: 'How do I keep text readable?', a: 'Judge by contrast ratio, not by the colour itself. Body text needs at least 4.5:1 against its background, and large text can go down to 3:1. Light on dark and dark on light are safe patterns, but mid-tones often fail both ways — verify with a contrast checker.' },
        { q: 'HEX or HSL?', a: 'HEX is more common and drops straight into CSS and design tools. HSL matches human intuition: change L for lightness, S for saturation, which makes generating shades of one hue trivial. Real projects can mix both since CSS supports either.' },
        { q: 'Can the generated palette ship to production?', a: 'As a starting point, yes. Production also needs accessibility contrast checks, dark-mode inversion, brand-mandated values, and behaviour on print and low-gamut displays. Treat the palette as an exploration aid and validate final values.' },
      ],
    },
  },

  // ---- image/image-watermark ----
  'image/image-watermark': {
    zh: {
      intro: [
        '产品图要加品牌标识、设计稿要加版权说明、证件照要加「仅供办理某项业务使用」的防伪文字——水印是最直接的归属声明。但用专业软件批量处理，装软件和学操作的时间远超需求本身。',
        '这个工具支持文字水印和图片水印两种：文字可以调内容、字号、颜色、透明度、旋转角度和位置；图片水印可以上传 Logo、缩放并按九宫格摆放。处理完成后直接下载，不会残留 EXIF 里的拍摄地信息。',
        '图片只在你自己的浏览器里处理，不会被上传到服务器。涉及身份证、合同扫描件这类敏感图片时，这一点尤其重要。',
      ],
      faq: [
        { q: '水印应该加在什么位置？', a: '覆盖主体又不过分遮挡是关键。证件类文件通常平铺整张并降低透明度，让裁切无法绕过；产品图一般放右下角或底部居中，配合小字号。想防裁剪就把水印铺满并斜向排列。' },
        { q: '透明度设多少合适？', a: '文字水印常用 20% 到 40%：太低容易被忽略，太高会遮住内容。平铺防伪场景可以更低，配合重复排列；单点 Logo 可以高一些，但不要盖住主体细节。' },
        { q: '加完水印会损失画质吗？', a: 'JPEG 每次重新编码都会有损失，多次叠加尤其明显。如果原图是 PNG，尽量保持 PNG 输出；必须用 JPEG 时把质量设到 0.9 以上，并尽量避免反复处理同一张图。' },
        { q: '能批量加水印吗？', a: '一次处理一张最稳妥。批量场景建议用 ImageMagick 或 Sharp 写个脚本，参数固定、结果可复现，也避免浏览器在处理大量高分辨率图片时占用过多内存。' },
      ],
    },
    en: {
      intro: [
        'Product shots need a brand mark, design previews need a copyright note, ID scans need the "valid only for this purpose" line — a watermark is the most direct ownership claim there is. Professional software takes longer to install and learn than the task itself.',
        'Both text and image watermarks are supported: text with adjustable content, size, colour, opacity, rotation, and position; image watermarks from an uploaded logo that can be scaled and placed on a nine-cell grid. Download the result directly, with EXIF location data stripped.',
        'Images are processed in your browser and never uploaded, which matters when the file is an ID card or a signed contract.',
      ],
      faq: [
        { q: 'Where should the watermark go?', a: 'Cover the subject without hiding it. Identity documents are usually tiled across the whole image at low opacity so cropping cannot escape it; product photos take a small mark in the bottom-right or bottom-centre. To defeat cropping, tile and rotate.' },
        { q: 'What opacity works best?', a: 'Text watermarks usually sit between 20% and 40%: lower is easy to ignore, higher obscures content. Tiled anti-copy patterns can go lower since repetition compensates, while a single logo can be stronger as long as it stays off the key detail.' },
        { q: 'Does watermarking reduce quality?', a: 'JPEG loses a little every time it is re-encoded, and repeated passes compound it. Keep PNG output when the source is PNG; if JPEG is required, set quality above 0.9 and avoid reprocessing the same file.' },
        { q: 'Can it batch process?', a: 'One image at a time is safest. For batches, a script using ImageMagick or Sharp gives fixed parameters and reproducible results, and avoids the memory pressure of many high-resolution images in a browser tab.' },
      ],
    },
  },

  // ---- image/image-convert ----
  'image/image-convert': {
    zh: {
      intro: [
        'PNG 太占体积、JPEG 需要透明通道、设计给的图是 WebP 但旧系统不认——格式转换是上线前绕不开的一步。这个工具支持 PNG、JPG、WebP 等常见格式之间的互转，并允许调整质量与尺寸。',
        '转换在浏览器内用 Canvas 完成，不需要安装任何软件，也不会上传图片。对于需要处理的截图、产品图、说明配图，几十张也很快。',
        '一个常见建议：网页配图优先用 WebP，体积通常比 JPEG 小 25% 到 35%，而现代浏览器支持率已经很高；需要透明的图标仍建议用 PNG 或 SVG。',
      ],
      faq: [
        { q: '转成 JPEG 后透明背景去哪了？', a: 'JPEG 不支持透明通道，透明区域会被填充成白色或黑色。需要保留透明就必须输出 PNG 或 WebP。这是格式本身的限制，任何工具都无法绕过。' },
        { q: 'WebP 兼容性够用吗？', a: '现代浏览器（Chrome、Edge、Firefox、Safari 14+）全面支持 WebP，覆盖率已经非常高。如果仍需兼容极老的环境，可以同时提供 JPEG 作为回退，用 picture 标签让浏览器选择。' },
        { q: '转换会不会损失画质？', a: 'PNG 与 WebP 的无损模式不会损失；转成 JPEG 或使用有损 WebP 时会有损失，质量参数越低越明显。文字和线条图尽量用 PNG，照片用高质量 JPEG 或 WebP。' },
        { q: '能同时改尺寸吗？', a: '可以，转换时一并指定目标宽高即可。建议按显示尺寸的 2 倍导出以适配高分屏，而不是盲目保留原始大图——图片体积对首屏速度的影响非常直接。' },
      ],
    },
    en: {
      intro: [
        'PNG files are too heavy, JPEG cannot carry transparency, the designer shipped WebP but a legacy system rejects it — format conversion is an unavoidable pre-launch step. This tool converts between PNG, JPG, WebP, and other common formats, with adjustable quality and dimensions.',
        'Conversion uses Canvas inside the browser: nothing to install and nothing uploaded. Screenshots, product shots, and article images convert quickly, dozens at a time.',
        'A practical rule: prefer WebP for web imagery — typically 25–35% smaller than JPEG with broad modern support. Icons that need transparency still belong in PNG or SVG.',
      ],
      faq: [
        { q: 'Where did the transparent background go after converting to JPEG?', a: 'JPEG has no alpha channel, so transparent areas are filled with white or black. To keep transparency, output PNG or WebP — this is a format limitation no tool can work around.' },
        { q: 'Is WebP support good enough?', a: 'Modern Chrome, Edge, Firefox, and Safari 14+ all support WebP, and coverage is very high. If you must support extremely old environments, ship a JPEG fallback and let a picture element choose.' },
        { q: 'Does conversion lose quality?', a: 'PNG and lossless WebP do not. Converting to JPEG or lossy WebP does, more so at lower quality settings. Keep text and line art in PNG; use high-quality JPEG or WebP for photographs.' },
        { q: 'Can I resize at the same time?', a: 'Yes, set the target width and height during conversion. Export at twice the display size for high-DPI screens rather than keeping an oversized original — image weight directly affects first-paint speed.' },
      ],
    },
  },

  // ---- image/image-base64 ----
  'image/image-base64': {
    zh: {
      intro: [
        '把图标直接写进 CSS 或 HTML，可以省掉一次 HTTP 请求；把小图转成 Data URL 塞进 JSON，能让接口返回自包含的资源。Base64 就是这个转换的桥梁——把二进制图片变成纯文本。',
        '这个工具双向工作：上传图片得到 Base64 字符串（自动生成 data:image/png;base64,... 前缀），或者粘贴 Base64 字符串还原成图片并下载。适合处理小图标、占位图、邮件模板里的图片。',
        '转换在浏览器内完成，图片不会上传。',
      ],
      faq: [
        { q: 'Base64 图片会让文件变大吗？', a: '会，体积大约膨胀 33%。所以只适合小图——通常建议 10KB 以下，比如图标、加载占位图。大图内联会让 HTML 或 CSS 体积暴涨，反而拖慢首屏。' },
        { q: 'Data URL 有什么好处？', a: '减少请求数、避免额外的 DNS 和握手开销、让资源自包含（邮件模板、单文件 HTML 报告、离线页面都靠它）。代价是体积膨胀且无法被浏览器单独缓存。' },
        { q: '为什么复制出来的字符串那么长？', a: 'Base64 每 3 个字节编码成 4 个字符，加上 data URI 前缀和换行，长度通常是原文件的 1.3 到 1.4 倍。注意粘贴进 JSON 时要去掉换行，否则解析会失败。' },
        { q: '能还原成原始格式吗？', a: '能。data URL 前缀里带有 MIME 类型（image/png、image/jpeg 等），解码时会按它还原并允许下载。如果你的字符串缺少前缀，工具会按 PNG 处理，必要时可以手动补上。' },
      ],
    },
    en: {
      intro: [
        'Inlining an icon into CSS or HTML removes an HTTP request; embedding a small image as a Data URL lets an API response stay self-contained. Base64 is the bridge — binary image in, plain text out.',
        'The tool works both ways: upload an image to get a Base64 string with the data:image/png;base64,... prefix, or paste a Base64 string to restore and download the image. Handy for small icons, placeholders, and email templates.',
        'Conversion runs locally; images are never uploaded.',
      ],
      faq: [
        { q: 'Does Base64 make the image bigger?', a: 'Yes, roughly 33% larger. That is why it suits small files only — under about 10KB, such as icons and loading placeholders. Inlining large images bloats HTML or CSS and slows first paint.' },
        { q: 'What are the benefits of a Data URL?', a: 'Fewer requests, no extra DNS or handshake, and a self-contained asset — which is why email templates, single-file HTML reports, and offline pages rely on it. The costs are size inflation and no independent browser caching.' },
        { q: 'Why is the string so long?', a: 'Base64 encodes every 3 bytes as 4 characters, and the data URI prefix adds more, so expect 1.3 to 1.4 times the original size. Strip line breaks before pasting into JSON or parsing will fail.' },
        { q: 'Can it restore the original format?', a: 'Yes. The data URL prefix carries the MIME type (image/png, image/jpeg, and so on), which is used when decoding and downloading. If the prefix is missing the tool assumes PNG; add it manually if needed.' },
      ],
    },
  },

  // ---- image/svg-editor ----
  'image/svg-editor': {
    zh: {
      intro: [
        'SVG 是唯一能同时在网页、图标、印刷和动画里使用的矢量格式：放大不糊、体积小、可以用 CSS 改颜色。但它的语法是标签和路径数据，手写一个稍微复杂点的图形几乎不可能。',
        '这个编辑器提供可视化操作：添加矩形、圆形、线条、文字、路径，调整位置、大小、填充、描边，右侧实时预览，同时生成干净的 SVG 源码。源码可以直接复制进项目，也可以下载成 .svg 文件。',
        '所有编辑在浏览器内完成，不需要上传设计稿。',
      ],
      faq: [
        { q: 'SVG 和 PNG 该怎么选？', a: '图标、Logo、插图、需要缩放的图形用 SVG，体积小且任意分辨率都清晰；照片和复杂渐变图必须用 PNG 或 JPEG，因为位图信息无法用矢量表达。混用是最常见的性能问题来源之一。' },
        { q: '为什么我的 SVG 放进页面后尺寸不对？', a: '通常是缺少 viewBox。viewBox 定义了内部坐标系和可视范围，没有它浏览器只能按 width/height 强行拉伸。写好 viewBox 并去掉固定宽高，就能随容器自适应。' },
        { q: '能用 CSS 改 SVG 的颜色吗？', a: '可以，前提是 SVG 里的 fill 和 stroke 使用 currentColor 或没有内联固定色值。内联使用的 SVG 完全受 CSS 控制，用 img 标签引入的则不能通过外部 CSS 改色。' },
        { q: '路径数据（d 属性）看不懂怎么办？', a: '路径命令由字母加坐标组成：M 是移动到、L 是直线、C 是三次贝塞尔、Z 是闭合。理解这几个就够读大多数图标。复杂的路径建议直接用设计工具导出，不必手写。' },
      ],
    },
    en: {
      intro: [
        'SVG is the only format that works equally well in web pages, icon sets, print, and animation: it scales without blurring, stays small, and can be recoloured with CSS. Its syntax, however, is tags and path data — hand-writing anything more complex than a rectangle is impractical.',
        'This editor offers visual controls: add rectangles, circles, lines, text, and paths; adjust position, size, fill, and stroke; preview live on the right while generating clean SVG source. Copy the markup into a project or download the .svg file.',
        'Everything stays in the browser; no design file is uploaded.',
      ],
      faq: [
        { q: 'SVG or PNG?', a: 'Use SVG for icons, logos, illustrations, and anything that must scale — smaller and crisp at any resolution. Photographs and complex gradients need PNG or JPEG because raster detail cannot be expressed as vectors. Mixing them up is a common source of performance problems.' },
        { q: 'Why is my SVG the wrong size on the page?', a: 'Usually a missing viewBox. The viewBox defines the internal coordinate system and visible area; without it the browser can only stretch by width and height. Add a viewBox and drop the fixed dimensions so it adapts to the container.' },
        { q: 'Can CSS change SVG colours?', a: 'Yes, as long as the SVG uses currentColor or avoids hard-coded inline colours. Inline SVG is fully styleable by CSS; an SVG loaded through an img tag cannot be recoloured from outside.' },
        { q: 'How do I read path data?', a: 'Path commands are letters followed by coordinates: M moves, L draws a line, C is a cubic bezier, and Z closes the shape. Those few cover most icons. For anything complex, export from a design tool rather than writing it by hand.' },
      ],
    },
  },

  // ---- image/qrcode-parse ----
  'image/qrcode-parse': {
    zh: {
      intro: [
        '收到一张截图，里面是个二维码，不知道指向哪里；或者需要确认印刷出来的码还能不能扫。二维码解析工具从图片里识别码内容，直接把网址、文本、WiFi 配置还原出来。',
        '把图片拖进来或从剪贴板粘贴，识别在本地完成，几秒内给出结果。识别出的网址不会自动打开，需要你自己确认后再点——这一步可以避免误入钓鱼链接。',
        '图片不会上传到服务器，包含内部信息的二维码也可以放心解析。',
      ],
      faq: [
        { q: '为什么有些二维码识别不出来？', a: '常见原因：图片太模糊、码被裁掉了定位角、对比度不足（浅灰码在浅色背景上）、或者图片被严重压缩产生噪点。换一张更清晰的原图，或者放大截图后重试通常能解决。' },
        { q: '能识别屏幕上的二维码吗？', a: '可以，截图后粘贴进来即可。直接对着屏幕拍照也可行，但要注意反光和摩尔纹，拍摄角度尽量正对。' },
        { q: '识别结果里的链接安全吗？', a: '工具只负责识别，不判断安全性。二维码本身可以被指向任何地址，这也是钓鱼的常见手段。看到短链接、陌生域名、要求输入账号密码的页面，务必先核实来源。' },
        { q: '支持哪些类型的二维码？', a: '标准二维码（QR Code）都支持，包括网址、纯文本、WiFi 配置、名片信息、支付码等。内容类型由编码时的格式决定，解析后按原始文本展示，不会自动执行任何内容。' },
      ],
    },
    en: {
      intro: [
        'A screenshot arrives with a QR code and nobody knows where it leads, or a printed code needs to be checked before it ships. This tool reads the content out of the image and restores the URL, text, or WiFi configuration directly.',
        'Drop an image in or paste from the clipboard; recognition runs locally and returns a result in seconds. Recognized URLs are not opened automatically — you confirm before clicking, which avoids walking into a phishing link.',
        'Images are never uploaded, so codes containing internal information are safe to inspect.',
      ],
      faq: [
        { q: 'Why does some QR code fail to decode?', a: 'Typical causes: a blurry image, a cropped finder pattern, insufficient contrast (light grey on light background), or heavy compression noise. A sharper original or an enlarged screenshot usually fixes it.' },
        { q: 'Can it read a code from the screen?', a: 'Yes — take a screenshot and paste it in. Photographing the screen also works, but watch for glare and moire, and shoot as straight-on as possible.' },
        { q: 'Is the decoded link safe?', a: 'The tool decodes, it does not judge. A QR code can point anywhere, which is exactly why it is popular for phishing. Treat short links, unfamiliar domains, and login prompts as suspicious and verify the source first.' },
        { q: 'Which code types are supported?', a: 'Standard QR codes, including URLs, plain text, WiFi credentials, contact cards, and payment codes. The payload type was fixed at encoding time; the result is shown as raw text and nothing is executed.' },
      ],
    },
  },

  // ---- document/markdown-editor ----
  'document/markdown-editor': {
    zh: {
      intro: [
        'Markdown 用几个符号就能排出结构清晰的文档：标题、列表、代码块、表格、引用。写技术文档、README、会议记录、公众号草稿时，它比富文本编辑器更快，也不会带上乱七八糟的样式。',
        '这个编辑器采用左右分栏：左边输入，右边实时预览，滚动同步。支持标题、加粗斜体、链接、图片、无序与有序列表、任务清单、代码块、表格、引用、分割线与脚注等常用语法。',
        '编辑内容保存在浏览器本地，刷新不会丢；同时可以一键导出为 Markdown 源文件或 HTML。',
      ],
      faq: [
        { q: '为什么预览里的换行和输入不一样？', a: '标准 Markdown 会把单个换行视为空格，两个段落之间需要空一行。如果希望单个换行就生效，需要在行尾加两个空格，或者开启「软换行」选项。这是 Markdown 最常见的困惑。' },
        { q: '代码块怎么高亮？', a: '在三个反引号后写语言名即可，例如开头的 ```js 会让 JavaScript 代码高亮。不写语言名也能正常显示，只是没有语法着色。' },
        { q: '表格怎么写？', a: '表头一行，第二行用竖线和短横线分隔，之后每行是一条记录。对齐方式通过在短横线两侧加冒号控制：左边冒号左对齐，两边都有冒号居中，右边冒号右对齐。' },
        { q: '内容会丢吗？', a: '草稿保存在浏览器的本地存储里，正常刷新或关闭页面后再打开都在。但清除浏览器数据、使用无痕模式、或换设备都不会同步，重要内容记得导出保存。' },
      ],
    },
    en: {
      intro: [
        'Markdown renders a well-structured document from a handful of symbols: headings, lists, code blocks, tables, quotes. For technical docs, READMEs, meeting notes, and drafts it beats a rich-text editor — faster to write, and free of stray formatting.',
        'The editor uses a split view: type on the left, preview live on the right, with synchronized scrolling. Headings, bold and italic, links, images, ordered and unordered lists, task lists, code blocks, tables, quotes, horizontal rules, and footnotes are supported.',
        'Drafts persist in local browser storage across refreshes, and you can export the Markdown source or rendered HTML in one click.',
      ],
      faq: [
        { q: 'Why do my line breaks vanish in the preview?', a: 'Standard Markdown treats a single newline as a space; paragraphs need a blank line between them. For a hard break, end the line with two spaces or enable soft line breaks. This is the most common Markdown confusion.' },
        { q: 'How does code highlighting work?', a: 'Put a language name after the opening triple backticks — ```js highlights JavaScript. Omitting the language still renders a code block, just without colour.' },
        { q: 'How do I write a table?', a: 'One header row, a second row of dashes separated by pipes, then one row per record. Alignment comes from colons around the dashes: left colon for left-aligned, both for centred, trailing colon for right-aligned.' },
        { q: 'Can I lose my content?', a: 'Drafts live in local storage, so a normal refresh or reopen keeps them. Clearing browser data, private windows, and switching devices do not sync — export anything important.' },
      ],
    },
  },

  // ---- document/markdown-convert ----
  'document/markdown-convert': {
    zh: {
      intro: [
        '写好的 Markdown 最终往往要变成别的东西：贴进网站后台需要 HTML，导入邮件系统需要纯文本，发布到某些平台需要去掉所有格式。手动转换既慢又容易漏掉嵌套结构。',
        '这个工具把 Markdown 转成 HTML 或纯文本，HTML 会保留标题层级、列表、代码块和表格结构，纯文本则剥掉所有标记只留内容。适合处理 README、文档草稿、站内公告。',
        '转换在浏览器内完成，内容不会上传。',
      ],
      faq: [
        { q: '转成 HTML 后样式为什么没了？', a: 'Markdown 只描述结构，不描述样式。生成的 HTML 只带语义标签（h1、ul、pre），外观取决于你页面的 CSS。需要开箱即用的样式，就把生成的 HTML 放进已有样式体系的容器里。' },
        { q: '支持表格和代码块吗？', a: '支持。表格会转成 table 结构，代码块转成 pre 加 code，并保留语言标记。转成纯文本时，表格会退化为用空格或竖线分隔的文本行，可读性会下降。' },
        { q: '能反过来把 HTML 转成 Markdown 吗？', a: '本工具专注 Markdown → HTML / 纯文本这一个方向。HTML 反向转 Markdown 涉及大量样式与结构的取舍，建议使用专门工具，或直接手动整理。' },
        { q: '生成的 HTML 能直接贴进网站吗？', a: '可以，但要注意来源可信。Markdown 中允许内联 HTML，如果内容来自外部且未经过滤，直接渲染会有 XSS 风险。贴进自己的站点前先确认内容来源。' },
      ],
    },
    en: {
      intro: [
        'Markdown eventually has to become something else: HTML for a CMS, plain text for an email system, or fully stripped text for platforms that reject formatting. Doing it by hand is slow and tends to lose nested structure.',
        'This converter turns Markdown into HTML or plain text. HTML keeps heading levels, lists, code blocks, and tables; plain text drops every marker and keeps the content. Well suited to READMEs, doc drafts, and site announcements.',
        'Conversion runs locally, and the content is never uploaded.',
      ],
      faq: [
        { q: 'Why is there no styling in the HTML output?', a: 'Markdown describes structure, not appearance. The generated HTML carries semantic tags (h1, ul, pre) and looks however your page CSS says. For ready-made styling, drop the HTML inside your existing styled container.' },
        { q: 'Are tables and code blocks supported?', a: 'Yes. Tables become table markup and code blocks become pre plus code with the language preserved. In plain-text mode, tables degrade into rows separated by spaces or pipes and lose readability.' },
        { q: 'Can it convert HTML back to Markdown?', a: 'This tool goes one direction. HTML to Markdown involves many structural and styling trade-offs — use a dedicated converter or tidy it by hand.' },
        { q: 'Is the generated HTML safe to paste into a site?', a: 'It works, but trust the source. Markdown permits inline HTML, so rendering unfiltered external content carries XSS risk. Confirm where the content came from before publishing.' },
      ],
    },
  },

  // ---- document/pdf-merge ----
  'document/pdf-merge': {
    zh: {
      intro: [
        '报销要把发票合成一个文件、投标要把资质材料按顺序装订、教学要把讲义合并成一本——PDF 合并是办公里最高频的操作之一。在线工具大多要求先上传，涉及合同和证件时总让人不放心。',
        '这个工具在浏览器内直接处理：选择多个 PDF、拖动调整顺序、一键合并，然后下载结果。文件不上传、不入库，处理完刷新页面即从内存释放。',
        '适合几十页到几百页的常规文档。极端大的文件（数百 MB）受浏览器内存限制，建议先用本地工具拆分处理。',
      ],
      faq: [
        { q: '文件真的不会上传吗？', a: '不会。合并由浏览器内的 PDF 处理库完成，文件通过文件选择器读入内存，整个过程没有任何网络请求。断网状态下同样可以使用。' },
        { q: '合并会损失画质或书签吗？', a: '页面内容按原样复制，不会重新压缩，所以画质不变。书签、表单域、批注这类交互结构在合并时可能不保留，需要这些特性请用专业软件。' },
        { q: '能调整合并顺序吗？', a: '可以，在列表中拖动文件即可改变顺序，合并时按当前顺序拼接。这也是最容易被忽略的细节——发票顺序错了要重新提交。' },
        { q: '加密的 PDF 能合并吗？', a: '带打开密码的 PDF 需要先解密，工具无法处理受保护文件。如果只是限制了编辑和打印（权限密码），通常可以直接合并，但结果可能沿用原有的限制设置。' },
      ],
    },
    en: {
      intro: [
        'Expense reports need invoices stitched into one file, bids need qualification documents in order, and teaching material needs lecture notes bound together — merging PDFs is one of the most common office tasks. Most online tools demand an upload first, which is uncomfortable for contracts and certificates.',
        'This tool works directly in the browser: select multiple PDFs, drag to reorder, merge, and download. Files are never uploaded or stored, and they leave memory when the page is refreshed.',
        'It handles ordinary documents from dozens to hundreds of pages. Extremely large files (hundreds of megabytes) hit browser memory limits — split them with a local tool first.',
      ],
      faq: [
        { q: 'Are the files really not uploaded?', a: 'Correct. Merging is done by a PDF library running in the browser, reading files through the file picker into memory with no network requests at all. It works with the network disconnected.' },
        { q: 'Does merging reduce quality or drop bookmarks?', a: 'Page content is copied as-is without recompression, so image quality is unchanged. Interactive structures such as bookmarks, form fields, and annotations may not survive; use desktop software if you need those.' },
        { q: 'Can I change the merge order?', a: 'Yes — drag files in the list. Merging follows the visible order. It is the detail people miss most, usually after submitting invoices in the wrong sequence.' },
        { q: 'Can encrypted PDFs be merged?', a: 'Files with an open password must be decrypted first; protected documents cannot be processed. If only editing or printing is restricted with a permissions password, merging usually works, though the restrictions may carry over.' },
      ],
    },
  },

  // ---- document/pdf-split ----
  'document/pdf-split': {
    zh: {
      intro: [
        '一份两百页的合订本只需要其中三十页、扫描件要把每张发票单独拆出来、合同要给对方只发签字页——PDF 拆分解决的就是这类「从大文件里精确取一部分」的需求。',
        '支持三种方式：按页码范围提取（如 3-8,12,20-25）、每 N 页拆成一个文件、以及把每一页拆成独立文件。处理完可以逐个下载或打包下载。',
        '拆解全程在浏览器内完成，文件不上传，敏感合同可以放心处理。',
      ],
      faq: [
        { q: '页码范围怎么写？', a: '用逗号分隔多段，短横线表示区间，例如 1-5,8,12-20 会依次提取第 1 到 5 页、第 8 页、第 12 到 20 页。页码从 1 开始，不是从 0。' },
        { q: '拆分后原文件会改变吗？', a: '不会。原文件保持不动，拆分结果是一个或多个新文件。页面按原样复制，不会重新压缩，画质与原始一致。' },
        { q: '扫描件能自动识别页码吗？', a: '不能。拆分依据是 PDF 的物理页码，不是页面上印的页码。如果扫描件前面有封面、目录导致物理页码与印刷页码不一致，需要先确认偏移量再填写范围。' },
        { q: '能拆分加密或受保护的 PDF 吗？', a: '带打开密码的文件需要先解密。仅限制编辑与打印的文件通常可以拆分，但输出可能继承原有权限限制，再次编辑时同样受限。' },
      ],
    },
    en: {
      intro: [
        'A 200-page compilation where only 30 pages matter, a scan that needs each invoice separated, a contract that must go out as just the signature page — PDF splitting is about extracting exactly the part you need from a large file.',
        'Three modes: extract a page range such as 3-8,12,20-25, split into a file every N pages, or explode every page into its own file. Download results individually or as a package.',
        'Everything happens in the browser with no upload, so sensitive contracts are safe to process.',
      ],
      faq: [
        { q: 'How should page ranges be written?', a: 'Comma-separated segments with dashes for ranges. 1-5,8,12-20 extracts pages 1 to 5, then page 8, then pages 12 to 20. Numbering starts at 1, not 0.' },
        { q: 'Does splitting modify the original?', a: 'No. The source stays untouched and the output is one or more new files. Pages are copied as-is without recompression, so quality is identical.' },
        { q: 'Can it detect page numbers in a scan?', a: 'No. Splitting follows the physical page index of the PDF, not the number printed on the page. If a cover or table of contents shifts the offset, account for it before entering the range.' },
        { q: 'Can protected PDFs be split?', a: 'Files with an open password must be decrypted first. Documents that only restrict editing and printing usually split fine, though the output may inherit the original permission limits.' },
      ],
    },
  },

  // ---- life/date-calc ----
  'life/date-calc': {
    zh: {
      intro: [
        '算一算项目还有几天上线、两个日期之间隔了多久、某个日期加 90 天是哪一天——这些计算用日历数太慢，心算又容易在月份长度和闰年上翻车。',
        '这个计算器支持两种模式：差值模式给出两个日期之间的天数、周数和年月日差；推算模式支持在某个日期上加或减指定天数、周数、月数。跨闰年、跨月自动处理，不需要你记住哪个月有 31 天。',
        '计算在本地完成，输入的日期不会上传。',
      ],
      faq: [
        { q: '天数差包含首尾两天吗？', a: '默认算差值，即「从 A 到 B 经过了多少天」，不包含起始日。如果按工作日或含首尾计算，需要在此基础上加 1。签合同、算工期时这个差异经常导致争议，务必提前确认口径。' },
        { q: '加 1 个月是怎么算的？', a: '按日历月递增，而不是固定 30 天。1 月 31 日加 1 个月得到 2 月的最后一天（闰年 29 日、平年 28 日），这是主流日历库的通行做法。如果需要固定天数，请用「加天数」模式。' },
        { q: '结果受时区影响吗？', a: '日期本身不带时区，按你输入的日历日期计算。但如果前后端传递的是时间戳，就可能因为时区差导致日期偏移一天。涉及接口时建议统一使用日期字符串而非时间戳。' },
        { q: '能算工作日吗？', a: '当前版本按自然日计算，不排除周末和法定节假日。排期场景需要工作日计算时，要额外维护节假日表，一般用专门的排期工具或脚本处理更可靠。' },
      ],
    },
    en: {
      intro: [
        'How many days until launch, how long between two dates, what date is 90 days from now — counting on a calendar is slow, and mental arithmetic fails on month lengths and leap years.',
        'Two modes: difference gives days, weeks, and the year-month-day gap between two dates; offset adds or subtracts a number of days, weeks, or months from a date. Leap years and month boundaries are handled for you.',
        'Calculation is local; dates are never uploaded.',
      ],
      faq: [
        { q: 'Does the day difference include both endpoints?', a: 'By default it is the elapsed difference from A to B, excluding the start day. Inclusive or business-day counts add one on top. Contract deadlines and project durations often hinge on this distinction, so agree on the convention first.' },
        { q: 'How does adding one month work?', a: 'It increments by calendar month rather than a fixed 30 days. January 31 plus one month lands on the last day of February — 29 in a leap year, 28 otherwise — which is how mainstream date libraries behave. Use the day mode if you need a fixed count.' },
        { q: 'Do timezones affect the result?', a: 'A date has no timezone and is computed as the calendar date you entered. But if timestamps cross a boundary between client and server, the date can shift by a day. Prefer plain date strings over timestamps in APIs.' },
        { q: 'Can it count business days?', a: 'This version counts calendar days, without excluding weekends or public holidays. Scheduling that needs business days requires a holiday table, and a dedicated scheduler or script is more reliable.' },
      ],
    },
  },

  // ---- life/countdown ----
  'life/countdown': {
    zh: {
      intro: [
        '距离发布还有多少天、考研倒计时、纪念日倒数、产品发布会的倒计时牌——把时间可视化之后，紧迫感和期待感都会变具体。',
        '设置一个目标日期和时间，页面会实时显示剩余的天、时、分、秒，支持多个倒计时并列展示，也可以切换成「已经过去多久」的纪念日模式。',
        '倒计时在浏览器本地计算并保存，刷新后仍然存在，不需要注册账号。',
      ],
      faq: [
        { q: '刷新页面后倒计时还在吗？', a: '在。目标时间保存在浏览器本地存储里，重新打开会自动恢复。但清除浏览器数据或更换设备后不会同步，重要节点建议自己记一份。' },
        { q: '用的是本地时间还是北京时间？', a: '按你设备的本地时区计算。如果设备时区设置错误，倒计时也会偏差同样的时长。跨时区协作时建议同时标注目标时区。' },
        { q: '倒计时归零后会发生什么？', a: '会显示「已结束」或切换为已过去的时间。它不会触发任何提醒——浏览器页面无法在关闭后推送通知，需要提醒请配合日历或闹钟。' },
        { q: '可以同时跟踪多个日期吗？', a: '可以，添加多个倒计时条目并列展示，适合同时跟踪发布、考试、纪念日这类多个节点。' },
      ],
    },
    en: {
      intro: [
        'Days until launch, a countdown to an exam, an anniversary ticker, a launch-day board — visualizing time turns vague urgency and anticipation into something concrete.',
        'Set a target date and time and the page shows days, hours, minutes, and seconds in real time. Multiple countdowns can run side by side, and any of them can switch to counting up since a past date.',
        'Countdowns are computed and stored locally, surviving refreshes without an account.',
      ],
      faq: [
        { q: 'Does the countdown survive a refresh?', a: 'Yes. Target times live in local browser storage and restore automatically. Clearing browser data or switching devices does not sync, so note important dates elsewhere too.' },
        { q: 'Local time or a fixed timezone?', a: 'It follows your device timezone, so a wrong device setting shifts the countdown by the same amount. When coordinating across timezones, state the target timezone explicitly.' },
        { q: 'What happens at zero?', a: 'It shows that the event has ended or flips to counting up. Nothing is notified — a browser page cannot push alerts after it closes, so pair it with a calendar or alarm if you need reminders.' },
        { q: 'Can I track several dates at once?', a: 'Yes. Add multiple entries and view them side by side, which suits tracking a release, an exam, and an anniversary together.' },
      ],
    },
  },

  // ---- life/bmi ----
  'life/bmi': {
    zh: {
      intro: [
        'BMI（身体质量指数）用一个数字粗略反映身高与体重的比例，是体检报告和健身计划里最常见的参考指标。计算公式是体重（公斤）除以身高（米）的平方。',
        '输入身高和体重即可得到 BMI 值，并对照中国与 WHO 的分级标准给出区间判断。同时显示健康体重范围，让你知道在当前身高下，多少公斤落在正常区间。',
        '计算在本地完成，身高体重这类个人数据不会上传。',
      ],
      faq: [
        { q: 'BMI 的判定标准是什么？', a: '中国成人标准：低于 18.5 为偏瘦，18.5 到 23.9 为正常，24 到 27.9 为超重，28 及以上为肥胖。WHO 国际标准的上限略宽（正常到 24.9，超重 25 到 29.9），两套标准在亚洲人群上差异明显。' },
        { q: 'BMI 准确吗？', a: '它是一个粗略指标，不区分肌肉和脂肪。健身人群肌肉量大，BMI 可能显示超重但体脂正常；老年人肌肉流失，BMI 正常却可能有隐性肥胖。判断健康应结合体脂率、腰围和体检数据。' },
        { q: '儿童和孕妇能用吗？', a: '不适合。儿童需要按年龄和性别查百分位曲线，孕妇的体重增长有单独的医学建议区间。BMI 的成人分级标准不适用于这两类人群。' },
        { q: '为什么同一个人不同时间算出来略有差异？', a: '体重本身在一天内会波动一到两公斤，受饮食、饮水、排便和测量时间影响。建议固定在早晨空腹、同一台秤上测量，趋势比单次数值更有意义。' },
      ],
    },
    en: {
      intro: [
        'BMI (body mass index) condenses height and weight into one number and appears in almost every health check and fitness plan. The formula is weight in kilograms divided by height in metres squared.',
        'Enter height and weight to get the BMI value with a category under Chinese and WHO thresholds, plus the healthy weight range for your height so the target numbers are concrete.',
        'Calculation is local; personal measurements are never uploaded.',
      ],
      faq: [
        { q: 'What are the classification thresholds?', a: 'Chinese adult standard: below 18.5 underweight, 18.5 to 23.9 normal, 24 to 27.9 overweight, 28 and above obese. The WHO international cut-offs are looser (normal to 24.9, overweight 25 to 29.9), and the two differ noticeably for Asian populations.' },
        { q: 'Is BMI accurate?', a: 'It is a coarse measure that does not distinguish muscle from fat. Strength athletes can register as overweight with normal body fat, while older adults can lose muscle and be normal-weight but over-fat. Combine it with body fat, waist circumference, and lab results.' },
        { q: 'Does it work for children or pregnant women?', a: 'No. Children need age- and sex-specific percentile curves, and pregnancy has its own medically recommended weight-gain ranges. Adult BMI categories do not apply.' },
        { q: 'Why does the same person get slightly different numbers?', a: 'Body weight fluctuates one to two kilograms within a day depending on food, water, and timing. Measure in the morning, fasted, on the same scale — the trend matters far more than a single reading.' },
      ],
    },
  },

  // ---- life/age ----
  'life/age': {
    zh: {
      intro: [
        '填表要写周岁、入职要算工龄、办证件要确认是否满 18 岁——年龄看着简单，实际有周岁、虚岁、实岁好几种口径，稍不注意就算错。',
        '输入出生日期即可得到精确年龄（几年几个月几天）、周岁、虚岁，以及从出生到现在的总天数、总周数。还能推算下一次生日的日期和还有多少天。',
        '计算在本地完成，出生日期不会上传。',
      ],
      faq: [
        { q: '周岁和虚岁有什么区别？', a: '周岁按生日计算，过一个生日长一岁，法律和证件都用周岁。虚岁是传统计法，出生即 1 岁，每逢农历新年长一岁，因此同一个人虚岁通常比周岁大 1 到 2 岁。' },
        { q: '为什么 2 月 29 日出生的人特殊？', a: '闰日出生的人每四年才有一次真实生日。按周岁计算，平年通常以 2 月 28 日或 3 月 1 日作为生日节点，不同地区和系统的处理不一致，涉及法律文书时应以当地规定为准。' },
        { q: '总天数怎么算？', a: '按公历自然日累计，包含闰年多出来的一天。这个数字常用于计算工龄、保险缴费年限、或者纪念日天数，比「几年几月」更精确。' },
        { q: '能算到某个未来日期的年龄吗？', a: '可以，把目标日期设为计算基准即可，常用于判断某个时间点是否达到法定年龄，或计算退休时的年龄。' },
      ],
    },
    en: {
      intro: [
        'Forms ask for your age in full years, HR needs tenure, paperwork needs confirmation that you are over 18 — age looks trivial but has several conventions, and picking the wrong one produces the wrong answer.',
        'Enter a birth date to get the exact age in years, months, and days, plus total days and weeks lived, and the next birthday with the days remaining.',
        'Calculation is local; the birth date is never uploaded.',
      ],
      faq: [
        { q: 'How do full years differ from the traditional Chinese count?', a: 'Full years increment on each birthday and are what law and paperwork use. The traditional count starts at one at birth and increments at each lunar new year, so it typically runs one or two years ahead.' },
        { q: 'What about people born on February 29?', a: 'They have a real birthday only every four years. For full-year counting, non-leap years usually treat February 28 or March 1 as the boundary, and jurisdictions differ — defer to local rules for legal documents.' },
        { q: 'How are total days counted?', a: 'Calendar days in the Gregorian calendar, including the extra day in leap years. It is the more precise figure for tenure, insurance contribution periods, or anniversary tracking.' },
        { q: 'Can I compute age at a future date?', a: 'Yes — set the reference date. That is useful for checking whether someone reaches a legal age at a given moment, or for projecting retirement age.' },
      ],
    },
  },

  // ---- life/unit-convert ----
  'life/unit-convert': {
    zh: {
      intro: [
        '看国外的食谱遇到盎司、读英文文档看到英里、买屏幕要确认英寸和厘米的换算、做工程要处理压力单位——单位换算本身不难，难的是记不清换算系数，还容易在乘除方向上搞反。',
        '这个工具覆盖长度、重量、面积、体积、温度、速度、压力、数据存储、时间等常用类别，选择类别后输入任意一个单位，其余单位同步更新。结果保留足够精度，也提供常用档位的近似值。',
        '换算在本地完成，不需要联网。',
      ],
      faq: [
        { q: '温度换算为什么不像其他单位那样乘一个系数？', a: '摄氏与华氏之间是线性变换而非比例关系：F = C × 9/5 + 32。多了一个偏移量，所以不能简单乘以系数。绝对温度（开尔文）又不同，换算时注意区分。' },
        { q: 'MB 和 MiB 有什么区别？', a: 'MB 按十进制是 1000 的幂（1 MB = 1,000,000 字节），MiB 按二进制是 1024 的幂（1 MiB = 1,048,576 字节）。硬盘厂商用十进制标注容量，操作系统常用二进制显示，这就是「买来 500GB 只有 465GB」的原因。' },
        { q: '英制加仑和美制加仑一样吗？', a: '不一样。美制加仑约 3.785 升，英制（帝国）加仑约 4.546 升，相差约 20%。涉及油耗、容器容量时必须先确认是哪一种，这也是跨国数据最容易出错的地方之一。' },
        { q: '换算结果精度够吗？', a: '内部按标准换算系数计算，保留足够有效数字，日常使用完全足够。工程计量需要严格精度时，应以国家标准或行业规范给定的系数为准，不要依赖在线工具。' },
      ],
    },
    en: {
      intro: [
        'A foreign recipe lists ounces, a document mentions miles, a monitor spec needs inches to centimetres, engineering work involves pressure units — conversion is easy in principle, but the coefficients are hard to remember and easy to invert.',
        'Length, weight, area, volume, temperature, speed, pressure, data storage, and time are covered. Choose a category, type any unit, and the rest update together with enough precision plus approximate everyday values.',
        'Conversion is local and works offline.',
      ],
      faq: [
        { q: 'Why is temperature not a simple multiplication?', a: 'Celsius and Fahrenheit relate linearly but not proportionally: F = C × 9/5 + 32. The offset means no single coefficient works. Absolute scales such as Kelvin behave differently again, so watch which scale you are converting.' },
        { q: 'What is the difference between MB and MiB?', a: 'MB is decimal, a power of 1000 (1 MB = 1,000,000 bytes), while MiB is binary, a power of 1024 (1 MiB = 1,048,576 bytes). Drive vendors advertise decimal capacity while operating systems report binary — which is why a 500GB drive shows as about 465GB.' },
        { q: 'Are US and UK gallons the same?', a: 'No. A US gallon is about 3.785 litres and an imperial gallon about 4.546 litres, roughly 20% larger. Always confirm which one is meant for fuel economy or container capacity — it is one of the easiest cross-border data mistakes.' },
        { q: 'Is the precision sufficient?', a: 'Standard coefficients are used with enough significant digits for everyday purposes. For engineering metrology, rely on the coefficients specified by your national standard or industry code rather than an online tool.' },
      ],
    },
  },

  // ---- life/mortgage ----
  'life/mortgage': {
    zh: {
      intro: [
        '买房前最想知道的三件事：每月要还多少、总共要付多少利息、提前还款能省多少。计算器把这些数字一次算清，避免只看月供而忽略总成本。',
        '支持等额本息与等额本金两种还款方式：前者每月还款额固定，前期利息占比高；后者每月本金固定、月供逐月递减，总利息更少但前期压力大。输入贷款金额、年限、年利率即可对比两种方案。',
        '计算在本地完成，输入的金额不会上传。结果仅供参考，实际以银行审批与合同为准。',
      ],
      faq: [
        { q: '等额本息和等额本金哪个更划算？', a: '单看总利息，等额本金更少，因为它前期偿还的本金更多。但等额本息前期月供更低、现金流压力小，多出来的钱如果用于其他收益高于贷款利率的用途，实际未必吃亏。选择取决于现金流和投资收益，而不只是利息总额。' },
        { q: '提前还款一定能省钱吗？', a: '减少本金确实能减少后续利息，但要看合同是否有违约金、是否限制提前还款次数、以及还款方式是缩短年限还是减少月供。缩短年限省的利息更多，减少月供则改善现金流。' },
        { q: '利率是年利率还是月利率？', a: '贷款合同通常写年利率，计算月供时要除以 12 得到月利率。有些宣传材料会写「月息几厘」，需要换算成年化利率再比较，否则容易低估真实成本。' },
        { q: '计算结果和银行的不一致？', a: '常见原因：银行按实际天数计息、有额外的账户管理费或保险、利率是 LPR 加点且会随重定价日调整、或者首月按放款日到还款日的不完整周期计算。工具给的是标准模型下的理论值。' },
      ],
    },
    en: {
      intro: [
        'Three things matter most before buying a home: the monthly payment, the total interest, and how much early repayment saves. A calculator settles all three at once, so you are not judging by the monthly figure alone.',
        'Both repayment methods are supported. Equal payment keeps the monthly amount fixed with more interest early; equal principal keeps the principal fixed, so payments decline over time with less total interest but higher initial pressure. Enter amount, term, and annual rate to compare.',
        'All computation is local and nothing is uploaded. Results are for reference only — the bank approval and contract govern.',
      ],
      faq: [
        { q: 'Which repayment method is cheaper?', a: 'Equal principal wins on total interest because it repays principal faster. But equal payment has lower early payments and less cash-flow strain, and money freed up can earn more than the loan costs. The decision depends on cash flow and returns, not interest totals alone.' },
        { q: 'Does early repayment always save money?', a: 'Paying down principal does cut future interest, but check for prepayment penalties, limits on how often you may prepay, and whether the change shortens the term or lowers the payment. Shortening the term saves more interest; lowering the payment improves cash flow.' },
        { q: 'Is the rate annual or monthly?', a: 'Contracts usually quote an annual rate, so divide by 12 for the monthly rate. Marketing sometimes quotes a monthly rate in colloquial units — convert it to annualised before comparing, or the real cost looks far smaller than it is.' },
        { q: 'Why does the bank calculate differently?', a: 'Banks may accrue interest by actual days, add account fees or insurance, use a floating LPR plus a spread with repricing dates, or compute an irregular first period from disbursement to the first payment date. This tool shows the standard model.' },
      ],
    },
  },

  // ---- life/salary ----
  'life/salary': {
    zh: {
      intro: [
        '谈薪资时说「月薪两万」，实际到手往往少一大截：五险一金按什么基数扣、个税怎么累进、年终奖单独计税还是并入综合所得，每一项都影响最终数字。',
        '这个计算器按当前社保公积金比例与个税税率表，从税前工资推算到手金额，并拆解出养老、医疗、失业、公积金、个税各扣了多少。支持调整缴纳基数和比例，也支持年终奖单独计税的对比。',
        '计算在本地完成，收入数据不会上传。结果为估算，实际以当地社保政策和单位申报为准。',
      ],
      faq: [
        { q: '为什么到手金额比想象中少很多？', a: '因为扣除项不止个税。五险一金个人部分合计通常占税前工资的 10% 到 22%（公积金比例差异大），加上个税后才得到到手金额。公积金虽然扣除，但进入个人账户，实际仍属于你的钱。' },
        { q: '社保基数可以随便填吗？', a: '不能。缴费基数有上下限，通常是当地上年度社会平均工资的 60% 到 300%，超过上限按上限缴，低于下限按下限缴。很多公司按最低基数申报，这会影响你未来的养老金和公积金余额。' },
        { q: '年终奖单独计税划算吗？', a: '取决于金额。单独计税把年终奖除以 12 后按月度税率表计算，适合年终奖相对工资不高的情况；如果工资本身较低、扣除项没用完，并入综合所得可能更省。存在几个「临界点」，多发一元可能多交上千元税。' },
        { q: '计算结果和工资条对不上？', a: '常见原因：各地五险一金比例和基数不同、单位有补充公积金或商业保险、有专项附加扣除（房贷、租房、子女教育、赡养老人）、或者入职首月按实际天数折算。工具给的是通用模型下的估算值。' },
      ],
    },
    en: {
      intro: [
        'A 20,000 monthly offer rarely translates into 20,000 in hand: social insurance and housing fund bases, progressive income tax, and whether the annual bonus is taxed separately all change the final number.',
        'This calculator estimates take-home pay from a gross salary using standard contribution rates and tax brackets, breaking out pension, medical, unemployment, housing fund, and income tax. Contribution bases and rates are adjustable, and the annual bonus can be compared under separate taxation.',
        'Calculation is local and income data is never uploaded. Results are estimates; local social insurance policy and employer reporting prevail.',
      ],
      faq: [
        { q: 'Why is take-home much lower than expected?', a: 'Income tax is only one deduction. Employee social insurance and housing fund contributions typically total 10–22% of gross pay, with wide variation in housing fund rates. The housing fund portion is still yours — it lands in your personal account.' },
        { q: 'Can I choose any contribution base?', a: 'No. Bases are bounded, usually between 60% and 300% of the local average wage from the previous year; above or below those limits the bound applies. Many employers report at the minimum, which affects your future pension and housing fund balance.' },
        { q: 'Is separate taxation of the annual bonus better?', a: 'It depends on the amount. Separate taxation divides the bonus by 12 and applies the monthly bracket table, which favours a bonus that is modest relative to salary. If salary is low and deductions go unused, combining it may save more. There are cliff edges where one extra unit of bonus costs over a thousand in tax.' },
        { q: 'Why does this not match my payslip?', a: 'Local contribution rates and bases differ, employers may add supplementary housing fund or commercial insurance, special additional deductions (mortgage, rent, education, elder care) apply, and the first month is often prorated. This tool is a general model.' },
      ],
    },
  },
}

// ============ 查询函数 ============

const LANG_DOCS = toolContents

export function getToolContent(toolKey: string, locale: string): ToolContentDoc | null {
  const doc = LANG_DOCS[toolKey]
  if (!doc) return null
  const lang: ToolContentLang = locale.startsWith('zh') ? 'zh' : 'en'
  return doc[lang] ?? doc.en
}
