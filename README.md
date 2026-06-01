<div align='center'>

# Textshift

Zero-dependency text transformation and JSON formatting for any runtime

[![Node](https://img.shields.io/badge/node-%3E%3D24-339933?logo=node.js&logoColor=white)](https://nodejs.org) [![Deno](https://img.shields.io/badge/deno-compatible-ffcb00?logo=deno&logoColor=000000)](https://deno.com) [![Bun](https://img.shields.io/badge/bun-compatible-f9f1e1?logo=bun&logoColor=000000)](https://bun.sh) [![CDN](https://img.shields.io/badge/cdn-jsdelivr%2Fesm.sh-blue)](https://cdn.jsdelivr.net/npm/@neabyte/textshift)

[![Module type: Deno/ESM](https://img.shields.io/badge/module%20type-deno%2Fesm-brightgreen)](https://github.com/NeaByteLab/Textshift) [![npm version](https://img.shields.io/npm/v/@neabyte/textshift.svg)](https://www.npmjs.org/package/@neabyte/textshift) [![JSR](https://jsr.io/badges/@neabyte/textshift)](https://jsr.io/@neabyte/textshift) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

## Features

- **Text transforms** - Case conversions, normalization, reversal, and sentence formatting.
- **JSON formatting** - Minify, beautify, and recursive key/value sorting.
- **Runtime agnostic** - Works in Deno, Node.js, Bun, and browsers.

## Installation

> [!NOTE]
> **Prerequisites:** For **Deno** (install from [deno.com](https://deno.com/)). For **npm** use Node.js (e.g. [nodejs.org](https://nodejs.org/)).

**Deno (JSR):**

```bash
deno add jsr:@neabyte/textshift
```

**npm:**

```bash
npm install @neabyte/textshift
```

**CDN (jsDelivr/unpkg/esm.sh):**

```html
<script type="module">
  import {
    TextTransform,
    JsonFormatter
  } from 'https://cdn.jsdelivr.net/npm/@neabyte/textshift/dist/index.mjs'
</script>
```

Or via [esm.sh](https://esm.sh):

```html
<script type="module">
  import {
    TextTransform,
    JsonFormatter
  } from 'https://esm.sh/@neabyte/textshift'
</script>
```

Or via `importmap`:

```html
<script type="importmap">
  {
    "imports": {
      "@neabyte/textshift": "https://cdn.jsdelivr.net/npm/@neabyte/textshift/dist/index.mjs"
    }
  }
</script>
<script type="module">
  import { TextTransform, JsonFormatter } from '@neabyte/textshift'
</script>
```

Read [docs/README.md](docs/README.md) for full documentation.

## Quick Start

```typescript
import { TextTransform, JsonFormatter } from '@neabyte/textshift'

const result = TextTransform.capitalizedCase('hello world')
console.log(result.data) // 'Hello World'

const json = JsonFormatter.beautify('{"b":2,"a":1}')
console.log(json.data)
// {
//   "b": 2,
//   "a": 1
// }
```

## Build

**npm build (bundles to `dist/`):**

```bash
npm run build
```

## Testing

**Type check** - format, lint, and type-check:

```bash
deno task check
```

**Unit tests** - format/lint tests and run all tests:

```bash
deno task test
```

- Tests live under `tests/` (text transform and JSON formatter tests).
- The test task uses `--allow-read`, `--allow-write`, and `--allow-env`.

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for details.
