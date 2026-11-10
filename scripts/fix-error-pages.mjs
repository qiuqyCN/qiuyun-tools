// 给 prerender 生成的 error-404 / error-500 / 200.html 补上 <html lang> 属性。
// 这些框架级页面不走 Nitro render:html hook，所以在 generate 结束后直接修补文件。
// 只处理默认语言（zh-CN），error 页没有多语言版本。

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '..', '.output', 'public')
const files = ['404.html', '200.html']
const DEFAULT_LANG = 'zh-CN'

for (const name of files) {
  const fp = path.join(publicDir, name)
  try {
    let html = await fs.readFile(fp, 'utf-8')
    if (!/lang="[^"]*"/.test(html) && /<html\b[^>]*>/.test(html)) {
      html = html.replace(/<html\b([^>]*)>/, (_m, attrs) => `<html${attrs} lang="${DEFAULT_LANG}">`)
      await fs.writeFile(fp, html, 'utf-8')
      console.log(`  patched ${name}: added lang="${DEFAULT_LANG}"`)
    } else if (/lang="[^"]*"/.test(html)) {
      console.log(`  skip ${name}: already has lang`)
    } else {
      console.log(`  skip ${name}: no <html> tag found`)
    }
  } catch (err) {
    if (err?.code !== 'ENOENT') console.warn(`  warn ${name}: ${err.message}`)
  }
}
