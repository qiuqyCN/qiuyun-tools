<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">JSON / Java 互转</h3>
      <span class="text-xs text-slate-400">自动生成带 Getter/Setter 的 Java 实体类</span>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 items-stretch">
      <!-- 输入 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">JSON 输入</span>
          <button @click="input = example" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
        </div>
        <textarea
          v-model="input"
          placeholder='{"user": {"name": "张三", "age": 25, "tags": ["开发者"]}}'
          class="w-full h-[440px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="flex lg:flex-col items-center justify-center gap-2 shrink-0">
        <CopyButton :text="output" label="复制" />
        <DownloadButton v-if="output && !output.startsWith('JSON')" :content="output" filename="Pojo.java" label="下载" />
        <button
          @click="input = ''"
          class="h-8 px-3 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >清空</button>
      </div>

      <!-- 输出 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">Java POJO 输出</span>
        </div>
        <pre
          v-if="output"
          class="w-full h-[440px] p-3 rounded-lg bg-slate-50 text-xs font-mono text-slate-700 overflow-auto whitespace-pre border border-slate-100"
        >{{ output }}</pre>
        <div
          v-else
          class="w-full h-[440px] p-3 rounded-lg bg-slate-50 text-slate-400 border border-slate-100 flex flex-col items-center justify-center gap-2 text-xs"
        >
          <component :is="icons.FileCode2" class="w-8 h-8 text-slate-300" />
          <span>在左侧粘贴 JSON，Java 类将自动生成</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const example = `{
  "user": {
    "name": "张三",
    "age": 25,
    "email": "zhangsan@example.com",
    "tags": ["开发者", "架构师"]
  },
  "active": true,
  "score": 98.5
}`

const input = ref('')
const output = ref('')

const typeMap: Record<string, string> = {
  string: 'String',
  number: null as any, // handled specially
  boolean: 'Boolean',
}

function getJavaType(val: any): string {
  if (val === null) return 'Object'
  if (Array.isArray(val)) return 'List<Object>'
  switch (typeof val) {
    case 'string': return 'String'
    case 'boolean': return 'Boolean'
    case 'number':
      if (Number.isInteger(val)) return 'Integer'
      return 'Double'
    case 'object': return getClassName(val)
    default: return 'Object'
  }
}

function getClassName(obj: Record<string, any>): string {
  // Use first key as class name, PascalCase
  const keys = Object.keys(obj)
  if (keys.length === 0) return 'Empty'
  // Generate deterministic pseudo-name based on structure
  const sig = Object.keys(obj).sort().join('_')
  return 'Obj_' + Math.abs(hashCode(sig)).toString(36).toUpperCase().slice(0, 8)
}

function hashCode(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return h
}

function toPascalCase(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function toCamelCase(name: string): string {
  return name.charAt(0).toLowerCase() + name.slice(1)
}

function generatePojo(obj: Record<string, any>, className: string, indent = ''): string {
  const lines: string[] = []
  const innerClasses: string[] = []

  lines.push(`${indent}public class ${className} {`)

  // Collect fields
  const fields: { name: string; type: string; value?: any }[] = []
  for (const [key, val] of Object.entries(obj)) {
    if (val !== null && typeof val === 'object' && !Array.isArray(val) && typeof val !== 'string') {
      const name = toPascalCase(key)
      const type = name
      fields.push({ name: toCamelCase(key), type })
      innerClasses.push(generatePojo(val, name, indent + '  '))
    } else if (Array.isArray(val)) {
      const elemType = val.length > 0 ? getJavaType(val[0]) : 'Object'
      fields.push({ name: toCamelCase(key), type: `List<${elemType}>` })
    } else {
      fields.push({ name: toCamelCase(key), type: getJavaType(val) })
    }
  }

  // Fields
  for (const f of fields) {
    lines.push(`${indent}  private ${f.type} ${f.name};`)
  }
  lines.push('')

  // Getters & Setters
  for (const f of fields) {
    const cap = toPascalCase(f.name)
    lines.push(`${indent}  public ${f.type} get${cap}() { return ${f.name}; }`)
    lines.push(`${indent}  public void set${cap}(${f.type} ${f.name}) { this.${f.name} = ${f.name}; }`)
    lines.push('')
  }

  // Inner classes
  if (innerClasses.length) {
    for (const ic of innerClasses) {
      lines.push(ic)
      lines.push('')
    }
  }

  lines.push(`${indent}}`)
  return lines.join('\n')
}

watch(input, () => {
  if (!input.value.trim()) { output.value = ''; return }
  try {
    const obj = JSON.parse(input.value)
    if (typeof obj !== 'object') { output.value = '根节点必须是对象'; return }
    output.value = `import java.util.List;\n\n${generatePojo(obj, 'GeneratedPojo')}`
  } catch (e: any) {
    output.value = 'JSON 解析失败: ' + e?.message
  }
}, { immediate: true })
</script>
