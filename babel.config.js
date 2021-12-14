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
            ['general-purpose']: './client/general-purpose',
          },
        },
      ],
    ],
    presets: ['babel-preset-expo'],
  };
};
