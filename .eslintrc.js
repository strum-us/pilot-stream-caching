module.exports = {
  extends: ['standard', 'plugin:react/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'graphql',
  ],
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      version: 'detect',
    },
  },
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
    'react/display-name': 0,
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': ['warn'],
    'jsx-quotes': ['error', 'prefer-single'],
    // '@typescript-eslint/interface-name-prefix': 'warn',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    // 'no-console': 'error',

    // note you must disable the base rule as it can report incorrect errors
    'no-use-before-define': 'off',
    // '@typescript-eslint/no-use-before-define': ['warn'],
    'import/no-duplicates': ['error', { considerQueryString: true }],

    'react/jsx-uses-vars': [2],
    'max-len': ['error', { code: 5250 }],
    'comma-dangle': ['error', 'always-multiline'],
    semi: [2, 'never'],
    'arrow-parens': ['error', 'always'],
    'no-new-object': 'error',
    'no-array-constructor': 'error',
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
    'react/prop-types': 0,
    'react/no-find-dom-node': 0,
    'react/no-children-prop': 0,
    'dot-notation': 0,
    'standard/no-callback-literal': 0,
    'no-multi-spaces': 0,
    'no-undef': 0,
    camelcase: 0,
    'lines-between-class-members': 0,
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-max-props-per-line': [
      'error',
      {
        maximum: 1,
        when: 'multiline',
      },
    ],
    'no-unneeded-ternary': 0,
    // react hooks
    'react-hooks/rules-of-hooks': 'warn', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
  },
}
