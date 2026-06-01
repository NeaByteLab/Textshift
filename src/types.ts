/**
 * Text operation result container.
 * @description Holds transformed data or error message.
 */
export interface TextshiftResult {
  /** Transformed output string */
  data?: string
  /** Error message on failure */
  error?: string
}

/**
 * Object key-value sorting function.
 * @description Reorders object entries by specified criteria.
 * @param obj - Source object to sort
 * @returns New object with sorted entries
 */
export type ObjectSorter = (obj: Record<string, unknown>) => Record<string, unknown>

/**
 * String comparison function for sorting.
 * @description Compares two strings for sort ordering.
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns Negative, zero, or positive number
 */
export type SortComparator = (a: string, b: string) => number
