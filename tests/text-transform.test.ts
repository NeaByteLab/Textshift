import { assertEquals } from '@std/assert'
import { TextTransform } from '@app/text-transform.ts'

Deno.test('TextTransform - all methods reject non-string', () => {
  const methods = [
    'alternatingCase',
    'capitalizedCase',
    'inverseCase',
    'lowercase',
    'normalize',
    'reverse',
    'sentenceCase',
    'uppercase'
  ] as const
  for (const method of methods) {
    assertEquals(TextTransform[method](42 as unknown as string), {
      error: 'Input must be a string'
    })
    assertEquals(TextTransform[method](null as unknown as string), {
      error: 'Input must be a string'
    })
  }
})

Deno.test('TextTransform - alternatingCase across newlines', () => {
  assertEquals(TextTransform.alternatingCase('ab\ncd'), { data: 'aB\ncD' })
})

Deno.test('TextTransform - alternatingCase across tabs', () => {
  assertEquals(TextTransform.alternatingCase('a\tb\tc'), { data: 'a\tB\tc' })
})

Deno.test('TextTransform - alternatingCase all spaces unchanged', () => {
  assertEquals(TextTransform.alternatingCase('   '), { data: '   ' })
})

Deno.test('TextTransform - alternatingCase already alternating unchanged', () => {
  assertEquals(TextTransform.alternatingCase('aBcDe'), { data: 'aBcDe' })
})

Deno.test('TextTransform - alternatingCase basic', () => {
  assertEquals(TextTransform.alternatingCase('hello'), { data: 'hElLo' })
})

Deno.test('TextTransform - alternatingCase emoji skipped', () => {
  assertEquals(TextTransform.alternatingCase('a😀b😀c😀d'), { data: 'a😀B😀c😀D' })
})

Deno.test('TextTransform - alternatingCase empty string', () => {
  assertEquals(TextTransform.alternatingCase(''), { data: '' })
})

Deno.test('TextTransform - alternatingCase long run', () => {
  assertEquals(TextTransform.alternatingCase('abcdefghij'), { data: 'aBcDeFgHiJ' })
})

Deno.test('TextTransform - alternatingCase numbers skipped', () => {
  assertEquals(TextTransform.alternatingCase('a1b2c'), { data: 'a1B2c' })
})

Deno.test('TextTransform - alternatingCase punctuation skipped', () => {
  assertEquals(TextTransform.alternatingCase('a.b.c'), { data: 'a.B.c' })
})

Deno.test('TextTransform - alternatingCase single char', () => {
  assertEquals(TextTransform.alternatingCase('a'), { data: 'a' })
})

Deno.test('TextTransform - alternatingCase two chars', () => {
  assertEquals(TextTransform.alternatingCase('ab'), { data: 'aB' })
})

Deno.test('TextTransform - alternatingCase with spaces', () => {
  assertEquals(TextTransform.alternatingCase('hello world'), { data: 'hElLo WoRlD' })
})

Deno.test('TextTransform - capitalizedCase 3 levels indent', () => {
  assertEquals(TextTransform.capitalizedCase('hello\n  world\n    deep\n      deeper'), {
    data: 'Hello\n  World\n    Deep\n      Deeper'
  })
})

Deno.test('TextTransform - capitalizedCase accented latin', () => {
  assertEquals(TextTransform.capitalizedCase('über cool café'), { data: 'Über Cool Café' })
})

Deno.test('TextTransform - capitalizedCase basic', () => {
  assertEquals(TextTransform.capitalizedCase('hello world'), { data: 'Hello World' })
})

Deno.test('TextTransform - capitalizedCase cyrillic', () => {
  assertEquals(TextTransform.capitalizedCase('привет мир'), { data: 'Привет Мир' })
})

Deno.test('TextTransform - capitalizedCase empty lines between', () => {
  assertEquals(TextTransform.capitalizedCase('hello\n\n\nworld'), { data: 'Hello\n\n\nWorld' })
})

Deno.test('TextTransform - capitalizedCase empty string', () => {
  assertEquals(TextTransform.capitalizedCase(''), { data: '' })
})

Deno.test('TextTransform - capitalizedCase greek', () => {
  assertEquals(TextTransform.capitalizedCase('γεια σου κόσμε'), { data: 'Γεια Σου Κόσμε' })
})

Deno.test('TextTransform - capitalizedCase mixed case', () => {
  assertEquals(TextTransform.capitalizedCase('hELLO wORLD'), { data: 'Hello World' })
})

Deno.test('TextTransform - capitalizedCase multiline preserves indent', () => {
  assertEquals(TextTransform.capitalizedCase('  hello world\n    foo bar'), {
    data: '  Hello World\n    Foo Bar'
  })
})

Deno.test('TextTransform - capitalizedCase single word', () => {
  assertEquals(TextTransform.capitalizedCase('hello'), { data: 'Hello' })
})

Deno.test('TextTransform - capitalizedCase tabs mixed indent', () => {
  assertEquals(TextTransform.capitalizedCase('\thello world\n  foo bar\n\t\tdeep nested'), {
    data: '\tHello World\n  Foo Bar\n\t\tDeep Nested'
  })
})

Deno.test('TextTransform - capitalizedCase unicode accented', () => {
  assertEquals(TextTransform.capitalizedCase('café world'), { data: 'Café World' })
})

Deno.test('TextTransform - inverseCase accented', () => {
  assertEquals(TextTransform.inverseCase('Über'), { data: 'üBER' })
})

Deno.test('TextTransform - inverseCase all lower', () => {
  assertEquals(TextTransform.inverseCase('hello'), { data: 'HELLO' })
})

Deno.test('TextTransform - inverseCase all upper', () => {
  assertEquals(TextTransform.inverseCase('HELLO'), { data: 'hello' })
})

Deno.test('TextTransform - inverseCase basic', () => {
  assertEquals(TextTransform.inverseCase('Hello World'), { data: 'hELLO wORLD' })
})

Deno.test('TextTransform - inverseCase empty string', () => {
  assertEquals(TextTransform.inverseCase(''), { data: '' })
})

Deno.test('TextTransform - inverseCase mixed unicode', () => {
  assertEquals(TextTransform.inverseCase('Café'), { data: 'cAFÉ' })
})

Deno.test('TextTransform - inverseCase multiline', () => {
  assertEquals(TextTransform.inverseCase('Hello\nWorld'), { data: 'hELLO\nwORLD' })
})

Deno.test('TextTransform - inverseCase numbers unchanged', () => {
  assertEquals(TextTransform.inverseCase('Hello123'), { data: 'hELLO123' })
})

Deno.test('TextTransform - inverseCase special chars unchanged', () => {
  assertEquals(TextTransform.inverseCase('!@# 123'), { data: '!@# 123' })
})

Deno.test('TextTransform - inverseCase symmetry', () => {
  const input = 'Hello World'
  const once = TextTransform.inverseCase(input)
  const twice = TextTransform.inverseCase(once.data!)
  assertEquals(twice, { data: input })
})

Deno.test('TextTransform - lowercase basic', () => {
  assertEquals(TextTransform.lowercase('HELLO World'), { data: 'hello world' })
})

Deno.test('TextTransform - lowercase empty string', () => {
  assertEquals(TextTransform.lowercase(''), { data: '' })
})

Deno.test('TextTransform - lowercase idempotent', () => {
  const input = 'HELLO World'
  const once = TextTransform.lowercase(input)
  const twice = TextTransform.lowercase(once.data!)
  assertEquals(once, twice)
})

Deno.test('TextTransform - lowercase multiline', () => {
  assertEquals(TextTransform.lowercase('HELLO\nWORLD'), { data: 'hello\nworld' })
})

Deno.test('TextTransform - lowercase numbers unchanged', () => {
  assertEquals(TextTransform.lowercase('12345'), { data: '12345' })
})

Deno.test('TextTransform - lowercase unicode', () => {
  assertEquals(TextTransform.lowercase('CAFÉ'), { data: 'café' })
})

Deno.test('TextTransform - normalize 10 blank lines', () => {
  assertEquals(TextTransform.normalize('a\n\n\n\n\n\n\n\n\n\nb'), { data: 'a\n\nb' })
})

Deno.test('TextTransform - normalize CRLF to LF', () => {
  assertEquals(TextTransform.normalize('a\r\nb'), { data: 'a\nb' })
})

Deno.test('TextTransform - normalize collapses spaces', () => {
  assertEquals(TextTransform.normalize('hello   world'), { data: 'hello world' })
})

Deno.test('TextTransform - normalize collapses tabs', () => {
  assertEquals(TextTransform.normalize('hello\t\tworld'), { data: 'hello world' })
})

Deno.test('TextTransform - normalize empty string', () => {
  assertEquals(TextTransform.normalize(''), { data: '' })
})

Deno.test('TextTransform - normalize idempotent', () => {
  const input = '  hello   world  \n\n\n  foo  '
  const once = TextTransform.normalize(input)
  const twice = TextTransform.normalize(once.data!)
  assertEquals(once, twice)
})

Deno.test('TextTransform - normalize limits blank lines', () => {
  assertEquals(TextTransform.normalize('a\n\n\n\nb'), { data: 'a\n\nb' })
})

Deno.test('TextTransform - normalize mixed CRLF and LF', () => {
  assertEquals(TextTransform.normalize('a\r\nb\nc\r\nd'), { data: 'a\nb\nc\nd' })
})

Deno.test('TextTransform - normalize mixed tabs and spaces', () => {
  assertEquals(TextTransform.normalize('  hello \t world  '), { data: 'hello world' })
})

Deno.test('TextTransform - normalize only newlines', () => {
  assertEquals(TextTransform.normalize('\n\n\n'), { data: '' })
})

Deno.test('TextTransform - normalize only spaces', () => {
  assertEquals(TextTransform.normalize('   '), { data: '' })
})

Deno.test('TextTransform - normalize only tabs', () => {
  assertEquals(TextTransform.normalize('\t\t\t'), { data: '' })
})

Deno.test('TextTransform - normalize preserves NBSP', () => {
  assertEquals(TextTransform.normalize('hello\u00A0world'), { data: 'hello\u00A0world' })
})

Deno.test('TextTransform - normalize preserves single newline', () => {
  assertEquals(TextTransform.normalize('a\nb'), { data: 'a\nb' })
})

Deno.test('TextTransform - normalize preserves zero-width space', () => {
  assertEquals(TextTransform.normalize('hello\u200Bworld'), { data: 'hello\u200Bworld' })
})

Deno.test('TextTransform - normalize single char', () => {
  assertEquals(TextTransform.normalize('a'), { data: 'a' })
})

Deno.test('TextTransform - normalize single space', () => {
  assertEquals(TextTransform.normalize(' '), { data: '' })
})

Deno.test('TextTransform - normalize trailing spaces per line', () => {
  assertEquals(TextTransform.normalize('hello   \n   world   '), { data: 'hello\nworld' })
})

Deno.test('TextTransform - rejects array input', () => {
  assertEquals(TextTransform.normalize([] as unknown as string), {
    error: 'Input must be a string'
  })
})

Deno.test('TextTransform - rejects boolean input', () => {
  assertEquals(TextTransform.normalize(true as unknown as string), {
    error: 'Input must be a string'
  })
})

Deno.test('TextTransform - rejects null input', () => {
  assertEquals(TextTransform.normalize(null as unknown as string), {
    error: 'Input must be a string'
  })
})

Deno.test('TextTransform - rejects number input', () => {
  assertEquals(TextTransform.normalize(42 as unknown as string), {
    error: 'Input must be a string'
  })
})

Deno.test('TextTransform - rejects object input', () => {
  assertEquals(TextTransform.normalize({} as unknown as string), {
    error: 'Input must be a string'
  })
})

Deno.test('TextTransform - rejects undefined input', () => {
  assertEquals(TextTransform.normalize(undefined as unknown as string), {
    error: 'Input must be a string'
  })
})

Deno.test('TextTransform - result has data xor error', () => {
  const results = [
    TextTransform.normalize('test'),
    TextTransform.normalize(''),
    TextTransform.normalize(null as unknown as string),
    TextTransform.reverse('hello'),
    TextTransform.lowercase('HELLO'),
    TextTransform.uppercase('hello'),
    TextTransform.capitalizedCase('hello world'),
    TextTransform.sentenceCase('hello world.'),
    TextTransform.alternatingCase('hello'),
    TextTransform.inverseCase('Hello')
  ]
  for (const result of results) {
    const hasData = result.data !== undefined
    const hasError = result.error !== undefined
    assertEquals(hasData !== hasError, true)
  }
})

Deno.test('TextTransform - reverse CJK', () => {
  assertEquals(TextTransform.reverse('你好世界'), { data: '界世好你' })
})

Deno.test('TextTransform - reverse Korean', () => {
  assertEquals(TextTransform.reverse('안녕하세요'), { data: '요세하녕안' })
})

Deno.test('TextTransform - reverse ZWJ family emoji', () => {
  assertEquals(TextTransform.reverse('👨‍👩‍👧‍👦hello'), { data: 'olleh👨‍👩‍👧‍👦' })
})

Deno.test('TextTransform - reverse accented', () => {
  assertEquals(TextTransform.reverse('café'), { data: 'éfac' })
})

Deno.test('TextTransform - reverse basic', () => {
  assertEquals(TextTransform.reverse('hello'), { data: 'olleh' })
})

Deno.test('TextTransform - reverse emoji', () => {
  assertEquals(TextTransform.reverse('abc😀def'), { data: 'fed😀cba' })
})

Deno.test('TextTransform - reverse empty string', () => {
  assertEquals(TextTransform.reverse(''), { data: '' })
})

Deno.test('TextTransform - reverse flag emoji', () => {
  assertEquals(TextTransform.reverse('🇯🇵ab'), { data: 'ba🇯🇵' })
})

Deno.test('TextTransform - reverse mixed scripts', () => {
  assertEquals(TextTransform.reverse('abcأبت'), { data: 'تبأcba' })
})

Deno.test('TextTransform - reverse single char', () => {
  assertEquals(TextTransform.reverse('x'), { data: 'x' })
})

Deno.test('TextTransform - reverse single emoji', () => {
  assertEquals(TextTransform.reverse('😀'), { data: '😀' })
})

Deno.test('TextTransform - reverse skin tone emoji', () => {
  assertEquals(TextTransform.reverse('👋🏽hi'), { data: 'ih👋🏽' })
})

Deno.test('TextTransform - reverse symmetry', () => {
  const inputs = ['hello', '😀👨‍👩‍👧‍👦🇯🇵', 'café', '你好世界', 'a b c', '👋🏽test🇺🇸']
  for (const input of inputs) {
    const twice = TextTransform.reverse(TextTransform.reverse(input).data!)
    assertEquals(twice, { data: input })
  }
})

Deno.test('TextTransform - reverse two ZWJ emoji', () => {
  assertEquals(TextTransform.reverse('👨‍👩‍👧‍👦👨‍👩‍👧'), { data: '👨‍👩‍👧👨‍👩‍👧‍👦' })
})

Deno.test('TextTransform - reverse two flag emoji', () => {
  assertEquals(TextTransform.reverse('🇺🇸🇯🇵'), { data: '🇯🇵🇺🇸' })
})

Deno.test('TextTransform - reverse with spaces', () => {
  assertEquals(TextTransform.reverse('a b'), { data: 'b a' })
})

Deno.test('TextTransform - sentenceCase accented start', () => {
  assertEquals(TextTransform.sentenceCase('über cool. élan nice.'), {
    data: 'Über cool. Élan nice.'
  })
})

Deno.test('TextTransform - sentenceCase all upper', () => {
  assertEquals(TextTransform.sentenceCase('HELLO WORLD'), { data: 'Hello world' })
})

Deno.test('TextTransform - sentenceCase basic', () => {
  assertEquals(TextTransform.sentenceCase('hello world'), { data: 'Hello world' })
})

Deno.test('TextTransform - sentenceCase cyrillic', () => {
  assertEquals(TextTransform.sentenceCase('привет мир. добро пожаловать.'), {
    data: 'Привет мир. Добро пожаловать.'
  })
})

Deno.test('TextTransform - sentenceCase ellipsis then word', () => {
  assertEquals(TextTransform.sentenceCase('wait... ok. done.'), { data: 'Wait... Ok. Done.' })
})

Deno.test('TextTransform - sentenceCase empty lines preserved', () => {
  assertEquals(TextTransform.sentenceCase('hello.\n\n\nworld.'), { data: 'Hello.\n\n\nWorld.' })
})

Deno.test('TextTransform - sentenceCase empty string', () => {
  assertEquals(TextTransform.sentenceCase(''), { data: '' })
})

Deno.test('TextTransform - sentenceCase exclamation', () => {
  assertEquals(TextTransform.sentenceCase('wow! amazing! cool'), { data: 'Wow! Amazing! Cool' })
})

Deno.test('TextTransform - sentenceCase idempotent', () => {
  const input = 'HELLO WORLD. FOO BAR.'
  const once = TextTransform.sentenceCase(input)
  const twice = TextTransform.sentenceCase(once.data!)
  assertEquals(once, twice)
})

Deno.test('TextTransform - sentenceCase indent preserved', () => {
  assertEquals(TextTransform.sentenceCase('    HELLO WORLD. FOO BAR.'), {
    data: '    Hello world. Foo bar.'
  })
})

Deno.test('TextTransform - sentenceCase multiline', () => {
  assertEquals(TextTransform.sentenceCase('hello world.\n  another line.'), {
    data: 'Hello world.\n  Another line.'
  })
})

Deno.test('TextTransform - sentenceCase multiline complex', () => {
  assertEquals(
    TextTransform.sentenceCase('hello world. foo bar.\n  another. line here.\n\nthird paragraph.'),
    { data: 'Hello world. Foo bar.\n  Another. Line here.\n\nThird paragraph.' }
  )
})

Deno.test('TextTransform - sentenceCase multiple sentences', () => {
  assertEquals(TextTransform.sentenceCase('hello world. this is great. yes it is'), {
    data: 'Hello world. This is great. Yes it is'
  })
})

Deno.test('TextTransform - sentenceCase multiple spaces after period', () => {
  assertEquals(TextTransform.sentenceCase('hello.   world'), { data: 'Hello.   World' })
})

Deno.test('TextTransform - sentenceCase number start', () => {
  assertEquals(TextTransform.sentenceCase('123 hello'), { data: '123 hello' })
})

Deno.test('TextTransform - sentenceCase only punctuation', () => {
  assertEquals(TextTransform.sentenceCase('...!!!???'), { data: '...!!!???' })
})

Deno.test('TextTransform - sentenceCase period no space', () => {
  assertEquals(TextTransform.sentenceCase('hello.world'), { data: 'Hello.world' })
})

Deno.test('TextTransform - sentenceCase question', () => {
  assertEquals(TextTransform.sentenceCase('how? what? why'), { data: 'How? What? Why' })
})

Deno.test('TextTransform - uppercase basic', () => {
  assertEquals(TextTransform.uppercase('hello world'), { data: 'HELLO WORLD' })
})

Deno.test('TextTransform - uppercase empty string', () => {
  assertEquals(TextTransform.uppercase(''), { data: '' })
})

Deno.test('TextTransform - uppercase german eszett', () => {
  assertEquals(TextTransform.uppercase('straße'), { data: 'STRASSE' })
})

Deno.test('TextTransform - uppercase idempotent', () => {
  const input = 'hello world'
  const once = TextTransform.uppercase(input)
  const twice = TextTransform.uppercase(once.data!)
  assertEquals(once, twice)
})

Deno.test('TextTransform - uppercase multiline', () => {
  assertEquals(TextTransform.uppercase('hello\nworld'), { data: 'HELLO\nWORLD' })
})

Deno.test('TextTransform - uppercase special chars unchanged', () => {
  assertEquals(TextTransform.uppercase('!@#$%'), { data: '!@#$%' })
})

Deno.test('TextTransform - uppercase unicode', () => {
  assertEquals(TextTransform.uppercase('café'), { data: 'CAFÉ' })
})
