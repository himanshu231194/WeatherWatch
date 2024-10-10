module.exports = {
    env: {
      browser: true,
      es6: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
      // Add your custom rules here
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      // More rules can be added based on your preferences
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };
  