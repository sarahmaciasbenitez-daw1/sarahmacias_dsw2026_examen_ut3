import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended, // reglas recomendadas para JS
  ...tseslint.configs.recommended, // reglas recomendadas para TS
  {
    files: ['src/**/*.ts'], // + globals de Node para tu código
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
  },
];
