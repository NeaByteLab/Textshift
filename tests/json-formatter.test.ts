import { assertEquals } from '@std/assert'
import { JsonFormatter } from '@app/json-formatter.ts'

Deno.test('JsonFormatter - __proto__ key does not pollute', () => {
  JsonFormatter.sortKeyAsc('{"__proto__":{"polluted":true},"a":1}')
  assertEquals(({} as Record<string, unknown>)['polluted'], undefined)
})

Deno.test('JsonFormatter - all methods reject non-string', () => {
  const methods = [
    'beautify',
    'minify',
    'sortKeyAsc',
    'sortKeyDesc',
    'sortValueAsc',
    'sortValueDesc'
  ] as const
  for (const method of methods) {
    const result = JsonFormatter[method](null as unknown as string)
    assertEquals(result.error, 'Input must be a non-empty string')
    assertEquals(result.data, undefined)
  }
})

Deno.test('JsonFormatter - beautify already pretty is idempotent', () => {
  const pretty = JSON.stringify({ a: 1 }, null, 2)
  assertEquals(JsonFormatter.beautify(pretty), { data: pretty })
})

Deno.test('JsonFormatter - beautify array', () => {
  assertEquals(JsonFormatter.beautify('[1,2,3]'), { data: JSON.stringify([1, 2, 3], null, 2) })
})

Deno.test('JsonFormatter - beautify basic', () => {
  assertEquals(JsonFormatter.beautify('{"a":1,"b":2}'), {
    data: JSON.stringify({ a: 1, b: 2 }, null, 2)
  })
})

Deno.test('JsonFormatter - beautify nested', () => {
  assertEquals(
    JsonFormatter.beautify('{"a":{"b":1}}'),
    { data: JSON.stringify({ a: { b: 1 } }, null, 2) }
  )
})

Deno.test('JsonFormatter - constructor key does not crash', () => {
  const result = JsonFormatter.sortKeyAsc('{"constructor":{"a":1},"b":2}')
  assertEquals(typeof result.data, 'string')
})

Deno.test('JsonFormatter - extra bracket returns error', () => {
  const result = JsonFormatter.minify('{"a":1}}')
  assertEquals(result.data, undefined)
  assertEquals(typeof result.error, 'string')
})

Deno.test('JsonFormatter - handles 50 levels deep nesting', () => {
  let deep = '1'
  for (let i = 0; i < 50; i++) {
    deep = `{"k":${deep}}`
  }
  const result = JsonFormatter.minify(deep)
  assertEquals(result.error, undefined)
  assertEquals(typeof result.data, 'string')
})

Deno.test('JsonFormatter - incomplete JSON returns error', () => {
  const result = JsonFormatter.minify('{"a":')
  assertEquals(result.data, undefined)
  assertEquals(typeof result.error, 'string')
})

Deno.test('JsonFormatter - invalid JSON returns error', () => {
  const result = JsonFormatter.minify('{invalid}')
  assertEquals(result.data, undefined)
  assertEquals(typeof result.error, 'string')
  assertEquals(result.error!.startsWith('Invalid JSON input'), true)
})

Deno.test('JsonFormatter - minify already minified is idempotent', () => {
  const minified = '{"a":1,"b":2}'
  assertEquals(JsonFormatter.minify(minified), { data: minified })
})

Deno.test('JsonFormatter - minify array', () => {
  assertEquals(JsonFormatter.minify('[1, 2, 3]'), { data: '[1,2,3]' })
})

Deno.test('JsonFormatter - minify basic', () => {
  const pretty = JSON.stringify({ a: 1, b: 2 }, null, 2)
  assertEquals(JsonFormatter.minify(pretty), { data: '{"a":1,"b":2}' })
})

Deno.test('JsonFormatter - minify boolean', () => {
  assertEquals(JsonFormatter.minify('true'), { data: 'true' })
})

Deno.test('JsonFormatter - minify deeply nested', () => {
  assertEquals(JsonFormatter.minify('{"a":{"b":{"c":{"d":1}}}}'), {
    data: '{"a":{"b":{"c":{"d":1}}}}'
  })
})

Deno.test('JsonFormatter - minify duplicate keys last wins', () => {
  assertEquals(JsonFormatter.minify('{"a":1,"a":2}'), { data: '{"a":2}' })
})

Deno.test('JsonFormatter - minify emoji value', () => {
  assertEquals(JsonFormatter.minify('{"emoji":"😀"}'), { data: '{"emoji":"😀"}' })
})

Deno.test('JsonFormatter - minify empty array', () => {
  assertEquals(JsonFormatter.minify('[]'), { data: '[]' })
})

Deno.test('JsonFormatter - minify empty object', () => {
  assertEquals(JsonFormatter.minify('{}'), { data: '{}' })
})

Deno.test('JsonFormatter - minify empty string value', () => {
  assertEquals(JsonFormatter.minify('{"a":""}'), { data: '{"a":""}' })
})

Deno.test('JsonFormatter - minify float', () => {
  assertEquals(JsonFormatter.minify('3.14'), { data: '3.14' })
})

Deno.test('JsonFormatter - minify negative number', () => {
  assertEquals(JsonFormatter.minify('-1'), { data: '-1' })
})

Deno.test('JsonFormatter - minify negative zero becomes zero', () => {
  assertEquals(JsonFormatter.minify('{"n":-0}'), { data: '{"n":0}' })
})

Deno.test('JsonFormatter - minify nested arrays', () => {
  assertEquals(JsonFormatter.minify('[[1,[2,[3]]]]'), { data: '[[1,[2,[3]]]]' })
})

Deno.test('JsonFormatter - minify null literal', () => {
  assertEquals(JsonFormatter.minify('null'), { data: 'null' })
})

Deno.test('JsonFormatter - minify scientific notation', () => {
  assertEquals(JsonFormatter.minify('{"n":1e10}'), { data: '{"n":10000000000}' })
})

Deno.test('JsonFormatter - minify string value', () => {
  assertEquals(JsonFormatter.minify('"hello"'), { data: '"hello"' })
})

Deno.test('JsonFormatter - minify zero', () => {
  assertEquals(JsonFormatter.minify('0'), { data: '0' })
})

Deno.test('JsonFormatter - rejects array input', () => {
  assertEquals(JsonFormatter.minify([] as unknown as string), {
    error: 'Input must be a non-empty string'
  })
})

Deno.test('JsonFormatter - rejects boolean input', () => {
  assertEquals(JsonFormatter.minify(true as unknown as string), {
    error: 'Input must be a non-empty string'
  })
})

Deno.test('JsonFormatter - rejects empty string', () => {
  assertEquals(JsonFormatter.minify(''), { error: 'Input must be a non-empty string' })
})

Deno.test('JsonFormatter - rejects null input', () => {
  assertEquals(JsonFormatter.minify(null as unknown as string), {
    error: 'Input must be a non-empty string'
  })
})

Deno.test('JsonFormatter - rejects number input', () => {
  assertEquals(JsonFormatter.minify(42 as unknown as string), {
    error: 'Input must be a non-empty string'
  })
})

Deno.test('JsonFormatter - rejects object input', () => {
  assertEquals(JsonFormatter.minify({} as unknown as string), {
    error: 'Input must be a non-empty string'
  })
})

Deno.test('JsonFormatter - rejects undefined input', () => {
  assertEquals(JsonFormatter.minify(undefined as unknown as string), {
    error: 'Input must be a non-empty string'
  })
})

Deno.test('JsonFormatter - rejects whitespace only', () => {
  assertEquals(JsonFormatter.minify('   '), { error: 'Input must be a non-empty string' })
})

Deno.test('JsonFormatter - result has data xor error', () => {
  const results = [
    JsonFormatter.minify('{"a":1}'),
    JsonFormatter.beautify('{"a":1}'),
    JsonFormatter.sortKeyAsc('{"a":1}'),
    JsonFormatter.sortKeyDesc('{"a":1}'),
    JsonFormatter.sortValueAsc('{"a":1}'),
    JsonFormatter.sortValueDesc('{"a":1}'),
    JsonFormatter.minify('invalid'),
    JsonFormatter.minify(''),
    JsonFormatter.minify(null as unknown as string)
  ]
  for (const result of results) {
    const hasData = result.data !== undefined
    const hasError = result.error !== undefined
    assertEquals(hasData !== hasError, true)
  }
})

Deno.test('JsonFormatter - roundtrip minify then beautify then minify', () => {
  const inputs = ['{"a":1,"b":[1,2,3]}', '[]', '{}', 'null', '42', '"hello"', 'true', 'false']
  for (const input of inputs) {
    const m1 = JsonFormatter.minify(input)
    const b = JsonFormatter.beautify(m1.data!)
    const m2 = JsonFormatter.minify(b.data!)
    assertEquals(m1, m2)
  }
})

Deno.test('JsonFormatter - sortKeyAsc 3 levels deep', () => {
  const input = JSON.stringify({ z: { y: { x: { w: 1, v: 2 }, b: 3 }, a: 4 }, m: 5 })
  const expected = JSON.stringify({ m: 5, z: { a: 4, y: { b: 3, x: { v: 2, w: 1 } } } }, null, 2)
  assertEquals(JsonFormatter.sortKeyAsc(input), { data: expected })
})

Deno.test('JsonFormatter - sortKeyAsc array in object preserved', () => {
  const result = JsonFormatter.sortKeyAsc('{"b":[3,1,2],"a":1}')
  const parsed = JSON.parse(result.data!)
  assertEquals(Object.keys(parsed), ['a', 'b'])
  assertEquals(parsed.b, [3, 1, 2])
})

Deno.test('JsonFormatter - sortKeyAsc array passthrough', () => {
  assertEquals(JsonFormatter.sortKeyAsc('[3,1,2]'), { data: JSON.stringify([3, 1, 2], null, 2) })
})

Deno.test('JsonFormatter - sortKeyAsc basic', () => {
  assertEquals(
    JsonFormatter.sortKeyAsc('{"c":3,"a":1,"b":2}'),
    { data: JSON.stringify({ a: 1, b: 2, c: 3 }, null, 2) }
  )
})

Deno.test('JsonFormatter - sortKeyAsc empty object', () => {
  assertEquals(JsonFormatter.sortKeyAsc('{}'), { data: '{}' })
})

Deno.test('JsonFormatter - sortKeyAsc idempotent', () => {
  const input = '{"c":3,"a":{"z":1,"y":2}}'
  const once = JsonFormatter.sortKeyAsc(input)
  const twice = JsonFormatter.sortKeyAsc(once.data!)
  assertEquals(once, twice)
})

Deno.test('JsonFormatter - sortKeyAsc nested recursive', () => {
  const input = JSON.stringify({ z: { b: 2, a: 1 }, a: { d: 4, c: 3 } })
  const expected = JSON.stringify({ a: { c: 3, d: 4 }, z: { a: 1, b: 2 } }, null, 2)
  assertEquals(JsonFormatter.sortKeyAsc(input), { data: expected })
})

Deno.test('JsonFormatter - sortKeyAsc null value in object', () => {
  assertEquals(
    JsonFormatter.sortKeyAsc('{"b":null,"a":1}'),
    { data: JSON.stringify({ a: 1, b: null }, null, 2) }
  )
})

Deno.test('JsonFormatter - sortKeyAsc reversed equals sortKeyDesc', () => {
  const input = '{"d":4,"a":1,"c":3,"b":2}'
  const ascKeys = Object.keys(JSON.parse(JsonFormatter.sortKeyAsc(input).data!))
  const descKeys = Object.keys(JSON.parse(JsonFormatter.sortKeyDesc(input).data!))
  assertEquals(ascKeys.toReversed(), descKeys)
})

Deno.test('JsonFormatter - sortKeyAsc single key', () => {
  assertEquals(JsonFormatter.sortKeyAsc('{"a":1}'), { data: JSON.stringify({ a: 1 }, null, 2) })
})

Deno.test('JsonFormatter - sortKeyDesc basic', () => {
  assertEquals(
    JsonFormatter.sortKeyDesc('{"a":1,"c":3,"b":2}'),
    { data: JSON.stringify({ c: 3, b: 2, a: 1 }, null, 2) }
  )
})

Deno.test('JsonFormatter - sortKeyDesc key order', () => {
  const result = JsonFormatter.sortKeyDesc('{"d":4,"a":1,"c":3,"b":2}')
  const keys = Object.keys(JSON.parse(result.data!))
  assertEquals(keys, ['d', 'c', 'b', 'a'])
})

Deno.test('JsonFormatter - sortValueAsc basic', () => {
  assertEquals(
    JsonFormatter.sortValueAsc('{"a":"cherry","b":"apple","c":"banana"}'),
    { data: JSON.stringify({ b: 'apple', c: 'banana', a: 'cherry' }, null, 2) }
  )
})

Deno.test('JsonFormatter - sortValueAsc key order by value', () => {
  const result = JsonFormatter.sortValueAsc('{"x":"charlie","y":"alpha","z":"bravo"}')
  const keys = Object.keys(JSON.parse(result.data!))
  assertEquals(keys, ['y', 'z', 'x'])
})

Deno.test('JsonFormatter - sortValueDesc basic', () => {
  assertEquals(
    JsonFormatter.sortValueDesc('{"a":"cherry","b":"apple","c":"banana"}'),
    { data: JSON.stringify({ a: 'cherry', c: 'banana', b: 'apple' }, null, 2) }
  )
})

Deno.test('JsonFormatter - toString valueOf keys do not crash', () => {
  const result = JsonFormatter.sortKeyAsc('{"toString":1,"valueOf":2}')
  assertEquals(typeof result.data, 'string')
})

Deno.test('JsonFormatter - trailing comma returns error', () => {
  const result = JsonFormatter.minify('{"a":1,}')
  assertEquals(result.data, undefined)
  assertEquals(typeof result.error, 'string')
})

Deno.test('JsonFormatter - unquoted key returns error', () => {
  const result = JsonFormatter.minify('{a:1}')
  assertEquals(result.data, undefined)
  assertEquals(typeof result.error, 'string')
})
