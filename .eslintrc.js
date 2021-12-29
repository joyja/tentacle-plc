module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 2017,
  },
  extends: ['plugin:prettier/recommended', 'prettier'],
  plugins: [],
  // add your custom rules here
  rules: {},
}
