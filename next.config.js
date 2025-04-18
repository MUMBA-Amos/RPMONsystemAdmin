/** @type {import('next').NextConfig} */

const isStandalone = process.env.BUILD_STANDALONE === 'true';

const nextConfig = {
  reactStrictMode: true,
  ssr: false,
  output: isStandalone ? 'standalone' : undefined,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true,
    domains: [
      'devsb-space.sgp1.digitaloceanspaces.com',
      'msgold.sgp1.digitaloceanspaces.com',
      'msgold.sgp1.cdn.digitaloceanspaces.com',
      'sgp1.digitaloceanspaces.com',
      'msgold.sgp1.digitaloceanspaces.com',
      'placehold.co'
    ]
  },
  webpack(config, options) {
    const { isServer } = options;
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false
          }
        }
      ]
    });

    return config;
  }
};

module.exports = nextConfig;
