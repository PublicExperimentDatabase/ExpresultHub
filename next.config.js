/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/experiments",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
