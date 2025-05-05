import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import closure from 'rollup-plugin-closure-compiler';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: false,
  },
  plugins: [
    peerDepsExternal(), // Exclude peer dependencies
    resolve({
      mainFields: ['module', 'main'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      modulesOnly: true,
    }),
    closure(
      {
        sourcemap: false,
      }
    ),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json', sourceMap: false }),
    postcss({
      extract: true,
      minimize: true,
    }),
  ],
  external: ['react', 'react-dom', 'dashjs', 'hls.js'],
};
