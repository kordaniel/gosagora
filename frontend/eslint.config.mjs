import js from '@eslint/js';
import globals from 'globals';
import expoConfig from 'eslint-config-expo';
import reactEslint from 'eslint-plugin-react';
import reactNativeEslint from 'eslint-plugin-react-native';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import jestPlugin from 'eslint-plugin-jest';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'coverage'
    ]
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...jestPlugin.environments.globals.globals,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'expo': expoConfig,
      'react': reactEslint,
      'react-native': reactNativeEslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic': stylistic,
      'jest': jestPlugin,
    },
    rules: {
      ...reactEslint.configs.recommended.rules,
      ...reactNativeEslint.rulesConfig,
      ...reactHooks.configs.recommended.rules,
      '@stylistic/semi': 'error',
      '@stylistic/object-curly-spacing': [
        'error',
        'always',
      ],
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 'argsIgnorePattern': '^_' }
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react-native/no-unused-styles': 2,
      'react-native/split-platform-components': 2,
      'react-native/sort-styles': ['warn', 'asc', {
        'ignoreClassNames': false,
        'ignoreStyleProperties': false
      }],
      'sort-imports': ['warn', {
        'ignoreCase': false,
        'ignoreDeclarationSort': false,
        'ignoreMemberSort': false,
        'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single'],
        'allowSeparatedGroups': true
      }],
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
);
