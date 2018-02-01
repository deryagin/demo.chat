// Usage examples:
// ./node_modules/.bin/eslint srv
// ./node_modules/.bin/eslint --fix srv
// ./node_modules/.bin/eslint --print-config srv | less

module.exports = {
  'env': {'browser': true},
  'plugins': ['es5'],
  'extends': ['eslint:recommended'],
  'globals': {'document': true, 'angular': true},
  'rules': {
    'comma-dangle': ['warn', 'always-multiline'],
    'consistent-return': ['off'],
    'indent': ['error', 2, {'SwitchCase': 1}],
    'max-len': ['error', {'ignoreUrls': true, 'code': 120}],
    'no-shadow': ['off'],
    'no-undef': ['warn'],
    'no-underscore-dangle': ["error", {"allowAfterThis": true}],
    'no-use-before-define': ['off'],
    'object-curly-spacing': ['error', 'never'],
    'object-shorthand': ['off'],
    'yoda': ['error', 'always', {'exceptRange': true, 'onlyEquality': true}],
  }
};
