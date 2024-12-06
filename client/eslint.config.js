import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jestPlugin from 'eslint-plugin-jest';
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
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: 'React' },
      ],
      'react/react-in-jsx-scope': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.test.{js,ts,jsx,tsx}', '**/__tests__/**/*.{js,ts,jsx,tsx}'],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      // Manually integrate Jest recommended rules
      'jest/consistent-test-it': 'error',
      'jest/expect-expect': 'warn',
      'jest/no-alias-methods': 'warn',
      'jest/no-commented-out-tests': 'warn',
      'jest/no-conditional-expect': 'error',
      'jest/no-deprecated-functions': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-done-callback': 'error',
      'jest/no-duplicate-hooks': 'error',
      'jest/no-export': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-hooks': 'off',
      'jest/no-identical-title': 'error',
      'jest/no-interpolation-in-snapshots': 'error',
      'jest/no-jasmine-globals': 'error',
      'jest/no-mocks-import': 'error',
      'jest/no-restricted-matchers': 'off',
      'jest/no-standalone-expect': 'error',
      'jest/no-test-prefixes': 'error',
      'jest/no-test-return-statement': 'error',
      'jest/prefer-called-with': 'warn',
      'jest/prefer-comparison-matcher': 'error',
      'jest/prefer-each': 'warn',
      'jest/prefer-equality-matcher': 'error',
      'jest/prefer-expect-assertions': 'off',
      'jest/prefer-hooks-in-order': 'error',
      'jest/prefer-hooks-on-top': 'error',
      'jest/prefer-lowercase-title': 'off',
      'jest/prefer-snapshot-hint': 'warn',
      'jest/prefer-spy-on': 'warn',
      'jest/prefer-strict-equal': 'off',
      'jest/prefer-to-be': 'warn',
      'jest/prefer-to-contain': 'warn',
      'jest/prefer-to-have-length': 'warn',
      'jest/prefer-todo': 'warn',
      'jest/require-hook': 'off',
      'jest/require-to-throw-message': 'off',
      'jest/require-top-level-describe': 'off',
      'jest/unbound-method': 'error',
      'jest/valid-describe-callback': 'error',
      'jest/valid-expect': 'error',
      'jest/valid-expect-in-promise': 'warn',
      'jest/valid-title': 'warn',
    },
  },
  prettierConfig,
];
