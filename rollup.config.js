
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

const PROD = !!process.env.CI

console.log(`production: ${PROD}`)

const plugins = [
  typescript({
    verbosity: 2,
    clean: true
  }),
  resolve({
    browser: true,
    preferBuiltins: false
  }),
  commonjs({
    ignoreGlobal: true,
    include: [/node_modules/],
    namedExports: {}
  }),

  PROD && terser({})
]

export default {
  input: './src/index.ts',
  context: 'globalThis',
  plugins,
  external: /(@decentraland\/|@dcl\/|eth-connect)/,
  output: [
    {
      file: './dist/index.js',
      format: 'amd',
      name: '@thehen/decentraland-unlock-integration',
      sourcemap: true,
      amd: {
        id: '@thehen/decentraland-unlock-integration'
      }
    }
  ]
}