// Usage examples:
// ./node_modules/.bin/eslint srv
// ./node_modules/.bin/eslint --fix srv
// ./node_modules/.bin/eslint --print-config srv | less

module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true
  },
  'extends': ['airbnb-base'],
  'rules': {
    'arrow-parens': ['off'],
    'comma-dangle': ['warn', 'always-multiline'],
    'consistent-return': ['off'],
    'indent': ['error', 2, {'SwitchCase': 1}],
    'max-len': ['error', {'ignoreUrls': true, 'code': 120}],
    'no-shadow': ['off'],
    'no-use-before-define': ['off'],
    'object-curly-spacing': ['error', 'never'],
    'object-shorthand': ['off'],
    'prefer-const': ['off'],
    'yoda': ['error', 'always', {'exceptRange': true, 'onlyEquality': true}],
  }
};
