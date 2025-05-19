import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import stylisticJs from '@stylistic/eslint-plugin-js';

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ...react.configs.flat.recommended,
    plugins: { js, "@stylistic/js": stylisticJs, react },
    extends: ["js/recommended"],
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/semi': 'error',
      'no-console': 'warn',
    },  
  },
  { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: globals.browser } },
]);
