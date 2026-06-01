# TextTransform

Text case conversions, normalization, and reversal with full Unicode and grapheme support.

## Table of Contents

- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Unicode Support](#unicode-support)
- [Multiline Handling](#multiline-handling)
- [Error Handling](#error-handling)

## Quick Start

```typescript
import { TextTransform } from '@neabyte/textshift'

const result = TextTransform.capitalizedCase('hello world')
console.log(result.data) // 'Hello World'
```

All methods accept a `string` and return `TextshiftResult` with either `data` or `error`.

## API Reference

### `alternatingCase(text: string): TextshiftResult`

Alternates between lowercase and uppercase on alphabetic characters only. Non-alpha characters (spaces, numbers, punctuation, emoji) are preserved without affecting the alternation counter.

```typescript
TextTransform.alternatingCase('hello world')
// { data: 'hElLo WoRlD' }

TextTransform.alternatingCase('a1b2c')
// { data: 'a1B2c' }

TextTransform.alternatingCase('a😀b😀c')
// { data: 'a😀B😀c' }
```

### `capitalizedCase(text: string): TextshiftResult`

Capitalizes the first letter of every word and lowercases the rest. Preserves line structure and indentation.

```typescript
TextTransform.capitalizedCase('hello world')
// { data: 'Hello World' }

TextTransform.capitalizedCase('hELLO wORLD')
// { data: 'Hello World' }

TextTransform.capitalizedCase('über cool café')
// { data: 'Über Cool Café' }
```

### `inverseCase(text: string): TextshiftResult`

Swaps uppercase to lowercase and vice versa. Non-cased characters are unchanged.

```typescript
TextTransform.inverseCase('Hello World')
// { data: 'hELLO wORLD' }

TextTransform.inverseCase('Café')
// { data: 'cAFÉ' }
```

> [!NOTE]
> Applying `inverseCase` twice returns the original text.

### `lowercase(text: string): TextshiftResult`

Converts the entire text to lowercase.

```typescript
TextTransform.lowercase('HELLO World')
// { data: 'hello world' }
```

### `normalize(text: string): TextshiftResult`

Collapses consecutive spaces and tabs into a single space per line, trims each line, and reduces three or more consecutive newlines to two.

```typescript
TextTransform.normalize('hello   world')
// { data: 'hello world' }

TextTransform.normalize('  hello \t world  ')
// { data: 'hello world' }

TextTransform.normalize('a\n\n\n\nb')
// { data: 'a\n\nb' }
```

> [!NOTE]
> CRLF (`\r\n`) is normalized to LF (`\n`). Non-breaking spaces (`\u00A0`) and zero-width spaces (`\u200B`) are preserved.

### `reverse(text: string): TextshiftResult`

Reverses the text using grapheme-aware splitting. Properly handles multi-byte characters, combined emoji, skin tones, flags, and ZWJ sequences.

```typescript
TextTransform.reverse('hello')
// { data: 'olleh' }

TextTransform.reverse('café')
// { data: 'éfac' }

TextTransform.reverse('👨‍👩‍👧‍👦hello')
// { data: 'olleh👨‍👩‍👧‍👦' }

TextTransform.reverse('🇯🇵🇺🇸')
// { data: '🇺🇸🇯🇵' }
```

> [!NOTE]
> Applying `reverse` twice returns the original text.

### `sentenceCase(text: string): TextshiftResult`

Lowercases the entire text, then capitalizes the first letter after sentence-ending punctuation (`.`, `!`, `?`) followed by whitespace. Also capitalizes the first letter of each line. Supports Unicode letters via `\p{L}`.

```typescript
TextTransform.sentenceCase('HELLO WORLD. THIS IS GREAT.')
// { data: 'Hello world. This is great.' }

TextTransform.sentenceCase('wow! amazing! cool')
// { data: 'Wow! Amazing! Cool' }

TextTransform.sentenceCase('über cool. élan nice.')
// { data: 'Über cool. Élan nice.' }
```

### `uppercase(text: string): TextshiftResult`

Converts the entire text to uppercase.

```typescript
TextTransform.uppercase('hello world')
// { data: 'HELLO WORLD' }

TextTransform.uppercase('straße')
// { data: 'STRASSE' }
```

## Unicode Support

All transformations use `Intl.Segmenter` with grapheme granularity for proper Unicode handling.

| Input  | `reverse` | `capitalizedCase` | `inverseCase` |
| ------ | --------- | ----------------- | ------------- |
| `café` | `éfac`    | `Café`            | `CAFÉ`        |
| `über` | `rebü`    | `Über`            | `ÜBER`        |
| `👨‍👩‍👧‍👦hi` | `ih👨‍👩‍👧‍👦`    | `👨‍👩‍👧‍👦hi`            | `👨‍👩‍👧‍👦HI`        |
| `🇯🇵ab` | `ba🇯🇵`    | `🇯🇵ab`            | `🇯🇵AB`        |

Supported scripts include Latin, Cyrillic, Greek, CJK, Korean, Japanese, Arabic, Hebrew, Thai, and Devanagari.

## Multiline Handling

Methods that operate on words (`capitalizedCase`, `sentenceCase`) preserve line structure and indentation.

```typescript
TextTransform.capitalizedCase('  hello world\n    foo bar')
// { data: '  Hello World\n    Foo Bar' }

TextTransform.sentenceCase('hello world.\n  another line.')
// { data: 'Hello world.\n  Another line.' }
```

Empty lines are passed through unchanged.

## Error Handling

All methods return `{ error }` for invalid input. Non-string types are rejected.

```typescript
TextTransform.normalize(null)
// { error: 'Input must be a string' }

TextTransform.normalize(42)
// { error: 'Input must be a string' }

TextTransform.normalize('')
// { data: '' }
```
