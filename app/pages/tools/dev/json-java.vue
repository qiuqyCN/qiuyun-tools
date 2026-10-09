<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Input -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">JSON 输入</h3>
      <textarea
        v-model="input"
        placeholder='{"user": {"name": "张三", "age": 25, "tags": ["开发者"]}}'
        class="w-full h-[440px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
    </section>
    <!-- Output -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">Java POJO</h3>
        <div class="flex items-center gap-2 text-xs">
          <CopyButton :text="output" label="复制" />
          <DownloadButton :content="output" filename="Pojo.java" label="下载" />
        </div>
      </div>
      <pre class="w-full h-[440px] p-3 rounded-lg bg-slate-50 text-xs font-mono text-slate-700 overflow-auto whitespace-pre">{{ output || '等待输入...' }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
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
