import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [js.configs.recommended, pluginReact.configs.flat.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { reactHooks, reactRefresh },
    extends: [
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    rules: {},
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { tsPlugin },
    languageOptions: {
      parser: "@typescript-eslint/parser",
      globals: globals.node,
    },
    rules: { ...tsPlugin.configs.recommended.rules },
  },
]);
// npm install --save-dev eslint @eslint/js eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh @typescript-eslint/eslint-plugin @typescript-eslint/parser globals
