module.exports = {
  source: ['src/design-tokens.json'],
  platforms: {
    tailwind: {
      transformGroup: 'js',
      buildPath: 'src/design-tokens/build/',
      files: [
        {
          destination: 'tailwind-tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
  },
};
