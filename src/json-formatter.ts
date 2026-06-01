import type * as Types from '@app/types.ts'

/**
 * JSON string formatting utility.
 * @description Beautifies, minifies, and sorts JSON strings.
 */
export class JsonFormatter {
  /** Ascending locale string comparator */
  private static readonly ascComparator: Types.SortComparator = (a, b) => a.localeCompare(b)
  /** Descending locale string comparator */
  private static readonly descComparator: Types.SortComparator = (a, b) => b.localeCompare(a)
  /** Named sorting strategy map */
  private static readonly sorters: Record<string, Types.ObjectSorter> = {
    sortKeyAsc: JsonFormatter.sortByKeys(JsonFormatter.ascComparator),
    sortKeyDesc: JsonFormatter.sortByKeys(JsonFormatter.descComparator),
    sortValueAsc: JsonFormatter.sortByValues(JsonFormatter.ascComparator),
    sortValueDesc: JsonFormatter.sortByValues(JsonFormatter.descComparator)
  }

  /**
   * Format JSON with indentation.
   * @description Parses and pretty-prints JSON with two-space indent.
   * @param text - Raw JSON string input
   * @returns Result with formatted JSON or error
   */
  static beautify(text: string): Types.TextshiftResult {
    return JsonFormatter.withValidation(text, (parsed) => JSON.stringify(parsed, null, 2))
  }

  /**
   * Compact JSON to single line.
   * @description Parses and minifies JSON removing all whitespace.
   * @param text - Raw JSON string input
   * @returns Result with minified JSON or error
   */
  static minify(text: string): Types.TextshiftResult {
    return JsonFormatter.withValidation(text, (parsed) => JSON.stringify(parsed))
  }

  /**
   * Sort JSON keys ascending.
   * @description Recursively sorts object keys in ascending order.
   * @param text - Raw JSON string input
   * @returns Result with sorted JSON or error
   */
  static sortKeyAsc(text: string): Types.TextshiftResult {
    return JsonFormatter.sortWith(text, 'sortKeyAsc')
  }

  /**
   * Sort JSON keys descending.
   * @description Recursively sorts object keys in descending order.
   * @param text - Raw JSON string input
   * @returns Result with sorted JSON or error
   */
  static sortKeyDesc(text: string): Types.TextshiftResult {
    return JsonFormatter.sortWith(text, 'sortKeyDesc')
  }

  /**
   * Sort JSON values ascending.
   * @description Recursively sorts object values in ascending order.
   * @param text - Raw JSON string input
   * @returns Result with sorted JSON or error
   */
  static sortValueAsc(text: string): Types.TextshiftResult {
    return JsonFormatter.sortWith(text, 'sortValueAsc')
  }

  /**
   * Sort JSON values descending.
   * @description Recursively sorts object values in descending order.
   * @param text - Raw JSON string input
   * @returns Result with sorted JSON or error
   */
  static sortValueDesc(text: string): Types.TextshiftResult {
    return JsonFormatter.sortWith(text, 'sortValueDesc')
  }

  /**
   * Create key-based object sorter.
   * @description Builds sorter that reorders keys by comparator.
   * @param comparator - String comparison function for keys
   * @returns Object sorter using key ordering
   */
  private static sortByKeys(comparator: Types.SortComparator): Types.ObjectSorter {
    return (obj) => {
      const sortedObj: Record<string, unknown> = {}
      for (const key of Object.keys(obj).sort(comparator)) {
        sortedObj[key] = obj[key]
      }
      return sortedObj
    }
  }

  /**
   * Create value-based object sorter.
   * @description Builds sorter that reorders entries by value.
   * @param comparator - String comparison function for values
   * @returns Object sorter using value ordering
   */
  private static sortByValues(comparator: Types.SortComparator): Types.ObjectSorter {
    return (obj) => {
      const entries: [string, unknown][] = Object.entries(obj)
      entries.sort(([, a], [, b]) => comparator(String(a), String(b)))
      return Object.fromEntries(entries)
    }
  }

  /**
   * Sort nested objects recursively.
   * @description Applies sorter to object and all nested objects.
   * @param data - Parsed JSON value to sort
   * @param sorter - Object sorting function to apply
   * @returns Recursively sorted data structure
   */
  private static sortRecursive(data: unknown, sorter: Types.ObjectSorter): unknown {
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      return data
    }
    const obj: Record<string, unknown> = data as Record<string, unknown>
    const sortedObj: Record<string, unknown> = sorter(obj)
    for (const key of Object.keys(sortedObj)) {
      const value: unknown = sortedObj[key]
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        sortedObj[key] = JsonFormatter.sortRecursive(value, sorter)
      }
    }
    return sortedObj
  }

  /**
   * Sort JSON using named strategy.
   * @description Validates, parses, sorts, and re-serializes JSON.
   * @param text - Raw JSON string input
   * @param sorterKey - Key into sorters strategy map
   * @returns Result with sorted JSON or error
   */
  private static sortWith(text: string, sorterKey: string): Types.TextshiftResult {
    return JsonFormatter.withValidation(text, (parsed) => {
      const sortedData: unknown = JsonFormatter.sortRecursive(
        parsed,
        JsonFormatter.sorters[sorterKey]!
      )
      return JSON.stringify(sortedData, null, 2)
    })
  }

  /**
   * Validate and process JSON string.
   * @description Checks input, parses JSON, and applies processor.
   * @param text - Raw JSON string input
   * @param processor - Transform function for parsed data
   * @returns Result with processed output or error
   */
  private static withValidation(
    text: string,
    processor: (parsed: unknown) => string
  ): Types.TextshiftResult {
    if (typeof text !== 'string' || text.trim() === '') {
      return { error: 'Input must be a non-empty string' }
    }
    try {
      const parsed: unknown = JSON.parse(text)
      return { data: processor(parsed) }
    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error)
      return { error: `Invalid JSON input - ${errorMessage}` }
    }
  }
}
