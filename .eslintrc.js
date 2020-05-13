module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:lit/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'lit'],
  rules: {
    'object-curly-spacing': ['error', 'always'],
    'dot-location': ['error', 'property'],
  },
};
