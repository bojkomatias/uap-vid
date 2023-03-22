/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    output: 'standalone',
    experimental: {
        appDir: true,
    },
    images: {
        domains: ['images.unsplash.com'],
    },
}
