// This file configures ESLint for this project
module.exports = {
  // Enables the recommended rules from the eslint:recommended config
  root: true,
  // Specifies the environment this code will run in
  env: {
    browser: true, // Enables browser-specific globals
    es2020: true,  // Enables support for ECMAScript 2020 features
  },
  // Extends configurations from other ESLint plugins
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  // List of files/folders to ignore during linting
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  // Instructs ESLint to use the TypeScript parser
  parser: '@typescript-eslint/parser',
  // Enables additional ESLint plugins
  plugins: ['react-refresh'],
  // Configures rules specific to this project
  rules: {
    'react-refresh/only-export-components': [  // Rule from react-refresh plugin
      'warn',  // Sets severity level to warn (default is error)
      { allowConstantExport: true },  // Allows exporting constants with react-refresh
    ],
  },
};
