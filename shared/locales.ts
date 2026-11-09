/**
 * 语言元信息单一事实来源
 * 应用层、服务端插件、nuxt.config、校验脚本都从这里取语言表。
 * 新增语言只改这里 + app/locales/{code}.ts。
 */

export interface LocaleMeta {
  /** 语言代码，同时作为 locale 文件名 */
  code: string
  /** URL 前缀，'' 表示默认语言无前缀 */
  prefix: string
  /** hreflang 值 */
  hreflang: string
  /** Open Graph locale */
  ogLocale: string
  /** 语言选择器里显示的母语名 */
  nativeName: string
  /** 英文名（日志/后台用） */
  englishName: string
  /** <html lang> 与 JSON-LD inLanguage 用 */
  iso: string
}

export const SITE_URL = 'https://qiuyun.tools'

export const DEFAULT_LOCALE = 'zh-CN'

export const LOCALES: LocaleMeta[] = [
  { code: 'zh-CN', prefix: '', hreflang: 'zh-CN', ogLocale: 'zh_CN', nativeName: '简体中文', englishName: 'Chinese (Simplified)', iso: 'zh-CN' },
  { code: 'zh-TW', prefix: 'zh-TW', hreflang: 'zh-TW', ogLocale: 'zh_TW', nativeName: '繁體中文', englishName: 'Chinese (Traditional)', iso: 'zh-TW' },
  { code: 'en', prefix: 'en', hreflang: 'en-US', ogLocale: 'en_US', nativeName: 'English', englishName: 'English', iso: 'en-US' },
  { code: 'es', prefix: 'es', hreflang: 'es-ES', ogLocale: 'es_ES', nativeName: 'Español', englishName: 'Spanish', iso: 'es-ES' },
  { code: 'pt-BR', prefix: 'pt-BR', hreflang: 'pt-BR', ogLocale: 'pt_BR', nativeName: 'Português (Brasil)', englishName: 'Portuguese (Brazil)', iso: 'pt-BR' },
  { code: 'ru', prefix: 'ru', hreflang: 'ru-RU', ogLocale: 'ru_RU', nativeName: 'Русский', englishName: 'Russian', iso: 'ru-RU' },
  { code: 'id', prefix: 'id', hreflang: 'id-ID', ogLocale: 'id_ID', nativeName: 'Bahasa Indonesia', englishName: 'Indonesian', iso: 'id-ID' },
  { code: 'vi', prefix: 'vi', hreflang: 'vi-VN', ogLocale: 'vi_VN', nativeName: 'Tiếng Việt', englishName: 'Vietnamese', iso: 'vi-VN' },
  { code: 'ja', prefix: 'ja', hreflang: 'ja-JP', ogLocale: 'ja_JP', nativeName: '日本語', englishName: 'Japanese', iso: 'ja-JP' },
  { code: 'ko', prefix: 'ko', hreflang: 'ko-KR', ogLocale: 'ko_KR', nativeName: '한국어', englishName: 'Korean', iso: 'ko-KR' },
  { code: 'de', prefix: 'de', hreflang: 'de-DE', ogLocale: 'de_DE', nativeName: 'Deutsch', englishName: 'German', iso: 'de-DE' },
  { code: 'fr', prefix: 'fr', hreflang: 'fr-FR', ogLocale: 'fr_FR', nativeName: 'Français', englishName: 'French', iso: 'fr-FR' },
  { code: 'it', prefix: 'it', hreflang: 'it-IT', ogLocale: 'it_IT', nativeName: 'Italiano', englishName: 'Italian', iso: 'it-IT' },
  { code: 'tr', prefix: 'tr', hreflang: 'tr-TR', ogLocale: 'tr_TR', nativeName: 'Türkçe', englishName: 'Turkish', iso: 'tr-TR' },
]

export function getLocaleMeta(code: string): LocaleMeta {
  return LOCALES.find(l => l.code === code) ?? LOCALES[0]!
}

/** CJK 文字体系语言使用中文品牌名，其余使用拉丁品牌名 */
export function isCjkLocale(code: string): boolean {
  return /^(zh|ja|ko)/.test(code)
}

export function brandName(code: string): string {
  return isCjkLocale(code) ? '秋云工具' : 'Qiuyun Tools'
}

/**
 * 从路径中剥离语言前缀
 * '/ja/tools/dev/json-formatter' -> { locale: 'ja', path: '/tools/dev/json-formatter' }
 * '/tools/dev/json-formatter'    -> { locale: 'zh-CN', path: '/tools/dev/json-formatter' }
 */
export function stripLocalePrefix(rawPath: string): { locale: string; path: string } {
  const clean = (rawPath.split('?')[0] ?? '').split('#')[0] ?? '/'
  const segs = clean.split('/').filter(Boolean)
  const first = segs[0]
  if (first) {
    const meta = LOCALES.find(l => l.prefix && l.prefix === first)
    if (meta) {
      const rest = `/${segs.slice(1).join('/')}`
      return { locale: meta.code, path: rest === '/' ? '/' : rest.replace(/\/$/, '') }
    }
  }
  return { locale: DEFAULT_LOCALE, path: clean || '/' }
}

/** 生成带语言前缀的应用内路径 */
export function buildLocalePath(code: string, path: string = '/'): string {
  const meta = getLocaleMeta(code)
  const p = path === '' ? '/' : path
  if (!meta.prefix) return p
  return p === '/' ? `/${meta.prefix}` : `/${meta.prefix}${p}`
}

/** 生成绝对 URL */
export function buildAbsoluteUrl(code: string, path: string = '/'): string {
  return `${SITE_URL}${buildLocalePath(code, path)}`
}

/** 某路径在所有语言下的 hreflang 映射（含 x-default 指向根路径） */
export function buildHreflangMap(path: string = '/'): Record<string, string> {
  const map: Record<string, string> = {}
  for (const l of LOCALES) {
    map[l.hreflang] = buildAbsoluteUrl(l.code, path)
  }
  map['x-default'] = buildAbsoluteUrl(DEFAULT_LOCALE, path)
  return map
}
