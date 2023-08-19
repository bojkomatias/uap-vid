const colors = require('tailwindcss/colors')

module.exports = {
    presets: [require('tailwindcss/defaultConfig')],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        fontFamily: {
            sans: ['var(--font-sans)'],
        },
        colors: {
            current: 'currentColor',
            base: colors.neutral,
            primary: {
                DEFAULT: '#003C71',
                // Generated with uicolors.app ... we are the darkest one
                '50': '#e9fcff',
                '100': '#cef7ff',
                '200': '#a7f3ff',
                '300': '#6bf0ff',
                '400': '#26e0ff',
                '500': '#00beff',
                '600': '#0094ff',
                '700': '#0079ff',
                '800': '#0068e6',
                '900': '#005cb3',
                '950': '#003c71',
            },
            gray: colors.gray,
            white: colors.white,
            black: colors.black,
            error: colors.rose,
            success: colors.teal,
            warning: colors.amber
        },
        extend: {
            borderRadius: { DEFAULT: '0.5rem' },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        // ...
    ],
}
