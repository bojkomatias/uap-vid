/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    output: 'standalone',
    experimental: {
        appDir: true,
        typedRoutes: true,
    },
}
