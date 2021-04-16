module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      { patterns: ['@server/*', '**/server/**'] },
    ],
  },
};
