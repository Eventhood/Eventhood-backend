module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  ignorePatterns: ['src/documentation.html'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {},
};
