module.exports = {
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  env: {
    browser: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  rules: {
    indent: ['error', 2],
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': ['warn'],
    // '@typescript-eslint/interface-name-prefix': 'warn',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    // 'no-console': 'error',
    'max-len': ['error', { code: 2250 }],
    'comma-dangle': ['error', 'always-multiline'],
    'semi': [2, 'never'],
    'arrow-parens': ['error', 'always'],
    'no-new-object': 'error',
    'no-array-constructor': 'error',
    "import/no-duplicates": ["off", {"considerQueryString": true}],
    'no-useless-catch': 0,
    // 'sort-imports': [
    //   2,
    //   {
    //     ignoreCase: false,
    //     ignoreMemberSort: false,
    //     memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
    //   },
    // ],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'dot-notation': 0,
    'standard/no-callback-literal': 0,
    'no-multi-spaces': 0,
    'no-undef': 0,
    'camelcase': 0,
    'lines-between-class-members': 0,
    'no-unneeded-ternary': 0,
  },
  settings: {
    "import/resolver": { "typescript": "./front/tsconfig.json" }
  }
}
