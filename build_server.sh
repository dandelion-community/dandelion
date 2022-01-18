rm -rf server-build
npx babel src -d server-build \
  -x ".ts,.tsx,.js" \
  --ignore "src/client/**" \
  --presets "@babel/preset-typescript"

cp \
  src/server/collections/user/root_fields/attribution/attribution-config.json \
  server-build/server/collections/user/root_fields/attribution