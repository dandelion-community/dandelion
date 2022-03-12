module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      'inline-dotenv',
      '@babel/proposal-numeric-separator',
      [
        'module-resolver',
        {
          alias: {
            src: './src',
          },
        },
      ],
    ],
    presets: ['babel-preset-expo'],
  };
};
