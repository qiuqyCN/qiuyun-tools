# 秋云工具国际化扩展方案（支持世界主流语言）

> 本轮仅方案，不改代码实现。基线：Nuxt 4.5.2 + `@nuxtjs/i18n@10.6.0` + `@nuxtjs/seo@5.3.16`，当前支持 `zh-CN`（无前缀）与 `en`（`/en` 前缀）。

---

## 一、现状盘点

### 1.1 语言包组织

| 项 | 现状 |
|---|---|
| 位置 | `app/locales/zh-CN.ts`、`app/locales/en.ts`，各 160 行、约 11 KB 未压缩 |
| 结构 | 扁平五段：`site` / `common` / `categories`（8 个分类）/ `tools`（52 个工具词条）/ `seoKeywords` |
| 工具键 | `'{categoryId}/{toolId}'`，如 `dev/json-formatter`；用 `/` 而非 `.` 以规避 i18n 嵌套路径解析 |
| 词条字段 | `tools: { name, desc }`、`seoKeywords: string`（逗号分隔长尾词） |
| 加载方式 | **静态 `import`**（见 `app/data/tools.ts:15-16`、`app/composables/useSiteSeo.ts:11-17`） |

### 1.2 存在两套并行的文案加载机制

| 机制 | 用途 | 入口 |
|---|---|---|
| A. 应用层直接 import | 工具名/描述/关键词/SEO 文案 | `tools.ts` → `getLocaleMessages()`；`useSiteSeo.ts` → `localeMessages` 常量表 |
| B. `@nuxtjs/i18n` 托管 | 页面里的 `$t()` | `nuxt.config.ts:9-36`，`langDir` 留空（曾因路径问题踩坑） |

两套机制各自读文件，**存在长期不一致风险**：新增语言要同时改 `i18n.locales` 与 `useSiteSeo.allLocales`，且 A 机制不走 i18n 的懒加载/兜底。

### 1.3 SEO 实现链路

| 能力 | 实现位置 | 关键逻辑 |
|---|---|---|
| 页面级 title/desc/keywords/OG | `app/composables/useSiteSeo.ts`（在 `layouts/default.vue` 顶层调用） | setup 阶段立即 `.value` 求值，绕开 SSR 下 computed 不求值问题 |
| hreflang | 同上 `alternatesMap` | 遍历硬编码的 `allLocales`（仅 2 项），`x-default` 固定指向 `zh-CN` |
| canonical | 同上 `useHead.link` | 每个语言页面自引用 |
| 结构化数据 | 同上 `jsonLdScript` | 首页 `WebSite`，工具页 `WebApplication` |
| html lang 兜底 | `app/server/plugins/fix-html-lang.ts` | `url.startsWith('/en') ? 'en-US' : 'zh-CN'` |
| sitemap | `nuxt.config.ts:83-117` | **手写**三片：`default` / `zh-CN` / `en`，其中 `default` 与 `zh-CN` 的 include 高度重叠 |
| robots | `nuxt.config.ts:71-81` | 手写 3 条 sitemap URL |

### 1.4 URL 与默认语言

- 策略 `prefix_except_default`：`zh-CN` → `/tools/dev/json-formatter`；`en` → `/en/tools/dev/json-formatter`。
- 默认语言 `zh-CN`，`detectBrowserLanguage` 已在 `redirectOn: 'root'` 下启用，cookie 键 `i18n_redirected`。
- 语言切换器 `app/components/LanguageSwitcher.vue` 位于内容区顶栏右侧，选项来自 `useI18n().locales`（这一处**是**配置驱动的，扩语言无需改代码）。

### 1.5 数据规模基线

- 工具：52 个词条（8 分类）。
- 每语言文案体量：约 11 KB（含关键词）。
- 全站可索引 URL：首页 2 + 工具页 52×2 ≈ 106。
- 方向相关样式类（`pl-/pr-/ml-/mr-/left-/right-`）：**46 处，分布在 17 个文件**（RTL 改造的真实工作量基线）。

---

## 二、扩展到多语言时最先出问题的地方（按爆发顺序）

### P0 — 一旦新增语言立刻出错，且影响 SEO 收录

**① `fix-html-lang.ts` 二元判断**
```ts
const isEn = url.startsWith('/en')
const correctLang = isEn ? 'en-US' : 'zh-CN'
```
新增 `/ja`、`/de` 后，这些页面的 `<html lang>` 全部被强制写成 `zh-CN`。Google 依据 `lang` 判断页面语言，等于所有新语言页面自我声明为中文 → 语言识别错乱、排名受损。**必须先改成配置驱动。**

**② `useSiteSeo.isHomePage` 硬编码 `'en'`**
```ts
if (segs.length === 1 && segs[0] === 'en') return true
```
`/ja`、`/de` 首页会被判为非首页，`seoTitle`/`seoDescription`/`seoKeywords` 返回空串，canonical 退化，JSON-LD 不生成。

**③ `allLocales` 硬编码 2 项**
```ts
const allLocales = [
  { code: 'zh-CN', ... }, { code: 'en', ... },
]
```
hreflang 永远只输出 2 个 + x-default，新语言页面不会被互相声明，等于新语言版本无法被正确发现与聚合。`og:locale`、JSON-LD `inLanguage` 同步出错。

**④ SEO 文案全是 `isZhCN ? 中文 : 英文` 二元分支**
`seoTitle`、`seoDescription`、`seoKeywords`、`ogTitle`、`jsonLdScript` 中至少 8 处（`useSiteSeo.ts:119-206`）。新增语言会直接落到英文分支 → 日语页面出现英文标题与描述，与 `html lang` 冲突，是典型的「低质/混杂语言」信号。

**⑤ 首页 JSON-LD `url` 固定为根路径**
```ts
url: `${siteUrl}/`
```
`/en` 首页的 WebSite 实体也声明为中文首页 URL，`@id` 冲突，多语言下会互相覆盖。

### P1 — 不致命但会持续劣化

**⑥ 语言包静态 `import`**
`tools.ts` 与 `useSiteSeo.ts` 都静态 import 全部语言包。10 种语言 ≈ 110 KB 未压缩文案进入**主包**（客户端也下发），首屏 JS 随语言数线性膨胀，且 SEO 只需当前语言。

**⑦ `getMsgs()` 静默回退 `zh-CN`**
```ts
return localeMessages[locale] ?? localeMessages['zh-CN']
```
缺 key 时不是报错而是渲染中文，日语页面会混入中文工具名。这类问题在验收时极易漏掉。

**⑧ sitemap / robots 手写**
新增语言要在 `nuxt.config.ts` 改两处（`sitemaps` 与 `robots.Sitemap`），且现有 `default` 片与 `zh-CN` 片 include 重叠（`['/', '/tools/**']`），会造成重复 URL 提交。

**⑨ 双轨文案机制**
新语言需要在 i18n 配置与 `useSiteSeo.allLocales` 两处登记；`$t()` 与直接 import 的文案可能不一致（例如 `site.name` 在一处改了另一处没改）。

### P2 — 规模化后才凸显

**⑩ hreflang 数量膨胀**：N 语言 → 每页 N+1 个 `<link rel="alternate">`。12 语言约增加 1.5-2 KB HTML/页，可接受；但超过约 20 语言时需评估（见 §六）。

**⑪ 关键词文件膨胀**：`seoKeywords` 是 52 工具 × 5-8 词 × N 语言，是语言包里体积最大的一块，且**只在服务端 SEO 用**，不需要下发客户端。

**⑫ 缺失翻译的页面策略未定义**：某语言只翻了 30/52 个工具时，剩余页面是「回退中文」还是「不存在」？现在没有规则，会自然走向「中文混排」→ 低质页。

---

## 三、目标语言范围与分批

### 3.1 「世界主流语言」的界定

按「母语人口 + 互联网内容量 + 开发者/工具类搜索需求 + 商业化价值」四维，建议覆盖 **12 种**（不含中文简繁重复计）：

| 语言 | 代码 | hreflang | OG locale | 方向 | 首批价值 |
|---|---|---|---|---|---|
| 英语 | `en` | `en` | `en_US` | LTR | 最高（存量） |
| 简体中文 | `zh-CN` | `zh-CN` | `zh_CN` | LTR | 默认 |
| 日语 | `ja` | `ja` | `ja_JP` | LTR | 高（开发者密度高、付费意愿强） |
| 德语 | `de` | `de` | `de_DE` | LTR | 高（欧洲工具类搜索量大） |
| 西班牙语 | `es` | `es` | `es_ES` | LTR | 高（母语人口第二） |
| 法语 | `fr` | `fr` | `fr_FR` | LTR | 高 |
| 葡萄牙语(巴西) | `pt-BR` | `pt-BR` | `pt_BR` | LTR | 中高 |
| 韩语 | `ko` | `ko` | `ko_KR` | LTR | 中高 |
| 意大利语 | `it` | `it` | `it_IT` | LTR | 中 |
| 俄语 | `ru` | `ru` | `ru_RU` | LTR | 中（开发者基数大） |
| 繁体中文 | `zh-TW` | `zh-TW` | `zh_TW` | LTR | 中（转换成本极低） |
| 阿拉伯语 | `ar` | `ar` | `ar_AR` | **RTL** | 中高但成本高 |
| 土耳其语 | `tr` | `tr` | `tr_TR` | LTR | 中 |
| 越南语 / 印尼语 / 荷兰语 / 波兰语 / 印地语 / 泰语 | `vi`/`id`/`nl`/`pl`/`hi`/`th` | 同名 | 对应 | LTR | 长尾 |

### 3.2 分批建议

**Phase 1 — 先补齐「高价值 + 非 RTL + 翻译质量可控」**
新增 `ja`、`de`、`es`（加上存量 `en`，共 4 语言 5 版本）。

理由：
- 三国/地区开发者工具搜索量与广告价值都在第一梯队；
- 均为 LTR，排版与布局零改造成本；
- 拉丁字母 + 日语假名，AI 初翻 + 人工/LLM 审校的可得性最好；
- 先跑通「非默认语言全链路」的工程验证，风险最低。

**Phase 2 — 扩到欧洲与东亚第二梯队**
`fr`、`pt-BR`、`ko`、`it`、`ru`、`zh-TW`。

理由：
- 复用 Phase 1 的链路，只增加内容；
- `zh-TW` 成本极低（繁简转换 + 术语差异校对，1 人即可完成）；
- 此时 URL 数达到 52×8 ≈ 400+，是测试 sitemap 分片与索引的合适规模。

**Phase 3 — 单独攻 RTL**
`ar`、`he`（希伯来语），可同时带 `tr`。

理由：
- RTL 需要独立的布局改造与回归窗口（见 §七），不应与内容翻译混在同一批；
- 阿拉伯语搜索量大，但机翻质量最不稳定，需要更强审校。

**Phase 4 — 长尾按数据决定**
`vi`、`id`、`nl`、`pl`、`hi`、`th`。

原则：先看前 3 阶段 GSC 的分语言曝光/点击，只对「有曝光但 CTR 低」的语言补内容，不盲目铺。

### 3.3 默认语言是否变更

**建议保持不变：`zh-CN` 为默认语言，`x-default` 指向 `zh-CN` 版本。**

理由：
- 现有 `/en` URL 已存在并被索引，改默认语言意味着全站 URL 结构翻转（中文要加 `/zh-CN`、英文要去前缀），会大面积产生跳转与权重迁移，收益不成比例；
- `x-default` 不强制等于默认语言，Google 只是用它作为「无匹配时的兜底版本」；
- 品牌主体为中文团队，默认中文有利于内部协作与内容首发。

**唯一可讨论的例外**：若后续要做「面向全球的英文主站 + 中文副站」，建议独立立项做 301 迁移，而不是在本方案里顺手改。

---

## 四、语言代码与 URL 前缀策略

### 4.1 保持 `prefix_except_default`

- `zh-CN`：`/`、`/tools/dev/json-formatter`
- 其他：`/<code>/`、`/<code>/tools/dev/json-formatter`
- 不引入子域名（`ja.qiuyun.tools`）或参数（`?lang=ja`）：前者割裂权重、需额外证书与 DNS，后者不被 Google 视为独立版本；现有 `/en` 已在索引中，继续用路径前缀最稳。

### 4.2 用「单一事实来源」替代分散硬编码

新增 `shared/locales.ts`（Nuxt 4 的 `shared/` 目录双方可用），把语言元信息收敛成一份：

```ts
export interface LocaleMeta {
  code: string        // URL 前缀来源，如 'zh-CN' / 'en' / 'ja' / 'pt-BR'
  prefix: string      // '' 表示无前缀（默认语言）
  hreflang: string    // 'zh-CN' / 'en' / 'ja' / 'pt-BR'
  ogLocale: string    // 'zh_CN' / 'en_US' / 'ja_JP'
  dir: 'ltr' | 'rtl'
  nativeName: string  // 语言选择器里显示的母语名：日本語 / Deutsch
  englishName: string // 管理后台/日志用
  iso: string         // 用于 <html lang>，如 'en-US'
}

export const DEFAULT_LOCALE = 'zh-CN'

export const LOCALES: LocaleMeta[] = [
  { code: 'zh-CN', prefix: '',   hreflang: 'zh-CN', ogLocale: 'zh_CN', dir: 'ltr', nativeName: '简体中文', englishName: 'Chinese (Simplified)', iso: 'zh-CN' },
  { code: 'en',    prefix: 'en', hreflang: 'en',    ogLocale: 'en_US', dir: 'ltr', nativeName: 'English',  englishName: 'English', iso: 'en-US' },
  // 新增语言只在这里加一行
]

export function buildLocalePath(locale: string, path = '/'): string {
  const meta = LOCALES.find(l => l.code === locale) ?? LOCALES[0]
  return meta.prefix ? `/${meta.prefix}${path === '/' ? '' : path}` : path
}
```

**改造点（对应 §二的 P0）：**
- `nuxt.config.ts` 的 `i18n.locales` 由 `LOCALES` 生成（保留 `file` 字段映射）；
- `useSiteSeo.ts` 的 `allLocales` 删除，改读 `LOCALES`；
- `isHomePage` 改为「路径去掉语言前缀后是否为空」；
- `buildHomeUrl/buildToolUrl` 统一走 `buildLocalePath`，不再出现 `=== 'zh-CN'`；
- `fix-html-lang.ts` 改为「取路径首段匹配 `LOCALES[].prefix`，命中则用其 `iso`，否则用 `DEFAULT_LOCALE.iso`」；
- `sitemap`/`robots` 也由 `LOCALES` 生成。

### 4.3 语言代码规范

- 对外 URL 用**短码**（`en`、`ja`、`de`、`es`、`fr`、`ko`、`it`、`ru`、`ar`、`tr`），有区域变体时用带区域码（`pt-BR`、`zh-TW`）。
- `hreflang` 与 URL 前缀解耦：`en` 前缀可以对 `hreflang: 'en'`（覆盖全部英语区）；若未来要区分英/美，再拆 `en-GB` 前缀，不影响存量。
- `<html lang>` 用 `iso`（`en-US`），不要用 URL 前缀（`en`），二者语义不同。

---

## 五、语言包工程化

### 5.1 文件拆分

```
app/locales/
  zh-CN/
    index.ts        # site / common / categories / ui
    tools.ts        # 52 个 name+desc
    seo.ts          # 52 个 seoKeywords
  en/ ...
  ja/ ...
```

- 拆分动机：`seo.ts` 体积最大且**仅服务端使用**，与 `ui/tools` 分离后可以完全不下发客户端。
- 保留 `tools` 的 `'{cat}/{tool}'` 键格式不变，避免动到 `tools.ts` 合并逻辑。

### 5.2 按语言懒加载（核心）

现状是静态 import 全量。目标链路：

```
请求 /ja/tools/dev/json-formatter
  → 服务端解析语言 ja
  → await loadMessages('ja')            # 只加载 ja
  → 注入 useState('locale-messages')   # 供 SSR 渲染与 SEO 使用
  → 生成的 HTML 不含其他语言包
客户端切换语言
  → await import('/locales/ja')         # 只拉 ja 的 chunk
```

落地建议（渐进，不一次性重构）：

**Step 1（低成本）** 用 `import.meta.glob` 惰性化：
```ts
const loaders = import.meta.glob('../locales/*/index.ts')
async function loadMessages(code: string) {
  const hit = loaders[`../locales/${code}/index.ts`]
  return hit ? (await hit()).default : (await loaders[`../locales/zh-CN/index.ts`]()).default
}
```
配合一个 app plugin 在 SSR 首次请求时 await 一次，之后模块级缓存命中，`getCategories()` 等同步函数继续可用。
→ 主包体积不再随语言数增长；改动面小。

**Step 2（语言数 ≥ 8 后再做）** 升级为服务端资产：
- 语言包构建产物放 `server/assets/locales/{code}.json`；
- SSR 用 `useStorage('assets:locales')` 读取（不进 JS bundle）；
- 客户端切换语言时 `$fetch('/api/locales/{code}')`（可设 immutable 缓存）。
→ 彻底零文案入包，代价是工具文案链路要从「同步」改为「SSR 预取 + 同步读缓存」，需要小重构。

### 5.3 缺失 key 的兜底与类型安全

**不做静默回退。** 改为三级显式策略：

```ts
// 1) 当前语言 → 2) 默认语言 → 3) 标记缺失
const text = msgs.tools?.[key] ?? defaultMsgs.tools?.[key]
if (!text && import.meta.dev) console.warn(`[i18n] missing: ${locale} ${key}`)
```

- **构建期校验（必须有）**：新增脚本 `scripts/i18n-check.ts`，以 `zh-CN` 为基准集合，逐个语言输出：
  - 缺失 key 列表（`tools` / `categories` / `seoKeywords`）
  - 多余 key 列表（已废弃工具残留）
  - `seoKeywords` 词数异常（过短/过长）
  - 与术语表不一致的条目
  挂到 `package.json`：`"i18n:check": "node --experimental-strip-types scripts/i18n-check.ts"`，CI 里作为门禁。
- **运行时类型安全**：由于 `tools` 是动态字符串键，TS 的 `satisfies` 只能保证 section 层结构（`site`/`common`/`categories` 的字段齐全），无法保证 52 个工具键全覆盖。**键集合的完整性靠脚本，字段结构靠 TS**，两者互补：

```ts
import zhCN from '../locales/zh-CN/index'
export type LocaleShape = typeof zhCN            // 字段结构约束
const en = { /* ... */ } satisfies LocaleShape    // 缺字段编译报错
export type LocaleCode = (typeof LOCALES)[number]['code']
```

- **页面级兜底规则（需产品决策）**：某语言工具未翻译时——
  - 推荐：**该工具页在该语言下不生成 URL**（sitemap 不含、请求 404），而不是回退中文页面。这样避免混杂语言低质页；
  - 首页/分类页可保留，但列出工具时对未翻译项降级展示（显示英文原名）。
  - 这条规则必须在 `getCategories()` 里实现：过滤掉 `!msgs.tools[key]` 的工具。

### 5.4 避免膨胀拖慢首屏的三条硬约束

1. 任何语言包**不得静态 import 进组件/composable**（只允许经 `loadMessages` 异步入口）；
2. `seoKeywords` 只在服务端读取，客户端永不加载；
3. 语言包 chunk 走构建 hash + `Cache-Control: immutable`，切换语言命中缓存。

---

## 六、52 个工具文案的翻译来源与维护流程

### 6.1 词条分层

| 层 | 内容 | 数量/语言 | 翻译要求 |
|---|---|---|---|
| L1 站点层 | `site.*`、`common.*`、8 个分类名 | ~20 | 人工定稿，术语表约束 |
| L2 工具名/描述 | 52 × `name` + `desc` | 104 | **必须人工/审校**，直接影响 `<title>` 与 H1 |
| L3 SEO 长尾词 | 52 × 5-8 词 | ~300 | AI 初翻 + 关键词本地化校验（不能直译） |
| L4 工具内 UI 文案 | 各工具页面内的标签/按钮/提示 | 每页 10-30 条 | 分批做，Phase 1 只做最高流量 10 个工具 |

> 注意：L4 是当前最大隐藏成本。`app/pages/tools/**` 里的中文界面文案尚未 i18n 化，切到日语后工具内部仍是中文。**这会让工具页标题（日语）与正文（中文）冲突**，SEO 效果会被稀释。

### 6.2 术语表（Glossary）

先建立 `docs/i18n-glossary.csv`（或 TS），至少覆盖：

| zh-CN | en | 说明 |
|---|---|---|
| JSON 格式化 | JSON Formatter | 固定，不译成 "Beautifier" |
| 正则表达式 | Regular Expression / Regex | 标题用 Regex Tester |
| 时间戳 | Timestamp | |
| 加密 / 哈希 | Hash / Encryption | 区分 hash 与 encrypt |
| 二维码 | QR Code | |
| 图片压缩 | Image Compressor | |
| 房贷计算器 | Mortgage Calculator | |

规则：**工具名以 `tools.ts` 的 route id 为锚**，名称在 locale 文件与页面 H1 中只能有一个来源。

### 6.3 流程（每语言一条流水线）

1. **锁定基准**：`zh-CN` + `en` 由人工定稿，视为「权威文本」；
2. **AI 初翻**：统一 prompt + 术语表 + 禁止意译上限 + 输出严格 JSON（与 locale 结构一致）；
3. **回译校验**：把译文回译成中文，与原文比对差异，标出语义漂移项；
4. **人工/母语审校**：L2（工具名/描述）必须人工过一遍；L3 可抽样；
5. **落盘**：生成 `app/locales/{code}/tools.ts` 与 `seo.ts`；
6. **门禁**：跑 `i18n:check`，key 完整 + 术语命中 + 长度限制（title ≤ 60 字符、desc ≤ 155 字符按语言放宽）；
7. **上线观察**：GSC 分语言看曝光，2 周后回收低 CTR 词条再迭代。

### 6.4 保证「工具页标题」与 `tools.ts` 一致

现状风险：H1 可能来自页面组件的 props，`<title>` 来自 `useSiteSeo` 的 `toolSeoInfo`，两处独立取值。

统一规则：
- 唯一取数函数：`getToolText(categoryId, toolId, locale)`（`tools.ts` 已有）；
- 页面 H1 与 `<title>` **都**调用它，不允许页面内硬编码标题；
- `<title>` 模板统一：`{toolName} - {categoryName} | 秋云工具`（外语对应 `| Qiuyun Tools` 等），由 `site.name` 提供后缀，避免每语言手拼；
- 加一个脚本断言：遍历 `baseCategories`，对每个 locale 校验 `tools` 键存在且 `name` 非空——即 `i18n:check` 的一部分。

---

## 七、SEO 规模化

### 7.1 hreflang

- 规则：每个语言页面输出**全部**可访问语言版本 + `x-default`（指向默认语言）。N 语言 = N+1 个 link。
- 必须满足：自引用（自己那一条必须包含）、双向（A 指向 B，B 必须指向 A）、完整绝对 URL。
- 容量：12 语言 ≈ 13 个 link ≈ 1.5-2 KB/页，可接受；到 20+ 语言时再考虑精简（只保留主要语言 + x-default，其余靠 sitemap 声明）。
- `x-default` 维持指向 `zh-CN`（见 §3.3）。
- **不要**给「未翻译、不存在」的语言生成 hreflang（会指向 404，属明确错误）。

### 7.2 sitemap 分片与索引

现状问题：`default` 与 `zh-CN` 两片 include 重叠 → 同一 URL 在两个 sitemap 出现。

目标配置（由 `LOCALES` 生成，不再手写）：
```
/sitemap_index.xml          # 索引
  ├── /sitemap-zh-CN.xml    # 默认语言
  ├── /sitemap-en.xml
  ├── /sitemap-ja.xml
  └── ...
```
- 每片只含该语言的 URL，**互不重叠**；
- 每个 `<url>` 带完整的 `xhtml:link` hreflang 组（`@nuxtjs/sitemap` 的 i18n 集成可自动生成）；
- URL 规模：52 工具 × 12 语言 ≈ 624 + 首页 12，单文件远低于 50k 上限，分片仅为**诊断与提交便利**，不必强制；
- `robots.txt` 改为引用 `sitemap_index.xml` 一条（模块自动生成，去掉手写 3 条）。

### 7.3 canonical

- 每个语言页面**自引用** canonical，不做跨语言 canonical 合并（会丢掉该语言的独立排名）。
- 带 query 的 URL（如工具内筛选参数）统一 canonical 到无参版本。
- 未翻译语言的工具页：404 或 `noindex,follow`（见 §5.3），**不可** canonical 回中文页（等于告诉 Google 该页是中文的重复内容）。

### 7.4 结构化数据本地化

| 字段 | 规则 |
|---|---|
| `inLanguage` | 用 `iso`（`ja`、`de`、`pt-BR`） |
| `name` / `description` | 用本地化文案（`getToolText` 结果） |
| `url` | 用该语言完整 URL（修复现状 `/en` 首页仍写根 URL 的问题） |
| `applicationCategory` | 保持 schema.org 英文枚举值，不翻译 |
| `Organization` | 品牌名「秋云工具」保留中文 + `alternateName: "Qiuyun Tools"`；各语言 aria/description 本地化 |
| 首页 `WebSite.potentialAction.target` | 带语言前缀，如 `/ja/tools/{search_term_string}` |

### 7.5 避免机翻被判定低质

1. **不铺薄页**：`name` 与 `desc` 必须有本地化关键词，不是逐字直译；`desc` 按语言重写而非翻译。
2. **分批放量**：一次上线 1-3 种语言，观察 2-4 周 GSC 再扩，避免「数百个机翻页面同日出现」的算法信号。
3. **语言一致性**：`html lang`、`<title>`、H1、正文、JSON-LD `inLanguage` 必须同一语言（现状 P0 问题 ①④ 会直接破坏这条）。
4. **避免重复内容**：不同语言的页面是独立内容，不做跨语言 canonical；但同语言内不同 URL（带参、尾斜杠）必须合并。
5. **工具页有真实功能价值**：工具本身可交互，这是与纯机翻站的本质区别；确保 `desc` 说明的是真实能力，不堆关键词。
6. **`hreflang` 与 `sitemap` 一致**：两处声明的语言集合必须相同，否则 GSC 报「hreflang 冲突」。

---

## 八、前端体验

### 8.1 语言切换器

- 现位置合适（顶栏右侧，与 GitHub 并列），保留。
- 语言数 ≤ 6：平铺下拉即可。
- 语言数 > 6：改为分组 + 搜索：
  ```
  [🌐 日本語 ▾]
  ├ 常用：简体中文 / English / 日本語 / Deutsch / Español
  └ 更多语言…（可输入搜索）
  ```
- 显示用**母语名**（日本語 / Deutsch / Español / Português），不要用英文名。
- 无障碍：`aria-label="切换语言"`、键盘可达、`lang` 属性标注按钮文本本身的语言。

### 8.2 语言记忆

- 现状：仅 cookie `i18n_redirected`（`@nuxtjs/i18n` 的 `detectBrowserLanguage`）。
- 建议双写：cookie（服务端可读）+ `localStorage`（客户端优先），键名统一 `locale`。
- 切换语言后**保留当前路径**：`/tools/dev/json-formatter` → `/ja/tools/dev/json-formatter`。`setLocale` 默认会替换前缀，但需验证工具页路径与 `[...slug].vue` 的 `route.path` 解析在新前缀下仍正确。
- 切换后更新 `<html lang>` 与 `<html dir>`（RTL 时）。

### 8.3 Accept-Language 自动跳转：利弊与结论

| 维度 | 影响 |
|---|---|
| 首访体验 | 有利：用户看到母语 |
| 爬虫 | **主要风险**：Googlebot 通常声明 `en-US` 或不带该头。若服务端 302，根 URL 会被跳到某语言，其他语言版本只能靠 sitemap 发现，且「用户/爬虫看到不同内容」有 cloaking 嫌疑 |
| 缓存 | CDN 需按 `Accept-Language` 分 `Vary`，否则缓存串语言 |
| 回访 | cookie 已记住，反向影响小 |

**结论建议：**

- 保留 `redirectOn: 'root'`（只在根路径生效，现状已如此），这是相对安全的配置；
- 但把跳转从「服务端 302」改为「客户端软跳转」或「不跳转 + 语言推荐条」：
  - **推荐方案**：根路径始终 200 渲染 `zh-CN`（不跳转），页面顶部展示一条轻量语言推荐条（「检测到您的语言：English → 进入英文版」），用户点击才跳。
  - 这样爬虫与用户看到的根页面完全一致，零 cloaking 风险，且不影响任何语言版本的抓取。
- 明确**不做**的事：不按 UA 给爬虫返回不同内容；不对 `/ja/...` 等具体语言路径做任何自动跳转。

### 8.4 RTL 适配成本（ar / he）

真实基线：**46 处方向相关类，17 个文件**（`pl-/pr-/ml-/mr-/left-/right-/text-left/text-right`）。

改造清单：
1. `<html dir="rtl">` 由 locale 的 `dir` 注入（挂到现有 `useHead(htmlAttrs)`）。
2. Tailwind v4 的 logical utilities 替换：
   - `pl-*` → `ps-*`，`pr-*` → `pe-*`
   - `ml-*` → `ms-*`，`mr-*` → `me-*`
   - `left-*`/`right-*`（定位）→ `start-*`/`end-*`
   - `text-left`/`text-right` → `text-start`/`text-end`
   → 46 处替换，集中在 `default.vue`（8）、`salary.vue`（13）、`regex-tester.vue`（4）、`base-convert.vue`（4）。
3. 侧边栏方向：RTL 下侧边栏应在右侧；`default.vue` 的浮动收起按钮 `absolute -right-3` 需改 `-end-3`。
4. 图标镜像：箭头/返回/Chevron 方向在 RTL 下需翻转（可用 CSS `[dir=rtl] .icon-flip { transform: scaleX(-1) }`）。
5. 数字与代码块**不镜像**（`dir="ltr"` 局部包裹，代码/JSON/时间戳类输出区域必须强制 LTR，否则乱序）。
6. 字体：阿拉伯语需额外字体回退（系统字体即可，但要检查字重与行高）。

成本判断：这是**唯一需要单独排期**的改造，约等于一次专项重构，且必须全站回归（17 个文件 + 侧边栏 + 导航 + 表单）。

---

## 九、构建与运行时影响

| 项 | 影响 | 缓解 |
|---|---|---|
| 构建时间 | 语言包 N 个，每语言 3 个文件，构建期主要耗时在 chunk 生成 | 可忽略（语言包小） |
| 客户端体积 | 现状：全部语言包进主包 | 懒加载后：只含当前语言（每语言 ~11 KB，gzip ~4 KB） |
| SSR 首请求 | 动态加载语言包，冷启动 +几 ms | 模块级缓存 + 进程内 warm |
| HTML 体积 | hreflang N+1 个 link | 12 语言可接受 |
| sitemap 生成 | URL 数 ×N，`autoLastmod` 需要遍历 | 600-1200 URL 可忽略 |
| 缓存 | 语言包 chunk 需 hash + immutable | Vite 产物自带 hash |
| 翻译资产 | 语言包成为构建产物一部分 | 放在 `app/locales` 或 `server/assets`，注意 `docs/` 不要进产物 |

**风险点**：语言包若放 `server/assets`，`nuxt build` 输出会膨胀（每语言 11 KB，12 语言 130 KB），对 Node 服务无影响，对 serverless 包大小敏感时需注意。

---

## 十、阶段划分、工作量与风险

> 工作量为**相对规模**（S/M/L）与改动面，非日历承诺。

### Phase 0 — 基建收敛（必须先做，否则后续每个语言都在踩坑）

| 任务 | 规模 | 改动面 |
|---|---|---|
| 新建 `shared/locales.ts` 单一事实来源 | S | 1 新文件 |
| 重写 `fix-html-lang.ts` 为配置驱动 | S | 1 文件 |
| `useSiteSeo.ts` 去掉 `allLocales`/`isHomePage`/二元文案硬编码 | M | 1 文件（约 8 处分支） |
| `tools.ts` 去静态 import，接入 `loadMessages` | M | 1 文件 + 新增 loader |
| sitemap/robots 由 `LOCALES` 生成，去掉 `default` 与 `zh-CN` 重叠 | S | `nuxt.config.ts` |
| `scripts/i18n-check.ts` 门禁脚本 | M | 1 新文件 + package.json |
| 统一 H1 与 `<title>` 取数 | S | 工具页模板 |

**风险**：低。唯一风险是改 `useSiteSeo` 时回归现有 zh/en 的 hreflang 与 canonical——需在 Phase 0 结束做一次全页面 SEO 快照对比（4 个 URL × 8 个字段）。

### Phase 1 — 新增 ja / de / es

| 任务 | 规模 |
|---|---|
| 语言包 L1+L2+L3（3 语言 × ~160 词条） | M |
| 最高流量 10 个工具的 L4 UI 文案 | M |
| hreflang / sitemap / JSON-LD 全链路验收 | S |
| GSC 提交与 2 周观察 | S |

**风险**：
- 翻译质量（工具名术语漂移）→ 用术语表 + 回译校验兜住；
- L4 未覆盖的工具页出现「日语标题 + 中文正文」→ 必须在该语言下对未翻译工具页做「不生成 URL」处理，否则低质页先于流量到来。

### Phase 2 — fr / pt-BR / ko / it / ru / zh-TW

| 任务 | 规模 |
|---|---|
| 6 语言内容 | L |
| sitemap 分片扩到 9 片 + index 验证 | S |
| `zh-TW` 繁简转换 + 术语差异校对 | S |

**风险**：内容量大（6 × 160 词条），审校带宽是瓶颈；建议 `zh-TW`、`pt-BR` 优先（转换/复用成本低）。

### Phase 3 — RTL（ar / he）+ tr

| 任务 | 规模 |
|---|---|
| 46 处方向类 → logical properties（17 文件） | L |
| 侧边栏/导航/图标镜像 | M |
| 代码与数字区域强制 LTR | S |
| 全站 RTL 回归 | M |
| 2 语言内容 | M |

**风险**：**最高**。布局回归面广，容易漏掉表单、弹窗、图表；建议先做一个 `dir=rtl` 的视觉回归清单再动手。

### Phase 4 — 长尾语言

按 GSC 数据决定，单语言成本可预估为 Phase 1 的 1/3（无工程改动）。

### 总风险排序

1. **RTL 布局回归**（Phase 3）
2. **未翻译页面的策略失控**（会产出混杂语言低质页，影响整站质量评估）
3. **`html lang` 与 `title` 语言不一致**（P0 问题，上线即错）
4. **sitemap/hreflang 集合不一致**（GSC 报错，影响发现效率）
5. **审校带宽不足导致机翻直上**（长期排名风险）

---

## 十一、验收清单（每个语言上线前必过）

- [ ] `/` → `zh-CN`，`/xx/` → 该语言；`<html lang>`、`<html dir>` 正确
- [ ] `<title>`、`<meta description>`、H1、JSON-LD `name/description` 四种都是目标语言
- [ ] canonical 自引用；hreflang 包含全部**已上线**语言 + `x-default`
- [ ] `/sitemap_index.xml` 含该语言分片，且各分片无重复 URL
- [ ] `robots.txt` 指向 sitemap index（仅一处）
- [ ] 该语言 sitemap 中每个 URL 状态 200；未翻译工具页为 404/noindex
- [ ] 语言切换器在工具页可正常工作且保持当前工具
- [ ] `i18n:check` 零缺失 key、术语表命中
- [ ] 首页与工具页 OG `og:locale`、`og:url` 正确
- [ ] 移动端与桌面端布局无溢出（RTL 语言额外做镜像检查）

---

## 十二、需要产品侧先拍板的 3 个决策

1. **未翻译工具页的处理**：不存在（404）还是保留并 noindex？——建议 404。
2. **根路径是否自动跳转**：服务端 302 / 客户端软跳 / 不跳只提示？——建议「不跳 + 提示条」。
3. **L4 工具内 UI 文案的覆盖范围**：Phase 1 只做 Top 10 工具，还是全量 52 个？（全量会让 Phase 1 工期显著变长）
