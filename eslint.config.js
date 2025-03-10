import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier";
import * as reactHooks from 'eslint-plugin-react-hooks';


export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs['recommended-latest'],
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      'react-hooks/exhaustive-deps': 'warn',
    }
  },
];