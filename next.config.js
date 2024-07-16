/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    output: 'standalone',
    webpack: (config) => {
        let modularizeImports = null
        config.module.rules.some((rule) =>
            rule.oneOf?.some((oneOf) => {
                modularizeImports =
                    oneOf?.use?.options?.nextConfig?.modularizeImports
                return modularizeImports
            })
        )
        if (modularizeImports?.['@headlessui/react'])
            delete modularizeImports['@headlessui/react']
        return config
    },
}
