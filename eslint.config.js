import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import pluginNode from 'eslint-plugin-node';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
      node: pluginNode,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'node/no-unsupported-features/es-syntax': 'off',
      'node/no-missing-import': 'off',
    },
  },
  {
    ignores: ['node_modules', 'dist'],
  },
];
