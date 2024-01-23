/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import packageJson from "./package.json";

const getPackageName = () => {
  return packageJson.name;
};

const getPackageNamePascalCase = () => {
  try {
    return getPackageName().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  } catch (err) {
    throw new Error("Name property in package.json is missing.");
  }
};

const fileName = {
  es: `${getPackageName()}.mjs`,
  cjs: `${getPackageName()}.cjs`,
  iife: `${getPackageName()}.iife.js`,
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

module.exports = defineConfig({
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/litewave.ts"),
      name: getPackageNamePascalCase(),
      formats,
      fileName: (format) => fileName[format],
    },
  },
  test: {

  }
});
