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
    namedExports: { '@dcl/ecs-scene-utils' : ['Delay']}
  }),

  PROD && terser({})
]

export default {
  input: './src/index.ts',
  context: 'globalThis',
  plugins,
  output: [
    {
      file: './dist/index.js',
      format: 'umd',
      name: 'decentraland-unlock-integration',
      sourcemap: true,
      amd: {
        id: '@thehen/decentraland-unlock-integration'
      }
    }
  ]
}