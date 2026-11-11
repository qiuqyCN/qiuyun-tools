// 用 git 提交时间作为 sitemap 的 lastmod。
// 默认的 autoLastmod 取的是文件 mtime：重新 clone、checkout、CI 构建都会让全站
// lastmod 一起变成"当前时间"，Google 会判定为无意义更新并降低抓取频率。
// 这里改为「页面组件 + 对应语言包」两个文件最近一次提交时间的较大值。
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { stripLocalePrefix } from '../../shared/locales'

const ROOT = process.cwd()
const gitDateCache = new Map<string, string | null>()
const lastmodCache = new Map<string, string | null>()

function gitCommitDate(file: string): string | null {
  if (gitDateCache.has(file)) return gitDateCache.get(file) ?? null

  const absolute = path.join(ROOT, file)
  let result: string | null = null

  if (existsSync(absolute)) {
    try {
      const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim()
      result = out || null
    } catch {
      // git 不可用（例如没有 .git 的发布包）时保持 autoLastmod 的 mtime 兜底
    }
  }

  gitDateCache.set(file, result)
  return result
}

// 把 URL 映射到决定它内容的源文件
function sourceFiles(loc: string): string[] {
  const { locale, path: cleanPath } = stripLocalePrefix(new URL(loc).pathname)
  const match = cleanPath.match(/^\/tools\/([^/]+)\/([^/]+)\/?$/)

  const files = [`app/locales/${locale}.ts`]
  if (match) {
    files.unshift(`app/pages/tools/${match[1]}/${match[2]}.vue`)
  } else if (cleanPath === '/' || cleanPath === '') {
    files.unshift('app/pages/index.vue')
  }

  return files
}

function resolveLastmod(loc: string): string | null {
  if (lastmodCache.has(loc)) return lastmodCache.get(loc) ?? null

  const dates = sourceFiles(loc)
    .map(gitCommitDate)
    .filter((value): value is string => Boolean(value))
    .map(value => ({ iso: value, time: Date.parse(value) }))
    .filter(item => Number.isFinite(item.time))

  const latest = dates.sort((a, b) => b.time - a.time)[0]?.iso ?? null
  lastmodCache.set(loc, latest)
  return latest
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:resolved', (ctx: any) => {
    for (const url of ctx.urls || []) {
      if (!url?.loc) continue
      const lastmod = resolveLastmod(url.loc)
      if (lastmod) url.lastmod = lastmod
    }
  })
})
