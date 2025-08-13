module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Suppress source map warnings for posthog-js
      webpackConfig.ignoreWarnings = [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource &&
            warning.module.resource.includes('node_modules/posthog-js') &&
            warning.details &&
            warning.details.includes('source map')
          );
        },
      ];

      return webpackConfig;
    },
  },
};
