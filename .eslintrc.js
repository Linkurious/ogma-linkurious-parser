module.exports = {
  'parser': '@typescript-eslint/parser',
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  'parserOptions': {
    'ecmaVersion': 2017,
    'sourceType': 'module',
    'project': './tsconfig.linter.json'
  },
  'rules': {
    'eqeqeq': ['error'], // Requires === or !== in place of == or !=
    //'@typescript-eslint/no-explicit-any': ['error'], // Don't allow any usage of 'any'
    '@typescript-eslint/no-empty-interface': ['off'], // Allows empty interfaces
    'object-shorthand': ['error', 'never'], // Disallows shorthand object literal
    '@typescript-eslint/ban-ts-ignore': ['off'], // Allows @ts-ignore
    '@typescript-eslint/interface-name-prefix': ['off'], // Allows interfaces prefixed with I
    '@typescript-eslint/no-non-null-assertion': ['off'], // Allows non-null assertion
    '@typescript-eslint/no-empty-function': ['off'], // Allows empty functions
    '@typescript-eslint/require-await': ['off'], // Allows async without await
    'import/no-unresolved': ['off'], // Disable non working rule
    'import/order': ['error', {'newlines-between': 'always'}], // Orders imports by ['builtin', 'external', 'parent', 'sibling', 'index']
    '@typescript-eslint/no-misused-promises': ['error'],

    // Shared specific
    '@typescript-eslint/unbound-method': ['off'],

    // Downgraded to warnings
    'prefer-rest-params': ['warn'],
    'no-constant-condition': ['warn'],
    'no-useless-escape': ['warn'],
    'no-case-declarations': ['warn'],
    '@typescript-eslint/adjacent-overload-signatures': ['warn'],
    '@typescript-eslint/consistent-type-assertions': ['warn'],
    '@typescript-eslint/no-use-before-define': ['warn'],
    '@typescript-eslint/prefer-regexp-exec': ['warn'],
    '@typescript-eslint/prefer-string-starts-ends-with': ['warn'],

    // TODO remove both from downgraded to warnings
    '@typescript-eslint/no-explicit-any': ['warn']
  }
};
