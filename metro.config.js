const { getDefaultConfig } = require('@expo/metro-config');
const config = getDefaultConfig(__dirname);

// For @apollo/client
// See https://github.com/apollographql/apollo-client/pull/9084/files
config.resolver.sourceExts.push('cjs');

module.exports = config;
