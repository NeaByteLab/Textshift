import { defineBuildConfig } from 'unbuild'
import { resolve } from 'node:path'

/**
 * Unbuild config for package bundle.
 * @description Entry, alias, CJS/ESM, declarations, no sourcemaps.
 */
export default defineBuildConfig({
  /** Entry module path(s) for build. */
  entries: ['src/index'],
  /** Emit TypeScript declaration files. */
  declaration: true,
  /** Remove output directory before build. */
  clean: true,
  /** Path alias for imports (e.g. @app/ → src/). */
  alias: {
    '@neabyte/textshift': resolve(__dirname, 'src/index.ts'),
    '@app': resolve(__dirname, 'src'),
    '@tests': resolve(__dirname, 'tests')
  },
  /** Rollup options: emit CJS and inline runtime deps. */
  rollup: {
    emitCJS: true,
    inlineDependencies: true
  },
  /** Disable source map generation. */
  sourcemap: false,
  /** Do not fail build on Rollup warnings. */
  failOnWarn: false
})
