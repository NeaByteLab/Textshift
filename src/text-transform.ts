import type * as Types from '@app/types.ts'

/**
 * Unicode-aware text case transformer.
 * @description Applies case transformations using grapheme segmentation.
 */
export class TextTransform {
  /** ASCII letter detection pattern */
  private static readonly alphaPattern: RegExp = /[a-zA-Z]/
  /** Unicode grapheme cluster segmenter */
  private static readonly segmenter: Intl.Segmenter = new Intl.Segmenter(undefined, {
    granularity: 'grapheme'
  })
  /** Sentence start detection pattern */
  private static readonly sentencePattern: RegExp = /(^\s*\p{L}|[.!?]\s+\p{L})/gu

  /**
   * Apply alternating lower-upper case.
   * @description Toggles case on each alphabetic character sequentially.
   * @param text - Input string to transform
   * @returns Result with alternating-cased text or error
   */
  static alternatingCase(text: string): Types.TextshiftResult {
    return TextTransform.withValidation(text, (validText) => {
      let alphaIndex: number = 0
      return TextTransform.toGraphemes(validText).map((grapheme) => {
        if (TextTransform.alphaPattern.test(grapheme)) {
          const transformed: string = alphaIndex % 2 === 0
            ? grapheme.toLowerCase()
            : grapheme.toUpperCase()
          alphaIndex++
          return transformed
        }
        return grapheme
      }).join('')
    })
  }

  /**
   * Capitalize first letter per word.
   * @description Uppercases first character, lowercases rest per word.
   * @param text - Input string to transform
   * @returns Result with capitalized text or error
   */
  static capitalizedCase(text: string): Types.TextshiftResult {
    return TextTransform.withValidation(
      text,
      (validText) => TextTransform.mapWords(validText, (word) => TextTransform.capitalizeWord(word))
    )
  }

  /**
   * Swap upper and lower case.
   * @description Inverts case of every alphabetic character.
   * @param text - Input string to transform
   * @returns Result with inverse-cased text or error
   */
  static inverseCase(text: string): Types.TextshiftResult {
    return TextTransform.withValidation(
      text,
      (validText) =>
        TextTransform.toGraphemes(validText).map((grapheme) => {
          const lower: string = grapheme.toLowerCase()
          const upper: string = grapheme.toUpperCase()
          if (grapheme === upper && grapheme !== lower) {
            return lower
          }
          if (grapheme === lower && grapheme !== upper) {
            return upper
          }
          return grapheme
        }).join('')
    )
  }

  /**
   * Convert text to lowercase.
   * @description Lowercases all characters in the string.
   * @param text - Input string to transform
   * @returns Result with lowercased text or error
   */
  static lowercase(text: string): Types.TextshiftResult {
    return TextTransform.withValidation(text, (validText) => validText.toLowerCase())
  }

  /**
   * Normalize whitespace and blank lines.
   * @description Collapses spaces, trims lines, limits consecutive newlines.
   * @param text - Input string to normalize
   * @returns Result with normalized text or error
   */
  static normalize(text: string): Types.TextshiftResult {
    return TextTransform.withValidation(text, (validText) =>
      validText
        .split(/\r?\n/)
        .map((line) => line.replace(/[ \t]+/g, ' ').trim())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim())
  }

  /**
   * Reverse grapheme cluster order.
   * @description Reverses text preserving Unicode grapheme clusters.
   * @param text - Input string to reverse
   * @returns Result with reversed text or error
   */
  static reverse(text: string): Types.TextshiftResult {
    return TextTransform.withValidation(
      text,
      (validText) => TextTransform.toGraphemes(validText).toReversed().join('')
    )
  }

  /**
   * Capitalize first letter per sentence.
   * @description Lowercases text then uppercases sentence starts.
   * @param text - Input string to transform
   * @returns Result with sentence-cased text or error
   */
  static sentenceCase(text: string): Types.TextshiftResult {
    return TextTransform.withValidation(
      text,
      (validText) =>
        TextTransform.mapLines(validText, (trimmedLine) =>
          trimmedLine.toLowerCase().replace(
            TextTransform.sentencePattern,
            (match) => match.toUpperCase()
          ))
    )
  }

  /**
   * Convert text to uppercase.
   * @description Uppercases all characters in the string.
   * @param text - Input string to transform
   * @returns Result with uppercased text or error
   */
  static uppercase(text: string): Types.TextshiftResult {
    return TextTransform.withValidation(text, (validText) => validText.toUpperCase())
  }

  /**
   * Capitalize a single word.
   * @description Uppercases first grapheme, lowercases the rest.
   * @param word - Single word to capitalize
   * @returns Word with first letter uppercased
   */
  private static capitalizeWord(word: string): string {
    const graphemes: string[] = TextTransform.toGraphemes(word)
    if (graphemes.length === 0) {
      return word
    }
    return graphemes[0]!.toUpperCase() + graphemes.slice(1).join('').toLowerCase()
  }

  /**
   * Apply mapper to each text line.
   * @description Preserves indentation while transforming trimmed content.
   * @param text - Multi-line input string
   * @param lineMapper - Transform function for trimmed lines
   * @returns Text with each line transformed
   */
  private static mapLines(
    text: string,
    lineMapper: (trimmedLine: string) => string
  ): string {
    return text.split(/\r?\n/).map((line) => {
      if (line.trim() === '') {
        return line
      }
      const indentation: string = /^\s*/.exec(line)![0]!
      return indentation + lineMapper(line.trim())
    }).join('\n')
  }

  /**
   * Apply mapper to each word.
   * @description Splits lines into words and transforms each.
   * @param text - Input string to process
   * @param wordMapper - Transform function for each word
   * @returns Text with each word transformed
   */
  private static mapWords(
    text: string,
    wordMapper: (word: string) => string
  ): string {
    return TextTransform.mapLines(text, (trimmedLine) => {
      const words: string[] = TextTransform.splitWords(trimmedLine)
      if (words.length === 0) {
        return trimmedLine
      }
      return words.map(wordMapper).join(' ')
    })
  }

  /**
   * Split text into word tokens.
   * @description Normalizes whitespace and splits into non-empty words.
   * @param text - Input string to split
   * @returns Array of non-empty word strings
   */
  private static splitWords(text: string): string[] {
    return text.replace(/\s+/g, ' ').split(/\s+/).filter((w) => w.length > 0)
  }

  /**
   * Split text into grapheme clusters.
   * @description Uses Intl.Segmenter for Unicode-safe splitting.
   * @param text - Input string to segment
   * @returns Array of grapheme cluster strings
   */
  private static toGraphemes(text: string): string[] {
    return Array.from(TextTransform.segmenter.segment(text), (s) => s.segment)
  }

  /**
   * Validate input and apply transform.
   * @description Checks string type, handles empty, then transforms.
   * @param text - Input string to validate
   * @param transform - Transform function for valid input
   * @returns Result with transformed text or error
   */
  private static withValidation(
    text: string,
    transform: (validText: string) => string
  ): Types.TextshiftResult {
    if (typeof text !== 'string') {
      return { error: 'Input must be a string' }
    }
    if (text === '') {
      return { data: '' }
    }
    return { data: transform(text) }
  }
}
