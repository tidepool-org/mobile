module.exports = function(api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { lazyImports: true }]],
    plugins: ["transform-inline-environment-variables"],
  };
};
