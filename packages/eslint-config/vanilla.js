/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  rules: {
    '@typescript-eslint/no-redeclare': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'prettier/prettier': 'warn',
  },
  ignorePatterns: 'dist',
};
