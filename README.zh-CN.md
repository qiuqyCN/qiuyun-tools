# 秋云工具

[English](README.md) | **简体中文**

> 一站式、隐私友好的在线开发者工具箱，基于 Nuxt 4 构建，内置 52 个实用工具。
> 所有工具均在浏览器本地运行 —— 数据不出设备，不上传服务器。

[![Nuxt](https://img.shields.io/badge/Nuxt-4.5-00DC82?logo=nuxt)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js)](https://vuejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![i18n](https://img.shields.io/badge/i18n-14%20%E7%A7%8D%E8%AF%AD%E8%A8%80-6366f1)](#-支持的语言)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 目录

- [特性](#-特性)
- [工具清单](#-工具清单)
- [支持的语言](#-支持的语言)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [命令脚本](#-命令脚本)
- [部署](#-部署)
  - [1. Node.js 服务端（推荐）](#1-nodejs-服务端推荐)
  - [2. Docker](#2-docker)
  - [3. Nginx 反向代理](#3-nginx-反向代理)
  - [4. 静态托管 / SSG](#4-静态托管--ssg)
  - [5. 平台预设](#5-平台预设)
- [项目结构](#-项目结构)
- [新增语言](#-新增语言)
- [SEO](#-seo)
- [许可](#-许可)

---

## 特性

- **8 大类 52 个工具**，全部纯前端运行，不向服务器上传任何数据。
- **14 种语言**，每种语言独立 URL 前缀、hreflang 互链、独立 sitemap 分片与 `<html lang>`。
- **真实 404**：未知或未翻译的工具页返回 404，不生成占位页骗收录。
- **开箱即用的 SEO**：sitemap 索引 + 14 个分片、canonical、Open Graph、JSON-LD、robots.txt。
- **零登录、零广告、零 Cookie**，无需注册即可使用。
- **Nuxt 4 + Nitro**：默认 SSR，也可按需静态生成。

## 工具清单

### 开发工具
JSON 格式化 · YAML ⇄ JSON · YAML ⇄ Properties · JSON ⇄ Java · 代码格式化 · 正则测试 · 时间戳转换 · Cron 生成与解析 · HTTP 请求测试 · WebSocket 测试 · User-Agent 解析 · 设备信息检测

### 加密工具
Base64 编解码 · URL 编解码 · MD5 哈希 · HMAC 生成 · JWT 解析 · RSA 密钥生成

### 文本工具
字数统计 · 文本去重 · 文本对比 · 汉字转拼音

### 数值工具
随机数生成 · 进制转换 · 中文大写数字 · 科学计算器

### 前端工具
Flex 布局生成 · CSS 格式化 · 取色器 · 盒阴影生成 · 渐变生成 · CSS 动画生成 · Favicon 生成 · 配色方案生成

### 图片工具
图片压缩 · 图片水印 · 图片格式转换 · 图片转 Base64 · SVG 编辑器 · 二维码生成 · 二维码解析

### 文档工具
Markdown 编辑器 · Markdown 格式转换 · PDF 合并 · PDF 拆分

### 生活工具
日期计算 · 倒计时 · BMI 计算 · 年龄计算 · 单位换算 · 房贷计算 · 工资计算

## 支持的语言

默认语言 `zh-CN` **不带** URL 前缀，其余语言均带各自前缀。

| # | 语言 | URL | hreflang |
|---|---|---|---|
| 1 | 简体中文 | `/` | `zh-CN` |
| 2 | 繁體中文 | `/zh-TW` | `zh-TW` |
| 3 | English | `/en` | `en-US` |
| 4 | Español | `/es` | `es-ES` |
| 5 | Português (Brasil) | `/pt-BR` | `pt-BR` |
| 6 | Русский | `/ru` | `ru-RU` |
| 7 | Bahasa Indonesia | `/id` | `id-ID` |
| 8 | Tiếng Việt | `/vi` | `vi-VN` |
| 9 | 日本語 | `/ja` | `ja-JP` |
| 10 | 한국어 | `/ko` | `ko-KR` |
| 11 | Deutsch | `/de` | `de-DE` |
| 12 | Français | `/fr` | `fr-FR` |
| 13 | Italiano | `/it` | `it-IT` |
| 14 | Türkçe | `/tr` | `tr-TR` |

语言表只在 [`shared/locales.ts`](shared/locales.ts) 中维护一份，应用层、Nitro 插件、`nuxt.config.ts` 与 i18n 校验脚本都从这里读取。

## 技术栈

| 层次 | 选型 |
|---|---|
| 框架 | Nuxt 4.5（Vue 3.5、Vite 8、Nitro） |
| UI | Tailwind CSS 4 + shadcn-nuxt / reka-ui + lucide 图标 |
| 多语言 | `@nuxtjs/i18n` 10，语言包按语言懒加载 |
| SEO | `@nuxtjs/seo`（sitemap、robots、schema.org、og） |
| 文档处理 | pdf-lib、marked、highlight.js、qrcode、jsqr、pinyin-pro、chroma-js、diff、cron-parser、ua-parser-js |

## 快速开始

**环境要求：** Node.js **20.19+** 或 **22.12+**（推荐 Node 22 LTS），pnpm 10+（仓库自带 `pnpm-lock.yaml`）。

```bash
# 1. 克隆仓库
git clone https://github.com/qiuqyCN/qiuyun-tools.git
cd qiuyun-tools

# 2. 安装依赖（postinstall 会自动执行 nuxt prepare）
pnpm install

# 3. 启动开发服务器 http://localhost:3000
pnpm dev
```

使用 npm 时：

```bash
npm install
npm run dev
```

## 命令脚本

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动带 HMR 的开发服务器 |
| `pnpm build` | 构建生产产物到 `.output/` |
| `pnpm preview` | 本地预览生产构建 |
| `pnpm generate` | 静态生成（产物写入 `.output/public/`） |
| `pnpm indexnow` | 构建并上传后，把 sitemap 中的全部 URL（当前 1232 条）推送给 IndexNow（Bing / Yandex） |
| `pnpm i18n:check` | 校验 14 种语言包：key 对齐、占位符、品牌名、关键词长度 |

每次改动翻译相关文件后请执行 `pnpm i18n:check`，任何语言包偏离 `zh-CN` 基准（974 个 key）都会直接报错。

## 部署

### 1. Node.js 服务端（推荐）

默认 Nitro 预设为 `node-server`，可完整保留 SSR、各语言 `<html lang>` 与服务端 sitemap 分片。

```bash
pnpm install --frozen-lockfile
pnpm build

# 运行产物（默认端口 3000）
PORT=3000 HOST=0.0.0.0 node .output/server/index.mjs
```

健康检查：`curl -I http://127.0.0.1:3000/` 应返回 `200`。

运行时环境变量：

| 变量 | 默认值 | 说明 |
|---|---|---|
| `PORT` / `NITRO_PORT` | `3000` | 监听端口 |
| `HOST` / `NITRO_HOST` | `0.0.0.0` | 监听地址 |
| `NODE_ENV` | `production` | 生产环境保持 `production` |

> 域名配置：生产域名为 `https://tools.qiuyun.dev`，分别在 [`shared/locales.ts`](shared/locales.ts)（`SITE_URL`，驱动 canonical / hreflang / sitemap / robots）与 [`nuxt.config.ts`](nuxt.config.ts)（`site.url`）中声明。更换域名时两处都要改，并重新构建 —— 这些值会在构建时写入产物。

> 生产注意：`.output/` 必须在与目标机器相同的操作系统/架构上构建。若 `node_modules` 使用 pnpm 符号链接，请勿把 `.output` 跨机器拷贝，应在目标机器上重新构建。

使用 pm2 或 systemd 守护进程：

```bash
# pm2
PORT=3000 pm2 start .output/server/index.mjs --name qiuyun-tools

# systemd (/etc/systemd/system/qiuyun-tools.service)
[Unit]
Description=Qiuyun Tools
After=network.target

[Service]
WorkingDirectory=/srv/qiuyun-tools
Environment=PORT=3000 HOST=127.0.0.1
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=always

[Install]
WantedBy=multi-user.target
```

### 2. Docker

`.output/` 除 Node 运行时外自包含，两阶段镜像即可：

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

```bash
docker build -t qiuyun-tools .
docker run -p 3000:3000 qiuyun-tools
```

### 3. Nginx 反向代理

在 Nginx 终止 TLS 并转发到 Node 服务（仓库内 `deploy/nginx` 目录预留给该配置）：

```nginx
server {
    listen 80;
    server_name tools.qiuyun.dev;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tools.qiuyun.dev;

    ssl_certificate     /etc/letsencrypt/live/tools.qiuyun.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tools.qiuyun.dev/privkey.pem;

    # Nuxt 构建产物带内容哈希，可长期缓存
    location /_nuxt/ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. 静态托管 / SSG

```bash
pnpm generate   # 产物：.output/public/
```

`nuxt generate` 会把**全部 1232 个页面**（14 种语言 × 88 个页面：首页 + 52 个工具 + 30 篇 Guide + 5 个法务页）预渲染到 `.output/public`，同时产出 `sitemap_index.xml`、14 个分片 XML、`robots.txt`、`404.html` 与 `200.html`。无需额外配置 prerender 路由 —— 语言路由会由 sitemap 与 i18n 数据源自动纳入。

清理后重新生成的实测结果：

| 产物 | 结果 |
|---|---|
| HTML 页面 | 1232 个路由文件（每条路由一个 `index.html`） |
| `<html lang>` | 静态 HTML 中已按语言写死且正确（`ja-JP`、`de-DE`、`tr-TR` …） |
| Sitemap | `sitemap_index.xml` + 14 个分片 × 88 条 = 1232 个 URL |
| 错误页 | 已生成 `404.html` 与 `200.html` |

托管平台**必须**配置的两点：

1. **干净 URL 直接命中 index 文件** —— 文件实际位于 `<route>/index.html`，因此 `/ja/tools/dev/cron` 必须直接映射到 `.../cron/index.html`，**不能**发生重定向。否则所有深层链接都会 `301 → /ja/tools/dev/cron/`，与 canonical 不一致。
2. **`404.html` 必须以 404 状态码返回** —— 应用对未知工具抛出真实 404。Netlify、Vercel、Cloudflare Pages 默认如此；Nginx 需要手动配置。

Nginx 托管静态产物的完整配置：

```nginx
# HTTP → HTTPS。首次申请证书时先注释掉 return，确保 ACME / 域名验证能走 HTTP 访问
server {
    listen 80;
    listen [::]:80;
    server_name tools.qiuyun.dev;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name tools.qiuyun.dev;

    root /srv/qiuyun-tools/.output/public;
    index index.html;
    server_tokens off;

    ssl_certificate     /etc/letsencrypt/live/tools.qiuyun.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tools.qiuyun.dev/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_session_cache   shared:SSL:10m;

    # ACME / 域名验证：必须命中真实文件，不能落到 SPA 回退
    location ^~ /.well-known/acme-challenge/ {
        alias /srv/qiuyun-tools/.output/public/.well-known/acme-challenge/;
        default_type "text/plain";
        try_files $uri =404;
    }

    # 构建产物带内容哈希，可长期缓存
    location /_nuxt/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 其他静态资源。必须放在 .well-known 之后（后者用 ^~ 优先）
    location ~* \.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    # 直接命中 <route>/index.html，不产生尾斜杠跳转
    location / {
        try_files $uri $uri/index.html $uri/ =404;
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # 未知路径必须返回真实 404 状态码
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
```

> ACME 那段不能省：缺了它，`/.well-known/acme-challenge/<token>` 会落到 `try_files … =404`，导致证书签发与云平台域名验证直接报 `404`。每次 `rsync --delete` 后需重新放回验证文件，或在同步时排除该目录。

SSG 会失去的能力：

- 服务端重定向逻辑，以及未预渲染语言的动态 404 状态码 —— 一切都在构建时决定。
- sitemap 运行时重新生成 —— 它是静态文件，内容变更需重新构建（工具站可接受，建议接入 CI）。
- 任何未来的 API 路由 —— 没有 Node 进程。需要时改用 serverless 方案或切回 node-server。

其余能力完全一致：52 个工具均为纯前端，语言切换器、根路径语言提示条与各语言 `<html lang>` 都按构建结果正常工作。

### 5. Cloudflare 代理（可选）

若域名托管在 Cloudflare 且 `tools.qiuyun.dev` 使用橙色云（Proxied），需要额外处理三件事。

**a. 还原真实客户端 IP**

不做这一步，Nginx 看到的客户端 IP 全是 Cloudflare 节点，访问统计与限流会全部失真。仓库已附带现成文件 [deploy/nginx/cloudflare-realip.conf](deploy/nginx/cloudflare-realip.conf)，可直接上传到服务器 `/etc/nginx/snippets/cloudflare-realip.conf`，内容如下（网段与 `https://www.cloudflare.com/ips/` 一致）：

```nginx
# 网段来自 https://www.cloudflare.com/ips/ ，Cloudflare 调整后需同步更新
real_ip_header CF-Connecting-IP;
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2a06:98c0::/29;
set_real_ip_from 2c0f:f248::/32;
```

然后在 `server` 块内加入一行（文件不存在时不要加，否则 `nginx -t` 会失败）：

```nginx
include /etc/nginx/snippets/cloudflare-realip.conf;
```

**b. SSL 模式设为 Full (strict)**

源站已配置 Let's Encrypt 证书，因此 Full 或 Full (strict) 都可用。**不要**用 Flexible：源站 80→443 的跳转会与 Cloudflare 形成重定向循环。ACME HTTP-01 验证在橙云下依然可用，证书续期不受影响。

**c. 开启 Crawler Hints（爬虫提示）**

Cloudflare 控制台 → 选中域名 → **Caching → Crawler Hints** 打开。开启后 Cloudflare 检测到内容变化时会自动向 Bing / Yandex 等提交 IndexNow 通知，此时 `pnpm indexnow` 可只在重要发布时手动执行。

验证是否生效：Bing Webmaster Tools → **IndexNow** 报告里出现非手动提交的批次即代表工作正常。Cloudflare 以代理身份提交，报告中的 key 不会是你自己的 key，属正常现象。

> 注意：Crawler Hints 只在**橙色云**下生效；灰色云（DNS only）流量不经过 Cloudflare，该开关无效，仍需依赖 `pnpm indexnow`。

### 6. 平台预设

Nitro 会在构建时自动识别平台，必要时用 `NITRO_PRESET` 覆盖：

| 平台 | 构建命令 |
|---|---|
| Vercel | `NITRO_PRESET=vercel pnpm build` |
| Netlify | `NITRO_PRESET=netlify pnpm build` |
| Cloudflare Pages | `NITRO_PRESET=cloudflare_pages pnpm build` |
| Node / 自建服务器 | `pnpm build`（默认 `node-server`） |

部署完成后请验证 `https://tools.qiuyun.dev/sitemap_index.xml` 列出 14 个分片，且 `https://tools.qiuyun.dev/ja` 返回的 HTML 为 `lang="ja-JP"`。

## 项目结构

```
qiuyun-tools/
├─ app/
│  ├─ pages/
│  │  ├─ index.vue              # 首页：分类 + 工具网格
│  │  ├─ [...slug].vue          # /tools/{category}/{tool} 分发
│  │  └─ tools/                 # 52 个工具页（按分类分组）
│  ├─ locales/                  # 14 个语言包（zh-CN.ts ... tr.ts）
│  ├─ components/               # ToolLayout、LanguageSwitcher、UI 基础组件
│  ├─ composables/              # useToolCatalog、useSiteSeo、useSeoMulti
│  ├─ data/tools.ts             # 工具注册表（id、图标、路由）
│  ├─ layouts/default.vue       # 布局壳 + 根路径语言提示条
│  └─ assets/css/tailwind.css
├─ shared/
│  ├─ locales.ts                # 单一事实来源：14 种语言、hreflang、URL 工具函数
│  └─ lang-hint.ts              # 根路径语言提示的原生文案
├─ server/plugins/fix-html-lang.ts   # 按语言重写 <html lang>
├─ scripts/i18n-check.ts        # 语言包 key / 占位符校验
├─ deploy/nginx/                # 反向代理配置
└─ nuxt.config.ts
```

## 新增语言

1. 在 [`shared/locales.ts`](shared/locales.ts) 的 `LOCALES` 中追加一项（`code`、`prefix`、`hreflang`、`ogLocale`、`nativeName`、`englishName`、`iso`）。
2. 复制 `zh-CN.ts` 为 `app/locales/<code>.ts` 并翻译。必须保留全部 key —— 校验脚本会与 `zh-CN` 基准（974 个 key）逐一比对。
3. 在 [`shared/lang-hint.ts`](shared/lang-hint.ts) 补充该语言的原生提示文案，根路径即可提示切换。
4. 执行 `pnpm i18n:check`。

其余位置均无硬编码：路由前缀、`<html lang>`、hreflang、语言切换器、sitemap 分片与 robots.txt 全部由 `LOCALES` 推导。

## SEO

| 产物 | URL | 说明 |
|---|---|---|
| sitemap 索引 | `/sitemap_index.xml` | 14 个分片，每语言一个 |
| 语言分片 | `/__sitemap__/<iso>.xml` | 每个 53 条（首页 + 52 工具），互斥不重复 |
| robots.txt | `/robots.txt` | 指向 sitemap 索引 |
| hreflang | 每页 `<head>` | 14 条互链 + `x-default` → 根路径 |
| Canonical | 每页 `<head>` | 自指，按语言生成 |

多分片由 `@nuxtjs/i18n` 集成自动生成。**不要**自建 `sitemap.sitemaps` 对象，除非显式设置 `includeAppSources: true` —— 否则会静默关闭语言映射，导致所有分片返回空。

## 许可

本项目基于 [MIT License](LICENSE) 发布，© 2026 qiuqyCN。

你可以自由使用、复制、修改、合并、发布、分发、再许可和销售本软件，只需在所有副本或实质性部分中保留原始版权声明与本许可声明。
