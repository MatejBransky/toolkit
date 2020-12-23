/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'react-app',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: 'latest',
    },
  },
};
