# Qiuyun Tools

**English** | [简体中文](README.zh-CN.md)

> An all-in-one, privacy-friendly developer toolbox with 52 tools, built with Nuxt 4.
> Everything runs in the browser — your data never leaves your device.

[![Nuxt](https://img.shields.io/badge/Nuxt-4.5-00DC82?logo=nuxt)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js)](https://vuejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![i18n](https://img.shields.io/badge/i18n-14%20languages-6366f1)](#-supported-languages)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents

- [Features](#-features)
- [Tool Catalog](#-tool-catalog)
- [Supported Languages](#-supported-languages)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Scripts](#-scripts)
- [Deployment](#-deployment)
  - [1. Node.js server (recommended)](#1-nodejs-server-recommended)
  - [2. Docker](#2-docker)
  - [3. Nginx reverse proxy](#3-nginx-reverse-proxy)
  - [4. Static hosting / SSG](#4-static-hosting--ssg)
  - [5. Platform presets](#5-platform-presets)
- [Project Structure](#-project-structure)
- [Adding a Language](#-adding-a-language)
- [SEO](#-seo)
- [License](#-license)

---

## Features

- **52 tools** across 8 categories, all client-side — no server upload, no tracking of payloads.
- **14 languages** with per-language URL prefixes, hreflang alternates, per-locale sitemaps and `<html lang>`.
- **Real 404s** for unknown or untranslated tool pages (no thin placeholder pages indexed).
- **SEO ready** out of the box: sitemap index with 14 shards, canonical URLs, Open Graph, JSON-LD, robots.txt.
- **Keyboard-friendly, dark-mode-free, zero-login** — no account, no ads, no cookies.
- **Nuxt 4 + Nitro**: SSR by default, optional static generation.

## Tool Catalog

### Developer Tools
JSON Formatter · YAML ⇄ JSON · YAML ⇄ Properties · JSON ⇄ Java · Code Beautifier · Regex Tester · Timestamp Converter · Cron Generator & Parser · HTTP Request Tester · WebSocket Tester · User-Agent Parser · Device Info

### Crypto Tools
Base64 Encode/Decode · URL Encode/Decode · MD5 Hash · HMAC Generator · JWT Parser · RSA Key Generator

### Text Tools
Word Counter · Deduplicate Lines · Text Diff · Chinese to Pinyin

### Number Tools
Random Number · Base Converter · Chinese Numerals · Scientific Calculator

### Frontend Tools
Flexbox Generator · CSS Formatter · Color Picker · Box Shadow Generator · Gradient Generator · CSS Animation Generator · Favicon Generator · Color Scheme Generator

### Image Tools
Image Compressor · Image Watermark · Image Converter · Image to Base64 · SVG Editor · QR Code Generator · QR Code Parser

### Document Tools
Markdown Editor · Markdown Converter · PDF Merge · PDF Split

### Life Tools
Date Calculator · Countdown · BMI Calculator · Age Calculator · Unit Converter · Mortgage Calculator · Salary Calculator

## Supported Languages

The default locale `zh-CN` has **no** URL prefix; every other locale is served under its prefix.

| # | Locale | URL | hreflang |
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

The language table is defined once in [`shared/locales.ts`](shared/locales.ts) and consumed by the app, the Nitro plugin, `nuxt.config.ts` and the i18n validation script.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Nuxt 4.5 (Vue 3.5, Vite 8, Nitro) |
| UI | Tailwind CSS 4 + shadcn-nuxt / reka-ui + lucide icons |
| i18n | `@nuxtjs/i18n` 10, lazy-loaded per-locale bundles |
| SEO | `@nuxtjs/seo` (sitemap, robots, schema.org, og) |
| Docs | pdf-lib, marked, highlight.js, qrcode, jsqr, pinyin-pro, chroma-js, diff, cron-parser, ua-parser-js |

## Quick Start

**Requirements:** Node.js **20.19+** or **22.12+** (Node 22 LTS recommended) and pnpm 10+ (repo ships a `pnpm-lock.yaml`).

```bash
# 1. Clone
git clone https://github.com/qiuqyCN/qiuyun-tools.git
cd qiuyun-tools

# 2. Install (postinstall runs `nuxt prepare`)
pnpm install

# 3. Start the dev server on http://localhost:3000
pnpm dev
```

With npm instead of pnpm:

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the dev server with HMR |
| `pnpm build` | Build the production bundle into `.output/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm generate` | Static generation (writes `.output/public/`) |
| `pnpm indexnow` | After deploying, submit every sitemap URL (currently 1232) to IndexNow (Bing / Yandex) |
| `pnpm i18n:check` | Validate all 14 locale files: key parity, placeholders, brand name, keyword length |

Run `pnpm i18n:check` before every PR that touches translations — it fails the build check when a locale drifts from the `zh-CN` baseline.

## Deployment

### 1. Node.js server (recommended)

The default Nitro preset is `node-server`, which gives you SSR, correct `<html lang>` per locale and server-side sitemap shards.

```bash
pnpm install --frozen-lockfile
pnpm build

# Run the built server (defaults to port 3000)
PORT=3000 HOST=0.0.0.0 node .output/server/index.mjs
```

Health check: `curl -I http://127.0.0.1:3000/` should return `200`.

Runtime environment variables:

| Variable | Default | Description |
|---|---|---|
| `PORT` / `NITRO_PORT` | `3000` | Listening port |
| `HOST` / `NITRO_HOST` | `0.0.0.0` | Listening host |
| `NODE_ENV` | `production` | Keep `production` in production |

> Domain configuration: the production domain is `https://tools.qiuyun.dev`. It is declared in [`shared/locales.ts`](shared/locales.ts) (`SITE_URL`, drives canonical / hreflang / sitemap / robots) and [`nuxt.config.ts`](nuxt.config.ts) (`site.url`). Change both if you deploy under another domain, then rebuild — these values are baked into the output at build time.

> Production checklist: make sure `.output/` is built on the same OS/architecture as the target machine. When `node_modules` contains pnpm symlinks, never copy `.output` across different machines — rebuild it on the target instead.

Keep the process alive with pm2 or a systemd unit:

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

`.output/` is self-contained apart from the Node runtime, so a two-stage image is enough:

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

### 3. Nginx reverse proxy

Terminate TLS at Nginx and proxy to the Node server (the repo has a `deploy/nginx` directory reserved for this config):

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

    # Nuxt build assets are immutable and content-hashed
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

### 4. Static hosting / SSG

```bash
pnpm generate   # output: .output/public/
```

`nuxt generate` prerenders **all 1232 pages** — 14 locales × 88 pages (home + 52 tools + 30 guide articles + 5 legal pages) — into `.output/public`, plus `sitemap_index.xml`, the 14 shard XMLs, `robots.txt`, `404.html` and `200.html`. No extra prerender configuration is required; the locale routes are picked up from the sitemap and i18n sources automatically.

Verified output after a clean generate:

| Artifact | Result |
|---|---|
| HTML pages | 1232 route files (`index.html` per route) |
| `<html lang>` | Correct per locale in the static HTML (`ja-JP`, `de-DE`, `tr-TR`, …) |
| Sitemap | `sitemap_index.xml` + 14 shards × 88 entries = 1232 URLs |
| Error pages | `404.html` and `200.html` emitted |

Absolutely required host configuration:

1. **Serve index files for clean URLs** — the files live at `<route>/index.html`, so `/ja/tools/dev/cron` must map to `.../cron/index.html` **without** a redirect. Otherwise every deep link answers `301 → /ja/tools/dev/cron/`, which no longer matches the canonical URL.
2. **Serve `404.html` with a 404 status** — the app throws a real 404 for unknown tools. Netlify, Vercel and Cloudflare Pages do this automatically; on Nginx you must wire it up manually.

Nginx serving the static bundle (complete config):

```nginx
# HTTP → HTTPS. While issuing the certificate for the first time, comment out
# the redirect so the ACME / domain-verification challenge can be reached over HTTP.
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

    # ACME / domain-verification challenge — must hit the real file, never the SPA fallback
    location ^~ /.well-known/acme-challenge/ {
        alias /srv/qiuyun-tools/.output/public/.well-known/acme-challenge/;
        default_type "text/plain";
        try_files $uri =404;
    }

    # Assets are content-hashed
    location /_nuxt/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Other static files. Keep this after the .well-known block (that one uses ^~).
    location ~* \.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    # Serve <route>/index.html directly, no trailing-slash redirect
    location / {
        try_files $uri $uri/index.html $uri/ =404;
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # Unknown paths must answer with a real 404 status
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
```

> The ACME block matters: without it, `/.well-known/acme-challenge/<token>` falls through to `try_files … =404`, so certificate issuance and cloud-provider domain verification fail with `404`. Re-apply that challenge file after every `rsync --delete`, or exclude it from the sync.

What SSG does **not** give you:

- Server-side redirect logic and dynamic 404 status for locales you have not prerendered — everything is decided at build time.
- Sitemap regeneration at runtime — it is a static file, so every content change needs a rebuild (fine for a tool site; wire it to CI).
- Any future API routes — there is no Node process. Add a serverless form or switch to node-server if you need one.

Everything else is identical: all 52 tools are client-side, the language switcher, the root-path language hint and per-locale `<html lang>` all work as built.

### 5. Cloudflare proxy (optional)

If the domain is hosted on Cloudflare and `tools.qiuyun.dev` is proxied (orange cloud), three extra things are needed.

**a. Restore the real client IP**

Without this, every request in the Nginx log appears to come from a Cloudflare edge node, which breaks access analytics and rate limiting. A ready-made file ships with the repo: [deploy/nginx/cloudflare-realip.conf](deploy/nginx/cloudflare-realip.conf) — upload it to `/etc/nginx/snippets/cloudflare-realip.conf`. Contents (matching `https://www.cloudflare.com/ips/`):

```nginx
# Ranges from https://www.cloudflare.com/ips/ — re-sync when Cloudflare changes them
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

Then reference it from the `server` block (skip this line until the file exists, otherwise `nginx -t` fails):

```nginx
include /etc/nginx/snippets/cloudflare-realip.conf;
```

**b. Set SSL mode to Full (strict)**

The origin already has a Let's Encrypt certificate, so Full or Full (strict) both work. Do **not** use Flexible: the origin's 80→443 redirect combined with Cloudflare creates a redirect loop. ACME HTTP-01 validation still works through the proxy, so renewals are unaffected.

**c. Enable Crawler Hints**

Cloudflare dashboard → select the domain → **Caching → Crawler Hints**. Once enabled, Cloudflare automatically sends IndexNow notifications to Bing / Yandex when it detects content changes, so `pnpm indexnow` only needs to be run for major releases.

To confirm it works: Bing Webmaster Tools → **IndexNow** report should show batches you did not submit manually. Cloudflare submits as the proxy, so the key in those reports will not be your own key — that is expected.

> Crawler Hints only works on the **orange cloud**. With DNS-only records traffic bypasses Cloudflare, the toggle has no effect, and `pnpm indexnow` remains the only path.

### 6. Platform presets

Nitro auto-detects the platform at build time. Override with `NITRO_PRESET` when needed:

| Platform | Build command |
|---|---|
| Vercel | `NITRO_PRESET=vercel pnpm build` |
| Netlify | `NITRO_PRESET=netlify pnpm build` |
| Cloudflare Pages | `NITRO_PRESET=cloudflare_pages pnpm build` |
| Node / self-hosted | `pnpm build` (default `node-server`) |

After deploying, verify `https://tools.qiuyun.dev/sitemap_index.xml` lists 14 shards and that `https://tools.qiuyun.dev/ja` returns HTML with `lang="ja-JP"`.

## Project Structure

```
qiuyun-tools/
├─ app/
│  ├─ pages/
│  │  ├─ index.vue              # Home: category + tool grid
│  │  ├─ [...slug].vue          # /tools/{category}/{tool} dispatcher
│  │  └─ tools/                 # 52 tool pages, grouped by category
│  ├─ locales/                  # 14 locale bundles (zh-CN.ts ... tr.ts)
│  ├─ components/               # ToolLayout, LanguageSwitcher, UI primitives
│  ├─ composables/              # useToolCatalog, useSiteSeo, useSeoMulti
│  ├─ data/tools.ts             # Tool registry (ids, icons, routes)
│  ├─ layouts/default.vue       # Shell + root-path language hint
│  └─ assets/css/tailwind.css
├─ shared/
│  ├─ locales.ts                # Single source of truth: 14 locales, hreflang, URL helpers
│  └─ lang-hint.ts              # Native-language hint copy for the root page
├─ server/plugins/fix-html-lang.ts   # Rewrites <html lang> per locale
├─ scripts/i18n-check.ts        # Locale parity / placeholder validator
├─ deploy/nginx/                # Reverse-proxy config
└─ nuxt.config.ts
```

## Adding a Language

1. Add one entry to `LOCALES` in [`shared/locales.ts`](shared/locales.ts) (`code`, `prefix`, `hreflang`, `ogLocale`, `nativeName`, `englishName`, `iso`).
2. Create `app/locales/<code>.ts` by copying `zh-CN.ts` and translating it. Keep every key — the checker compares against the `zh-CN` baseline (974 keys).
3. Add the native-language hint copy to [`shared/lang-hint.ts`](shared/lang-hint.ts) so the root path can suggest the new locale.
4. Run `pnpm i18n:check`.

Nothing else is hardcoded — routing prefixes, `<html lang>`, hreflang, language switcher, sitemap shards and robots.txt all derive from `LOCALES`.

## SEO

| Artifact | URL | Notes |
|---|---|---|
| Sitemap index | `/sitemap_index.xml` | 14 shards, one per locale |
| Locale shards | `/__sitemap__/<iso>.xml` | 53 entries each (home + 52 tools), mutually exclusive |
| robots.txt | `/robots.txt` | Points to the sitemap index |
| hreflang | Per page `<head>` | 14 alternates + `x-default` → root path |
| Canonical | Per page `<head>` | Self-referencing, locale-aware |

The multi-sitemap split is produced by the `@nuxtjs/i18n` integration. Do **not** add a custom `sitemap.sitemaps` object without `includeAppSources: true` — it silently disables locale mapping and every shard comes back empty.

## License

Released under the [MIT License](LICENSE) © 2026 qiuqyCN.

You are free to use, copy, modify, merge, publish, distribute, sublicense and sell copies of this software, provided the original copyright notice and this permission notice are included in all copies or substantial portions of the Software.
