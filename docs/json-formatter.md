# JsonFormatter

JSON minification, beautification, and recursive key/value sorting.

## Table of Contents

- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Recursive Sorting](#recursive-sorting)
- [Error Handling](#error-handling)

## Quick Start

```typescript
import { JsonFormatter } from '@neabyte/textshift'

const result = JsonFormatter.beautify('{"b":2,"a":1}')
console.log(result.data)
// {
//   "b": 2,
//   "a": 1
// }
```

All methods accept a JSON `string` and return `TextshiftResult` with either `data` or `error`.

## API Reference

### `beautify(text: string): TextshiftResult`

Parses and pretty-prints JSON with two-space indentation.

```typescript
JsonFormatter.beautify('{"a":1,"b":2}')
// { data: '{\n  "a": 1,\n  "b": 2\n}' }

JsonFormatter.beautify('[1,2,3]')
// { data: '[\n  1,\n  2,\n  3\n]' }
```

### `minify(text: string): TextshiftResult`

Parses and compacts JSON to a single line with no whitespace.

```typescript
JsonFormatter.minify('{\n  "a": 1,\n  "b": 2\n}')
// { data: '{"a":1,"b":2}' }

JsonFormatter.minify('[1, 2, 3]')
// { data: '[1,2,3]' }
```

### `sortKeyAsc(text: string): TextshiftResult`

Recursively sorts all object keys in ascending alphabetical order. Output is beautified with two-space indentation.

```typescript
JsonFormatter.sortKeyAsc('{"c":3,"a":1,"b":2}')
// { data: '{\n  "a": 1,\n  "b": 2,\n  "c": 3\n}' }
```

### `sortKeyDesc(text: string): TextshiftResult`

Recursively sorts all object keys in descending alphabetical order. Output is beautified with two-space indentation.

```typescript
JsonFormatter.sortKeyDesc('{"a":1,"c":3,"b":2}')
// { data: '{\n  "c": 3,\n  "b": 2,\n  "a": 1\n}' }
```

### `sortValueAsc(text: string): TextshiftResult`

Recursively sorts object entries by their stringified values in ascending order. Output is beautified with two-space indentation.

```typescript
JsonFormatter.sortValueAsc('{"a":"cherry","b":"apple","c":"banana"}')
// { data: '{\n  "b": "apple",\n  "c": "banana",\n  "a": "cherry"\n}' }
```

### `sortValueDesc(text: string): TextshiftResult`

Recursively sorts object entries by their stringified values in descending order. Output is beautified with two-space indentation.

```typescript
JsonFormatter.sortValueDesc('{"a":"cherry","b":"apple","c":"banana"}')
// { data: '{\n  "a": "cherry",\n  "c": "banana",\n  "b": "apple"\n}' }
```

## Recursive Sorting

All sort methods operate recursively on nested objects. Arrays are preserved in their original order.

```typescript
const input = '{"z":{"b":2,"a":1},"a":{"d":4,"c":3}}'

JsonFormatter.sortKeyAsc(input)
// {
//   "a": {
//     "c": 3,
//     "d": 4
//   },
//   "z": {
//     "a": 1,
//     "b": 2
//   }
// }
```

> [!NOTE]
> Arrays inside objects are not sorted. Only object keys and their nested objects are reordered.

```typescript
JsonFormatter.sortKeyAsc('{"b":[3,1,2],"a":1}')
// {
//   "a": 1,
//   "b": [
//     3,
//     1,
//     2
//   ]
// }
```

## Error Handling

All methods return `{ error }` for invalid input.

```typescript
// Non-string input
JsonFormatter.minify(42)
// { error: 'Input must be a non-empty string' }

JsonFormatter.minify(null)
// { error: 'Input must be a non-empty string' }

// Empty or whitespace
JsonFormatter.minify('')
// { error: 'Input must be a non-empty string' }

JsonFormatter.minify('   ')
// { error: 'Input must be a non-empty string' }

// Invalid JSON
JsonFormatter.minify('{invalid}')
// { error: 'Invalid JSON input - Expected property name or ...' }

JsonFormatter.minify('{"a":1,}')
// { error: 'Invalid JSON input - Expected double-quoted ...' }
```

> [!NOTE]
> JSON numbers exceeding `Number.MAX_SAFE_INTEGER` (2^53 - 1) will lose precision due to IEEE 754 double-precision floating point. This is a JavaScript runtime limitation, not a library issue.
