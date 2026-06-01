# Documentation

Complete API documentation for `@neabyte/textshift`.

## Modules

1. **[TextTransform](text-transform.md)** - Text case conversions, normalization, and reversal with Unicode support.
2. **[JsonFormatter](json-formatter.md)** - JSON minification, beautification, and recursive key/value sorting.

## Quick Reference

| Export            | Purpose                   | Usage                               |
| ----------------- | ------------------------- | ----------------------------------- |
| `TextTransform`   | Text transformation class | `TextTransform.uppercase('hello')`  |
| `JsonFormatter`   | JSON formatting class     | `JsonFormatter.beautify('{"a":1}')` |
| `TextshiftResult` | Unified result type       | `{ data?: string, error?: string }` |

## Result Type

All methods return `TextshiftResult`. Exactly one of `data` or `error` is set, never both.

```typescript
const result = TextTransform.uppercase('hello')

if (result.error) {
  console.error(result.error)
} else {
  console.log(result.data) // 'HELLO'
}
```
