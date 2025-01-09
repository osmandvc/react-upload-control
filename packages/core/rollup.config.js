import path from "path";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { babel } from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";

import pkg from "./package.json";

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'react',
  'react-dom',
  'react/jsx-runtime'
];

const typescriptPlugin = typescript({
  tsconfig: "./tsconfig.json",
  declaration: true,
  declarationDir: "./dist",
  rootDir: "./src",
  sourceMap: true,
  exclude: [
    "**/__tests__",
    "**/*.test.ts",
    "**/*.test.tsx",
    "node_modules"
  ],
  compilerOptions: {
    outDir: "./dist",
    declarationDir: "./dist"
  }
});

export default {
  input: "./src/index.ts",
  output: [
    {
      file: path.resolve(__dirname, "dist/index.esm.js"),
      format: "esm",
      sourcemap: true,
      exports: 'named',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react/jsx-runtime': 'jsxRuntime'
      }
    }
  ],
  external,
  plugins: [
    resolve({
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      preferBuiltins: true,
      dedupe: ['react', 'react-dom']
    }),
    commonjs({
      include: /node_modules/,
      requireReturnsDefault: 'auto'
    }),
    typescriptPlugin,
    babel({
      babelHelpers: "bundled",
      exclude: /node_modules/,
      extensions: [".ts", ".tsx"],
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript"
      ]
    }),
    json(),
    terser({
      format: {
        comments: false
      },
      compress: {
        drop_console: true
      }
    })
  ]
};
