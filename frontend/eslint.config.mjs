import js from '@eslint/js';
import globals from 'globals';
import expoConfig from 'eslint-config-expo';
import reactEslint from 'eslint-plugin-react';
import reactNativeEslint from 'eslint-plugin-react-native';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';


export default tseslint.config(
  { ignores: ['dist'] },
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
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
);
