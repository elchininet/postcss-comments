import ts from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import terser from '@rollup/plugin-terser';

export default [
    {
        plugins: [
            ts(),
            terser({
                output: {
                    comments: false
                }
            })
        ],
        input: `src/index.ts`,
        external: [ 'postcss' ],
        output: [
            {
                file: `index.js`,
                format: 'cjs',
                exports: 'default'
            },
            {
                file: `esm/index.js`,
                format: 'es'
            }
        ]
    },
    {
        plugins: [
            tsConfigPaths(),
            dts()
        ],
        input: `src/index.ts`,
        external: [ 'postcss' ],
        output: [
            {
                file: `index.d.ts`,
                format: 'cjs',
                exports: 'default'
            },
            {
                file: `esm/index.d.ts`,
                format: 'es'
            }
        ]
    }
];