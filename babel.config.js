module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      'inline-dotenv',
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
