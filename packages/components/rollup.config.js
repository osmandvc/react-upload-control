import path from "path";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { babel } from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import json from "@rollup/plugin-json";

import pkg from "./package.json";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: path.resolve(__dirname, "dist/index.esm.js"),
      format: "esm",
    },
  ],
  external: [...Object.keys(pkg.peerDependencies), "react/jsx-runtime"],
  plugins: [
    resolve({
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    }),
    commonjs(),
    typescript(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    }),
    postcss({
      config: {
        path: "./postcss.config.js",
      },
      extensions: [".css"],
      minimize: true,
      inject: {
        insertAt: "top",
      },
    }),
    json(),
    terser(),
  ],
};
