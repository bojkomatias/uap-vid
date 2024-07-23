/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = [...config.externals, 'socket.io-client']
    }
    return config
  },
}
