module.exports = function override(config, env) {
  // Production optimizations
  if (env === 'production') {
    // Minimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Separate vendor bundles
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
          // React and React-DOM in separate bundle
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-vendor',
            priority: 20,
          },
          // Firebase in separate bundle
          firebase: {
            test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
            name: 'firebase-vendor',
            priority: 15,
          },
          // Common code
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
      // Minimize runtime chunk
      runtimeChunk: {
        name: 'runtime',
      },
    };

    // Remove console.logs in production
    config.optimization.minimizer[0].options.terserOptions.compress = {
      ...config.optimization.minimizer[0].options.terserOptions.compress,
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.info', 'console.debug'],
    };
  }

  return config;
};
