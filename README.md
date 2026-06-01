<div align='center'>

# Textshift

Zero-dependency text transformation and JSON formatting for any runtime

[![Deno](https://img.shields.io/badge/deno-%3E%3D2.5.4-ffcb00?logo=deno&logoColor=000000)](https://deno.com) [![Module type: Deno/ESM](https://img.shields.io/badge/module%20type-deno%2Fesm-brightgreen)](https://github.com/NeaByteLab/Textshift) [![JSR](https://jsr.io/badges/@neabyte/textshift)](https://jsr.io/@neabyte/textshift) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

## Features

- **Text transforms** - Case conversions, normalization, reversal, and sentence formatting.
- **JSON formatting** - Minify, beautify, and recursive key/value sorting.
- **Runtime agnostic** - Works in Deno, Node.js, Bun, and browsers.

## Installation

> [!NOTE]
> **Prerequisites:** Deno >= 2.5.4 (install from [deno.com](https://deno.com/)).

**Deno (JSR):**

```bash
deno add jsr:@neabyte/textshift
```

**npm:**

```bash
npx jsr add @neabyte/textshift
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
