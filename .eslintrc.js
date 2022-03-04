const { readGitignoreFiles } = require("eslint-gitignore");

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
  },
  extends: ["@nuxtjs", "plugin:nuxt/recommended", "prettier"],
  plugins: [],
  ignorePatterns: readGitignoreFiles({ cwd: __dirname }),
  // add your custom rules here
  rules: {
    "no-undef": 0,
    "no-unused-vars": 0,
    "import/first": 0,
    "no-console": 0,
    "vue/no-v-html": 0,
    "comma-dangle": ["error", "always-multiline"],
    "vue/multi-word-component-names": "off",
  },
};
