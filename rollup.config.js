import ts from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';

export default {
    input: `src/index.ts`,
    external: [ 'postcss' ],
    output: [
        {
            file: `dist/index.js`,
            format: 'cjs',
            exports: 'default'
        },
        {
            file: `dist/esm/index.js`,
            format: 'es'
        }
    ],
    plugins: [
        ts(),
        terser({
            output: {
                comments: false
            }
        })
    ]
};