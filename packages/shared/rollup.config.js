import path from "path";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { babel } from "@rollup/plugin-babel";

import pkg from "./package.json";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: path.resolve(__dirname, "dist/index.esm.js"),
      format: "esm",
    },
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    resolve({
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      exclude: [
        "**/__tests__",
        "**/*.test.ts",
        "**/*.test.tsx",
      ],
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    }),
    terser(),
  ],
};
