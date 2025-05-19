import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import stylisticJs from '@stylistic/eslint-plugin-js';


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js, "@stylistic/js": stylisticJs },
    extends: ["js/recommended"],
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/semi': 'error',
      'no-console': 'warn',
    },  
  },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
]);
