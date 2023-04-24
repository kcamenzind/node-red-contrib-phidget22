/* eslint-env node */

module.exports = {
  root: true,
  extends: 'eslint:recommended',
  env: {
    es2017: true,
    node: true,
    browser: true,
    jquery: true
  },
  parserOptions: {
    ecmaVersion: "2019"
  },
  rules: {
    "no-unused-vars": 1
  }
}
