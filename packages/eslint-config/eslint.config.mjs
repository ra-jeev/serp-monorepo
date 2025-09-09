import { createConfigForNuxt } from '@nuxt/eslint-config';

export default createConfigForNuxt({
  features: {
    typescript: {
      strict: true,
    },
    stylistic: {
      braceStyle: '1tbs',
      arrowParens: true,
      semi: true,
    },
  },
}, { ignores: ['templates'] }).overrideRules({
  'vue/multi-word-component-names': 'off',
  'vue/max-attributes-per-line': ['error', { singleline: 5 }],
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
});
