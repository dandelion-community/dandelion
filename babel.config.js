module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      'inline-dotenv',
      [
        'module-resolver',
        {
          alias: {
            ['aid-app']: './src/client/aid-app',
            ['general-purpose']: './src/client/general-purpose',
          },
          root: './src',
        },
      ],
    ],
    presets: ['babel-preset-expo'],
  };
};
