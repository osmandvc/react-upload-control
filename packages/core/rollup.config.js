import path from "path";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { babel } from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";

const external = ["react", "react-dom", "react/jsx-runtime", "sonner"];

const typescriptPlugin = typescript({
  tsconfig: "./tsconfig.json",
  declaration: true,
  declarationDir: "./dist",
  rootDir: "./src",
  exclude: ["**/__tests__", "**/*.test.ts", "**/*.test.tsx", "node_modules"],
  sourceMap: false,
});

export default {
  input: path.resolve(__dirname, "src/index.ts"),
  output: [
    {
      dir: path.resolve(__dirname, "dist"),
      format: "esm",
      sourcemap: false,
      exports: "named",
    },
  ],
  external,
  plugins: [
    resolve({
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      preferBuiltins: true,
      dedupe: ["react", "react-dom"],
    }),
    commonjs(),
    typescriptPlugin,
    babel({
      babelHelpers: "bundled",
      exclude: /node_modules/,
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
    }),
    json(),
    terser(),
  ],
};
