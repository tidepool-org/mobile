module.exports = function(api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { lazyImports: true }]],
    plugins: [
      [
        "transform-inline-environment-variables",
        {
          include: ["ROLLBAR_POST_CLIENT_TOKEN"],
        },
      ],
    ],
  };
};
