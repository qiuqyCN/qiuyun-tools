/**
 * 语言包门禁校验
 * 以默认语言（zh-CN）为基准，校验各语言的 key 完整性、占位符一致性、
 * 关键词词数与品牌名规范。CI 中作为 i18n:check 执行。
 *
 * 用法：node --experimental-strip-types scripts/i18n-check.ts
 */
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { DEFAULT_LOCALE, LOCALES, brandName } from '../shared/locales.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

type Dict = Record<string, any>

function flatten(value: Dict, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, item] of Object.entries(value)) {
    const full = prefix ? `${prefix}.${key}` : key
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      Object.assign(out, flatten(item, full))
    } else {
      out[full] = String(item ?? '')
    }
  }
  return out
}

function placeholders(text: string): string[] {
  return [...text.matchAll(/\{(\w+)\}/g)].map(m => m[1]!).sort()
}

function keywordCount(text: string): number {
  return text.split(/[,，、;；]/).map(s => s.trim()).filter(Boolean).length
}

async function loadLocale(code: string): Promise<Dict> {
  const file = path.join(root, 'app', 'locales', `${code}.ts`)
  const mod = await import(pathToFileURL(file).href)
  return mod.default
}

const baseline = flatten(await loadLocale(DEFAULT_LOCALE))
const errors: string[] = []
const warnings: string[] = []

for (const locale of LOCALES) {
  if (locale.code === DEFAULT_LOCALE) continue

  let messages: Dict
  try {
    messages = await loadLocale(locale.code)
  } catch {
    errors.push(`[${locale.code}] 语言包缺失：app/locales/${locale.code}.ts`)
    continue
  }

  const keys = flatten(messages)

  const missing = Object.keys(baseline).filter(key => !(key in keys))
  const extra = Object.keys(keys).filter(key => !(key in baseline))

  if (missing.length) {
    errors.push(`[${locale.code}] 缺失 ${missing.length} 个 key：\n  ${missing.join('\n  ')}`)
  }
  if (extra.length) {
    errors.push(`[${locale.code}] 多余 ${extra.length} 个 key（基准语言中不存在）：\n  ${extra.join('\n  ')}`)
  }

  for (const key of Object.keys(baseline)) {
    const expected = baseline[key]!
    const actual = keys[key]
    if (actual === undefined) continue

    const expectedPlaceholders = placeholders(expected)
    if (expectedPlaceholders.length) {
      const actualPlaceholders = placeholders(actual)
      if (expectedPlaceholders.join(',') !== actualPlaceholders.join(',')) {
        errors.push(
          `[${locale.code}] ${key} 占位符不一致：期望 {${expectedPlaceholders.join('}{')}}，实际 {${actualPlaceholders.join('}{')}}`,
        )
      }
    }
  }

  for (const [key, value] of Object.entries(keys)) {
    if (key.startsWith('seoKeywords.')) {
      const count = keywordCount(value)
      if (count < 3 || count > 8) {
        warnings.push(`[${locale.code}] ${key} 关键词数量异常（${count}）`)
      }
    }
  }

  if (messages.site?.name && brandName(locale.code) !== messages.site.name) {
    errors.push(
      `[${locale.code}] site.name 品牌名应为「${brandName(locale.code)}」，实际「${messages.site.name}」`,
    )
  }
}

if (warnings.length) {
  console.warn('\n⚠️  警告：')
  for (const warning of warnings) console.warn(`  - ${warning}`)
}

if (errors.length) {
  console.error(`\n❌ i18n 校验失败（${errors.length} 项）：`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(`✅ i18n 校验通过：${LOCALES.length} 种语言，基准 ${Object.keys(baseline).length} 个 key`)
