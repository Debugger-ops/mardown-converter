module.exports = {
  webpack: (config) => {
    config.snapshot = {
      managedPaths: [
        /node_modules\/@next\/swc-.*/,
      ],
    };
    return config;
  },
};
