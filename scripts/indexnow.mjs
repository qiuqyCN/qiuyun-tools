// 把 sitemap 里的全部 URL 推送给 IndexNow（Bing / Yandex / Seznam / Naver）。
// 用法：
//   node scripts/indexnow.mjs            # 正式提交
//   node scripts/indexnow.mjs --dry-run  # 只统计，不发请求
//
// 前提：key 文件已随站点发布到根路径，即 https://<host>/<KEY>.txt 返回 200。
// 顺序必须是：pnpm generate -> 上传 .output/public -> 再执行本脚本，否则会因 key 校验失败被拒。

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const KEY = 'b7e4c1a93f2d6e8b5c0a4f71d2e93b6c'
const HOST = 'tools.qiuyun.dev'
const ENDPOINT = 'https://api.indexnow.org/indexnow'
const MAX_PER_REQUEST = 10000

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '..', '.output', 'public')
const sitemapDir = path.join(publicDir, '__sitemap__')
const dryRun = process.argv.includes('--dry-run')

async function collectUrls() {
  const files = (await fs.readdir(sitemapDir)).filter(name => name.endsWith('.xml'))
  const urls = new Set()

  for (const name of files) {
    const xml = await fs.readFile(path.join(sitemapDir, name), 'utf-8')
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const url = match[1].trim()
      if (url.includes(`//${HOST}/`)) urls.add(url)
    }
  }

  return [...urls]
}

async function main() {
  const keyFile = path.join(publicDir, `${KEY}.txt`)
  try {
    await fs.access(keyFile)
  } catch {
    console.warn(`  warn: ${keyFile} 不存在，请确认 public/${KEY}.txt 已包含在构建产物中`)
  }

  const urls = await collectUrls()
  if (urls.length === 0) {
    console.error('  error: 没有从 sitemap 中找到任何 URL，请先执行 pnpm generate')
    process.exitCode = 1
    return
  }

  console.log(`  collected ${urls.length} urls`)

  if (dryRun) {
    console.log(`  dry-run: 未发送请求，示例 ${urls.slice(0, 3).join(', ')}`)
    return
  }

  for (let i = 0; i < urls.length; i += MAX_PER_REQUEST) {
    const batch = urls.slice(i, i + MAX_PER_REQUEST)
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `https://${HOST}/${KEY}.txt`,
        urlList: batch,
      }),
    })

    // 200 已接收 / 202 已接收待处理，均视为成功
    const ok = res.status === 200 || res.status === 202
    console.log(`  batch ${i / MAX_PER_REQUEST + 1}: ${batch.length} urls -> ${res.status} ${ok ? 'ok' : 'failed'}`)
    if (!ok) {
      console.error(`  response: ${await res.text()}`)
      process.exitCode = 1
    }
  }
}

main().catch((err) => {
  console.error(`  error: ${err.message}`)
  process.exitCode = 1
})
