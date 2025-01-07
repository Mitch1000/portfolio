module.exports = {
  root: true, // doesn't look beyond the project for eslint rules.:
  env: {
    browser: true,
  },
  extends: [
    'airbnb-base', // https://github.com/airbnb/javascript
    'plugin:vue/recommended', // or 'plugin:vue/base'
  ],
  // add your custom rules here
  rules: {
    // 0 === off; 1 === warning; 2 === error
    'curly': [1, 'all'],
    'no-alert': 1,
    'no-console': 1,
    'no-debugger': 1,
    'quote-props': [2, 'consistent'],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // ignore for vuex mutations
      ],
    }],
    'vue/order-in-components': ['error', {
      'order': [
        'el',
        'name',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'data',
        'computed',
        'watch',
        'LIFECYCLE_HOOKS',
        'methods',
        ['template', 'render'],
        'renderError',
      ],
    }],
  },
};
