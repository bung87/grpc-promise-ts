import builtins from "rollup-plugin-node-builtins";
import commonjs from "@rollup/plugin-commonjs";
import globals from "rollup-plugin-node-globals";
import json from "@rollup/plugin-json";
import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.module,
      format: "umd",
      name: "grpc-promise-ts",
      sourcemap: "inline",
      globals: { grpc: "grpc" },
    },
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript(),
    builtins(),
    globals({
      process: false, // build fails when true
      global: false,
      buffer: false,
      dirname: false,
      filename: false,
      baseDir: true,
    }),
    resolve({ mainFields: ["jsnext", "module", "main"] }),
    commonjs(),
    json(),
  ],
  external: [...Object.keys(pkg.dependencies || {})],
};
