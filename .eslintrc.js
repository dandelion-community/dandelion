module.exports = {
  env: {
    jest: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@chloe-47/eslint-plugin-no-set-timeout',
    '@typescript-eslint',
    'prettier',
    'react',
    'sort-keys-fix',
  ],
  root: true,
  rules: {
    '@chloe-47/no-set-timeout/no-set-timeout': ['warn'],
    '@typescript-eslint/no-namespace': ['off'],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prettier/prettier': ['error'],
    'react/jsx-no-duplicate-props': ['error'],
    'react/jsx-no-undef': ['error'],
    'react/jsx-pascal-case': ['error'],
    'react/jsx-sort-props': ['error'],
    'react/no-array-index-key': ['error'],
    'react/no-children-prop': ['error'],
    'sort-keys-fix/sort-keys-fix': ['error'],
  },
};
