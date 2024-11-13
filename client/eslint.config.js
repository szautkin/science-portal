import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      ...reactPlugin.configs['recommended'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: 'React',
        },
      ],
      'react/react-in-jsx-scope': 'off',
      // Explicitly set the no-console rule
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // You can add more custom rules here
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettierConfig,
];
