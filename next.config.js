/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    output: 'standalone',
    experimental: {
        serverActions: true,
        appDir: true,
    },
    images: {
        domains: ['images.unsplash.com'],
    },
}
